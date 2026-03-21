import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

const DEAL_PAGES: Record<
  string,
  {
    title: string;
    eyebrow: string;
    description: string;
    note: string;
  }
> = {
  "flash-sales": {
    title: "Flash Sales Are Coming Soon",
    eyebrow: "Limited-Time Savings",
    description:
      "We are preparing a fast-moving deals experience with special pricing on fresh groceries, pantry staples, and household favorites.",
    note: "Once this section launches, customers will see short-window offers with clear countdowns and featured products."
  },
  "weekly-deals": {
    title: "Weekly Deals Are In Progress",
    eyebrow: "Recurring Value Picks",
    description:
      "This page will soon feature a handpicked weekly mix of everyday essentials and seasonal specials at better prices.",
    note: "We will use this section for rotating promotions that are easy to browse and update each week."
  },
  clearance: {
    title: "Clearance Offers Will Launch Soon",
    eyebrow: "Final Chance Prices",
    description:
      "We are still building the clearance area for limited-stock items, end-of-line offers, and extra markdown opportunities.",
    note: "When ready, this page will help surface products that need a dedicated discounted destination."
  }
};

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const dealPage = DEAL_PAGES[slug];

  if (!dealPage) {
    return {
      title: "Deals - Grocery Store",
      description: "Upcoming deals and promotions at Grocery Store."
    };
  }

  return {
    title: `${dealPage.eyebrow} - Grocery Store`,
    description: dealPage.description
  };
}

export default async function DealPlaceholderPage({ params }: PageProps) {
  const { slug } = await params;
  const dealPage = DEAL_PAGES[slug];

  if (!dealPage) return notFound();

  return (
    <Box
      sx={{
        py: { xs: 5, md: 8 },
        backgroundColor: "#f8f6ec",
        backgroundImage:
          "radial-gradient(760px 260px at 10% 0%, rgba(111,143,68,0.18), rgba(111,143,68,0)), radial-gradient(720px 220px at 90% 4%, rgba(164,74,63,0.14), rgba(164,74,63,0))"
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            px: { xs: 2.5, md: 5 },
            py: { xs: 4, md: 5 },
            borderRadius: 4,
            border: "1px solid rgba(79, 109, 47, 0.16)",
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(244, 238, 227, 0.96) 100%)",
            boxShadow: "0 18px 40px rgba(33, 49, 26, 0.08)",
            "&::before": {
              content: '""',
              position: "absolute",
              top: -80,
              right: -40,
              width: 220,
              height: 220,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(111,143,68,0.16) 0%, rgba(111,143,68,0) 72%)"
            }
          }}
        >
          <Typography
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              px: 1.5,
              py: 0.6,
              mb: 2,
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#446127",
              backgroundColor: "rgba(90, 122, 48, 0.12)"
            }}
          >
            {dealPage.eyebrow}
          </Typography>

          <Typography variant="h2" sx={{ mb: 1.5, fontWeight: 800, color: "#24311d" }}>
            {dealPage.title}
          </Typography>

          <Typography
            variant="body1"
            sx={{ maxWidth: 760, mb: 2, color: "#5e7050", lineHeight: 1.8 }}
          >
            {dealPage.description}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              maxWidth: 720,
              mb: 3.5,
              color: "#7a6c60",
              lineHeight: 1.8,
              fontSize: 15
            }}
          >
            {dealPage.note}
          </Typography>

          <Box sx={{ display: "flex", gap: 1.25, flexWrap: "wrap" }}>
            <Link
              href="/products"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 20px",
                borderRadius: "999px",
                backgroundColor: "#5a7a30",
                color: "#ffffff",
                fontWeight: 700,
                textDecoration: "none"
              }}
            >
              Browse Products
            </Link>

            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 20px",
                borderRadius: "999px",
                backgroundColor: "rgba(90, 122, 48, 0.1)",
                border: "1px solid rgba(90, 122, 48, 0.18)",
                color: "#446127",
                fontWeight: 700,
                textDecoration: "none"
              }}
            >
              Back to Home
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
