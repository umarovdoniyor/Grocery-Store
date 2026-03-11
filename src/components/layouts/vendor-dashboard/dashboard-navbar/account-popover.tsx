import Link from "next/link";
import { useState } from "react";
// MUI
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useAuth } from "contexts/AuthContext";

// STYLED COMPONENT
const Divider = styled("div")(({ theme }) => ({
  margin: "0.5rem 0",
  border: `1px dashed ${theme.palette.grey[200]}`
}));

export default function AccountPopover() {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { user, logout } = useAuth();
  const open = Boolean(anchorEl);

  const handleClose = () => setAnchorEl(null);

  const fullName = [user?.name?.firstName, user?.name?.lastName].filter(Boolean).join(" ").trim();
  const displayName = fullName || user?.email || "User";
  const displayRole = user?.role ? `${user.role[0].toUpperCase()}${user.role.slice(1)}` : "Member";

  const profilePath = user?.role === "admin" ? "/admin/customers" : "/profile";
  const settingsPath =
    user?.role === "admin"
      ? "/admin/account-settings"
      : user?.role === "vendor"
        ? "/vendor/account-settings"
        : "/profile";
  const ordersPath = user?.role === "admin" ? "/admin/orders" : "/orders";

  return (
    <div>
      <IconButton
        sx={{ padding: 0 }}
        aria-haspopup="true"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        aria-expanded={open ? "true" : undefined}
        aria-controls={open ? "account-menu" : undefined}
      >
        <Avatar alt="Remy Sharp" src="/assets/images/avatars/001-man.svg" />
      </IconButton>

      <Menu
        open={open}
        id="account-menu"
        anchorEl={anchorEl}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              mt: 1,
              boxShadow: 2,
              minWidth: 200,
              borderRadius: "8px",
              overflow: "visible",
              border: "1px solid",
              borderColor: "grey.200",
              "& .MuiMenuItem-root:hover": {
                backgroundColor: "grey.200"
              },
              "&:before": {
                top: 0,
                right: 14,
                zIndex: 0,
                width: 10,
                height: 10,
                content: '""',
                display: "block",
                position: "absolute",
                borderTop: "1px solid",
                borderLeft: "1px solid",
                borderColor: "grey.200",
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)"
              }
            }
          }
        }}
      >
        <Box px={2} pt={1}>
          <Typography variant="h6">{displayName}</Typography>
          <Typography variant="body1" sx={{ fontSize: 12, color: "grey.500" }}>
            {displayRole}
          </Typography>
        </Box>

        <Divider />
        <MenuItem LinkComponent={Link} href={profilePath}>
          Profile
        </MenuItem>
        <MenuItem LinkComponent={Link} href={ordersPath}>
          {user?.role === "admin" ? "Manage Orders" : "My Orders"}
        </MenuItem>
        <MenuItem LinkComponent={Link} href={settingsPath}>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    </div>
  );
}
