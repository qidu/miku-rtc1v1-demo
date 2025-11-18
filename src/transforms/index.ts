import { VideoFormat } from '../constants'

export function getVideoFormatFromUrl(url: string): VideoFormat | undefined {
  const uri = url.split('?')[0]
  if (uri.substr(uri.length - 4, 4) === 'm3u8') {
    return VideoFormat.HLS
  }
  if (uri.substr(uri.length - 3, 3) === 'flv') {
    return VideoFormat.FLV
  }
  return undefined
}
