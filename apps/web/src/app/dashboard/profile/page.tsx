'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Lock, User, Mail } from 'lucide-react'

const passwordSchema = z.object({
  currentPassword: z.string().min(6, '当前密码至少6位'),
  newPassword: z.string().min(6, '新密码至少6位'),
  confirmPassword: z.string().min(6, '确认密码至少6位'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: '两次输入的密码不一致',
  path: ['confirmPassword'],
})

type PasswordForm = z.infer<typeof passwordSchema>

export default function ProfilePage() {
  const [loading, setLoading] = useState(false)
  const [userInfo, setUserInfo] = useState({ email: '', name: '' })

  const { register, handleSubmit, formState: { errors }, reset } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  })

  // 获取用户信息
  useState(() => {
    async function fetchUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single() as { data: { full_name: string | null } | null }

        setUserInfo({
          email: user.email || '',
          name: profile?.full_name || '',
        })
      }
    }
    fetchUser()
  })

  const onSubmit = async (data: PasswordForm) => {
    setLoading(true)
    try {
      const supabase = createClient()

      // Supabase 不支持验证当前密码，直接更新
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword
      })

      if (error) throw error

      toast.success('密码修改成功，请重新登录')
      reset()

      // 退出登录
      setTimeout(async () => {
        await supabase.auth.signOut()
        window.location.href = '/login'
      }, 1500)
    } catch (error: any) {
      toast.error(error.message || '密码修改失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">个人中心</h1>
        <p className="text-muted-foreground mt-1">管理您的账户信息和安全设置</p>
      </div>

      {/* 基本信息 */}
      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
          <CardDescription>您的账户基本信息</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="font-medium">{userInfo.name || '未设置'}</p>
              <p className="text-sm text-muted-foreground">{userInfo.email}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>邮箱地址</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input value={userInfo.email} disabled className="pl-10" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 修改密码 */}
      <Card>
        <CardHeader>
          <CardTitle>修改密码</CardTitle>
          <CardDescription>定期更新密码以保护账户安全</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">当前密码</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="请输入当前密码"
                  className="pl-10"
                  {...register('currentPassword')}
                />
              </div>
              {errors.currentPassword && (
                <p className="text-sm text-destructive">{errors.currentPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">新密码</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="请输入新密码"
                  className="pl-10"
                  {...register('newPassword')}
                />
              </div>
              {errors.newPassword && (
                <p className="text-sm text-destructive">{errors.newPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">确认新密码</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="请再次输入新密码"
                  className="pl-10"
                  {...register('confirmPassword')}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? '修改中...' : '修改密码'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
