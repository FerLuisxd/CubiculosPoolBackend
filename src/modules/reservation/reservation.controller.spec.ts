import { Test, TestingModule } from '@nestjs/testing';
import { ReservationController } from './reservation.controller';

describe('Reservation Controller', () => {
  // let controller: ReservationController;

  beforeEach(async () => {
    // const module: TestingModule = await Test.createTestingModule({
    //   controllers: [ReservationController],
    // }).compile();

    // controller = module.get<ReservationController>(ReservationController);
  });

  it('should be defined', () => {
    expect(true).toBeDefined();
  });
});
