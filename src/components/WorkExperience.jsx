import React from "react";
import { motion } from "framer-motion";
import experienceData from "../data/experience.json";

const WorkExperience = () => {
  const experiences = experienceData.experiences;
  return (
    <section id="experience" className="bg-gray-50 dark:bg-[#020202] py-24 px-6 md:px-12 lg:px-24 transition-colors duration-500 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20 md:mb-32 relative z-10">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-blue-500 font-mono tracking-[0.4em] uppercase text-[10px] mb-4"
          >
            My Journey
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-fluid-h2 font-black text-black dark:text-white mb-8 uppercase tracking-tighter"
          >
            Work Experience<span className="text-blue-500">.</span>
          </motion.h2>
        </div>

        <div className="relative">
          {/* Vertical Tracking Line */}
          <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-500/10 via-blue-500/30 to-blue-500/10 -translate-x-1/2 rounded-full hidden sm:block"></div>

          <div className="space-y-16 md:space-y-24">
            {experiences.map((exp, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true, margin: "-100px" }}
                  className={`relative flex flex-col sm:flex-row items-start ${isEven ? 'sm:flex-row-reverse' : ''} group`}
                >
                  {/* Center Node */}
                  <div className="hidden sm:flex absolute left-1/2 top-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center z-10">
                    <div className="w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)] group-hover:scale-150 group-hover:shadow-[0_0_25px_rgba(59,130,246,0.8)] transition-all duration-300"></div>
                    <div className="absolute w-12 h-12 border border-blue-500/30 rounded-full animate-[spin_4s_linear_infinite] group-hover:border-blue-500/60 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>

                  {/* Content Card */}
                  <div className="w-full sm:w-[45%] pl-10 sm:pl-0">
                    <div className="bg-white/60 dark:bg-black/40 backdrop-blur-md border border-black/5 dark:border-white/5 p-8 rounded-2xl shadow-xl dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] group-hover:border-blue-500/30 group-hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
                      {/* Cyberpunk corner accents */}
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-tl-2xl"></div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-br-2xl"></div>
                      
                      {/* Glowing background blob on hover */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/10 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                      <div className="relative z-10">
                        <div className="text-blue-500 font-mono text-[10px] tracking-[0.2em] mb-3 bg-blue-500/10 inline-block px-3 py-1 rounded-full uppercase">
                          {exp.duration}
                        </div>
                        <h3 className="text-xl md:text-2xl font-black text-black dark:text-white uppercase tracking-tight mb-1">{exp.role}</h3>
                        <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-6 uppercase tracking-wider">{exp.company}</h4>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm md:text-fluid-p">
                          {exp.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkExperience;
