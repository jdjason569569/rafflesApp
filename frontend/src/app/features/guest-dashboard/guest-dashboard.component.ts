import { ChangeDetectionStrategy, Component, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { ConfigService } from '../../core/services/config.service';
import { PreOrder } from '../../core/models/config.model';

@Component({
  selector: 'app-guest-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, DecimalPipe, TranslatePipe],
  templateUrl: './guest-dashboard.component.html',
  styleUrls: ['./guest-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuestDashboardComponent implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly configService = inject(ConfigService);
  private readonly translate = inject(TranslateService);

  readonly currentUser = this.authService.currentUser;

  // Exponer señales del servicio
  readonly config = this.configService.config;
  readonly packages = this.configService.packages;
  readonly soldPercentage = this.configService.soldPercentage;

  // Datos del Comprador
  readonly fullName = signal<string>('');
  readonly email = signal<string>('');
  readonly phone = signal<string>('');

  // Paso del flujo: 'form' | 'ticket'
  readonly activeStep = signal<'form' | 'ticket'>('form');
  readonly currentPreOrder = signal<PreOrder | null>(null);

  // Estados de proceso
  readonly isPurchasing = signal<number | null>(null);
  readonly isConfirming = signal<boolean>(false);
  readonly isCancelling = signal<boolean>(false);

  readonly purchaseSuccess = signal<string | null>(null);
  readonly purchaseError = signal<string | null>(null);

  // Temporizador de Expiración
  readonly timeRemaining = signal<string>('');
  readonly isExpired = signal<boolean>(false);
  private timerInterval: any = null;

  generatePreOrder(quantity: number): void {
    const name = this.fullName().trim();
    const emailStr = this.email().trim();
    const phoneStr = this.phone().trim();

    if (!name || !emailStr || !phoneStr) {
      const errorMsg = this.translate.instant('GUEST.REQUIRED_ERROR');
      this.purchaseError.set(errorMsg);
      setTimeout(() => this.purchaseError.set(null), 5000);
      return;
    }

    this.isPurchasing.set(quantity);
    this.purchaseSuccess.set(null);
    this.purchaseError.set(null);

    this.configService.createPreOrder({ fullName: name, email: emailStr, phone: phoneStr }, quantity).subscribe({
      next: (preOrder) => {
        this.isPurchasing.set(null);
        this.currentPreOrder.set(preOrder);
        this.activeStep.set('ticket');
        this.isExpired.set(false);
        this.startCountdown(preOrder.expiresAt);
      },
      error: (err) => {
        this.isPurchasing.set(null);
        this.purchaseError.set(err.error?.message || 'Error al generar la pre-orden');
        setTimeout(() => this.purchaseError.set(null), 5000);
      }
    });
  }

  payTicket(): void {
    const preOrder = this.currentPreOrder();
    if (!preOrder) return;

    this.isConfirming.set(true);
    this.purchaseError.set(null);

    this.configService.confirmPurchase(preOrder.preOrderId).subscribe({
      next: () => {
        this.isConfirming.set(false);
        this.stopCountdown();

        const successMsg = this.translate.instant('GUEST.SUCCESS', { quantity: preOrder.package.quantity });
        this.purchaseSuccess.set(successMsg);

        // Resetear formulario y volver al inicio
        this.fullName.set('');
        this.email.set('');
        this.phone.set('');
        this.currentPreOrder.set(null);
        this.activeStep.set('form');

        setTimeout(() => this.purchaseSuccess.set(null), 5000);
      },
      error: (err) => {
        this.isConfirming.set(false);
        this.purchaseError.set(err.error?.message || 'Error al procesar el pago');
        setTimeout(() => this.purchaseError.set(null), 5000);
      }
    });
  }

  cancelTicket(): void {
    const preOrder = this.currentPreOrder();
    if (!preOrder) return;

    this.isCancelling.set(true);
    this.purchaseError.set(null);

    this.configService.cancelPreOrder(preOrder.preOrderId).subscribe({
      next: () => {
        this.isCancelling.set(false);
        this.stopCountdown();
        this.currentPreOrder.set(null);
        this.activeStep.set('form');
      },
      error: () => {
        // En caso de error, igual volvemos para evitar trabar la UI
        this.isCancelling.set(false);
        this.stopCountdown();
        this.currentPreOrder.set(null);
        this.activeStep.set('form');
      }
    });
  }

  editData(): void {
    this.stopCountdown();
    this.currentPreOrder.set(null);
    this.activeStep.set('form');
  }

  private startCountdown(expiresAtStr: string): void {
    this.stopCountdown();
    const expiresAt = new Date(expiresAtStr).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diff = expiresAt - now;

      if (diff <= 0) {
        this.timeRemaining.set('00:00');
        this.isExpired.set(true);
        this.stopCountdown();
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      this.timeRemaining.set(formatted);
    };

    updateTimer();
    this.timerInterval = setInterval(updateTimer, 1000);
  }

  private stopCountdown(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  logout(): void {
    this.stopCountdown();
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.stopCountdown();
  }
}

