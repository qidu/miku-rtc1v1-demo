import React, { ReactNode } from 'react'

import styles from './style.m.less'

interface Props {
  title: string
  children: ReactNode
}

export default function Block({ title, children }: Props) {
  return (
    <div className={styles.block}>
      <div className={styles.blockHeader}>{title}</div>
      {children}
    </div>
  )
}
