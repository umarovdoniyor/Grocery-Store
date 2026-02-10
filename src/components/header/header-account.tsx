"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// MUI
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import SvgIcon from "@mui/material/SvgIcon";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
// AUTH CONTEXT
import { useAuth } from "contexts/AuthContext";

export function HeaderAccount() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    router.push("/");
  };

  // Menu items based on role
  const getMenuItems = () => {
    if (!user) return null;

    const commonItems = [
      { label: "My Profile", href: "/profile" },
      { label: "My Orders", href: "/orders" }
    ];

    const customerItems = [
      ...commonItems,
      { label: "Wishlist", href: "/wish-list" },
      { label: "Addresses", href: "/address" },
      { label: "Support Tickets", href: "/support-tickets" }
    ];

    const vendorItems = [
      { label: "Vendor Dashboard", href: "/vendor/dashboard" },
      { label: "My Products", href: "/admin/products" },
      { label: "Orders", href: "/admin/orders" },
      { label: "Settings", href: "/vendor/account-settings" }
    ];

    const adminItems = [
      { label: "Admin Panel", href: "/admin/orders" },
      { label: "Manage Users", href: "/admin/customers" },
      { label: "Manage Vendors", href: "/admin/sellers" },
      { label: "All Products", href: "/admin/products" },
      { label: "Orders", href: "/admin/orders" }
    ];

    switch (user.role) {
      case "vendor":
        return vendorItems;
      case "admin":
        return adminItems;
      case "customer":
      default:
        return customerItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      <IconButton onClick={handleClick}>
        {isAuthenticated && user ? (
          <Avatar src={user.avatar} alt={user.name.firstName} sx={{ width: 32, height: 32 }} />
        ) : (
          <SvgIcon fontSize="small">
            <svg viewBox="0 0 24 24">
              <g fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="9" r="3" />
                <circle cx="12" cy="12" r="10" />
                <path
                  strokeLinecap="round"
                  d="M17.97 20c-.16-2.892-1.045-5-5.97-5s-5.81 2.108-5.97 5"
                />
              </g>
            </svg>
          </SvgIcon>
        )}
      </IconButton>

      {isAuthenticated && user && (
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          slotProps={{
            paper: {
              elevation: 3,
              sx: {
                mt: 1.5,
                minWidth: 200,
                overflow: "visible",
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0
                }
              }
            }
          }}
        >
          <Box px={2} py={1.5}>
            <Typography variant="subtitle2" fontWeight={600}>
              {user.name.firstName} {user.name.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary" textTransform="capitalize">
              {user.role}
            </Typography>
          </Box>

          <Divider />

          {menuItems?.map((item) => (
            <MenuItem
              key={item.href}
              onClick={handleClose}
              component={Link}
              href={item.href}
              sx={{ py: 1 }}
            >
              {item.label}
            </MenuItem>
          ))}

          <Divider />

          <MenuItem onClick={handleLogout} sx={{ py: 1, color: "error.main" }}>
            Logout
          </MenuItem>
        </Menu>
      )}
    </>
  );
}
