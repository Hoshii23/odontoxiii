-- Incremental v12 setup. Existing accounts do not receive implied AI consent.
alter table public.study_profiles
 add column brazil_attested boolean not null default false,
 add column ai_consent_version text check(ai_consent_version is null or ai_consent_version='2026-10-24'),
 add column ai_consent_at timestamptz,
 add constraint study_ai_eligibility check(ai_consent_version is null or (adult_attested and brazil_attested));
grant insert(brazil_attested,ai_consent_version),update(brazil_attested,ai_consent_version)
 on public.study_profiles to authenticated;
create function private.stamp_study_ai_consent() returns trigger
language plpgsql security invoker set search_path='' as $$
begin
 if new.ai_consent_version is null then new.ai_consent_at=null;
 elsif tg_op='INSERT' then new.ai_consent_at=now();
 elsif old.ai_consent_version is distinct from new.ai_consent_version
    or old.brazil_attested is distinct from new.brazil_attested then new.ai_consent_at=now();
 else new.ai_consent_at=old.ai_consent_at;
 end if;
 return new;
end;$$;
revoke all on function private.stamp_study_ai_consent() from public,anon,authenticated;
create trigger study_ai_consent_stamp before insert or update on public.study_profiles
 for each row execute function private.stamp_study_ai_consent();
