import vi from 'date-fns/locale/vi';

export const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;
export const APP_URL = import.meta.env.VITE_REACT_APP_DOMAIN;

export const localeDatePicker = { vi, en: '' };
export const DATE_FORMAT = 'MM/DD/YYYY';
export const DATE_FORMAT_ISO = 'dd/MM/yyyy';
export const DEFAULT_DATE = '30/05/2023';
export const SPECIALTY_ID_DEFAULT = 'SP01';
export const WORKING_HOUR_ID_DEFAULT = 'WH1';
export const STATUS_ID_DEFAULT = 'ST1';

export const PAGINATION_NUMBER_DEFAULT = 25;
export const PAGINATION_OPTIONS = [25, 50, 100, 250, 500];

export const DEFAULT_SEARCH_BY = 'all';

export const ORDER_ASCENDING = 'asc';
export const ORDER_DESCENDING = 'desc';
export const ORDER_NONE = 'none';
export const ADMIN_ROLE = 'admin';
export const DOCTOR_ROLE = 'RL2';
export const GENDER_DEFAULT = 'GF';
export const POSITION_ADMIN_DEFAULT = 'AD1';
export const POSITION_DOCTOR_DEFAULT = 'AD1';
