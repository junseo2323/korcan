import webpush from 'web-push'

let initialized = false

export function getWebPush() {
  if (!initialized) {
    const subject = process.env.VAPID_SUBJECT
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    const privateKey = process.env.VAPID_PRIVATE_KEY
    if (subject && publicKey && privateKey) {
      webpush.setVapidDetails(subject, publicKey, privateKey)
      initialized = true
    }
  }
  return webpush
}
