import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { Slider } from './entities/slider.entity';
import { AboutSection } from './entities/about.entity';
import { ImportantLink } from './entities/important-link.entity';
import { OurStory } from './entities/our-story.entity';
import { PrincipalMessage } from './entities/principal-message.entity';
import { GoverningBoardMember } from './entities/governing-board.entity';
import { SchoolHistory } from './entities/history.entity';
import { HistoryMilestone } from './entities/history-milestone.entity';
import { InfrastructureCategory } from './entities/infrastructure-category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Slider,
      AboutSection,
      ImportantLink,
      OurStory,
      PrincipalMessage,
      GoverningBoardMember,
      SchoolHistory,
      HistoryMilestone,
      InfrastructureCategory,
    ]),
  ],
  controllers: [HomeController],
  providers: [HomeService],
  exports: [HomeService],
})
export class HomeModule {}
