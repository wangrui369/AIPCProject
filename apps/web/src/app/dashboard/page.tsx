'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Users, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react'

const statsData = [
  { title: '总用户数', value: '12,345', change: '+12.5%', icon: Users, color: 'text-blue-600' },
  { title: '订单总数', value: '8,234', change: '+8.2%', icon: ShoppingCart, color: 'text-green-600' },
  { title: '总收入', value: '¥234,567', change: '+15.3%', icon: DollarSign, color: 'text-yellow-600' },
  { title: '增长率', value: '23.5%', change: '+5.2%', icon: TrendingUp, color: 'text-purple-600' },
]

const salesData = [
  { month: '1月', sales: 4000, orders: 240 },
  { month: '2月', sales: 3000, orders: 198 },
  { month: '3月', sales: 5000, orders: 320 },
  { month: '4月', sales: 4500, orders: 278 },
  { month: '5月', sales: 6000, orders: 389 },
  { month: '6月', sales: 5500, orders: 349 },
]

const categoryData = [
  { name: '电子产品', value: 400 },
  { name: '服装', value: 300 },
  { name: '食品', value: 200 },
  { name: '图书', value: 100 },
]

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">仪表盘</h1>
        <p className="text-muted-foreground mt-1">欢迎回来，这是您的数据概览</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, idx) => (
          <Card key={idx}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-green-600 mt-1">{stat.change} 较上月</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 图表区域 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* 销售趋势 */}
        <Card>
          <CardHeader>
            <CardTitle>销售趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} name="销售额" />
                <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} name="订单数" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 订单统计 */}
        <Card>
          <CardHeader>
            <CardTitle>月度订单统计</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#3b82f6" name="订单数" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 分类占比 */}
        <Card>
          <CardHeader>
            <CardTitle>商品分类占比</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 最近活动 */}
        <Card>
          <CardHeader>
            <CardTitle>最近活动</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { user: '张三', action: '创建了新订单', time: '5分钟前' },
                { user: '李四', action: '更新了商品信息', time: '15分钟前' },
                { user: '王五', action: '完成了退款申请', time: '1小时前' },
                { user: '赵六', action: '添加了新用户', time: '2小时前' },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3 pb-3 border-b last:border-0">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">
                    {activity.user[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.user}</p>
                    <p className="text-xs text-muted-foreground">{activity.action}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
