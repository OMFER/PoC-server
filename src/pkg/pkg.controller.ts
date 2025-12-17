import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PkgService } from './pkg.service';
import { CreatePkgDto } from './dto/create-pkg.dto';
import { UpdatePkgDto } from './dto/update-pkg.dto';
import { MongoidPipe, ProjectPipe, VersionPipe } from 'src/validors/validator';
import { FileInterceptor } from '@nestjs/platform-express';
import { GCloudService } from 'src/gcloud/gcloud.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../common/rol.enums';

@Auth(Role.ADMIN)
@Controller('pkg')
export class PkgController {
  constructor(
    private readonly sdkService: PkgService, 
    private readonly gcloudService: GCloudService
  ) {}

  @Post('upload/:project/:version')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @Param('project', ProjectPipe) project: string,
    @Param('version', VersionPipe) version: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.gcloudService.uploadFile(file, `${project}/${version}`);
  }

  @Get('download/:project/:version/:fileName')
  async download(
    @Param('fileName') fileName: string,
    @Param('project', ProjectPipe) project: string,
    @Param('version', VersionPipe) version: string,
  ) {
    try {
      const stream = await this.gcloudService.getSignedUrl(`${project}/${version}/${fileName}`);
      return stream;

    } catch (err) {
      console.error(err);
    }
  }

  @Delete('delete/:project/:version/:fileName')
  async deleteFile(
    @Param('fileName') fileName: string,
    @Param('project', ProjectPipe) project: string,
    @Param('version', VersionPipe) version: string
  ){
    try{
      return await this.gcloudService.deleteFile(`${project}/${fileName}`);
    } catch (err) {
      console.error(err);
    }
  }

  @Post(':project')
  create(
    @Param('project', ProjectPipe) project: string,
    @Body() createSdkDto: CreatePkgDto
  ) {
    return this.sdkService.create(project, createSdkDto);
  }

  @Get(':project')
  findAll(@Param('project', ProjectPipe) project: string) {
    return this.sdkService.findAll(project);
  }

  @Get(':project/version/:id')
  findVersion(
    @Param('project', ProjectPipe) project: string,
    @Param('id', MongoidPipe) id: string
  ) {
    return this.sdkService.findVersion(project, id);
  }

  @Get(':project/files/:id')
  findBrand(
    @Param('project', ProjectPipe) project: string,
    @Param('id', MongoidPipe) id: string
  ) {
    return this.sdkService.findBrand(project, id);
  }

  @Patch(':project/:id')
  update(
    @Param('project', ProjectPipe) project: string,
    @Param('id', MongoidPipe) id: string,
    @Body() updateSdkDto: UpdatePkgDto
  ) {
    return this.sdkService.update(project, id, updateSdkDto);
  }

  @Delete(':project/:id')
  remove(
    @Param('project', ProjectPipe) project: string,
    @Param('id', MongoidPipe) id: string
  ) {
    return this.sdkService.remove(project, id);
  }

  @Delete(':project/desactivate/:id')
  desactivate(
    @Param('project', ProjectPipe) project: string,
    @Param('id', MongoidPipe) id: string
  ) {
    return this.sdkService.desactivate(project, id);
  }
}
