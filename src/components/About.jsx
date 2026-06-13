import React from 'react';
import { FiAward, FiBookOpen, FiCode, FiDownload } from "react-icons/fi";
import {
    SiReact,
    SiTailwindcss,
    SiMongodb,
    SiNodedotjs,
    SiPython,
    SiCplusplus
} from "react-icons/si";

import aboutData from "../data/about.json";

// Map string keys from CMS to React Icons
const iconMap = {
    FiCode: <FiCode size={20} />,
    FiBookOpen: <FiBookOpen size={20} />,
    FiAward: <FiAward size={20} />,
    SiReact: <SiReact size={24} />,
    SiNodedotjs: <SiNodedotjs size={24} />,
    SiMongodb: <SiMongodb size={24} />,
    SiPython: <SiPython size={24} />,
    SiCplusplus: <SiCplusplus size={24} />
};

export default function About() {
    const { bio, stats, tools } = aboutData;

    return (
        <div id="about" className="relative w-full min-h-screen bg-gray-50 dark:bg-[#020202] overflow-hidden flex items-center justify-center font-sans tracking-wide py-20 px-6 md:px-12 transition-colors duration-500">

            {/* --- BG EFFECTS --- */}
            <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
            <div className="absolute inset-0 z-[15] pointer-events-none dark:hidden" style={{ background: "radial-gradient(circle at 30% 50%, transparent 20%, rgba(249,250,251,0.9) 100%)" }}></div>
            <div className="absolute inset-0 z-[15] pointer-events-none hidden dark:block" style={{ background: "radial-gradient(circle at 30% 50%, transparent 20%, rgba(0,0,0,0.9) 100%)" }}></div>

            {/* --- STATIC FRAME IMAGE (LEFT 45%) --- */}
            <div className="hidden lg:block absolute inset-y-0 left-0 w-[45%] z-10 pointer-events-none overflow-hidden" style={{ WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)', maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)' }}>
                <img
                    src="/images/ezgif-frame-300.jpg"
                    alt="About Profile"
                    className="w-full h-full object-cover opacity-50 grayscale"
                />
            </div>

            {/* --- CONTENT (RIGHT 55%) --- */}
            <div className="relative z-[50] w-full lg:w-[80%] flex flex-col md:flex-row items-center justify-end">

                {/* Visual Gap for the face mask area */}
                <div className="hidden lg:block w-[35%] h-full"></div>

                {/* Main Content Pane */}
                <div className="w-full lg:w-[65%] flex flex-col space-y-6 md:space-y-10 pointer-events-auto bg-white/60 dark:bg-black/40 backdrop-blur-sm p-6 md:p-12 border border-black/5 dark:border-white/5 rounded-2xl shadow-xl dark:shadow-none mt-10 md:mt-0">
                    
                    {/* MOBILE PROFILE IMAGE */}
                    <div className="block lg:hidden w-full h-48 sm:h-64 rounded-xl overflow-hidden mb-2 border border-black/10 dark:border-white/10 relative">
                        <div className="absolute inset-0 bg-blue-500/10 z-10 mix-blend-overlay"></div>
                        <img src="/images/ezgif-frame-300.jpg" alt="About Profile" className="w-full h-full object-cover grayscale opacity-90" />
                    </div>

                    {/* Header */}
                    <div className="space-y-2">
                        <p className="text-blue-500 font-mono text-[10px] uppercase tracking-[0.5em]">SYSTEM INFO</p>
                        <h2 className="text-fluid-h2 font-black text-black dark:text-white tracking-tighter uppercase">
                            About Me<span className="text-blue-500">.</span>
                        </h2>
                    </div>

                    {/* Bio Paragraph */}
                    <div className="robotic-section">
                        <p className="text-gray-600 dark:text-gray-400 text-fluid-p font-light leading-relaxed max-w-2xl">
                            {bio}
                        </p>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stats.map((item) => (
                            <div key={item.title} className="group p-6 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:border-blue-500/40 transition-all duration-300 rounded-xl">
                                <div className="text-blue-500 mb-4 opacity-70 group-hover:opacity-100 transition-opacity">
                                    {iconMap[item.icon]}
                                </div>
                                <h4 className="text-black dark:text-white text-xs font-bold uppercase tracking-widest mb-1">{item.title}</h4>
                                <p className="text-gray-600 dark:text-gray-500 text-[11px] leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Tech Dock */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-mono text-gray-500 tracking-[0.3em] uppercase">Core Tech Stack</h4>
                        <div className="flex flex-wrap gap-3 md:gap-5">
                            {tools.map((tool) => (
                                <div key={tool.title} className="group relative p-3 md:p-4 bg-white/80 dark:bg-black/50 border border-black/5 dark:border-white/5 hover:border-blue-500/50 transition-all rounded-xl flex flex-col items-center justify-center cursor-help shadow-sm dark:shadow-none min-w-[70px] md:min-w-0">
                                    <div className="text-gray-500 group-hover:text-blue-400 transition-colors mb-2 md:mb-0 text-xl md:text-2xl">
                                        {iconMap[tool.icon]}
                                    </div>
                                    <span className="block md:hidden text-[9px] font-mono text-gray-500">
                                        {tool.title}
                                    </span>
                                    <span className="hidden md:block absolute -top-10 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-mono py-1.5 px-3 rounded-md opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-[70] whitespace-nowrap shadow-xl">
                                        {tool.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="pt-6">
                        <a
                            href="https://drive.google.com/drive/folders/1T6Hf1ZuXB6IPZwF8xeG9zIZK1NUJWC7V"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-6 px-12 py-4 bg-blue-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all duration-300 rounded-full shadow-lg shadow-blue-900/20"
                        >
                            <span>View Resume</span>
                            <FiDownload size={16} />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
