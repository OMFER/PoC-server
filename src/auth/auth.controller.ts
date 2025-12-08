import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ){}

    @Post('Register')
    register(){
        return this.authService.register();
    }

    @Post('LogIn')
    logIn(){
        return this.authService.logIn();
    }
}
