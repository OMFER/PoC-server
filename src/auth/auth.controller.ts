import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guard/auth.guard';
import { Request } from 'express';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enums/rol.enums';

interface RequestWithUser extends Request {
    user: { email: string, rol: string }
}

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ){}

    @Post('Register')
    register(@Body() resigterDto: RegisterDto){
        return this.authService.register(resigterDto);
    }

    @Post('LogIn')
    logIn(@Body() loginDto: LoginDto){
        return this.authService.logIn(loginDto);
    }

    @Get('profile')
    @Roles(Role.USER)
    profile(@Req() req: RequestWithUser) {
        return this.authService.profile(req.user);
    }
}
