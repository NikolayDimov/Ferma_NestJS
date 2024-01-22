import { Controller, Get, UseGuards } from "@nestjs/common";
import { ReportService } from "./report.service";
import { AuthGuard } from "src/auth/guards/auth.guard";

@Controller("report")
@UseGuards(AuthGuard)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get("/farms-with-most-machines")
  async getFarmsWithMostMachines() {
    return await this.reportService.getFarmsWithMostMachines();
  }

  @Get("/field-count-per-farm-and-crop")
  async generateFieldsPerFarmAndCropReport() {
    return await this.reportService.generateFieldsPerFarmAndCropReport();
  }

  @Get("/most-common-soil-per-farm")
  async getMostCommonSoilPerFarm() {
    return await this.reportService.getMostCommonSoilPerFarm();
  }

  @Get("/processing-report")
  async generateProcessingReport() {
    return await this.reportService.generateProcessingReport();
  }
}
