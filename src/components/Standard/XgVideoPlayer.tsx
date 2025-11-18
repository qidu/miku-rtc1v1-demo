/**
 * @file Xigua Video Player
 * @author chennan <chennan@qiniu.com>
 * @description 西瓜播放器
 * doc: https://v3.h5player.bytedance.com/
 */

import React, { memo, useEffect, useRef } from 'react'
import Player, { IPlayerOptions } from 'xgplayer'
import 'xgplayer/dist/index.min.css'
import HlsJsPlugin from 'xgplayer-hls.js'
import FlvJsPlugin from 'xgplayer-flv.js'

import { VideoFormat } from 'constants/index'

interface XgPlayerOptions extends IPlayerOptions {
  isLive?: boolean
}

interface Props extends Omit<XgPlayerOptions, 'el' | 'plugins'> {
  playId: number
  format?: VideoFormat   // 视频格式，默认为 HLS 流
  className?: string
}

export default memo(function XgPlayer(props: Props) {
  const player = useRef<Player | null>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const { className, ...restProps } = props

  useEffect(() => {
    const { format, ...playerOptions } = restProps
    const el = videoContainerRef.current!
    const options: XgPlayerOptions = { el, ...playerOptions }
    // destroy 后至少要在下个宏任务里执行实例化操作
    setTimeout(() => {
      player.current = createPlayer(options, format)
    }, 0)

    return () => {
      if (player && player.current) {
        destroyPlayer(player.current)
      }
    }
  }, [restProps])

  return <div className={className} ref={videoContainerRef} />
})

function createPlayer(options: XgPlayerOptions, format?: VideoFormat): Player {
  if (!format || format === VideoFormat.HLS) {
    return new Player({
      ...options,
      plugins: [HlsJsPlugin]
    })
  }
  if (format === VideoFormat.FLV) {
    return new Player({
      ...options,
      plugins: [FlvJsPlugin]
    })
  }
  return new Player(options)
}

function destroyPlayer(player: Player) {
  player.destroy()
}
