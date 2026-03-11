"use client";

import Link from "next/link";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

type Props = {
  title: string;
  description: string;
};

export default function AdminScopeNotice({ title, description }: Props) {
  return (
    <Card className="p-3">
      <Stack spacing={2}>
        <Typography variant="h4">{title}</Typography>

        <Typography color="text.secondary">{description}</Typography>

        <Typography variant="body2" color="text.secondary">
          This route is intentionally limited in this portfolio build. Core admin features are fully
          integrated with backend APIs.
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <Button component={Link} href="/admin/dashboard" variant="contained" color="info">
            Open Dashboard
          </Button>

          <Button component={Link} href="/admin/orders" variant="outlined" color="info">
            Open Orders
          </Button>

          <Button component={Link} href="/admin/products" variant="outlined" color="info">
            Open Products
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
