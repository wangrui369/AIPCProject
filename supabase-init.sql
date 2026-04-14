-- 创建 profiles 表
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user', 'editor')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建 menus 表
CREATE TABLE IF NOT EXISTS menus (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id UUID REFERENCES menus(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  path TEXT,
  icon TEXT,
  sort INTEGER DEFAULT 0,
  roles TEXT[] DEFAULT ARRAY['user'],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 启用 RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;

-- profiles 策略
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- menus 策略（所有认证用户可读）
CREATE POLICY "Authenticated users can view menus"
  ON menus FOR SELECT
  TO authenticated
  USING (true);

-- 创建触发器：新用户注册时自动创建 profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 插入示例菜单数据
INSERT INTO menus (id, parent_id, title, path, icon, sort, roles) VALUES
  ('00000000-0000-0000-0000-000000000001', NULL, '仪表盘', '/dashboard', 'LayoutDashboard', 1, ARRAY['admin', 'user', 'editor']),
  ('00000000-0000-0000-0000-000000000002', NULL, '用户管理', NULL, 'User', 2, ARRAY['admin']),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', '用户列表', '/dashboard/users', NULL, 1, ARRAY['admin']),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', '角色管理', '/dashboard/roles', NULL, 2, ARRAY['admin']),
  ('00000000-0000-0000-0000-000000000005', NULL, '内容管理', NULL, 'FileText', 3, ARRAY['admin', 'editor']),
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000005', '文章列表', '/dashboard/articles', NULL, 1, ARRAY['admin', 'editor']),
  ('00000000-0000-0000-0000-000000000007', NULL, '系统设置', '/dashboard/settings', 'Settings', 4, ARRAY['admin'])
ON CONFLICT (id) DO NOTHING;
