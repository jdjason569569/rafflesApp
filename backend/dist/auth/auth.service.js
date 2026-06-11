"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
let AuthService = class AuthService {
    users = [
        { username: 'admin_user', password: 'admin123', role: 'admin' },
    ];
    async login(body) {
        const { username, password } = body;
        const user = this.users.find((u) => u.username === username && u.password === password);
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)()
], AuthService);
//# sourceMappingURL=auth.service.js.map