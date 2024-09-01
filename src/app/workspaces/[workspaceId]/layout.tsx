import { Metadata } from 'next'
import React from 'react'

import { Toolbar } from './_components/toolbar'

type Props = {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: 'Área de trabalho',
}

const WorkspaceIdLayout = ({ children }: Props) => {
  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc-(100vh-40px)]">{children}</div>
    </div>
  )
}

export default WorkspaceIdLayout
