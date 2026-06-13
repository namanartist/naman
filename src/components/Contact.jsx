import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiSend, FiUser, FiMail, FiMessageSquare, FiActivity, FiShield } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const formRef = useRef();
  
  const [loaded, setLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentFrameIdx, setCurrentFrameIdx] = useState(0);

  const frameCount = 160;
  const imagesRef = useRef([]);
  const seqRef = useRef({ frame: 0 });

  const currentFrame = (index) => `/image3/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`;

  // 1. Preload Sequence
  useEffect(() => {
    let loadedCount = 0;
    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        img.onload = () => {
            loadedCount++;
            setLoadingProgress(Math.floor((loadedCount / frameCount) * 100));
            if (loadedCount === frameCount) setLoaded(true);
        };
        img.onerror = () => {
            loadedCount++;
            if (loadedCount === frameCount) setLoaded(true);
        };
        imagesRef.current.push(img);
    }
  }, []);

  // 2. GSAP Scroll and Render Logic (Hero Sync)
  useEffect(() => {
    if (!loaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Responsive Canvas Size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render();
    };

    const render = () => {
      if (!canvas || !imagesRef.current.length) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      let frameIdx = Math.round(seqRef.current.frame);
      if (frameIdx >= frameCount) frameIdx = frameCount - 1;

      const img = imagesRef.current[frameIdx];
      if (img && img.complete && img.naturalWidth !== 0) {
        const scale = Math.max(
          canvas.width / img.width,
          canvas.height / img.height
        );
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;
        
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      }
      setCurrentFrameIdx(frameIdx);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Scroll Animation - Sync with Hero logic
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=4000",
        scrub: 1.2, // Smoother scrub
        pin: true,
        anticipatePin: 1
      }
    });

    tl.to(seqRef.current, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      onUpdate: render
    });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      ScrollTrigger.getAll().filter(t => t.trigger === containerRef.current).forEach(t => t.kill());
    };
  }, [loaded]);

  const sendToTelegram = async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(formRef.current);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    const BOT_TOKEN = "8862152349:AAENBUvz5TuvCMSelPdcQkpegdmmborYeaE";
    // NOTE: Replace this with your actual CHAT_ID
    // You can get it by messaging your bot and visiting:
    // https://api.telegram.org/bot8862152349:AAENBUvz5TuvCMSelPdcQkpegdmmborYeaE/getUpdates
    const CHAT_ID = "6088742485"; 
    
    if (CHAT_ID === "YOUR_CHAT_ID_HERE") {
       toast.error("CHAT_ID NOT CONFIGURED ❌");
       return;
    }

    const text = `🚀 <b>New Contact Form Submission</b>\n<b>Name:</b> ${name}\n<b>Email:</b> ${email}\n<b>Message:</b> ${message}`;

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: text,
          parse_mode: "HTML",
        }),
      });

      if (response.ok) {
        toast.success("TRANSMISSION_COMPLETE 🚀");
        formRef.current.reset();
      } else {
        toast.error("CONNECTION_FAILURE ❌");
      }
    } catch (err) {
      toast.error("CONNECTION_FAILURE ❌");
    }
  };

  return (
    <div
      ref={containerRef}
      id="contactme"
      className="relative w-full h-screen bg-gray-50 dark:bg-[#020202] overflow-hidden flex items-center justify-center font-mono select-none transition-colors duration-500"
    >
      {/* 1. Loading Module (Ultra-high Z) */}
      <AnimatePresence>
        {!loaded && (
          <motion.div 
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-[100] bg-gray-50 dark:bg-[#020202]"
          >
            <div className="text-blue-400 font-mono text-[10px] uppercase tracking-[0.5em] mb-4 animate-pulse">
              SYNCING_COMM_STREAM {loadingProgress}%
            </div>
            <div className="w-64 h-[2px] bg-blue-950/30 overflow-hidden">
               <motion.div 
                 className="h-full bg-blue-500" 
                 style={{ width: `${loadingProgress}%` }}
               />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Cinematic Canvas Layer (Z-0) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover z-0 dark:invert-0 invert mix-blend-multiply dark:mix-blend-normal"
      />

      {/* 3. Aesthetic Overlays (Z-10) */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-radial-vignette opacity-40" />
      <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.3)_100%)]" />

      {/* 4. Peripheral HUD Elements (Z-20) */}
      <AnimatePresence>
        {loaded && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-20 pointer-events-none p-10"
          >
            {/* Top-left animated text */}
            <div className="hidden md:block absolute top-12 left-12">
              <motion.div 
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-blue-400 font-mono text-[9px] uppercase tracking-[0.7em] font-bold"
              >
                Establish Sub-Space Connection
              </motion.div>
            </div>

            {/* Brackets */}
            <div className="hidden md:block absolute top-10 left-10 w-24 h-24 border-t border-l border-blue-500/20" />
            <div className="hidden md:block absolute top-10 right-10 w-24 h-24 border-t border-r border-blue-500/20" />
            <div className="hidden md:block absolute bottom-10 left-10 w-24 h-24 border-b border-l border-blue-500/20" />
            <div className="hidden md:block absolute bottom-10 right-10 w-24 h-24 border-b border-r border-blue-500/20" />

            {/* Static HUD Text */}
            <div className="hidden md:flex absolute top-12 left-12 items-center space-x-3">
               <FiActivity className="text-blue-400 text-xs animate-pulse" />
               <span className="text-blue-400/40 text-[9px] tracking-[0.4em] uppercase font-bold">Signal_Stable</span>
            </div>
            
            <div className="absolute bottom-12 right-12 text-right hidden lg:block">
               <span className="text-black/30 dark:text-white/10 text-[9px] tracking-[0.6em] uppercase block mb-1">Archive_003</span>
               <span className="text-blue-500/30 text-[9px] tracking-[0.4em] uppercase">&gt; System_Ready</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Central Contact UI (Z-50) */}
      <AnimatePresence>
        {loaded && currentFrameIdx >= 120 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-50 w-full max-w-4xl px-6 pointer-events-auto"
          >
            <div className="text-center mb-8">
              <h2 className="text-[clamp(3rem,8vw,8rem)] font-black text-black dark:text-white uppercase tracking-tighter leading-none">
              COMM<span className="text-blue-500 block sm:inline">.LINK</span>
            </h2>
              <div className="flex items-center justify-center space-x-2 text-blue-500/60 font-mono text-[9px] tracking-[0.6em] uppercase">
                <FiShield />
                <span>Protocol: Neural_Gate</span>
              </div>
            </div>

            <form
              ref={formRef}
              onSubmit={sendToTelegram}
              className="relative bg-white/40 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border border-black/5 dark:border-white/5 p-8 md:p-14 rounded-3xl shadow-2xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-6 md:space-y-10 group overflow-hidden"
            >
              {/* Hover Ambient Glow inside form card */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

              {/* Corner Cyberpunk Accents */}
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-blue-500/0 group-hover:border-blue-500/30 transition-all duration-500 rounded-tr-3xl transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-blue-500/0 group-hover:border-blue-500/30 transition-all duration-500 rounded-bl-3xl transform -translate-x-4 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0"></div>

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-blue-600/70 dark:text-blue-500/50 block ml-1 flex items-center gap-2">
                    <FiUser className="text-blue-500" /> IDENT_SIGNATURE
                  </label>
                  <input
                    name="name"
                    type="text"
                    placeholder="ENTER_NAME"
                    required
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl py-4 px-6 text-black dark:text-white text-base md:text-sm outline-none focus:border-blue-500 focus:bg-blue-500/5 focus:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all placeholder:text-black/30 dark:placeholder:text-blue-950/40"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-blue-600/70 dark:text-blue-500/50 block ml-1 flex items-center gap-2">
                    <FiMail className="text-blue-500" /> COMM_PATH_ADDR
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="ENTER_EMAIL"
                    required
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl py-4 px-6 text-black dark:text-white text-base md:text-sm outline-none focus:border-blue-500 focus:bg-blue-500/5 focus:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all placeholder:text-black/30 dark:placeholder:text-blue-950/40"
                  />
                </div>
              </div>

              <div className="relative z-10 space-y-3">
                <label className="text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-blue-600/70 dark:text-blue-500/50 block ml-1 flex items-center gap-2">
                  <FiMessageSquare className="text-blue-500" /> DATA_PAYLOAD
                </label>
                <textarea
                  name="message"
                  placeholder="INPUT_TRANSMISSION..."
                  required
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl py-4 px-6 text-black dark:text-white text-base md:text-sm outline-none focus:border-blue-500 focus:bg-blue-500/5 focus:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all min-h-[140px] resize-none placeholder:text-black/30 dark:placeholder:text-blue-950/40"
                />
              </div>

              <div className="relative z-10 flex justify-center md:justify-end mt-4">
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(59, 130, 246, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="group relative overflow-hidden flex justify-center items-center space-x-4 w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-black font-black text-xs uppercase tracking-[0.4em] px-12 py-5 rounded-xl shadow-xl transition-all"
                >
                  <span className="relative z-10">TRANSMIT_DATA</span>
                  <FiSend className="relative z-10 text-lg transition-transform group-hover:translate-x-2 group-hover:-translate-y-1" />
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out z-0"></div>
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer
        position="bottom-right"
        toastClassName="bg-white dark:bg-black border border-blue-500/30 text-black dark:text-white font-mono text-[9px] rounded-none backdrop-blur-xl"
        progressClassName="bg-blue-600"
      />
    </div>
  );
};

export default Contact;
