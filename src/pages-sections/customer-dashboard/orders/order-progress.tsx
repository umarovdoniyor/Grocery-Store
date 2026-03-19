"use client";

import { Fragment } from "react";
import { format } from "date-fns/format";
// MUI
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import Done from "@mui/icons-material/Done";
import Close from "@mui/icons-material/Close";
// CUSTOM ICON COMPONENTS
import Delivery from "icons/Delivery";
import PackageBox from "icons/PackageBox";
import TruckFilled from "icons/TruckFilled";
// GLOBAL CUSTOM COMPONENTS
import { FlexBetween, FlexBox } from "components/flex-box";
// CUSTOM DATA MODEL
import { OrderStatus } from "models/Order.model";

// STYLED COMPONENTS
const StyledFlexbox = styled(FlexBetween)(({ theme }) => ({
  flexWrap: "wrap",
  marginTop: "2rem",
  marginBottom: "2rem",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column"
  },
  "& .line": {
    height: 2,
    minWidth: 50,
    flex: "1 1 0",
    [theme.breakpoints.down("sm")]: {
      flex: "unset",
      height: 50,
      minWidth: 4
    }
  }
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  top: -5,
  right: -5,
  width: 20,
  height: 20,
  position: "absolute",
  color: "#F4EEE3",
  backgroundColor: "#2B2622",
  boxShadow: theme.shadows[1],
  "& svg": { fontSize: 16 }
}));

const StyledStatusAvatar = styled(Avatar)(() => ({
  width: 64,
  height: 64,
  borderRadius: "4px",
  transition: "all 0.3s ease",
  "&.completed": {
    color: "#F4EEE3",
    backgroundColor: "#2B2622"
  },
  "&.pending": {
    color: "#8B6A4A",
    backgroundColor: "#EDE8DF"
  }
}));

const DeliveryDateBox = styled("div")(() => ({
  textAlign: "center",
  padding: "0.5rem 1.25rem",
  color: "#A44A3F",
  borderRadius: "4px",
  border: "1px solid rgba(164, 74, 63, 0.25)",
  backgroundColor: "rgba(164, 74, 63, 0.07)",
  fontSize: "0.875rem",
  fontWeight: 500
}));

// ==============================================================
interface Props {
  status: OrderStatus;
  deliveredAt: Date;
  isDelivered: boolean;
}
// ==============================================================

const STEP_ICONS = [PackageBox, TruckFilled, Delivery];
const ORDER_STATUS_LIST = ["Pending", "Processing", "Delivered"];
const CANCELLED_STEP_ICONS = [PackageBox, TruckFilled, Close];
const CANCELLED_STATUS_LIST = ["Pending", "Processing", "Cancelled"];

export default function OrderProgress({ status, deliveredAt, isDelivered }: Props) {
  const isCancelled = status === "Cancelled";
  const activeIcons = isCancelled ? CANCELLED_STEP_ICONS : STEP_ICONS;
  const activeStatusList = isCancelled ? CANCELLED_STATUS_LIST : ORDER_STATUS_LIST;
  const statusIndex = activeStatusList.indexOf(status);

  return (
    <Card
      elevation={0}
      sx={{
        mb: 4,
        p: "2rem 1.5rem",
        backgroundColor: "#FAF6EF",
        border: "1px solid rgba(43, 38, 34, 0.12)",
        borderRadius: "4px",
        boxShadow: "none"
      }}
    >
      <StyledFlexbox>
        {activeIcons.map((Icon, ind) => (
          <Fragment key={`step-${ind}`}>
            <Box position="relative">
              <StyledStatusAvatar
                alt={`shipping-step-${ind + 1}`}
                className={ind <= statusIndex ? "completed" : "pending"}
              >
                <Icon color="inherit" fontSize="large" />
              </StyledStatusAvatar>

              {((isCancelled && ind === statusIndex) || ind < statusIndex) && (
                <StyledAvatar alt="completed-step">
                  {isCancelled && ind === statusIndex ? (
                    <Close color="inherit" />
                  ) : (
                    <Done color="inherit" />
                  )}
                </StyledAvatar>
              )}
            </Box>

            {ind < activeIcons.length - 1 && (
              <Box className="line" sx={{ backgroundColor: ind < statusIndex ? "#2B2622" : "#C8B79C" }} />
            )}
          </Fragment>
        ))}
      </StyledFlexbox>

      <FlexBox justifyContent={{ xs: "center", sm: "flex-end" }}>
        <DeliveryDateBox>
          Estimated Delivery Date{" "}
          <b>{isDelivered ? format(new Date(deliveredAt), "dd MMM yyyy") : "N/A"}</b>
        </DeliveryDateBox>
      </FlexBox>
    </Card>
  );
}
