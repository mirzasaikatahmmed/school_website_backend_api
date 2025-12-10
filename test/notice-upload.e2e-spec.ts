import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { JwtModule, JwtService } from '@nestjs/jwt';

describe('NoticeController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET || 'superSecretKey123!',
          signOptions: { expiresIn: '1h' },
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    jwtService = moduleFixture.get<JwtService>(JwtService);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/notices (POST) should handle file upload', async () => {
    const token = jwtService.sign({ sub: 'test-user-id', role: 'admin' });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return request(app.getHttpServer())
      .post('/notices')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Test Notice with Check')
      .field('bodyHtml', '<p>Includes attachments</p>')
      .attach('files', Buffer.from('dummy content 1'), 'test1.txt')
      .attach('files', Buffer.from('dummy content 2'), 'test2.txt')
      .expect(201)
      .then((response) => {
        const body = response.body as {
          title: string;
          attachments: { name: string }[];
        };
        expect(body.title).toBe('Test Notice with Check');
        expect(body.attachments).toHaveLength(2);
        expect(body.attachments[0].name).toBe('test1.txt');
        expect(body.attachments[1].name).toBe('test2.txt');
      });
  });

  it('/notices/:id (PATCH) should handle file update', async () => {
    const token = jwtService.sign({ sub: 'test-user-id', role: 'admin' });

    // First create a notice
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const createResponse = await request(app.getHttpServer())
      .post('/notices')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Notice to Update')
      .field('bodyHtml', '<p>Initial content</p>') // Added required field
      .expect(201);

    const noticeId = (createResponse.body as { id: string }).id;

    // Then update it with files
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return request(app.getHttpServer())
      .patch(`/notices/${noticeId}`)
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Updated Notice Title')
      .attach('files', Buffer.from('updated content'), 'updated.txt')
      .expect(200)
      .then((response) => {
        const body = response.body as {
          title: string;
          attachments: { name: string }[];
        };
        expect(body.title).toBe('Updated Notice Title');
        expect(body.attachments).toHaveLength(1);
        expect(body.attachments[0].name).toBe('updated.txt');
      });
  });
});
