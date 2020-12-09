export const CONFIG = {
  Sentry: {
    Dsn: process.env.SENTRY_DSN,
  },
  Bandcamp: {
    AllowedIps: process.env.BANDCAMP_ALLOWED_IPS.split(',').map((s) =>
      s.trim()
    ),
  },
}
