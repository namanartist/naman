// Initialize Lucide Icons
lucide.createIcons();

// ==========================================
// SHARED SCROLL SCHEDULER
// One passive listener, at most one run per frame. Every scroll-driven effect
// registers here instead of attaching its own window 'scroll' listener.
// ==========================================
const scrollHandlers = [];
let scrollScheduled = false;
function onScroll(fn) {
    scrollHandlers.push(fn);
}
function runScrollHandlers() {
    scrollScheduled = false;
    for (let i = 0; i < scrollHandlers.length; i++) scrollHandlers[i]();
}
window.addEventListener('scroll', () => {
    if (!scrollScheduled) {
        scrollScheduled = true;
        requestAnimationFrame(runScrollHandlers);
    }
}, { passive: true });

// Document-relative top of an element. Uses offsetTop so CSS transforms (e.g. the
// pending .fade-in translateY) don't skew the measurement.
function docOffsetTop(el) {
    let top = 0;
    while (el) {
        top += el.offsetTop;
        el = el.offsetParent;
    }
    return top;
}

// Re-run `fn` (rAF-throttled) on resize, full load, and whenever the page height changes
function onLayoutChange(fn) {
    let queued = false;
    const run = () => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => {
            queued = false;
            fn();
        });
    };
    window.addEventListener('resize', run);
    window.addEventListener('load', run);
    if (typeof ResizeObserver !== 'undefined') new ResizeObserver(run).observe(document.body);
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;

// Anchor links: Lenis handles smooth scrolling (see MOMENTUM SCROLLING below).
// Fall back to native smooth scrolling only if Lenis fails to load.
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (window.lenis) {
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) window.lenis.scrollTo(targetElement);
            } else {
                window.lenis.scrollTo(0);
            }
        } else {
            const target = targetId && targetId !== '#' ? document.querySelector(targetId) : null;
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            else window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
});

// Add fade-in class initially to hide elements
const animateElements = document.querySelectorAll('section, .glass-card, .section-title, .curtain-reveal-container, .timeline-row');
animateElements.forEach((el, index) => {
    // Role cards live in the horizontal-scroll track (clipped by overflow: hidden), so an
    // IntersectionObserver-driven fade can fire late and leave the first card dim. Skip it for them.
    if (!el.classList.contains('curtain-reveal-container') && !el.classList.contains('reveal-content')
        && !el.classList.contains('role-card')) {
        el.classList.add('fade-in');
    }
    if (el.classList.contains('glass-card') && !el.classList.contains('reveal-content')) {
        el.style.transitionDelay = `${(index % 4) * 0.1}s`;
    }
});

function initObserver() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        // Use a slightly higher threshold for the curtain to ensure the user scrolls down to it
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Stagger tag animations inside skill categories
                if (entry.target.classList.contains('skill-category')) {
                    const tags = entry.target.querySelectorAll('.tag');
                    tags.forEach((tag, idx) => {
                        setTimeout(() => tag.classList.add('visible'), 200 + (idx * 80));
                    });
                }

                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => observer.observe(el));
}

// Custom Cursor Tracking (transform-only, one rAF-driven update per frame)
const cursorDot = document.querySelector('[data-cursor-dot]');
const cursorOutline = document.querySelector('[data-cursor-outline]');

if (cursorDot && cursorOutline && !isTouchDevice) {
    let cursorX = -100, cursorY = -100;
    let outlineX = -100, outlineY = -100;
    let cursorRaf = null;

    function renderCursor() {
        // Outline eases toward the dot instead of spawning a new animation per mousemove
        outlineX += (cursorX - outlineX) * 0.2;
        outlineY += (cursorY - outlineY) * 0.2;
        cursorDot.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
        cursorOutline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0) translate(-50%, -50%)`;

        if (Math.abs(cursorX - outlineX) > 0.1 || Math.abs(cursorY - outlineY) > 0.1) {
            cursorRaf = requestAnimationFrame(renderCursor);
        } else {
            cursorRaf = null;
        }
    }

    window.addEventListener('mousemove', function (e) {
        cursorX = e.clientX;
        cursorY = e.clientY;
        if (cursorRaf === null) cursorRaf = requestAnimationFrame(renderCursor);
    }, { passive: true });

    // Interactive hover effect for custom cursor
    document.querySelectorAll('a, button, .glass-card, .tag, .btn-icon, .magnetic').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.classList.add('cursor-morph');
            cursorOutline.classList.add('hide');
        });
        el.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('cursor-morph');
            cursorOutline.classList.remove('hide');
        });
    });
}

// Preloader Logic is now handled by the Epic UX Features block at the bottom of this file.

// Dynamic heading background position on scroll
// (the old .bg-grid translateY parallax was removed: the grid is position: fixed,
// so translating it just slid it off screen)
const aboutHeading = document.getElementById('about-heading');
if (aboutHeading) {
    onScroll(() => {
        const rect = aboutHeading.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const scrollPercent = 1 - (rect.top / window.innerHeight);
            aboutHeading.style.backgroundPosition = `${scrollPercent * 300}% center`;
        }
    });
}

// Theme Toggle Logic
const themeBtn = document.getElementById('theme-toggle');
if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        // Toggle class on the root element
        const isLight = document.documentElement.classList.toggle('light-theme');

        // Save preference
        if (isLight) {
            localStorage.setItem('portfolio-theme', 'light');
        } else {
            localStorage.setItem('portfolio-theme', 'dark');
        }
    });
}

// Click Ripple Effect
document.addEventListener('click', (e) => {
    // Don't create a ripple if clicking on a button or link (optional, but let's just do it everywhere for fun tech vibe)
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);

    // Remove the ripple element from the DOM after the animation completes
    setTimeout(() => {
        ripple.remove();
    }, 600);
});

// ==========================================
// INTERACTIVE PARTICLE BACKGROUND ENGINE
// ==========================================
(function initParticles() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];
    // Fewer orbs on small/touch screens; the pair-wise link check is O(n^2)
    const particleCount = (isTouchDevice || window.innerWidth < 768) ? 60 : 120;
    const linkDistance = 150;
    const linkBuckets = 4; // batch links by opacity so we stroke 4 paths per frame, not hundreds

    // Mouse Interaction Variables
    let mouse = { x: -1000, y: -1000 };
    const interactionRadius = 150; // How close mouse needs to be to repel
    const repelForce = 0.5; // How strongly they get pushed away

    // Theme Colors
    const darkThemeColor = 'rgba(0, 255, 204, 0.4)'; // Neon cyan
    const darkThemeConnection = 'rgba(0, 255, 204, 0.1)';
    const lightThemeColor = 'rgba(0, 80, 65, 0.6)'; // Very deep teal
    const lightThemeConnection = 'rgba(0, 80, 65, 0.25)';

    let particleColor = darkThemeColor;
    let connectionColor = darkThemeConnection;

    function updateThemeColors() {
        if (document.documentElement.classList.contains('light-theme')) {
            particleColor = lightThemeColor;
            connectionColor = lightThemeConnection;
        } else {
            particleColor = darkThemeColor;
            connectionColor = darkThemeConnection;
        }
    }

    // Resize canvas (backing store capped at 1.5x to avoid a huge buffer on retina screens)
    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    window.addEventListener('resize', resize);
    resize();
    updateThemeColors();

    // Watch for theme changes dynamically
    const observer = new MutationObserver(() => updateThemeColors());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Track mouse
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseout', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.radius = Math.random() * 2.5 + 1;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.baseVx = this.vx;
            this.baseVy = this.vy;
        }

        update() {
            // Apply mouse repulsion
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < interactionRadius) {
                // Calculate force based on distance
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const forceMultiplier = (interactionRadius - distance) / interactionRadius;

                this.vx += forceDirectionX * forceMultiplier * repelForce;
                this.vy += forceDirectionY * forceMultiplier * repelForce;
            }

            // Friction to gradually return to base speed
            this.vx += (this.baseVx - this.vx) * 0.05;
            this.vy += (this.baseVy - this.vy) * 0.05;

            // Move
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off walls
            if (this.x < 0 || this.x > width) {
                this.vx *= -1;
                this.baseVx *= -1;
                this.x = Math.max(0, Math.min(this.x, width));
            }
            if (this.y < 0 || this.y > height) {
                this.vy *= -1;
                this.baseVy *= -1;
                this.y = Math.max(0, Math.min(this.y, height));
            }
        }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Animation Loop
    let bgRaf = null;
    const linkBatches = Array.from({ length: linkBuckets }, () => []);

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let b = 0; b < linkBuckets; b++) linkBatches[b].length = 0;

        ctx.fillStyle = particleColor;
        ctx.beginPath();
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.update();
            // All orbs in a single fill
            ctx.moveTo(p.x + p.radius, p.y);
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

            // Collect connections between nearby particles
            for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j];
                const dx = p.x - q.x;
                const dy = p.y - q.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < linkDistance * linkDistance) {
                    const strength = 1 - Math.sqrt(distSq) / linkDistance;
                    const bucket = Math.min(linkBuckets - 1, Math.floor(strength * linkBuckets));
                    linkBatches[bucket].push(p.x, p.y, q.x, q.y);
                }
            }
        }
        ctx.fill();

        ctx.strokeStyle = connectionColor;
        ctx.lineWidth = 0.8;
        for (let b = 0; b < linkBuckets; b++) {
            const lines = linkBatches[b];
            if (!lines.length) continue;
            ctx.globalAlpha = (b + 0.5) / linkBuckets;
            ctx.beginPath();
            for (let k = 0; k < lines.length; k += 4) {
                ctx.moveTo(lines[k], lines[k + 1]);
                ctx.lineTo(lines[k + 2], lines[k + 3]);
            }
            ctx.stroke();
        }
        ctx.globalAlpha = 1.0;

        bgRaf = requestAnimationFrame(animate);
    }

    function startBg() {
        if (bgRaf === null && !prefersReducedMotion) bgRaf = requestAnimationFrame(animate);
    }
    function stopBg() {
        if (bgRaf !== null) {
            cancelAnimationFrame(bgRaf);
            bgRaf = null;
        }
    }

    // Don't burn CPU/GPU while the tab is hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) stopBg(); else startBg();
    });

    if (prefersReducedMotion) {
        // Draw one static frame
        animate();
        stopBg();
    } else {
        startBg();
    }
})();

// ==========================================
// MAGNETIC BUTTONS
// ==========================================
const magneticElements = document.querySelectorAll('.nav-links a, .theme-btn, .btn-primary, .contact-card, .hero-badge');

magneticElements.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
        const position = el.getBoundingClientRect();
        const x = e.clientX - position.left - position.width / 2;
        const y = e.clientY - position.top - position.height / 2;

        el.style.transition = 'transform 0.1s cubic-bezier(0.2, 0.8, 0.2, 1)';
        el.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;

        const icon = el.querySelector('i, svg');
        if (icon) {
            icon.style.transition = 'transform 0.1s cubic-bezier(0.2, 0.8, 0.2, 1)';
            icon.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        }
    });

    el.addEventListener('mouseleave', () => {
        el.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
        el.style.transform = 'translate(0px, 0px)';
        const icon = el.querySelector('i, svg');
        if (icon) {
            icon.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
            icon.style.transform = 'translate(0px, 0px)';
        }
    });
});

// ==========================================
// MOMENTUM SCROLLING (LENIS)
// ==========================================
if (typeof Lenis !== 'undefined' && !prefersReducedMotion) {
    window.lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        syncTouch: false, // keep native momentum on touch devices
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        window.lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    window.lenis.on('scroll', runScrollHandlers);
    // Anchor links use window.lenis.scrollTo (see the anchor handler at the top of this file)
}

// ==========================================
// ELITE FEATURES: PARALLAX CURTAIN & SVG CIRCUIT
// ==========================================
const parallaxFooter = document.querySelector('.parallax-footer');
const contentWrapper = document.querySelector('.content-wrapper');

// 1. JS Parallax Footer Logic
const footerContent = document.querySelector('.footer-content');
if (parallaxFooter && footerContent) {
    // Remove the margin-bottom that was previously set by the curtain reveal logic
    if (contentWrapper) {
        contentWrapper.style.marginBottom = '0px';
    }

    const scrollCallback = () => {
        const footerRect = parallaxFooter.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // When footer comes into view
        if (footerRect.top < windowHeight) {
            const progress = (windowHeight - footerRect.top) / footerRect.height;
            const clampedProgress = Math.max(0, Math.min(progress, 1));
            // Move from -150px down to 0, fade from 0 to 1
            const yOffset = -150 + (clampedProgress * 150);
            footerContent.style.transform = `translateY(${yOffset}px)`;
            footerContent.style.opacity = clampedProgress;
        }
    };

    onScroll(scrollCallback);
    scrollCallback();
}

// 2. Scroll-Driven Circuit SVG Logic
const circuitPath = document.getElementById('circuit-path');
const circuitGlow = document.getElementById('circuit-glow');
if (circuitPath) {
    const pathLength = circuitPath.getTotalLength();
    [circuitPath, circuitGlow].forEach(path => {
        if (!path) return;
        path.style.strokeDasharray = pathLength;
        path.style.strokeDashoffset = pathLength; // Start completely hidden
    });

    // Cache the document height; reading scrollHeight on every scroll forces layout
    let circuitScrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    onLayoutChange(() => {
        circuitScrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    });

    let lastCircuitOffset = -1;
    onScroll(() => {
        const scrollPercent = Math.min(1, Math.max(0, window.scrollY / circuitScrollable));
        const offset = pathLength - pathLength * scrollPercent;
        if (Math.abs(offset - lastCircuitOffset) < 0.5) return;
        lastCircuitOffset = offset;
        circuitPath.style.strokeDashoffset = offset;
        if (circuitGlow) circuitGlow.style.strokeDashoffset = offset;
    });
}

// ==========================================
// HACKER SCRAMBLE HOVER EFFECT
// ==========================================
const heroName = document.querySelector('.name-bold');
if (heroName) {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let scrambleInterval = null;

    heroName.addEventListener('mouseover', (e) => {
        let iteration = 0;
        clearInterval(scrambleInterval);

        scrambleInterval = setInterval(() => {
            // Play decoding tick sound
            if (window.playTick) window.playTick();

            e.target.innerText = e.target.innerText
                .split("")
                .map((letter, index) => {
                    // Skip spaces so they don't scramble into letters
                    if (e.target.dataset.text[index] === ' ') return ' ';

                    if (index < iteration) {
                        return e.target.dataset.text[index];
                    }
                    return letters[Math.floor(Math.random() * 26)];
                })
                .join("");

            if (iteration >= e.target.dataset.text.length) {
                clearInterval(scrambleInterval);
            }
            iteration += 1 / 3;
        }, 30);
    });
}

// ==========================================
// 3D MAGNETIC HOVER PHYSICS (TILT CARDS)
// ==========================================
const tiltElements = document.querySelectorAll('.project-card, .skill-category, .glass-card');

tiltElements.forEach(card => {
    // Inject glare element
    const glare = document.createElement('div');
    glare.classList.add('tilt-glare');
    card.appendChild(glare);
    card.classList.add('tilt-card');

    // Tilt only makes sense with a hovering pointer, and is motion the user may have opted out of
    if (isTouchDevice || prefersReducedMotion) return;

    let pointerX = 0, pointerY = 0;
    let tiltRaf = null;

    const applyTilt = () => {
        tiltRaf = null;
        // One layout read per frame at most (the page may scroll under a stationary cursor)
        const rect = card.getBoundingClientRect();
        const x = pointerX - rect.left; // x position within the element
        const y = pointerY - rect.top;  // y position within the element

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate tilt amounts (max 15 degrees)
        const tiltX = ((y - centerY) / centerY) * -15;
        const tiltY = ((x - centerX) / centerX) * 15;

        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;

        // Move the glare opposite to the mouse
        glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.2) 0%, transparent 60%)`;
    };

    card.addEventListener('mouseenter', () => {
        card.style.zIndex = '10'; // Bring to front
    });

    card.addEventListener('mousemove', (e) => {
        // Remove bounce-back transition while tracking mouse
        card.classList.remove('leave');
        pointerX = e.clientX;
        pointerY = e.clientY;
        if (tiltRaf === null) tiltRaf = requestAnimationFrame(applyTilt);
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
        if (tiltRaf !== null) {
            cancelAnimationFrame(tiltRaf);
            tiltRaf = null;
        }
        card.classList.add('leave');
        card.style.zIndex = '';
        card.style.transform = '';
        glare.style.background = `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 60%)`;
    });
});

// ==========================================
// TERMINAL DECRYPTION REVEAL
// ==========================================
const terminalSandbox = document.getElementById('terminal-sandbox');
const terminalBody = document.getElementById('terminal-body');
const skillsData = document.getElementById('skills-data');

if (terminalSandbox && terminalBody && skillsData) {
    const rawSkills = Array.from(skillsData.children);
    let currentSequenceId = 0;

    // Hacker characters for decryption
    const chars = '!<>-_\\\\/[]{}—=+*^?#________';

    async function typeLine(text, sequenceId, className = '') {
        if (sequenceId !== currentSequenceId) return null;

        const line = document.createElement('div');
        line.className = `terminal-line ${className}`;
        terminalBody.appendChild(line);

        const textSpan = document.createElement('span');
        line.appendChild(textSpan);

        const cursor = document.createElement('span');
        cursor.className = 'cursor-blink';
        line.appendChild(cursor);

        for (let i = 0; i < text.length; i++) {
            if (sequenceId !== currentSequenceId) return null;
            textSpan.textContent += text[i];
            if (window.playTick) window.playTick();
            await new Promise(r => setTimeout(r, Math.random() * 20 + 10)); // Typing speed
        }

        cursor.remove();
        return line;
    }

    async function decryptTags(sequenceId) {
        if (sequenceId !== currentSequenceId) return;

        const line = document.createElement('div');
        line.className = 'terminal-line';
        terminalBody.appendChild(line);

        const promises = rawSkills.map(async (skillNode, index) => {
            await new Promise(r => setTimeout(r, index * 60)); // Stagger start
            if (sequenceId !== currentSequenceId) return;

            // Prepare final HTML by injecting the decrypted-tag class
            let finalHtml = skillNode.outerHTML;
            if (finalHtml.includes('class="')) {
                finalHtml = finalHtml.replace('class="', 'class="decrypted-tag ');
            } else {
                finalHtml = finalHtml.replace('>', ' class="decrypted-tag">');
            }

            const targetText = skillNode.textContent;

            const tagContainer = document.createElement('span');
            tagContainer.style.display = 'inline-block';
            tagContainer.style.margin = '4px';
            tagContainer.style.fontFamily = 'var(--font-mono)';
            tagContainer.style.color = 'var(--text-secondary)';
            line.appendChild(tagContainer);

            let iterations = 0;

            return new Promise(resolve => {
                const interval = setInterval(() => {
                    if (sequenceId !== currentSequenceId) {
                        clearInterval(interval);
                        resolve();
                        return;
                    }

                    tagContainer.textContent = targetText.split('')
                        .map((char, i) => {
                            if (i < iterations) return targetText[i];
                            return chars[Math.floor(Math.random() * chars.length)];
                        })
                        .join('');

                    if (iterations >= targetText.length) {
                        clearInterval(interval);
                        tagContainer.outerHTML = finalHtml;
                        resolve();
                    }
                    iterations += 1 / 3;
                }, 30);
            });
        });

        await Promise.all(promises);
        if (sequenceId !== currentSequenceId) return;

        const finalLine = document.createElement('div');
        finalLine.className = 'terminal-line';
        finalLine.innerHTML = `<span style="color: var(--accent-primary)">></span> <span class="cursor-blink"></span>`;
        terminalBody.appendChild(finalLine);
    }

    async function runTerminalSequence() {
        currentSequenceId++;
        const sequenceId = currentSequenceId;

        terminalBody.innerHTML = '';

        const l1 = await typeLine('> boot_sequence --init', sequenceId);
        if (!l1) return;
        await new Promise(r => setTimeout(r, 150));

        const loading = await typeLine('[+] Loading core modules...', sequenceId);
        if (!loading) return;
        await new Promise(r => setTimeout(r, 300));
        if (sequenceId !== currentSequenceId) return;
        loading.innerHTML = `<span>[+] Core modules loaded 100%</span>`;

        const l2 = await typeLine('> DECRYPTING_SKILLS.sh', sequenceId);
        if (!l2) return;
        await new Promise(r => setTimeout(r, 100));

        await decryptTags(sequenceId);
    }

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            runTerminalSequence();
        } else {
            // Cancel sequence if out of view
            currentSequenceId++;
        }
    }, { threshold: 0.4 });

    observer.observe(terminalSandbox);
}

// ==========================================
// EPIC UX FEATURES
// ==========================================

// 1 & 2. Preloader & AudioContext
// The preloader continues on its own after PRELOADER_MS (no click needed). Sound is OFF by
// default; the AudioContext is only created when the visitor turns sound on with the toggle.
const PRELOADER_MS = 2500;
const preloader = document.getElementById('preloader');
const bootText = document.getElementById('boot-text');
const progressBar = document.getElementById('progress-bar');
const loaderText = document.getElementById('loader-text');
const soundHint = document.getElementById('sound-hint');
const audioToggleBtn = document.getElementById('audio-toggle');

let audioCtx;
window.isAudioEnabled = false; // globally accessible

// "Turn on sound" nudge: an arrow + label pointing at the sound button
let soundHintTimer = null;
function showSoundHint() {
    if (!soundHint || window.isAudioEnabled) return;
    soundHint.classList.add('show');
    if (audioToggleBtn) audioToggleBtn.classList.add('attention');
    soundHintTimer = setTimeout(hideSoundHint, 10000);
}
function hideSoundHint() {
    clearTimeout(soundHintTimer);
    if (soundHint) soundHint.classList.remove('show');
    if (audioToggleBtn) audioToggleBtn.classList.remove('attention');
}

function enterSite() {
    if (!preloader || preloader.dataset.done) return;
    preloader.dataset.done = '1';
    preloader.classList.add('hidden'); // fades out via CSS
    setTimeout(() => {
        preloader.style.display = 'none';
        document.body.classList.remove('loading');
        if (typeof initObserver === 'function') initObserver(); // Start fade animations
        setTimeout(showSoundHint, 700);
    }, 600);
}

// Initialize Preloader Sequence: loading bar, then boot text, then straight into the site
setTimeout(() => {
    if (progressBar) progressBar.style.display = 'none';
    if (loaderText) loaderText.style.display = 'none';
    if (bootText) bootText.style.display = 'block';
}, 1500);
setTimeout(enterSite, PRELOADER_MS);

// Audio Synthesizer Functions
function playSound(type, frequency, duration, vol, pitchSweep = false) {
    if (!window.isAudioEnabled || !audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    if (pitchSweep) {
        osc.frequency.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    }

    gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

function playThock() { playSound('triangle', 300, 0.1, 0.2, true); }
window.playTick = function () { playSound('square', 1000, 0.03, 0.05, false); }
function playClick() { playSound('sine', 800, 0.05, 0.2, true); }

// Audio Toggle Button
if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
        hideSoundHint();
        window.isAudioEnabled = !window.isAudioEnabled;
        if (window.isAudioEnabled) {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
        }
        document.getElementById('sound-icon-on').style.display = window.isAudioEnabled ? 'block' : 'none';
        document.getElementById('sound-icon-off').style.display = window.isAudioEnabled ? 'none' : 'block';
        if (window.isAudioEnabled) playThock(); // confirmation blip
    });
}

// Magnetic Button Sound
document.querySelectorAll('.magnetic, a, button').forEach(btn => {
    btn.addEventListener('mouseenter', playThock);
    btn.addEventListener('mousedown', playClick);
});

// 3. Split-Text Animation
// Splits a heading into per-character spans for the reveal animation. Words are kept
// together (so long headings can wrap on narrow screens) and any <span class="highlight">
// gradient text inside the heading is preserved, with the gradient spanning the whole run.
document.querySelectorAll('.split-text').forEach(el => {
    const tokens = [];
    el.childNodes.forEach(node => {
        const isHighlight = node.nodeType === Node.ELEMENT_NODE && node.classList.contains('highlight');
        const text = (node.textContent || '').replace(/\s+/g, ' ');
        for (const ch of text) tokens.push({ ch, hl: isHighlight });
    });
    // Trim leading/trailing whitespace
    while (tokens.length && tokens[0].ch === ' ') tokens.shift();
    while (tokens.length && tokens[tokens.length - 1].ch === ' ') tokens.pop();

    const hlTotal = tokens.filter(t => t.hl).length;
    let hlIndex = 0;
    let charIndex = 0;
    let word = null;

    el.textContent = '';
    tokens.forEach(t => {
        if (t.ch === ' ') {
            el.appendChild(document.createTextNode(' '));
            word = null;
            if (t.hl) hlIndex++;
            return;
        }
        if (!word) {
            word = document.createElement('span');
            word.className = 'split-word';
            el.appendChild(word);
        }
        const span = document.createElement('span');
        span.className = 'split-char';
        span.textContent = t.ch;
        span.style.transitionDelay = `${charIndex * 0.03}s`;
        if (t.hl) {
            span.classList.add('highlight');
            span.style.backgroundSize = `${hlTotal * 100}% 100%`;
            span.style.backgroundPosition = `${hlTotal > 1 ? (hlIndex / (hlTotal - 1)) * 100 : 0}% 0`;
            hlIndex++;
        }
        word.appendChild(span);
        charIndex++;
    });
});

const splitTextObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        }
    });
}, { threshold: 0.5 });
document.querySelectorAll('.split-text').forEach(el => splitTextObserver.observe(el));

// 4. Horizontal Scroll Timeline & Progress Bar
const rolesWrapper = document.getElementById('roles');
const experienceTrack = document.querySelector('.experience-track');
const rolesProgressBar = document.getElementById('roles-progress');

if (rolesWrapper && experienceTrack) {
    // Cache layout values; reading scrollWidth/offsetTop on every scroll tick forces reflow
    let rolesTop = 0, rolesScrollable = 1, rolesMaxShift = 0;
    const measureRoles = () => {
        rolesTop = docOffsetTop(rolesWrapper);
        rolesScrollable = Math.max(1, rolesWrapper.offsetHeight - window.innerHeight);
        rolesMaxShift = Math.max(0, experienceTrack.scrollWidth - window.innerWidth + 100);
    };
    measureRoles();
    onLayoutChange(measureRoles);

    let lastRolesPercent = -1;
    onScroll(() => {
        const scrollPercent = Math.max(0, Math.min(1, (window.scrollY - rolesTop) / rolesScrollable));
        if (scrollPercent === lastRolesPercent) return;
        lastRolesPercent = scrollPercent;
        experienceTrack.style.transform = `translate3d(-${scrollPercent * rolesMaxShift}px, 0, 0)`;
        if (rolesProgressBar) {
            rolesProgressBar.style.transform = `scaleX(${scrollPercent})`;
        }
    });
}

// 5. Full-Screen Glass Menu
const menuToggle = document.getElementById('menu-toggle');
const glassMenu = document.getElementById('glass-menu');

if (menuToggle && glassMenu) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        if (glassMenu.classList.contains('hide')) {
            glassMenu.classList.remove('hide');
            glassMenu.classList.add('active');
            if (window.lenis) window.lenis.stop();
        } else {
            glassMenu.classList.add('hide');
            glassMenu.classList.remove('active');
            if (window.lenis) window.lenis.start();
        }
    });

    document.querySelectorAll('.menu-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            menuToggle.classList.remove('active');
            glassMenu.classList.add('hide');
            glassMenu.classList.remove('active');
            if (window.lenis) window.lenis.start();

            if (typeof playSound === 'function') {
                playSound('sine', 600, 0.05, 0.04);
            }

            if (href && href.startsWith('#')) {
                const target = document.querySelector(href);
                if (target) {
                    setTimeout(() => {
                        if (window.lenis) {
                            window.lenis.scrollTo(target, { offset: -30, duration: 1.2 });
                        } else {
                            target.scrollIntoView({ behavior: 'smooth' });
                        }
                    }, 120);
                }
            }
        });
    });
}

// 6. Hacker Easter Egg
const easterEgg = document.getElementById('easter-egg');
const eeInput = document.getElementById('ee-input');

document.addEventListener('keydown', (e) => {
    if (e.key === '`') {
        e.preventDefault();
        if (easterEgg.classList.contains('hide')) {
            easterEgg.classList.remove('hide');
            eeInput.focus();
        } else {
            easterEgg.classList.add('hide');
            eeInput.value = '';
            eeInput.blur();
        }
    }
});

if (eeInput) {
    eeInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const val = eeInput.value.toLowerCase().trim();

            // Clear existing mode themes first
            document.body.classList.remove('matrix-mode', 'blood-mode', 'poison-mode');

            if (val === 'master') {
                // Already cleared themes above. Also close tech modal if open.
                document.getElementById('tech-modal').classList.add('hide');
                if (typeof stopNeuralAnimation === 'function') stopNeuralAnimation();
            } else if (val === 'matrix') {
                document.body.classList.add('matrix-mode');
            } else if (val === 'blood') {
                document.body.classList.add('blood-mode');
            } else if (val === 'poison') {
                document.body.classList.add('poison-mode');
            } else if (val === 'love') {
                spawnHearts();
            } else if (val === 'tech') {
                document.getElementById('tech-modal').classList.remove('hide');
                startNeuralAnimation();
            }

            eeInput.value = '';
        }
    });
}

// Tech Modal Close Button
const closeTechModal = document.getElementById('close-tech-modal');
if (closeTechModal) {
    closeTechModal.addEventListener('click', () => {
        document.getElementById('tech-modal').classList.add('hide');
        stopNeuralAnimation();
    });
}

// Easter Egg Expansion Functions
function spawnHearts() {
    const container = document.getElementById('hearts-container');
    if (!container) return;

    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.classList.add('heart');
            heart.innerText = '❤';
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.animationDuration = (Math.random() * 2 + 2) + 's';
            heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
            container.appendChild(heart);

            setTimeout(() => {
                heart.remove();
            }, 5000);
        }, Math.random() * 2000);
    }
}

let neuralReqId = null;
function startNeuralAnimation() {
    const canvas = document.getElementById('neural-canvas');
    if (!canvas) return;
    stopNeuralAnimation(); // never run two loops at once
    const ctx = canvas.getContext('2d');

    // Resize canvas
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    const particles = [];
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00ffcc';
        ctx.strokeStyle = 'rgba(0, 255, 204, 0.2)';

        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctx.fill();

            // Draw connections
            for (let j = i + 1; j < particles.length; j++) {
                let p2 = particles[j];
                let dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
        neuralReqId = requestAnimationFrame(animate);
    }
    animate();
}

function stopNeuralAnimation() {
    if (neuralReqId) {
        cancelAnimationFrame(neuralReqId);
        neuralReqId = null;
    }
}

// ==========================================
// 2D SCROLL-DRIVEN CIRCUIT BRAIN
// ==========================================
// Performance notes: the circuit is generated once (and again only on a real resize),
// edges are pre-sorted by start time and pre-bucketed by colour, and each frame draws
// a handful of batched paths. The glow is a wider, faint stroke pass instead of a
// per-edge ctx.shadowBlur, which was the main cost of the old implementation.
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('circuit-brain');
    const section = document.getElementById('neural-core-section');
    if (!canvas || !section) return;

    const ctx = canvas.getContext('2d');
    let width = 0, height = 0, dpr = 1;

    let edges = []; // sorted by startNorm so a frame can binary-search how many have started
    let brainNodes = []; // persistent reference for ambient silhouette and live synchrotron

    const COLOR_BUCKETS = 16;
    const CYAN = [0, 255, 204];
    const PURPLE = [204, 0, 255];
    const bucketColors = [];
    for (let b = 0; b < COLOR_BUCKETS; b++) {
        const f = (b + 0.5) / COLOR_BUCKETS;
        const c = CYAN.map((v, i) => Math.round(v + f * (PURPLE[i] - v)));
        bucketColors.push(`rgb(${c[0]}, ${c[1]}, ${c[2]})`);
    }

    // Per-frame scratch buffers (reused to avoid allocations while scrolling)
    const lineBatches = Array.from({ length: COLOR_BUCKETS }, () => []);
    const nodeBatches = Array.from({ length: COLOR_BUCKETS }, () => []);
    const tipBatches = Array.from({ length: COLOR_BUCKETS }, () => []);
    const boundaryDraws = [];

    // Small seeded PRNG so the circuit looks the same after every resize
    function mulberry32(seed) {
        return function () {
            seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
            let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    function isBrain(x, y) {
        // Responsive hemisphere bounds scaled from mobile to high-res screens
        const hw = Math.min(Math.max(width * 0.22, 110), 160);
        const hh = Math.min(Math.max(height * 0.26, 140), 220);

        const taper = 1.0 + (y / hh) * 0.25; // Narrower at top (y < 0)

        // Left hemisphere
        const dxL = (x + hw * 0.5) / (hw * taper);
        const dyL = y / hh;
        const inLeft = (dxL * dxL + dyL * dyL <= 1) && x < -4;

        // Right hemisphere
        const dxR = (x - hw * 0.5) / (hw * taper);
        const dyR = y / hh;
        const inRight = (dxR * dxR + dyR * dyR <= 1) && x > 4;

        return inLeft || inRight;
    }

    function generateCircuit() {
        const rand = mulberry32(20240607);
        const nodes = [];
        const spacing = 18;
        const maxLink = spacing * 1.6; // allow horiz, vert, and diagonal

        // 1. Generate Brain Nodes (indexed by grid cell for O(1) neighbour lookup)
        brainNodes = [];
        const grid = new Map();
        let ix = 0;
        for (let x = -width / 2; x <= width / 2; x += spacing, ix++) {
            let iy = 0;
            for (let y = -height / 2; y <= height / 2; y += spacing, iy++) {
                if (isBrain(x, y)) {
                    // Slight jitter for organic circuit look
                    const jx = x + (rand() - 0.5) * spacing * 0.4;
                    const jy = y + (rand() - 0.5) * spacing * 0.4;
                    const node = { x: jx, y: jy, depth: Infinity, adj: [], id: nodes.length, isEdge: false, ix, iy };
                    nodes.push(node);
                    brainNodes.push(node);
                    grid.set(ix * 4096 + iy, node);
                }
            }
        }

        // 2. Generate Boundary Nodes (The Sources)
        const boundaryNodes = [];
        const numBounds = 20;
        for (let i = 0; i < numBounds; i++) {
            // Randomly place along left, right, top, bottom
            let bx, by;
            if (rand() > 0.5) {
                bx = rand() > 0.5 ? -width / 2 : width / 2;
                by = (rand() - 0.5) * height;
            } else {
                bx = (rand() - 0.5) * width;
                by = rand() > 0.5 ? -height / 2 : height / 2;
            }
            const node = { x: bx, y: by, depth: 0, adj: [], id: nodes.length, isEdge: true };
            nodes.push(node);
            boundaryNodes.push(node);
        }

        // 3. Connect brain nodes to nearest neighbours (only the 8 surrounding grid cells can be in range)
        for (const n1 of brainNodes) {
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    if (dx === 0 && dy === 0) continue;
                    const n2 = grid.get((n1.ix + dx) * 4096 + (n1.iy + dy));
                    if (!n2 || n2.id < n1.id) continue; // link each pair once
                    if (Math.hypot(n1.x - n2.x, n1.y - n2.y) < maxLink) {
                        n1.adj.push(n2);
                        n2.adj.push(n1);
                    }
                }
            }
        }

        // 4. Connect Boundary nodes to outer brain nodes
        boundaryNodes.forEach(bNode => {
            let closest = null;
            let minDist = Infinity;
            for (const brNode of brainNodes) {
                const d = Math.hypot(bNode.x - brNode.x, bNode.y - brNode.y);
                if (d < minDist) { minDist = d; closest = brNode; }
            }
            if (closest) {
                bNode.adj.push(closest);
                closest.adj.push(bNode);
            }
        });

        // 5. BFS to assign depths
        const queue = [...boundaryNodes];
        for (let head = 0; head < queue.length; head++) {
            const curr = queue[head];
            for (const neighbor of curr.adj) {
                const dist = Math.hypot(curr.x - neighbor.x, curr.y - neighbor.y);
                // Assign depth based on physical distance traveled
                if (curr.depth + dist < neighbor.depth) {
                    neighbor.depth = curr.depth + dist;
                    queue.push(neighbor);
                }
            }
        }

        let maxDepth = 0;
        for (const n of nodes) {
            if (n.depth !== Infinity && n.depth > maxDepth) maxDepth = n.depth;
        }
        if (maxDepth === 0) maxDepth = 1;

        // 6. Create Edges array for drawing (colour and timing precomputed once)
        edges = [];
        const edgeSet = new Set();
        nodes.forEach(n1 => {
            n1.adj.forEach(n2 => {
                const key = Math.min(n1.id, n2.id) * 65536 + Math.max(n1.id, n2.id);
                if (!edgeSet.has(key) && n1.depth !== Infinity && n2.depth !== Infinity) {
                    edgeSet.add(key);
                    const startNode = n1.depth < n2.depth ? n1 : n2;
                    const endNode = n1.depth < n2.depth ? n2 : n1;
                    const startNorm = startNode.depth / maxDepth;
                    const endNorm = endNode.depth / maxDepth;

                    // Colour gradient based on X position
                    const mixRatio = (startNode.x + width / 4) / (width / 2);
                    const clampMix = Math.max(0, Math.min(1, mixRatio));

                    edges.push({
                        x1: startNode.x, y1: startNode.y,
                        x2: endNode.x, y2: endNode.y,
                        startNorm,
                        endNorm,
                        span: Math.max(1e-6, endNorm - startNorm),
                        boundary: startNode.isEdge || endNode.isEdge,
                        bucket: Math.min(COLOR_BUCKETS - 1, Math.floor(clampMix * COLOR_BUCKETS))
                    });
                }
            });
        });
        edges.sort((a, b) => a.startNorm - b.startNorm);
    }

    // Cached section metrics: computed accurately relative to page scroll & Lenis
    let sectionTop = 0;
    let sectionScrollable = 1;

    function getScrollPos() {
        if (window.lenis && typeof window.lenis.scroll === 'number') {
            return window.lenis.scroll;
        }
        return window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
    }

    function measureSection() {
        if (!section) return;
        const rect = section.getBoundingClientRect();
        const currentScroll = getScrollPos();
        sectionTop = rect.top + currentScroll;
        sectionScrollable = Math.max(1, section.offsetHeight - window.innerHeight);
    }

    function getScrollProgress() {
        const currentScroll = getScrollPos();
        const progress = (currentScroll - sectionTop) / sectionScrollable;
        return Math.max(0, Math.min(1, progress));
    }

    const hud = document.getElementById('neural-sync-hud');
    const label = document.getElementById('neural-sync-label');
    const fill = document.getElementById('neural-sync-fill');
    const pct = document.getElementById('neural-sync-pct');

    function updateSyncHud(progress) {
        if (!hud) return;
        const percent = Math.round(progress * 100);
        if (fill) fill.style.width = `${percent}%`;
        if (pct) pct.innerText = `${percent}% SYNCHRONIZED`;

        if (percent === 0) {
            hud.classList.remove('synced');
            if (label) label.innerText = '⚡ SCROLL TO INITIATE NEURAL SYNC';
        } else if (percent < 100) {
            hud.classList.remove('synced');
            if (label) label.innerText = `🧠 SYNAPSE MAPPING ACTIVE (${percent}%)`;
        } else {
            hud.classList.add('synced');
            if (label) label.innerText = '✓ NEURAL CORE FULLY SYNCHRONIZED';
        }
    }

    function strokeBatch(batch, bucket) {
        if (!batch.length) return;
        ctx.strokeStyle = bucketColors[bucket];
        ctx.beginPath();
        for (let k = 0; k < batch.length; k += 4) {
            ctx.moveTo(batch[k], batch[k + 1]);
            ctx.lineTo(batch[k + 2], batch[k + 3]);
        }
        ctx.stroke();
    }

    function draw(progress) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, width, height);
        ctx.translate(width / 2, height / 2); // Center origin
        ctx.lineCap = 'round';

        // 0. Ambient dormant brain silhouette
        if (brainNodes.length) {
            ctx.fillStyle = 'rgba(0, 255, 204, 0.08)';
            ctx.beginPath();
            for (let i = 0; i < brainNodes.length; i++) {
                ctx.moveTo(brainNodes[i].x + 1.2, brainNodes[i].y);
                ctx.arc(brainNodes[i].x, brainNodes[i].y, 1.2, 0, Math.PI * 2);
            }
            ctx.fill();
        }

        // Edges are sorted by start time: binary-search how many have started
        let lo = 0, hi = edges.length;
        while (lo < hi) {
            const mid = (lo + hi) >> 1;
            if (edges[mid].startNorm <= progress) lo = mid + 1; else hi = mid;
        }

        for (let b = 0; b < COLOR_BUCKETS; b++) {
            lineBatches[b].length = 0;
            nodeBatches[b].length = 0;
            tipBatches[b].length = 0;
        }
        boundaryDraws.length = 0;

        for (let i = 0; i < lo; i++) {
            const e = edges[i];
            let p = (progress - e.startNorm) / e.span;
            if (p > 1) p = 1;
            const cx = e.x1 + (e.x2 - e.x1) * p;
            const cy = e.y1 + (e.y2 - e.y1) * p;

            if (e.boundary) {
                // Fade out the incoming boundary strings right after they finish connecting to the brain
                let alpha = 1;
                if (progress >= 1) {
                    alpha = 0; // nothing left hanging once the brain is complete
                } else if (progress > e.endNorm) {
                    // Fades from 1 to 0 over the next 15% of scroll (or less, if the edge ends late)
                    const fade = Math.min(0.15, 1 - e.endNorm);
                    alpha = Math.max(0, 1 - ((progress - e.endNorm) / fade));
                }
                if (alpha > 0) boundaryDraws.push(e, p, alpha, cx, cy);
                continue;
            }

            lineBatches[e.bucket].push(e.x1, e.y1, cx, cy);
            if (p < 1) {
                tipBatches[e.bucket].push(cx, cy);
            } else {
                nodeBatches[e.bucket].push(e.x2, e.y2);
            }
        }

        // Pass 1: faint wide strokes = glow
        ctx.lineWidth = 6;
        ctx.globalAlpha = 0.2;
        for (let b = 0; b < COLOR_BUCKETS; b++) strokeBatch(lineBatches[b], b);
        for (let k = 0; k < boundaryDraws.length; k += 5) {
            const e = boundaryDraws[k];
            ctx.globalAlpha = 0.2 * boundaryDraws[k + 2];
            strokeBatch([e.x1, e.y1, boundaryDraws[k + 3], boundaryDraws[k + 4]], e.bucket);
        }

        // Pass 2: crisp core lines
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 1;
        for (let b = 0; b < COLOR_BUCKETS; b++) strokeBatch(lineBatches[b], b);
        for (let k = 0; k < boundaryDraws.length; k += 5) {
            const e = boundaryDraws[k];
            ctx.globalAlpha = boundaryDraws[k + 2];
            strokeBatch([e.x1, e.y1, boundaryDraws[k + 3], boundaryDraws[k + 4]], e.bucket);
        }

        // End nodes (fully drawn edges) and glowing tips (edges still drawing)
        ctx.globalAlpha = 1;
        for (let b = 0; b < COLOR_BUCKETS; b++) {
            const nodesB = nodeBatches[b];
            if (nodesB.length) {
                ctx.fillStyle = bucketColors[b];
                ctx.beginPath();
                for (let k = 0; k < nodesB.length; k += 2) {
                    ctx.moveTo(nodesB[k] + 1.5, nodesB[k + 1]);
                    ctx.arc(nodesB[k], nodesB[k + 1], 1.5, 0, Math.PI * 2);
                }
                ctx.fill();
            }
            const tipsB = tipBatches[b];
            if (tipsB.length) {
                ctx.globalAlpha = 0.35;
                ctx.fillStyle = bucketColors[b];
                ctx.beginPath();
                for (let k = 0; k < tipsB.length; k += 2) {
                    ctx.moveTo(tipsB[k] + 5, tipsB[k + 1]);
                    ctx.arc(tipsB[k], tipsB[k + 1], 5, 0, Math.PI * 2);
                }
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        }
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        for (let b = 0; b < COLOR_BUCKETS; b++) {
            const tipsB = tipBatches[b];
            for (let k = 0; k < tipsB.length; k += 2) {
                ctx.moveTo(tipsB[k] + 2, tipsB[k + 1]);
                ctx.arc(tipsB[k], tipsB[k + 1], 2, 0, Math.PI * 2);
            }
        }
        for (let k = 0; k < boundaryDraws.length; k += 5) {
            const p = boundaryDraws[k + 1];
            if (p > 0 && p < 1) {
                ctx.moveTo(boundaryDraws[k + 3] + 2, boundaryDraws[k + 4]);
                ctx.arc(boundaryDraws[k + 3], boundaryDraws[k + 4], 2, 0, Math.PI * 2);
            }
        }
        ctx.fill();
    }

    let lastProgress = -1;

    // (Re)build the canvas and circuit for the current viewport
    let builtWidth = 0, builtHeight = 0;
    function rebuild() {
        width = window.innerWidth;
        height = window.innerHeight;
        builtWidth = width;
        builtHeight = height;
        dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        generateCircuit();
        measureSection();
        lastProgress = getScrollProgress();
        draw(lastProgress);
        updateSyncHud(lastProgress);
    }

    // Debounced, and ignores small height-only changes (mobile address bar showing/hiding while scrolling)
    let resizeTimer = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth !== builtWidth || Math.abs(window.innerHeight - builtHeight) > 150) {
                rebuild();
            }
        }, 150);
    });

    onLayoutChange(measureSection);

    function updateBrainOnScroll() {
        const progress = getScrollProgress();
        const currentScroll = getScrollPos();
        const inSection = (currentScroll + window.innerHeight >= sectionTop - 150) && (currentScroll <= sectionTop + section.offsetHeight + 150);

        if (inSection || Math.abs(progress - lastProgress) > 0.0005) {
            draw(progress);
            lastProgress = progress;
            updateSyncHud(progress);
        }
    }

    onScroll(updateBrainOnScroll);
    if (window.lenis) {
        window.lenis.on('scroll', updateBrainOnScroll);
    }

    // Init
    rebuild();
});

// ==========================================
// ROLE & PROJECT MODAL SYSTEM (UNIFIED)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const roleCards = document.querySelectorAll('.role-card');
    const roleModal = document.getElementById('role-modal');
    const closeRoleModalBtn = document.getElementById('close-role-modal');
    
    const modalImg = document.getElementById('role-modal-img');
    const modalTitle = document.getElementById('role-modal-title');
    const modalSubtitle = document.getElementById('role-modal-subtitle');
    const modalDesc = document.getElementById('role-modal-desc');
    const modalTechStack = document.getElementById('role-modal-techstack');
    const modalTechStackContainer = document.getElementById('role-modal-techstack-container');

    if (roleModal && closeRoleModalBtn) {
        roleCards.forEach(card => {
            card.addEventListener('click', () => {
                const title = card.getAttribute('data-title');
                const subtitle = card.getAttribute('data-subtitle');
                const descElement = card.querySelector('.role-desc');
                const desc = card.getAttribute('data-desc') || (descElement ? descElement.innerText : '');
                const imagePath = card.getAttribute('data-image');
                const techStack = card.getAttribute('data-techstack');

                modalTitle.innerText = title;
                modalSubtitle.innerText = subtitle;
                modalDesc.innerText = desc;
                
                if (techStack) {
                    modalTechStack.innerText = techStack;
                    modalTechStackContainer.style.display = 'block';
                } else {
                    modalTechStackContainer.style.display = 'none';
                }

                const demoUrl = card.getAttribute('data-demo');
                const githubUrl = card.getAttribute('data-github');
                const demoBtn = document.getElementById('role-modal-demo-btn');
                const githubBtn = document.getElementById('role-modal-github-btn');

                if (demoBtn) {
                    if (demoUrl) {
                        demoBtn.href = demoUrl;
                        demoBtn.style.display = 'inline-flex';
                    } else {
                        demoBtn.style.display = 'none';
                    }
                }

                if (githubBtn) {
                    if (githubUrl) {
                        githubBtn.href = githubUrl;
                        githubBtn.style.display = 'inline-flex';
                    } else {
                        githubBtn.style.display = 'none';
                    }
                }
                
                // Projects/roles without an image (or whose image fails to load) simply show no banner
                const imageWrap = modalImg.parentElement;
                if (imagePath) {
                    imageWrap.style.display = '';
                    modalImg.onerror = () => { imageWrap.style.display = 'none'; };
                    modalImg.src = imagePath;
                } else {
                    imageWrap.style.display = 'none';
                    modalImg.removeAttribute('src');
                }

                roleModal.classList.remove('hide');
                // Trigger reflow
                void roleModal.offsetWidth;
                roleModal.classList.add('active');
                
                // Disable scroll to fix background scrolling bug
                if (window.lenis) {
                    window.lenis.stop();
                } else {
                    document.body.style.overflow = 'hidden';
                }
                
                // Play click sound if audio ctx is alive
                if (window.audioCtx && window.audioCtx.state === 'running') {
                    window.playClickSound();
                }
            });
        });

        const closeRoleModal = () => {
            roleModal.classList.remove('active');
            
            // Enable scroll back
            if (window.lenis) {
                window.lenis.start();
            } else {
                document.body.style.overflow = '';
            }

            setTimeout(() => {
                roleModal.classList.add('hide');
            }, 400); // match CSS transition
            if (window.audioCtx && window.audioCtx.state === 'running') {
                window.playClickSound();
            }
        };

        closeRoleModalBtn.addEventListener('click', closeRoleModal);
        
        // Close on clicking backdrop
        roleModal.addEventListener('click', (e) => {
            if (e.target === roleModal) {
                closeRoleModal();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && roleModal.classList.contains('active')) {
                closeRoleModal();
            }
        });
    }
});


// ==========================================
// LIVE GITHUB ACTIVITY STRIP
// Contribution graph (jogruber.de public mirror of the profile calendar; GitHub's own API
// needs a token for it) + recent commits (GitHub search API, no token needed). Results are
// cached in localStorage so a visitor doesn't burn GitHub's anonymous rate limit.
// ==========================================
(function initGithubStrip() {
    const section = document.getElementById('github');
    if (!section) return;

    const USER = section.dataset.githubUser;
    const CACHE_TTL = 30 * 60 * 1000;
    const GRAPH_URL = `https://github-contributions-api.jogruber.de/v4/${USER}?y=last`;
    const COMMITS_URL = `https://api.github.com/search/commits?q=author:${USER}&sort=author-date&order=desc&per_page=5`;

    const elGraph = document.getElementById('gh-graph');
    const elMonths = document.getElementById('gh-months');
    const elScroll = document.getElementById('gh-graph-scroll');
    const elStats = document.getElementById('gh-stats');
    const elCommits = document.getElementById('gh-commits');
    const elStatus = document.getElementById('gh-status');
    const elTip = document.getElementById('gh-tip');
    // position: fixed breaks inside the transformed (.fade-in) section, so mount the tooltip on <body>
    document.body.appendChild(elTip);

    // --- tiny cache helpers (storage can throw in private mode) ---
    function readCache(key) {
        try {
            const raw = JSON.parse(localStorage.getItem(key));
            return raw && raw.t ? raw : null;
        } catch (e) { return null; }
    }
    function writeCache(key, data) {
        try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), data })); } catch (e) { /* ignore */ }
    }
    async function cachedFetch(key, url, parse) {
        const cached = readCache(key);
        if (cached && Date.now() - cached.t < CACHE_TTL) return cached.data;
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = parse(await res.json());
            writeCache(key, data);
            return data;
        } catch (err) {
            if (cached) return cached.data; // stale beats nothing
            throw err;
        }
    }

    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const parseDay = (iso) => new Date(`${iso}T00:00:00Z`);
    const fmtDay = (iso) => parseDay(iso).toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC'
    });

    // --- contribution graph ---
    function renderGraph(days) {
        elGraph.classList.remove('gh-loading');
        elGraph.textContent = '';
        elMonths.textContent = '';
        if (!days.length) return;

        // Rows are Sun..Sat, so pad the first column with empty cells up to the first weekday
        const pad = parseDay(days[0].date).getUTCDay();
        const frag = document.createDocumentFragment();
        for (let i = 0; i < pad; i++) {
            const empty = document.createElement('span');
            empty.className = 'gh-cell gh-empty';
            frag.appendChild(empty);
        }
        days.forEach(d => {
            const cell = document.createElement('span');
            cell.className = 'gh-cell';
            cell.dataset.level = d.level;
            cell.dataset.date = d.date;
            cell.dataset.count = d.count;
            frag.appendChild(cell);
        });
        elGraph.appendChild(frag);

        // Month labels above the first column of each new month
        const colW = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gh-cell')) +
            parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gh-gap'));
        const cols = Math.ceil((pad + days.length) / 7);
        elMonths.style.width = `${cols * colW}px`;
        let lastMonth = -1, lastCol = -10;
        for (let c = 0; c < cols; c++) {
            const dayIndex = Math.max(0, c * 7 - pad);
            const month = parseDay(days[dayIndex].date).getUTCMonth();
            if (month !== lastMonth && c - lastCol >= 3) {
                const label = document.createElement('span');
                label.textContent = MONTHS[month];
                label.style.left = `${c * colW}px`;
                elMonths.appendChild(label);
                lastCol = c;
            }
            lastMonth = month;
        }

        elGraph.setAttribute('aria-label',
            `GitHub contribution graph, ${days.reduce((n, d) => n + d.count, 0)} contributions in the last year`);
        elScroll.scrollLeft = elScroll.scrollWidth; // most recent weeks are on the right
    }

    function renderStats(days) {
        const total = days.reduce((n, d) => n + d.count, 0);

        // Longest streak, and current streak (counted back from today; an empty "today" doesn't break it)
        let longest = 0, run = 0;
        days.forEach(d => { run = d.count > 0 ? run + 1 : 0; longest = Math.max(longest, run); });
        let current = 0, i = days.length - 1;
        if (i >= 0 && days[i].count === 0) i--;
        for (; i >= 0 && days[i].count > 0; i--) current++;

        elStats.textContent = '';
        [[total, 'contributions this year'], [current, 'day streak'], [longest, 'longest streak']].forEach(([n, label]) => {
            const item = document.createElement('span');
            const strong = document.createElement('strong');
            strong.textContent = n;
            item.append(strong, ` ${label}`);
            elStats.appendChild(item);
        });
    }

    // --- recent commits ---
    const rtf = typeof Intl !== 'undefined' && Intl.RelativeTimeFormat ? new Intl.RelativeTimeFormat('en', { numeric: 'auto' }) : null;
    function timeAgo(iso) {
        const secs = (new Date(iso).getTime() - Date.now()) / 1000;
        const steps = [['year', 31536000], ['month', 2592000], ['day', 86400], ['hour', 3600], ['minute', 60]];
        for (const [unit, size] of steps) {
            if (Math.abs(secs) >= size) return rtf ? rtf.format(Math.round(secs / size), unit) : `${Math.round(-secs / size)} ${unit}s ago`;
        }
        return 'just now';
    }

    function renderCommits(commits) {
        elCommits.textContent = '';
        commits.forEach(c => {
            const li = document.createElement('li');
            li.className = 'gh-commit';

            const dot = document.createElement('span');
            dot.className = 'gh-commit-dot';

            const main = document.createElement('div');
            main.className = 'gh-commit-main';

            const msg = document.createElement('a');
            msg.className = 'gh-commit-msg';
            msg.href = c.url;
            msg.target = '_blank';
            msg.rel = 'noopener';
            msg.textContent = c.message;
            msg.title = c.message;

            const meta = document.createElement('span');
            meta.className = 'gh-commit-meta';
            const repo = document.createElement('a');
            repo.href = c.repoUrl;
            repo.target = '_blank';
            repo.rel = 'noopener';
            repo.textContent = c.repo.split('/').pop();
            repo.title = c.repo;
            const sha = document.createElement('a');
            sha.href = c.url;
            sha.target = '_blank';
            sha.rel = 'noopener';
            sha.textContent = c.sha.slice(0, 7);
            const time = document.createElement('time');
            time.dateTime = c.date;
            time.textContent = timeAgo(c.date);
            time.title = new Date(c.date).toLocaleString();
            meta.append(repo, ' · ', sha, ' · ', time);

            main.append(msg, meta);
            li.append(dot, main);
            elCommits.appendChild(li);
        });
    }

    // --- tooltip on the graph (hover on desktop, tap on touch) ---
    function showTip(e) {
        const cell = e.target.closest('.gh-cell[data-date]');
        if (!cell) { elTip.classList.remove('show'); return; }
        const n = Number(cell.dataset.count);
        elTip.textContent = `${n === 0 ? 'No' : n} contribution${n === 1 ? '' : 's'} on ${fmtDay(cell.dataset.date)}`;
        const r = cell.getBoundingClientRect();
        elTip.style.left = `${Math.min(window.innerWidth - 16, Math.max(16, r.left + r.width / 2))}px`;
        elTip.style.top = `${r.top - 38}px`;
        elTip.style.transform = 'translateX(-50%)';
        elTip.classList.add('show');
    }
    elGraph.addEventListener('mouseover', showTip);
    elGraph.addEventListener('click', showTip);
    elGraph.addEventListener('mouseleave', () => elTip.classList.remove('show'));
    elScroll.addEventListener('scroll', () => elTip.classList.remove('show'), { passive: true });

    // --- load (lazily, shortly before the section scrolls into view) ---
    let started = false;
    async function load() {
        if (started) return;
        started = true;
        elGraph.classList.add('gh-loading');

        const [graph, commits] = await Promise.allSettled([
            cachedFetch('gh-graph-v1', GRAPH_URL, json => json.contributions.map(d => ({ date: d.date, count: d.count, level: d.level }))),
            cachedFetch('gh-commits-v1', COMMITS_URL, json => json.items.map(i => ({
                message: i.commit.message.split('\n')[0],
                date: i.commit.author.date,
                sha: i.sha,
                url: i.html_url,
                repo: i.repository.full_name,
                repoUrl: i.repository.html_url
            })))
        ]);

        const problems = [];
        if (graph.status === 'fulfilled') {
            renderGraph(graph.value);
            renderStats(graph.value);
        } else {
            elGraph.classList.remove('gh-loading');
            problems.push('the contribution graph');
        }
        if (commits.status === 'fulfilled' && commits.value.length) {
            renderCommits(commits.value);
        } else if (commits.status === 'rejected') {
            problems.push('recent commits');
        }
        elStatus.textContent = problems.length
            ? `Couldn't load ${problems.join(' and ')} right now. Try the GitHub profile link below.`
            : '';
    }

    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            if (entries.some(e => e.isIntersecting)) {
                io.disconnect();
                load();
            }
        }, { rootMargin: '600px 0px' });
        io.observe(section);
    } else {
        load();
    }
})();

// ==========================================
// "AVAILABLE FOR NEW OPPORTUNITIES" POPOVER
// ==========================================
(function initOpenPopover() {
    const badge = document.getElementById('open-badge');
    const pop = document.getElementById('open-popover');
    if (!badge || !pop) return;

    function setOpen(open) {
        pop.classList.toggle('open', open);
        badge.setAttribute('aria-expanded', String(open));
    }

    badge.addEventListener('click', (e) => {
        e.stopPropagation();
        setOpen(!pop.classList.contains('open'));
    });

    // Close on outside click, Escape, or after using the link inside
    document.addEventListener('click', (e) => {
        if (pop.classList.contains('open') && !pop.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && pop.classList.contains('open')) {
            setOpen(false);
            badge.focus();
        }
    });
    pop.addEventListener('click', (e) => {
        if (e.target.closest('a')) setOpen(false);
    });
})();


// ==========================================
// FLASK CONTACT FORM SUBMISSION
// ==========================================
(function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerText = 'TRANSMITTING...';

        const formData = new FormData(contactForm);
        const payload = Object.fromEntries(formData.entries());

        try {
            const resp = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const res = await resp.json();
            if (formFeedback) {
                formFeedback.style.display = 'block';
                if (resp.ok) {
                    formFeedback.style.background = 'rgba(16, 185, 129, 0.15)';
                    formFeedback.style.color = '#10b981';
                    formFeedback.style.border = '1px solid #10b981';
                    formFeedback.innerText = res.message || 'Message transmitted successfully!';
                    contactForm.reset();
                } else {
                    formFeedback.style.background = 'rgba(239, 68, 68, 0.15)';
                    formFeedback.style.color = '#ef4444';
                    formFeedback.style.border = '1px solid #ef4444';
                    formFeedback.innerText = res.message || 'Error transmitting message.';
                }
            }
        } catch (err) {
            if (formFeedback) {
                formFeedback.style.display = 'block';
                formFeedback.style.background = 'rgba(239, 68, 68, 0.15)';
                formFeedback.style.color = '#ef4444';
                formFeedback.style.border = '1px solid #ef4444';
                formFeedback.innerText = 'Network error. Please try again or email directly.';
            }
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    });
})();


// ==========================================================================
// NEW FEATURE 1: CYBER TOAST NOTIFICATION SYSTEM
// ==========================================================================
function showCyberToast(msg, duration = 3000) {
    let toast = document.getElementById('cyber-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'cyber-toast';
        toast.className = 'cyber-toast hide';
        document.body.appendChild(toast);
    }
    toast.innerHTML = msg;
    toast.classList.remove('hide');
    if (typeof playSound === 'function') {
        playSound('sine', 880, 0.08, 0.04);
    }
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.add('hide');
    }, duration);
}


// ==========================================================================
// NEW FEATURE 2: COMMAND PALETTE (Ctrl+K / Cmd+K)
// ==========================================================================
(function initCommandPalette() {
    const modal = document.getElementById('cmd-palette-modal');
    const input = document.getElementById('cmd-palette-input');
    const list = document.getElementById('cmd-palette-list');
    const backdrop = document.getElementById('cmd-palette-backdrop');
    const triggerBtn = document.getElementById('cmd-palette-btn');

    if (!modal || !input || !list) return;

    const COMMANDS = [
        // Navigation Group
        { group: 'Navigation', icon: '🏠', title: 'Home / Hero', subtitle: 'Back to top overview', action: () => scrollToSection('#hero') },
        { group: 'Navigation', icon: '👤', title: 'About Naman', subtitle: 'Bio, philosophy & vision', action: () => scrollToSection('#about') },
        { group: 'Navigation', icon: '🧠', title: 'Neural Core Brain', subtitle: 'Interactive 3D synaptic network', action: () => scrollToSection('#neural-core-section') },
        { group: 'Navigation', icon: '💼', title: 'Engineering Roles', subtitle: 'Full-Stack, AI, Systems & Math', action: () => scrollToSection('#roles') },
        { group: 'Navigation', icon: '⚡', title: 'Experience & Internships', subtitle: 'Decode Labs & FlyRank AI', action: () => scrollToSection('#experience') },
        { group: 'Navigation', icon: '🚀', title: 'Featured Projects', subtitle: 'Clix Hub, Namsify, CleanUp', action: () => scrollToSection('#projects') },
        { group: 'Navigation', icon: '📐', title: 'Calculus Optimizer Sandbox', subtitle: 'Live differential material modeling', action: () => scrollToSection('#optimizer') },
        { group: 'Navigation', icon: '🛠️', title: 'Technical Skills', subtitle: 'Languages, frameworks & cloud', action: () => scrollToSection('#skills') },
        { group: 'Navigation', icon: '🎓', title: 'Education & Honors', subtitle: 'MITS Gwalior B.Tech & Hackathons', action: () => scrollToSection('#education') },
        { group: 'Navigation', icon: '🐙', title: 'Live GitHub Activity', subtitle: 'Real-time commits & contributions', action: () => scrollToSection('#github') },
        { group: 'Navigation', icon: '✉️', title: 'Direct Transmission Form', subtitle: 'Send a message directly to Naman', action: () => scrollToSection('#contact') },

        // Quick Actions Group
        { group: 'Quick Actions', icon: '🤖', title: 'Ask Naman\'s AI Twin', subtitle: 'Open conversational assistant drawer', badge: 'AI', action: () => openAiChat() },
        { group: 'Quick Actions', icon: '🌓', title: 'Toggle Theme', subtitle: 'Switch between Dark Cyber & Light Mode', badge: 'Theme', action: () => toggleTheme() },
        { group: 'Quick Actions', icon: '🔊', title: 'Toggle Web Audio Synth', subtitle: 'Turn procedural sound FX on/off', badge: 'Sound', action: () => toggleSound() },
        { group: 'Quick Actions', icon: '📋', title: 'Copy Email to Clipboard', subtitle: 'namanlahariya@gmail.com', badge: 'Copy', action: () => copyEmail() },
        { group: 'Quick Actions', icon: '📄', title: 'Open Resume', subtitle: 'View verified credentials & resume', badge: 'Resume', action: () => window.open(window.__NL_RESUME_URL || 'https://drive.google.com/drive/folders/1T6Hf1ZuXB6IPZwF8xeG9zIZK1NUJWC7V', '_blank') },
        { group: 'Quick Actions', icon: '🐙', title: 'Open GitHub Profile', subtitle: 'github.com/namanartist', badge: 'External', action: () => window.open('https://github.com/namanartist', '_blank') },
        { group: 'Quick Actions', icon: '💻', title: 'Root Terminal Console', subtitle: 'Open developer Easter egg console (`)', badge: 'Terminal', action: () => openEasterEgg() }
    ];

    let activeIndex = 0;
    let filteredCommands = [...COMMANDS];

    function scrollToSection(selector) {
        closePalette();
        const el = document.querySelector(selector);
        if (el) {
            if (window.lenis) {
                window.lenis.scrollTo(el, { offset: -30, duration: 1.2 });
            } else {
                el.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    function openAiChat() {
        closePalette();
        const drawer = document.getElementById('ai-chat-drawer');
        if (drawer) {
            drawer.classList.remove('hide');
            const inp = document.getElementById('ai-chat-input');
            if (inp) inp.focus();
        }
    }

    function toggleTheme() {
        closePalette();
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) themeBtn.click();
        const isLight = document.documentElement.classList.contains('light-theme');
        showCyberToast(isLight ? '☀️ Light Cyber Theme Enabled' : '🌙 Dark Cyber Core Enabled');
    }

    function toggleSound() {
        closePalette();
        const audioBtn = document.getElementById('audio-toggle');
        if (audioBtn) audioBtn.click();
        showCyberToast(window.isAudioEnabled ? '🔊 Procedural Audio FX Online' : '🔇 Audio FX Muted');
    }

    function copyEmail() {
        closePalette();
        navigator.clipboard.writeText('namanlahariya@gmail.com').then(() => {
            showCyberToast('📋 Email copied to clipboard: namanlahariya@gmail.com');
        }).catch(() => {
            showCyberToast('✉️ namanlahariya@gmail.com');
        });
    }

    function openEasterEgg() {
        closePalette();
        const ee = document.getElementById('easter-egg');
        if (ee) {
            ee.classList.remove('hide');
            const inp = document.getElementById('ee-input');
            if (inp) inp.focus();
        }
    }

    function renderList() {
        list.innerHTML = '';
        if (filteredCommands.length === 0) {
            list.innerHTML = '<div style="padding: 1.5rem; text-align: center; color: var(--text-secondary); font-family: var(--font-mono); font-size: 0.85rem;">No matching commands or sections found.</div>';
            return;
        }

        let currentGroup = '';
        filteredCommands.forEach((cmd, idx) => {
            if (cmd.group !== currentGroup) {
                currentGroup = cmd.group;
                const groupHeader = document.createElement('div');
                groupHeader.className = 'cmd-group-label';
                groupHeader.textContent = currentGroup;
                list.appendChild(groupHeader);
            }

            const item = document.createElement('div');
            item.className = `cmd-item ${idx === activeIndex ? 'active' : ''}`;
            item.innerHTML = `
                <div class="cmd-item-left">
                    <span style="font-size: 1.1rem;">${cmd.icon}</span>
                    <div>
                        <div style="font-weight: 500;">${cmd.title}</div>
                        <div style="font-size: 0.78rem; color: var(--text-secondary);">${cmd.subtitle}</div>
                    </div>
                </div>
                ${cmd.badge ? `<span class="cmd-item-badge">${cmd.badge}</span>` : ''}
            `;

            item.addEventListener('click', () => {
                if (typeof playSound === 'function') playSound('sine', 700, 0.05, 0.05);
                cmd.action();
            });

            item.addEventListener('mouseenter', () => {
                activeIndex = idx;
                updateActiveStyles();
            });

            list.appendChild(item);
        });

        // Ensure active item is visible in scroll
        const activeEl = list.children[activeIndex];
        if (activeEl) {
            activeEl.scrollIntoView({ block: 'nearest' });
        }
    }

    function updateActiveStyles() {
        const items = list.querySelectorAll('.cmd-item');
        items.forEach((it, idx) => {
            it.classList.toggle('active', idx === activeIndex);
        });
    }

    function filterCommands(query) {
        const q = query.trim().toLowerCase();
        if (!q) {
            filteredCommands = [...COMMANDS];
        } else {
            filteredCommands = COMMANDS.filter(cmd => 
                cmd.title.toLowerCase().includes(q) ||
                cmd.subtitle.toLowerCase().includes(q) ||
                cmd.group.toLowerCase().includes(q)
            );
        }
        activeIndex = 0;
        renderList();
    }

    function openPalette() {
        modal.classList.remove('hide');
        input.value = '';
        filterCommands('');
        input.focus();
        if (typeof playSound === 'function') playSound('triangle', 520, 0.1, 0.05);
    }

    function closePalette() {
        modal.classList.add('hide');
    }

    // Keyboard shortcut (Ctrl+K or Cmd+K)
    window.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
            e.preventDefault();
            if (modal.classList.contains('hide')) {
                openPalette();
            } else {
                closePalette();
            }
        } else if (e.key === 'Escape' && !modal.classList.contains('hide')) {
            closePalette();
        }
    });

    if (triggerBtn) {
        triggerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openPalette();
        });
    }

    const floatTriggerBtn = document.getElementById('cmd-palette-float-btn');
    if (floatTriggerBtn) {
        floatTriggerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openPalette();
        });
    }

    if (backdrop) {
        backdrop.addEventListener('click', closePalette);
    }

    input.addEventListener('input', (e) => {
        filterCommands(e.target.value);
    });

    input.addEventListener('keydown', (e) => {
        if (filteredCommands.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            activeIndex = (activeIndex + 1) % filteredCommands.length;
            updateActiveStyles();
            const items = list.querySelectorAll('.cmd-item');
            if (items[activeIndex]) items[activeIndex].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeIndex = (activeIndex - 1 + filteredCommands.length) % filteredCommands.length;
            updateActiveStyles();
            const items = list.querySelectorAll('.cmd-item');
            if (items[activeIndex]) items[activeIndex].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredCommands[activeIndex]) {
                filteredCommands[activeIndex].action();
            }
        }
    });
})();


// ==========================================================================
// NEW FEATURE 3: "ASK NAMAN'S AI TWIN" CHAT DRAWER
// ==========================================================================
(function initAiTwinChat() {
    const chatBtn = document.getElementById('ai-chat-btn');
    const drawer = document.getElementById('ai-chat-drawer');
    const closeBtn = document.getElementById('close-ai-chat');
    const form = document.getElementById('ai-chat-form');
    const input = document.getElementById('ai-chat-input');
    const messagesContainer = document.getElementById('ai-chat-messages');
    const chipsContainer = document.getElementById('ai-chips-container');

    if (!chatBtn || !drawer || !form || !input) return;

    function openChat() {
        drawer.classList.remove('hide');
        input.focus();
        if (typeof playSound === 'function') playSound('sine', 600, 0.08, 0.05);
    }

    function closeChat() {
        drawer.classList.add('hide');
    }

    chatBtn.addEventListener('click', () => {
        if (drawer.classList.contains('hide')) {
            openChat();
        } else {
            closeChat();
        }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeChat);

    function formatTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function appendMessage(sender, text, engine = null, latency = null) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `ai-msg ai-msg-${sender}`;

        let formatted = text;

        // Render code blocks with syntax styling
        formatted = formatted.replace(/```([a-zA-Z0-9]*)\n([\s\S]*?)```/g, (match, lang, code) => {
            const cleanCode = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return `<div style="margin: 0.6rem 0; background: rgba(0,0,0,0.65); border: 1px solid var(--accent-primary); border-radius: 8px; padding: 0.8rem 1rem; overflow-x: auto; font-family: var(--font-mono); font-size: 0.8rem; color: #a5f3fc; line-height: 1.45;"><div style="font-size: 0.65rem; color: var(--accent-primary); text-transform: uppercase; margin-bottom: 4px; border-bottom: 1px dashed rgba(255,255,255,0.1); padding-bottom: 2px;">${lang || 'CODE'}</div><pre style="margin: 0; white-space: pre;">${cleanCode}</pre></div>`;
        });

        // Inline backticks
        formatted = formatted.replace(/`([^`]+)`/g, '<code style="background: rgba(255,255,255,0.08); padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono); font-size: 0.82rem; color: var(--accent-primary);">$1</code>');

        // Bold
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Markdown links
        formatted = formatted.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color: var(--accent-primary); text-decoration: underline;">$1</a>');

        // Line breaks (for prose)
        formatted = formatted.replace(/\n/g, '<br>');

        const latencyText = latency ? ` &bull; ${latency}ms` : '';
        const engineTag = (sender === 'bot' && engine) 
            ? `<div style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--accent-primary); margin-bottom: 4px; opacity: 0.85;">⚡ ${engine}${latencyText}</div>` 
            : '';

        msgDiv.innerHTML = `
            ${engineTag}
            <div class="ai-msg-bubble">${formatted}</div>
            <span class="ai-msg-time">${formatTime()}</span>
        `;
        messagesContainer.appendChild(msgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function showTypingIndicator() {
        const ind = document.createElement('div');
        ind.id = 'ai-typing-indicator';
        ind.className = 'ai-msg ai-msg-bot';
        ind.innerHTML = `
            <div class="ai-msg-bubble" style="display: flex; gap: 4px; align-items: center; padding: 10px 16px;">
                <span class="ai-fab-pulse" style="width: 6px; height: 6px;"></span>
                <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--accent-primary);">NL-AI CORE Computing...</span>
            </div>
        `;
        messagesContainer.appendChild(ind);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return ind;
    }

    function updateChips(chips) {
        if (!chipsContainer || !chips || chips.length === 0) return;
        chipsContainer.innerHTML = '';
        chips.forEach(chipText => {
            const btn = document.createElement('button');
            btn.className = 'ai-chip';
            btn.setAttribute('data-query', chipText);
            btn.textContent = chipText;
            btn.addEventListener('click', () => {
                input.value = chipText;
                form.dispatchEvent(new Event('submit'));
            });
            chipsContainer.appendChild(btn);
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = input.value.trim();
        if (!query) return;

        appendMessage('user', query);
        input.value = '';
        if (typeof playSound === 'function') playSound('triangle', 440, 0.05, 0.04);

        const typing = showTypingIndicator();

        try {
            const resp = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: query })
            });
            const data = await resp.json();
            if (typing && typing.parentNode) typing.remove();

            if (data.reply) {
                appendMessage('bot', data.reply, data.engine, data.latency_ms);
                if (typeof playSound === 'function') playSound('sine', 800, 0.1, 0.05);
            }
            if (data.engine) {
                const modelBadge = document.getElementById('ai-model-badge');
                if (modelBadge) {
                    modelBadge.innerHTML = `<i data-lucide="cpu" style="width: 11px; height: 11px;"></i> ${data.engine}`;
                    if (window.lucide) lucide.createIcons();
                }
            }
            if (data.chips) {
                updateChips(data.chips);
            }
        } catch (err) {
            if (typing && typing.parentNode) typing.remove();
            appendMessage('bot', '⚠️ Core uplink interrupted. You can email Naman directly at: **namanlahariya@gmail.com**.');
        }
    });

    // Wire up initial suggestion chips
    if (chipsContainer) {
        chipsContainer.querySelectorAll('.ai-chip').forEach(btn => {
            btn.addEventListener('click', () => {
                input.value = btn.getAttribute('data-query') || btn.textContent;
                form.dispatchEvent(new Event('submit'));
            });
        });
    }
})();


// ==========================================================================
// NEW FEATURE 4: APPLIED CALCULUS TANK OPTIMIZER
// ==========================================================================
(function initCalculusTankOptimizer() {
    const volumeSlider = document.getElementById('volume-slider');
    const radiusSlider = document.getElementById('radius-slider');
    const volumeVal = document.getElementById('volume-val');
    const radiusVal = document.getElementById('radius-val');
    const snapBtn = document.getElementById('snap-optimal-btn');

    const optAreaMetric = document.getElementById('metric-optimal-area');
    const curAreaMetric = document.getElementById('metric-current-area');
    const heightMetric = document.getElementById('metric-height');
    const excessMetric = document.getElementById('metric-excess');
    const ratioTag = document.getElementById('aspect-ratio-tag');

    const curveCanvas = document.getElementById('calc-curve-canvas');
    const modelCanvas = document.getElementById('calc-3d-canvas');

    if (!volumeSlider || !radiusSlider || !curveCanvas || !modelCanvas) return;

    const ctxCurve = curveCanvas.getContext('2d');
    const ctxModel = modelCanvas.getContext('2d');

    let currentVolume = parseFloat(volumeSlider.value);
    let currentRadius = parseFloat(radiusSlider.value);
    let rotationAngle = 0;

    function calculateOptimizer(V, r) {
        // Optimal minimum: r* = (V / (2*pi))^(1/3)
        const optimal_r = Math.cbrt(V / (2.0 * Math.PI));
        const optimal_h = V / (Math.PI * Math.pow(optimal_r, 2)); // exactly 2 * optimal_r
        const optimal_A = 2.0 * Math.PI * Math.pow(optimal_r, 2) + (2.0 * V) / optimal_r;

        // Current user test configuration
        const current_h = V / (Math.PI * Math.pow(r, 2));
        const current_A = 2.0 * Math.PI * Math.pow(r, 2) + (2.0 * V) / r;
        const excess_pct = Math.max(0, ((current_A - optimal_A) / optimal_A) * 100.0);
        const aspect_ratio = current_h / (2.0 * r);

        return {
            optimal_r,
            optimal_h,
            optimal_A,
            current_h,
            current_A,
            excess_pct,
            aspect_ratio
        };
    }

    function updateUI() {
        currentVolume = parseFloat(volumeSlider.value);
        currentRadius = parseFloat(radiusSlider.value);

        const data = calculateOptimizer(currentVolume, currentRadius);

        volumeVal.textContent = `${Math.round(currentVolume)} L`;
        radiusVal.textContent = `${currentRadius.toFixed(2)} m`;

        if (optAreaMetric) optAreaMetric.textContent = `${data.optimal_A.toFixed(2)} m²`;
        if (curAreaMetric) curAreaMetric.textContent = `${data.current_A.toFixed(2)} m²`;
        if (heightMetric) heightMetric.textContent = `${data.current_h.toFixed(2)} m`;

        if (excessMetric) {
            if (data.excess_pct < 0.15) {
                excessMetric.textContent = 'OPTIMAL (100% EFFICIENT)';
                excessMetric.style.color = '#10b981';
            } else {
                excessMetric.textContent = `+${data.excess_pct.toFixed(2)}% excess`;
                excessMetric.style.color = data.excess_pct > 25 ? '#ef4444' : 'var(--accent-primary)';
            }
        }

        if (ratioTag) {
            ratioTag.textContent = `Ratio h/2r: ${data.aspect_ratio.toFixed(2)}`;
            ratioTag.style.color = Math.abs(data.aspect_ratio - 1.0) < 0.05 ? '#10b981' : 'var(--accent-primary)';
        }

        drawCurve(data);
        draw3DModel(data);
    }

    function drawCurve(data) {
        const w = curveCanvas.width;
        const h = curveCanvas.height;
        ctxCurve.clearRect(0, 0, w, h);

        const padding = 28;
        const rMin = 1.0;
        const rMax = 15.0;

        // Calculate sample range of A(r)
        const A_at_rMin = 2 * Math.PI * rMin * rMin + (2 * currentVolume) / rMin;
        const yMax = Math.min(A_at_rMin * 0.75, data.optimal_A * 2.8);
        const yMin = data.optimal_A * 0.85;

        function toScreenX(r) {
            return padding + ((r - rMin) / (rMax - rMin)) * (w - 2 * padding);
        }

        function toScreenY(A) {
            const clamped = Math.max(yMin, Math.min(yMax, A));
            return (h - padding) - ((clamped - yMin) / (yMax - yMin)) * (h - 2 * padding);
        }

        // Draw grid lines
        ctxCurve.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        ctxCurve.lineWidth = 1;
        ctxCurve.beginPath();
        for (let r = 2; r <= 14; r += 2) {
            const gx = toScreenX(r);
            ctxCurve.moveTo(gx, padding);
            ctxCurve.lineTo(gx, h - padding);
        }
        ctxCurve.stroke();

        // Draw A(r) curve
        ctxCurve.beginPath();
        ctxCurve.strokeStyle = '#00ffcc';
        ctxCurve.lineWidth = 2.5;

        for (let px = padding; px <= w - padding; px += 2) {
            const rVal = rMin + ((px - padding) / (w - 2 * padding)) * (rMax - rMin);
            const aVal = 2 * Math.PI * rVal * rVal + (2 * currentVolume) / rVal;
            const py = toScreenY(aVal);
            if (px === padding) {
                ctxCurve.moveTo(px, py);
            } else {
                ctxCurve.lineTo(px, py);
            }
        }
        ctxCurve.stroke();

        // Draw vertical optimal marker line
        const optX = toScreenX(data.optimal_r);
        const optY = toScreenY(data.optimal_A);

        ctxCurve.setLineDash([4, 4]);
        ctxCurve.strokeStyle = 'rgba(16, 185, 129, 0.6)';
        ctxCurve.beginPath();
        ctxCurve.moveTo(optX, padding);
        ctxCurve.lineTo(optX, h - padding);
        ctxCurve.stroke();
        ctxCurve.setLineDash([]);

        // Glowing point at global minimum
        ctxCurve.fillStyle = '#10b981';
        ctxCurve.beginPath();
        ctxCurve.arc(optX, optY, 6, 0, Math.PI * 2);
        ctxCurve.fill();
        ctxCurve.fillStyle = '#10b981';
        ctxCurve.font = '10px JetBrains Mono, monospace';
        ctxCurve.fillText(`Optimal r* = ${data.optimal_r.toFixed(2)}m`, optX + 8, optY - 8);

        // Draw current test point
        const curX = toScreenX(currentRadius);
        const curY = toScreenY(data.current_A);

        ctxCurve.fillStyle = '#b026ff';
        ctxCurve.shadowColor = '#b026ff';
        ctxCurve.shadowBlur = 10;
        ctxCurve.beginPath();
        ctxCurve.arc(curX, curY, 7, 0, Math.PI * 2);
        ctxCurve.fill();
        ctxCurve.shadowBlur = 0;

        ctxCurve.fillStyle = '#f0f0f0';
        ctxCurve.font = '10px JetBrains Mono, monospace';
        ctxCurve.fillText(`r = ${currentRadius.toFixed(2)}m`, curX + 10, curY + 4);
    }

    function draw3DModel(data) {
        const w = modelCanvas.width;
        const h = modelCanvas.height;
        ctxModel.clearRect(0, 0, w, h);

        const cx = w / 2;
        const cy = h / 2;

        // Scale factors
        const maxDim = Math.max(currentRadius * 2, data.current_h, 10);
        const scale = 75 / (maxDim * 0.45 + 10);

        const rPx = Math.max(16, Math.min(w * 0.38, currentRadius * scale * 12));
        const hPx = Math.max(16, Math.min(h * 0.65, data.current_h * scale * 6));
        const ry = rPx * 0.35; // isometric perspective tilt

        const topY = cy - hPx / 2;
        const botY = cy + hPx / 2;

        // Draw bottom cylinder ellipse (back half dashed, front half solid)
        ctxModel.save();
        ctxModel.strokeStyle = 'rgba(0, 255, 204, 0.3)';
        ctxModel.setLineDash([3, 3]);
        ctxModel.beginPath();
        ctxModel.ellipse(cx, botY, rPx, ry, 0, Math.PI, 0);
        ctxModel.stroke();
        ctxModel.setLineDash([]);

        ctxModel.strokeStyle = '#00ffcc';
        ctxModel.lineWidth = 2;
        ctxModel.beginPath();
        ctxModel.ellipse(cx, botY, rPx, ry, 0, 0, Math.PI);
        ctxModel.stroke();

        // Draw vertical side edges
        ctxModel.beginPath();
        ctxModel.moveTo(cx - rPx, topY);
        ctxModel.lineTo(cx - rPx, botY);
        ctxModel.moveTo(cx + rPx, topY);
        ctxModel.lineTo(cx + rPx, botY);
        ctxModel.stroke();

        // Draw top cylinder ellipse
        ctxModel.fillStyle = 'rgba(0, 255, 204, 0.08)';
        ctxModel.beginPath();
        ctxModel.ellipse(cx, topY, rPx, ry, 0, 0, Math.PI * 2);
        ctxModel.fill();
        ctxModel.stroke();

        // Internal center height axis
        ctxModel.setLineDash([2, 4]);
        ctxModel.strokeStyle = 'rgba(176, 38, 255, 0.6)';
        ctxModel.beginPath();
        ctxModel.moveTo(cx, topY);
        ctxModel.lineTo(cx, botY);
        ctxModel.stroke();
        ctxModel.setLineDash([]);

        // Labels
        ctxModel.fillStyle = '#00ffcc';
        ctxModel.font = '11px JetBrains Mono, monospace';
        ctxModel.fillText(`r = ${currentRadius.toFixed(2)}m`, cx + rPx + 8, botY);
        ctxModel.fillStyle = '#b026ff';
        ctxModel.fillText(`h = ${data.current_h.toFixed(2)}m`, cx - rPx - 68, cy);

        ctxModel.restore();
    }

    volumeSlider.addEventListener('input', updateUI);
    radiusSlider.addEventListener('input', updateUI);

    if (snapBtn) {
        snapBtn.addEventListener('click', () => {
            const data = calculateOptimizer(parseFloat(volumeSlider.value), parseFloat(radiusSlider.value));
            radiusSlider.value = data.optimal_r.toFixed(2);
            updateUI();
            showCyberToast(`⚡ Snapped to Theoretical Optimum: r* = ${data.optimal_r.toFixed(2)} m (h = 2r*)`);
            if (typeof playSound === 'function') playSound('sine', 1046, 0.15, 0.06);
        });
    }

    // Initial render
    updateUI();
})();
