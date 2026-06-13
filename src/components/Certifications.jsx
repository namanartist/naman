import React from "react";
import { motion } from "framer-motion";
import { FiAward } from "react-icons/fi";
import certificationsData from "../data/certifications.json";

const Certifications = () => {
  const certifications = certificationsData.certifications;
  return (
    <section id="certifications" className="bg-gray-100 dark:bg-[#050505] py-24 px-6 md:px-12 lg:px-24 border-t border-black/5 dark:border-white/5 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-blue-500 font-mono tracking-[0.4em] uppercase text-[10px] mb-4"
          >
            Achievements
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-6xl font-black text-black dark:text-white mb-8 uppercase tracking-tighter"
          >
            Certifications<span className="text-blue-500">.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden bg-white dark:bg-black/40 border border-black/10 dark:border-white/5 p-8 rounded-sm hover:border-blue-500/50 transition-all shadow-lg dark:shadow-none"
            >
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-transform">
                <FiAward size={24} />
              </div>
              <h3 className="text-xl font-bold text-black dark:text-white mb-2">{cert.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{cert.issuer}</p>
              <div className="flex justify-between items-center mt-auto">
                <span className="text-sm font-mono text-blue-500/70">{cert.date}</span>
                <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-sm text-black dark:text-white hover:text-blue-500 uppercase tracking-wider font-bold transition-colors">
                  View Credential
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
