# Upload Integration Guide

This guide shows how to use the shared upload helper in frontend forms.

## Files

- Helper: `libs/upload/index.ts`
- GraphQL mutations: `apollo/user/mutation.ts`

## Exposed helper APIs

```ts
uploadSingleImage(file, target, token?)
uploadMultipleImages(files, target, token?)
uploadByField(file, field, token?)
uploadManyByField(files, field, token?)
uploadMemberAvatar(file, token?)
uploadProductThumbnail(file, token?)
uploadProductGallery(files, token?)
uploadCategoryImage(file, token?)
uploadVendorImage(file, token?)
toPublicImageUrl(path, apiBaseUrl)
```

## Canonical field-to-target mapping

Use these mappings consistently to keep upload paths correct:

- `memberAvatar` -> `member`
- `productThumbnail` -> `product`
- `productGallery` -> `product`
- `vendorImage` -> `vendor`
- `categoryImage` -> `category`
- `generalImage` -> `general`

Note: `avatar` should use `member` target in this backend.

## Supported targets

- `member`
- `product`
- `vendor`
- `category`
- `general`

## Built-in validation

- MIME types: `image/jpeg`, `image/jpg`, `image/png`, `image/webp`
- Max file size: `15MB`
- Max files per request: `10`

## Product form pattern (thumbnail + gallery)

```ts
import { uploadSingleImage, uploadMultipleImages } from "../libs/upload";
import { createProduct } from "../libs/product";

async function submitProductForm({ thumbnailFile, imageFiles, payload, token }: any) {
  const thumbResult = await uploadSingleImage(thumbnailFile, "product", token);
  if (!thumbResult.success || !thumbResult.path) {
    throw new Error(thumbResult.error || "Thumbnail upload failed");
  }

  const imagesResult = await uploadMultipleImages(imageFiles, "product", token);
  if (!imagesResult.success) {
    throw new Error(imagesResult.error || "Images upload failed");
  }

  const result = await createProduct({
    ...payload,
    thumbnail: thumbResult.path,
    images: imagesResult.paths || []
  });

  return result;
}
```

## Category form pattern (single image)

```ts
import { uploadSingleImage } from "../libs/upload";
import { createCategory } from "../libs/admin";

async function submitCategoryForm({ imageFile, payload, token }: any) {
  const upload = await uploadSingleImage(imageFile, "category", token);
  if (!upload.success || !upload.path) {
    throw new Error(upload.error || "Category image upload failed");
  }

  return createCategory({
    ...payload,
    image: upload.path
  });
}
```

## Member avatar pattern

```ts
import { uploadMemberAvatar } from "../libs/upload";
import { updateMember } from "../libs/auth";

async function updateAvatar({ avatarFile, token }: any) {
  const upload = await uploadMemberAvatar(avatarFile, token);
  if (!upload.success || !upload.path) {
    throw new Error(upload.error || "Avatar upload failed");
  }

  return updateMember({ memberAvatar: upload.path });
}
```

## Rendering images

```ts
import { toPublicImageUrl } from "../libs/upload";

const src = toPublicImageUrl(
  pathFromApi,
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3007"
);
```

## Recommended UX flow

1. Validate files in UI (optional early feedback)
2. Upload image(s)
3. Receive path string(s)
4. Send path(s) in business mutation (`thumbnail`, `images`, `memberAvatar`, etc.)
5. Render with `toPublicImageUrl`

## Error cases to handle in UI

- Missing/expired token
- Invalid target
- Unsupported file type
- File too large
- Too many files
- Network interruption
