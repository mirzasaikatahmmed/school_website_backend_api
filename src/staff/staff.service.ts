import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStaffDto, UpdateStaffDto } from './dto/staff.dto';
import { Staff } from './entities/staff.entity';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
  ) {}

  create(createStaffDto: CreateStaffDto) {
    const staff = this.staffRepository.create(createStaffDto);
    return this.staffRepository.save(staff);
  }

  async findAll(page: number = 1, limit: number = 20) {
    const [items, total] = await this.staffRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { name: 'ASC' },
    });
    return { items, total, page, limit };
  }

  async findOne(id: string) {
    const staff = await this.staffRepository.findOneBy({ id });
    if (!staff) {
      throw new NotFoundException(`Staff #${id} not found`);
    }
    return staff;
  }

  async update(id: string, updateStaffDto: UpdateStaffDto) {
    const staff = await this.findOne(id);
    this.staffRepository.merge(staff, updateStaffDto);
    return this.staffRepository.save(staff);
  }

  async remove(id: string) {
    const staff = await this.findOne(id);
    return this.staffRepository.remove(staff);
  }
}
