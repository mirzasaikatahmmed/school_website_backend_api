import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDownloadDto, UpdateDownloadDto } from './dto/download.dto';
import { Download } from './entities/download.entity';

@Injectable()
export class DownloadsService {
  constructor(
    @InjectRepository(Download)
    private readonly downloadRepository: Repository<Download>,
  ) {}

  create(createDownloadDto: CreateDownloadDto) {
    const download = this.downloadRepository.create(createDownloadDto);
    return this.downloadRepository.save(download);
  }

  async findAll() {
    return await this.downloadRepository.find({
      order: { uploadedAt: 'DESC' },
    });
  }

  async findPaginated(page: number = 1, limit: number = 20) {
    const [items, total] = await this.downloadRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { uploadedAt: 'DESC' },
    });
    return { items, total, page, limit };
  }

  async findOne(id: string) {
    const download = await this.downloadRepository.findOneBy({ id });
    if (!download) {
      throw new NotFoundException(`Download #${id} not found`);
    }
    return download;
  }

  async update(id: string, updateDownloadDto: UpdateDownloadDto) {
    const download = await this.findOne(id);
    this.downloadRepository.merge(download, updateDownloadDto);
    return this.downloadRepository.save(download);
  }

  async remove(id: string) {
    const download = await this.findOne(id);
    return this.downloadRepository.remove(download);
  }
}
