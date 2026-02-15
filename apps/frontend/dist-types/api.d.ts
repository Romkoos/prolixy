export interface ArticleItem {
    id: string;
    title: string;
    sourceUrl: string;
    summary: string | null;
}
/**
 * Fetches latest articles from the API.
 */
export declare const fetchArticles: () => Promise<readonly ArticleItem[]>;
