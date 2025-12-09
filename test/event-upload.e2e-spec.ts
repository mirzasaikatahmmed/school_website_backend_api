
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { JwtModule, JwtService } from '@nestjs/jwt';

describe('EventsController (e2e)', () => {
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

  it('/events (POST) should handle feature photo and gallery photos upload', async () => {
    const token = jwtService.sign({ sub: 'test-admin-id', role: 'admin' });
    
    return request(app.getHttpServer())
      .post('/events')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Annual Sports Day')
      .field('date', '2025-01-20')
      .field('location', 'School Ground')
      .attach('featurePhoto', Buffer.from('feature image content'), 'feature.jpg')
      .attach('photos', Buffer.from('gallery image 1'), 'gallery1.jpg')
      .attach('photos', Buffer.from('gallery image 2'), 'gallery2.jpg')
      .expect(201)
      .then((response) => {
        expect(response.body.title).toBe('Annual Sports Day');
        expect(response.body.bannerUrl).toMatch(/^\/uploads\/events\/featurePhoto-/);
        expect(response.body.photos).toHaveLength(2);
        expect(response.body.photos[0]).toMatch(/^\/uploads\/events\/photos-/);
        expect(response.body.photos[1]).toMatch(/^\/uploads\/events\/photos-/);
      });
  });
});
