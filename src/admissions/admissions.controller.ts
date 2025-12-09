import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Create a new admission circular' })
  @ApiResponse({
    status: 201,
    description: 'The admission circular has been created.',
    type: Admission,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(@Body() dto: CreateAdmissionDto) {
    return this.service.create(dto);
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
  @ApiOperation({ summary: 'Update an admission circular' })
  @ApiResponse({
    status: 200,
    description: 'The updated admission circular.',
    type: Admission,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Admission circular not found.' })
  update(@Param('id') id: string, @Body() dto: UpdateAdmissionDto) {
    return this.service.update(id, dto);
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
