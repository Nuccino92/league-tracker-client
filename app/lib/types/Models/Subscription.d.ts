export interface Subscription {
  id: number;
  user_id: number;
  league_id: number | null;
  organization_id: number | null;
  ends_at: string;
  stripe_id: string;
  stripe_price: string;
  stripe_status: string;
  type: string;
  created_at: string;
  updated_at: string;
}
