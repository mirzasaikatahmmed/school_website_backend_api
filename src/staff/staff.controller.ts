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
import { StaffService } from './staff.service';
import { CreateStaffDto, UpdateStaffDto } from './dto/staff.dto';
import { Staff } from './entities/staff.entity';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('staff')
@Controller('staff')
export class StaffController {
  constructor(private readonly service: StaffService) {}

  @ApiBearerAuth()
  @Post()
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/staff';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `staff-${uniqueSuffix}${ext}`);
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
    description: 'Create staff member with optional photo',
    schema: {
      type: 'object',
      required: ['name', 'designation'],
      properties: {
        name: {
          type: 'string',
          example: 'John Doe',
        },
        designation: {
          type: 'string',
          example: 'Mathematics Teacher',
        },
        photo: {
          type: 'string',
          format: 'binary',
          description: 'Optional staff photo',
        },
        shortBio: {
          type: 'string',
          example: 'Experienced math teacher...',
        },
        email: {
          type: 'string',
          example: 'john@example.com',
        },
        phone: {
          type: 'string',
          example: '+8801711122233',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Create a new staff member' })
  @ApiResponse({
    status: 201,
    description: 'The staff member has been created.',
    type: Staff,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(
    @Body() dto: CreateStaffDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const photoUrl = file ? `/uploads/staff/${file.filename}` : undefined;
    return this.service.create({ ...dto, photoUrl });
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all staff members' })
  @ApiResponse({
    status: 200,
    description: 'List of staff members.',
    type: [Staff],
  })
  findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.service.findAll(Number(page), Number(limit));
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a staff member by ID' })
  @ApiResponse({ status: 200, description: 'The staff member.', type: Staff })
  @ApiResponse({ status: 404, description: 'Staff not found.' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/staff';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `staff-${uniqueSuffix}${ext}`);
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
    description: 'Update staff member with optional photo',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'John Doe',
        },
        designation: {
          type: 'string',
          example: 'Mathematics Teacher',
        },
        photo: {
          type: 'string',
          format: 'binary',
          description: 'Optional staff photo',
        },
        shortBio: {
          type: 'string',
          example: 'Experienced math teacher...',
        },
        email: {
          type: 'string',
          example: 'john@example.com',
        },
        phone: {
          type: 'string',
          example: '+8801711122233',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Update a staff member' })
  @ApiResponse({
    status: 200,
    description: 'The updated staff member.',
    type: Staff,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Staff not found.' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateStaffDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const photoUrl = file ? `/uploads/staff/${file.filename}` : undefined;
    return this.service.update(id, { ...dto, photoUrl });
  }

  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a staff member' })
  @ApiResponse({
    status: 200,
    description: 'The staff member has been deleted.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Staff not found.' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
