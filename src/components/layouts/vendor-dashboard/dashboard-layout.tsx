"use client";

import dynamic from "next/dynamic";
import { PropsWithChildren } from "react";
import Container from "@mui/material/Container";
// LOCAL CUSTOM COMPONENTS
import BodyWrapper from "./dashboard-body-wrapper";
// LOCAL LAYOUT CONTEXT PROVIDER
import { LayoutProvider } from "./dashboard-layout-context";

const DashboardNavbar = dynamic(() => import("./dashboard-navbar/dashboard-navbar"), {
  loading: () => null,
  ssr: false
});

const DashboardSidebar = dynamic(() => import("./dashboard-sidebar/dashboard-sidebar"), {
  loading: () => null,
  ssr: false
});

export default function VendorDashboardLayout({ children }: PropsWithChildren) {
  return (
    <LayoutProvider>
      {/* DASHBOARD SIDEBAR NAVIGATION */}
      <DashboardSidebar />

      <BodyWrapper>
        {/* DASHBOARD HEADER / TOP BAR AREA */}
        <DashboardNavbar />

        {/* MAIN CONTENT AREA */}
        <Container maxWidth="lg">{children}</Container>
      </BodyWrapper>
    </LayoutProvider>
  );
}
