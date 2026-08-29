export interface Review {
  id: string;
  targetType: "product" | "vendor";
  targetId: string;
  authorId: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
}
