import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { SettingsService } from './settings.service';
import {
  CreateSchoolSettingsDto,
  UpdateSchoolSettingsDto,
} from './dto/school-settings.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('settings')
@ApiBearerAuth()
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'logo', maxCount: 1 },
        { name: 'icon', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            const uploadPath = './uploads/settings';
            if (!existsSync(uploadPath)) {
              mkdirSync(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
          },
          filename: (req, file, cb) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            const fieldName = file.fieldname;
            cb(
              null,
              `${fieldName}-${uniqueSuffix}${extname(file.originalname)}`,
            );
          },
        }),
        limits: { fileSize: 5 * 1024 * 1024 },
      },
    ),
  )
  @ApiOperation({ summary: 'Create or update school settings' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateSchoolSettingsDto })
  @ApiResponse({ status: 201, description: 'Settings created/updated.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  createOrUpdateSettings(
    @Body() createDto: CreateSchoolSettingsDto,
    @UploadedFiles()
    files: { logo?: Express.Multer.File[]; icon?: Express.Multer.File[] },
  ) {
    if (files?.logo && files.logo[0]) {
      createDto.logoUrl = `/uploads/settings/${files.logo[0].filename}`;
    }
    if (files?.icon && files.icon[0]) {
      createDto.iconUrl = `/uploads/settings/${files.icon[0].filename}`;
    }
    return this.settingsService.createOrUpdateSettings(createDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get active school settings (Public)' })
  @ApiResponse({ status: 200, description: 'Settings retrieved.' })
  findSettings() {
    return this.settingsService.findSettings();
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all school settings (Admin)' })
  @ApiResponse({ status: 200, description: 'All settings retrieved.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAllSettings() {
    return this.settingsService.findAllSettings();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get school settings by ID' })
  @ApiResponse({ status: 200, description: 'Settings found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Settings not found.' })
  findOneSettings(@Param('id') id: string) {
    return this.settingsService.findOneSettings(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'logo', maxCount: 1 },
        { name: 'icon', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            const uploadPath = './uploads/settings';
            if (!existsSync(uploadPath)) {
              mkdirSync(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
          },
          filename: (req, file, cb) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            const fieldName = file.fieldname;
            cb(
              null,
              `${fieldName}-${uniqueSuffix}${extname(file.originalname)}`,
            );
          },
        }),
        limits: { fileSize: 5 * 1024 * 1024 },
      },
    ),
  )
  @ApiOperation({ summary: 'Update school settings' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateSchoolSettingsDto })
  @ApiResponse({ status: 200, description: 'Settings updated.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Settings not found.' })
  updateSettings(
    @Param('id') id: string,
    @Body() updateDto: UpdateSchoolSettingsDto,
    @UploadedFiles()
    files: { logo?: Express.Multer.File[]; icon?: Express.Multer.File[] },
  ) {
    if (files?.logo && files.logo[0]) {
      updateDto.logoUrl = `/uploads/settings/${files.logo[0].filename}`;
    }
    if (files?.icon && files.icon[0]) {
      updateDto.iconUrl = `/uploads/settings/${files.icon[0].filename}`;
    }
    return this.settingsService.updateSettings(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete school settings' })
  @ApiResponse({ status: 200, description: 'Settings deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Settings not found.' })
  removeSettings(@Param('id') id: string) {
    return this.settingsService.removeSettings(id);
  }
}
