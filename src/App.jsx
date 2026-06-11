import React, { Suspense, lazy } from 'react';
import Hero from './components/Hero';
import Navbar from './components/Navbar';

// Lazy load non-critical sections for performance
const About = lazy(() => import('./components/About'));
const Services = lazy(() => import('./components/Services'));
const Portfolio = lazy(() => import('./components/Portfolio'));
const FrameScrollAnimation = lazy(() => import('./components/FrameScrollAnimation'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));
const WorkExperience = lazy(() => import('./components/WorkExperience'));
const Certifications = lazy(() => import('./components/Certifications'));
const LinkedInPosts = lazy(() => import('./components/LinkedInPosts'));

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      
      <Suspense fallback={<div className="h-screen bg-gray-50 dark:bg-black" />}>
        {/* Welcome to Portfolio Section */}
        <FrameScrollAnimation frameCount={240} />
        <About />
        <WorkExperience />
        <Certifications />
        <Portfolio />
        <Services />
        <LinkedInPosts />
        <Contact />
        <Footer />
      </Suspense>
    </>
  );
}

export default App;
