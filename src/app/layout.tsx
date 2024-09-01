import './globals.css'

import { ConvexAuthNextjsServerProvider } from '@convex-dev/auth/nextjs/server'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { ConvexClientProvider } from '@/components/convex-client-provider'
import { JotaiProvider } from '@/components/jotai-provider'
import { Modals } from '@/components/modals'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Nuvio',
    template: '%s | Nuvio',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="pt-br">
        <body className={inter.className}>
          <ConvexClientProvider>
            <JotaiProvider>
              <Modals />
              {children}
              <Toaster />
            </JotaiProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  )
}
