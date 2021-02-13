# Runbook

This document lists some problems and solutions.

## Production

### Problem: Error validating captcha

This means there was some problem with validating the given captcha token with HCaptcha's endpoint. Read the error message in Sentry and act accordingly.

This could happen if HCaptcha experiences some downtime. No real solution here, just wait it out and if it doesn't fix itself after some time, raise this.

### Problem: SendGrid error sending email

This means that there was an error sending the email via SendGrid. Read the error message in Sentry and act accordingly.

If we used up all the emails on our Sentry plan, that is a big problem!

### Resetting Cloudflare API Token
- Remove the old token
- Create a new API Token at https://dash.cloudflare.com/profile/api-tokens
- Update all services that used that token

### Finding the Sentry Project ID and Key
- Log into Sentry
- Settings > Client Keys (DSN) and get the key there
- Project Id can be found by clicking on the right project then Issues, the project Id is in the URL at the end, `?project=123`

## Development

### Using wrangler for local development

Type in `wrangler dev` to have a development instance of the Cloudflare Worker running.

The `wrangler.toml` needs to be at the project root and should look something like this:

```toml
name = "contact-form-api"
type = "webpack"
webpack_config = "webpack.config.js"

account_id = ""
workers_dev = true
route = ""
zone_id = ""

vars = { messageMinimumLength = "30", sentryProjectId = "123", sentryKey = "123", version = "0.0.0", toEmail = "example@example.com", captchaVerifyUrl = "https://hcaptcha.com/siteverify", captchaSecret = "0x0000000000000000000000000000000000000000", captchaSiteKey = "10000000-ffff-ffff-ffff-000000000001", sendgridUrl = "https://api.sendgrid.com/v3/mail/send", sendgridKey = "123"}

```

HCaptcha provides dummy secrets used for integration testing. Those dummy secrets can be used for development.
