# Two-step website lead flow

The website now captures an enquiry before asking for OTP verification.

1. The visitor submits name, phone, project, city, and an optional message.
2. The browser inserts one `unverified` lead with CRM status `not_sent`.
3. The OTP is sent automatically.
4. The server verifies the OTP with MSG91, validates that the phone belongs to the captured lead, and marks it `verified`.
5. Only then does the server post the lead to the configured CRM webhook. Brochures are released only after this successful verification step.

The admin Leads page separates verified and unverified records. Any filtered list, including unverified leads, can be downloaded as CSV for manual follow-up.

## Deployment

Run `backend/sql/14_lead_verification_crm.sql` in the Supabase SQL Editor after the existing lead setup migrations.

Configure these server-only environment variables in Netlify:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `MSG91_AUTH_KEY`
- `MSG91_TEMPLATE_ID`
- `CRM_WEBHOOK_URL`
- `CRM_WEBHOOK_AUTH_TOKEN` (optional)

Never expose the service-role key, MSG91 key, or CRM token through a `VITE_` variable.

## CRM webhook contract

The webhook receives `POST` requests with JSON shaped as follows:

```json
{
  "event": "lead.verified",
  "lead": {
    "id": "uuid",
    "name": "Visitor name",
    "phone": "+919999999999",
    "email": null,
    "project": "Project name",
    "city": "Kolkata",
    "message": "Optional message",
    "source": "Website form source",
    "project_slug": "project-slug",
    "lead_action": "callback",
    "verified_at": "ISO-8601 timestamp"
  }
}
```

Any 2xx response marks the lead `sent`. A non-2xx response records `failed` and the error in the website database. If no CRM webhook is configured, verified leads remain `pending` and are not sent anywhere.
