import { Subscription } from './Subscription';

export interface League {
  id: number;
  owner_id: number;
  name: string;
  logo: string | null;
  description: string | null;
  slug: string;
  primary_color: string;
  secondary_color: string;
  organization_id: string | null;
  created_at: string;

  subscription: Subscription | null;
}
