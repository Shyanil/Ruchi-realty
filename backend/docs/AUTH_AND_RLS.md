# Auth & Row Level Security

## How admin auth works
- Admins log in through **Supabase Auth** (email + password) — the password is
  managed entirely by Supabase, never stored in our tables.
- Each admin has a row in `public.profiles` with `role = 'admin'`.
- The `public.is_admin()` SQL function returns `true` when the current
  `auth.uid()` has an `admin` profile. Every "admin can…" policy calls it.

```sql
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;
```

To add an admin: create the user in **Auth → Users**, then insert/update their
`profiles` row with `role = 'admin'` (the setup script does this by email).

## RLS policy matrix
RLS is **enabled on every table**. `anon` = public visitors (the anon key),
`authenticated` = logged-in users, `admin` = `authenticated` AND `is_admin()`.

| Table           | SELECT (read)                          | INSERT                          | UPDATE      | DELETE      |
|-----------------|----------------------------------------|---------------------------------|-------------|-------------|
| `profiles`      | authenticated                          | (system/setup)                  | —           | —           |
| `projects`      | anon + authenticated                   | admin                           | admin       | admin       |
| `leads`         | admin only                             | **anyone** (anon + auth)        | admin       | admin       |
| `blogs`         | anon + authenticated                   | admin                           | admin       | admin       |
| `blog_comments` | approved rows: anyone · all rows: admin| **anyone**, but only `status='pending'` | admin | admin    |
| `site_settings` | anon + authenticated                   | admin                           | admin       | —           |

### Why these choices
- **Public reads** for `projects`, `blogs`, `site_settings` → the website renders
  for anonymous visitors using the anon key.
- **leads**: anyone can submit (lead forms are public) but only admins can read
  them — visitors can't list other people's enquiries.
- **blog_comments**: visitors can submit (forced `status = 'pending'`) and can only
  read `approved` comments; admins see and moderate everything.
- **Writes** to catalogue/content tables require `is_admin()`, so a leaked anon key
  cannot edit or delete content.

## Security notes
- The **anon key** is meant to be shipped in the browser; RLS is what protects data,
  not the key. Keep RLS enabled.
- The `is_admin()` function is `security definer` so it can read `profiles`
  regardless of the caller's own row visibility.
- Never expose the **service_role** key in client code.
