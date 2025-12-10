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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return request(app.getHttpServer())
      .post('/events')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Annual Sports Day')
      .field('date', '2025-01-20')
      .field('location', 'School Ground')
      .attach(
        'featurePhoto',
        Buffer.from('feature image content'),
        'feature.jpg',
      )
      .attach('photos', Buffer.from('gallery image 1'), 'gallery1.jpg')
      .attach('photos', Buffer.from('gallery image 2'), 'gallery2.jpg')
      .expect(201)
      .then((response) => {
        const body = response.body as {
          title: string;
          bannerUrl: string;
          photos: string[];
        };
        expect(body.title).toBe('Annual Sports Day');
        expect(body.bannerUrl).toMatch(/^\/uploads\/events\/featurePhoto-/);
        expect(body.photos).toHaveLength(2);
        expect(body.photos[0]).toMatch(/^\/uploads\/events\/photos-/);
        expect(body.photos[1]).toMatch(/^\/uploads\/events\/photos-/);
      });
  });

  it('/events/:id (PATCH) should handle file update', async () => {
    const token = jwtService.sign({ sub: 'test-admin-id', role: 'admin' });

    // First create an event
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const createResponse = await request(app.getHttpServer())
      .post('/events')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Event to Update')
      .field('date', '2025-01-20')
      .field('location', 'Test Location')
      .expect(201);

    const eventId = (createResponse.body as { id: string }).id;

    // Then update it with files
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return request(app.getHttpServer())
      .patch(`/events/${eventId}`)
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Updated Event Title')
      .attach(
        'featurePhoto',
        Buffer.from('updated feature image'),
        'updated_feature.jpg',
      )
      .attach('photos', Buffer.from('new gallery photo'), 'new_gallery.jpg')
      .expect(200)
      .then((response) => {
        const body = response.body as {
          title: string;
          bannerUrl: string;
          photos: string[];
        };
        expect(body.title).toBe('Updated Event Title');
        expect(body.bannerUrl).toMatch(
          /^\/uploads\/events\/featurePhoto-.*\.jpg$/,
        );
        expect(body.photos).toHaveLength(1); // Assuming it was empty initially
        expect(body.photos[0]).toMatch(/^\/uploads\/events\/photos-.*\.jpg$/);
      });
  });
});
