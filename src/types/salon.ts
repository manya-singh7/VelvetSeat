export interface Salon {
  id: string;
  name: string;
  neighborhood: string;
  rating: number;
  review_count: number;
  price_tier: number;
  hero_image: string;
  ai_summary: string;
  category: string[];
  popularity_score: number;
}