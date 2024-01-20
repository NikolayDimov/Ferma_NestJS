import { Test, TestingModule } from "@nestjs/testing";
import { CultivationTypeController } from "./processing-type.controller";

describe("CultivationTypeController", () => {
  let controller: CultivationTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CultivationTypeController],
    }).compile();

    controller = module.get<CultivationTypeController>(
      CultivationTypeController,
    );
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
