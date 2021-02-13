module.exports = {
  /**
 * Send email
 * @param {String} fromEmail Form sender email
 * @param {String} fromName Form sender's name
 * @param {String} subject Email Subject
 * @param {String} toEmail Where the email should be sent to
 * @param {String} message Plain text email contents
 */
  sendEmail: async (fromEmail, fromName, subject, toEmail, message) => {
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
        // Set the from field equal to `toEmail` due to this:
        // https://sendgrid.com/docs/ui/sending-email/sender-verification/
        from: {
          email: toEmail
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
}
