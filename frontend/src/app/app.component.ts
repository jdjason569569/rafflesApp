import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService } from './core/services/config.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class App {
  protected readonly title = signal('frontend');
  private readonly translate = inject(TranslateService);
  private readonly configService = inject(ConfigService);

  constructor() {
    this.translate.addLangs(['es', 'en']);
    this.translate.setFallbackLang('es');
    this.translate.use('es');

    // Cargar configuración inicial del sistema
    this.configService.loadConfig().subscribe({
      error: (err) => console.error('Error cargando la configuración inicial:', err)
    });
  }
}
