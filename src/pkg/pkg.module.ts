import { Module } from '@nestjs/common';
import { SdkService } from './pkg.service';
import { SdkController } from './pkg.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AppVersionSchema, Sdk } from './entities/pkg.entity';

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
