import { Metadata } from 'next'
import React from 'react'

import { Sidebar } from './_components/sidebar'
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
      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar />
        {children}
      </div>
    </div>
  )
}

export default WorkspaceIdLayout
