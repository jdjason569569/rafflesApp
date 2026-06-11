# Especificación Técnica: Módulo de Autenticación (Login)[cite: 1]

Este documento detalla la especificación para implementar un sistema de autenticación básico utilizando **Angular** para el frontend y **NestJS** para el backend, configurado inicialmente con datos simulados (*mocks*)[cite: 1].

---

## 1. Arquitectura General y Roles[cite: 1]

El sistema implementará un control de acceso basado en dos roles principales[cite: 1]:

* **Administrador (Admin):** Acceso total a la gestión del sistema y visualización de reportes[cite: 1].
* **Invitado (Guest):** Acceso limitado en modo lectura a paneles informativos públicos[cite: 1].

---

## 2. Frontend: Angular (Versión Estable)[cite: 1]

Se utilizará la última versión estable de Angular, estructurada de forma modular y con buenas prácticas (Stand-alone components)[cite: 1].

### Estructura de Componentes Recomendada[cite: 1]
```text
src/app/
├── core/
│   ├── guards/
│   │   └── auth.guard.ts
│   └── services/
│       └── auth.service.ts
├── features/
│   ├── login/
│   │   ├── login.component.ts
│   │   └── login.component.html
│   ├── admin-dashboard/
│   └── guest-dashboard/
└── shared/
```[cite: 1]

### Flujo de Interfaz de Usuario[cite: 1]
1. **Pantalla de Login:** Formulario reactivo (`ReactiveFormsModule`) con campos para `username` y `password`[cite: 1].
2. **Validación:** Mensajes de error en tiempo real si los campos están vacíos o mal formateados[cite: 1].
3. **Redirección:** 
   * Si el rol retornado es `admin` $\rightarrow$ Redirigir a `/admin-dashboard`[cite: 1].
   * Si el rol retornado es `guest` $\rightarrow$ Redirigir a `/guest-dashboard`[cite: 1].

---

## 3. Backend: NestJS con Mocks[cite: 1]

El backend proveerá un endpoint de autenticación estructurado, pero validará las credenciales contra un arreglo de objetos estáticos en memoria (*mocks*)[cite: 1].

### Credenciales de Prueba (Mocks)[cite: 1]

| Usuario | Contraseña | Rol |
| :--- | :--- | :--- |
| `admin_user` | `admin123` | `admin` |
| `guest_user` | `guest123` | `guest` |
[cite: 1]

### Estructura del Endpoint[cite: 1]

* **Método:** `POST`[cite: 1]
* **Ruta:** `/api/auth/login`[cite: 1]
* **Cuerpo de la Petición (Payload):**[cite: 1]
```json
    {
      "username": "admin_user",
      "password": "admin123"
    }
    ```[cite: 1]
* **Respuesta Exitosa (200 OK):**[cite: 1]
```json
    {
      "statusCode": 200,
      "message": "Login exitoso",
      "user": {
        "username": "admin_user",
        "role": "admin",
        "token": "mock-jwt-token-xyz"
      }
    }
    ```[cite: 1]
* **Respuesta de Error (401 Unauthorized):**[cite: 1]
```json
    {
      "statusCode": 401,
      "error": "Unauthorized",
      "message": "Credenciales inválidas"
    }
    ```[cite: 1]

---

## 4. Seguridad y Control de Acceso[cite: 1]

1. **Angular Guards (`CanActivate` / `CanActivateFn`):** Se implementarán guardias de ruta para evitar que un usuario con rol `guest` acceda manualmente a la URL `/admin-dashboard`[cite: 1].
2. **Persistencia Local:** El token simulado y el rol se almacenarán de forma temporal en `localStorage` o `sessionStorage` para mantener la sesión activa al refrescar el navegador[cite: 1].