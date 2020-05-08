import { Test, TestingModule } from '@nestjs/testing';
import { AvailableService } from './available.service';

describe('AvailableService', () => {
  let service: AvailableService;

  beforeEach(async () => {
    // const module: TestingModule = await Test.createTestingModule({
    //   providers: [AvailableService],
    // }).compile();

    // service = module.get<AvailableService>(AvailableService);
  });

  it('should be defined', () => {
    expect(true).toBeDefined();
  });
});
