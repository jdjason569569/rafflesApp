export declare class AuthService {
    private readonly users;
    login(body: any): Promise<{
        statusCode: number;
        message: string;
        user: {
            username: string;
            role: string;
            token: string;
        };
    }>;
}
