import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateResultDto, UpdateResultDto } from './dto/result.dto';
import { Result } from './entities/result.entity';

@Injectable()
export class ResultsService {
  constructor(
    @InjectRepository(Result)
    private readonly resultRepository: Repository<Result>,
  ) {}

  create(createResultDto: CreateResultDto) {
    const result = this.resultRepository.create(createResultDto);
    return this.resultRepository.save(result);
  }

  async findAll(page: number = 1, limit: number = 20) {
    const [items, total] = await this.resultRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { publishedAt: 'DESC' },
    });
    return { items, total, page, limit };
  }

  async findOne(id: string) {
    const result = await this.resultRepository.findOneBy({ id });
    if (!result) {
      throw new NotFoundException(`Result #${id} not found`);
    }
    return result;
  }

  async update(id: string, updateResultDto: UpdateResultDto) {
    const result = await this.findOne(id);
    this.resultRepository.merge(result, updateResultDto);
    return this.resultRepository.save(result);
  }

  async remove(id: string) {
    const result = await this.findOne(id);
    return this.resultRepository.remove(result);
  }
}
