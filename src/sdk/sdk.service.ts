import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateSdkDto } from './dto/create-sdk.dto';
import { UpdateSdkDto } from './dto/update-sdk.dto';
import { AppVersionDocument, Sdk } from './entities/sdk.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SdkService {
  constructor(
    @InjectModel(Sdk.name)
    private versionDB: Model<AppVersionDocument> //instancia a BD
  ) {}

  async create(createSdkDto: CreateSdkDto) {
    try{
      const newVersion = new this.versionDB(createSdkDto);
      await newVersion.save();
      return newVersion;
      } catch (error) {

      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        throw new BadRequestException(`El valor del campo '${field}' debe ser único.`);
      }

      throw error;
    }
  }

  async findAll() {//todo: obtener los activos findWhere
    const versions = await this.versionDB.find().exec();
    return versions;
  }

  async findOne(id: number) {
    return `This action returns a #${id} sdk`;
  }

  async update(name: string, updateSdkDto: UpdateSdkDto) {
  try {
    const updated = await this.versionDB.findOneAndUpdate(
      { versionName: name },      // Filtro
      updateSdkDto,             // Campos a actualizar
      { new: true, runValidators: true } // Opciones
    );

    if (!updated) {
      throw new NotFoundException(`No existe un registro con versionName = '${name}'`);
    }

    return updated;

  } catch (error) {
    // Manejo de errores de índice único
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      throw new BadRequestException(`El valor del campo '${field}' debe ser único.`);
    }

    throw error;
  }
}

  async remove(name: string) {
  try {
    const result = await this.versionDB.deleteOne({ versionName: name });

    if (result.deletedCount === 0) {
      throw new NotFoundException(`No existe un registro con versionName = '${name}'`);
    }

    return result;

    //return {
    //  message: 'Registro eliminado correctamente',
    //  deleted: result.deletedCount,
    //};

  } catch (error) {
    console.error('Error al eliminar:', error);
    throw new InternalServerErrorException('Error al eliminar el registro');
  }
}

}
