import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { HomeService } from './home.service';

import { Public } from '../auth/decorators/public.decorator';

@ApiTags('home') // Added ApiTags
@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create home content' })
  @ApiResponse({ status: 201, description: 'Created.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create() {
    return this.homeService.create();
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get home content' })
  @ApiResponse({ status: 200, description: 'Home content.' })
  findAll() {
    return this.homeService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get home content item' })
  @ApiResponse({ status: 200, description: 'Home content item.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  findOne(@Param('id') id: string) {
    return this.homeService.findOne(+id);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Update home content' })
  @ApiResponse({ status: 200, description: 'Updated.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  update(@Param('id') id: string) {
    return this.homeService.update(+id);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete home content' })
  @ApiResponse({ status: 200, description: 'Deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  remove(@Param('id') id: string) {
    return this.homeService.remove(+id);
  }
}
