import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateSchoolSettingsDto,
  UpdateSchoolSettingsDto,
} from './dto/school-settings.dto';
import { SchoolSettings } from './entities/school-settings.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(SchoolSettings)
    private readonly settingsRepository: Repository<SchoolSettings>,
  ) {}

  private async getExistingSettings(): Promise<SchoolSettings | null> {
    return this.settingsRepository.findOne({ order: { createdAt: 'DESC' } });
  }

  async createOrUpdateSettings(
    createDto: CreateSchoolSettingsDto,
  ): Promise<SchoolSettings> {
    try {
      const existingSettings = await this.getExistingSettings();
      if (existingSettings) {
        throw new BadRequestException(
          'Settings already exist. Use PATCH to update the existing record.',
        );
      }

      const settings = this.settingsRepository.create(createDto);
      return await this.settingsRepository.save(settings);
    } catch (error: unknown) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to create/update school settings',
        message,
      );
    }
  }

  async findSettings(): Promise<SchoolSettings> {
    try {
      const settings = await this.settingsRepository.findOne({
        where: { isActive: true },
        order: { createdAt: 'DESC' },
      });
      if (!settings) {
        throw new NotFoundException('School settings not found');
      }
      return settings;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to fetch school settings',
        message,
      );
    }
  }

  async findAllSettings(): Promise<SchoolSettings[]> {
    try {
      return await this.settingsRepository.find({
        order: { createdAt: 'DESC' },
        take: 1,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to fetch all school settings',
        message,
      );
    }
  }

  async findOneSettings(id: string): Promise<SchoolSettings> {
    try {
      const settings = await this.settingsRepository.findOne({
        where: { id },
      });
      if (!settings) {
        throw new NotFoundException('School settings not found');
      }
      return settings;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to fetch school settings',
        message,
      );
    }
  }

  async updateSettings(
    id: string,
    updateDto: UpdateSchoolSettingsDto,
  ): Promise<SchoolSettings> {
    try {
      const settings = await this.findOneSettings(id);
      Object.assign(settings, updateDto);
      return await this.settingsRepository.save(settings);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to update school settings',
        message,
      );
    }
  }

  async removeSettings(id: string): Promise<void> {
    try {
      const settings = await this.findOneSettings(id);
      await this.settingsRepository.remove(settings);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to delete school settings',
        message,
      );
    }
  }
}
