import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserResult } from 'src/auth/enums/auth.types';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findOneByEmail(email: string): Promise<FindUserResult> {
    const user = await this.userModel.findOne({ email })
    if (!user) {
    return {
      user: null,
      message: `Usuario con email ${email} no encontrado`
    };
  }
  return {
    user,
    message: 'Usuario encontrado correctamente'
  };
  }
}