import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { CreatePkgDto } from 'src/pkg/dto/create-pkg.dto';

@Injectable()
export class MongoidPipe implements PipeTransform {
  transform(value: string) {
    //Valida Id
    const isMongoId = Types.ObjectId.isValid(value);

    if (!isMongoId) {
      throw new BadRequestException('El id debe ser un MongoID válido');
    }

    return value;
  }
}

@Injectable()
export class ProjectPipe implements PipeTransform {
  private readonly allowedProjects = ['SDK', 'TMS', 'Scripts', 'TMS Cliente'];

  transform(value: string) {
    if (!this.allowedProjects.includes(value)) {
      throw new BadRequestException(
        `El proyecto '${value}' no es válido. Proyectos permitidos: ${this.allowedProjects.join(', ')}`
      );
    }

    return value;
  }
}
@Injectable()
export class VersionPipe implements PipeTransform {
  transform(value: string) {
    // Validar versión
    if (!/^\d+\.\d+\.\d+$/.test(value)) {
      throw new BadRequestException('La versión debe tener el formato X.Y.Z');
    }

    return value;
  }
}

@Injectable()
export class FilesEmptyPipe implements PipeTransform {
  transform(dto: CreatePkgDto) {

    // Validar que files no esté vacío
    if (!dto.files || dto.files.length === 0) {
      throw new BadRequestException('Debe incluir al menos un archivo en "files"');
    }

    return dto;
  }
}