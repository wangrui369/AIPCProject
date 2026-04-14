'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Avatar from '@radix-ui/react-avatar'
import { LogOut, User, Settings } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface HeaderProps {
  userEmail?: string
  userName?: string
}

export function Header({ userEmail, userName }: HeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('已退出登录')
    router.push('/login')
    router.refresh()
  }

  const initials = userName
    ? userName.slice(0, 2).toUpperCase()
    : userEmail?.slice(0, 2).toUpperCase() || 'U'

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-6">
      <div />
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-ring">
            <Avatar.Root className="h-9 w-9 rounded-full">
              <Avatar.Fallback className="flex h-full w-full items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                {initials}
              </Avatar.Fallback>
            </Avatar.Root>
            <span className="text-sm font-medium hidden md:block">
              {userName || userEmail}
            </span>
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="z-50 min-w-[180px] rounded-md border bg-card p-1 shadow-md"
            align="end"
            sideOffset={8}
          >
            <DropdownMenu.Item asChild>
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-2 px-3 py-2 text-sm rounded cursor-pointer hover:bg-accent"
              >
                <User className="h-4 w-4" />
                个人中心
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Separator className="my-1 h-px bg-border" />
            <DropdownMenu.Item
              className="flex items-center gap-2 px-3 py-2 text-sm rounded cursor-pointer hover:bg-accent text-destructive"
              onSelect={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              退出登录
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </header>
  )
}
