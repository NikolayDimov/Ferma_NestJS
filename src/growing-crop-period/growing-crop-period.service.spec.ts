import { Test, TestingModule } from "@nestjs/testing";
import { GrowingCropPeriodService } from "./growing-crop-period.service";

describe("GrowingCropPeriodService", () => {
  let service: GrowingCropPeriodService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GrowingCropPeriodService],
    }).compile();

    service = module.get<GrowingCropPeriodService>(GrowingCropPeriodService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
