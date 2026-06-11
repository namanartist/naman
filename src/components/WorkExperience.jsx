import React from "react";
import { motion } from "framer-motion";
import experienceData from "../data/experience.json";

const WorkExperience = () => {
  const experiences = experienceData.experiences;
  return (
    <section id="experience" className="bg-gray-50 dark:bg-[#020202] py-24 px-6 md:px-12 lg:px-24 transition-colors duration-500">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
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
            className="text-4xl md:text-6xl font-black text-black dark:text-white mb-8 uppercase tracking-tighter"
          >
            Work Experience<span className="text-blue-500">.</span>
          </motion.h2>
        </div>

        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-8 md:pl-0"
            >
              <div className="md:flex items-start justify-between group">
                <div className="md:w-1/3 mb-4 md:mb-0">
                  <div className="text-blue-500 font-mono text-sm mb-2">{exp.duration}</div>
                  <h3 className="text-xl font-bold text-black dark:text-white uppercase tracking-tight">{exp.company}</h3>
                </div>
                <div className="md:w-2/3 md:pl-12 border-l border-black/10 dark:border-white/10 relative">
                  <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[6.5px] top-2 group-hover:scale-150 transition-transform"></div>
                  <h4 className="text-2xl font-bold text-black dark:text-white mb-4">{exp.role}</h4>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkExperience;
