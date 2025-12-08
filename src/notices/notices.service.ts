import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNoticeDto, UpdateNoticeDto } from './dto/notice.dto'; // Updated import path to match file
import { Notice } from './entities/notice.entity';

@Injectable()
export class NoticesService {
  constructor(
    @InjectRepository(Notice)
    private readonly noticeRepository: Repository<Notice>,
  ) {}

  create(createNoticeDto: CreateNoticeDto) {
    const notice = this.noticeRepository.create(createNoticeDto);
    return this.noticeRepository.save(notice);
  }

  async findAll(page: number = 1, limit: number = 10) {
    const [items, total] = await this.noticeRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { publishedAt: 'DESC' },
    });
    return { items, total, page, limit };
  }

  async findOne(id: string) {
    const notice = await this.noticeRepository.findOneBy({ id });
    if (!notice) {
      throw new NotFoundException(`Notice #${id} not found`);
    }
    return notice;
  }

  async update(id: string, updateNoticeDto: UpdateNoticeDto) {
    const notice = await this.findOne(id); // Check existence
    this.noticeRepository.merge(notice, updateNoticeDto);
    return this.noticeRepository.save(notice);
  }

  async remove(id: string) {
    const notice = await this.findOne(id);
    return this.noticeRepository.remove(notice);
  }
}
