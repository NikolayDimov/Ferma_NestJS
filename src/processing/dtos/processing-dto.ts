import { Expose, Type } from "class-transformer";
import { GrowingCropPeriodDto } from "../../growing-crop-period/dtos/growing-crop-period.dto";
import { MachineDto } from "../../machine/dtos/machine.dto";
import { ProcessingTypeDto } from "../../processing-type/dtos/processing-type.dto";

export class ProcessingDto {
  @Expose()
  id: string;

  @Expose()
  date: string;

  @Expose()
  @Type(() => GrowingCropPeriodDto)
  growingcropPeriod: GrowingCropPeriodDto;

  @Expose()
  @Type(() => ProcessingTypeDto)
  processingTypeName: ProcessingTypeDto;

  @Expose()
  @Type(() => MachineDto)
  machineId: MachineDto;
}
