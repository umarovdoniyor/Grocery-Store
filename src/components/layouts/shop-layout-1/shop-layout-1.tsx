import { Fragment, PropsWithChildren } from "react";
import Link from "next/link";
import Image from "next/image";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
// GLOBAL CUSTOM COMPONENTS
import {
  Footer1,
  FooterApps,
  FooterContact,
  FooterLinksWidget,
  FooterSocialLinks
} from "components/footer";
import Sticky from "components/sticky";
import { NavigationList } from "components/navbar";
import { MobileMenu } from "components/mobile-navbar";
import { MobileNavigationBar } from "components/mobile-navigation";
import { SearchInput2 } from "components/search-box";
import { Topbar, TopbarLanguageSelector, TopbarSocialLinks } from "components/topbar";
import { Header, HeaderCart, HeaderAccount, MobileHeader, HeaderSearch } from "components/header";
import LayoutSecondaryHeader from "./layout-secondary-header";
// CUSTOM DATA MODEL
import LayoutModel from "models/Layout.model";

// ==============================================================
interface Props extends PropsWithChildren {
  data: LayoutModel;
}
// ==============================================================

export default function ShopLayout1({ children, data }: Props) {
  const { footer, header, topbar, mobileNavigation } = data;

  const MOBILE_VERSION_HEADER = (
    <MobileHeader>
      <MobileHeader.Left>
        <MobileMenu navigation={header.navigation} />
      </MobileHeader.Left>

      <MobileHeader.Logo logoUrl={mobileNavigation.logo} />

      <MobileHeader.Right>
        <HeaderSearch>
          <SearchInput2 />
        </HeaderSearch>

        <HeaderAccount />
        <HeaderCart />
      </MobileHeader.Right>
    </MobileHeader>
  );

  return (
    <Fragment>
      <Topbar>
        <Topbar.Left label={topbar.label} title={topbar.title} />

        <Topbar.Right>
          <TopbarLanguageSelector languages={topbar.languageOptions} />
          <TopbarSocialLinks links={topbar.socials} />
        </Topbar.Right>
      </Topbar>

      <Sticky fixedOn={0} scrollDistance={300}>
        <Header mobileHeader={MOBILE_VERSION_HEADER}>
          <Header.Left>
            <Header.Logo url={header.logo} />
          </Header.Left>

          <Header.Mid>
            <NavigationList navigation={header.navigation} />
          </Header.Mid>

          <Header.Right>
            <HeaderAccount />
            <HeaderCart />
          </Header.Right>
        </Header>
      </Sticky>

      <LayoutSecondaryHeader header={header} />

      {children}

      <MobileNavigationBar navigation={mobileNavigation.version1} />

      <Footer1
        bgcolor="transparent"
        pt={{ xs: 6, sm: 8 }}
        sx={{
          mt: { xs: 6, md: 8 },
          position: "relative",
          "@keyframes footerRise": {
            "0%": { opacity: 0, transform: "translateY(16px)" },
            "100%": { opacity: 1, transform: "translateY(0)" }
          }
        }}
      >
        <Grid size={12}>
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              borderRadius: { xs: "20px 20px 0 0", md: 4 },
              border: "1px solid rgba(247, 244, 234, 0.2)",
              background:
                "linear-gradient(165deg, #21311A 0%, #2E4522 35%, #446127 70%, #5A7A30 100%)",
              px: { xs: 2, sm: 3, md: 5 },
              pt: { xs: 4, md: 5 },
              pb: { xs: 3, md: 4 },
              boxShadow: "0 -10px 40px rgba(33, 49, 26, 0.35)",
              "&::before": {
                content: '""',
                position: "absolute",
                width: 260,
                height: 260,
                borderRadius: "50%",
                top: -110,
                right: -40,
                background:
                  "radial-gradient(circle, rgba(248, 246, 236, 0.2) 0%, rgba(248, 246, 236, 0) 72%)"
              },
              "&::after": {
                content: '""',
                position: "absolute",
                width: 300,
                height: 300,
                borderRadius: "50%",
                bottom: -150,
                left: -100,
                background:
                  "radial-gradient(circle, rgba(164, 74, 63, 0.22) 0%, rgba(164, 74, 63, 0) 72%)"
              }
            }}
          >
            <Grid container spacing={{ xs: 3, md: 4 }}>
              <Grid
                size={{ lg: 4, sm: 6, xs: 12 }}
                sx={{ animation: "footerRise 500ms ease-out both", animationDelay: "0ms" }}
              >
                <Link href="/">
                  <Image src={footer.logo} alt="logo" width={112} height={52} />
                </Link>

                <Typography
                  variant="body1"
                  sx={{
                    mt: 1.5,
                    mb: 2,
                    maxWidth: 420,
                    color: "rgba(255,255,255,0.9)",
                    lineHeight: 1.75
                  }}
                >
                  {footer.description}
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2.5 }}>
                  {["Fresh in 30 min", "Trusted vendors", "Secure checkout"].map((item) => (
                    <Box
                      component="span"
                      key={item}
                      sx={{
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: "0.03em",
                        px: 1.25,
                        py: 0.5,
                        borderRadius: 999,
                        color: "#F8F6EC",
                        backgroundColor: "rgba(248, 246, 236, 0.14)",
                        border: "1px solid rgba(248, 246, 236, 0.24)"
                      }}
                    >
                      {item}
                    </Box>
                  ))}
                </Box>

                <Link
                  href="/products"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 999,
                    padding: "10px 20px",
                    marginBottom: "20px",
                    fontWeight: 700,
                    color: "#2B3C21",
                    backgroundColor: "#F8F6EC",
                    textDecoration: "none"
                  }}
                >
                  Start Shopping
                </Link>

                <FooterApps playStoreUrl={footer.playStoreUrl} appleStoreUrl={footer.appStoreUrl} />
              </Grid>

              <Grid
                size={{ lg: 2, sm: 6, xs: 12 }}
                sx={{ animation: "footerRise 540ms ease-out both", animationDelay: "80ms" }}
              >
                <FooterLinksWidget title="Shop" links={footer.about} />
              </Grid>

              <Grid
                size={{ lg: 3, sm: 6, xs: 12 }}
                sx={{ animation: "footerRise 580ms ease-out both", animationDelay: "120ms" }}
              >
                <FooterLinksWidget title="Support" links={footer.customers} />
              </Grid>

              <Grid
                size={{ lg: 3, sm: 6, xs: 12 }}
                sx={{ animation: "footerRise 620ms ease-out both", animationDelay: "160ms" }}
              >
                <FooterContact
                  phone={footer.contact.phone}
                  email={footer.contact.email}
                  address={footer.contact.address}
                />

                <Typography
                  sx={{ fontSize: 13, mt: 1.25, mb: 1.25, color: "rgba(255,255,255,0.72)" }}
                >
                  Open daily: 8:00 AM - 10:00 PM
                </Typography>

                <FooterSocialLinks links={footer.socials} />
              </Grid>
            </Grid>

            <Divider sx={{ borderColor: "rgba(248, 246, 236, 0.22)", mt: { xs: 3, md: 4 } }} />

            <Box
              sx={{
                py: 2,
                display: "flex",
                gap: 1.5,
                alignItems: { xs: "flex-start", md: "center" },
                justifyContent: "space-between",
                flexDirection: { xs: "column", md: "row" }
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.82)", span: { fontWeight: 700 } }}
              >
                &copy; {new Date().getFullYear()} <span>Grocery Store</span>. Curated freshness,
                every day.
              </Typography>

              <Box sx={{ display: "flex", gap: 2.25, flexWrap: "wrap" }}>
                {footer.customers.slice(0, 3).map((item) => (
                  <Link
                    href={item.url}
                    key={item.title}
                    style={{
                      color: "rgba(255,255,255,0.88)",
                      fontSize: 13,
                      textDecoration: "none"
                    }}
                  >
                    {item.title}
                  </Link>
                ))}
              </Box>
            </Box>
          </Box>
        </Grid>
      </Footer1>
    </Fragment>
  );
}
