import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { SystemConfig, PackageOption } from '../models/config.model';
import { API_ENDPOINTS } from '../constants/api.constants';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  // Signal privado para el estado interno
  private readonly _config = signal<SystemConfig | null>(null);

  // Exponer señal de solo lectura para los componentes
  readonly config = this._config.asReadonly();

  // Señal computada para calcular los paquetes dinámicamente
  readonly packages = computed<PackageOption[]>(() => {
    const currentConfig = this._config();
    if (!currentConfig) return [];

    return currentConfig.packages.map((quantity) => ({
      quantity,
      totalPrice: quantity * currentConfig.pricePerNumber,
      pricePerNumber: currentConfig.pricePerNumber,
      currency: currentConfig.currency,
    }));
  });

  /** Porcentaje de números vendidos sobre el total (0–100) */
  readonly soldPercentage = computed<number>(() => {
    const cfg = this._config();
    if (!cfg || cfg.totalNumbersQuantity === 0) return 0;
    return Math.min(100, Math.round((cfg.soldNumbersCount / cfg.totalNumbersQuantity) * 100));
  });

  /**
   * Carga la configuración del sistema desde el backend.
   */
  loadConfig(): Observable<SystemConfig> {
    return this.http.get<SystemConfig>(API_ENDPOINTS.CONFIG.GET).pipe(
      tap((config) => {
        this._config.set(config);
      })
    );
  }

  /**
   * Actualiza la configuración en el backend. Requiere privilegios de administrador.
   */
  updateConfig(pricePerNumber: number, packages: number[], totalNumbersQuantity: number): Observable<SystemConfig> {
    const user = this.authService.currentUser();
    const token = user?.token || '';
    const username = user?.username || 'admin_user';

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'x-updated-by': username,
    });

    return this.http.patch<SystemConfig>(
      API_ENDPOINTS.CONFIG.UPDATE,
      { pricePerNumber, packages, totalNumbersQuantity },
      { headers }
    ).pipe(
      tap((updatedConfig) => {
        this._config.set(updatedConfig);
      })
    );
  }

  /**
   * Registra la compra de un paquete de números (invitado).
   * @param quantity cantidad de números comprados
   */
  buyNumbers(quantity: number): Observable<SystemConfig> {
    return this.http.post<SystemConfig>(API_ENDPOINTS.CONFIG.BUY, { quantity }).pipe(
      tap((updatedConfig) => {
        this._config.set(updatedConfig);
      })
    );
  }
}
