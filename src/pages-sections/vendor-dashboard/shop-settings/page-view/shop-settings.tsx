"use client";

import dynamic from "next/dynamic";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

const SettingsForm = dynamic(() => import("../settings-form"), { ssr: false });

export default function ShopSettingsPageView() {
  return (
    <Box py={4} maxWidth={740} margin="auto">
      <Typography variant="h3" sx={{ mb: 2, color: "#1F2937" }}>
        Shop Settings
      </Typography>

      <Card
        sx={{
          p: 3,
          borderRadius: "10px",
          border: "1px solid #D1D5DB",
          boxShadow: "0 8px 20px rgba(15, 23, 42, 0.05)"
        }}
      >
        {/* BASIC SETTING SECTION */}
        <Typography variant="h6" sx={{ mb: 3, color: "#374151" }}>
          Shop Profile Settings
        </Typography>

        <SettingsForm />
      </Card>
    </Box>
  );
}
