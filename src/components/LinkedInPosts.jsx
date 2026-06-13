import React from "react";
import { motion } from "framer-motion";
import { FiLinkedin, FiThumbsUp, FiMessageSquare, FiShare2 } from "react-icons/fi";

const posts = [
  {
    content: "🚀 Introducing Clix Hub – A Complete Club Lifecycle & Experience Hub for Educational Institutions. After 4 months of design, development, testing, and deployment, I'm excited to share Clix Hub, a full-stack Club Management ERP built to transform how student organizations operate at Madhav Institute of Technology and Science, Gwalior.",
    date: "1 week ago",
    likes: 11,
    comments: 0,
    link: "https://www.linkedin.com/in/naman-lahariya/recent-activity/all/"
  },
  {
    content: "Excited to share that I have been selected for the AI Web Development Internship at InAmigos Foundation (IAF) through Internshala. This opportunity marks another step forward in my journey of exploring the intersection of Artificial Intelligence and Web Development.",
    date: "1 week ago",
    likes: 16,
    comments: 0,
    link: "https://www.linkedin.com/in/naman-lahariya/recent-activity/all/"
  },
  {
    content: "🚀 Exploring the Power of AI in Website Development! 🌐🤖 As part of the AI Website Generation Task by InAmigos Foundation (IAF), I created a complete website using AI-powered tools and explored how artificial intelligence can simplify and accelerate the web development process.",
    date: "Recent",
    likes: 9,
    comments: 0,
    link: "https://www.linkedin.com/in/naman-lahariya/recent-activity/all/"
  }
];

const LinkedInPosts = () => {
  return (
    <section id="posts" className="bg-gray-50 dark:bg-[#020202] py-24 px-6 md:px-12 lg:px-24 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-blue-500 font-mono tracking-[0.4em] uppercase text-[10px] mb-4"
          >
            Insights & Updates
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-6xl font-black text-black dark:text-white mb-8 uppercase tracking-tighter"
          >
            Recent Activity<span className="text-blue-500">.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.a
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 hover:bg-gray-100 dark:hover:bg-white/10 transition-all group hover:-translate-y-2 block shadow-lg dark:shadow-none"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white">
                  <FiLinkedin size={20} />
                </div>
                <div>
                  <h4 className="text-black dark:text-white font-bold">Naman Lahariya</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">{post.date}</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-6 line-clamp-4">
                {post.content}
              </p>
              <div className="flex gap-6 text-gray-600 dark:text-gray-400 text-sm border-t border-black/10 dark:border-white/10 pt-4 mt-auto">
                <div className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                  <FiThumbsUp /> {post.likes}
                </div>
                <div className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                  <FiMessageSquare /> {post.comments}
                </div>
                <div className="flex items-center gap-2 hover:text-blue-500 transition-colors ml-auto">
                  <FiShare2 />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
        <div className="text-center mt-12">
          <a href="https://linkedin.com/in/naman-lahariya" target="_blank" rel="noopener noreferrer" className="inline-block border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors px-8 py-3 rounded-full font-bold uppercase tracking-wider text-sm">
            View All Activity
          </a>
        </div>
      </div>
    </section>
  );
};

export default LinkedInPosts;
