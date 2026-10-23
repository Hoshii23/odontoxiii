-- Bootstrap for a NEW, dedicated Supabase project. Review before deployment.
-- Existing projects must be inspected; do not overwrite unrelated tables.
begin;
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create function private.study_session_active() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from auth.sessions s
    where s.id = nullif(auth.jwt()->>'session_id','')::uuid
      and s.user_id = auth.uid() and (s.not_after is null or s.not_after>now()));
$$;
revoke all on function private.study_session_active() from public, anon;
grant execute on function private.study_session_active() to authenticated;

create table public.study_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  terms_version text not null check (terms_version = '2026-10-23'),
  privacy_version text not null check (privacy_version = '2026-10-23'),
  adult_attested boolean not null check (adult_attested),
  accepted_at timestamptz not null default now()
);
alter table public.study_profiles enable row level security;
revoke all on public.study_profiles from anon, authenticated;
grant select, insert (user_id, terms_version, privacy_version, adult_attested),
  update (terms_version, privacy_version, adult_attested) on public.study_profiles to authenticated;
create policy profile_read on public.study_profiles for select to authenticated
  using (user_id=(select auth.uid()) and (select private.study_session_active()));
create policy profile_create on public.study_profiles for insert to authenticated
  with check (user_id=(select auth.uid()) and (select private.study_session_active()));
create policy profile_update on public.study_profiles for update to authenticated
  using (user_id=(select auth.uid()) and (select private.study_session_active()))
  with check (user_id=(select auth.uid()) and (select private.study_session_active()));

create table public.study_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 120),
  body text not null check (char_length(btrim(body)) between 1 and 100000),
  subject text not null default '' check (char_length(subject)<=80),
  kind text not null default 'nota' check (kind in ('nota','caso_ficticio')),
  source_key text check (char_length(source_key)<=150),
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id,source_key)
);
create index study_notes_owner_updated on public.study_notes(user_id,updated_at desc);
alter table public.study_notes enable row level security;
revoke all on public.study_notes from anon, authenticated;
grant select, delete on public.study_notes to authenticated;
grant insert(user_id,title,body,subject,kind,source_key),
  update(title,body,subject,kind) on public.study_notes to authenticated;
create policy notes_read on public.study_notes for select to authenticated
  using (user_id=(select auth.uid()) and (select private.study_session_active()));
create policy notes_delete on public.study_notes for delete to authenticated
  using (user_id=(select auth.uid()) and (select private.study_session_active()));
create policy notes_create on public.study_notes for insert to authenticated
  with check (user_id=(select auth.uid()) and (select private.study_session_active())
    and exists(select 1 from public.study_profiles p where p.user_id=(select auth.uid())));
create policy notes_update on public.study_notes for update to authenticated
  using (user_id=(select auth.uid()) and (select private.study_session_active()))
  with check (user_id=(select auth.uid()) and (select private.study_session_active())
    and exists(select 1 from public.study_profiles p where p.user_id=(select auth.uid())));

create function private.study_note_guard() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  if tg_op='INSERT' then
    perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(new.user_id::text,0));
    -- Duplicate imports should be harmless even at the storage limit.
    if new.source_key is not null and exists(select 1 from public.study_notes
      where user_id=new.user_id and source_key=new.source_key) then return null; end if;
    if (select count(*) from public.study_notes where user_id=new.user_id)>=500 then
      raise exception 'ODONTO:Limite de 500 anotações. Exporte e remova algumas antes de continuar.';
    end if;
    new.created_at=now();new.updated_at=now();new.version=1;
  else new.updated_at=clock_timestamp();new.version=old.version+1;
  end if;
  return new;
end;
$$;
revoke all on function private.study_note_guard() from public, anon, authenticated;
create trigger study_note_guard before insert or update on public.study_notes
  for each row execute function private.study_note_guard();

create table private.study_ai_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null,
  attempts integer not null default 0,
  primary key(user_id,day)
);
alter table private.study_ai_usage enable row level security;
revoke all on private.study_ai_usage from public, anon, authenticated;

-- A bounded atomic counter is privileged so clients cannot reset their quota.
-- No caller-supplied owner, no dynamic SQL, fixed search path, explicit session check.
create function private.consume_study_ai_quota() returns boolean
language plpgsql security definer set search_path = '' as $$
declare owner_id uuid=auth.uid(); used integer; total integer;
begin
  if owner_id is null or not private.study_session_active() then return false; end if;
  if not exists(select 1 from public.study_profiles p where p.user_id=owner_id
    and p.terms_version='2026-10-23' and p.privacy_version='2026-10-23' and p.adult_attested) then return false; end if;
  perform pg_catalog.pg_advisory_xact_lock(71320261023);
  delete from private.study_ai_usage where day<current_date-7;
  select coalesce(sum(attempts),0) into total from private.study_ai_usage where day=current_date;
  select attempts into used from private.study_ai_usage where user_id=owner_id and day=current_date;
  if coalesce(used,0)>=20 or total>=200 then return false; end if;
  insert into private.study_ai_usage(user_id,day,attempts) values(owner_id,current_date,1)
    on conflict(user_id,day) do update set attempts=private.study_ai_usage.attempts+1;
  return true;
end;
$$;
revoke all on function private.consume_study_ai_quota() from public, anon;
grant execute on function private.consume_study_ai_quota() to authenticated;
create function public.consume_study_ai_quota() returns boolean
language sql security invoker set search_path = '' as $$
  select private.consume_study_ai_quota();
$$;
revoke all on function public.consume_study_ai_quota() from public, anon;
grant execute on function public.consume_study_ai_quota() to authenticated;

create function public.study_session_active() returns boolean
language sql stable security invoker set search_path = '' as $$
  select private.study_session_active();
$$;
revoke all on function public.study_session_active() from public, anon;
grant execute on function public.study_session_active() to authenticated;
commit;
