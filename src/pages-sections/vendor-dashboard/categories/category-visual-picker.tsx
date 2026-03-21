"use client";

import { useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { TextField as MuiTextField } from "@mui/material";
import { CATEGORY_ICON_OPTIONS, CATEGORY_IMAGE_OPTIONS } from "data/category-visual-options";

export type PickerMode = "icon" | "image";

type PickerOption = {
  label: string;
  value: string;
  tags: string[];
};

type Props = {
  open: boolean;
  mode: PickerMode;
  accentColor: string;
  accentDark: string;
  accentSoft: string;
  onClose: () => void;
  onPick: (value: string) => void;
};

const GROUP_ORDER = [
  "Fruits",
  "Vegetables",
  "Dairy & Eggs",
  "Meat & Seafood",
  "Bakery",
  "Beverages",
  "Pantry",
  "Frozen Foods",
  "Snacks",
  "Organic",
  "Other"
] as const;

function getOptionGroup(input: PickerOption): string {
  const text = `${input.label} ${input.tags.join(" ")}`.toLowerCase();

  if (text.includes("fruit")) return "Fruits";
  if (text.includes("vegetable") || text.includes("tomato") || text.includes("pepper")) {
    return "Vegetables";
  }
  if (
    text.includes("dairy") ||
    text.includes("milk") ||
    text.includes("cheese") ||
    text.includes("egg")
  ) {
    return "Dairy & Eggs";
  }
  if (
    text.includes("meat") ||
    text.includes("seafood") ||
    text.includes("beef") ||
    text.includes("chicken") ||
    text.includes("pork") ||
    text.includes("fish") ||
    text.includes("shellfish")
  ) {
    return "Meat & Seafood";
  }
  if (
    text.includes("bakery") ||
    text.includes("bread") ||
    text.includes("cake") ||
    text.includes("pastr") ||
    text.includes("cookie")
  ) {
    return "Bakery";
  }
  if (
    text.includes("beverage") ||
    text.includes("water") ||
    text.includes("juice") ||
    text.includes("soda") ||
    text.includes("coffee") ||
    text.includes("tea")
  ) {
    return "Beverages";
  }
  if (
    text.includes("pantry") ||
    text.includes("grain") ||
    text.includes("rice") ||
    text.includes("pasta") ||
    text.includes("noodle") ||
    text.includes("canned") ||
    text.includes("sauce") ||
    text.includes("oil")
  ) {
    return "Pantry";
  }
  if (text.includes("frozen") || text.includes("ice cream") || text.includes("frozen meals")) {
    return "Frozen Foods";
  }
  if (
    text.includes("snack") ||
    text.includes("chip") ||
    text.includes("nut") ||
    text.includes("chocolate") ||
    text.includes("candy")
  ) {
    return "Snacks";
  }
  if (text.includes("organic") || text.includes("vegan") || text.includes("gluten")) {
    return "Organic";
  }

  return "Other";
}

function groupOptions(items: PickerOption[]) {
  return GROUP_ORDER.map((group) => ({
    group,
    items: items.filter((item) => getOptionGroup(item) === group)
  })).filter((bucket) => bucket.items.length > 0);
}

export default function CategoryVisualPicker({
  open,
  mode,
  accentColor,
  accentDark,
  accentSoft,
  onClose,
  onPick
}: Props) {
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();

  const filteredIconOptions = useMemo(
    () =>
      CATEGORY_ICON_OPTIONS.filter((item) => {
        if (!normalizedQuery) return true;
        return (
          item.label.toLowerCase().includes(normalizedQuery) ||
          item.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
        );
      }),
    [normalizedQuery]
  );

  const filteredImageOptions = useMemo(
    () =>
      CATEGORY_IMAGE_OPTIONS.filter((item) => {
        if (!normalizedQuery) return true;
        return (
          item.label.toLowerCase().includes(normalizedQuery) ||
          item.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
        );
      }),
    [normalizedQuery]
  );

  const groupedIconOptions = useMemo(
    () => groupOptions(filteredIconOptions),
    [filteredIconOptions]
  );
  const groupedImageOptions = useMemo(
    () => groupOptions(filteredImageOptions),
    [filteredImageOptions]
  );

  const handleClose = () => {
    setQuery("");
    onClose();
  };

  const handlePick = (value: string) => {
    onPick(value);
    setQuery("");
  };

  const noMatches = (mode === "icon" ? filteredIconOptions : filteredImageOptions).length === 0;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: "10px",
            border: "1px solid #D1D5DB"
          }
        }
      }}
    >
      <Box p={3}>
        <Typography variant="h6" mb={2}>
          {mode === "icon" ? "Choose Icon" : "Choose Image"}
        </Typography>

        <MuiTextField
          fullWidth
          size="small"
          placeholder="Search options..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        <Box sx={{ maxHeight: 460, overflowY: "auto", pr: 0.5, mt: 2 }}>
          {mode === "icon" ? (
            <Stack spacing={2}>
              {groupedIconOptions.map((bucket) => (
                <Box key={bucket.group}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    mb={1}
                    sx={{
                      position: "sticky",
                      top: 0,
                      py: 0.5,
                      zIndex: 1,
                      backgroundColor: "background.paper"
                    }}
                  >
                    {bucket.group}
                  </Typography>
                  <Grid container spacing={1.5}>
                    {bucket.items.map((option) => (
                      <Grid
                        key={`${bucket.group}-${option.value}-${option.label}`}
                        size={{ xs: 6, sm: 4, md: 3 }}
                      >
                        <Button
                          fullWidth
                          variant="outlined"
                          sx={{
                            justifyContent: "flex-start",
                            py: 1.25,
                            color: accentDark,
                            borderColor: accentColor,
                            "&:hover": {
                              borderColor: accentDark,
                              backgroundColor: accentSoft
                            }
                          }}
                          onClick={() => handlePick(option.value)}
                        >
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography fontSize={20}>{option.value}</Typography>
                            <Typography variant="body2">{option.label}</Typography>
                          </Stack>
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}
            </Stack>
          ) : (
            <Stack spacing={2}>
              {groupedImageOptions.map((bucket) => (
                <Box key={bucket.group}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    mb={1}
                    sx={{
                      position: "sticky",
                      top: 0,
                      py: 0.5,
                      zIndex: 1,
                      backgroundColor: "background.paper"
                    }}
                  >
                    {bucket.group}
                  </Typography>
                  <Grid container spacing={1.5}>
                    {bucket.items.map((option) => (
                      <Grid
                        key={`${bucket.group}-${option.value}-${option.label}`}
                        size={{ xs: 6, sm: 4 }}
                      >
                        <Button
                          fullWidth
                          variant="outlined"
                          sx={{
                            justifyContent: "flex-start",
                            py: 1.25,
                            color: accentDark,
                            borderColor: accentColor,
                            "&:hover": {
                              borderColor: accentDark,
                              backgroundColor: accentSoft
                            }
                          }}
                          onClick={() => handlePick(option.value)}
                        >
                          <Stack direction="row" spacing={1.25} alignItems="center">
                            <Box
                              sx={{ width: 36, height: 36, borderRadius: 1, overflow: "hidden" }}
                            >
                              <Box
                                component="img"
                                src={option.value}
                                alt={option.label}
                                sx={{ width: 36, height: 36, objectFit: "cover" }}
                              />
                            </Box>
                            <Typography variant="body2">{option.label}</Typography>
                          </Stack>
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}
            </Stack>
          )}
        </Box>

        {noMatches && (
          <Alert severity="info" sx={{ mt: 2 }}>
            No options matched your search.
          </Alert>
        )}

        <Stack direction="row" justifyContent="flex-end" mt={2}>
          <Button variant="text" onClick={handleClose}>
            Close
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
}
