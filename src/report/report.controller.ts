import { Controller, Get, UseGuards } from "@nestjs/common";
import { ReportService } from "./report.service";
import { AuthGuard } from "src/auth/guards/auth.guard";

@Controller("report")
@UseGuards(AuthGuard)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get("/farmsWithMostMachines")
  async getFarmsWithMostMachines() {
    return await this.reportService.getFarmsWithMostMachines();
  }

  @Get("/fieldCountPerFarmAndCrop")
  async generateFieldsPerFarmAndCropReport() {
    return await this.reportService.generateFieldsPerFarmAndCropReport();
  }

  @Get("/mostCommonSoilTypePerFarm")
  async getMostCommonSoilTypePerFarm() {
    return await this.reportService.getMostCommonSoilTypePerFarm();
  }

  @Get("/processingReport")
  async generateProcessingReport() {
    return await this.reportService.generateProcessingReport();
  }
}
