import { Injectable } from "@nestjs/common";
import { FarmService } from "../farm/farm.service";
import { ProcessingService } from "../processing/processing.service";
import { FieldService } from "../field/field.service";
import { GrowingCropPeriodService } from "../growing-crop-period/growing-crop-period.service";

@Injectable()
export class ReportService {
  constructor(
    private readonly farmService: FarmService,
    private readonly cultivationService: ProcessingService,
    private readonly fieldService: FieldService,
    private readonly growingCropPeriodService: GrowingCropPeriodService,
  ) {}

  async getFarmsWithMostMachines() {
    return this.farmService.getFarmsWithMostMachines();
  }

  async generateFieldsPerFarmAndCropReport(): Promise<
    { farmName: string; cropName: string; fieldCount: number }[]
  > {
    const fieldsPerFarmAndCrop =
      await this.farmService.getFieldsPerFarmAndCrop();
    return fieldsPerFarmAndCrop;
  }

  async getMostCommonSoilTypePerFarm() {
    const result =
      await this.cultivationService.getMostCommonFieldSoilTypePerFarm();

    return result.map((report) => ({
      farmName: report.farmName,
      mostCommonSoilType: report.mostCommonSoilType,
      soilName: report.soilName,
      occurrences: report.occurrences,
    }));
  }

  async generateCultivationReport(): Promise<ProcessingReportDTO[]> {
    try {
      return await this.cultivationService.generateCultivationReport();
    } catch (error) {
      console.error("Error generating cultivation report:", error);
      throw new Error("Failed to generate cultivation report");
    }
  }
}
