import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateGalleryDto,
  UpdateGalleryDto,
  CreatePhotoDto,
} from './dto/gallery.dto';
import { Gallery } from './entities/gallery.entity';
import { Photo } from './entities/photo.entity';

@Injectable()
export class GalleriesService {
  constructor(
    @InjectRepository(Gallery)
    private readonly galleryRepository: Repository<Gallery>,
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
  ) {}

  create(createGalleryDto: CreateGalleryDto) {
    const { photos, ...rest } = createGalleryDto;
    const gallery = this.galleryRepository.create(rest);
    if (photos && photos.length > 0) {
      gallery.photos = photos.map((url) =>
        this.photoRepository.create({ url }),
      );
    }
    return this.galleryRepository.save(gallery);
  }

  findAll() {
    return this.galleryRepository.find({ relations: ['photos'] });
  }

  async findOne(id: string) {
    const gallery = await this.galleryRepository.findOne({
      where: { id },
      relations: ['photos'],
    });
    if (!gallery) {
      throw new NotFoundException(`Gallery #${id} not found`);
    }
    return gallery;
  }

  async update(id: string, updateGalleryDto: UpdateGalleryDto) {
    const gallery = await this.findOne(id);
    const { photos, ...rest } = updateGalleryDto;
    this.galleryRepository.merge(gallery, rest);

    if (photos && photos.length > 0) {
      const newPhotos = photos.map((url) =>
        this.photoRepository.create({ url }),
      );
      if (gallery.photos) {
        gallery.photos.push(...newPhotos);
      } else {
        gallery.photos = newPhotos;
      }
    }
    return this.galleryRepository.save(gallery);
  }

  async remove(id: string) {
    const gallery = await this.findOne(id);
    return this.galleryRepository.remove(gallery);
  }

  async addPhoto(galleryId: string, createPhotoDto: CreatePhotoDto) {
    const gallery = await this.findOne(galleryId);
    const photo = this.photoRepository.create({ ...createPhotoDto, gallery });
    return this.photoRepository.save(photo);
  }

  async addPhotos(galleryId: string, urls: string[], captions: string[] = []) {
    const gallery = await this.findOne(galleryId);
    const photos = urls.map((url, index) => {
      return this.photoRepository.create({
        url,
        caption: captions[index] || undefined,
        gallery,
      });
    });
    return this.photoRepository.save(photos);
  }

  async getPhotos(galleryId: string, page: number = 1, limit: number = 20) {
    const [items, total] = await this.photoRepository.findAndCount({
      where: { gallery: { id: galleryId } },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit };
  }

  async removePhoto(galleryId: string, photoId: string) {
    const photo = await this.photoRepository.findOne({
      where: { id: photoId, gallery: { id: galleryId } },
    });
    if (!photo) {
      throw new NotFoundException(
        `Photo #${photoId} not found in gallery #${galleryId}`,
      );
    }
    return this.photoRepository.remove(photo);
  }

  async updateCover(id: string, coverUrl: string) {
    const gallery = await this.findOne(id);
    gallery.coverUrl = coverUrl;
    return this.galleryRepository.save(gallery);
  }
}
