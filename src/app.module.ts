import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { SdkModule } from './pkg/pkg.module';

@Module({
  imports: [SdkModule, ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGO_URI,
      }),
    }),],
  controllers: [],
  providers: [],
})
export class AppModule {}
