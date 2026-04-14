# 快速启动指南

## 第一步：安装依赖

```bash
cd admin-system
pnpm install
```

## 第二步：配置 Supabase

### 2.1 创建 Supabase 项目

1. 访问 https://supabase.com
2. 点击 "New Project"
3. 填写项目信息并创建

### 2.2 初始化数据库

1. 在 Supabase Dashboard 左侧菜单选择 "SQL Editor"
2. 点击 "New Query"
3. 复制 `supabase-init.sql` 的全部内容
4. 粘贴并点击 "Run" 执行

### 2.3 获取项目凭证

1. 在 Supabase Dashboard 左侧菜单选择 "Settings" → "API"
2. 复制以下信息：
   - Project URL:
     https://fcyrphlhcuctxwmdoepf.supabase.co
   - anon public key: sb_publishable_3Mqfn4B8JMLMhM7Ddn-T-Q_E6-ZiVzH

## 第三步：配置环境变量

在 `apps/web` 目录下创建 `.env.local` 文件：

```bash
cd apps/web
cp .env.example .env.local
```

编辑 `.env.local`，填入你的 Supabase 凭证：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 第四步：创建测试账号

### 方式一：通过 Supabase Dashboard

1. 在 Supabase Dashboard 选择 "Authentication" → "Users"
2. 点击 "Add user" → "Create new user"
3. 填写信息：
   - Email: `admin@example.com`
   - Password: `123456`
   - Auto Confirm User: ✅ 勾选
4. 点击 "Create user"
5. 创建成功后，点击该用户进入详情
6. 在 "User Metadata" 中添加：
   ```json
   {
     "role": "admin"
   }
   ```

### 方式二：通过 SQL

在 SQL Editor 中执行：

```sql
-- 创建用户（需要在 Supabase Dashboard 的 Authentication 中手动创建）
-- 然后更新 profile
INSERT INTO profiles (id, email, full_name, role)
VALUES (
  'user-uuid-from-auth-users',
  'admin@example.com',
  '管理员',
  'admin'
);
```

## 第五步：启动开发服务器

```bash
# 在项目根目录
pnpm dev
```

服务器启动后访问：http://localhost:3000

## 第六步：登录测试

1. 浏览器会自动跳转到登录页
2. 输入测试账号：
   - 邮箱：`admin@example.com`
   - 密码：`123456`
   - 验证码：输入图片中显示的4位数字
3. 点击"登录"

## 常见问题

### Q1: 验证码看不清？

点击验证码图片可以刷新

### Q2: 登录后看不到菜单？

检查用户的 role 是否正确设置为 `admin`

### Q3: 提示 "Invalid login credentials"？

- 确认邮箱密码正确
- 确认用户已在 Supabase 中创建
- 确认用户邮箱已验证（Auto Confirm User）

### Q4: 环境变量不生效？

- 确认 `.env.local` 文件在 `apps/web` 目录下
- 重启开发服务器（Ctrl+C 然后重新 `pnpm dev`）

### Q5: 菜单数据没有加载？

- 确认 `supabase-init.sql` 已执行
- 在 Supabase Dashboard → Table Editor 中检查 `menus` 表是否有数据

## 测试不同角色

创建不同角色的用户来测试菜单权限：

```sql
-- 编辑角色（可以看到仪表盘和内容管理）
INSERT INTO profiles (id, email, full_name, role)
VALUES ('uuid-2', 'editor@example.com', '编辑', 'editor');

-- 普通用户（只能看到仪表盘）
INSERT INTO profiles (id, email, full_name, role)
VALUES ('uuid-3', 'user@example.com', '用户', 'user');
```

## 下一步

项目启动成功后，你可以：

1. 浏览仪表盘查看数据报表
2. 访问个人中心修改密码
3. 查看侧边栏的动态菜单
4. 开始开发自定义功能

## 开发建议

- 在 `apps/web/src/app/dashboard` 下添加新页面
- 在 Supabase 的 `menus` 表中添加对应菜单项
- 使用 shadcn/ui 组件快速构建界面
- 参考现有页面的代码结构

祝开发顺利！🚀

111
