
export const isHttpsDemo = window.location.protocol === 'https:'

export enum VideoFormat {
  HLS = 'hls',
  FLV = 'flv'
}

export const rtcPlayerDoc = 'https://developer.qiniu.com/mikustream/12972/miku-fast-live-sdk'

export const defaultHlsPlayUrl = 'https://live-mikudemo.cloudvdn.com/mikudemo/timestamps.m3u8'
// export const defaultWhepPlayUrl = 'http://114.230.92.154/sdk-live/minutest000.whep?domain=miku-play.qnsdk.com'
export const defaultWhepPlayUrl = 'https://miku-play-test.qnsdk.com/sdk-live/minutest000.whep'
