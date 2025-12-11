import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BulkCreateStudentStatDto,
  CreateStudentStatDto,
  UpdateStudentStatDto,
} from './dto/student-stat.dto';
import { StudentStat } from './entities/student-stat.entity';

@Injectable()
export class StudentStatsService {
  constructor(
    @InjectRepository(StudentStat)
    private readonly repo: Repository<StudentStat>,
  ) {}

  private withTotal(dto: CreateStudentStatDto | UpdateStudentStatDto) {
    const total =
      dto.total ??
      (dto.boys !== undefined && dto.girls !== undefined
        ? dto.boys + dto.girls
        : undefined);
    return { ...dto, ...(total !== undefined ? { total } : {}) };
  }

  async create(dto: CreateStudentStatDto) {
    const entity = this.repo.create(this.withTotal(dto));
    return this.repo.save(entity);
  }

  async createBulk(dto: BulkCreateStudentStatDto) {
    const entities = dto.items.map((item) =>
      this.repo.create(this.withTotal(item)),
    );
    return this.repo.save(entities);
  }

  findAll() {
    return this.repo.find({ order: { className: 'ASC' } });
  }

  async findOne(id: string) {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Student stat not found');
    return item;
  }

  async update(id: string, dto: UpdateStudentStatDto) {
    const existing = await this.findOne(id);
    const merged = this.withTotal({ ...existing, ...dto });
    await this.repo.update(id, merged);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.repo.delete(id);
    return { success: true };
  }

  async summary() {
    const rows = await this.repo.find();
    const totals = rows.reduce(
      (acc, row) => {
        acc.totalClasses += 1;
        acc.totalBoys += row.boys;
        acc.totalGirls += row.girls;
        acc.totalStudents += row.total;
        return acc;
      },
      { totalClasses: 0, totalBoys: 0, totalGirls: 0, totalStudents: 0 },
    );
    return { ...totals, rows };
  }
}
