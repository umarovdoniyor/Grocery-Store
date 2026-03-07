import Link from "next/link";
import Image from "next/image";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
// LOCAL CUSTOM COMPONENTS
import { FooterApps } from "./footer-apps";
import { FooterSocialLinks } from "./footer-social-links";
// STYLED COMPONENTS
import { StyledFooter, StyledLink } from "./styles";
import type { Footer as FooterModel } from "models/Layout.model";

const footerFallback = {
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Auctor libero id et, in gravida.",
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
  const customerLinks = footer?.customers?.length ? footer.customers : footerFallback.customers;
  const socialLinks = footer?.socials || footerFallback.socials;

  return (
    <StyledFooter>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Link href="/">
            <Image alt="logo" width={105} height={50} src="/assets/images/logo.svg" />
          </Link>

          <Typography variant="body1" sx={{ mt: 3, mb: 2.5, maxWidth: 370 }}>
            {description}
          </Typography>

          <FooterApps appleStoreUrl="#" playStoreUrl="#" />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <div className="links">
            {customerLinks.map(({ title, url }) => (
              <StyledLink href={url} key={title}>
                {title}
              </StyledLink>
            ))}
          </div>

          <FooterSocialLinks links={socialLinks} />
        </Grid>
      </Grid>
    </StyledFooter>
  );
}
