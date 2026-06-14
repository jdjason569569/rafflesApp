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
};
