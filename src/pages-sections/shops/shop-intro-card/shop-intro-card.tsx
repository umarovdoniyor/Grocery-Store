import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
// MUI ICON COMPONENTS
import Call from "@mui/icons-material/Call";
import Place from "@mui/icons-material/Place";
// GLOBAL CUSTOM COMPONENTS
import { FlexBetween, FlexBox } from "components/flex-box";
// CUSTOM ICON COMPONENTS
import TwitterFilled from "icons/TwitterFilled";
import YoutubeFilled from "icons/YoutubeFilled";
import FacebookFilled from "icons/FacebookFilled";
import InstagramFilled from "icons/InstagramFilled";
// CUSTOM DATA MODEL
import Shop from "models/Shop.model";

// =======================================================
type Props = { shop: Shop };
// =======================================================

export default function ShopIntroCard({ shop }: Props) {
  const { name, phone, address, coverPicture, profilePicture, socialLinks, email } = shop;
  const trimmedEmail = email?.trim() || "";
  const trimmedPhone = phone?.trim() || "";
  const hasContactEmail = Boolean(trimmedEmail);
  const hasCallablePhone = Boolean(trimmedPhone && trimmedPhone !== "-");

  const emailHref = hasContactEmail
    ? `mailto:${trimmedEmail}?subject=${encodeURIComponent(`Inquiry about ${name}`)}`
    : null;
  const phoneHref = hasCallablePhone ? `tel:${trimmedPhone.replace(/\s+/g, "")}` : null;
  const contactHref = emailHref || phoneHref;
  const contactLabel = hasContactEmail
    ? "Contact Vendor"
    : hasCallablePhone
      ? "Call Vendor"
      : "Contact Vendor";

  const socials = [
    { Icon: FacebookFilled, url: socialLinks.facebook },
    { Icon: TwitterFilled, url: socialLinks.twitter },
    { Icon: YoutubeFilled, url: socialLinks.youtube },
    { Icon: InstagramFilled, url: socialLinks.instagram }
  ];

  return (
    <Card
      sx={{
        mb: 4,
        pb: 2.5,
        borderRadius: 3,
        overflow: "hidden",
        border: "1px solid rgba(90, 112, 64, 0.16)",
        boxShadow: "0 10px 28px rgba(33, 49, 26, 0.08)",
        backgroundColor: "#f7f4ea"
      }}
    >
      <Box
        height="216px"
        sx={{
          backgroundImage: `linear-gradient(180deg, rgba(20, 34, 12, 0.28) 0%, rgba(20, 34, 12, 0.42) 100%), url(${coverPicture})`,
          backgroundPosition: "center",
          backgroundSize: "cover"
        }}
      />

      <FlexBox mt={-8} px={3.75} flexWrap="wrap">
        <Avatar
          alt={name}
          src={profilePicture}
          variant="rounded"
          sx={{
            mr: "37px",
            width: "120px",
            height: "120px",
            border: "3px solid",
            borderColor: "#fff",
            boxShadow: "0 8px 24px rgba(20, 34, 12, 0.18)"
          }}
        />

        <Box
          sx={{
            flex: "1 1 0",
            minWidth: "250px",
            "@media only screen and (max-width: 500px)": { marginLeft: 0 }
          }}
        >
          <FlexBetween flexWrap="wrap" mt={0.375} mb={3}>
            <Box
              my={1}
              p="6px 16px"
              borderRadius="999px"
              display="inline-block"
              bgcolor="rgba(255,255,255,0.88)"
              border="1px solid rgba(90, 112, 64, 0.18)"
            >
              <Typography variant="h3" sx={{ color: "#2d411f", fontWeight: 700 }}>
                {name}
              </Typography>
            </Box>

            <FlexBox my={1} gap={1.5}>
              {socials.map(({ Icon, url }, index) =>
                url ? (
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer noopener"
                    key={index}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 999,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#3f5a27",
                      background: "rgba(255,255,255,0.88)",
                      border: "1px solid rgba(90, 112, 64, 0.18)"
                    }}
                  >
                    <Icon sx={{ fontSize: 20 }} />
                  </a>
                ) : null
              )}
            </FlexBox>
          </FlexBetween>

          <FlexBetween flexWrap="wrap">
            <div>
              <FlexBox color="grey.600" gap={1} mb={1} maxWidth={270}>
                <Place fontSize="small" sx={{ fontSize: 18, mt: "3px" }} />
                <Typography component="span" sx={{ color: "grey.600" }}>
                  {address}
                </Typography>
              </FlexBox>

              <FlexBox color="grey.600" gap={1} mb={1}>
                <Call fontSize="small" sx={{ fontSize: 18, mt: "2px" }} />
                <Typography component="span" sx={{ color: "grey.600" }}>
                  {phone}
                </Typography>
              </FlexBox>
            </div>

            {contactHref ? (
              <Button
                component="a"
                href={contactHref}
                variant="contained"
                color="primary"
                sx={{
                  my: 1.5,
                  px: 2.25,
                  borderRadius: 999,
                  fontWeight: 700,
                  textTransform: "none",
                  background: "linear-gradient(135deg, #6f8f44 0%, #4f6d2f 100%)",
                  boxShadow: "0 8px 18px rgba(51, 80, 30, 0.25)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #64813d 0%, #446127 100%)"
                  }
                }}
              >
                {contactLabel}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                disabled
                sx={{ my: 1.5, borderRadius: 999 }}
              >
                {contactLabel}
              </Button>
            )}
          </FlexBetween>
        </Box>
      </FlexBox>
    </Card>
  );
}
