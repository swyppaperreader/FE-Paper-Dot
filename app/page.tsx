import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import TranslationFeature from './components/TranslationFeature';
import FeatureTabs from './components/FeatureTabs';
import CheckSection from './components/CheckSection';
import HowToUse from './components/HowToUse';
import ReadingTools from './components/ReadingTools';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <TranslationFeature />
      <FeatureTabs />
      <CheckSection />
      <HowToUse />
      <ReadingTools />
      <Footer />
    </main>
  );
}