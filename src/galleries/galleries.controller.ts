import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { GalleriesService } from './galleries.service';
import { CreateGalleryDto, UpdateGalleryDto } from './dto/gallery.dto';
import { Gallery } from './entities/gallery.entity';
import { Photo } from './entities/photo.entity';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('galleries')
@Controller('galleries')
export class GalleriesController {
  constructor(private readonly galleriesService: GalleriesService) {}

  @ApiBearerAuth()
  @Post()
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/galleries';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `cover-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create gallery with optional cover photo',
    schema: {
      type: 'object',
      required: ['title'],
      properties: {
        title: {
          type: 'string',
          example: 'Annual Cultural Function',
        },
        cover: {
          type: 'string',
          format: 'binary',
          description: 'Optional cover image',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Create a new gallery' })
  @ApiResponse({
    status: 201,
    description: 'The gallery has been created.',
    type: Gallery,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(
    @Body() createGalleryDto: CreateGalleryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const coverUrl = file ? `/uploads/galleries/${file.filename}` : undefined;
    return this.galleriesService.create({ ...createGalleryDto, coverUrl });
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all galleries' })
  @ApiResponse({
    status: 200,
    description: 'List of galleries.',
    type: [Gallery],
  })
  findAll() {
    return this.galleriesService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a gallery by ID' })
  @ApiResponse({ status: 200, description: 'The gallery.', type: Gallery })
  @ApiResponse({ status: 404, description: 'Gallery not found.' })
  findOne(@Param('id') id: string) {
    return this.galleriesService.findOne(id);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/galleries';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `cover-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update gallery with optional cover photo',
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: 'Annual Cultural Function',
        },
        cover: {
          type: 'string',
          format: 'binary',
          description: 'Optional cover image',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Update a gallery' })
  @ApiResponse({
    status: 200,
    description: 'The updated gallery.',
    type: Gallery,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Gallery not found.' })
  update(
    @Param('id') id: string,
    @Body() updateGalleryDto: UpdateGalleryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const coverUrl = file ? `/uploads/galleries/${file.filename}` : undefined;
    return this.galleriesService.update(id, { ...updateGalleryDto, coverUrl });
  }

  @ApiBearerAuth()
  @Post(':id/cover')
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/galleries';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `cover-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload cover photo for gallery',
    schema: {
      type: 'object',
      properties: {
        cover: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Upload cover photo for a gallery' })
  @ApiResponse({
    status: 200,
    description: 'Cover photo uploaded successfully.',
    type: Gallery,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Gallery not found.' })
  uploadCover(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const coverUrl = `/uploads/galleries/${file.filename}`;
    return this.galleriesService.updateCover(id, coverUrl);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a gallery' })
  @ApiResponse({ status: 200, description: 'The gallery has been deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Gallery not found.' })
  remove(@Param('id') id: string) {
    return this.galleriesService.remove(id);
  }

  @ApiBearerAuth()
  @Post(':id/photos')
  @UseInterceptors(
    FilesInterceptor('photos', 20, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/galleries';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `photo-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB per file
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload photos to gallery',
    schema: {
      type: 'object',
      properties: {
        photos: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        captions: {
          type: 'array',
          items: {
            type: 'string',
          },
          description:
            'Optional captions for each photo (comma-separated or array)',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Upload photos to a gallery' })
  @ApiResponse({
    status: 201,
    description: 'Photos uploaded successfully.',
    type: [Photo],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Gallery not found.' })
  uploadPhotos(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body('captions') captions?: string | string[],
  ) {
    const photoUrls = files.map(
      (file) => `/uploads/galleries/${file.filename}`,
    );
    const captionArray = Array.isArray(captions)
      ? captions
      : captions
        ? captions.split(',').map((c) => c.trim())
        : [];
    return this.galleriesService.addPhotos(id, photoUrls, captionArray);
  }

  @Public()
  @Get(':id/photos')
  @ApiOperation({ summary: 'Get photos of a gallery' })
  @ApiResponse({ status: 200, description: 'List of photos.', type: [Photo] })
  @ApiResponse({ status: 404, description: 'Gallery not found.' })
  getPhotos(@Param('id') id: string, @Query('page') page = 1) {
    return this.galleriesService.getPhotos(id, Number(page));
  }

  @ApiBearerAuth()
  @Delete(':id/photos/:photoId')
  @ApiOperation({ summary: 'Remove a photo from a gallery' })
  @ApiResponse({ status: 200, description: 'Photo removed.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Gallery or Photo not found.' })
  removePhoto(@Param('id') id: string, @Param('photoId') photoId: string) {
    return this.galleriesService.removePhoto(id, photoId);
  }
}
