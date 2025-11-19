import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { FileItem, FileItemSchema } from "./files.entity";
export type AppVersionDocument = Sdk & Document;

@Schema({ collection: 'SDK', timestamps: true }) //tabla
export class Sdk {
  @Prop({ required: true, unique: true })
  versionName: string;
 @Prop()
  isActive:Boolean
  @Prop({ type: [FileItemSchema], required: true })
  files: FileItem[];
 
}

export const AppVersionSchema = SchemaFactory.createForClass(Sdk);

AppVersionSchema.set('toJSON', {
  transform: (_, ret: any) => {
    const userClean =  ret;
    delete userClean.__v;
    return userClean;
  },
});
