import Link from "next/link";
import Image from "next/image";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
// LOCAL CUSTOM COMPONENTS
import { FooterApps } from "./footer-apps";
import { FooterSocialLinks } from "./footer-social-links";
import type { Footer as FooterModel } from "models/Layout.model";

const footerFallback = {
  description:
    "Order farm-fresh produce, kitchen basics, and household essentials in minutes from your neighborhood grocery experts.",
  about: [
    { title: "Shop All Products", url: "/products" },
    { title: "Fresh Deals", url: "/products/search" },
    { title: "Become a Vendor", url: "/become-vendor" }
  ],
  customers: [
    { title: "Help Center", url: "#" },
    { title: "Track Your Order", url: "#" },
    { title: "Corporate & Bulk Purchasing", url: "#" },
    { title: "Returns & Refunds", url: "#" }
  ],
  socials: {
    facebook: "https://www.facebook.com/",
    twitter: "https://twitter.com/",
    instagram: "https://www.instagram.com/",
    youtube: "https://www.youtube.com/",
    google: "https://www.google.com/"
  }
};

type Props = {
  footer?: FooterModel;
};

export function Footer2({ footer }: Props) {
  const description = footer?.description || footerFallback.description;
  const aboutLinks = footer?.about?.length ? footer.about : footerFallback.about;
  const customerLinks = footer?.customers?.length ? footer.customers : footerFallback.customers;
  const socialLinks = footer?.socials || footerFallback.socials;

  return (
    <Box
      component="footer"
      sx={{
        mt: 6,
        overflow: "hidden",
        borderRadius: { xs: "20px 20px 0 0", md: 4 },
        border: "1px solid rgba(247, 244, 234, 0.2)",
        background: "linear-gradient(165deg, #21311A 0%, #2E4522 35%, #446127 70%, #5A7A30 100%)",
        px: { xs: 2, sm: 3, md: 5 },
        pt: { xs: 4, md: 5 },
        pb: { xs: 3, md: 4 },
        boxShadow: "0 -10px 40px rgba(33, 49, 26, 0.32)"
      }}
    >
      <Grid container spacing={{ xs: 3, md: 4 }}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Link href="/">
            <Image alt="logo" width={112} height={52} src="/assets/images/logo.svg" />
          </Link>

          <Typography
            variant="body1"
            sx={{
              mt: 1.5,
              mb: 2.5,
              maxWidth: 430,
              color: "rgba(255,255,255,0.9)",
              lineHeight: 1.7
            }}
          >
            {description}
          </Typography>

          <FooterApps appleStoreUrl="#" playStoreUrl="#" />
        </Grid>

        <Grid size={{ xs: 6, md: 3 }}>
          <Typography sx={{ color: "#F8F6EC", fontWeight: 700, mb: 1.2 }}>Shop</Typography>
          {aboutLinks.map(({ title, url }) => (
            <Link
              href={url}
              key={title}
              style={{
                display: "block",
                color: "rgba(255,255,255,0.86)",
                marginBottom: "10px",
                textDecoration: "none"
              }}
            >
              {title}
            </Link>
          ))}
        </Grid>

        <Grid size={{ xs: 6, md: 4 }}>
          <Typography sx={{ color: "#F8F6EC", fontWeight: 700, mb: 1.2 }}>Support</Typography>
          {customerLinks.map(({ title, url }) => (
            <Link
              href={url}
              key={title}
              style={{
                display: "block",
                color: "rgba(255,255,255,0.86)",
                marginBottom: "10px",
                textDecoration: "none"
              }}
            >
              {title}
            </Link>
          ))}

          <Box sx={{ mt: 1.5 }}>
            <FooterSocialLinks links={socialLinks} />
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ borderColor: "rgba(248, 246, 236, 0.22)", mt: { xs: 2.5, md: 3.5 } }} />

      <Typography variant="body2" sx={{ pt: 2, color: "rgba(255,255,255,0.82)" }}>
        &copy; {new Date().getFullYear()} Grocery Store. Fresh picks, fast delivery.
      </Typography>
    </Box>
  );
}
