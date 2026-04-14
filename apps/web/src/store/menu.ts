import { create } from 'zustand'
import type { Menu } from '@/lib/supabase/types'

interface MenuState {
  menus: Menu[]
  loading: boolean
  setMenus: (menus: Menu[]) => void
  setLoading: (loading: boolean) => void
}

export const useMenuStore = create<MenuState>((set) => ({
  menus: [],
  loading: false,
  setMenus: (menus) => set({ menus }),
  setLoading: (loading) => set({ loading }),
}))

// 将平铺菜单转为树形结构
export function buildMenuTree(menus: Menu[]): (Menu & { children?: Menu[] })[] {
  const map = new Map<string, Menu & { children?: Menu[] }>()
  const roots: (Menu & { children?: Menu[] })[] = []

  menus.forEach(m => map.set(m.id, { ...m, children: [] }))
  menus.forEach(m => {
    if (m.parent_id && map.has(m.parent_id)) {
      map.get(m.parent_id)!.children!.push(map.get(m.id)!)
    } else {
      roots.push(map.get(m.id)!)
    }
  })

  const sort = (items: (Menu & { children?: Menu[] })[]) => {
    items.sort((a, b) => a.sort - b.sort)
    items.forEach(i => i.children?.length && sort(i.children))
  }
  sort(roots)
  return roots
}
