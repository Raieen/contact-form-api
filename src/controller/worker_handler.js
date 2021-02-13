/* eslint-disable no-undef */
const captchaCheck = require('../service/hcaptcha_check')
const logger = require('../logger/logger')
const sendgrid = require('../service/sendgrid_send')

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event))
})

/**
 * Validate the request body then check the captcha and send an email
 * based on the form data
 * @param {Event} event
 */
async function handleRequest (event) {
  const jsonBody = await event.request.json()

  if (!jsonBody) {
    logger.debug('Request body is empty')
    return new Response('Malformed Parameters', { status: 400 })
  }

  if (!jsonBody.captchaToken ||
        !jsonBody.firstName ||
        !jsonBody.lastName ||
        !jsonBody.email ||
        !jsonBody.type ||
        !jsonBody.message) {
    logger.debug('Request body is missing required parameters')
    return new Response('Malformed Parameters', { status: 400 })
  }

  // Honeypot should always be null/empty unless it was filled out by a bot
  // since there is an invisible field in the form
  if (jsonBody.honeypot) {
    logger.debug('Honeypot is filled in')
    return new Response('Malformed Parameters', { status: 400 })
  }

  const captchaToken = jsonBody.captchaToken
  const firstName = jsonBody.firstName
  const lastName = jsonBody.lastName
  const email = jsonBody.email
  const type = jsonBody.type
  const message = jsonBody.message

  if (message.length < messageMinimumLength) {
    return new Response('Message is too short!', { status: 400 })
  }

  const validEmail = /\S+@\S+\.\S+/.test(email)
  if (!validEmail) {
    return new Response('Please check your email and try again', { status: 400 })
  }

  let validToken = false

  try {
    validToken = await captchaCheck.isValidToken(captchaToken)
  } catch (error) {
    console.debug(error)
    event.waitUntil(logger.error(`Error validating captcha\n${error}`))
    return new Response(null, {
      status: 500
    })
  }

  if (!validToken) {
    return new Response('Invalid captcha, please try again', { status: 400 })
  }

  try {
    await sendgrid.sendEmail(email, `${firstName} ${lastName}`, `Contact Us: ${type} ${message.substring(0, 16)}`, to_email, message)
  } catch (error) {
    console.debug(error)
    event.waitUntil(logger.error(`Sendgrid error sending email\n${error}`))
    return new Response('Please try again later', {
      status: 500
    })
  }

  return new Response(null)
}
