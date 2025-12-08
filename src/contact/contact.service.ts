import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateContactDto } from './dto/contact.dto';
import { ContactMessage } from './entities/contact.entity';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactMessage)
    private readonly contactRepository: Repository<ContactMessage>,
  ) {}

  create(createContactDto: CreateContactDto) {
    const contact = this.contactRepository.create(createContactDto);
    return this.contactRepository.save(contact);
  }

  async findAll(page: number = 1, limit: number = 20) {
    const [items, total] = await this.contactRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { items, total, page, limit };
  }

  async findOne(id: string) {
    const contact = await this.contactRepository.findOneBy({ id });
    if (!contact) {
      throw new NotFoundException(`Contact message #${id} not found`);
    }
    return contact;
  }

  // Update is not typically needed for contact messages

  async remove(id: string) {
    const contact = await this.findOne(id);
    return this.contactRepository.remove(contact);
  }
}
