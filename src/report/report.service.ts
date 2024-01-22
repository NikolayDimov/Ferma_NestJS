import { Injectable } from "@nestjs/common";
import { FarmService } from "../farm/farm.service";
import { ProcessingService } from "../processing/processing.service";
import { FieldService } from "../field/field.service";
import { GrowingCropPeriodService } from "../growing-crop-period/growing-crop-period.service";

@Injectable()
export class ReportService {
  constructor(
    private readonly farmService: FarmService,
    private readonly processingService: ProcessingService,
    private readonly fieldService: FieldService,
  ) {}

  async getFarmsWithMostMachines() {
    return this.farmService.getFarmsWithMostMachines();
  }

  async generateFieldsPerFarmAndCropReport(): Promise<
    { farmName: string; cropName: string; fieldCount: number }[]
  > {
    const fieldsPerFarmAndCrop =
      await this.fieldService.getFieldsPerFarmAndCrop();
    return fieldsPerFarmAndCrop;
  }

  async getMostCommonSoilPerFarm() {
    const result = await this.fieldService.getMostCommonSoilPerFarm();

    return result;
  }

  async generateProcessingReport(): Promise<ProcessingReportDTO[]> {
    try {
      return await this.processingService.generateProcessingReport();
    } catch (error) {
      console.error("Error generating processing report:", error);
      throw new Error("Failed to generate processing report");
    }
  }
}
