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
import { toPublicImageUrl, uploadProductGallery, uploadProductThumbnail } from "../../../../libs/upload";
import {
  createProduct,
  getProductById,
  ProductStatus,
  ProductUnit,
  updateProduct
} from "../../../../libs/product";

// FORM FIELDS VALIDATION SCHEMA
const validationSchema = yup.object({
  name: yup.string().required("Name is required!"),
  category: yup.string().required("Category is required!"),
  description: yup.string().required("Description is required!"),
  stock: yup.string().required("Stock is required!"),
  price: yup.string().required("Price is required!"),
  sale_price: yup.string().optional(),
  tags: yup.string().required("Tags is required!"),
  brand: yup.string().optional(),
  sku: yup.string().optional(),
  unit: yup.string().required("Unit is required!"),
  status: yup.string().required("Status is required!"),
  thumbnail: yup.string().required("Thumbnail URL is required!"),
  images: yup.string().required("At least one image URL is required!")
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
    brand: "",
    sku: "",
    unit: "PCS",
    status: "PUBLISHED",
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
        setCategories((categoriesRes.list || []).map((item) => ({ id: item._id, name: item.name })));
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

    const imageList = values.images
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

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
      tags: values.tags
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      images: imageList,
      thumbnail: values.thumbnail,
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
    return <Card className="p-3">Loading product...</Card>;
  }

  return (
    <Card className="p-3">
      <FormProvider methods={methods} onSubmit={handleSubmitForm}>
        {formError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formError}
          </Alert>
        )}

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
                  color="info"
                  disabled={uploadingThumbnail || isSubmitting}
                >
                  {uploadingThumbnail ? <CircularProgress size={18} /> : "Upload Thumbnail"}
                  <input
                    hidden
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleThumbnailUpload}
                  />
                </Button>

                <Typography variant="body2" color="text.secondary">
                  Upload fills the thumbnail field automatically.
                </Typography>
              </Stack>

              {thumbnailValue && (
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
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
                      borderRadius: 1,
                      border: "1px solid",
                      borderColor: "divider"
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
                  color="info"
                  disabled={uploadingGallery || isSubmitting}
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

                <Typography variant="body2" color="text.secondary">
                  Uploaded paths are appended to the images field.
                </Typography>
              </Stack>

              {galleryPreviewImages.length > 0 && (
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    Gallery preview ({galleryPreviewImages.length})
                  </Typography>

                  <Stack direction="row" spacing={1.5} useFlexGap flexWrap="wrap">
                    {galleryPreviewImages.map((src, index) => (
                      <Box
                        key={`${src}-${index}`}
                        sx={{
                          width: 88,
                          height: 88,
                          borderRadius: 1,
                          border: "1px solid",
                          borderColor: "divider",
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
            <Button loading={isSubmitting} variant="contained" color="info" type="submit">
              {mode === "edit" ? "Update Product" : "Create Product"}
            </Button>
          </Grid>
        </Grid>
      </FormProvider>
    </Card>
  );
}
