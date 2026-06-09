export function requireWebhookSecret(
  secret: string | undefined,
  envName: string
): string | Response {
  if (secret) {
    return secret
  }

  if (process.env.NODE_ENV === 'production') {
    console.error(`${envName} is not configured in production`)
    return new Response(
      JSON.stringify({ error: 'Webhook signing secret is not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  console.warn(
    `${envName} is not configured. Webhook signature verification is disabled.`
  )
  return ''
}
