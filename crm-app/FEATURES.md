# CRM Features - Complete Guide

## 🎯 Core Features

### 1. **Calendar & Meeting Scheduling**
- **Who**: Employees and Admins
- **What**: Schedule meetings with multiple attendees, set times, add optional meeting links
- **How**:
  - Click "Schedule Meeting" button on `/calendar`
  - Add attendees by checking employee names
  - Set start/end times and optional video call link
  - All employees see the full calendar grid by month
  - Team members can accept or decline meeting invitations
- **Files**:
  - `app/api/meetings/route.ts` - Create/list meetings
  - `app/(protected)/calendar/page.tsx` - Calendar UI with grid view
  - `components/MeetingForm.tsx` - Form to schedule meetings

### 2. **Customer Status Pipeline**
New status system replaces old "lead/active/inactive":

| Status | Meaning | When to Use |
|--------|---------|------------|
| **LEAD** | Fresh, uncontacted prospect | Default for newly created customers |
| **IN_PROGRESS** | Being actively worked on | You're having calls/meetings with them |
| **CONVERTED** | Active customer, deal done | Customer purchased or is actively engaged |
| **INACTIVE** | Lost opportunity | Prospect went silent or explicitly declined |

**Only assigned employee can change status** via status toggle buttons on customer detail page.

### 3. **Permission-Based Access Control**

#### ADMIN Permissions:
- ✅ Create, view, edit, delete all customers
- ✅ Assign/reassign customers to employees
- ✅ Create, view, edit all users
- ✅ View full calendar with all meetings
- ✅ Schedule meetings
- ✅ Cannot change customer status (that's the employee's job)

#### EMPLOYEE Permissions:
- ✅ View only assigned customers
- ✅ Change status of assigned customers (LEAD → IN_PROGRESS → CONVERTED/INACTIVE)
- ✅ Edit customer details (name, email, phone, company, notes) for assigned customers
- ✅ Log interactions on assigned customers
- ✅ Schedule meetings with other employees
- ✅ View public calendar
- ✅ Accept/decline meeting invitations
- ❌ Cannot assign/reassign customers (admin only)
- ❌ Cannot manage users
- ❌ Cannot view other employees' customers

#### CLIENT Permissions:
- ✅ View own profile/data
- ✅ View interaction history with them
- ❌ Cannot create or modify anything
- ❌ Read-only access

---

## 📋 Page Map

### Public Pages
- `/` - Landing page
- `/login` - Login form

### Admin Pages
- `/admin` - Dashboard with stats (total customers, employees, clients, converted count)
- `/admin/users` - User management (create, edit, delete users with role assignment)
- `/admin/customers` - Customer management (CRUD operations)

### Employee Pages
- `/employee` - My Customers (customers assigned to me)
- `/calendar` - Meeting calendar (visual month grid + upcoming meetings list)
- `/calendar/meetings/[id]` - Meeting details with attendance management
- `/dashboard/customers/[id]` - Customer detail with status selector + interactions

### Client Pages
- `/client` - Personal profile and interaction history

---

## 🔄 Workflows

### Workflow 1: Admin Creates Customer & Assigns to Employee
1. Admin goes to `/admin/customers`
2. Clicks "Add Customer"
3. Fills in customer details
4. **Selects an employee from "Assign To" dropdown**
5. Saves - customer created with LEAD status
6. Employee now sees this customer in `/employee`

### Workflow 2: Employee Works Customer from LEAD to CONVERTED
1. Employee goes to `/employee` or `/calendar`
2. Clicks customer name to open `/dashboard/customers/[id]`
3. **Toggles status buttons**:
   - Initial: LEAD (fresh prospect)
   - After first call: IN_PROGRESS (being actively worked)
   - After closing deal: CONVERTED (or INACTIVE if lost)
4. Logs interactions: "Call with John - Discussed pricing", "Sent proposal", etc.
5. Meeting invites sent to team members for key calls/meetings

### Workflow 3: Schedule Team Meeting
1. Employee clicks "Schedule Meeting" from navbar or `/calendar`
2. Fills form:
   - Title: "Acme Corp Pitch"
   - Time: Tomorrow 2pm-3pm
   - Attendees: Check other employees
   - Link: Paste Zoom/Google Meet URL
3. Saves - invites sent as "pending"
4. Team members see meeting on their calendar
5. They accept/decline from `/calendar/meetings/[id]`
6. Organizer can see attendance responses

---

## 🛡️ Security Features

### Row-Level Security (RLS)
Every database table has RLS enabled. Users can only access data based on their role:

```
Profiles Table:
- Users can view their own profile
- Admins can view all profiles

Customers Table:
- Admins see ALL customers
- Employees see only customers assigned to them
- Clients see only their own customer record

Meetings Table:
- Everyone can view all meetings (public calendar)
- Only organizer can delete/update

Meeting Attendees Table:
- Only attendee can update their own response
```

### API Route Protection
Every backend route validates:
1. User is authenticated (has Supabase session)
2. User has permission for that action (role check)
3. Specific record ownership (e.g., assigned customer)

Example: PUT `/api/customers/[id]` only allows:
- **ADMIN**: Full edit access to all customers
- **EMPLOYEE**: Status-only changes if assigned to that customer

---

## 📊 Data Model

### Customers
```typescript
{
  id: UUID,
  full_name: string,
  email?: string,
  phone?: string,
  company?: string,
  status: 'LEAD' | 'IN_PROGRESS' | 'CONVERTED' | 'INACTIVE',
  notes?: string,
  assigned_to?: UUID (refers to profiles.id),  // Employee assigned
  created_by?: UUID,
  created_at: timestamp,
  updated_at: timestamp
}
```

### Meetings
```typescript
{
  id: UUID,
  title: string,
  description?: string,
  start_time: timestamp,
  end_time: timestamp,
  meeting_link?: string (URL to Zoom/Teams/etc),
  organized_by: UUID (refers to profiles.id),
  created_at: timestamp,
  updated_at: timestamp
}
```

### Meeting Attendees
```typescript
{
  id: UUID,
  meeting_id: UUID,
  attendee_id: UUID (refers to profiles.id),
  status: 'pending' | 'accepted' | 'declined',
  created_at: timestamp
}
```

---

## 🚀 API Endpoints

### Auth
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Users (Admin only)
- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `GET /api/users/[id]` - Get user details
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### Customers
- `GET /api/customers` - List (filtered by role)
- `POST /api/customers` - Create
- `GET /api/customers/[id]` - Get details
- `PUT /api/customers/[id]` - Update (restricted by role)
- `DELETE /api/customers/[id]` - Delete (admin only)

### Interactions
- `GET /api/customers/[id]/interactions` - Get interactions for customer
- `POST /api/customers/[id]/interactions` - Log new interaction
- `DELETE /api/interactions/[id]` - Delete interaction (admin only)

### Meetings
- `GET /api/meetings` - List all meetings
- `POST /api/meetings` - Create meeting with attendees
- `GET /api/meetings/[id]` - Get meeting + attendee list
- `DELETE /api/meetings/[id]` - Delete meeting (organizer only)
- `PUT /api/meetings/attendees/[id]` - Update attendance status (attendee only)

---

## ⚙️ Setup Checklist

Before using the app, complete these steps:

### 1. Database Schema
Run SQL from `MIGRATIONS.md`:
- Create meetings table
- Create meeting_attendees table
- Update customer status enum (LEAD/IN_PROGRESS/CONVERTED/INACTIVE)
- Add RLS policies for meetings

### 2. Create First Admin User
In Supabase dashboard:
1. Go to Auth → Users
2. Create test user with email/password
3. Go to profiles table → insert row:
   - `id`: Copy from auth.users
   - `full_name`: "Admin User"
   - `email`: same as auth user
   - `role`: "ADMIN"

### 3. Test Workflows
- [ ] Login as admin
- [ ] Create customer and assign to employee
- [ ] Login as employee - see assigned customer
- [ ] Change customer status (LEAD → IN_PROGRESS → CONVERTED)
- [ ] Schedule meeting with another employee
- [ ] View calendar grid

---

## 🐛 Troubleshooting

**Q: Employee can't see customer status buttons**
A: Make sure customer is assigned to that employee (`assigned_to` field matches their user ID)

**Q: Admin can't assign customers**
A: Check that employees are created in profiles table with role='EMPLOYEE'

**Q: Calendar shows no meetings**
A: Check browser console for errors. Ensure meetings are created successfully via API.

**Q: Can't change customer status**
A: Only assigned employee can change status. Admin must view from employee page to change.

---

## 📝 Next Steps

1. **Customize statuses** if needed (modify in CustomerForm.tsx, StatusSelector.tsx, types.ts)
2. **Add email notifications** when meetings are scheduled or status changes
3. **Mobile app** - Same API works for React Native
4. **Reports** - Add `/admin/reports` page for conversion rate by employee
5. **Activity feed** - Show recent customer updates across all employees
