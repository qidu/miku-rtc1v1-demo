import { VideoFormat } from '../constants'
import { getVideoFormatFromUrl } from '.'

describe('getVideoTypeFromUrl works correctly', () => {
  it('with given value', () => {
    expect(getVideoFormatFromUrl('http://pili-hls.qnsdk.com/sdk-live/timestamp.m3u8')).toBe(VideoFormat.HLS)
    expect(getVideoFormatFromUrl('http://demo.m3u8?a=b')).toBe(VideoFormat.HLS)
    expect(getVideoFormatFromUrl('http://demo.flv?a=b')).toBe(VideoFormat.FLV)
    expect(getVideoFormatFromUrl('http://demo.mp4?a=b')).toBe(undefined)
  })
})
