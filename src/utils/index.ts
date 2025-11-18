import { isHttpsDemo } from '../constants'

/** @deprecated 2025.8.6 更新：实测会自动 httpsUpgrade 再跳回 https，可能是浏览器安全策略更新了，只能提示手动切换了 */
export function goToHttpPage() {
  const httpUrl = window.location.href.replace('https://', 'http://')
  window.open(httpUrl, '_self')
}

export function goToHttpsPage() {
  const httpUrl = window.location.href.replace('http://', 'https://')
  window.open(httpUrl, '_self')
}

export function isMixContent(playUrl: string) {
  return isHttpsDemo && playUrl.startsWith('http://')
}
