import vi from 'date-fns/locale/vi';

export const APP_URL = import.meta.env.VITE_REACT_APP_DOMAIN;
export const BACKEND_PUBLIC_URL = import.meta.env.VITE_REACT_BACKED_PUBLIC_URL;

export const localeDatePicker = { vi, en: '' };
export const DATE_FORMAT = 'DD/MM/YYYY';
export const DATE_FORMAT_ISO = 'dd/MM/yyyy';

export const PAGINATION_NUMBER_DEFAULT = 25;
export const PAGINATION_OPTIONS = [25, 50, 100];
export const PAGESIZE_MAX = 100;
export const PAGESIZE_DEFAULT = 25;

export const ORDER_ASCENDING = 'asc';
export const ORDER_DESCENDING = 'desc';
export const ORDER_NONE = 'none';
export const ADMIN_ROLE = 'admin';
export const MOD_ROLE = 'mod';
export const GENDER_DEFAULT = 'GF';
