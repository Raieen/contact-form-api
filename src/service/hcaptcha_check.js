export async function isValidToken (token) {
  // eslint-disable-next-line no-undef
  const res = await fetch(new Request(`${captchaVerifyUrl}?secret=${captchaSecret}&sitekey=${captchaSiteKey}&response=${token}`, {
    method: 'POST'
  }))

  const jsonResponse = await res.json()
  return jsonResponse.success
}
