import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/contact.dto';
import { ContactMessage } from './entities/contact.entity';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly service: ContactService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Submit a new contact message' })
  @ApiResponse({
    status: 201,
    description: 'Message submitted successfully.',
    type: ContactMessage,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() dto: CreateContactDto) {
    return this.service.create(dto);
  }

  @ApiBearerAuth()
  @Get('messages') // Changed path to match doc.md requirement for admin listing
  @ApiOperation({ summary: 'Get all contact messages (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'List of messages.',
    type: [ContactMessage],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.service.findAll(Number(page), Number(limit));
  }

  // Removed update as it's not needed for messages

  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a contact message' })
  @ApiResponse({ status: 200, description: 'Message deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Message not found.' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
