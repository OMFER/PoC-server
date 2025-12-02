import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";
import { CreatePkgDto } from "src/pkg/dto/create-pkg.dto";
import { UpdatePkgDto } from "src/pkg/dto/update-pkg.dto";
import { AppVersionSchema } from "src/pkg/entities/pkg.entity";

@Injectable()
export class DbServiceService {
    constructor(@InjectConnection() private readonly connection: Connection,) {}

    private getModel(project: string): Model<any> {
        return this.connection.model(project, AppVersionSchema, project);
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