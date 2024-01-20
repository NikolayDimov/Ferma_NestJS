import { Test, TestingModule } from "@nestjs/testing";
import { GrowingCropPeriodController } from "./growing-crop-period.controller";

describe("GrowingPeriodController", () => {
  let controller: GrowingCropPeriodController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GrowingCropPeriodController],
    }).compile();

    controller = module.get<GrowingCropPeriodController>(
      GrowingCropPeriodController,
    );
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
