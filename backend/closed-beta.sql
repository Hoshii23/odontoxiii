-- Incremental feature setup for the existing v9 database. No secrets.
begin;
create table private.study_beta_invites (
  email text primary key check(email=lower(btrim(email)) and email like '%@%.%'),
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);
alter table private.study_beta_invites enable row level security;
revoke all on private.study_beta_invites from public,anon,authenticated;

create function private.study_access_allowed() returns boolean
language sql stable security definer set search_path='' as $$
  select private.study_session_active() and exists(
    select 1 from auth.users u join private.study_beta_invites i on i.email=lower(u.email)
    where u.id=auth.uid() and u.email_confirmed_at is not null and i.enabled);
$$;
revoke all on function private.study_access_allowed() from public,anon;
grant execute on function private.study_access_allowed() to authenticated;
create function public.study_access_allowed() returns boolean
language sql stable security invoker set search_path='' as $$select private.study_access_allowed();$$;
revoke all on function public.study_access_allowed() from public,anon;
grant execute on function public.study_access_allowed() to authenticated;

-- Owners retain read/delete rights after invitation revocation; new writes and AI stop.
alter policy profile_create on public.study_profiles with check
 (user_id=(select auth.uid()) and (select private.study_access_allowed()));
alter policy profile_update on public.study_profiles with check
 (user_id=(select auth.uid()) and (select private.study_access_allowed()));
alter policy notes_create on public.study_notes with check
 (user_id=(select auth.uid()) and (select private.study_access_allowed())
 and exists(select 1 from public.study_profiles p where p.user_id=(select auth.uid())));
alter policy notes_update on public.study_notes with check
 (user_id=(select auth.uid()) and (select private.study_access_allowed())
 and exists(select 1 from public.study_profiles p where p.user_id=(select auth.uid())));

create table private.study_runtime_config (
  singleton boolean primary key default true check(singleton),
  ai_enabled boolean not null default false,
  model text not null default 'gemini-3.6-flash' check(model ~ '^gemini-[a-z0-9.-]+$')
);
insert into private.study_runtime_config(singleton) values(true);
alter table private.study_runtime_config enable row level security;
revoke all on private.study_runtime_config from public,anon,authenticated;
create function private.study_ai_runtime() returns jsonb
language sql stable security definer set search_path='' as $$
 select case when private.study_access_allowed()
 then (select jsonb_build_object('enabled',ai_enabled,'model',model) from private.study_runtime_config where singleton)
 else jsonb_build_object('enabled',false) end;
$$;
revoke all on function private.study_ai_runtime() from public,anon;
grant execute on function private.study_ai_runtime() to authenticated;
create function public.study_ai_runtime() returns jsonb
language sql stable security invoker set search_path='' as $$select private.study_ai_runtime();$$;
revoke all on function public.study_ai_runtime() from public,anon;
grant execute on function public.study_ai_runtime() to authenticated;

-- Prevent uninvited accounts from burning the shared AI quota.
alter function private.consume_study_ai_quota() rename to consume_study_ai_quota_v9;
revoke all on function private.consume_study_ai_quota_v9() from public,anon,authenticated;
create function private.consume_study_ai_quota() returns boolean
language plpgsql security definer set search_path='' as $$
begin
 if not private.study_access_allowed() then return false; end if;
 return private.consume_study_ai_quota_v9();
end;
$$;
revoke all on function private.consume_study_ai_quota() from public,anon;
grant execute on function private.consume_study_ai_quota() to authenticated;
-- Rebind the invoker wrapper after renaming the old function.
create or replace function public.consume_study_ai_quota() returns boolean
language sql security invoker set search_path='' as $$select private.consume_study_ai_quota();$$;
commit;
