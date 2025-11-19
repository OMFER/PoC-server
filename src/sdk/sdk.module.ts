import { Module } from '@nestjs/common';
import { SdkService } from './sdk.service';
import { SdkController } from './sdk.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AppVersionSchema, Sdk } from './entities/sdk.entity';

@Module({
  imports:[
      MongooseModule.forFeature([
        { name: Sdk.name, schema: AppVersionSchema },
    ]),
  ],
  controllers: [SdkController],
  providers: [SdkService],
})
export class SdkModule {}
