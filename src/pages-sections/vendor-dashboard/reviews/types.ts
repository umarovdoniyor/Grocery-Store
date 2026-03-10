export interface Review {
  name: string;
  image: string;
  rating: number;
  comment: string;
  customer: string;
}

export interface ReviewSummary {
  ratingAvg: number;
  reviewsCount: number;
  rating1Count: number;
  rating2Count: number;
  rating3Count: number;
  rating4Count: number;
  rating5Count: number;
}
