import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class MongoidPipe implements PipeTransform {//valida Id valido
  transform(value: string) {
    const isMongoId = Types.ObjectId.isValid(value);

    if (!isMongoId) {
      throw new BadRequestException('El id debe ser un MongoID válido');
    }

    return value;
  }
}