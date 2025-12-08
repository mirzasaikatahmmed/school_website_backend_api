import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GalleriesService } from './galleries.service';
import { CreateGalleryDto, UpdateGalleryDto, CreatePhotoDto } from './dto/gallery.dto';

@ApiTags('galleries')
@Controller('galleries')
export class GalleriesController {
  constructor(private readonly galleriesService: GalleriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new gallery' })
  create(@Body() createGalleryDto: CreateGalleryDto) {
    return this.galleriesService.create(createGalleryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all galleries' })
  findAll() {
    return this.galleriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a gallery by ID' })
  findOne(@Param('id') id: string) {
    return this.galleriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a gallery' })
  update(@Param('id') id: string, @Body() updateGalleryDto: UpdateGalleryDto) {
    return this.galleriesService.update(id, updateGalleryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a gallery' })
  remove(@Param('id') id: string) {
    return this.galleriesService.remove(id);
  }

  @Post(':id/photos')
  @ApiOperation({ summary: 'Add a photo to a gallery' })
  addPhoto(@Param('id') id: string, @Body() createPhotoDto: CreatePhotoDto) {
    return this.galleriesService.addPhoto(id, createPhotoDto);
  }

  @Get(':id/photos')
  @ApiOperation({ summary: 'Get photos of a gallery' })
  getPhotos(@Param('id') id: string, @Query('page') page = 1) {
    return this.galleriesService.getPhotos(id, Number(page));
  }

  @Delete(':id/photos/:photoId')
  @ApiOperation({ summary: 'Remove a photo from a gallery' })
  removePhoto(@Param('id') id: string, @Param('photoId') photoId: string) {
    return this.galleriesService.removePhoto(id, photoId);
  }
}
