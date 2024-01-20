import { Test, TestingModule } from "@nestjs/testing";
import { SoilController } from "./soil.controller";

describe("SoilController", () => {
  let controller: SoilController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SoilController],
    }).compile();

    controller = module.get<SoilController>(SoilController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
