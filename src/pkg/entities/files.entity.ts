import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class FileItem { //objeto de los archivos de la tabla
  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  typeFile: string;

  @Prop({ required: true })
  url: string; 
}

export const FileItemSchema = SchemaFactory.createForClass(FileItem);