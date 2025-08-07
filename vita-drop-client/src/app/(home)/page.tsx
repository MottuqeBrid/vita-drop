import AboutUs from "./_components/AboutUs";
import HeroSection from "./_components/HeroSection";
import NewsAndUpdates from "./_components/NewsAndUpdate";
import NewsLater from "./_components/NewsLater";
import Statistics from "./_components/Statistics";

export default function Page() {
  return (
    <div className="">
      <HeroSection />
      <Statistics />
      <AboutUs />
      <NewsLater />
      {/* <NewsAndUpdates /> */}
    </div>
  );
}
