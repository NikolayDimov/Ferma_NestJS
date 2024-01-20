import { Test, TestingModule } from "@nestjs/testing";
import { GrowingPeriodController } from "./growing-crop-period.controller";

describe("GrowingPeriodController", () => {
  let controller: GrowingPeriodController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GrowingPeriodController],
    }).compile();

    controller = module.get<GrowingPeriodController>(GrowingPeriodController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
