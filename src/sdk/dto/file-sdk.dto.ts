import { IsString, IsUrl } from "class-validator";

export class FileSdkDto {
    @IsString()
    brand: string

    @IsString()
    typeFile: string

    @IsString()
    @IsUrl()
    url: string
}