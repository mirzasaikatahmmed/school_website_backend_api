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
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { AdmissionsService } from './admissions.service';
import { CreateAdmissionDto, UpdateAdmissionDto } from './dto/admission.dto';
import { Admission } from './entities/admission.entity';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('admissions')
@Controller('admissions')
export class AdmissionsController {
  constructor(private readonly service: AdmissionsService) {}

  @ApiBearerAuth()
  @Post()
  @UseInterceptors(
    FilesInterceptor('attachments', 10, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/admissions';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const baseName = file.originalname
            .replace(ext, '')
            .replace(/[^a-z0-9]/gi, '-')
            .toLowerCase();
          cb(null, `${baseName}-${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB per file
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create admission circular with optional attachments',
    schema: {
      type: 'object',
      required: ['title'],
      properties: {
        title: {
          type: 'string',
          example: 'Admission Circular 2025',
        },
        bodyHtml: {
          type: 'string',
          example: '<p>Admission details...</p>',
        },
        admissionYear: {
          type: 'string',
          example: '2025',
        },
        isActive: {
          type: 'boolean',
          example: true,
        },
        attachments: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Multiple files (forms, notices, etc.)',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Create a new admission circular' })
  @ApiResponse({
    status: 201,
    description: 'The admission circular has been created.',
    type: Admission,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(
    @Body() dto: CreateAdmissionDto,
    @UploadedFiles() files?: Array<Express.Multer.File>,
  ) {
    const attachments = files?.map((file) => ({
      name: file.originalname,
      url: `/uploads/admissions/${file.filename}`,
    }));
    return this.service.create({ ...dto, attachments });
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all admission circulars' })
  @ApiResponse({
    status: 200,
    description: 'List of admission circulars.',
    type: [Admission],
  })
  findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.service.findAll(Number(page), Number(limit));
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get an admission circular by ID' })
  @ApiResponse({
    status: 200,
    description: 'The admission circular.',
    type: Admission,
  })
  @ApiResponse({ status: 404, description: 'Admission circular not found.' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @UseInterceptors(
    FilesInterceptor('attachments', 10, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/admissions';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const baseName = file.originalname
            .replace(ext, '')
            .replace(/[^a-z0-9]/gi, '-')
            .toLowerCase();
          cb(null, `${baseName}-${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB per file
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update admission circular with optional attachments',
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: 'Admission Circular 2025',
        },
        bodyHtml: {
          type: 'string',
          example: '<p>Admission details...</p>',
        },
        admissionYear: {
          type: 'string',
          example: '2025',
        },
        isActive: {
          type: 'boolean',
          example: true,
        },
        attachments: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Optional new attachments to add',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Update an admission circular' })
  @ApiResponse({
    status: 200,
    description: 'The updated admission circular.',
    type: Admission,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Admission circular not found.' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAdmissionDto,
    @UploadedFiles() files?: Array<Express.Multer.File>,
  ) {
    const attachments = files?.map((file) => ({
      name: file.originalname,
      url: `/uploads/admissions/${file.filename}`,
    }));
    return this.service.update(id, {
      ...dto,
      ...(attachments && { attachments }),
    });
  }

  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an admission circular' })
  @ApiResponse({
    status: 200,
    description: 'The admission circular has been deleted.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Admission circular not found.' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
