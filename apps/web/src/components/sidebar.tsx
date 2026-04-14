'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useMenuStore, buildMenuTree } from '@/store/menu'
import type { Menu } from '@/lib/supabase/types'
import * as Collapsible from '@radix-ui/react-collapsible'
import { ChevronDown, ChevronRight, LayoutDashboard, User, Settings, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

const iconMap: Record<string, any> = {
  LayoutDashboard,
  User,
  Settings,
  FileText,
}

function MenuItem({ item, level = 0 }: { item: Menu & { children?: Menu[] }; level?: number }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const hasChildren = item.children && item.children.length > 0
  const isActive = pathname === item.path
  const Icon = item.icon ? iconMap[item.icon] : null

  if (hasChildren) {
    return (
      <Collapsible.Root open={open} onOpenChange={setOpen}>
        <Collapsible.Trigger
          className={cn(
            'flex items-center justify-between w-full px-4 py-2 text-sm rounded-md transition-colors hover:bg-accent',
            level > 0 && 'pl-8'
          )}
        >
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4" />}
            <span>{item.title}</span>
          </div>
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Collapsible.Trigger>
        <Collapsible.Content className="space-y-1 mt-1">
          {item.children!.map(child => (
            <MenuItem key={child.id} item={child} level={level + 1} />
          ))}
        </Collapsible.Content>
      </Collapsible.Root>
    )
  }

  return (
    <Link
      href={item.path || '#'}
      className={cn(
        'flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors hover:bg-accent',
        level > 0 && 'pl-8',
        isActive && 'bg-primary text-primary-foreground hover:bg-primary/90'
      )}
    >
      {Icon && <Icon className="h-4 w-4" />}
      <span>{item.title}</span>
    </Link>
  )
}

export function Sidebar() {
  const { menus, setMenus, setLoading } = useMenuStore()
  const [menuTree, setMenuTree] = useState<(Menu & { children?: Menu[] })[]>([])

  useEffect(() => {
    async function fetchMenus() {
      setLoading(true)
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single() as { data: { role: string } | null }

        const role = profile?.role || 'user'

        const { data } = await supabase
          .from('menus')
          .select('*')
          .contains('roles', [role])
          .order('sort')

        if (data) {
          setMenus(data)
          setMenuTree(buildMenuTree(data))
        }
      } catch (error) {
        console.error('Failed to fetch menus:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMenus()
  }, [setMenus, setLoading])

  return (
    <aside className="w-64 border-r bg-card h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">管理系统</h2>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuTree.map(item => (
          <MenuItem key={item.id} item={item} />
        ))}
      </nav>
    </aside>
  )
}
