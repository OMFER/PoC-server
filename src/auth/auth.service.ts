import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

import *as bcryptjs from 'bcryptjs'
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ){}

    async register({name, email, password}: RegisterDto){
        const user = await this.usersService.findOneByEmail(email)
        if(user.user != null){
            throw new BadRequestException('El usuario ya existe')
        }

        await this.usersService.create({
            name,
            email,
            password: await bcryptjs.hash(password, 10)
        })

        return {name, email}
    }

    async logIn({email, password}: LoginDto){
        const user = await this.usersService.findOneByEmail(email)
        if(user.user == null) throw new UnauthorizedException("El email no esta registrado")

        const isValidPassword = bcryptjs.compareSync(password, user.user.password)
        if(!isValidPassword) throw new UnauthorizedException("El password es incorrecto")

        const payload = { email: user.user.email, rol: user.user.rol}
        return {
            access_token: await this.jwtService.signAsync(payload),
            email
        }
    }

    async profile({email, rol}: {email: string, rol: string}){
        return await this.usersService.findOneByEmail(email)
    }
}
