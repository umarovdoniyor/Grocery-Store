"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// MUI
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { TextField as MuiTextField } from "@mui/material";
import { FormProvider, TextField } from "components/form-hook";
import {
  createCategory,
  getCategoriesByAdmin,
  updateCategory,
  type Category
} from "../../../../libs/admin";
import { CATEGORY_ICON_OPTIONS, CATEGORY_IMAGE_OPTIONS } from "data/category-visual-options";

// FORM FIELDS VALIDATION
const validationSchema = yup.object().shape({
  name: yup.string().trim().required("Name is required"),
  slug: yup.string().trim().required("Slug is required"),
  description: yup.string().trim().required("Description is required"),
  icon: yup.string().trim().optional(),
  image: yup
    .string()
    .trim()
    .test("is-url-or-upload-path", "Image must be a valid URL or uploaded path", (value) => {
      if (!value) return true;
      return /^https?:\/\//i.test(value) || value.startsWith("/");
    })
    .optional(),
  status: yup.mixed<"ACTIVE" | "INACTIVE">().oneOf(["ACTIVE", "INACTIVE"]).required(),
  sortOrder: yup
    .number()
    .typeError("Sort order must be a number")
    .integer("Sort order must be an integer")
    .min(0, "Sort order cannot be negative")
    .required("Sort order is required"),
  parentId: yup.string().optional()
});

type CreateCategoryFormValues = {
  name: string;
  slug: string;
  description: string;
  icon?: string;
  image?: string;
  status: "ACTIVE" | "INACTIVE";
  sortOrder: number;
  parentId?: string;
};

type CreateCategoryFormInput = {
  name: string;
  slug: string;
  description: string;
  icon: string | undefined;
  image: string | undefined;
  status: "ACTIVE" | "INACTIVE";
  sortOrder: number;
  parentId: string | undefined;
};

type PickerMode = "icon" | "image";

type Props = {
  mode?: "create" | "edit";
  category?: Category | null;
  uiMode?: "vendor" | "admin";
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

function getOptionGroup(input: { label: string; tags: string[] }): string {
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

function groupOptions<T extends { label: string; tags: string[] }>(items: T[]) {
  return GROUP_ORDER.map((group) => ({
    group,
    items: items.filter((item) => getOptionGroup(item) === group)
  })).filter((bucket) => bucket.items.length > 0);
}

function getDefaultValues(category?: Category | null): CreateCategoryFormInput {
  return {
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || "",
    icon: category?.icon || "",
    image: category?.image || "",
    status: category?.status || "ACTIVE",
    sortOrder: category?.sortOrder || 0,
    parentId: category?.parentId || ""
  };
}

export default function CategoryForm({
  mode = "create",
  category = null,
  uiMode = "vendor"
}: Props) {
  const accentColor = uiMode === "admin" ? "#4F46E5" : "#14B8A6";
  const accentDark = uiMode === "admin" ? "#4338CA" : "#0F766E";
  const accentSoft = uiMode === "admin" ? "rgba(79, 70, 229, 0.08)" : "rgba(20, 184, 166, 0.08)";

  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [parents, setParents] = useState<Category[]>([]);
  const [loadingParents, setLoadingParents] = useState(true);
  const [pickerMode, setPickerMode] = useState<PickerMode>("icon");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerQuery, setPickerQuery] = useState("");

  const methods = useForm<CreateCategoryFormInput, unknown, CreateCategoryFormValues>({
    defaultValues: getDefaultValues(category),
    resolver: yupResolver(validationSchema)
  });

  const {
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting }
  } = methods;

  const watchedName = watch("name");
  const watchedSlug = watch("slug");
  const watchedIcon = watch("icon");
  const watchedImage = watch("image");

  useEffect(() => {
    reset(getDefaultValues(category));
  }, [category, reset]);

  const normalizedQuery = pickerQuery.trim().toLowerCase();

  const filteredIconOptions = CATEGORY_ICON_OPTIONS.filter((item) => {
    if (!normalizedQuery) return true;
    return (
      item.label.toLowerCase().includes(normalizedQuery) ||
      item.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
    );
  });

  const filteredImageOptions = CATEGORY_IMAGE_OPTIONS.filter((item) => {
    if (!normalizedQuery) return true;
    return (
      item.label.toLowerCase().includes(normalizedQuery) ||
      item.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
    );
  });

  const groupedIconOptions = groupOptions(filteredIconOptions);
  const groupedImageOptions = groupOptions(filteredImageOptions);

  const openPicker = (mode: PickerMode) => {
    setPickerMode(mode);
    setPickerOpen(true);
    setPickerQuery("");
  };

  const handlePickValue = (value: string) => {
    if (pickerMode === "icon") {
      setValue("icon", value, { shouldDirty: true, shouldValidate: true });
    } else {
      setValue("image", value, { shouldDirty: true, shouldValidate: true });
    }
    setPickerOpen(false);
  };

  useEffect(() => {
    let cancelled = false;

    const loadParentCategories = async () => {
      setLoadingParents(true);
      const response = await getCategoriesByAdmin({ page: 1, limit: 200, status: "ACTIVE" });

      if (!cancelled) {
        if (response.success) {
          setParents((response.list || []).filter((item) => item._id !== category?._id));
          setError(null);
        } else {
          setError(response.error || "Failed to load parent categories");
        }
        setLoadingParents(false);
      }
    };

    loadParentCategories();

    return () => {
      cancelled = true;
    };
  }, [category?._id]);

  // FORM SUBMIT HANDLER
  const handleSubmitForm = handleSubmit(async (values) => {
    setError(null);

    const saveResponse =
      mode === "edit" && category
        ? await updateCategory({
            categoryId: category._id,
            name: values.name.trim(),
            slug: values.slug.trim(),
            description: values.description.trim(),
            icon: values.icon?.trim() ? values.icon.trim() : undefined,
            image: values.image?.trim() ? values.image.trim() : undefined,
            status: values.status,
            sortOrder: Number(values.sortOrder),
            parentId: values.parentId ? values.parentId : null
          })
        : await createCategory({
            name: values.name.trim(),
            slug: values.slug.trim(),
            description: values.description.trim(),
            icon: values.icon?.trim() ? values.icon.trim() : undefined,
            image: values.image?.trim() ? values.image.trim() : undefined,
            status: values.status,
            sortOrder: Number(values.sortOrder),
            parentId: values.parentId ? values.parentId : null
          });

    if (!saveResponse.success) {
      setError(saveResponse.error || `Failed to ${mode === "edit" ? "update" : "create"} category`);
      return;
    }

    router.push("/admin/categories");
    router.refresh();
  });

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: "10px",
        border: "1px solid #D1D5DB",
        boxShadow: "0 8px 20px rgba(15, 23, 42, 0.05)"
      }}
    >
      <FormProvider methods={methods} onSubmit={handleSubmitForm}>
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              color: "#991B1B",
              border: "1px solid #FCA5A5",
              backgroundColor: "#FEF2F2"
            }}
          >
            {error}
          </Alert>
        )}

        <Box
          sx={{
            "& .MuiInputLabel-root": {
              zIndex: 1,
              color: "#6B7280"
            },
            "& .MuiInputLabel-shrink": {
              px: 0.5,
              bgcolor: "#F8FAFC"
            },
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              backgroundColor: "#F8FAFC",
              "& fieldset": {
                borderColor: "#D1D5DB"
              },
              "&:hover fieldset": {
                borderColor: accentColor
              },
              "&.Mui-focused fieldset": {
                borderColor: accentColor
              }
            },
            "& .MuiInputBase-input": {
              color: "#1F2937"
            }
          }}
        >
          <Grid container spacing={3}>
            <Grid size={{ sm: 6, xs: 12 }}>
              <TextField
                fullWidth
                name="name"
                label="Name"
                color="info"
                size="medium"
                placeholder="Name"
              />
            </Grid>

            <Grid size={{ sm: 6, xs: 12 }}>
              <TextField
                fullWidth
                name="slug"
                label="Slug"
                color="info"
                size="medium"
                placeholder="bakery"
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="description"
                label="Description"
                color="info"
                size="medium"
                placeholder="Category description"
              />
            </Grid>

            <Grid size={{ sm: 6, xs: 12 }}>
              <TextField
                fullWidth
                name="icon"
                label="Icon"
                color="info"
                size="medium"
                placeholder="Emoji or icon key"
              />
              <Button
                variant="outlined"
                sx={{
                  mt: 1,
                  color: accentDark,
                  borderColor: accentColor,
                  "&:hover": {
                    borderColor: accentDark,
                    backgroundColor: accentSoft
                  }
                }}
                onClick={() => openPicker("icon")}
                disabled={isSubmitting}
              >
                Choose Icon
              </Button>
              {watchedIcon && (
                <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography fontSize={24}>{watchedIcon}</Typography>
                  <Typography variant="caption" sx={{ color: accentDark }} fontWeight={500}>
                    Selected
                  </Typography>
                </Box>
              )}
            </Grid>

            <Grid size={{ sm: 6, xs: 12 }}>
              <TextField
                fullWidth
                name="image"
                label="Image URL"
                color="info"
                size="medium"
                placeholder="URL or local image path"
              />
              <Button
                variant="outlined"
                sx={{
                  mt: 1,
                  color: accentDark,
                  borderColor: accentColor,
                  "&:hover": {
                    borderColor: accentDark,
                    backgroundColor: accentSoft
                  }
                }}
                onClick={() => openPicker("image")}
                disabled={isSubmitting}
              >
                Choose Image
              </Button>
              {watchedImage && (
                <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1,
                      overflow: "hidden",
                      flexShrink: 0
                    }}
                  >
                    <Box
                      component="img"
                      src={watchedImage}
                      alt="Selected"
                      sx={{ width: 40, height: 40, objectFit: "cover" }}
                    />
                  </Box>
                  <Typography variant="caption" sx={{ color: accentDark }} fontWeight={500}>
                    Selected
                  </Typography>
                </Box>
              )}
            </Grid>

            <Grid size={{ sm: 6, xs: 12 }}>
              <TextField select fullWidth color="info" size="medium" name="status" label="Status">
                <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                <MenuItem value="INACTIVE">INACTIVE</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ sm: 6, xs: 12 }}>
              <TextField
                fullWidth
                type="number"
                name="sortOrder"
                label="Sort Order"
                color="info"
                size="medium"
                placeholder="1"
              />
            </Grid>

            <Grid size={{ sm: 6, xs: 12 }}>
              <TextField
                select
                fullWidth
                color="info"
                size="medium"
                name="parentId"
                label="Parent Category (Optional)"
                disabled={loadingParents}
              >
                <MenuItem value="">None</MenuItem>
                {parents.map((parent) => (
                  <MenuItem key={parent._id} value={parent._id}>
                    {parent.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={12}>
              <Button
                loading={isSubmitting}
                variant="contained"
                type="submit"
                sx={{
                  backgroundColor: accentColor,
                  color: "#F8FAFC",
                  "&:hover": {
                    backgroundColor: accentDark
                  }
                }}
              >
                {mode === "edit" ? "Update category" : "Save category"}
              </Button>
            </Grid>

            {watchedName && !watchedSlug && (
              <Grid size={12}>
                <Alert severity="info" sx={{ mt: 1 }}>
                  Tip: add a slug value (for example:{" "}
                  {watchedName.toLowerCase().replace(/\s+/g, "-")})
                </Alert>
              </Grid>
            )}
          </Grid>
        </Box>
      </FormProvider>

      <Dialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
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
            {pickerMode === "icon" ? "Choose Icon" : "Choose Image"}
          </Typography>

          <MuiTextField
            fullWidth
            size="small"
            placeholder="Search options..."
            value={pickerQuery}
            onChange={(event) => setPickerQuery(event.target.value)}
          />

          <Box sx={{ maxHeight: 460, overflowY: "auto", pr: 0.5, mt: 2 }}>
            {pickerMode === "icon" ? (
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
                            onClick={() => handlePickValue(option.value)}
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
                            onClick={() => handlePickValue(option.value)}
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

          {(pickerMode === "icon" ? filteredIconOptions.length : filteredImageOptions.length) ===
            0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              No options matched your search.
            </Alert>
          )}

          <Stack direction="row" justifyContent="flex-end" mt={2}>
            <Button variant="text" onClick={() => setPickerOpen(false)}>
              Close
            </Button>
          </Stack>
        </Box>
      </Dialog>
    </Card>
  );
}
