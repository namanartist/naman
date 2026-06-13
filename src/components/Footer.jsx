import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { FiGithub, FiTwitter, FiLinkedin, FiInstagram, FiCpu, FiShield, FiActivity, FiSend } from 'react-icons/fi';

const Footer = () => {
  const [systemTime, setSystemTime] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // Mouse tracking for radial glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleMouseMove = (e) => {
      if (isMobile) return;
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    const timer = setInterval(() => {
      setSystemTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(timer);
    };
  }, [isMobile, mouseX, mouseY]);

  const socialLinks = [
    { icon: <FiGithub />, label: 'GITHUB', url: 'https://github.com/namanartist' },
    { icon: <FiTwitter />, label: 'TWITTER', url: '#' },
    { icon: <FiLinkedin />, label: 'LINKEDIN', url: 'https://linkedin.com/in/naman-lahariya' },
    { icon: <FiInstagram />, label: 'INSTAGRAM', url: '#' },
    { icon: <FiSend />, label: 'TELEGRAM', url: 'https://t.me/na_man' },
  ];

  return (
    <footer className="relative w-full overflow-hidden bg-white dark:bg-[#000] font-sans transition-colors duration-500 py-12 px-6">
      
      {/* Background Orbs */}
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none"></div>

      {/* Grid Background */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)', backgroundSize: '60px 60px' }}>
      </div>

      {/* Main Glassmorphic Wrapper */}
      <div className="max-w-7xl mx-auto relative z-10 bg-white/40 dark:bg-[#050505]/60 backdrop-blur-3xl border border-black/5 dark:border-white/5 rounded-3xl shadow-2xl p-8 md:p-16 overflow-hidden">
        
        {/* Subtle interior glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent pointer-events-none"></div>
        
        {/* Corner Accents */}
        <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-blue-500/10 rounded-tr-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-blue-500/10 rounded-bl-3xl"></div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10">
          
          {/* Section 1: Brand/Core (Col span 5) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left space-y-6"
          >
            <div className="flex items-center space-x-4 group cursor-pointer">
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all duration-500">
                <FiCpu className="text-blue-500 text-2xl group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-fluid-h3 font-black text-black dark:text-white tracking-tighter uppercase italic leading-none">
                NAMAN<br/><span className="text-blue-500 text-lg md:text-2xl">LAHARIYA</span>
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-sm">
              Designing the future of digital architecture with precision engineering and creative intelligence.
            </p>
            <div className="flex items-center space-x-3 bg-black/5 dark:bg-white/5 px-4 py-2 rounded-full border border-black/10 dark:border-white/10">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulseShadow shadow-[0_0_10px_#22c55e]"></span>
              <span className="text-[10px] text-gray-600 dark:text-gray-400 font-mono tracking-widest uppercase font-bold">System Online</span>
            </div>
          </motion.div>

          {/* Section 2: Quick Links (Col span 3) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-3 flex flex-col items-center md:items-start text-center md:text-left space-y-6"
          >
            <h4 className="text-[10px] font-mono font-black text-blue-600 dark:text-blue-500 tracking-[0.4em] uppercase border-b border-blue-500/20 pb-2 w-full md:w-auto">Directory</h4>
            <ul className="space-y-4 w-full">
              {['Home', 'About', 'Portfolio', 'Experience', 'Services'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="group flex items-center justify-center md:justify-start text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors tracking-widest uppercase">
                    <span className="w-0 group-hover:w-4 h-[1px] bg-blue-600 dark:bg-blue-400 mr-0 group-hover:mr-3 transition-all duration-300"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Section 3: Comms & Tech (Col span 4) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left space-y-6"
          >
            <h4 className="text-[10px] font-mono font-black text-blue-600 dark:text-blue-500 tracking-[0.4em] uppercase border-b border-blue-500/20 pb-2 w-full md:w-auto">Comms_Array</h4>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.url}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="relative w-12 h-12 flex items-center justify-center bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-xl text-gray-500 dark:text-gray-400 hover:text-blue-500 hover:border-blue-500/30 transition-colors group shadow-sm"
                >
                  <div className="absolute inset-0 bg-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  {social.icon}
                  
                  {/* Tooltip */}
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black dark:bg-white text-white dark:text-black text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none tracking-widest font-mono shadow-xl whitespace-nowrap">
                    {social.label}
                  </span>
                </motion.a>
              ))}
            </div>

            <div className="pt-4 space-y-3 flex flex-col items-center md:items-start w-full">
              <div className="flex items-center space-x-3 text-[10px] text-gray-500 tracking-widest uppercase bg-black/5 dark:bg-white/5 px-4 py-2 rounded-lg w-full md:w-auto justify-center md:justify-start">
                <FiShield className="text-blue-500" />
                <span>Encrypted Connection</span>
              </div>
              <div className="flex items-center space-x-3 text-[10px] text-gray-500 tracking-widest uppercase bg-black/5 dark:bg-white/5 px-4 py-2 rounded-lg w-full md:w-auto justify-center md:justify-start">
                <FiActivity className="text-blue-500" />
                <span>Uptime: 99.99%</span>
              </div>
            </div>
          </motion.div>

        </div>

        {/* --- BOTTOM SECTION --- */}
        <div className="mt-16 pt-8 border-t border-black/10 dark:border-white/10 flex flex-col lg:flex-row justify-between items-center gap-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-4 text-center">
            <div className="text-[10px] text-blue-600 dark:text-blue-500 tracking-[0.3em] font-mono font-bold bg-blue-500/10 px-3 py-1 rounded-full">
              POWERED BY AI SYSTEMS
            </div>
            <div className="text-[10px] text-gray-500 tracking-[0.3em] font-mono uppercase">
              Archive_001 // v4.0.0
            </div>
          </div>

          <div className="flex flex-col items-center lg:items-end">
             <div className="text-[10px] text-gray-500 tracking-[0.4em] font-mono uppercase mb-2 flex items-center gap-2">
                <span className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></span>
                Local_Time: <span className="text-black dark:text-white font-bold">{systemTime}</span>
             </div>
             <p className="text-[9px] text-gray-400 dark:text-gray-500 tracking-[0.2em] font-mono uppercase text-center lg:text-right">
                &copy; NAMAN LAHARIYA. ALL NEURAL LINKS RESERVED.
             </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
