export interface SeoOnPage {
  titleHead?: string;
  descriptionHead?: string;
  og_type?: string;
  og_image?: string[];
  og_url?: string;
  og_site_name?: string;
  seoSchema?: Record<string, unknown>;
  updated_time?: number;
}

export interface Breadcrumb {
  name: string;
  slug?: string;
  position: number;
  isCurrent?: boolean;
}

export interface MovieTMDB {
  type?: string;
  id?: string | number;
  season?: number;
  vote_average?: number;
  vote_count?: number;
}

export interface MovieIMDB {
  id?: string | null;
  vote_average?: number;
  vote_count?: number;
}

export interface Category {
  id?: string;
  _id?: string;
  name: string;
  slug: string;
}

export interface Country {
  id?: string;
  _id?: string;
  name: string;
  slug: string;
}

export interface Movie {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  type: string;
  thumb_url: string;
  poster_url?: string;
  content?: string;
  status?: string;
  chieurap?: boolean;
  time?: string;
  episode_current?: string;
  episode_total?: string;
  quality?: string;
  lang?: string;
  lang_key?: string[];
  notify?: string;
  showtimes?: string;
  sub_docquyen?: boolean;
  actor?: string[];
  director?: string[];
  trailer_url?: string;
  view?: number;
  year?: number;
  tmdb?: MovieTMDB;
  imdb?: MovieIMDB;
  modified?: { time?: string };
  last_episodes?: Array<{
    server_name: string;
    name: string;
    is_ai: boolean;
  }>;
  category?: Category[];
  country?: Country[];
}

export interface EpisodeData {
  name: string;
  slug: string;
  filename?: string;
  link_embed?: string;
  link_m3u8?: string;
}

export interface Episode {
  server_name: string;
  is_ai?: boolean;
  server_data: EpisodeData[];
}

export interface MovieDetail extends Movie {
  status?: string;
  episode_total?: string;
  episodes: Episode[];
  APP_DOMAIN_CDN_IMAGE?: string;
  APP_DOMAIN_FRONTEND?: string;
}

export interface PaginationInfo {
  totalItems: number;
  totalItemsPerPage: number;
  currentPage: number;
  totalPages: number;
  pageRanges?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationInfo;
  pathImage?: string;
  titlePage?: string;
  type_list?: string;
  APP_DOMAIN_FRONTEND?: string;
  APP_DOMAIN_CDN_IMAGE?: string;
  seoOnPage?: SeoOnPage;
  breadCrumb?: Breadcrumb[];
  params?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  status: 'success' | 'error' | boolean;
  message?: string;
  msg?: string;
  data: T;
}

export interface ExtraApiResponse<T> {
  success: boolean;
  message: string;
  status_code: number;
  data: T;
}

export type HomeData = PaginatedResponse<Movie>;

export interface FilterItem {
  _id: string;
  name: string;
  slug: string;
}

export interface YearItem {
  year: number;
}

export interface ImageSizeMap {
  [size: string]: string;
}

export interface MovieImage {
  width: number;
  height: number;
  aspect_ratio: number;
  type: string;
  file_path: string;
  iso_639_1?: string | null;
}

export interface MovieImagesPayload {
  tmdb_id: number;
  tmdb_type: string;
  tmdb_season?: number;
  ophim_id: string;
  slug: string;
  image_sizes: {
    backdrop: ImageSizeMap;
    poster: ImageSizeMap;
  };
  images: MovieImage[];
}

export interface MoviePeople {
  tmdb_people_id: number;
  adult: boolean;
  gender: number;
  gender_name?: string;
  name: string;
  original_name: string;
  character: string;
  known_for_department: string;
  profile_path: string;
  also_known_as: string[] | null;
}

export interface MoviePeoplesPayload {
  tmdb_id: number;
  tmdb_type: string;
  tmdb_season?: number;
  ophim_id: string;
  slug: string;
  profile_sizes: ImageSizeMap;
  peoples: MoviePeople[];
}

export interface MovieKeyword {
  tmdb_keyword_id: number;
  name: string;
  name_vn: string;
}

export interface MovieKeywordsPayload {
  tmdb_id: number;
  tmdb_type: string;
  tmdb_season?: number;
  ophim_id: string;
  slug: string;
  keywords: MovieKeyword[];
}
