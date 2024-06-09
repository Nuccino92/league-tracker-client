// TODO: possibly implement multiple team models for website/control-panel

export interface BaseTeam {
  id: number;
  name: string;
  logo: string | null;
}

export interface Team {
  id?: number;
  name: string;
  logo: string | null;
  description: string;
  primary_color: string;
  secondary_color: string;
}
