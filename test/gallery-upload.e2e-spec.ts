import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { JwtModule, JwtService } from '@nestjs/jwt';

describe('GalleriesController (e2e)', () => {
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

  it('/galleries (POST) should handle cover and photos upload', async () => {
    const token = jwtService.sign({ sub: 'test-admin-id', role: 'admin' });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return request(app.getHttpServer())
      .post('/galleries')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'New Gallery')
      .attach('cover', Buffer.from('cover image'), 'cover.jpg')
      .attach('photos', Buffer.from('photo 1'), 'p1.jpg')
      .attach('photos', Buffer.from('photo 2'), 'p2.jpg')
      .expect(201)
      .then((response) => {
        const body = response.body as {
          title: string;
          coverUrl: string;
          photos: { url: string }[];
        };
        expect(body.title).toBe('New Gallery');
        expect(body.coverUrl).toMatch(/^\/uploads\/galleries\/cover-.*\.jpg$/);
        expect(body.photos).toHaveLength(2);
        expect(body.photos[0].url).toMatch(
          /^\/uploads\/galleries\/photos-.*\.jpg$/,
        );
      });
  });

  it('/galleries/:id (PATCH) should handle file update', async () => {
    const token = jwtService.sign({ sub: 'test-admin-id', role: 'admin' });

    // Create gallery
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const createResponse = await request(app.getHttpServer())
      .post('/galleries')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Gallery to Update')
      .expect(201);

    const galleryId = (createResponse.body as { id: string }).id;

    // Update with new photos
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return request(app.getHttpServer())
      .patch(`/galleries/${galleryId}`)
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Updated Gallery Title')
      .attach('cover', Buffer.from('updated cover'), 'updated_cover.jpg')
      .attach('photos', Buffer.from('new photo'), 'new_p.jpg')
      .expect(200)
      .then((response) => {
        const body = response.body as {
          title: string;
          coverUrl: string;
          photos: { url: string }[];
        };
        expect(body.title).toBe('Updated Gallery Title');
        expect(body.coverUrl).toMatch(/^\/uploads\/galleries\/cover-.*\.jpg$/);
        // Should have 1 photo from this update appended to existing 0 (or whatever logic)
        // Since we didn't add photos in create step above, it should have 1.
        expect(body.photos).toHaveLength(1);
        expect(body.photos[0].url).toMatch(
          /^\/uploads\/galleries\/photos-.*\.jpg$/,
        );
      });
  });
});
