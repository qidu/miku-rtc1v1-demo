/**
 * @file Qiniu WebRTC Video Player
 * @author chennan <chennan@qiniu.com>
 * @description
 * 七牛低延时 Web SDK，用于 RTC 流播放
 * doc: https://developer.qiniu.com/pili/7730/geek-web-sdk
 */

import React, { useEffect, useRef, useState } from 'react'
import { QNRTPlayer } from 'qn-rtplayer-web'

export interface Props {
  playId: number
  url: string
  className?: string
}

export default function QNRTCPlayer(props: Props) {
  const [player] = useState(() => new QNRTPlayer())
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const { playId, url, className } = props

  useEffect(() => {
    const onError = () => {
      // TODO: toast ?
      // alert(`[QNRTPlayerError_${e.code}]: ${e.msg}`)
    }
    player.on('error', onError)

    return () => {
      player.off('error', onError)
    }
  }, [player])

  useEffect(() => {
    const el = videoContainerRef.current!
    player.init({
      controls: true,
      playsinline: true
    })
    player.play(url, el).catch(e => {
      console.warn('auto play failed:', e)
    })

    return () => {
      player.release()
    }
  }, [playId, url, player])

  return <div className={className} ref={videoContainerRef} />
}
