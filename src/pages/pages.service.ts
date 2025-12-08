import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePageDto, UpdatePageDto } from './dto/page.dto';
import { Page } from './entities/page.entity';

@Injectable()
export class PagesService {
  constructor(
    @InjectRepository(Page)
    private readonly pageRepository: Repository<Page>,
  ) {}

  create(createPageDto: CreatePageDto) {
    const page = this.pageRepository.create(createPageDto);
    return this.pageRepository.save(page);
  }

  findAll() {
    return this.pageRepository.find();
  }

  async findOne(id: string) {
    const page = await this.pageRepository.findOneBy({ id });
    if (!page) {
      throw new NotFoundException(`Page #${id} not found`);
    }
    return page;
  }

  async findBySlug(slug: string) {
    const page = await this.pageRepository.findOneBy({ slug });
    if (!page) {
      throw new NotFoundException(`Page with slug '${slug}' not found`);
    }
    return page;
  }

  async update(id: string, updatePageDto: UpdatePageDto) {
    const page = await this.findOne(id);
    this.pageRepository.merge(page, updatePageDto);
    return this.pageRepository.save(page);
  }

  async remove(id: string) {
    const page = await this.findOne(id);
    return this.pageRepository.remove(page);
  }
}
