import { Test, TestingModule } from '@nestjs/testing';
import { NoticesController } from './notices.controller';
import { NoticesService } from './notices.service';

describe('NoticesController', () => {
  let controller: NoticesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoticesController],
      providers: [NoticesService],
    }).compile();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    controller = module.get<NoticesController>(
      NoticesController,
    ) as unknown as NoticesController;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
