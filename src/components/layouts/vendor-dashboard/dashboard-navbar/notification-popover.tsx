import Link from "next/link";
import { MouseEvent, useMemo, useState } from "react";
import Fade from "@mui/material/Fade";
import Badge from "@mui/material/Badge";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import IconButton from "@mui/material/IconButton";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Notifications from "@mui/icons-material/Notifications";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useAuth } from "contexts/AuthContext";
// GLOBAL CUSTOM COMPONENTS
import FlexBox from "components/flex-box/flex-box";

export default function NotificationsPopover() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const targetPath = useMemo(() => {
    if (user?.role === "admin") return "/admin/orders";
    if (user?.role === "vendor") return "/vendor/orders";
    return "/orders";
  }, [user?.role]);

  const helperText =
    user?.role === "admin"
      ? "Admin notifications are not wired to backend yet. Use the orders and applications pages for latest updates."
      : "Notifications are not connected to backend yet. Use orders pages for the latest updates.";

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setOpen((state) => !state);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div>
        <IconButton onClick={handleClick} sx={{ color: "#9CA3AF" }}>
          <Badge color="secondary" variant="dot" invisible badgeContent={0}>
            <Notifications />
          </Badge>
        </IconButton>

        <Popper
          transition
          open={open}
          anchorEl={anchorEl}
          placement="bottom-end"
          sx={{
            zIndex: 11111,
            maxWidth: 300,
            minWidth: 300,
            width: "100%",
            top: "10px !important",
            boxShadow: 2,
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
              borderColor: "#4B5563",
              bgcolor: "#1F2937",
              transform: "translateY(-50%) rotate(45deg)"
            }
          }}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={150}>
              <Paper sx={{ p: 2, backgroundColor: "#1F2937", border: "1px solid #4B5563" }}>
                <Stack spacing={1.5}>
                  <Typography variant="h6" sx={{ color: "#F3F4F6" }}>Notifications</Typography>

                  <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
                    {helperText}
                  </Typography>

                  <FlexBox justifyContent="flex-end">
                    <Button LinkComponent={Link} href={targetPath} sx={{ color: "#14B8A6" }} size="small">
                      Open Related Page
                    </Button>
                  </FlexBox>
                </Stack>
              </Paper>
            </Fade>
          )}
        </Popper>
      </div>
    </ClickAwayListener>
  );
}
