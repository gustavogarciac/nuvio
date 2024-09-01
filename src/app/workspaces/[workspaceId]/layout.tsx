import { Metadata } from 'next'
import React from 'react'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'

import { Sidebar } from './_components/sidebar'
import { Toolbar } from './_components/toolbar'
import { WorkspaceSidebar } from './_components/workspace-sidebar'

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
        <ResizablePanelGroup
          autoSaveId="nuvio-workspace-layout"
          direction="horizontal"
        >
          <ResizablePanel
            defaultSize={20}
            minSize={11}
            className="bg-indigo-400"
          >
            <WorkspaceSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={20}>{children}</ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

export default WorkspaceIdLayout
