import { IsArray, IsBoolean, IsOptional, IsString, min, MinLength, minLength, ValidateNested } from "class-validator";
import { FileSdkDto } from "./file-sdk.dto";
import { Type } from "class-transformer";

export class CreateSdkDto {
    @IsString()
    @MinLength(4)
    versionName: string;

    @IsBoolean()
    isActive: boolean;
    
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FileSdkDto)
    files: FileSdkDto[]  
}
