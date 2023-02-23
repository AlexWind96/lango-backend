import { IncomingHttpHeaders } from 'http'
import { createHash } from 'crypto'

export const getHashedFingerPrint = (
  headers: IncomingHttpHeaders,
  ip: string,
): string => {
  let fingerprint = ip

  //Generate string depending on headers

  for (const property in headers) {
    switch (property) {
      case 'user-agent': {
        fingerprint += headers[property]
        break
      }
      case 'sec-ch-ua': {
        fingerprint += headers[property]
        break
      }
      case 'accept-language': {
        fingerprint += headers[property]
        break
      }
      case 'upgrade-insecure-req': {
        fingerprint += headers[property]
        break
      }
    }
  }
  // Return hashed fingerprint
  return createHash('md5').update(fingerprint).digest('hex')
}
