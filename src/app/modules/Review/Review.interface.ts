import { Category, Comment, Review } from "@prisma/client";

export type ReviewWithRelations = Review & {
  user: {
    id: string;
    name: string | null;
    email: string;
    imageUrl: string | null;
  };
  Comment: Comment[];

};

export type CreateReviewInput = {
  category: Category;
  upVotes?: number;
  downVotes?: number;
  isPremium?: boolean;
  RatingSummary?: number;
  title: string; 
  description?: string; 
  imageUrl?: string;   
  price?: number;
 
};
