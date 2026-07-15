# 🔐 Admin Account Setup - Complete Guide

## Summary of Changes Made

I've successfully set up an admin authentication system for your GemStone application. Here's what has been implemented:

### Backend Changes:
1. ✅ **Admin Role System**: User model already had admin role support
2. ✅ **Admin Protection Middleware**: `isAdmin` middleware protects admin routes
3. ✅ **Admin Creation Script**: Created `init/createAdmin.js` for easy admin account creation
4. ✅ **Package Script**: Added `npm run create-admin` command

### Frontend Changes:
1. ✅ **Admin Button in Navbar**: Shows only for admin users (with green shield icon)
2. ✅ **Admin Button in Dropdown**: Added to user menu for easy access
3. ✅ **Protected Admin Route**: ProtectedRoute component prevents unauthorized access
4. ✅ **Role Checking**: Frontend checks user role before showing admin features

---

## Step-by-Step Setup Instructions

### 1️⃣ Create Admin Account

**Location**: Go to your Backend directory
**Command**:
```bash
cd Backend
npm run create-admin
```

This will create an admin account and display the credentials:

```
✅ Admin account created successfully!
========================================
ADMIN CREDENTIALS:
========================================
Username: admin
Email: admin@stonegemz.com
Password: Admin@12345
Role: Admin
Status: Active
========================================
```

### 2️⃣ Login with Admin Credentials

1. Navigate to your frontend: `http://localhost:5173`
2. Click on the user icon → "My Orders" (or directly go to `/login`)
3. Enter credentials:
   - **Username**: `admin`
   - **Password**: `Admin@12345`
4. Click "Login"

### 3️⃣ Access Admin Dashboard

After logging in as admin, you'll see:
- **Green Shield Icon** (🛡️) in the top-right navbar with a tooltip "Admin Dashboard"
- **"Admin Dashboard"** option in the dropdown menu (when you click your profile avatar)

Click on either to access the admin dashboard.

---

## 🔒 Security Features Implemented

### Role-Based Access Control
```javascript
// Only users with "Admin" role can access
if (!user?.role?.trim()?.toLowerCase() === "admin") {
  // Access Denied
}
```

### Status Verification
```javascript
// Both role AND active status required
if (user?.status !== "Active") {
  // Access Denied
}
```

### Frontend Protection
- ProtectedRoute component redirects non-admins to login
- Access denied page displayed for unauthorized users
- Admin button hidden from non-admin users

### Backend Protection
- `isAdmin` middleware on all admin routes
- Session-based authentication
- Password protected with bcryptjs

---

## 📊 Admin Dashboard Access

Once logged in as admin, the dashboard provides:

### Overview Section
- 📈 Total Revenue
- 📦 Total Products
- 👥 Total Users
- 📋 Total Orders
- Sales Charts (Daily/Monthly/Annual)

### Management Sections
- **Gemstones**: Add, edit, delete gemstones
- **Rings**: Manage men's and women's rings
- **Jewelry**: Manage necklaces and earrings
- **Categories**: Manage product categories
- **Collections**: Manage gemstone collections
- **Users**: View, modify roles, manage status
- **Orders**: View and track orders

---

## ⚠️ Important Security Notes

1. **Change Default Password**
   - Change the password after first login
   - Use a strong, unique password

2. **Keep Credentials Safe**
   - Don't share admin credentials with non-admins
   - Only give admin access to trusted employees

3. **Active Status Required**
   - Admin account must have status "Active"
   - Inactive or suspended accounts cannot access admin features

4. **Regular Monitoring**
   - Monitor admin activities in logs
   - Review user access regularly

5. **Database Backup**
   - Regularly backup your MongoDB database
   - Keep backups secure

---

## 🔑 Quick Reference

### Admin Login Credentials
```
Username: admin
Email: admin@stonegemz.com
Password: Admin@12345
```

### Useful Commands
```bash
# Create admin account
npm run create-admin

# Start backend server
npm run dev

# Start frontend server
npm run dev  # (from Frontend directory)
```

### Admin URLs
- Admin Dashboard: `http://localhost:5173/admin/dashboard`
- Admin Login: `http://localhost:5173/admin/login`
- Main App: `http://localhost:5173/`

---

## 🆘 Troubleshooting

### Issue: Admin button not showing after login
**Solution**:
- Verify account role is "Admin": Check user in database
- Verify account status is "Active"
- Refresh page (Ctrl+R or Cmd+R)
- Clear browser cache and localStorage

### Issue: "Access Denied" page showing
**Solution**:
- Ensure you're logged in as admin
- Check user role and status in database
- Verify ProtectedRoute component is working

### Issue: Can't run create-admin script
**Solution**:
- Check MongoDB is running
- Verify connection string in .env
- Check Node.js is installed
- Try: `node init/createAdmin.js`

### Issue: Admin account already exists
**Solution**:
- Use existing credentials to login
- Reset password if needed via database manager
- Or delete the existing admin and recreate

---

## 📝 Creating Additional Admins

To give admin access to other users:

1. **Option 1: Through Admin Dashboard**
   - Login as admin
   - Go to "Users Management"
   - Find user
   - Change their role to "Admin"
   - Set status to "Active"

2. **Option 2: Through Database**
   - Connect to MongoDB
   - Find user in "users" collection
   - Update: `{ role: "Admin", status: "Active" }`

---

## 🎯 Next Steps

1. ✅ Run `npm run create-admin` to create admin account
2. ✅ Login with the provided credentials
3. ✅ Change the admin password to something secure
4. ✅ Explore the admin dashboard
5. ✅ Create additional admin accounts if needed
6. ✅ Monitor and maintain the system

---

## 📞 Support

For any issues:
- Check backend console for error messages
- Check browser console for frontend errors
- Verify MongoDB connection
- Check user role and status in database
- Review middleware and authentication logic

---

**Setup Complete!** 🎉

Your admin system is now ready to use. Only admin users will see the admin dashboard button in the navbar and dropdown menu. Enjoy your new admin dashboard!
