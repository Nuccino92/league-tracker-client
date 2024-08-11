export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  token: string;
  trial_ends_at: string | null;
}
