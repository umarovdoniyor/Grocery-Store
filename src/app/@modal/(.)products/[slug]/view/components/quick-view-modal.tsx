"use client";

import { usePathname, useRouter } from "next/navigation";
import { type PropsWithChildren } from "react";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import DialogContent from "@mui/material/DialogContent";
import Close from "@mui/icons-material/Close";

const dialogStyles = {
  zIndex: 1501,
  "& .MuiDialog-paper": {
    borderRadius: 4,
    overflow: "hidden",
    maxHeight: "90vh",
    boxShadow: "0 24px 60px rgba(20, 40, 10, 0.18)"
  }
};

const dialogContentStyles = {
  maxWidth: 680,
  width: "100%",
  padding: 0,
  overflowY: "auto"
};

const iconButtonStyles = {
  position: "absolute",
  top: 10,
  right: 10,
  zIndex: 10,
  width: 32,
  height: 32,
  backgroundColor: "rgba(255,255,255,0.85)",
  backdropFilter: "blur(4px)",
  border: "1px solid rgba(0,0,0,0.08)",
  "&:hover": {
    backgroundColor: "rgba(255,255,255,1)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.12)"
  }
};

export default function QuickViewModal({ children }: PropsWithChildren) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClose = () => {
    router.back();
  };

  return (
    <Dialog
      maxWidth={false}
      open={pathname.includes("/view")}
      onClose={handleClose}
      sx={dialogStyles}
    >
      <DialogContent sx={dialogContentStyles}>
        {children}

        <IconButton onClick={handleClose} sx={iconButtonStyles}>
          <Close fontSize="small" color="secondary" />
        </IconButton>
      </DialogContent>
    </Dialog>
  );
}
