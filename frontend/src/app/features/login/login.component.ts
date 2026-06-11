import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Formulario reactivo
  readonly loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(4)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  // Signals para manejar el estado del componente
  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  // Helper para verificar validez y touch de campos
  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        const role = response.user.role;
        if (role === 'admin') {
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.router.navigate(['/guest-dashboard']);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        const serverMessage = err?.error?.message || 'Error de conexión con el servidor.';
        this.errorMessage.set(serverMessage);
      },
    });
  }

  loginAsGuest(): void {
    this.authService.loginAsGuestLocal();
    this.router.navigate(['/guest-dashboard']);
  }
}
