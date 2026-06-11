import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-guest-dashboard',
  standalone: true,
  template: `
    <div class="relative min-h-screen bg-slate-950 text-white font-sans overflow-hidden">
      <!-- Círculo de brillo de fondo -->
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl"></div>

      <!-- Barra de navegación superior -->
      <nav class="relative z-10 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 py-4 flex justify-between items-center">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center font-extrabold text-xl">
            G
          </div>
          <span class="font-bold tracking-wide text-lg bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Guest Portal
          </span>
        </div>
        <button
          (click)="logout()"
          class="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:text-emerald-400 text-sm font-semibold transition-all duration-300"
        >
          Cerrar Sesión
        </button>
      </nav>

      <!-- Contenido Principal -->
      <main class="relative z-10 max-w-5xl mx-auto px-6 py-12">
        <div class="mb-10 animate-fade-in">
          <p class="text-sm font-semibold text-emerald-500 uppercase tracking-widest mb-1">
            Modo Lectura Público
          </p>
          <h1 class="text-4xl font-extrabold tracking-tight">
            Hola, {{ currentUser()?.username }} 👋
          </h1>
          <p class="text-slate-400 mt-2">
            Tienes acceso limitado a los paneles de visualización del sistema. Algunas acciones están restringidas.
          </p>
        </div>

        <!-- Rejilla de tarjetas de estado -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          <div class="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all duration-300">
            <p class="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Rol Asignado</p>
            <p class="text-2xl font-bold text-emerald-400 capitalize">{{ currentUser()?.role }}</p>
          </div>

          <div class="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all duration-300">
            <p class="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Estado de Conexión</p>
            <div class="flex items-center space-x-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <p class="text-2xl font-bold text-emerald-400">Activo (Mock)</p>
            </div>
          </div>

          <div class="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all duration-300">
            <p class="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Token de Sesión</p>
            <p class="text-xs font-mono text-slate-400 truncate mt-1">
              {{ currentUser()?.token }}
            </p>
          </div>

        </div>

        <!-- Info Card de Visualización -->
        <div class="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 backdrop-blur-md">
          <h3 class="text-xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Paneles Informativos
          </h3>
          <div class="p-6 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 flex items-start space-x-3">
            <svg class="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div>
              <p class="font-semibold text-slate-200">Acceso de Invitado Activo</p>
              <p class="text-sm mt-1">
                Puedes navegar por el sitio y ver sorteos activos, pero no tienes permisos para crear, editar o eliminar elementos de la base de datos. Si requieres más permisos, contacta al administrador.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuestDashboardComponent {
  private readonly authService = inject(AuthService);

  readonly currentUser = this.authService.currentUser;

  logout(): void {
    this.authService.logout();
  }
}
