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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { ResultsService } from './results.service';
import { CreateResultDto, UpdateResultDto } from './dto/result.dto';
import { Result } from './entities/result.entity';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('results')
@Controller('results')
export class ResultsController {
  constructor(private readonly service: ResultsService) {}

  @ApiBearerAuth()
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/results';
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
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Publish exam result with file upload',
    schema: {
      type: 'object',
      required: ['title', 'file'],
      properties: {
        title: {
          type: 'string',
          example: 'SSC Result 2024',
        },
        examType: {
          type: 'string',
          example: 'SSC',
        },
        year: {
          type: 'string',
          example: '2024',
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Result file (PDF, Excel, etc.)',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Publish a new exam result' })
  @ApiResponse({
    status: 201,
    description: 'The result has been published.',
    type: Result,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(
    @Body() dto: CreateResultDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const fileUrl = file ? `/uploads/results/${file.filename}` : dto.fileUrl;
    return this.service.create({ ...dto, fileUrl });
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all exam results' })
  @ApiResponse({
    status: 200,
    description: 'List of exam results.',
    type: [Result],
  })
  findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.service.findAll(Number(page), Number(limit));
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get an exam result by ID' })
  @ApiResponse({ status: 200, description: 'The result.', type: Result })
  @ApiResponse({ status: 404, description: 'Result not found.' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/results';
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
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update exam result with optional file upload',
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: 'SSC Result 2024',
        },
        examType: {
          type: 'string',
          example: 'SSC',
        },
        year: {
          type: 'string',
          example: '2024',
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Optional file to replace existing one',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Update an exam result' })
  @ApiResponse({
    status: 200,
    description: 'The updated result.',
    type: Result,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Result not found.' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateResultDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const fileUrl = file ? `/uploads/results/${file.filename}` : undefined;
    return this.service.update(id, { ...dto, ...(fileUrl && { fileUrl }) });
  }

  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an exam result' })
  @ApiResponse({ status: 200, description: 'The result has been deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Result not found.' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
