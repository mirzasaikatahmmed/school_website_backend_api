import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAdmissionDto, UpdateAdmissionDto } from './dto/admission.dto';
import { Admission } from './entities/admission.entity';

@Injectable()
export class AdmissionsService {
  constructor(
    @InjectRepository(Admission)
    private readonly admissionRepository: Repository<Admission>,
  ) {}

  create(createAdmissionDto: CreateAdmissionDto) {
    const admission = this.admissionRepository.create(createAdmissionDto);
    return this.admissionRepository.save(admission);
  }

  async findAll(page: number = 1, limit: number = 20) {
    const [items, total] = await this.admissionRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { publishedAt: 'DESC' },
    });
    return { items, total, page, limit };
  }

  async findOne(id: string) {
    const admission = await this.admissionRepository.findOneBy({ id });
    if (!admission) {
      throw new NotFoundException(`Admission #${id} not found`);
    }
    return admission;
  }

  async update(id: string, updateAdmissionDto: UpdateAdmissionDto) {
    const admission = await this.findOne(id);
    this.admissionRepository.merge(admission, updateAdmissionDto);
    return this.admissionRepository.save(admission);
  }

  async remove(id: string) {
    const admission = await this.findOne(id);
    return this.admissionRepository.remove(admission);
  }
}
