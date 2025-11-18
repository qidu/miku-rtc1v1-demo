import React, { useCallback, useState } from 'react'
import { observer } from 'mobx-react'
import { FieldState } from 'formstate-x'
import { Form, FormItem, Link, Button, Dialog } from 'react-icecream'
import { Radio, RadioGroup, TextInput, useFormstateX } from 'react-icecream/form-x'

import { defaultHlsPlayUrl, isHttpsDemo, VideoFormat } from 'constants/index'
import { getVideoFormatFromUrl } from 'transforms'
import { goToHttpsPage, isMixContent } from 'utils'
import Block from '../common/Block'
import XgVideoPlayer from './XgVideoPlayer'

import styles from '../style.m.less'

interface Props {
  url?: string
  format?: VideoFormat
}

export default observer(function Standard({
  url: urlFromProps,
  format: formatFromProps
}: Props) {
  const [format, setFormat] = useState(formatFromProps ?? VideoFormat.HLS)
  const [url, setUrl] = useState(urlFromProps || defaultHlsPlayUrl)
  const [playCount, setPlayCount] = useState(0)
  const [alertVisible, setAlertVisible] = useState(false)

  const formatState = useFormstateX(() => new FieldState(formatFromProps ?? VideoFormat.HLS), [])
  const urlState = useFormstateX(() => new FieldState(urlFromProps ?? ''), [])

  const handlePlay = useCallback((forceHttps?: boolean) => {
    const newUrl = urlState.value.trim() || defaultHlsPlayUrl

    if (!forceHttps && isMixContent(newUrl)) {
      setAlertVisible(true)
      return
    }

    // 优先用 url 中解析的 format，解析失败用当前选中的 format
    const formatFromUrl = getVideoFormatFromUrl(newUrl)
    if (!formatFromUrl) {
      setFormat(formatState.value)
    } else {
      setFormat(formatFromUrl)
      if (formatFromUrl !== formatState.value) {
        formatState.set(formatFromUrl)
      }
    }

    setUrl(newUrl)
    setPlayCount(count => count + 1)
  }, [formatState, urlState])

  const handleAlertCancel = useCallback(() => {
    setAlertVisible(false)
    handlePlay(true)
  }, [handlePlay])

  const alertModal = (
    <Dialog
      title="提示"
      icon
      visible={alertVisible}
      onOk={handleAlertCancel}
      onCancel={handleAlertCancel}
    >
      HTTP 播放地址可能无法在当前页面播放，若遇到播放问题请切换到 HTTP Demo 页面尝试（将浏览器地址栏中的 https 改为 http 重新加载即可）。
    </Dialog>
  )

  const urlTip = isHttpsDemo
    ? <span>浏览器安全策略会限制 HTTPS 网页加载 HTTP 资源，HTTP 播放地址请切换到 HTTP 页面播放（将浏览器地址栏中的 https 改为 http 重新加载即可）</span>
    : <span>浏览器安全策略会限制 HTTPS 网页加载 HTTP 资源，只有 HTTPS 播放地址可以 <Link onClick={goToHttpsPage}>切换到 HTTPS 页面</Link> 播放</span>

  const configForm = (
    <Form layout="horizontal" footer={null}>
      <FormItem label="播放协议" labelVerticalAlign="text">
        <RadioGroup state={formatState}>
          <Radio value={VideoFormat.HLS}>HLS</Radio>
          <Radio value={VideoFormat.FLV}>FLV</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem
        label="播放地址"
        tip={urlTip}
      >
        <TextInput state={urlState} placeholder="请输入播放地址" style={{ width: '100%' }} />
      </FormItem>
    </Form>
  )

  return (
    <Block title="标准直播">
      <div className={styles.configContainer}>
        {configForm}
      </div>
      <div>
        <Button type="primary" onClick={() => handlePlay()}>开始播放</Button>
      </div>
      <XgVideoPlayer playId={playCount} url={url} format={format} fluid isLive className={styles.videoContainer} />
      {alertModal}
    </Block>
  )
})
