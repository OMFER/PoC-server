import { PartialType } from '@nestjs/mapped-types';
import { CreateSdkDto } from './create-pkg.dto';

export class UpdateSdkDto extends PartialType(CreateSdkDto) {}
