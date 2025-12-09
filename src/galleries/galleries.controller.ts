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
import { GalleriesService } from './galleries.service';
import {
  CreateGalleryDto,
  UpdateGalleryDto,
  CreatePhotoDto,
} from './dto/gallery.dto';
import { Gallery } from './entities/gallery.entity';
import { Photo } from './entities/photo.entity';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('galleries')
@Controller('galleries')
export class GalleriesController {
  constructor(private readonly galleriesService: GalleriesService) {}

  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create a new gallery' })
  @ApiResponse({
    status: 201,
    description: 'The gallery has been created.',
    type: Gallery,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(@Body() createGalleryDto: CreateGalleryDto) {
    return this.galleriesService.create(createGalleryDto);
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
  @ApiOperation({ summary: 'Update a gallery' })
  @ApiResponse({
    status: 200,
    description: 'The updated gallery.',
    type: Gallery,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Gallery not found.' })
  update(@Param('id') id: string, @Body() updateGalleryDto: UpdateGalleryDto) {
    return this.galleriesService.update(id, updateGalleryDto);
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
  @ApiOperation({ summary: 'Add a photo to a gallery' })
  @ApiResponse({
    status: 201,
    description: 'Photo added to gallery.',
    type: Photo,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Gallery not found.' })
  addPhoto(@Param('id') id: string, @Body() createPhotoDto: CreatePhotoDto) {
    return this.galleriesService.addPhoto(id, createPhotoDto);
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
