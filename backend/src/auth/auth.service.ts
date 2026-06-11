import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly users = [
    { username: 'admin_user', password: 'admin123', role: 'admin' },
  ];

  async login(body: any) {
    const { username, password } = body;
    const user = this.users.find(
      (u) => u.username === username && u.password === password,
    );

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return {
      statusCode: 200,
      message: 'Login exitoso',
      user: {
        username: user.username,
        role: user.role,
        token: `mock-jwt-token-${user.role}-${Date.now()}`,
      },
    };
  }
}
