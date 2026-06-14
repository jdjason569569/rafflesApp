import { environment } from '../../../environments/environment';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${environment.apiUrl}/auth/login`,
  },
  CONFIG: {
    GET: `${environment.apiUrl}/config`,
    UPDATE: `${environment.apiUrl}/config`,
    BUY: `${environment.apiUrl}/config/buy`,
  },
  PURCHASES: {
    PRE_ORDER: `${environment.apiUrl}/v1/purchases/pre-order`,
    CONFIRM: `${environment.apiUrl}/v1/purchases/confirm`,
    CANCEL: `${environment.apiUrl}/v1/purchases/cancel`,
  },
};
