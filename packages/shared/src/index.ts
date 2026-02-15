export interface HealthResponse {
  status: "ok";
  service: string;
  timestamp: string;
}

export interface ArticleDto {
  id: string;
  title: string;
  sourceUrl: string;
  summary: string | null;
  postedAt: string | null;
}

export const toIsoOrNull = (date: Date | null): string | null => {
  return date ? date.toISOString() : null;
};
