import Navigation from './components/Navigation.jsx'
import Cursor from './components/Cursor.jsx'
import HeroSection from './sections/HeroSection.jsx'
import AboutSection from './sections/AboutSection.jsx'
import WorksSection from './sections/WorksSection.jsx'
import StrengthsSection from './sections/StrengthsSection.jsx'
import FooterSection from './sections/FooterSection.jsx'

export default function App() {
  return (
    <>
      <Cursor />
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <WorksSection />
        <StrengthsSection />
        <FooterSection />
      </main>
    </>
  )
}
