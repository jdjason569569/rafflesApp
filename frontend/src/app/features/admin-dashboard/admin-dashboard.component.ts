import { ChangeDetectionStrategy, Component, inject, signal, computed, effect, untracked } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { ConfigService } from '../../core/services/config.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, DecimalPipe, TranslatePipe],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent {
  private readonly authService = inject(AuthService);
  private readonly configService = inject(ConfigService);

  readonly currentUser = this.authService.currentUser;
  readonly config = this.configService.config;
  readonly soldPercentage = this.configService.soldPercentage;

  // Form signals
  readonly priceInput = signal<number>(2500);
  readonly packagesInput = signal<string>('5, 8, 20');
  readonly totalQuantityInput = signal<number>(1000);

  // Status signals
  readonly isSaving = signal<boolean>(false);
  readonly updateError = signal<string | null>(null);
  readonly updateSuccess = signal<boolean>(false);

  // Previsualización dinámica reactiva
  readonly previewPackages = computed(() => {
    const price = this.priceInput();
    const pkgsStr = this.packagesInput();
    if (!price || price <= 0 || !pkgsStr) return [];

    return pkgsStr
      .split(',')
      .map(p => parseInt(p.trim(), 10))
      .filter(p => !isNaN(p) && p > 0)
      .sort((a, b) => a - b)
      .map(quantity => ({
        quantity,
        totalPrice: quantity * price
      }));
  });

  // Número de inicio/fin del rango formateado (0001..NNNN)
  readonly rangeLabel = computed(() => {
    const qty = this.totalQuantityInput();
    if (!qty || qty < 1 || qty > 9999) return '';
    const end = String(qty).padStart(4, '0');
    return `0001 – ${end}`;
  });

  constructor() {
    // Sincronizar inputs cuando la configuración del servicio se cargue
    effect(() => {
      const cfg = this.configService.config();
      if (cfg) {
        untracked(() => {
          this.priceInput.set(cfg.pricePerNumber);
          this.packagesInput.set(cfg.packages.join(', '));
          this.totalQuantityInput.set(cfg.totalNumbersQuantity);
        });
      }
    });
  }

  saveConfig(): void {
    this.isSaving.set(true);
    this.updateError.set(null);
    this.updateSuccess.set(false);

    const price = this.priceInput();
    const totalQty = this.totalQuantityInput();
    const packages = this.packagesInput()
      .split(',')
      .map(p => parseInt(p.trim(), 10))
      .filter(p => !isNaN(p) && p > 0);

    if (isNaN(price) || price <= 0) {
      this.updateError.set('El precio debe ser un número positivo.');
      this.isSaving.set(false);
      return;
    }

    if (!Number.isInteger(totalQty) || totalQty < 1 || totalQty > 9999) {
      this.updateError.set('La cantidad de números debe ser un entero entre 1 y 9999.');
      this.isSaving.set(false);
      return;
    }

    if (packages.length === 0) {
      this.updateError.set('Debes ingresar al menos un paquete válido.');
      this.isSaving.set(false);
      return;
    }

    this.configService.updateConfig(price, packages, totalQty).subscribe({
      next: () => {
        this.updateSuccess.set(true);
        this.isSaving.set(false);
        setTimeout(() => this.updateSuccess.set(false), 3000);
      },
      error: (err) => {
        this.updateError.set(err.error?.message || 'Error al guardar la configuración');
        this.isSaving.set(false);
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
