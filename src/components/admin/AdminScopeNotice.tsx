import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

type AdminScopeNoticeProps = {
  title: string;
  description: string;
};

export default function AdminScopeNotice({ title, description }: AdminScopeNoticeProps) {
  return (
    <Box maxWidth={720} mx="auto" py={6} px={{ xs: 2, sm: 3 }}>
      <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Admin Visibility Only
          </Alert>

          <Typography variant="h4" mb={1.5}>
            {title}
          </Typography>

          <Typography color="text.secondary">{description}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
