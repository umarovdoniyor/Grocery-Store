import Box from "@mui/material/Box";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import { alpha, styled } from "@mui/material/styles";
import Clear from "@mui/icons-material/Clear";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: 14,
  paddingTop: 10,
  fontWeight: 500,
  paddingBottom: 10,
  color: "#374151",
  borderBottom: "1px solid #E5E7EB"
}));

const CategoryWrapper = styled(Box)(({ theme }) => ({
  fontSize: 13,
  padding: "3px 12px",
  borderRadius: "16px",
  display: "inline-block",
  color: theme.palette.grey[900],
  backgroundColor: theme.palette.grey[100]
}));

const StyledTableRow = styled(TableRow)({
  transition: "background-color 0.2s ease",
  "&:hover": {
    backgroundColor: "#F8FAFC"
  },
  ":last-child .MuiTableCell-root": { border: 0 },
  "&.Mui-selected": {
    backgroundColor: "transparent",
    ":hover": { backgroundColor: "transparent" }
  }
});

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: "#6B7280",
  "& .MuiSvgIcon-root": { fontSize: 19 },
  ":hover": {
    color: "#14B8A6",
    backgroundColor: "rgba(20, 184, 166, 0.08)"
  }
}));

type StatusType = {
  status: string;
  // status:
  //   | "Accepted"
  //   | "Rejected"
  //   | "Processing"
  //   | "Pending"
  //   | "Delivered"
  //   | "Normal"
  //   | "Urgent"
  //   | "Cancelled";
};

const StatusWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "status"
})<StatusType>(({ status }) => {
  let color = "#334155";
  let backgroundColor = "#E2E8F0";

  if (status === "Accepted" || status === "Delivered" || status === "Normal") {
    color = "#0F766E";
    backgroundColor = "#CCFBF1";
  }

  if (status === "Rejected" || status === "Urgent" || status === "Cancelled") {
    color = "#B91C1C";
    backgroundColor = "#FEE2E2";
  }

  if (status === "Processing") {
    color = "#0C4A6E";
    backgroundColor = "#E0F2FE";
  }

  if (status === "Pending") {
    color = "#0F766E";
    backgroundColor = "#CCFBF1";
  }

  return {
    color,
    fontSize: 12,
    fontWeight: 500,
    backgroundColor,
    borderRadius: "8px",
    padding: "3px 12px",
    display: "inline-flex"
  };
});

const UploadImageBox = styled(Box)(({ theme }) => ({
  width: 70,
  height: 70,
  display: "flex",
  overflow: "hidden",
  borderRadius: "8px",
  position: "relative",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: alpha(theme.palette.info.light, 0.1)
}));

const StyledClear = styled(Clear)({
  top: 5,
  right: 5,
  fontSize: 14,
  cursor: "pointer",
  position: "absolute"
});

export {
  CategoryWrapper,
  StyledIconButton,
  StyledTableRow,
  StyledTableCell,
  StatusWrapper,
  UploadImageBox,
  StyledClear
};
