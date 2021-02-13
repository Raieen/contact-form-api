# Contact Form API

This Contact Form API runs on Cloudflare Workers and powers the "Contact Us" form.
- [Architectural Decision Record](docs/adr)
- [RUNBOOK.md](docs/runbook/RUNBOOK.md)

## Usage

### POST https://contact-form-api.something.workers.dev

#### Request Body

Field | Description
--- | ---
captchaToken | Required String, response from HCaptcha
firstName | Required String, first name
lastName | Required String, last name
email | Required String, email
type | Required String, inquiry type chosen from the form
honeypot | Required String, should be empty unless the form was filled in by a bot
message | Required String, message. Must be at least `messageMinimumLength` long.

#### Example Request Body

```
{
    "captchaToken": "...",
    "firstName": "Alice",
    "lastName": "Bob",
    "email": "alice@example.com",
    "type": "General Inquiry",
    "honeypot": "",
    "message": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla fermentum velit ut volutpat placerat."
}
```

### Responses

Status Code | Reason
--- | ---
200 | OK
400 | There's something wrong with the request body, read the reason
405 | Method not allowed
500 | Error checking captcha or sending email, in production this is logged in Sentry
