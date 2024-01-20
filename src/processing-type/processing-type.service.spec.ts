import { Test, TestingModule } from "@nestjs/testing";
import { CultivationTypeService } from "./processing-type.service";

describe("CultivationTypeService", () => {
  let service: CultivationTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CultivationTypeService],
    }).compile();

    service = module.get<CultivationTypeService>(CultivationTypeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
