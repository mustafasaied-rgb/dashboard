import { messageFromError } from '~/utils/error'

export const useHandleErrorMsg = (err: unknown, opts?: { duration?: number }) => {
  const { $toast } = useNuxtApp()
  const msg = messageFromError(err)
  if (msg === 'An unknown error occurred.') {
    // eslint-disable-next-line no-console
    console.error('Unhandled error shape:', err)
  }
  $toast.error(msg, { duration: opts?.duration ?? 4000 })
  return msg
}
