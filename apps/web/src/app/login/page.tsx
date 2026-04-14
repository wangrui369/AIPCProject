'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createClient } from '@/lib/supabase/client'
import { generateCaptcha } from '@/lib/captcha'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Lock, Mail, RefreshCw } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少6位'),
  captcha: z.string().length(4, '验证码为4位数字'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [captcha, setCaptcha] = useState({ text: '', dataUrl: '' })
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha())
  }

  useEffect(() => {
    refreshCaptcha()
  }, [])

  const onSubmit = async (data: LoginForm) => {
    if (data.captcha !== captcha.text) {
      toast.error('验证码错误')
      refreshCaptcha()
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) throw error

      toast.success('登录成功')
      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || '登录失败')
      refreshCaptcha()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">后台管理系统</CardTitle>
          <CardDescription className="text-center">请输入您的账号密码登录</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  className="pl-10"
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••"
                  className="pl-10"
                  {...register('password')}
                />
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="captcha">验证码</Label>
              <div className="flex gap-2">
                <Input
                  id="captcha"
                  placeholder="请输入验证码"
                  maxLength={4}
                  {...register('captcha')}
                />
                <div className="relative flex-shrink-0">
                  <img
                    src={captcha.dataUrl}
                    alt="验证码"
                    className="h-10 w-[120px] rounded border cursor-pointer"
                    onClick={refreshCaptcha}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute -right-1 -top-1 h-6 w-6"
                    onClick={refreshCaptcha}
                  >
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              {errors.captcha && <p className="text-sm text-destructive">{errors.captcha.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '登录中...' : '登录'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
