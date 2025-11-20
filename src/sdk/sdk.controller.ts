import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SdkService } from './sdk.service';
import { CreateSdkDto } from './dto/create-sdk.dto';
import { UpdateSdkDto } from './dto/update-sdk.dto';
import { MongoidPipe } from 'src/validors/validator_id';

@Controller('sdk')
export class SdkController {
  constructor(private readonly sdkService: SdkService) {}

  @Post()
  create(@Body() createSdkDto: CreateSdkDto) {
    return this.sdkService.create(createSdkDto);
  }

  @Get()
  findAll() {
    return this.sdkService.findAll();
  }

  @Get('version/:id')
  findVersion(@Param('id', MongoidPipe) id: string) {
    return this.sdkService.findVersion(id);
  }

  @Get('brand/:id')
  findBrand(@Param('id', MongoidPipe) id: string) {
    return this.sdkService.findBrand(id);
  }

  @Patch(':id')
  update(@Param('id', MongoidPipe) id: string, @Body() updateSdkDto: UpdateSdkDto) {
    return this.sdkService.update(id, updateSdkDto);
  }

  @Delete(':id')
  remove(@Param('id', MongoidPipe) id: string) {
    return this.sdkService.remove(id);
  }

  @Delete('desactivate/:id')
  desactivate(@Param('id', MongoidPipe) id: string) {
    return this.sdkService.desactivate(id);
  }
}
