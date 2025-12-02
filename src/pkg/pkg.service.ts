import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UpdatePkgDto } from './dto/update-pkg.dto';
import { AppVersionSchema } from './entities/pkg.entity';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { GCloudService } from 'src/gcloud/gcloud.service';
import { CreatePkgDto } from './dto/create-pkg.dto';

@Injectable()
export class PkgService {
  constructor(@InjectConnection() private readonly connection: Connection,
    private readonly gcloudService: GCloudService
  ) {}

  private getModel(project: string): Model<any> {
    return this.connection.model(project, AppVersionSchema, project);
  }

  async subirApk(file : Express.Multer.File, project: string, version: string) {
    const {originalname} = file;
    try {
      var res =  await this.findBrand(project, originalname);
      console.log(res);
      if (res != null) {
        throw new NotFoundException(`Ya existe un registro '${originalname}'`);
      }

       res = await this.gcloudService.uploadFile(file, `${project}/${version}`);
      console.log(res);
      if (res != null) {
        throw new NotFoundException(`Ya existe un registro '${originalname}'`);
      }
      return res
    } catch (error) {
      throw error;
    }
  }

  async descApk(file : Express.Multer.File, project: string, version: string) {
    const {originalname} = file;
    try {
      var res =  await this.findBrand(project, originalname);
      console.log(res);
      if (res == null) {
        throw new NotFoundException(`No existe un registro '${originalname}'`);
      }

      res = await this.gcloudService.getSignedUrl(`${project}/${version}/${originalname}`);
      console.log(res);
      return res
    } catch (error) {
      throw error;
    }
  }

  async removeApk(file : Express.Multer.File, project: string, version: string) {
    const {originalname} = file;
    try {
      var res =  await this.findBrand(project, originalname);
      console.log(res);
      if (res == null) {
        throw new NotFoundException(`No existe un registro '${originalname}'`);
      }

      res = await this.gcloudService.deleteFile(`${project}/${version}/${originalname}`);
      console.log(res);
      return res
    } catch (error) {
      throw error;
    }
  }

  async create(project: string,createSdkDto: CreatePkgDto) {
    const Model = this.getModel(project);
    try{
      const newVersion = new Model(createSdkDto);
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

  async findAll(project: string) {
    const versions = await this.getModel(project).find();
    return versions;
  }

  async findVersion(project: string, id: string) {
    const version = await this.getModel(project).findById(id);
    return version;
  }

  async findBrand(project: string, id: string) {
    const Model = this.getModel(project);
    const result = await Model.findOne(
      { "files._id": id },
      { "files.$": 1 }
    );

    if (!result || !result.files || result.files.length === 0) {
      throw new NotFoundException("File no encontrado");
    }

    return result.files[0];
  }

  async update(project: string, id: string, updateSdkDto: UpdatePkgDto) {
    const Model = this.getModel(project);
    try {
      const updated = await Model.findOneAndUpdate(
        { _id: id },
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
        throw new BadRequestException(
          `El valor del campo '${field}' debe ser único.`
        );
      }
      throw error;
    }
  }

  async remove(project: string, id: string) {
    const Model = this.getModel(project);

    try {
      const result = await Model.deleteOne({ _id: id });

      if (result.deletedCount === 0) {
        throw new NotFoundException(`No existe un registro con id = '${id}'`);
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

  async desactivate(project: string, id: string) {
    const Model = this.getModel(project);

    try {
      const result = await Model.findOneAndUpdate(
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
