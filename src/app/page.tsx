import HeroSlider from '@/components/home/HeroSlider';
import NewsSection from '@/components/home/NewsSection';
import MatchesSection from '@/components/home/MatchesSection';
import MatchesAndStandings from '@/components/home/MatchesAndStandings';
import QuickLinks from '@/components/home/QuickLinks';
import CoachCoursesSection from '@/components/home/CoachCoursesSection';
import VideoSection from '@/components/home/VideoSection';
import Achievements from '@/components/home/Achievements';

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <NewsSection />
      <MatchesSection />
      <MatchesAndStandings />
      <QuickLinks />
      <CoachCoursesSection />
      <VideoSection />
      <Achievements />
    </>
  );
}
