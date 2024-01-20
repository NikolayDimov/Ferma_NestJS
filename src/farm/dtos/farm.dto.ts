import { Expose, Type } from "class-transformer";
import { FieldDto } from "../../field//dtos/field-dto";

export class FarmDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  @Type(() => FieldDto)
  fields: FieldDto[];
}

// The @Expose() decorator is used to mark class properties that should be exposed during the transformation process. When transforming an object using class-transformer, only the properties marked with @Expose() will be included in the transformation result. This allows you to control which properties are included or excluded during the transformation.
