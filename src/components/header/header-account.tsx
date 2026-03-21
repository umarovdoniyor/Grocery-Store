"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  const pathname = usePathname();
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

  const handleLogout = async () => {
    await logout();
    handleClose();

    if (pathname !== "/") {
      router.replace("/");
    }
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
      { label: "Addresses", href: "/address" }
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
      <IconButton
        onClick={handleClick}
        sx={{
          borderRadius: "50%",
          "&:hover": {
            backgroundColor: "rgba(79, 109, 47, 0.08)"
          }
        }}
      >
        {isAuthenticated && user ? (
          <Avatar
            src={user.avatar}
            alt={user.name.firstName}
            sx={{
              width: 32,
              height: 32,
              border: "1.5px solid rgba(79, 109, 47, 0.15)",
              boxShadow: "0 0 0 2px rgba(79, 109, 47, 0.08)"
            }}
          />
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
              elevation: 8,
              sx: {
                mt: 1.5,
                minWidth: 220,
                overflow: "visible",
                borderRadius: "12px",
                border: "1px solid rgba(79, 109, 47, 0.12)",
                backgroundColor: "#f8f6ec",
                boxShadow: "0 10px 40px rgba(33, 49, 26, 0.15)",
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "#f8f6ec",
                  border: "1px solid rgba(79, 109, 47, 0.12)",
                  borderRight: "none",
                  borderBottom: "none",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0
                }
              }
            }
          }}
        >
          <Box px={2} py={1.5}>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              sx={{
                marginBottom: "0.5rem",
                color: "#446127"
              }}
            >
              {user.name.firstName} {user.name.lastName}
            </Typography>
            <Box
              component="span"
              sx={{
                display: "inline-block",
                paddingX: "8px",
                paddingY: "4px",
                borderRadius: "6px",
                backgroundColor: "rgba(79, 109, 47, 0.08)",
                border: "1px solid rgba(79, 109, 47, 0.2)",
                cursor: "default"
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                textTransform="capitalize"
                sx={{
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  color: "#446127"
                }}
              >
                {user.role}
              </Typography>
            </Box>
          </Box>

          <Divider />

          {menuItems?.map((item) => (
            <MenuItem
              key={item.href}
              onClick={handleClose}
              component={Link}
              href={item.href}
              sx={{
                py: 1,
                color: "#444",
                fontSize: "0.95rem",
                "&:hover": {
                  backgroundColor: "rgba(79, 109, 47, 0.06)"
                }
              }}
            >
              {item.label}
            </MenuItem>
          ))}

          <Divider />

          <MenuItem
            onClick={handleLogout}
            sx={{
              py: 1,
              color: "error.main",
              fontWeight: 500,
              borderRadius: "8px",
              margin: "4px 8px",
              "&:hover": {
                backgroundColor: "rgba(244, 67, 54, 0.08)"
              }
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      )}
    </>
  );
}
