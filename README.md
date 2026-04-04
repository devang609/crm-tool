# ADMIN CREDENTIALS
- Email: admin@example.com
- Password: pass@123


# CRM Application

A fully functional Customer Relationship Management (CRM) tool built with Next.js 14, Supabase, and Tailwind CSS. Supports role-based access (Admin, Employee, Client) with complete CRUD operations.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with JWT
- **Styling**: Tailwind CSS
- **Deployment**: Vercel + Supabase

## Features

✅ User authentication with email/password (Supabase Auth)
✅ Role-based access control (ADMIN, EMPLOYEE, CLIENT)
✅ Customer management (create, read, update, delete)
✅ User management (ADMIN only)
✅ Customer assignment to employees
✅ Interaction logging (calls, emails, meetings, notes)
✅ Row-level security (RLS) in PostgreSQL
✅ Responsive design with Tailwind CSS

## Quick Start

### 1. Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free at [supabase.com](https://supabase.com))

### 2. Clone and Install

```bash
cd crm-app
npm install
```

### 3. Supabase Setup

#### 3.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for it to initialize

#### 3.2 Enable Email Auth

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Ensure **Email** is enabled (default)

#### 3.3 Run SQL Setup

Go to **SQL Editor** and run the following SQL:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('ADMIN', 'EMPLOYEE', 'CLIENT')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  company TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'lead')),
  notes TEXT,
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create interactions table
CREATE TABLE interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('call', 'email', 'meeting', 'note')),
  summary TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admin can view all profiles" ON profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- RLS Policies for customers
CREATE POLICY "Admin full access customers" ON customers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

CREATE POLICY "Employee sees assigned customers" ON customers
  FOR SELECT USING (assigned_to = auth.uid());

CREATE POLICY "Employee can update assigned customers" ON customers
  FOR UPDATE USING (assigned_to = auth.uid());

-- RLS Policy for interactions
CREATE POLICY "Access interactions based on customer access" ON interactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = interactions.customer_id
    )
  );
```

#### 3.4 Get API Keys

1. Go to **Project Settings** → **API**
2. Copy these values for `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Under **Service Role Secret**, copy:
   - `SUPABASE_SERVICE_ROLE_KEY`

### 4. Environment Configuration

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 5. Create First Admin User

In Supabase **Authentication** → **Users**, manually create an admin user or use:

```bash
npm run dev
# Visit http://localhost:3000/login to test the flow
```

Then manually insert the admin profile in SQL Editor:

```sql
INSERT INTO profiles (id, full_name, email, role)
VALUES (
  'YOUR_AUTH_USER_ID',
  'Admin User',
  'admin@example.com',
  'ADMIN'
)
ON CONFLICT DO NOTHING;
```

### 6. Run Locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/crm-app.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Import Project**
3. Select your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Click **Deploy**

## Project Structure

```
crm-app/
├── app/
│   ├── (auth)/login/              ← Login page
│   ├── (protected)/
│   │   ├── admin/
│   │   │   ├── page.tsx           ← Admin dashboard
│   │   │   ├── users/page.tsx     ← User management
│   │   │   └── customers/page.tsx ← Admin customer view
│   │   ├── employee/page.tsx      ← Employee dashboard
│   │   ├── client/page.tsx        ← Client profile
│   │   └── dashboard/customers/[id]/page.tsx
│   ├── api/                       ← API routes
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Navbar.tsx
│   ├── Modal.tsx
│   ├── Badges.tsx
│   ├── Table.tsx
│   ├── CustomerForm.tsx
│   ├── UserForm.tsx
│   └── InteractionForm.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── types.ts
│   └── auth.ts
├── middleware.ts
├── .env.local
└── package.json
```

## API Routes

### Authentication
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Users (ADMIN only)
- `GET /api/users` - List all users
- `POST /api/users` - Create user
- `GET /api/users/[id]` - Get user
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### Customers
- `GET /api/customers` - List customers (filtered by role)
- `POST /api/customers` - Create customer
- `GET /api/customers/[id]` - Get customer
- `PUT /api/customers/[id]` - Update customer
- `DELETE /api/customers/[id]` - Delete customer (ADMIN only)

### Interactions
- `GET /api/customers/[id]/interactions` - Get interactions
- `POST /api/customers/[id]/interactions` - Create interaction
- `DELETE /api/interactions/[id]` - Delete interaction (ADMIN only)

## Testing the App

### Test Credentials

After creating your first admin user, you can:

1. **Login as Admin**: Use the admin credentials
2. **Create Employees/Clients**: Use admin interface at `/admin/users`
3. **Add Customers**: Use `/admin/customers`
4. **Assign Customers**: Assign employees to customers
5. **Employee Login**: Login as employee to see assigned customers
6. **Log Interactions**: View customer detail and log interactions

## Security Features

✅ Row-Level Security (RLS) enforced at database level
✅ Service role key kept server-side only
✅ Role validation on every API endpoint
✅ Session-based authentication with Supabase
✅ Protected routes with middleware
✅ No passwords stored in code

## Troubleshooting

### "Not authenticated" error
- Clear browser cookies
- Logout and login again
- Check Supabase auth status in console

### RLS errors
- Ensure all RLS policies are created
- Check user profile role is set correctly
- Verify JWT token is valid

### API 403 error
- Verify your role has permission for that endpoint
- Check RLS policies in Supabase SQL Editor

### Env variables not found
- Ensure `.env.local` exists with correct values
- Restart dev server after adding env vars

## Support

For issues, check:
1. Supabase docs: https://supabase.com/docs
2. Next.js docs: https://nextjs.org/docs
3. Tailwind CSS: https://tailwindcss.com/docs

## License

MIT
