# Supabase email templates

These HTML files are copies of what's pasted into the Supabase dashboard:
**Authentication → Emails → Templates**. Supabase has no API/CLI way to sync
templates from a repo, so these exist here purely as a durable backup and
reference, not something any build step reads. If a template is ever lost
or needs re-pasting, copy the matching file's content into the matching
template's HTML body field, and the filename's first line (as a comment)
into the Subject field.

Shared design: logo (`https://www.azraa.store/brand/logo-color.png`) at
top, cream (`#f7f2e7`) outer background, white card, black button
(`#0d0c0a` / `#f7f2e7` text) matching the site's own button style, no
em-dashes. The four "action" templates (confirm-signup, reset-password,
magic-link, change-email) have a real confirmation button linking
`{{ .ConfirmationURL }}`. The seven "security notification" templates
(password-changed, email-changed, phone-changed, sign-in-method-linked,
sign-in-method-removed, mfa-added, mfa-removed) are FYI-only, no action
required, linking `{{ .SiteURL }}/account` instead.

Only two of these are wired to anything the app actually does yet
(confirm-signup, reset-password — plus magic-link once that flow is
used). Change-email is used by the Account → Profile change-email form.
The seven security-notification templates are toggled on in Supabase's
Auth → Emails → Security panel but only fire if their underlying event
ever happens (e.g. MFA enrolled) — none of those features are built yet,
so they're currently dormant.
