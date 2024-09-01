'use client'

import { BellIcon, Home, MessageSquare, MoreHorizontal } from 'lucide-react'
import { usePathname } from 'next/navigation'
import React from 'react'

import { UserButton } from '@/features/auth/components/user-button'

import { SidebarButton } from './sidebar-button'
import { WorkspaceSwitcher } from './workspace-switcher'

export const Sidebar = () => {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-[70px] flex-col items-center gap-y-4 bg-indigo-500 pb-1 pt-2">
      <WorkspaceSwitcher />
      <SidebarButton
        icon={Home}
        isActive={pathname.includes('/workspaces')}
        label="Início"
      />
      <SidebarButton icon={MessageSquare} label="DMs" />
      <SidebarButton icon={BellIcon} label="Atividade" />
      <SidebarButton icon={MoreHorizontal} label="Mais" />
      <div className="mt-auto flex flex-col items-center justify-center gap-y-1">
        <UserButton />
      </div>
    </aside>
  )
}
