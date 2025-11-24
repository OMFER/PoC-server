import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SdkService } from './sdk.service';
import { CreateSdkDto } from './dto/create-sdk.dto';
import { UpdateSdkDto } from './dto/update-sdk.dto';
import { MongoidPipe } from 'src/validors/validator_id';

@Controller('sdk')
export class SdkController {
  constructor(private readonly sdkService: SdkService) {}

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
