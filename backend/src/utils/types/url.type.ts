export type CreateShortUrlBody = {
   originalUrl: string,
   customAlias?: string 
};

export type ShortUrlResponse = {
  shortId: string;
  shortUrl: string;
  isCustom: boolean;
  visitCount: number
};
export type CreatShortUrlResult = {
  shortId: string;
  isNew: boolean;
  isCustom: boolean;
  visitCount: number;
};