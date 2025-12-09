import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { NoticesModule } from './notices/notices.module';
import { EventsModule } from './events/events.module';
import { GalleriesModule } from './galleries/galleries.module';
import { StaffModule } from './staff/staff.module';
import { DownloadsModule } from './downloads/downloads.module';
import { AdmissionsModule } from './admissions/admissions.module';
import { ResultsModule } from './results/results.module';
import { ContactModule } from './contact/contact.module';
import { PagesModule } from './pages/pages.module';
import { HomeModule } from './home/home.module';
import { UsersModule } from './users/users.module';

import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'school_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Set to false in production
    }),
    AuthModule,
    NoticesModule,
    EventsModule,
    GalleriesModule,
    StaffModule,
    DownloadsModule,
    AdmissionsModule,
    ResultsModule,
    ContactModule,
    PagesModule,
    HomeModule,
    UsersModule,
  ],
  controllers: [AppController],

  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
