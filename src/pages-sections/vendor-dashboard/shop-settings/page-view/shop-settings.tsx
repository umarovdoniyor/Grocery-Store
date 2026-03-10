"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
// LOCAL CUSTOM COMPONENT
import SettingsForm from "../settings-form";

export default function ShopSettingsPageView() {
  return (
    <Box py={4} maxWidth={740} margin="auto">
      <Typography variant="h3" sx={{ mb: 2 }}>
        Shop Settings
      </Typography>

      <Card sx={{ p: 3 }}>
        {/* BASIC SETTING SECTION */}
        <Typography variant="h6" sx={{ mb: 3 }}>
          Shop Profile Settings
        </Typography>

        <SettingsForm />
      </Card>
    </Box>
  );
}
