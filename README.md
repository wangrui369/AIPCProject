# 后台管理系统

基于 Monorepo + pnpm + Turborepo + Supabase + Next.js + shadcn/ui + Tailwind CSS 构建的全栈后台管理系统。

## 技术栈

- **Monorepo**: pnpm workspace + Turborepo
- **前端框架**: Next.js 15 (App Router)
- **UI 组件**: Radix UI + shadcn/ui
- **样式**: Tailwind CSS
- **后端服务**: Supabase (PostgreSQL + Auth + RLS)
- **状态管理**: Zustand
- **表单验证**: React Hook Form + Zod
- **图表**: Recharts
- **通知**: Sonner

## 功能特性

✅ **用户认证**
- 邮箱密码登录
- 数字图片验证码
- JWT Token 认证
- 自动登录状态管理

✅ **动态菜单**
- 基于角色的菜单权限
- 树形菜单结构
- 可折叠子菜单
- 从 Supabase 动态加载

✅ **仪表盘**
- 数据统计卡片
- 销售趋势图表（折线图）
- 订单统计（柱状图）
- 分类占比（饼图）
- 最近活动列表

✅ **个人中心**
- 查看个人信息
- 修改密码
- 头像显示

✅ **响应式设计**
- 移动端适配
- 暗色模式支持（可扩展）

## 项目结构

```
admin-system/
├── apps/
│   └── web/                    # Next.js 前端应用
│       ├── src/
│       │   ├── app/            # App Router 页面
│       │   │   ├── dashboard/  # 仪表盘页面
│       │   │   ├── login/      # 登录页面
│       │   │   └── layout.tsx
│       │   ├── components/     # React 组件
│       │   │   ├── ui/         # shadcn/ui 组件
│       │   │   ├── sidebar.tsx # 侧边栏
│       │   │   └── header.tsx  # 顶部导航
│       │   ├── lib/            # 工具函数
│       │   │   ├── supabase/   # Supabase 客户端
│       │   │   ├── captcha.ts  # 验证码生成
│       │   │   └── utils.ts
│       │   ├── store/          # Zustand 状态管理
│       │   └── middleware.ts   # Next.js 中间件
│       └── package.json
├── packages/                   # 共享包（可扩展）
├── pnpm-workspace.yaml
├── turbo.json
├── supabase-init.sql          # 数据库初始化脚本
└── README.md

```

## 快速开始

### 1. 安装依赖

```bash
cd admin-system
pnpm install
```

### 2. 配置 Supabase

1. 在 [Supabase](https://supabase.com) 创建新项目
2. 在 SQL Editor 中执行 `supabase-init.sql` 脚本
3. 复制项目的 URL 和 anon key

### 3. 配置环境变量

在 `apps/web` 目录下创建 `.env.local` 文件：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000

### 5. 创建测试账号

在 Supabase Dashboard → Authentication → Users 中创建测试用户：

- Email: `admin@example.com`
- Password: `123456`
- User Metadata: `{"role": "admin"}`

## 数据库表结构

### profiles 表
- `id`: UUID (关联 auth.users)
- `email`: TEXT
- `full_name`: TEXT
- `avatar_url`: TEXT
- `role`: TEXT (admin/user/editor)
- `created_at`: TIMESTAMPTZ

### menus 表
- `id`: UUID
- `parent_id`: UUID (自关联)
- `title`: TEXT
- `path`: TEXT
- `icon`: TEXT
- `sort`: INTEGER
- `roles`: TEXT[] (角色数组)
- `created_at`: TIMESTAMPTZ

## 菜单权限说明

菜单通过 `roles` 字段控制可见性：

- `admin`: 管理员（所有菜单）
- `editor`: 编辑（仪表盘 + 内容管理）
- `user`: 普通用户（仅仪表盘）

## 开发命令

```bash
# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 代码检查
pnpm lint
```

## 部署

### Vercel 部署

1. 连接 GitHub 仓库到 Vercel
2. 配置环境变量（Supabase URL 和 Key）
3. 自动部署

### 自托管

```bash
pnpm build
cd apps/web
pnpm start
```

## 扩展功能

可以继续添加：

- [ ] 用户管理 CRUD
- [ ] 角色权限管理
- [ ] 文章/内容管理
- [ ] 文件上传
- [ ] 操作日志
- [ ] 数据导出
- [ ] 暗色模式切换
- [ ] 多语言支持

## 许可证

MIT
