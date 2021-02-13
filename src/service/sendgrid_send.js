export async function sendEmail (fromEmail, fromName, subject, toEmail, message) {
  // eslint-disable-next-line no-undef
  const res = await fetch(new Request(sendgridUrl, {
    method: 'POST',
    headers: {
      // eslint-disable-next-line no-undef
      Authorization: `Bearer ${sendgridKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [
            {
              email: toEmail
            }
          ]
        }
      ],
      subject: subject,
      content: [
        {
          type: 'text/plain',
          value: message
        }
      ],
      from: {
        email: fromEmail,
        name: fromName
      },
      reply_to: {
        email: fromEmail,
        name: fromName
      }
    })
  }))

  if (res.status !== 202) {
    throw JSON.stringify(await res.json())
  }
}
