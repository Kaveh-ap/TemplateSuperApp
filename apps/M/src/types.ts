export type LiveData = {
  slug: string;
  cover: string;
  description?: string;
  start_time?: string;
  title?: string;
  user: BrodcasterUser;
};

export type BrodcasterUser = {
  username: string;
  name: string;
  share_url?: string;
  photo?: string;
};

export type VideoShoppingProduct = {
  id: string | number;
  images: any[];
};

export type livuvoEventMessage = {
  event_type: string;
  value: any;
};

//#region Enums
export enum useCaseType {
  LIST = 1,
  POST = 2,
  SCROLLING = 3,
}

export enum MediaTypeEnum {
  IMAGE = 'image',
  VIDEO = 'video',
}
//#endregion
