import React, { useCallback, useState } from 'react'
import { observer } from 'mobx-react'
import { FieldState } from 'formstate-x'
import { Form, FormItem, Button } from 'react-icecream'
import { TextInput, useFormstateX } from 'react-icecream/form-x'

import Block from '../common/Block'
import WHIPPublisher from './WHIPPublisher'

import styles from '../style.m.less'

interface Props {
  url?: string
}

export default observer(function WHIP({ url: urlFromProps }: Props) {
  // const [url, setUrl] = useState(urlFromProps || 'http://114.230.92.154/sdk-live/minutest000.whip?domain=miku-publish-whip.qnsdk.com')
  const [url, setUrl] = useState(urlFromProps || 'https://miku-whip-test.qnsdk.com/sdk-live/minutest000.whip')
  const [playCount, setPlayCount] = useState(0)
  const [isPublishing, setIsPublishing] = useState(false)

  // const urlState = useFormstateX(() => new FieldState(urlFromProps ?? 'http://114.230.92.154/sdk-live/minutest000.whip?domain=miku-publish-whip.qnsdk.com'), [])
  const urlState = useFormstateX(() => new FieldState(urlFromProps ?? 'https://miku-whip-test.qnsdk.com/sdk-live/minutest000.whip'), [])

  const handleStartPublish = useCallback(() => {
    const newUrl = urlState.value.trim()
    if (!newUrl) {
      // 提示用户输入WHIP推流地址
      return
    }

    setUrl(newUrl)
    setPlayCount(count => count + 1)
    setIsPublishing(true)
  }, [urlState])

  const handleStopPublish = useCallback(() => {
    setIsPublishing(false)
  }, [])

  const urlTip = (
    <div>
      <span>
        1.WHIP (WebRTC HTTP Ingestion Protocol) 推流地址，通常以 <code>https://</code> 开头。
      </span><br />
      <span>
        2.此 Demo 为公共测试环境。默认流名可能被他人占用，请将推/拉流地址中的流名（如 minutest000）改为您自定义的唯一名称，并确保两处一致。
      </span>
    </div>
  )

  const configForm = (
    <Form layout="horizontal" footer={null}>
      <FormItem label="推流协议" labelVerticalAlign="text">
        <span style={{ display: 'inline-block', padding: '4px 8px', border: '1px solid #d9d9d9', borderRadius: '4px', background: '#f5f5f5' }}>WHIP</span>
      </FormItem>
      <FormItem
        label="推流地址"
        tip={urlTip}
        required
      >
        <TextInput
          state={urlState}
          placeholder="请输入WHIP推流地址"
          style={{ width: '100%' }}
        />
      </FormItem>
    </Form>
  )

  return (
    <Block title="WHIP推流">
      <div className={styles.configContainer}>
        {configForm}
      </div>
      <div style={{ marginBottom: '16px' }}>
        {!isPublishing
          ? (
            <Button type="primary" onClick={handleStartPublish}>
              第一步：开始推流
            </Button>
          )
          : (
            <Button type="primary" onClick={handleStopPublish} danger>
              停止推流
            </Button>
          )}
      </div>
      <WHIPPublisher
        playId={playCount}
        url={url}
        isPublishing={isPublishing}
        className={styles.videoContainer}
      />
    </Block>
  )
})
