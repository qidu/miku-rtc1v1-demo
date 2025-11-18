/**
 * @file WHIP WebRTC Publisher
 * @description WHIP (WebRTC HTTP Ingestion Protocol) 推流组件
 */

import React, { useEffect, useRef, useState } from 'react'

interface WHIPClient {
  stop: () => void
}

interface Props {
  playId: number
  url: string
  isPublishing: boolean
  className?: string
}

export default function WHIPPublisher(props: Props) {
  const { playId, url, isPublishing, className } = props
  const videoRef = useRef<HTMLVideoElement>(null)
  const [status, setStatus] = useState<'idle' | 'connecting' | 'publishing' | 'error'>('idle')
  console.log(status)
  const [errorMessage, setErrorMessage] = useState('')

  // WHIP客户端实例
  const whipClientRef = useRef<WHIPClient | null>(null)

  useEffect(() => {
    if (!isPublishing || !url) {
      // 停止推流
      if (whipClientRef.current) {
        whipClientRef.current.stop()
        whipClientRef.current = null
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
      setStatus('idle')
      setErrorMessage('')
      return
    }

    // 开始WHIP推流
    async function startWHIPPublishing() {
      if (!url) return

      setStatus('connecting')
      setErrorMessage('')

      try {
        // 获取用户媒体权限
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        })
        // const stream = await  navigator.mediaDevices.getDisplayMedia()

        // 显示本地视频预览
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }

        // 创建WebRTC PeerConnection
        const client = await setupWHIPPublishing(url, stream)
        whipClientRef.current = client

        setStatus('publishing')

      } catch (error) {
        setStatus('error')
        setErrorMessage(error instanceof Error ? error.message : '推流失败')
      }
    }

    startWHIPPublishing()

    return () => {
      // 清理函数
      if (whipClientRef.current) {
        whipClientRef.current.stop()
        whipClientRef.current = null
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }
  }, [playId, url, isPublishing])

  return (
    <div className={className}>
      {errorMessage && (
        <div style={{ marginBottom: '8px', fontSize: '14px', color: '#f5222d' }}>
          错误: {errorMessage}
        </div>
      )}

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        // controls
        style={{
          width: '100%',
          height: '100%',
          maxHeight: '400px',
          borderRadius: '4px'
        }}
      />
    </div>
  )
}

/**
 * WHIP推流核心逻辑
 */
function setupWHIPPublishing(endpoint: string, stream: MediaStream): Promise<WHIPClient> {
  return new Promise((resolve, reject) => {
    const execute = async () => {
      try {
        // 创建PeerConnection
        const pc = new RTCPeerConnection({
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' }
          ]
        })

        // 处理ICE连接状态
        pc.onconnectionstatechange = () => {
          // 连接状态变化
        }

        pc.oniceconnectionstatechange = () => {
          // ICE连接状态变化
        }

        // 添加本地流到PeerConnection
        stream.getTracks().forEach(track => {
          pc.addTrack(track, stream)
        })

        // 创建Offer
        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)

        // 等待ICE收集完成
        await new Promise<void>(iceResolve => {
          if (pc.iceGatheringState === 'complete') {
            iceResolve()
          } else {
            pc.onicegatheringstatechange = () => {
              if (pc.iceGatheringState === 'complete') {
                iceResolve()
              }
            }

            // 设置超时
            setTimeout(() => iceResolve(), 5000)
          }
        })

        // 发送Offer到WHIP服务器
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/sdp',
            Authorization: 'Bearer token'  // 如果需要认证
          },
          body: pc.localDescription?.sdp
        })

        if (!response.ok) {
          throw new Error(`WHIP服务器响应错误: ${response.status} - ${response.statusText}`)
        }

        const answerSdp = await response.text()

        // 设置远端Answer
        await pc.setRemoteDescription({
          type: 'answer',
          sdp: answerSdp
        })

        resolve({
          stop: () => pc.close()
        })

      } catch (error) {
        reject(error)
      }
    }

    execute()
  })
}
