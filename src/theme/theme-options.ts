import { type ThemeOptions } from "@mui/material/styles";
import { components, typography, getPalette } from "./core";
import { COLORS, type ThemeMapping } from "./types";

const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1600,
    xxl: 1920
  }
};

const themeMappings = [
  { paths: ["/grocery-1", "/"], color: COLORS.RED },
  { paths: ["/admin", "/vendor"], color: COLORS.HEALTH }
];

export default function themeOptions(pathname: string) {
  const selectedMapping = themeMappings.find((mapping) =>
    mapping.paths.some((path) => pathname.startsWith(path))
  );

  // GET THE COLOR PALETTE BASED ON THE SELECTED MAPPING
  const selectedPalette = getPalette(selectedMapping?.color || COLORS.DARK);

  const themeOption: ThemeOptions = {
    typography,
    components,
    breakpoints,
    palette: selectedPalette
  };

  return themeOption;
}
