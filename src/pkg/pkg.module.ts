import { Module } from '@nestjs/common';
import { PkgService } from './pkg.service';
import { PkgController } from './pkg.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AppVersionSchema, Sdk } from './entities/pkg.entity';
import { GCloudService } from 'src/gcloud/gcloud.service';

@Module({
  imports:[
      MongooseModule.forFeature([
        { name: Sdk.name, schema: AppVersionSchema },
    ]),
  ],
  controllers: [PkgController],
  providers: [PkgService, GCloudService],
})
export class SdkModule {}
