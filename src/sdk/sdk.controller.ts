import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SdkService } from './sdk.service';
import { CreateSdkDto } from './dto/create-sdk.dto';
import { UpdateSdkDto } from './dto/update-sdk.dto';

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sdkService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSdkDto: UpdateSdkDto) {
    return this.sdkService.update(id, updateSdkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sdkService.remove(id);
  }
}
