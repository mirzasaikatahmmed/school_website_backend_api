import { Test, TestingModule } from '@nestjs/testing';
import { NoticeController } from './notices.controller';
import { NoticesService } from './notices.service';

describe('NoticesController', () => {
  let controller: NoticeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoticeController],
      // Provide a mock for NoticesService
      providers: [
        {
          provide: NoticesService,
          useValue: {}, // Add mock methods if needed
        },
      ],
    }).compile();

    controller = module.get<NoticeController>(NoticeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
