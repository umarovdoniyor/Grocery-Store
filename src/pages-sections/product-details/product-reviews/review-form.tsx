"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// MUI
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
// GLOBAL CUSTOM COMPONENTS
import { FormProvider, TextField } from "components/form-hook";
import {
  createProductReview,
  getMyProductReview,
  removeProductReview,
  updateProductReview
} from "../../../../libs/review";
import { getJwtToken } from "../../../../libs/auth";
// STYLED COMPONENTS
import { RatingGroup } from "./styles";

const validationSchema = yup.object().shape({
  rating: yup.number().required("Rating is required!"),
  comment: yup.string().required("Comment is required!")
});

type Props = {
  productId: string;
};

export default function ReviewForm({ productId }: Props) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [existingReviewId, setExistingReviewId] = useState<string | null>(null);
  const [isLoadingExisting, setIsLoadingExisting] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const isLoggedIn = Boolean(getJwtToken());

  const initialValues = {
    rating: 0,
    comment: ""
  };

  const methods = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema)
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = methods;

  useEffect(() => {
    let mounted = true;

    const loadMyReview = async () => {
      if (!isLoggedIn) {
        setExistingReviewId(null);
        return;
      }

      setIsLoadingExisting(true);
      const response = await getMyProductReview(productId);

      if (!mounted) return;

      if (response.success && response.review) {
        setExistingReviewId(response.review._id);
        reset({
          rating: Number(response.review.rating || 0),
          comment: response.review.comment || ""
        });
      } else {
        setExistingReviewId(null);
      }

      setIsLoadingExisting(false);
    };

    loadMyReview();

    return () => {
      mounted = false;
    };
  }, [isLoggedIn, productId, reset]);

  // FORM SUBMIT HANDLER
  const handleSubmitForm = handleSubmit(async (values) => {
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!isLoggedIn) {
      setSubmitError("Please log in to write a review.");
      return;
    }

    const payload = {
      rating: Number(values.rating || 0),
      comment: values.comment,
      images: [] as string[]
    };

    const response = existingReviewId
      ? await updateProductReview({ reviewId: existingReviewId, ...payload })
      : await createProductReview({ productId, ...payload });

    if (!response.success) {
      const rawError = response.error || "Failed to submit review.";
      if (rawError.includes("Only verified buyers can review this product")) {
        setSubmitError(
          "Only verified buyers can review this product. Your order may be in an ineligible status (for example: canceled)."
        );
      } else {
        setSubmitError(rawError);
      }
      return;
    }

    if (!existingReviewId && response.review?._id) {
      setExistingReviewId(response.review._id);
    }

    setSubmitSuccess(
      existingReviewId
        ? "Review updated. It may appear after moderation."
        : "Review submitted. It may appear after moderation."
    );
  });

  const handleRemoveReview = async () => {
    if (!existingReviewId) return;

    setSubmitError(null);
    setSubmitSuccess(null);
    setIsRemoving(true);

    const response = await removeProductReview(existingReviewId);

    if (!response.success || !response.removed) {
      setSubmitError(response.error || "Failed to remove review.");
      setIsRemoving(false);
      return;
    }

    setExistingReviewId(null);
    reset({ rating: 0, comment: "" });
    setSubmitSuccess("Your review has been removed.");
    setIsRemoving(false);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmitForm}>
      {!isLoggedIn && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          Please <Link href="/login">log in</Link> to write a review.
        </Typography>
      )}

      {isLoggedIn && isLoadingExisting && (
        <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <CircularProgress size={16} />
          <Typography variant="body2" color="text.secondary">
            Checking your existing review...
          </Typography>
        </Box>
      )}

      {isLoggedIn && existingReviewId && !isLoadingExisting && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          You already reviewed this product. Submitting will update your review and send it back to
          moderation.
        </Typography>
      )}

      <RatingGroup>
        <Typography
          variant="h6"
          sx={{ color: "grey.700", span: { color: "error.main" } }}
          color="grey.700"
        >
          Your Rating <span>*</span>
        </Typography>

        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <Rating
              color="warn"
              size="medium"
              name={field.name}
              value={field.value}
              disabled={!isLoggedIn || isLoadingExisting}
              onChange={(_, value) => field.onChange(value)}
            />
          )}
        />
      </RatingGroup>

      <Box mb={3}>
        <Typography
          variant="h6"
          sx={{ mb: 1, color: "grey.700", span: { color: "error.main" } }}
          color="grey.700"
        >
          Your Review <span>*</span>
        </Typography>

        <TextField
          rows={8}
          multiline
          fullWidth
          name="comment"
          variant="outlined"
          disabled={!isLoggedIn || isLoadingExisting}
          placeholder="Write a review here..."
        />
      </Box>

      <Button
        loading={isSubmitting}
        variant="contained"
        color="primary"
        type="submit"
        disabled={!isLoggedIn || isLoadingExisting || isRemoving}
      >
        {existingReviewId ? "Update Review" : "Submit"}
      </Button>

      {existingReviewId && (
        <Button
          sx={{ ml: 1.5 }}
          variant="outlined"
          color="error"
          onClick={handleRemoveReview}
          disabled={isLoadingExisting || isSubmitting || isRemoving}
        >
          {isRemoving ? "Removing..." : "Remove Review"}
        </Button>
      )}

      {submitError && (
        <Typography variant="body2" color="error.main" sx={{ mt: 1.5 }}>
          {submitError}
        </Typography>
      )}

      {submitSuccess && (
        <Typography variant="body2" color="success.main" sx={{ mt: 1.5 }}>
          {submitSuccess}
        </Typography>
      )}
    </FormProvider>
  );
}
