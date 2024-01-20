import { Test, TestingModule } from "@nestjs/testing";
import { GrowingPeriodService } from "./growing-crop-period.service";

describe("GrowingPeriodService", () => {
  let service: GrowingPeriodService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GrowingPeriodService],
    }).compile();

    service = module.get<GrowingPeriodService>(GrowingPeriodService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
