/* eslint-disable no-undef */

/**
 * Return a UUID
 * See https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
 */
function getEventId () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export async function logSentry (level, message) {
  const jsonBody = JSON.stringify({
    event_id: getEventId(),
    timestamp: Date.now() / 1000,
    tags: {
      version: version,
      environment: 'production',
      level: level
    },
    message: message
  })

  const res = await fetch(new Request(`https://sentry.io/api/${sentryProjectId}/store/`, {
    method: 'POST',
    headers: {
      'X-Sentry-Auth': `Sentry sentry_version=7,sentry_key=${sentryKey},sentry_client=cf-worker-contract-form-api/${version}`,
      'Content-Type': 'application/json'
    },
    body: jsonBody
  }))

  if (res.status !== 200) {
    console.log('Failed to send log to Sentry')
  }
}

export async function debug (message) {
  console.log(message)
}

export async function info (message) {
  await module.exports.logSentry('info', message)
}

export async function error (message) {
  await module.exports.logSentry('error', message)
}

export async function warn (message) {
  await module.exports.logSentry('warn', message)
}

export async function critical (message) {
  await module.exports.logSentry('critical', message)
}
