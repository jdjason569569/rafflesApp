import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { ConfigService } from '../../core/services/config.service';

@Component({
  selector: 'app-guest-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DecimalPipe, TranslatePipe],
  templateUrl: './guest-dashboard.component.html',
  styleUrls: ['./guest-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuestDashboardComponent {
  private readonly authService = inject(AuthService);
  private readonly configService = inject(ConfigService);
  private readonly translate = inject(TranslateService);

  readonly currentUser = this.authService.currentUser;

  // Exponer señales del servicio
  readonly config = this.configService.config;
  readonly packages = this.configService.packages;
  readonly soldPercentage = this.configService.soldPercentage;

  // Estados de compra
  readonly isPurchasing = signal<number | null>(null);
  readonly purchaseSuccess = signal<string | null>(null);
  readonly purchaseError = signal<string | null>(null);

  buyPackage(quantity: number): void {
    this.isPurchasing.set(quantity);
    this.purchaseSuccess.set(null);
    this.purchaseError.set(null);

    this.configService.buyNumbers(quantity).subscribe({
      next: () => {
        this.isPurchasing.set(null);
        const successMsg = this.translate.instant('GUEST.SUCCESS', { quantity });
        this.purchaseSuccess.set(successMsg);
        setTimeout(() => this.purchaseSuccess.set(null), 4000);
      },
      error: (err) => {
        this.isPurchasing.set(null);
        this.purchaseError.set(err.error?.message || 'Error al procesar la compra');
        setTimeout(() => this.purchaseError.set(null), 5000);
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
