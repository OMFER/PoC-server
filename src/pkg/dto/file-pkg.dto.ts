import { IsString, IsUrl } from "class-validator";

export class FilePkgDto {
    @IsString()
    brand: string

    @IsString()
    typeFile: string

    @IsString()
    @IsUrl()
    url: string
}