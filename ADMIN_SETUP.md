# Admin Account Setup Guide

## Creating Your Admin Account

To create an admin account with full access to the admin dashboard, follow these steps:

### Step 1: Run the Admin Creation Script

Navigate to your Backend directory and run:

```bash
npm run create-admin
```

This will automatically create an admin account with the following credentials:

### Admin Credentials

```
Username: admin
Email: admin@stonegemz.com
Password: Admin@12345
Role: Admin
Status: Active
```

⚠️ **IMPORTANT:** Save these credentials in a secure location. You should change the password after your first login.

## Logging In as Admin

1. Go to the login page: `http://localhost:5173/login`
2. Enter the username or email: `admin` or `admin@stonegemz.com`
3. Enter the password: `Admin@12345`
4. Click "Login"

## Accessing the Admin Dashboard

After logging in as admin, you will see:
- An admin button (shield icon) in the top-right corner of the navbar (next to the cart icon)
- An "Admin Dashboard" option in the user dropdown menu

Click on either to access the admin dashboard.

## Admin Dashboard Features

The admin dashboard provides the following capabilities:

### 1. Dashboard Overview
- View key statistics (total products, total revenue, users, orders)
- Sales charts (daily, monthly, annual)
- Recent orders list
- Top products by sales

### 2. Gemstone Management
- View and manage gemstones
- Add new gemstones
- Edit existing gemstones
- Delete gemstones

### 3. Rings Management
- Men's Rings
- Women's Rings
- View, add, edit, and delete rings

### 4. Jewelry Management
- Necklaces
- Earrings
- View, add, edit, and delete items

### 5. Category Management
- Men's Categories
- Women's Categories
- Manage product categories

### 6. Collections Management
- View and manage gemstone collections

### 7. Users Management
- View all users
- Change user roles
- Manage user status (Active/Inactive/Suspended)
- Delete users

### 8. Orders Management
- View all orders
- Track order status
- View order details

## Important Security Notes

1. **Change the default password** after your first login
2. **Keep the credentials confidential** - only share with trusted admins
3. **Regularly monitor** the admin dashboard for suspicious activities
4. **Admin-only routes** are protected - only users with the "Admin" role can access them
5. **Only active users** can access the admin dashboard

## Troubleshooting

### Admin button not appearing after login
- Make sure your account role is set to "Admin"
- Make sure your account status is "Active"
- Refresh the page

### Cannot create admin account (admin already exists)
- The admin account has already been created
- Use the existing credentials to login
- Contact your database administrator if you need to reset the admin password

### Access denied when clicking admin dashboard
- Make sure you are logged in as an admin user
- Check that your account status is "Active"
- Verify that your role is set to "Admin"

## Changing Admin Password

To change the admin password:
1. Login to the admin dashboard
2. Go to admin profile settings (if available)
3. Or contact your database administrator to reset it

For now, you'll need to manually update it through the database or using the user management interface.

## Adding More Admin Users

To add additional admin users:
1. Login as admin
2. Go to Users Management
3. Create a new user or modify an existing user
4. Change their role to "Admin"
5. Set their status to "Active"

## Need Help?

For any issues or questions about admin setup:
- Check the backend logs in the terminal
- Verify database connectivity
- Ensure all environment variables are properly set
