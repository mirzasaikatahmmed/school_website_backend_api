import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/contact.dto';

@ApiTags('contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly service: ContactService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a new contact message' })
  create(@Body() dto: CreateContactDto) {
    return this.service.create(dto);
  }

  @Get('messages') // Changed path to match doc.md requirement for admin listing
  @ApiOperation({ summary: 'Get all contact messages (Admin)' })
  findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.service.findAll(Number(page), Number(limit));
  }

  // Removed update as it's not needed for messages

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a contact message' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
