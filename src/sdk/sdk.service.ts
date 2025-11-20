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
    private versionDB: Model<AppVersionDocument>//instancia a BD
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

  async findAll() {
    const versions = await this.versionDB.find().exec();
    return versions;
  }

  async findVersion(id: string) {
    const version = await this.versionDB.findById(id).exec();
    return version;
  }

  async findBrand(id: string) {
   const result = await this.versionDB.findOne(
    { "files._id": id },
    { "files.$": 1 } // Solo devuelve el file que coincide
    );

    if (!result || !result.files || result.files.length === 0) {
      throw new NotFoundException("File no encontrado");
    }

    return result.files[0];
  }

  async update(id: string, updateSdkDto: UpdateSdkDto) {
  try {
    const updated = await this.versionDB.findOneAndUpdate(
      {_id: id},
      updateSdkDto,
      { new: true, runValidators: true }
    );
    if (!updated) {
      throw new NotFoundException(`No existe un registro con id = '${id}'`);
    }

    return updated;
    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        throw new BadRequestException(`El valor del campo '${field}' debe ser único.`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const result = await this.versionDB.deleteOne({ _id: id });

      if (result.deletedCount === 0) {
        throw new NotFoundException(`No existe un registro con versionName = '${id}'`);
      }
      return {
        message: 'Registro eliminado correctamente',
        deleted: result.deletedCount,
      };

    } catch (error) {
      console.error('Error al eliminar:', error);
      throw new InternalServerErrorException('Error al eliminar el registro');
    }
  }

  async desactivate(id: string) {
    try {
      const result = await this.versionDB.findOneAndUpdate(
        { _id: id },
        { isActive: false },
        { new: true }
      );
      if (!result) {
        throw new NotFoundException(`No existe un registro con id = '${id}'`);
      }
      return result;
    } catch (error) {
      console.error('Error al desactivar:', error);
      throw new InternalServerErrorException('Error al desactivar el registro');
    }
  }
}
