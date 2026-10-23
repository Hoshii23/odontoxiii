-- Synthetic transactional fixtures; always roll back, no live user data.
begin;
insert into auth.users(id,email) values
 ('00000000-0000-4000-9000-000000000901','rls-a@example.invalid'),
 ('00000000-0000-4000-9000-000000000902','rls-b@example.invalid');
insert into auth.sessions(id,user_id) values
 ('00000000-0000-4000-8000-000000000901','00000000-0000-4000-9000-000000000901'),
 ('00000000-0000-4000-8000-000000000902','00000000-0000-4000-9000-000000000902');
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"00000000-0000-4000-9000-000000000901","role":"authenticated","session_id":"00000000-0000-4000-8000-000000000901"}',true);
insert into public.study_profiles(user_id,terms_version,privacy_version,adult_attested)
 values('00000000-0000-4000-9000-000000000901','2026-10-23','2026-10-23',true);
insert into public.study_notes(user_id,title,body) values
 ('00000000-0000-4000-9000-000000000901','Synthetic A','Private A');
do $$ begin
 if (select count(*) from public.study_notes)<>1 then raise exception 'Owner read failed'; end if;
 begin insert into public.study_notes(user_id,title,body) values('00000000-0000-4000-9000-000000000902','Forged','Denied'); raise exception 'Ownership forged'; exception when insufficient_privilege then null; end;
 begin update public.study_notes set user_id='00000000-0000-4000-9000-000000000902'; raise exception 'Owner reassignment allowed'; exception when insufficient_privilege then null; end;
 begin insert into public.study_notes(user_id,title,body) values('00000000-0000-4000-9000-000000000901','Too long',repeat('a',100001)); raise exception 'Length not enforced'; exception when check_violation then null; end;
 for i in 1..20 loop if not public.consume_study_ai_quota() then raise exception 'Quota premature'; end if; end loop;
 if public.consume_study_ai_quota() then raise exception 'Quota not enforced'; end if;
end $$;
update public.study_notes set body='Changed A';
do $$ begin if (select version from public.study_notes)<>2 then raise exception 'Version trigger failed'; end if; end $$;
select set_config('request.jwt.claims','{"sub":"00000000-0000-4000-9000-000000000902","role":"authenticated","session_id":"00000000-0000-4000-8000-000000000902"}',true);
do $$ declare affected integer; begin
 if (select count(*) from public.study_notes)<>0 then raise exception 'Cross-owner read'; end if;
 if (select count(*) from public.study_profiles)<>0 then raise exception 'Cross-owner profile'; end if;
 update public.study_notes set body='Forged';get diagnostics affected=row_count;if affected<>0 then raise exception 'Cross-owner update'; end if;
 delete from public.study_notes;get diagnostics affected=row_count;if affected<>0 then raise exception 'Cross-owner delete'; end if;
 if public.consume_study_ai_quota() then raise exception 'Quota without accepted profile'; end if;
end $$;
set local role anon;
do $$ begin
 begin perform * from public.study_notes;raise exception 'Anonymous read allowed';exception when insufficient_privilege then null;end;
 begin perform public.consume_study_ai_quota();raise exception 'Anonymous quota allowed';exception when insufficient_privilege then null;end;
end $$;
reset role;
delete from auth.sessions where user_id='00000000-0000-4000-9000-000000000901';
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"00000000-0000-4000-9000-000000000901","role":"authenticated","session_id":"00000000-0000-4000-8000-000000000901"}',true);
do $$ begin
 if (select count(*) from public.study_notes)<>0 or public.study_session_active() then raise exception 'Revoked session still active'; end if;
end $$;
reset role;
delete from auth.users where id='00000000-0000-4000-9000-000000000901';
do $$ begin if exists(select 1 from public.study_notes where user_id='00000000-0000-4000-9000-000000000901') then raise exception 'Cascade failed';end if; end $$;
rollback;
select 'PASS: owner isolation, forgery, reassignment, limits, version, quota, anonymous denial, revocation, cascade; fixtures rolled back' as verification;
