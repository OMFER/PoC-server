import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PkgService } from './pkg.service';
import { CreateSdkDto } from './dto/create-pkg.dto';
import { UpdateSdkDto } from './dto/update-pkg.dto';
import { MongoidPipe } from 'src/validors/validator_id';
import { FileInterceptor } from '@nestjs/platform-express';
import { GCloudService } from 'src/gcloud/gcloud.service';

@Controller('pkg')
export class PkgController {
  constructor(
    private readonly sdkService: PkgService, 
    private readonly gcloudService: GCloudService
  ) {}

  @Post('upload/:project/:version')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @Param('project') project: string,
    @Param('version') version: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.gcloudService.uploadFile(file, `${project}/${version}`);
  }

  @Get('download/:project/:version/:fileName')
  async download(
    @Param('fileName') fileName: string,
    @Param('project') project: string,
    @Param('version') version: string,
  ) {
    try {
      const stream = await this.gcloudService.getSignedUrl(`${project}/${version}/${fileName}`);
      return stream;

    } catch (err) {
      console.error(err);
    }
  }


  @Post(':project')
  create(
    @Param('project') project: string,
    @Body() createSdkDto: CreateSdkDto
  ) {
    return this.sdkService.create(project, createSdkDto);
  }

  @Get(':project')
  findAll(@Param('project') project: string) {
    return this.sdkService.findAll(project);
  }

  @Get(':project/version/:id')
  findVersion(
    @Param('project') project: string,
    @Param('id', MongoidPipe) id: string
  ) {
    return this.sdkService.findVersion(project, id);
  }

  @Get(':project/files/:id')
  findBrand(
    @Param('project') project: string,
    @Param('id') id: string
  ) {
    return this.sdkService.findBrand(project, id);
  }

  @Patch(':project/:id')
  update(
    @Param('project') project: string,
    @Param('id', MongoidPipe) id: string,
    @Body() updateSdkDto: UpdateSdkDto
  ) {
    return this.sdkService.update(project, id, updateSdkDto);
  }

  @Delete(':project/:id')
  remove(
    @Param('project') project: string,
    @Param('id', MongoidPipe) id: string
  ) {
    return this.sdkService.remove(project, id);
  }

  @Delete(':project/desactivate/:id')
  desactivate(
    @Param('project') project: string,
    @Param('id', MongoidPipe) id: string
  ) {
    return this.sdkService.desactivate(project, id);
  }
}
