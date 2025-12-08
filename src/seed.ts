import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NoticesService } from './notices/notices.service';
import { EventsService } from './events/events.service';
import { StaffService } from './staff/staff.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const noticesService = app.get(NoticesService);
  const eventsService = app.get(EventsService);
  const staffService = app.get(StaffService);

  console.log('Seeding data...');

  // Seed Notices
  const notices = [
    {
      title: 'অর্ধ-বার্ষিক পরীক্ষার রুটিন ২০২৫',
      publishedAt: new Date('2025-06-10'),
      categories: ['একাডেমিক'],
      bodyHtml:
        'আগামী ১লা জুলাই থেকে অর্ধ-বার্ষিক পরীক্ষা শুরু হবে। বিস্তারিত রুটিন নিচে সংযুক্ত করা হলো।',
      attachments: [],
    },
    {
      title: 'গ্রীষ্মকালীন ছুটির ঘোষণা',
      publishedAt: new Date('2025-05-20'),
      categories: ['প্রশাসনিক'],
      bodyHtml:
        'আগামী ২৫শে মে থেকে ৩রা জুন পর্যন্ত গ্রীষ্মকালীন ছুটিতে বিদ্যালয় বন্ধ থাকবে।',
      attachments: [],
    },
    {
      title: 'আন্তঃস্কুল ফুটবল টুর্নামেন্ট',
      publishedAt: new Date('2025-04-15'),
      categories: ['ইভেন্ট'],
      bodyHtml:
        'বার্ষিক ক্রীড়া প্রতিযোগিতার অংশ হিসেবে আন্তঃস্কুল ফুটবল টুর্নামেন্ট অনুষ্ঠিত হবে।',
      attachments: [],
    },
    {
      title: 'অভিভাবক সমাবেশ (দশম শ্রেণী)',
      publishedAt: new Date('2025-03-01'),
      categories: ['একাডেমিক'],
      bodyHtml:
        'দশম শ্রেণীর শিক্ষার্থীদের অভিভাবকদের নিয়ে আগামী শনিবার সকাল ১০টায় এক সমাবেশ অনুষ্ঠিত হবে।',
      attachments: [],
    },
    {
      title: '২০২৬ শিক্ষাবর্ষের ভর্তি কার্যক্রম',
      publishedAt: new Date('2025-11-01'),
      categories: ['প্রশাসনিক'],
      bodyHtml:
        '২০২৬ শিক্ষাবর্ষের ভর্তি ফরম বিতরণ শুরু হয়েছে। অফিস চলাকালীন সময়ে ফরম সংগ্রহ করা যাবে।',
      attachments: [],
    },
  ];

  for (const notice of notices) {
    // Check if duplicate? For simplicity just create
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await noticesService.create(notice as any);
  }
  console.log('Notices seeded.');

  // Seed Events
  const events = [
    {
      title: 'বার্ষিক ক্রীড়া প্রতিযোগিতা',
      date: '2025-02-15',
      startTime: '09:00',
      location: 'স্কুল মাঠ',
      bodyHtml:
        'উৎসাহ ও উদ্দীপনার মধ্য দিয়ে বার্ষিক ক্রীড়া প্রতিযোগিতা অনুষ্ঠিত হবে। সকল শিক্ষার্থীকে উপস্থিত থাকার জন্য বলা হলো।',
      bannerUrl:
        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800&auto=format&fit=crop',
    },
    {
      title: 'বিজ্ঞান মেলা ২০২৫',
      date: '2025-08-20',
      startTime: '10:00',
      location: 'অডিটোরিয়াম',
      bodyHtml:
        'শিক্ষার্থীদের উদ্ভাবনী প্রকল্প প্রদর্শনের জন্য বিজ্ঞান মেলার আয়োজন করা হয়েছে।',
      bannerUrl:
        'https://images.unsplash.com/photo-1564325724739-bae0bd08762c?q=80&w=800&auto=format&fit=crop',
    },
    {
      title: 'মহান বিজয় দিবস উদযাপন',
      date: '2025-12-16',
      startTime: '08:00',
      location: 'মূল ভবন',
      bodyHtml:
        'যথাযোগ্য মর্যাদায় মহান বিজয় দিবস উদযাপন ও সাংস্কৃতিক অনুষ্ঠান।',
      bannerUrl:
        'https://images.unsplash.com/photo-1532187643603-ba119cdd9fbf?q=80&w=800&auto=format&fit=crop',
    },
  ];
  for (const event of events) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await eventsService.create(event as any);
  }
  console.log('Events seeded.');

  // Seed Staff
  const staff = [
    {
      name: 'ড. আনিসুর রহমান',
      designation: 'অধ্যক্ষ',
      // department: "প্রশাসন", // Model might not have department
      photoUrl:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop',
      shortBio: 'PhD in Education',
      email: 'principal@school.edu.bd',
      phone: '01700000000',
    },
    {
      name: 'ফাতেমা বেগম',
      designation: 'সিনিয়র শিক্ষক',
      photoUrl:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
      shortBio: 'MSc in Mathematics',
      email: 'fatema@school.edu.bd',
      phone: '01700000001',
    },
    {
      name: 'কামাল হোসেন',
      designation: 'সহকারী শিক্ষক',
      photoUrl:
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop',
      shortBio: 'BSc in Physics',
      email: 'kamal@school.edu.bd',
      phone: '01700000002',
    },
  ];
  for (const s of staff) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await staffService.create(s as any);
  }
  console.log('Staff seeded.');

  await app.close();
  console.log('Seeding complete.');
}
bootstrap().catch((error) => {
  console.error('Error seeding database:', error);
  process.exit(1);
});
