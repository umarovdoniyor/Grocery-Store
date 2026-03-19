"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Resolver, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// MUI
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import { FormProvider, TextField } from "components/form-hook";
import { getCategories } from "../../../../libs/category";
import {
  toPublicImageUrl,
  uploadProductGallery,
  uploadProductThumbnail
} from "../../../../libs/upload";
import {
  createProduct,
  getProductById,
  ProductStatus,
  ProductUnit,
  updateProduct
} from "../../../../libs/product";

const mongoIdRegex = /^[a-f\d]{24}$/i;

const splitCommaValues = (value?: string) =>
  (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const toNumberOrNaN = (value?: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
};

// FORM FIELDS VALIDATION SCHEMA
const validationSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Name is required!")
    .min(3, "Name must be at least 3 characters")
    .max(120, "Name must be at most 120 characters"),
  category: yup
    .string()
    .required("Category is required!")
    .test("mongo-id", "Category must be a valid id", (value) => mongoIdRegex.test(value || "")),
  description: yup
    .string()
    .trim()
    .required("Description is required!")
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description must be at most 5000 characters"),
  stock: yup
    .string()
    .required("Stock is required!")
    .test("stock-int", "Stock must be an integer >= 0", (value) => {
      if (!value) return false;
      return /^\d+$/.test(value.trim());
    }),
  min_order_qty: yup
    .string()
    .optional()
    .test("min-order-int", "Minimum order must be an integer >= 1", (value) => {
      if (!value?.trim()) return true;
      return /^\d+$/.test(value.trim()) && Number(value.trim()) >= 1;
    }),
  price: yup
    .string()
    .required("Price is required!")
    .test("price-min", "Price must be at least 0.01", (value) => {
      if (!value?.trim()) return false;
      const price = toNumberOrNaN(value.trim());
      return Number.isFinite(price) && price >= 0.01;
    }),
  sale_price: yup
    .string()
    .optional()
    .test("sale-min", "Sale price must be >= 0", (value) => {
      if (!value?.trim()) return true;
      const salePrice = toNumberOrNaN(value.trim());
      return Number.isFinite(salePrice) && salePrice >= 0;
    }),
  tags: yup.string().optional(),
  brand: yup.string().trim().max(80, "Brand must be at most 80 characters").optional(),
  sku: yup.string().trim().max(80, "SKU must be at most 80 characters").optional(),
  unit: yup.string().required("Unit is required!"),
  status: yup.string().required("Status is required!"),
  thumbnail: yup.string().optional(),
  images: yup
    .string()
    .required("At least one image URL is required!")
    .test("images-list", "At least one image URL is required!", (value) => {
      return splitCommaValues(value).length > 0;
    })
});

type FormValues = yup.InferType<typeof validationSchema>;

// ================================================================
interface Props {
  mode?: "create" | "edit";
  productId?: string;
  basePath?: string;
}
// ================================================================

export default function ProductForm({
  mode = "create",
  productId,
  basePath = "/admin/products"
}: Props) {
  const isAdminUi = basePath.startsWith("/admin");
  const accentColor = isAdminUi ? "#4F46E5" : "#14B8A6";
  const accentDark = isAdminUi ? "#4338CA" : "#0F766E";

  const router = useRouter();
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [loadingInitial, setLoadingInitial] = useState(mode === "edit");
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const initialValues: FormValues = {
    name: "",
    tags: "",
    stock: "",
    min_order_qty: "",
    brand: "",
    sku: "",
    unit: "PCS",
    status: "DRAFT",
    thumbnail: "",
    images: "",
    price: "",
    sale_price: "",
    description: "",
    category: ""
  };

  const methods = useForm<FormValues>({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema) as Resolver<FormValues>
  });

  const {
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState: { isSubmitting }
  } = methods;

  const thumbnailValue = watch("thumbnail");
  const imageUrlsValue = watch("images");

  const getApiBaseUrl = () => {
    const explicitBase = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.REACT_APP_API_BASE_URL;
    if (explicitBase) return explicitBase;

    const graphQlUrl =
      process.env.NEXT_PUBLIC_API_GRAPHQL_URL ||
      process.env.REACT_APP_API_GRAPHQL_URL ||
      "http://localhost:3007/graphql";

    try {
      const parsed = new URL(graphQlUrl);
      return `${parsed.protocol}//${parsed.host}`;
    } catch {
      return graphQlUrl.replace(/\/graphql\/?$/, "");
    }
  };

  const toPreviewSrc = (value?: string) => {
    if (!value) return "";

    const normalized = value.trim().replace(/\\/g, "/");
    if (!normalized) return "";

    if (
      normalized.startsWith("blob:") ||
      normalized.startsWith("http://") ||
      normalized.startsWith("https://") ||
      normalized.startsWith("data:")
    ) {
      return normalized;
    }

    const apiBaseUrl = getApiBaseUrl();
    return apiBaseUrl ? toPublicImageUrl(normalized, apiBaseUrl) : normalized;
  };

  const galleryPreviewImages = imageUrlsValue
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map(toPreviewSrc)
    .filter(Boolean);

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    const current = getValues("images")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const next = current.filter((_, index) => index !== indexToRemove);
    setValue("images", next.join(", "), { shouldDirty: true, shouldValidate: true });
  };

  const handleThumbnailUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || uploadingThumbnail) return;

    setFormError(null);
    setUploadingThumbnail(true);

    try {
      const uploadResult = await uploadProductThumbnail(file);
      if (!uploadResult.success || !uploadResult.path) {
        setFormError(uploadResult.error || "Failed to upload thumbnail");
        return;
      }

      setValue("thumbnail", uploadResult.path, { shouldDirty: true, shouldValidate: true });
    } catch (error: any) {
      setFormError(error?.message || "Failed to upload thumbnail");
    } finally {
      setUploadingThumbnail(false);
      event.target.value = "";
    }
  };

  const handleGalleryUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length || uploadingGallery) return;

    setFormError(null);
    setUploadingGallery(true);

    try {
      const uploadResult = await uploadProductGallery(files);
      if (!uploadResult.success || !uploadResult.paths?.length) {
        setFormError(uploadResult.error || "Failed to upload images");
        return;
      }

      const existing = getValues("images")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const merged = [...existing, ...uploadResult.paths].join(", ");
      setValue("images", merged, { shouldDirty: true, shouldValidate: true });
    } catch (error: any) {
      setFormError(error?.message || "Failed to upload images");
    } finally {
      setUploadingGallery(false);
      event.target.value = "";
    }
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const categoriesRes = await getCategories({ page: 1, limit: 200, status: "ACTIVE" });
      if (mounted && categoriesRes.success) {
        setCategories(
          (categoriesRes.list || []).map((item) => ({ id: item._id, name: item.name }))
        );
      }

      if (mode === "edit" && productId) {
        const productRes = await getProductById(productId);

        if (!mounted) return;

        if (!productRes.success || !productRes.product) {
          setFormError(productRes.error || "Failed to load product");
          setLoadingInitial(false);
          return;
        }

        const product = productRes.product;
        reset({
          name: product.title || "",
          category: product.categoryIds?.[0] || "",
          description: product.description || "",
          stock: String(product.stockQty || ""),
          min_order_qty: product.minOrderQty ? String(product.minOrderQty) : "",
          price: String(product.price || ""),
          sale_price: product.salePrice ? String(product.salePrice) : "",
          tags: (product.tags || []).join(", "),
          brand: product.brand || "",
          sku: product.sku || "",
          unit: product.unit || "PCS",
          status: product.status || "PUBLISHED",
          thumbnail: product.thumbnail || "",
          images: (product.images || []).join(", ")
        });

        setLoadingInitial(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [mode, productId, reset]);

  // FORM SUBMIT HANDLER
  const handleSubmitForm = handleSubmit(async (values) => {
    setFormError(null);

    const sanitizeSubmittedUrl = (rawValue?: string) => {
      const normalized = (rawValue || "").trim().replace(/\\/g, "/");
      if (!normalized) return "";

      if (normalized.startsWith("blob:") || normalized.startsWith("data:")) {
        return "";
      }

      return normalized;
    };

    const imageList = splitCommaValues(values.images)
      .map((item) => sanitizeSubmittedUrl(item))
      .filter(Boolean);

    if (!imageList.length) {
      setFormError("At least one valid image URL is required");
      return;
    }

    const minOrderQtyValue = values.min_order_qty?.trim()
      ? Number(values.min_order_qty.trim())
      : undefined;

    const payload = {
      title: values.name,
      description: values.description,
      categoryIds: [values.category],
      brand: values.brand || undefined,
      sku: values.sku || undefined,
      unit: values.unit as ProductUnit,
      price: Number(values.price),
      salePrice: values.sale_price ? Number(values.sale_price) : undefined,
      stockQty: Number(values.stock),
      minOrderQty: minOrderQtyValue,
      tags: splitCommaValues(values.tags),
      images: imageList,
      thumbnail: sanitizeSubmittedUrl(values.thumbnail) || undefined,
      status: values.status as ProductStatus
    };

    const response =
      mode === "edit" && productId
        ? await updateProduct({ productId, ...payload })
        : await createProduct(payload);

    if (!response.success) {
      setFormError(response.error || "Failed to save product");
      return;
    }

    router.push(basePath);
  });

  if (loadingInitial) {
    return (
      <Card
        sx={{
          p: 3,
          borderRadius: "10px",
          border: "1px solid #D1D5DB",
          boxShadow: "0 8px 20px rgba(15, 23, 42, 0.05)",
          color: "#374151"
        }}
      >
        Loading product...
      </Card>
    );
  }

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
        {formError && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              color: "#991B1B",
              border: "1px solid #FCA5A5",
              backgroundColor: "#FEF2F2"
            }}
          >
            {formError}
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
                select
                fullWidth
                color="info"
                size="medium"
                name="category"
                placeholder="Category"
                label="Select Category"
              >
                {categories.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ sm: 6, xs: 12 }}>
              <TextField
                fullWidth
                name="brand"
                color="info"
                size="medium"
                label="Brand"
                placeholder="Brand"
              />
            </Grid>

            <Grid size={{ sm: 6, xs: 12 }}>
              <TextField
                fullWidth
                name="sku"
                color="info"
                size="medium"
                label="SKU"
                placeholder="SKU"
              />
            </Grid>

            <Grid size={{ sm: 6, xs: 12 }}>
              <TextField select fullWidth color="info" size="medium" name="unit" label="Unit">
                <MenuItem value="PCS">PCS</MenuItem>
                <MenuItem value="KG">KG</MenuItem>
                <MenuItem value="G">G</MenuItem>
                <MenuItem value="L">L</MenuItem>
                <MenuItem value="ML">ML</MenuItem>
                <MenuItem value="PACK">PACK</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ sm: 6, xs: 12 }}>
              <TextField select fullWidth color="info" size="medium" name="status" label="Status">
                <MenuItem value="DRAFT">DRAFT</MenuItem>
                <MenuItem value="PUBLISHED">PUBLISHED</MenuItem>
                <MenuItem value="ARCHIVED">ARCHIVED</MenuItem>
              </TextField>
            </Grid>

            <Grid size={12}>
              <TextField
                rows={6}
                multiline
                fullWidth
                color="info"
                size="medium"
                name="description"
                label="Description"
                placeholder="Description"
              />
            </Grid>

            <Grid size={{ sm: 6, xs: 12 }}>
              <TextField
                fullWidth
                name="stock"
                color="info"
                size="medium"
                label="Stock"
                placeholder="Stock"
              />
            </Grid>

            <Grid size={{ sm: 6, xs: 12 }}>
              <TextField
                fullWidth
                name="min_order_qty"
                color="info"
                size="medium"
                type="number"
                label="Minimum Order Qty"
                placeholder="Minimum Order Qty"
              />
            </Grid>

            <Grid size={{ sm: 6, xs: 12 }}>
              <TextField
                fullWidth
                name="tags"
                label="Tags"
                color="info"
                size="medium"
                placeholder="Tags"
              />
            </Grid>

            <Grid size={{ sm: 6, xs: 12 }}>
              <TextField
                fullWidth
                name="price"
                color="info"
                size="medium"
                type="number"
                label="Regular Price"
                placeholder="Regular Price"
              />
            </Grid>

            <Grid size={{ sm: 6, xs: 12 }}>
              <TextField
                fullWidth
                color="info"
                size="medium"
                type="number"
                name="sale_price"
                label="Sale Price"
                placeholder="Sale Price"
              />
            </Grid>

            <Grid size={12}>
              <Stack spacing={1.5}>
                <TextField
                  fullWidth
                  name="thumbnail"
                  color="info"
                  size="medium"
                  label="Thumbnail URL"
                  placeholder="https://..."
                />

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems="center">
                  <Button
                    component="label"
                    variant="outlined"
                    disabled={uploadingThumbnail || isSubmitting}
                    sx={{
                      color: accentDark,
                      borderColor: accentColor,
                      "&:hover": {
                        borderColor: accentDark,
                        backgroundColor: isAdminUi
                          ? "rgba(79, 70, 229, 0.08)"
                          : "rgba(20, 184, 166, 0.08)"
                      }
                    }}
                  >
                    {uploadingThumbnail ? <CircularProgress size={18} /> : "Upload Thumbnail"}
                    <input
                      hidden
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleThumbnailUpload}
                    />
                  </Button>

                  <Typography variant="body2" sx={{ color: "#6B7280" }}>
                    Upload fills the thumbnail field automatically.
                  </Typography>
                </Stack>

                {thumbnailValue && (
                  <Stack spacing={1}>
                    <Typography variant="body2" sx={{ color: "#6B7280" }}>
                      Thumbnail preview
                    </Typography>

                    <Box
                      component="img"
                      src={toPreviewSrc(thumbnailValue)}
                      alt="Thumbnail preview"
                      sx={{
                        width: 120,
                        height: 120,
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid",
                        borderColor: "#D1D5DB"
                      }}
                    />
                  </Stack>
                )}
              </Stack>
            </Grid>

            <Grid size={12}>
              <Stack spacing={1.5}>
                <TextField
                  rows={3}
                  multiline
                  fullWidth
                  name="images"
                  color="info"
                  size="medium"
                  label="Image URLs (comma-separated)"
                  placeholder="https://img1.jpg, https://img2.jpg"
                />

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems="center">
                  <Button
                    component="label"
                    variant="outlined"
                    disabled={uploadingGallery || isSubmitting}
                    sx={{
                      color: accentDark,
                      borderColor: accentColor,
                      "&:hover": {
                        borderColor: accentDark,
                        backgroundColor: isAdminUi
                          ? "rgba(79, 70, 229, 0.08)"
                          : "rgba(20, 184, 166, 0.08)"
                      }
                    }}
                  >
                    {uploadingGallery ? <CircularProgress size={18} /> : "Upload Gallery Images"}
                    <input
                      hidden
                      multiple
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleGalleryUpload}
                    />
                  </Button>

                  <Typography variant="body2" sx={{ color: "#6B7280" }}>
                    Uploaded paths are appended to the images field.
                  </Typography>
                </Stack>

                {galleryPreviewImages.length > 0 && (
                  <Stack spacing={1}>
                    <Typography variant="body2" sx={{ color: "#6B7280" }}>
                      Gallery preview ({galleryPreviewImages.length})
                    </Typography>

                    <Stack direction="row" spacing={1.5} useFlexGap flexWrap="wrap">
                      {galleryPreviewImages.map((src, index) => (
                        <Box
                          key={`${src}-${index}`}
                          sx={{
                            width: 88,
                            height: 88,
                            borderRadius: "8px",
                            border: "1px solid",
                            borderColor: "#D1D5DB",
                            position: "relative",
                            overflow: "hidden"
                          }}
                        >
                          <Box
                            component="img"
                            src={src}
                            alt={`Gallery preview ${index + 1}`}
                            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />

                          <IconButton
                            size="small"
                            onClick={() => handleRemoveGalleryImage(index)}
                            sx={{
                              top: 4,
                              right: 4,
                              position: "absolute",
                              bgcolor: "rgba(0,0,0,0.55)",
                              color: "common.white",
                              "&:hover": { bgcolor: "rgba(0,0,0,0.75)" }
                            }}
                          >
                            <Close sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Box>
                      ))}
                    </Stack>
                  </Stack>
                )}
              </Stack>
            </Grid>

            <Grid size={{ sm: 6, xs: 12 }}>
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
                {mode === "edit" ? "Update Product" : "Create Product"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </FormProvider>
    </Card>
  );
}
