import type { PropsWithChildren } from "react";
import Link from "next/link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
// GLOBAL CUSTOM COMPONENTS
import LazyImage from "components/LazyImage";
import { NavLink } from "components/nav-link";
import IconComponent from "components/IconComponent";
// STYLED COMPONENTS
import { ColumnContent, StyledRoot } from "./styles";
// CUSTOM DATA MODEL
import { CategoryMenuItem, CategoryOffer } from "models/Category.model";

// ==============================================================
interface Props extends PropsWithChildren {
  minWidth?: number;
  banner?: CategoryOffer;
  list: CategoryMenuItem[];
}
// ==============================================================

export default function ColumnList({ list, children, banner, minWidth = 760 }: Props) {
  return (
    <StyledRoot elevation={5} sx={{ minWidth }}>
      <ColumnContent>
        <div className="column-left">
          <Grid container spacing={4}>
            {list.map((item, ind) => (
              <Grid size={{ md: 3 }} key={ind}>
                <div
                  className="title-link"
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  {item.img ? (
                    <Box
                      component="img"
                      src={item.img}
                      alt={item.title}
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: 0.75,
                        objectFit: "cover",
                        flexShrink: 0
                      }}
                    />
                  ) : item.icon && /^[A-Za-z][A-Za-z0-9]*$/.test(item.icon) ? (
                    <IconComponent icon={item.icon} fontSize="small" color="inherit" />
                  ) : item.icon ? (
                    <Box
                      component="span"
                      sx={{ fontSize: 16, lineHeight: 1, width: 20, textAlign: "center" }}
                    >
                      {item.icon}
                    </Box>
                  ) : null}
                  {item.title}
                </div>

                {item.children?.map((sub, ind) => (
                  <NavLink
                    className="child-link"
                    href={sub.href}
                    key={ind}
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    {sub.img ? (
                      <Box
                        component="img"
                        src={sub.img}
                        alt={sub.title}
                        sx={{
                          width: 18,
                          height: 18,
                          borderRadius: 0.5,
                          objectFit: "cover",
                          flexShrink: 0
                        }}
                      />
                    ) : sub.icon && /^[A-Za-z][A-Za-z0-9]*$/.test(sub.icon) ? (
                      <IconComponent icon={sub.icon} fontSize="small" color="inherit" />
                    ) : sub.icon ? (
                      <Box
                        component="span"
                        sx={{ fontSize: 14, lineHeight: 1, width: 18, textAlign: "center" }}
                      >
                        {sub.icon}
                      </Box>
                    ) : null}
                    {sub.title}
                  </NavLink>
                ))}
              </Grid>
            ))}
          </Grid>
        </div>

        {banner?.position === "right" ? (
          <div className="column-right">
            <Link href={banner.href}>
              <LazyImage src={banner.url} width={137} height={318} alt="banner" />
            </Link>
          </div>
        ) : null}
      </ColumnContent>

      {children}
    </StyledRoot>
  );
}
