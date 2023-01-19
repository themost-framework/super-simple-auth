import { DataContext } from '@themost/data';
import { User } from '../models';

export declare interface AuthenticatorService {
    validateUser(context: DataContext, username: string, password: string): Promise<{
        name: string;
    }>;
}

export declare class Authenticator implements AuthenticatorService {
    validateUser(context: DataContext, username: string, password: string): Promise<{
        name: string;
    }>;
}