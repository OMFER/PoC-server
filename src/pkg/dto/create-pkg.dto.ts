import { IsArray, IsBoolean, IsString, MinLength, ValidateNested } from "class-validator";
import { FilePkgDto } from "./file-pkg.dto";
import { Type } from "class-transformer";

export class CreatePkgDto {
    @IsString()
    @MinLength(4)
    versionName: string;

    @IsBoolean()
    isActive: boolean;
    
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FilePkgDto)
    files: FilePkgDto[]  
}
