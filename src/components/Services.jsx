import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { 
  FiLayers, 
  FiCpu, 
  FiActivity, 
  FiDatabase,
  FiArrowRight 
} from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  const personalizedServices = [
    {
      icon: <FiLayers size={28} />,
      title: "Full-Stack SaaS Development",
      p: "Crafting end-to-end scalable platforms using the MERN stack (MongoDB, Express, React, Node.js) with clean, maintainable architecture.",
      tags: ["React", "Node.js", "MongoDB", "Express"]
    },
    {
      icon: <FiCpu size={28} />,
      title: "AI Integration & Python",
      p: "Developing intelligent machine learning features, automation scripts, and robust data pipelines using advanced Python workflows.",
      tags: ["Python", "Machine Learning", "Automation"]
    },
    {
      icon: <FiActivity size={28} />,
      title: "High-Performance Systems",
      p: "Leveraging my Mathematics & Computing background and C++ expertise to design highly efficient algorithms and system-level components.",
      tags: ["C++", "Algorithms", "Optimization"]
    },
    {
      icon: <FiDatabase size={28} />,
      title: "API & Backend Architecture",
      p: "Architecting secure, scalable RESTful APIs and real-time backend systems capable of handling heavy production workloads.",
      tags: ["REST APIs", "FastAPI", "WebSockets"]
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });

      // Header Animation
      tl.fromTo(headerRef.current.children, 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.4, ease: "none", stagger: 0.1 }
      );

      // Grid Animation
      tl.fromTo(".service-card", 
        { opacity: 0, y: 40, scale: 0.95 }, 
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.2)", stagger: 0.15 },
        "-=0.2"
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="services" 
      ref={containerRef}
      className="relative py-24 px-6 md:px-12 lg:px-24 bg-white dark:bg-[#000] text-black dark:text-white overflow-hidden scroll-mt-24 transition-colors duration-500"
    >
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none transform-gpu" style={{ backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
      
      {/* Glowing Ambient Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full"></div>
         <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Header */}
      <div ref={headerRef} className="max-w-4xl mx-auto text-center mb-20 relative z-10">
        <div className="inline-block px-4 py-1 border border-blue-500/30 bg-blue-500/5 rounded-full mb-6">
          <p className="text-blue-500 font-mono text-[10px] uppercase tracking-[0.5em] font-bold">CORE CAPABILITIES</p>
        </div>
        <h2 className="text-fluid-h2 font-black tracking-tighter uppercase mb-6">
          My Expertise<span className="text-blue-500">.</span>
        </h2>
        <div className="w-24 h-[1px] bg-blue-500/40 mx-auto mb-8"></div>
        <p className="text-gray-600 dark:text-gray-400 font-light text-fluid-p leading-relaxed">
          Combining deep mathematical foundations with modern software engineering to build scalable, high-performance applications.
        </p>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Full-Width Main Services Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {personalizedServices.map((service, index) => (
            <div
              key={service.title}
              className="service-card group relative p-8 md:p-12 bg-white/40 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border border-black/5 dark:border-white/5 hover:border-blue-500/40 transition-all duration-500 rounded-2xl flex flex-col items-start overflow-hidden shadow-lg dark:shadow-none"
            >
              {/* Hover Ambient Glow inside card */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              
              {/* Corner Cyberpunk Accents */}
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-blue-500/0 group-hover:border-blue-500/30 transition-all duration-500 rounded-tr-2xl transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-blue-500/0 group-hover:border-blue-500/30 transition-all duration-500 rounded-bl-2xl transform -translate-x-4 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0"></div>

              <div className="relative z-10">
                <div className="mb-8 p-4 inline-block bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-500 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500 shadow-[0_0_20px_rgba(59,130,246,0.1)] group-hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-black text-black dark:text-white mb-4 tracking-tight uppercase">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 font-light text-base leading-relaxed mb-8 h-24">
                  {service.p}
                </p>
                
                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {service.tags.map((tag) => (
                    <span key={tag} className="text-[9px] uppercase tracking-widest font-mono px-3 py-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-gray-500 dark:text-gray-400 rounded-full group-hover:border-blue-500/30 group-hover:text-blue-500 transition-colors duration-300">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.3em] text-gray-400 group-hover:text-blue-500 transition-colors mt-auto">
                  <span>Explore Sector</span> 
                  <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid Lines Overlay */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-black/[0.03] dark:bg-white/[0.03] z-10"></div>
    </section>
  );
}
