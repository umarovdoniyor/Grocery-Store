// EXAMPLE: How to protect routes with role-based authentication

// ========== Protecting a Vendor-only Page ==========
"use client";

import { useProtectedRoute } from "hooks/useProtectedRoute";

export default function VendorDashboardPage() {
// Only allow vendors and admins to access this page
const { user, isLoading } = useProtectedRoute({
requiredRole: ["vendor", "admin"]
});

if (isLoading) return <div>Loading...</div>;

return (

<div>
<h1>Welcome, {user?.name.firstName}!</h1>
{/_ Your vendor dashboard content _/}
</div>
);
}

// ========== Protecting an Admin-only Page ==========
"use client";

import { useProtectedRoute } from "hooks/useProtectedRoute";

export default function AdminPage() {
// Only allow admins to access this page
const { user, isLoading } = useProtectedRoute({
requiredRole: "admin"
});

if (isLoading) return <div>Loading...</div>;

return (

<div>
<h1>Admin Panel</h1>
{/_ Your admin content _/}
</div>
);
}

// ========== Protecting any authenticated page ==========
"use client";

import { useProtectedRoute } from "hooks/useProtectedRoute";

export default function ProfilePage() {
// Any authenticated user can access this page
const { user, isLoading } = useProtectedRoute();

if (isLoading) return <div>Loading...</div>;

return (

<div>
<h1>My Profile</h1>
{/_ User profile content _/}
</div>
);
}

// ========== Mock Users for Testing ==========
/\*
Test Credentials:

Customer:

- Email: Jayden.Gislason78@gmail.com
- Password: wJVineM971smn42
- Role: customer

Vendor:

- Email: Rahul_Frami2@yahoo.com
- Password: z18PYo4UfgVqzz8
- Role: vendor

Admin:

- Email: Reanna23@hotmail.com
- Password: jDBRzl7u_dPSBmh
- Role: admin
  \*/
