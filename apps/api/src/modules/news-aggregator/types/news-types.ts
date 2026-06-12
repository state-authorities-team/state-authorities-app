export interface ScrapeSelectors {
  container: string;
  title: string;
  url: string;
  date: string;
}

export interface NewsDataInput {
  title: string;
  url: string;
  publishedAt: Date;
}

export interface TestableNewsSyncService<T> {
  newsDataService: T;
}
