import axios from 'axios';
import type {
  ApiResponse,
  ExtraApiResponse,
  FilterItem,
  HomeData,
  Movie,
  MovieDetail,
  MovieImagesPayload,
  MovieKeywordsPayload,
  MoviePeoplesPayload,
  PaginatedResponse,
  YearItem,
} from '../types/movie';

const API_V1_URL = 'https://ophim1.com/v1/api';

const apiClient = axios.create({
  baseURL: API_V1_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

type ListQueryParams = {
  page?: number;
  category?: string;
  country?: string;
  year?: string | number;
  type?: string;
  sortField?: string;
  sortType?: 'asc' | 'desc';
  keyword?: string;
};

const normalizePagination = <T>(payload: any): PaginatedResponse<T> => {
  const items: T[] = Array.isArray(payload?.items) ? payload.items : [];
  const paginationSource =
    payload?.pagination ||
    payload?.params?.pagination || {
      totalItems: items.length,
      totalItemsPerPage: items.length || 1,
      currentPage: 1,
    };

  const totalItemsPerPage = paginationSource.totalItemsPerPage || Math.max(items.length, 1);
  const totalItems = paginationSource.totalItems ?? items.length;
  const totalPages =
    paginationSource.totalPages ??
    Math.max(1, Math.ceil(totalItems / (totalItemsPerPage || 1)));

  return {
    items,
    pagination: {
      totalItems,
      totalItemsPerPage,
      currentPage: paginationSource.currentPage ?? 1,
      totalPages,
      pageRanges: paginationSource.pageRanges,
    },
    pathImage: payload?.pathImage,
    titlePage: payload?.titlePage,
    type_list: payload?.type_list,
    APP_DOMAIN_FRONTEND: payload?.APP_DOMAIN_FRONTEND,
    APP_DOMAIN_CDN_IMAGE: payload?.APP_DOMAIN_CDN_IMAGE,
    seoOnPage: payload?.seoOnPage,
    breadCrumb: payload?.breadCrumb,
    params: payload?.params,
  };
};

const fetchPaginated = async <T>(
  endpoint: string,
  params?: Record<string, unknown>
): Promise<PaginatedResponse<T>> => {
  const response = await apiClient.get<ApiResponse<any>>(endpoint, { params });
  return normalizePagination<T>(response.data.data);
};

// Home page data (/v1/api/home)
export const getHomeData = async (): Promise<HomeData> => {
  return fetchPaginated<Movie>('/home');
};

// Generic list by slug (/v1/api/danh-sach/:slug)
export const getMovieListBySlug = async (
  slug: string,
  query: ListQueryParams = {}
): Promise<PaginatedResponse<Movie>> => {
  return fetchPaginated<Movie>(`/danh-sach/${slug}`, query);
};

// Backward compatible helpers
export const getMoviesByCategory = async (
  categorySlug: string,
  page = 1,
  filters: Omit<ListQueryParams, 'page'> = {}
): Promise<PaginatedResponse<Movie>> => {
  return getMovieListBySlug(categorySlug, { page, ...filters });
};

export const getMoviesByGenre = getMoviesByCategory;

// Search movies (/v1/api/tim-kiem)
export const searchMovies = async (
  keyword: string,
  page = 1
): Promise<PaginatedResponse<Movie>> => {
  return fetchPaginated<Movie>('/tim-kiem', { keyword, page });
};

// Movie detail (/v1/api/phim/:slug)
export const getMovieDetail = async (slug: string): Promise<MovieDetail> => {
  const response = await apiClient.get<ApiResponse<{ item: MovieDetail }>>(`/phim/${slug}`);
  return response.data.data.item;
};

// Filters list: categories & countries
export const getCategories = async (): Promise<FilterItem[]> => {
  const response = await apiClient.get<ApiResponse<{ items: FilterItem[] }>>('/the-loai');
  return response.data.data.items;
};

export const getCountries = async (): Promise<FilterItem[]> => {
  const response = await apiClient.get<ApiResponse<{ items: FilterItem[] }>>('/quoc-gia');
  return response.data.data.items;
};

export const getYears = async (): Promise<YearItem[]> => {
  const response = await apiClient.get<ApiResponse<{ items: YearItem[] }>>('/nam-phat-hanh');
  return response.data.data.items;
};

// Movies by country (/v1/api/quoc-gia/:slug)
export const getMoviesByCountry = async (
  countrySlug: string,
  page = 1,
  filters: Omit<ListQueryParams, 'page' | 'country'> = {}
): Promise<PaginatedResponse<Movie>> => {
  return fetchPaginated<Movie>(`/quoc-gia/${countrySlug}`, { page, ...filters });
};

// Movies by release year (/v1/api/nam-phat-hanh/:year)
export const getMoviesByYear = async (
  year: string | number,
  page = 1,
  filters: Omit<ListQueryParams, 'page' | 'year'> = {}
): Promise<PaginatedResponse<Movie>> => {
  return fetchPaginated<Movie>(`/nam-phat-hanh/${year}`, { page, ...filters });
};

// Movie images (/v1/api/phim/:slug/images)
export const getMovieImages = async (slug: string): Promise<MovieImagesPayload> => {
  const response = await apiClient.get<ExtraApiResponse<MovieImagesPayload>>(`/phim/${slug}/images`);
  return response.data.data;
};

// Movie peoples (/v1/api/phim/:slug/peoples)
export const getMoviePeoples = async (slug: string): Promise<MoviePeoplesPayload> => {
  const response = await apiClient.get<ExtraApiResponse<MoviePeoplesPayload>>(`/phim/${slug}/peoples`);
  return response.data.data;
};

// Movie keywords (/v1/api/phim/:slug/keywords)
export const getMovieKeywords = async (slug: string): Promise<MovieKeywordsPayload> => {
  const response = await apiClient.get<ExtraApiResponse<MovieKeywordsPayload>>(`/phim/${slug}/keywords`);
  return response.data.data;
};

export default apiClient;
