import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSliderDto, UpdateSliderDto } from './dto/slider.dto';
import { CreateAboutDto, UpdateAboutDto } from './dto/about.dto';
import {
  CreateImportantLinkDto,
  UpdateImportantLinkDto,
} from './dto/important-link.dto';
import { CreateOurStoryDto, UpdateOurStoryDto } from './dto/our-story.dto';
import {
  CreatePrincipalMessageDto,
  UpdatePrincipalMessageDto,
} from './dto/principal-message.dto';
import {
  CreateGoverningBoardMemberDto,
  UpdateGoverningBoardMemberDto,
} from './dto/governing-board.dto';
import {
  CreateSchoolHistoryDto,
  UpdateSchoolHistoryDto,
} from './dto/history.dto';
import {
  CreateHistoryMilestoneDto,
  UpdateHistoryMilestoneDto,
} from './dto/history-milestone.dto';
import {
  CreateInfrastructureCategoryDto,
  UpdateInfrastructureCategoryDto,
} from './dto/infrastructure-category.dto';
import { Slider } from './entities/slider.entity';
import { AboutSection } from './entities/about.entity';
import { ImportantLink } from './entities/important-link.entity';
import { OurStory } from './entities/our-story.entity';
import { PrincipalMessage } from './entities/principal-message.entity';
import { GoverningBoardMember } from './entities/governing-board.entity';
import { SchoolHistory } from './entities/history.entity';
import { HistoryMilestone } from './entities/history-milestone.entity';
import { InfrastructureCategory } from './entities/infrastructure-category.entity';

@Injectable()
export class HomeService {
  constructor(
    @InjectRepository(Slider)
    private readonly sliderRepository: Repository<Slider>,
    @InjectRepository(AboutSection)
    private readonly aboutRepository: Repository<AboutSection>,
    @InjectRepository(ImportantLink)
    private readonly importantLinkRepository: Repository<ImportantLink>,
    @InjectRepository(OurStory)
    private readonly ourStoryRepository: Repository<OurStory>,
    @InjectRepository(PrincipalMessage)
    private readonly principalMessageRepository: Repository<PrincipalMessage>,
    @InjectRepository(GoverningBoardMember)
    private readonly governingBoardRepository: Repository<GoverningBoardMember>,
    @InjectRepository(SchoolHistory)
    private readonly schoolHistoryRepository: Repository<SchoolHistory>,
    @InjectRepository(HistoryMilestone)
    private readonly historyMilestoneRepository: Repository<HistoryMilestone>,
    @InjectRepository(InfrastructureCategory)
    private readonly infrastructureCategoryRepository: Repository<InfrastructureCategory>,
  ) {}

  async createSlider(createSliderDto: CreateSliderDto): Promise<Slider> {
    try {
      // Auto-increment order if not provided
      if (
        createSliderDto.order === undefined ||
        createSliderDto.order === null
      ) {
        const maxOrderSlider = await this.sliderRepository.findOne({
          order: { order: 'DESC' },
        });
        createSliderDto.order = maxOrderSlider ? maxOrderSlider.order + 1 : 0;
      } else {
        // If order is provided, check if it exists and find next available
        const existingSlider = await this.sliderRepository.findOne({
          where: { order: createSliderDto.order },
        });

        if (existingSlider) {
          // Find the next available order
          const maxOrderSlider = await this.sliderRepository.findOne({
            order: { order: 'DESC' },
          });
          createSliderDto.order = maxOrderSlider ? maxOrderSlider.order + 1 : 0;
        }
      }

      const slider = this.sliderRepository.create(createSliderDto);
      return await this.sliderRepository.save(slider);
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'code' in error) {
        if (error.code === '23505') {
          throw new ConflictException(
            'Order number already exists. Please use a different order.',
          );
        }
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to create slider',
        message,
      );
    }
  }

  async findAllSliders(): Promise<Slider[]> {
    try {
      return await this.sliderRepository.find({
        where: { isActive: true },
        order: { order: 'ASC', createdAt: 'DESC' },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to fetch sliders',
        message,
      );
    }
  }

  async findAllSlidersAdmin(): Promise<Slider[]> {
    try {
      return await this.sliderRepository.find({
        order: { order: 'ASC', createdAt: 'DESC' },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to fetch sliders',
        message,
      );
    }
  }

  async findOneSlider(id: string): Promise<Slider> {
    try {
      const slider = await this.sliderRepository.findOne({ where: { id } });
      if (!slider) {
        throw new NotFoundException(`Slider #${id} not found`);
      }
      return slider;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException('Failed to fetch slider', message);
    }
  }

  async updateSlider(
    id: string,
    updateSliderDto: UpdateSliderDto,
  ): Promise<Slider> {
    try {
      const slider = await this.findOneSlider(id);

      // If order is being updated, check for conflicts
      if (
        updateSliderDto.order !== undefined &&
        updateSliderDto.order !== slider.order
      ) {
        const existingSlider = await this.sliderRepository.findOne({
          where: { order: updateSliderDto.order },
        });

        if (existingSlider && existingSlider.id !== id) {
          // Swap orders
          existingSlider.order = slider.order;
          await this.sliderRepository.save(existingSlider);
        }
      }

      this.sliderRepository.merge(slider, updateSliderDto);
      return await this.sliderRepository.save(slider);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (typeof error === 'object' && error !== null && 'code' in error) {
        if (error.code === '23505') {
          throw new ConflictException(
            'Order number already exists. Please use a different order.',
          );
        }
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to update slider',
        message,
      );
    }
  }

  async reorderSlider(id: string, newOrder: number): Promise<Slider> {
    try {
      const slider = await this.findOneSlider(id);
      const currentOrder = slider.order;

      // Check if new order is already taken
      const existingSlider = await this.sliderRepository.findOne({
        where: { order: newOrder },
      });

      if (existingSlider && existingSlider.id !== id) {
        // Swap orders
        existingSlider.order = currentOrder;
        await this.sliderRepository.save(existingSlider);
      }

      slider.order = newOrder;
      return await this.sliderRepository.save(slider);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (typeof error === 'object' && error !== null && 'code' in error) {
        if (error.code === '23505') {
          throw new ConflictException(
            'Failed to reorder slider due to conflict',
          );
        }
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to reorder slider',
        message,
      );
    }
  }

  async removeSlider(id: string): Promise<void> {
    try {
      const slider = await this.findOneSlider(id);
      await this.sliderRepository.remove(slider);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to delete slider',
        message,
      );
    }
  }

  // About Section methods
  async createAbout(createAboutDto: CreateAboutDto): Promise<AboutSection> {
    try {
      const about = this.aboutRepository.create(createAboutDto);
      return await this.aboutRepository.save(about);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to create about section',
        message,
      );
    }
  }

  async findAbout(): Promise<AboutSection | null> {
    try {
      return await this.aboutRepository.findOne({
        where: { isActive: true },
        order: { createdAt: 'DESC' },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to fetch about section',
        message,
      );
    }
  }

  async findAllAbout(): Promise<AboutSection[]> {
    try {
      return await this.aboutRepository.find({
        order: { createdAt: 'DESC' },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to fetch about sections',
        message,
      );
    }
  }

  async findOneAbout(id: string): Promise<AboutSection> {
    try {
      const about = await this.aboutRepository.findOne({ where: { id } });
      if (!about) {
        throw new NotFoundException(`About section #${id} not found`);
      }
      return about;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to fetch about section',
        message,
      );
    }
  }

  async updateAbout(
    id: string,
    updateAboutDto: UpdateAboutDto,
  ): Promise<AboutSection> {
    try {
      const about = await this.findOneAbout(id);
      this.aboutRepository.merge(about, updateAboutDto);
      return await this.aboutRepository.save(about);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to update about section',
        message,
      );
    }
  }

  async removeAbout(id: string): Promise<void> {
    try {
      const about = await this.findOneAbout(id);
      await this.aboutRepository.remove(about);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to delete about section',
        message,
      );
    }
  }

  // Important Links methods
  async createImportantLink(
    createImportantLinkDto: CreateImportantLinkDto,
  ): Promise<ImportantLink> {
    try {
      // Auto-increment order if not provided
      if (
        createImportantLinkDto.order === undefined ||
        createImportantLinkDto.order === null
      ) {
        const maxOrderLink = await this.importantLinkRepository.findOne({
          order: { order: 'DESC' },
        });
        createImportantLinkDto.order = maxOrderLink
          ? maxOrderLink.order + 1
          : 0;
      } else {
        // If order is provided, check if it exists and find next available
        const existingLink = await this.importantLinkRepository.findOne({
          where: { order: createImportantLinkDto.order },
        });

        if (existingLink) {
          // Find the next available order
          const maxOrderLink = await this.importantLinkRepository.findOne({
            order: { order: 'DESC' },
          });
          createImportantLinkDto.order = maxOrderLink
            ? maxOrderLink.order + 1
            : 0;
        }
      }

      const link = this.importantLinkRepository.create(createImportantLinkDto);
      return await this.importantLinkRepository.save(link);
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'code' in error) {
        if (error.code === '23505') {
          throw new ConflictException(
            'Order number already exists. Please use a different order.',
          );
        }
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to create important link',
        message,
      );
    }
  }

  async findAllImportantLinks(): Promise<ImportantLink[]> {
    try {
      return await this.importantLinkRepository.find({
        where: { isActive: true },
        order: { order: 'ASC', createdAt: 'DESC' },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to fetch important links',
        message,
      );
    }
  }

  async findAllImportantLinksAdmin(): Promise<ImportantLink[]> {
    try {
      return await this.importantLinkRepository.find({
        order: { order: 'ASC', createdAt: 'DESC' },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to fetch important links',
        message,
      );
    }
  }

  async findOneImportantLink(id: string): Promise<ImportantLink> {
    try {
      const link = await this.importantLinkRepository.findOne({
        where: { id },
      });
      if (!link) {
        throw new NotFoundException(`Important link #${id} not found`);
      }
      return link;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to fetch important link',
        message,
      );
    }
  }

  async updateImportantLink(
    id: string,
    updateImportantLinkDto: UpdateImportantLinkDto,
  ): Promise<ImportantLink> {
    try {
      const link = await this.findOneImportantLink(id);

      // If order is being updated, check for conflicts
      if (
        updateImportantLinkDto.order !== undefined &&
        updateImportantLinkDto.order !== link.order
      ) {
        const existingLink = await this.importantLinkRepository.findOne({
          where: { order: updateImportantLinkDto.order },
        });

        if (existingLink && existingLink.id !== id) {
          // Swap orders
          existingLink.order = link.order;
          await this.importantLinkRepository.save(existingLink);
        }
      }

      this.importantLinkRepository.merge(link, updateImportantLinkDto);
      return await this.importantLinkRepository.save(link);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (typeof error === 'object' && error !== null && 'code' in error) {
        if (error.code === '23505') {
          throw new ConflictException(
            'Order number already exists. Please use a different order.',
          );
        }
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to update important link',
        message,
      );
    }
  }

  async reorderImportantLink(
    id: string,
    newOrder: number,
  ): Promise<ImportantLink> {
    try {
      const link = await this.findOneImportantLink(id);
      const currentOrder = link.order;

      // Check if new order is already taken
      const existingLink = await this.importantLinkRepository.findOne({
        where: { order: newOrder },
      });

      if (existingLink && existingLink.id !== id) {
        // Swap orders
        existingLink.order = currentOrder;
        await this.importantLinkRepository.save(existingLink);
      }

      link.order = newOrder;
      return await this.importantLinkRepository.save(link);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (typeof error === 'object' && error !== null && 'code' in error) {
        if (error.code === '23505') {
          throw new ConflictException(
            'Failed to reorder important link due to conflict',
          );
        }
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to reorder important link',
        message,
      );
    }
  }

  async removeImportantLink(id: string): Promise<void> {
    try {
      const link = await this.findOneImportantLink(id);
      await this.importantLinkRepository.remove(link);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to delete important link',
        message,
      );
    }
  }

  // Our Story methods
  async createOurStory(
    createOurStoryDto: CreateOurStoryDto,
  ): Promise<OurStory> {
    try {
      const story = this.ourStoryRepository.create(createOurStoryDto);
      return await this.ourStoryRepository.save(story);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to create our story',
        message,
      );
    }
  }

  async findOurStory(): Promise<OurStory | null> {
    try {
      return await this.ourStoryRepository.findOne({
        where: { isActive: true },
        order: { createdAt: 'DESC' },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to fetch our story',
        message,
      );
    }
  }

  async findAllOurStory(): Promise<OurStory[]> {
    try {
      return await this.ourStoryRepository.find({
        order: { createdAt: 'DESC' },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to fetch our story sections',
        message,
      );
    }
  }

  async findOneOurStory(id: string): Promise<OurStory> {
    try {
      const story = await this.ourStoryRepository.findOne({ where: { id } });
      if (!story) {
        throw new NotFoundException(`Our story section #${id} not found`);
      }
      return story;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to fetch our story',
        message,
      );
    }
  }

  async updateOurStory(
    id: string,
    updateOurStoryDto: UpdateOurStoryDto,
  ): Promise<OurStory> {
    try {
      const story = await this.findOneOurStory(id);
      this.ourStoryRepository.merge(story, updateOurStoryDto);
      return await this.ourStoryRepository.save(story);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to update our story',
        message,
      );
    }
  }

  async removeOurStory(id: string): Promise<void> {
    try {
      const story = await this.findOneOurStory(id);
      await this.ourStoryRepository.remove(story);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to delete our story',
        message,
      );
    }
  }

  // Principal Message methods
  async createPrincipalMessage(
    createPrincipalMessageDto: CreatePrincipalMessageDto,
  ): Promise<PrincipalMessage> {
    try {
      const principalMessage = this.principalMessageRepository.create(
        createPrincipalMessageDto,
      );
      return await this.principalMessageRepository.save(principalMessage);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to create principal message',
        message,
      );
    }
  }

  async findPrincipalMessage(): Promise<PrincipalMessage | null> {
    try {
      return await this.principalMessageRepository.findOne({
        where: { isActive: true },
        order: { createdAt: 'DESC' },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to fetch principal message',
        message,
      );
    }
  }

  async findAllPrincipalMessage(): Promise<PrincipalMessage[]> {
    try {
      return await this.principalMessageRepository.find({
        order: { createdAt: 'DESC' },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to fetch principal messages',
        message,
      );
    }
  }

  async findOnePrincipalMessage(id: string): Promise<PrincipalMessage> {
    try {
      const principalMessage = await this.principalMessageRepository.findOne({
        where: { id },
      });
      if (!principalMessage) {
        throw new NotFoundException(`Principal message #${id} not found`);
      }
      return principalMessage;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to fetch principal message',
        message,
      );
    }
  }

  async updatePrincipalMessage(
    id: string,
    updatePrincipalMessageDto: UpdatePrincipalMessageDto,
  ): Promise<PrincipalMessage> {
    try {
      const principalMessage = await this.findOnePrincipalMessage(id);
      this.principalMessageRepository.merge(
        principalMessage,
        updatePrincipalMessageDto,
      );
      return await this.principalMessageRepository.save(principalMessage);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to update principal message',
        message,
      );
    }
  }

  async removePrincipalMessage(id: string): Promise<void> {
    try {
      const principalMessage = await this.findOnePrincipalMessage(id);
      await this.principalMessageRepository.remove(principalMessage);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to delete principal message',
        message,
      );
    }
  }

  // Governing Board Members methods
  async createGoverningBoardMember(
    createGoverningBoardMemberDto: CreateGoverningBoardMemberDto,
  ): Promise<GoverningBoardMember> {
    try {
      // Auto-increment order if not provided
      if (
        createGoverningBoardMemberDto.order === undefined ||
        createGoverningBoardMemberDto.order === null
      ) {
        const maxOrderMember = await this.governingBoardRepository.findOne({
          order: { order: 'DESC' },
        });
        createGoverningBoardMemberDto.order = maxOrderMember
          ? maxOrderMember.order + 1
          : 0;
      } else {
        // If order is provided, check if it exists and find next available
        const existingMember = await this.governingBoardRepository.findOne({
          where: { order: createGoverningBoardMemberDto.order },
        });

        if (existingMember) {
          // Find the next available order
          const maxOrderMember = await this.governingBoardRepository.findOne({
            order: { order: 'DESC' },
          });
          createGoverningBoardMemberDto.order = maxOrderMember
            ? maxOrderMember.order + 1
            : 0;
        }
      }

      const member = this.governingBoardRepository.create(
        createGoverningBoardMemberDto,
      );
      return await this.governingBoardRepository.save(member);
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'code' in error) {
        if (error.code === '23505') {
          throw new ConflictException(
            'Order number already exists. Please use a different order.',
          );
        }
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to create governing board member',
        message,
      );
    }
  }

  async findAllGoverningBoardMembers(): Promise<GoverningBoardMember[]> {
    try {
      return await this.governingBoardRepository.find({
        where: { isActive: true },
        order: { order: 'ASC', createdAt: 'DESC' },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to fetch governing board members',
        message,
      );
    }
  }

  async findAllGoverningBoardMembersAdmin(): Promise<GoverningBoardMember[]> {
    try {
      return await this.governingBoardRepository.find({
        order: { order: 'ASC', createdAt: 'DESC' },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to fetch governing board members',
        message,
      );
    }
  }

  async findOneGoverningBoardMember(id: string): Promise<GoverningBoardMember> {
    try {
      const member = await this.governingBoardRepository.findOne({
        where: { id },
      });
      if (!member) {
        throw new NotFoundException(`Governing board member #${id} not found`);
      }
      return member;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to fetch governing board member',
        message,
      );
    }
  }

  async updateGoverningBoardMember(
    id: string,
    updateGoverningBoardMemberDto: UpdateGoverningBoardMemberDto,
  ): Promise<GoverningBoardMember> {
    try {
      const member = await this.findOneGoverningBoardMember(id);

      // If order is being updated, check for conflicts
      if (
        updateGoverningBoardMemberDto.order !== undefined &&
        updateGoverningBoardMemberDto.order !== member.order
      ) {
        const existingMember = await this.governingBoardRepository.findOne({
          where: { order: updateGoverningBoardMemberDto.order },
        });

        if (existingMember && existingMember.id !== id) {
          // Swap orders
          existingMember.order = member.order;
          await this.governingBoardRepository.save(existingMember);
        }
      }

      this.governingBoardRepository.merge(
        member,
        updateGoverningBoardMemberDto,
      );
      return await this.governingBoardRepository.save(member);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (typeof error === 'object' && error !== null && 'code' in error) {
        if (error.code === '23505') {
          throw new ConflictException(
            'Order number already exists. Please use a different order.',
          );
        }
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to update governing board member',
        message,
      );
    }
  }

  async reorderGoverningBoardMember(
    id: string,
    newOrder: number,
  ): Promise<GoverningBoardMember> {
    try {
      const member = await this.findOneGoverningBoardMember(id);
      const currentOrder = member.order;

      // Check if new order is already taken
      const existingMember = await this.governingBoardRepository.findOne({
        where: { order: newOrder },
      });

      if (existingMember && existingMember.id !== id) {
        // Swap orders
        existingMember.order = currentOrder;
        await this.governingBoardRepository.save(existingMember);
      }

      member.order = newOrder;
      return await this.governingBoardRepository.save(member);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (typeof error === 'object' && error !== null && 'code' in error) {
        if (error.code === '23505') {
          throw new ConflictException(
            'Failed to reorder governing board member due to conflict',
          );
        }
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to reorder governing board member',
        message,
      );
    }
  }

  async removeGoverningBoardMember(id: string): Promise<void> {
    try {
      const member = await this.findOneGoverningBoardMember(id);
      await this.governingBoardRepository.remove(member);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to delete governing board member',
        message,
      );
    }
  }

  // School History methods
  async createSchoolHistory(
    createSchoolHistoryDto: CreateSchoolHistoryDto,
  ): Promise<SchoolHistory> {
    try {
      const history = this.schoolHistoryRepository.create(
        createSchoolHistoryDto,
      );
      return await this.schoolHistoryRepository.save(history);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to create school history',
        message,
      );
    }
  }

  async findSchoolHistory(): Promise<SchoolHistory | null> {
    try {
      return await this.schoolHistoryRepository.findOne({
        where: { isActive: true },
        order: { createdAt: 'DESC' },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to fetch school history',
        message,
      );
    }
  }

  async findAllSchoolHistory(): Promise<SchoolHistory[]> {
    try {
      return await this.schoolHistoryRepository.find({
        order: { createdAt: 'DESC' },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to fetch school history',
        message,
      );
    }
  }

  async findOneSchoolHistory(id: string): Promise<SchoolHistory> {
    try {
      const history = await this.schoolHistoryRepository.findOne({
        where: { id },
      });
      if (!history) {
        throw new NotFoundException(`School history #${id} not found`);
      }
      return history;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to fetch school history',
        message,
      );
    }
  }

  async updateSchoolHistory(
    id: string,
    updateSchoolHistoryDto: UpdateSchoolHistoryDto,
  ): Promise<SchoolHistory> {
    try {
      const history = await this.findOneSchoolHistory(id);
      this.schoolHistoryRepository.merge(history, updateSchoolHistoryDto);
      return await this.schoolHistoryRepository.save(history);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to update school history',
        message,
      );
    }
  }

  async removeSchoolHistory(id: string): Promise<void> {
    try {
      const history = await this.findOneSchoolHistory(id);
      await this.schoolHistoryRepository.remove(history);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to delete school history',
        message,
      );
    }
  }

  // History Milestones methods
  async createHistoryMilestone(
    createHistoryMilestoneDto: CreateHistoryMilestoneDto,
  ): Promise<HistoryMilestone> {
    try {
      // Auto-increment order if not provided
      if (
        createHistoryMilestoneDto.order === undefined ||
        createHistoryMilestoneDto.order === null
      ) {
        const maxOrderMilestone = await this.historyMilestoneRepository.findOne(
          {
            order: { order: 'DESC' },
          },
        );
        createHistoryMilestoneDto.order = maxOrderMilestone
          ? maxOrderMilestone.order + 1
          : 0;
      } else {
        // If order is provided, check if it exists and find next available
        const existingMilestone = await this.historyMilestoneRepository.findOne(
          {
            where: { order: createHistoryMilestoneDto.order },
          },
        );

        if (existingMilestone) {
          // Find the next available order
          const maxOrderMilestone =
            await this.historyMilestoneRepository.findOne({
              order: { order: 'DESC' },
            });
          createHistoryMilestoneDto.order = maxOrderMilestone
            ? maxOrderMilestone.order + 1
            : 0;
        }
      }

      const milestone = this.historyMilestoneRepository.create(
        createHistoryMilestoneDto,
      );
      return await this.historyMilestoneRepository.save(milestone);
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'code' in error) {
        if (error.code === '23505') {
          throw new ConflictException(
            'Order number already exists. Please use a different order.',
          );
        }
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to create history milestone',
        message,
      );
    }
  }

  async findAllHistoryMilestones(): Promise<HistoryMilestone[]> {
    try {
      return await this.historyMilestoneRepository.find({
        where: { isActive: true },
        order: { order: 'ASC', createdAt: 'DESC' },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to fetch history milestones',
        message,
      );
    }
  }

  async findAllHistoryMilestonesAdmin(): Promise<HistoryMilestone[]> {
    try {
      return await this.historyMilestoneRepository.find({
        order: { order: 'ASC', createdAt: 'DESC' },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to fetch history milestones',
        message,
      );
    }
  }

  async findOneHistoryMilestone(id: string): Promise<HistoryMilestone> {
    try {
      const milestone = await this.historyMilestoneRepository.findOne({
        where: { id },
      });
      if (!milestone) {
        throw new NotFoundException(`History milestone #${id} not found`);
      }
      return milestone;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to fetch history milestone',
        message,
      );
    }
  }

  async updateHistoryMilestone(
    id: string,
    updateHistoryMilestoneDto: UpdateHistoryMilestoneDto,
  ): Promise<HistoryMilestone> {
    try {
      const milestone = await this.findOneHistoryMilestone(id);

      // If order is being updated, check for conflicts
      if (
        updateHistoryMilestoneDto.order !== undefined &&
        updateHistoryMilestoneDto.order !== milestone.order
      ) {
        const existingMilestone = await this.historyMilestoneRepository.findOne(
          {
            where: { order: updateHistoryMilestoneDto.order },
          },
        );

        if (existingMilestone && existingMilestone.id !== id) {
          // Swap orders
          existingMilestone.order = milestone.order;
          await this.historyMilestoneRepository.save(existingMilestone);
        }
      }

      this.historyMilestoneRepository.merge(
        milestone,
        updateHistoryMilestoneDto,
      );
      return await this.historyMilestoneRepository.save(milestone);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (typeof error === 'object' && error !== null && 'code' in error) {
        if (error.code === '23505') {
          throw new ConflictException(
            'Order number already exists. Please use a different order.',
          );
        }
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to update history milestone',
        message,
      );
    }
  }

  async reorderHistoryMilestone(
    id: string,
    newOrder: number,
  ): Promise<HistoryMilestone> {
    try {
      const milestone = await this.findOneHistoryMilestone(id);
      const currentOrder = milestone.order;

      // Check if new order is already taken
      const existingMilestone = await this.historyMilestoneRepository.findOne({
        where: { order: newOrder },
      });

      if (existingMilestone && existingMilestone.id !== id) {
        // Swap orders
        existingMilestone.order = currentOrder;
        await this.historyMilestoneRepository.save(existingMilestone);
      }

      milestone.order = newOrder;
      return await this.historyMilestoneRepository.save(milestone);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (typeof error === 'object' && error !== null && 'code' in error) {
        if (error.code === '23505') {
          throw new ConflictException(
            'Failed to reorder history milestone due to conflict',
          );
        }
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to reorder history milestone',
        message,
      );
    }
  }

  async removeHistoryMilestone(id: string): Promise<void> {
    try {
      const milestone = await this.findOneHistoryMilestone(id);
      await this.historyMilestoneRepository.remove(milestone);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to delete history milestone',
        message,
      );
    }
  }

  // Infrastructure Category methods
  async createInfrastructureCategory(
    createDto: CreateInfrastructureCategoryDto,
  ): Promise<InfrastructureCategory> {
    try {
      // Auto-increment order if not provided
      if (createDto.order === undefined || createDto.order === null) {
        const maxOrderCategory =
          await this.infrastructureCategoryRepository.findOne({
            order: { order: 'DESC' },
          });
        createDto.order = maxOrderCategory ? maxOrderCategory.order + 1 : 1;
      } else {
        // Check if order already exists
        const existingCategory =
          await this.infrastructureCategoryRepository.findOne({
            where: { order: createDto.order },
          });
        if (existingCategory) {
          // Swap orders
          const tempOrder = existingCategory.order;
          existingCategory.order = -1;
          await this.infrastructureCategoryRepository.save(existingCategory);
          existingCategory.order = tempOrder;
        }
      }

      const category = this.infrastructureCategoryRepository.create(createDto);
      return await this.infrastructureCategoryRepository.save(category);
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === '23505'
      ) {
        throw new ConflictException(
          'A category with this order already exists',
        );
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to create infrastructure category',
        message,
      );
    }
  }

  async findAllInfrastructureCategories(): Promise<InfrastructureCategory[]> {
    try {
      return await this.infrastructureCategoryRepository.find({
        where: { isActive: true },
        order: { order: 'ASC' },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to fetch infrastructure categories',
        message,
      );
    }
  }

  async findAllInfrastructureCategoriesAdmin(): Promise<
    InfrastructureCategory[]
  > {
    try {
      return await this.infrastructureCategoryRepository.find({
        order: { order: 'ASC' },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to fetch all infrastructure categories',
        message,
      );
    }
  }

  async findOneInfrastructureCategory(
    id: string,
  ): Promise<InfrastructureCategory> {
    try {
      const category = await this.infrastructureCategoryRepository.findOne({
        where: { id },
      });
      if (!category) {
        throw new NotFoundException('Infrastructure category not found');
      }
      return category;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to fetch infrastructure category',
        message,
      );
    }
  }

  async updateInfrastructureCategory(
    id: string,
    updateDto: UpdateInfrastructureCategoryDto,
  ): Promise<InfrastructureCategory> {
    try {
      const category = await this.findOneInfrastructureCategory(id);

      // Check if new order conflicts with existing
      if (updateDto.order !== undefined && updateDto.order !== category.order) {
        const existingCategory =
          await this.infrastructureCategoryRepository.findOne({
            where: { order: updateDto.order },
          });
        if (existingCategory && existingCategory.id !== id) {
          // Swap orders
          existingCategory.order = category.order;
          await this.infrastructureCategoryRepository.save(existingCategory);
        }
      }

      Object.assign(category, updateDto);
      return await this.infrastructureCategoryRepository.save(category);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === '23505'
      ) {
        throw new ConflictException(
          'A category with this order already exists',
        );
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to update infrastructure category',
        message,
      );
    }
  }

  async reorderInfrastructureCategory(
    id: string,
    newOrder: number,
  ): Promise<InfrastructureCategory> {
    try {
      const category = await this.findOneInfrastructureCategory(id);
      const oldOrder = category.order;

      if (oldOrder === newOrder) {
        return category;
      }

      // Find category at target position
      const targetCategory =
        await this.infrastructureCategoryRepository.findOne({
          where: { order: newOrder },
        });

      if (targetCategory) {
        // Swap orders
        targetCategory.order = oldOrder;
        await this.infrastructureCategoryRepository.save(targetCategory);
      }

      category.order = newOrder;
      return await this.infrastructureCategoryRepository.save(category);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to reorder infrastructure category',
        message,
      );
    }
  }

  async removeInfrastructureCategory(id: string): Promise<void> {
    try {
      const category = await this.findOneInfrastructureCategory(id);
      await this.infrastructureCategoryRepository.remove(category);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to delete infrastructure category',
        message,
      );
    }
  }
}
