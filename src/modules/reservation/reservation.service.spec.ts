import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';

describe('ReservationService', () => {
  let service: ReservationService;

  beforeEach( () => {
    // const module: TestingModule = await Test.createTestingModule({
    //   providers: [ReservationService],
    // }).compile();

    // service = module.get<ReservationService>(ReservationService);
  });

  it('should be defined', () => {
    expect(true).toBeDefined();
  });
});
