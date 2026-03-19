import { Fragment } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
// CUSTOM COMPONENTS
import User3 from "icons/User3";
import UserInfo from "../user-info";
import UserAnalytics from "../user-analytics";
import DashboardHeader from "../../dashboard-header";
// CUSTOM DATA MODEL
import User from "models/User.model";

// ============================================================
type Props = { user: User };
// ============================================================

export function ProfilePageView({ user }: Props) {
  return (
    <Fragment>
      <DashboardHeader title="My Profile" Icon={User3} />

      <Box
        sx={{
          mb: 3,
          px: { xs: 2, md: 3 },
          py: { xs: 2, md: 2.5 },
          borderRadius: "4px",
          borderLeft: "4px solid #A44A3F",
          border: "1px solid rgba(43, 38, 34, 0.12)",
          borderLeftColor: "#A44A3F",
          backgroundColor: "#F4EEE3",
          boxShadow: "none"
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#2B2622",
            fontWeight: 700,
            letterSpacing: "0.01em",
            mb: 0.5
          }}
        >
          Account Overview
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "#7A6C60",
            maxWidth: 680
          }}
        >
          Manage your profile details, monitor order progress, and keep your account information
          current.
        </Typography>
      </Box>

      <UserAnalytics user={user} />
      <UserInfo user={user} />
    </Fragment>
  );
}
