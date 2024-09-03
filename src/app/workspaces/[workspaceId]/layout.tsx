'use client'

import { Loader } from 'lucide-react'
import React from 'react'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { Thread } from '@/features/messages/components/thread'
import { usePanel } from '@/hooks/use-panel'

import { Id } from '../../../../convex/_generated/dataModel'
import { Sidebar } from './_components/sidebar'
import { Toolbar } from './_components/toolbar'
import { WorkspaceSidebar } from './_components/workspace-sidebar'

type Props = {
  children: React.ReactNode
}

const WorkspaceIdLayout = ({ children }: Props) => {
  const { parentMessageId, onCloseMessage } = usePanel()

  const showPanel = !!parentMessageId

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
          <ResizablePanel minSize={20} defaultSize={40}>
            {children}
          </ResizablePanel>
          {showPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel minSize={20} defaultSize={29}>
                {parentMessageId ? (
                  <Thread
                    messageId={parentMessageId as Id<'messages'>}
                    onClose={onCloseMessage}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Loader className="size-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

export default WorkspaceIdLayout
