import Image from "next/image";
import Avatar from "@mui/material/Avatar";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import ReviewForm from "./review-form";
// STYLED COMPONENTS
import { ReviewRoot } from "./styles";
import type Review from "models/Review.model";

type Props = {
  productId: string;
  reviews?: Review[];
};

export default function ProductReviews({ productId, reviews = [] }: Props) {
  return (
    <div>
      {/* REVIEW LIST */}
      {reviews.map((review, ind) => {
        const name =
          `${review.customer?.name?.firstName || ""} ${review.customer?.name?.lastName || ""}`.trim() ||
          review.customer?.email ||
          "Customer";

        return (
          <ReviewRoot key={ind}>
            <div className="user-info">
              <Avatar variant="rounded" className="user-avatar">
                <Image
                  src={review.customer?.avatar || "/assets/images/faces/propic.png"}
                  alt={name}
                  fill
                  sizes="(48px 48px)"
                />
              </Avatar>

              <div>
                <Typography variant="h5" sx={{ mb: 1 }}>
                  {name}
                </Typography>

                <div className="user-rating">
                  <Rating size="small" value={review.rating || 0} color="warn" readOnly />
                  <Typography variant="h6">{review.rating || 0}</Typography>
                  <Typography component="span">Verified customer</Typography>
                </div>
              </div>
            </div>

            <Typography variant="body1" sx={{ color: "grey.700" }}>
              {review.comment}
            </Typography>
          </ReviewRoot>
        );
      })}

      {reviews.length === 0 && (
        <Typography variant="body1" sx={{ color: "text.secondary", mb: 2 }}>
          No reviews yet.
        </Typography>
      )}

      <Typography variant="h3" sx={{ mt: 7, mb: 2.5 }}>
        Write a Review for this product
      </Typography>

      <ReviewForm productId={productId} />
    </div>
  );
}
