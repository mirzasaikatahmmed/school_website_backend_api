import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { HomeService } from './home.service';
import {
  CreateSliderDto,
  UpdateSliderDto,
  SliderResponseDto,
  ReorderSliderDto,
} from './dto/slider.dto';
import {
  CreateAboutDto,
  UpdateAboutDto,
  AboutResponseDto,
} from './dto/about.dto';
import {
  CreateImportantLinkDto,
  UpdateImportantLinkDto,
  ReorderImportantLinkDto,
} from './dto/important-link.dto';
import { CreateOurStoryDto, UpdateOurStoryDto } from './dto/our-story.dto';
import {
  CreatePrincipalMessageDto,
  UpdatePrincipalMessageDto,
} from './dto/principal-message.dto';
import {
  CreateGoverningBoardMemberDto,
  UpdateGoverningBoardMemberDto,
  ReorderGoverningBoardMemberDto,
} from './dto/governing-board.dto';
import {
  CreateSchoolHistoryDto,
  UpdateSchoolHistoryDto,
} from './dto/history.dto';
import {
  CreateHistoryMilestoneDto,
  UpdateHistoryMilestoneDto,
  ReorderHistoryMilestoneDto,
} from './dto/history-milestone.dto';
import {
  CreateInfrastructureCategoryDto,
  UpdateInfrastructureCategoryDto,
  ReorderInfrastructureCategoryDto,
} from './dto/infrastructure-category.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('home')
@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  // Slider endpoints
  @ApiBearerAuth()
  @Post('sliders')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/sliders';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `slider-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create slider with image upload',
    schema: {
      type: 'object',
      required: ['title', 'image'],
      properties: {
        title: { type: 'string', example: 'স্বাগতম গ্রীনফিল্ড উচ্চ বিদ্যালয়' },
        subtitle: { type: 'string', example: 'এবং কলেজ এর পক্ষ থেকে!' },
        linkUrl: { type: 'string', example: '/about' },
        order: { type: 'number', example: 0 },
        isActive: { type: 'boolean', example: true },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiOperation({ summary: 'Create a new slider' })
  @ApiResponse({
    status: 201,
    description: 'Slider created.',
    type: SliderResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  createSlider(
    @Body() dto: CreateSliderDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      dto.imageUrl = `/uploads/sliders/${file.filename}`;
    }
    return this.homeService.createSlider(dto);
  }

  @Public()
  @Get('sliders')
  @ApiOperation({ summary: 'Get all active sliders' })
  @ApiResponse({
    status: 200,
    description: 'List of active sliders.',
    type: [SliderResponseDto],
  })
  findAllSliders() {
    return this.homeService.findAllSliders();
  }

  @ApiBearerAuth()
  @Get('sliders/all')
  @ApiOperation({ summary: 'Get all sliders (admin)' })
  @ApiResponse({
    status: 200,
    description: 'List of all sliders.',
    type: [SliderResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAllSlidersAdmin() {
    return this.homeService.findAllSlidersAdmin();
  }

  @Public()
  @Get('sliders/:id')
  @ApiOperation({ summary: 'Get a slider by ID' })
  @ApiResponse({
    status: 200,
    description: 'The slider.',
    type: SliderResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Slider not found.' })
  findOneSlider(@Param('id') id: string) {
    return this.homeService.findOneSlider(id);
  }

  @ApiBearerAuth()
  @Patch('sliders/:id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/sliders';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `slider-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update slider with optional image upload',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        subtitle: { type: 'string' },
        linkUrl: { type: 'string' },
        order: { type: 'number' },
        isActive: { type: 'boolean' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiOperation({ summary: 'Update a slider' })
  @ApiResponse({
    status: 200,
    description: 'Slider updated.',
    type: SliderResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Slider not found.' })
  updateSlider(
    @Param('id') id: string,
    @Body() dto: UpdateSliderDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      dto.imageUrl = `/uploads/sliders/${file.filename}`;
    }
    return this.homeService.updateSlider(id, dto);
  }

  @ApiBearerAuth()
  @Patch('sliders/:id/reorder')
  @ApiOperation({ summary: 'Reorder a slider' })
  @ApiResponse({
    status: 200,
    description: 'Slider reordered.',
    type: SliderResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Slider not found.' })
  reorderSlider(@Param('id') id: string, @Body() dto: ReorderSliderDto) {
    return this.homeService.reorderSlider(id, dto.order);
  }

  @ApiBearerAuth()
  @Delete('sliders/:id')
  @ApiOperation({ summary: 'Delete a slider' })
  @ApiResponse({ status: 200, description: 'Slider deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Slider not found.' })
  removeSlider(@Param('id') id: string) {
    return this.homeService.removeSlider(id);
  }

  // About Section endpoints
  @ApiBearerAuth()
  @Post('about')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/about';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `about-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create about section with image upload',
    schema: {
      type: 'object',
      required: ['title', 'description'],
      properties: {
        title: { type: 'string', example: 'প্রতিষ্ঠান সম্পর্কে' },
        description: {
          type: 'string',
          example:
            'গ্রীনফিল্ড উচ্চ বিদ্যালয় এবং কলেজ এর অত্যন্ত গৌরবোজ্জ্বল বর্তমান।',
        },
        buttonText: { type: 'string', example: 'বিস্তারিত পড়ুন' },
        buttonLink: { type: 'string', example: '/about' },
        isActive: { type: 'boolean', example: true },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiOperation({ summary: 'Create about section' })
  @ApiResponse({
    status: 201,
    description: 'About section created.',
    type: AboutResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  createAbout(
    @Body() dto: CreateAboutDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      dto.imageUrl = `/uploads/about/${file.filename}`;
    }
    return this.homeService.createAbout(dto);
  }

  @Public()
  @Get('about')
  @ApiOperation({ summary: 'Get active about section' })
  @ApiResponse({
    status: 200,
    description: 'About section.',
    type: AboutResponseDto,
  })
  findAbout() {
    return this.homeService.findAbout();
  }

  @ApiBearerAuth()
  @Get('about/all')
  @ApiOperation({ summary: 'Get all about sections (admin)' })
  @ApiResponse({
    status: 200,
    description: 'List of all about sections.',
    type: [AboutResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAllAbout() {
    return this.homeService.findAllAbout();
  }

  @Public()
  @Get('about/:id')
  @ApiOperation({ summary: 'Get an about section by ID' })
  @ApiResponse({
    status: 200,
    description: 'The about section.',
    type: AboutResponseDto,
  })
  @ApiResponse({ status: 404, description: 'About section not found.' })
  findOneAbout(@Param('id') id: string) {
    return this.homeService.findOneAbout(id);
  }

  @ApiBearerAuth()
  @Patch('about/:id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/about';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `about-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update about section with optional image upload',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        buttonText: { type: 'string' },
        buttonLink: { type: 'string' },
        isActive: { type: 'boolean' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiOperation({ summary: 'Update an about section' })
  @ApiResponse({
    status: 200,
    description: 'About section updated.',
    type: AboutResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'About section not found.' })
  updateAbout(
    @Param('id') id: string,
    @Body() dto: UpdateAboutDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      dto.imageUrl = `/uploads/about/${file.filename}`;
    }
    return this.homeService.updateAbout(id, dto);
  }

  @ApiBearerAuth()
  @Delete('about/:id')
  @ApiOperation({ summary: 'Delete an about section' })
  @ApiResponse({ status: 200, description: 'About section deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'About section not found.' })
  removeAbout(@Param('id') id: string) {
    return this.homeService.removeAbout(id);
  }

  // Important Links endpoints
  @ApiBearerAuth()
  @Post('important-links')
  @UseInterceptors(
    FileInterceptor('icon', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/important-links';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `important-link-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
      limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        url: { type: 'string' },
        icon: { type: 'string', format: 'binary' },
        order: { type: 'number' },
        isActive: { type: 'boolean' },
        openInNewTab: { type: 'boolean' },
      },
      required: ['title', 'url'],
    },
  })
  @ApiOperation({ summary: 'Create a new important link' })
  @ApiResponse({ status: 201, description: 'Important link created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  createImportantLink(
    @Body() createImportantLinkDto: CreateImportantLinkDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      createImportantLinkDto.iconUrl = `/uploads/important-links/${file.filename}`;
    }
    return this.homeService.createImportantLink(createImportantLinkDto);
  }

  @Public()
  @Get('important-links')
  @ApiOperation({ summary: 'Get all active important links (public)' })
  @ApiResponse({
    status: 200,
    description: 'Return all active important links.',
  })
  findAllImportantLinks() {
    return this.homeService.findAllImportantLinks();
  }

  @ApiBearerAuth()
  @Get('important-links/admin')
  @ApiOperation({ summary: 'Get all important links (admin)' })
  @ApiResponse({ status: 200, description: 'Return all important links.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAllImportantLinksAdmin() {
    return this.homeService.findAllImportantLinksAdmin();
  }

  @Public()
  @Get('important-links/:id')
  @ApiOperation({ summary: 'Get a single important link by ID' })
  @ApiResponse({ status: 200, description: 'Return the important link.' })
  @ApiResponse({ status: 404, description: 'Important link not found.' })
  findOneImportantLink(@Param('id') id: string) {
    return this.homeService.findOneImportantLink(id);
  }

  @ApiBearerAuth()
  @Patch('important-links/:id')
  @UseInterceptors(
    FileInterceptor('icon', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/important-links';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `important-link-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
      limits: { fileSize: 2 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        url: { type: 'string' },
        icon: { type: 'string', format: 'binary' },
        order: { type: 'number' },
        isActive: { type: 'boolean' },
        openInNewTab: { type: 'boolean' },
      },
    },
  })
  @ApiOperation({ summary: 'Update an important link' })
  @ApiResponse({ status: 200, description: 'Important link updated.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Important link not found.' })
  updateImportantLink(
    @Param('id') id: string,
    @Body() dto: UpdateImportantLinkDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      dto.iconUrl = `/uploads/important-links/${file.filename}`;
    }
    return this.homeService.updateImportantLink(id, dto);
  }

  @ApiBearerAuth()
  @Patch('important-links/:id/reorder')
  @ApiOperation({ summary: 'Reorder an important link' })
  @ApiResponse({ status: 200, description: 'Important link reordered.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Important link not found.' })
  reorderImportantLink(
    @Param('id') id: string,
    @Body() dto: ReorderImportantLinkDto,
  ) {
    return this.homeService.reorderImportantLink(id, dto.order);
  }

  @ApiBearerAuth()
  @Delete('important-links/:id')
  @ApiOperation({ summary: 'Delete an important link' })
  @ApiResponse({ status: 200, description: 'Important link deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Important link not found.' })
  removeImportantLink(@Param('id') id: string) {
    return this.homeService.removeImportantLink(id);
  }

  // Our Story endpoints
  @ApiBearerAuth()
  @Post('our-story')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/our-story';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `our-story-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        heading: { type: 'string' },
        subheading: { type: 'string' },
        content: { type: 'string' },
        highlightedText: { type: 'string' },
        image: { type: 'string', format: 'binary' },
        isActive: { type: 'boolean' },
      },
      required: ['heading', 'subheading', 'content'],
    },
  })
  @ApiOperation({ summary: 'Create our story section' })
  @ApiResponse({ status: 201, description: 'Our story section created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  createOurStory(
    @Body() createOurStoryDto: CreateOurStoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      createOurStoryDto.imageUrl = `/uploads/our-story/${file.filename}`;
    }
    return this.homeService.createOurStory(createOurStoryDto);
  }

  @Public()
  @Get('our-story')
  @ApiOperation({ summary: 'Get active our story section (public)' })
  @ApiResponse({ status: 200, description: 'Return active our story section.' })
  findOurStory() {
    return this.homeService.findOurStory();
  }

  @ApiBearerAuth()
  @Get('our-story/admin')
  @ApiOperation({ summary: 'Get all our story sections (admin)' })
  @ApiResponse({ status: 200, description: 'Return all our story sections.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAllOurStory() {
    return this.homeService.findAllOurStory();
  }

  @Public()
  @Get('our-story/:id')
  @ApiOperation({ summary: 'Get a single our story section by ID' })
  @ApiResponse({ status: 200, description: 'Return the our story section.' })
  @ApiResponse({ status: 404, description: 'Our story section not found.' })
  findOneOurStory(@Param('id') id: string) {
    return this.homeService.findOneOurStory(id);
  }

  @ApiBearerAuth()
  @Patch('our-story/:id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/our-story';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `our-story-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        heading: { type: 'string' },
        subheading: { type: 'string' },
        content: { type: 'string' },
        highlightedText: { type: 'string' },
        image: { type: 'string', format: 'binary' },
        isActive: { type: 'boolean' },
      },
    },
  })
  @ApiOperation({ summary: 'Update our story section' })
  @ApiResponse({ status: 200, description: 'Our story section updated.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Our story section not found.' })
  updateOurStory(
    @Param('id') id: string,
    @Body() dto: UpdateOurStoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      dto.imageUrl = `/uploads/our-story/${file.filename}`;
    }
    return this.homeService.updateOurStory(id, dto);
  }

  @ApiBearerAuth()
  @Delete('our-story/:id')
  @ApiOperation({ summary: 'Delete our story section' })
  @ApiResponse({ status: 200, description: 'Our story section deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Our story section not found.' })
  removeOurStory(@Param('id') id: string) {
    return this.homeService.removeOurStory(id);
  }

  // Principal Message endpoints
  @ApiBearerAuth()
  @Post('principal-message')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/principal';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `principal-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 3 * 1024 * 1024 }, // 3MB limit
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/i)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        heading: { type: 'string' },
        subheading: { type: 'string' },
        salutation: { type: 'string' },
        message: { type: 'string' },
        additionalMessage: { type: 'string' },
        principalName: { type: 'string' },
        designation: { type: 'string' },
        photo: { type: 'string', format: 'binary' },
        isActive: { type: 'boolean' },
      },
      required: [
        'heading',
        'subheading',
        'salutation',
        'message',
        'principalName',
        'designation',
      ],
    },
  })
  @ApiOperation({ summary: 'Create principal message' })
  @ApiResponse({ status: 201, description: 'Principal message created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  createPrincipalMessage(
    @Body() createPrincipalMessageDto: CreatePrincipalMessageDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      createPrincipalMessageDto.photoUrl = `/uploads/principal/${file.filename}`;
    }
    return this.homeService.createPrincipalMessage(createPrincipalMessageDto);
  }

  @Public()
  @Get('principal-message')
  @ApiOperation({ summary: 'Get active principal message (public)' })
  @ApiResponse({
    status: 200,
    description: 'Return active principal message.',
  })
  findPrincipalMessage() {
    return this.homeService.findPrincipalMessage();
  }

  @ApiBearerAuth()
  @Get('principal-message/admin')
  @ApiOperation({ summary: 'Get all principal messages (admin)' })
  @ApiResponse({ status: 200, description: 'Return all principal messages.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAllPrincipalMessage() {
    return this.homeService.findAllPrincipalMessage();
  }

  @Public()
  @Get('principal-message/:id')
  @ApiOperation({ summary: 'Get a single principal message by ID' })
  @ApiResponse({ status: 200, description: 'Return the principal message.' })
  @ApiResponse({ status: 404, description: 'Principal message not found.' })
  findOnePrincipalMessage(@Param('id') id: string) {
    return this.homeService.findOnePrincipalMessage(id);
  }

  @ApiBearerAuth()
  @Patch('principal-message/:id')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/principal';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `principal-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 3 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/i)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        heading: { type: 'string' },
        subheading: { type: 'string' },
        salutation: { type: 'string' },
        message: { type: 'string' },
        additionalMessage: { type: 'string' },
        principalName: { type: 'string' },
        designation: { type: 'string' },
        photo: { type: 'string', format: 'binary' },
        isActive: { type: 'boolean' },
      },
    },
  })
  @ApiOperation({ summary: 'Update principal message' })
  @ApiResponse({ status: 200, description: 'Principal message updated.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Principal message not found.' })
  updatePrincipalMessage(
    @Param('id') id: string,
    @Body() dto: UpdatePrincipalMessageDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      dto.photoUrl = `/uploads/principal/${file.filename}`;
    }
    return this.homeService.updatePrincipalMessage(id, dto);
  }

  @ApiBearerAuth()
  @Delete('principal-message/:id')
  @ApiOperation({ summary: 'Delete principal message' })
  @ApiResponse({ status: 200, description: 'Principal message deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Principal message not found.' })
  removePrincipalMessage(@Param('id') id: string) {
    return this.homeService.removePrincipalMessage(id);
  }

  // Governing Board Members endpoints
  @ApiBearerAuth()
  @Post('governing-board')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/governing-board';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `board-member-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/i)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        designation: { type: 'string' },
        photo: { type: 'string', format: 'binary' },
        order: { type: 'number' },
        isActive: { type: 'boolean' },
      },
      required: ['name', 'designation'],
    },
  })
  @ApiOperation({ summary: 'Create a new governing board member' })
  @ApiResponse({ status: 201, description: 'Board member created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  createGoverningBoardMember(
    @Body() createGoverningBoardMemberDto: CreateGoverningBoardMemberDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      createGoverningBoardMemberDto.photoUrl = `/uploads/governing-board/${file.filename}`;
    }
    return this.homeService.createGoverningBoardMember(
      createGoverningBoardMemberDto,
    );
  }

  @Public()
  @Get('governing-board')
  @ApiOperation({ summary: 'Get all active governing board members (public)' })
  @ApiResponse({
    status: 200,
    description: 'Return all active board members.',
  })
  findAllGoverningBoardMembers() {
    return this.homeService.findAllGoverningBoardMembers();
  }

  @ApiBearerAuth()
  @Get('governing-board/admin')
  @ApiOperation({ summary: 'Get all governing board members (admin)' })
  @ApiResponse({ status: 200, description: 'Return all board members.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAllGoverningBoardMembersAdmin() {
    return this.homeService.findAllGoverningBoardMembersAdmin();
  }

  @Public()
  @Get('governing-board/:id')
  @ApiOperation({ summary: 'Get a single board member by ID' })
  @ApiResponse({ status: 200, description: 'Return the board member.' })
  @ApiResponse({ status: 404, description: 'Board member not found.' })
  findOneGoverningBoardMember(@Param('id') id: string) {
    return this.homeService.findOneGoverningBoardMember(id);
  }

  @ApiBearerAuth()
  @Patch('governing-board/:id')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/governing-board';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `board-member-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 2 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/i)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        designation: { type: 'string' },
        photo: { type: 'string', format: 'binary' },
        order: { type: 'number' },
        isActive: { type: 'boolean' },
      },
    },
  })
  @ApiOperation({ summary: 'Update a governing board member' })
  @ApiResponse({ status: 200, description: 'Board member updated.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Board member not found.' })
  updateGoverningBoardMember(
    @Param('id') id: string,
    @Body() dto: UpdateGoverningBoardMemberDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      dto.photoUrl = `/uploads/governing-board/${file.filename}`;
    }
    return this.homeService.updateGoverningBoardMember(id, dto);
  }

  @ApiBearerAuth()
  @Patch('governing-board/:id/reorder')
  @ApiOperation({ summary: 'Reorder a governing board member' })
  @ApiResponse({ status: 200, description: 'Board member reordered.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Board member not found.' })
  reorderGoverningBoardMember(
    @Param('id') id: string,
    @Body() dto: ReorderGoverningBoardMemberDto,
  ) {
    return this.homeService.reorderGoverningBoardMember(id, dto.order);
  }

  @ApiBearerAuth()
  @Delete('governing-board/:id')
  @ApiOperation({ summary: 'Delete a governing board member' })
  @ApiResponse({ status: 200, description: 'Board member deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Board member not found.' })
  removeGoverningBoardMember(@Param('id') id: string) {
    return this.homeService.removeGoverningBoardMember(id);
  }

  // School History endpoints
  @Post('school-history')
  @ApiOperation({ summary: 'Create or update school history content' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateSchoolHistoryDto })
  @ApiResponse({ status: 201, description: 'School history created/updated.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  createSchoolHistory(@Body() createSchoolHistoryDto: CreateSchoolHistoryDto) {
    return this.homeService.createSchoolHistory(createSchoolHistoryDto);
  }

  @Public()
  @Get('school-history')
  @ApiOperation({ summary: 'Get active school history (Public)' })
  @ApiResponse({ status: 200, description: 'School history retrieved.' })
  findSchoolHistory() {
    return this.homeService.findSchoolHistory();
  }

  @Get('school-history/all')
  @ApiOperation({ summary: 'Get all school history records (Admin)' })
  @ApiResponse({ status: 200, description: 'All school history records.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAllSchoolHistory() {
    return this.homeService.findAllSchoolHistory();
  }

  @Get('school-history/:id')
  @ApiOperation({ summary: 'Get school history by ID' })
  @ApiResponse({ status: 200, description: 'School history found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'School history not found.' })
  findOneSchoolHistory(@Param('id') id: string) {
    return this.homeService.findOneSchoolHistory(id);
  }

  @Patch('school-history/:id')
  @ApiOperation({ summary: 'Update school history' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateSchoolHistoryDto })
  @ApiResponse({ status: 200, description: 'School history updated.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'School history not found.' })
  updateSchoolHistory(
    @Param('id') id: string,
    @Body() updateSchoolHistoryDto: UpdateSchoolHistoryDto,
  ) {
    return this.homeService.updateSchoolHistory(id, updateSchoolHistoryDto);
  }

  @Delete('school-history/:id')
  @ApiOperation({ summary: 'Delete school history' })
  @ApiResponse({ status: 200, description: 'School history deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'School history not found.' })
  removeSchoolHistory(@Param('id') id: string) {
    return this.homeService.removeSchoolHistory(id);
  }

  // History Milestone endpoints
  @Post('history-milestones')
  @ApiOperation({ summary: 'Create a new history milestone' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateHistoryMilestoneDto })
  @ApiResponse({ status: 201, description: 'History milestone created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  createHistoryMilestone(
    @Body() createHistoryMilestoneDto: CreateHistoryMilestoneDto,
  ) {
    return this.homeService.createHistoryMilestone(createHistoryMilestoneDto);
  }

  @Public()
  @Get('history-milestones')
  @ApiOperation({ summary: 'Get active history milestones (Public)' })
  @ApiResponse({ status: 200, description: 'Active milestones retrieved.' })
  findAllHistoryMilestones() {
    return this.homeService.findAllHistoryMilestones();
  }

  @Get('history-milestones/admin')
  @ApiOperation({ summary: 'Get all history milestones (Admin)' })
  @ApiResponse({ status: 200, description: 'All milestones retrieved.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAllHistoryMilestonesAdmin() {
    return this.homeService.findAllHistoryMilestonesAdmin();
  }

  @Get('history-milestones/:id')
  @ApiOperation({ summary: 'Get history milestone by ID' })
  @ApiResponse({ status: 200, description: 'Milestone found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Milestone not found.' })
  findOneHistoryMilestone(@Param('id') id: string) {
    return this.homeService.findOneHistoryMilestone(id);
  }

  @Patch('history-milestones/:id')
  @ApiOperation({ summary: 'Update history milestone' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateHistoryMilestoneDto })
  @ApiResponse({ status: 200, description: 'Milestone updated.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Milestone not found.' })
  updateHistoryMilestone(
    @Param('id') id: string,
    @Body() updateHistoryMilestoneDto: UpdateHistoryMilestoneDto,
  ) {
    return this.homeService.updateHistoryMilestone(
      id,
      updateHistoryMilestoneDto,
    );
  }

  @Patch('history-milestones/:id/reorder')
  @ApiOperation({ summary: 'Reorder history milestone' })
  @ApiBody({ type: ReorderHistoryMilestoneDto })
  @ApiResponse({ status: 200, description: 'Milestone reordered.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  reorderHistoryMilestone(
    @Param('id') id: string,
    @Body() reorderDto: ReorderHistoryMilestoneDto,
  ) {
    return this.homeService.reorderHistoryMilestone(id, reorderDto.order);
  }

  @Delete('history-milestones/:id')
  @ApiOperation({ summary: 'Delete history milestone' })
  @ApiResponse({ status: 200, description: 'Milestone deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Milestone not found.' })
  removeHistoryMilestone(@Param('id') id: string) {
    return this.homeService.removeHistoryMilestone(id);
  }

  // Infrastructure Category endpoints
  @Post('infrastructure-categories')
  @ApiOperation({ summary: 'Create a new infrastructure category' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateInfrastructureCategoryDto })
  @ApiResponse({
    status: 201,
    description: 'Infrastructure category created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  createInfrastructureCategory(
    @Body() createDto: CreateInfrastructureCategoryDto,
  ) {
    return this.homeService.createInfrastructureCategory(createDto);
  }

  @Public()
  @Get('infrastructure-categories')
  @ApiOperation({ summary: 'Get active infrastructure categories (Public)' })
  @ApiResponse({ status: 200, description: 'Active categories retrieved.' })
  findAllInfrastructureCategories() {
    return this.homeService.findAllInfrastructureCategories();
  }

  @Get('infrastructure-categories/admin')
  @ApiOperation({ summary: 'Get all infrastructure categories (Admin)' })
  @ApiResponse({ status: 200, description: 'All categories retrieved.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAllInfrastructureCategoriesAdmin() {
    return this.homeService.findAllInfrastructureCategoriesAdmin();
  }

  @Get('infrastructure-categories/:id')
  @ApiOperation({ summary: 'Get infrastructure category by ID' })
  @ApiResponse({ status: 200, description: 'Category found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  findOneInfrastructureCategory(@Param('id') id: string) {
    return this.homeService.findOneInfrastructureCategory(id);
  }

  @Patch('infrastructure-categories/:id')
  @ApiOperation({ summary: 'Update infrastructure category' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateInfrastructureCategoryDto })
  @ApiResponse({ status: 200, description: 'Category updated.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  updateInfrastructureCategory(
    @Param('id') id: string,
    @Body() updateDto: UpdateInfrastructureCategoryDto,
  ) {
    return this.homeService.updateInfrastructureCategory(id, updateDto);
  }

  @Patch('infrastructure-categories/:id/reorder')
  @ApiOperation({ summary: 'Reorder infrastructure category' })
  @ApiBody({ type: ReorderInfrastructureCategoryDto })
  @ApiResponse({ status: 200, description: 'Category reordered.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  reorderInfrastructureCategory(
    @Param('id') id: string,
    @Body() reorderDto: ReorderInfrastructureCategoryDto,
  ) {
    return this.homeService.reorderInfrastructureCategory(id, reorderDto.order);
  }

  @Delete('infrastructure-categories/:id')
  @ApiOperation({ summary: 'Delete infrastructure category' })
  @ApiResponse({ status: 200, description: 'Category deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  removeInfrastructureCategory(@Param('id') id: string) {
    return this.homeService.removeInfrastructureCategory(id);
  }
}
