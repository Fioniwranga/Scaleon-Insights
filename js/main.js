// Initialize Lenis Smooth Scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Integrate GSAP with Lenis
gsap.registerPlugin(ScrollTrigger);

// Custom Cursor Glow
const cursorGlow = document.getElementById('cursor-glow');
if (cursorGlow) {
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursorGlow, {
            x: e.clientX - 150,
            y: e.clientY - 150,
            duration: 0.8,
            ease: "power2.out"
        });
    });
}

// Mobile Menu Toggle
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');
const line1 = document.querySelector('.line1');
const line2 = document.querySelector('.line2');
const line3 = document.querySelector('.line3');
const closeMobileBtn = document.getElementById('close-mobile-menu');

let isMenuOpen = false;

function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    if (isMenuOpen) {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden'; // Fallback scroll lock
        lenis.stop();
        
        gsap.to(line1, { rotation: 45, y: 8, transformOrigin: "50% 50%", duration: 0.4, ease: "power2.inOut" });
        gsap.to(line2, { opacity: 0, duration: 0.2 });
        gsap.to(line3, { rotation: -45, y: -8, transformOrigin: "50% 50%", duration: 0.4, ease: "power2.inOut" });
        
        gsap.fromTo(closeMobileBtn, { opacity: 0, rotation: -90 }, { opacity: 1, rotation: 0, duration: 0.5, delay: 0.3 });
        
        gsap.fromTo(mobileLinks, 
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.2, ease: "power3.out" }
        );
    } else {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
        lenis.start();
        
        gsap.to(line1, { rotation: 0, y: 0, duration: 0.4, ease: "power2.inOut" });
        gsap.to(line2, { opacity: 1, duration: 0.2 });
        gsap.to(line3, { rotation: 0, y: 0, duration: 0.4, ease: "power2.inOut" });
    }
}

if (mobileBtn) {
    mobileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });
}

if (closeMobileBtn) {
    closeMobileBtn.addEventListener('click', () => {
        if (isMenuOpen) toggleMenu();
    });
}

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (isMenuOpen) toggleMenu();
    });
});

// Refresh ScrollTrigger on window resize and load
window.addEventListener('load', () => {
    ScrollTrigger.refresh();
});
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
const navGlass = navbar?.querySelector('.glass');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
        if (navGlass) {
            navGlass.classList.add('shadow-2xl', 'border-white/20');
            navGlass.style.backgroundColor = 'rgba(10, 17, 40, 0.9)';
        }
    } else {
        navbar.classList.remove('scrolled');
        if (navGlass) {
            navGlass.classList.remove('shadow-2xl', 'border-white/20');
            navGlass.style.backgroundColor = 'rgba(10, 17, 40, 0.6)';
        }
    }
});

// GSAP Animations

// Fade Up Elements
gsap.utils.toArray('.fade-up').forEach(element => {
    gsap.fromTo(element, 
        { y: 50, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        }
    );
});

// Interactive Dashboard Animation & Live Data
const sCurveSection = document.getElementById('s-curve');
if (sCurveSection) {
    ScrollTrigger.create({
        trigger: sCurveSection,
        start: "top center",
        onEnter: () => {
            sCurveSection.classList.add('s-curve-active');
            if(typeof startLiveGraph === 'function') startLiveGraph();
        },
        onLeaveBack: () => sCurveSection.classList.remove('s-curve-active')
    });
}

// Three.js Hero Visuals
const initThreeJS = () => {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 700;
    
    const posArray = new Float32Array(particlesCount * 3);
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 100;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.2,
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, material);
    scene.add(particlesMesh);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX / window.innerWidth - 0.5;
        mouseY = event.clientY / window.innerHeight - 0.5;
    });

    const animate = () => {
        requestAnimationFrame(animate);
        
        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.0005;
        
        // Smooth mouse follow
        gsap.to(particlesMesh.rotation, {
            x: mouseY * 0.5,
            y: mouseX * 0.5,
            duration: 2
        });

        renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

// Initialize ThreeJS after a slight delay to ensure DOM is ready
setTimeout(initThreeJS, 100);

// Auth Modal Logic
const authModal = document.getElementById('auth-modal');
const loginBtnDesktop = document.getElementById('login-btn-desktop');
const closeAuth = document.getElementById('close-auth');
const authToggleBtn = document.getElementById('auth-toggle-btn');
const authForm = document.getElementById('auth-form');
const authTitle = document.getElementById('auth-title');
const authSubtitle = document.getElementById('auth-subtitle');
const nameField = document.getElementById('name-field');
const authSubmit = document.getElementById('auth-submit');
const authToggleText = document.getElementById('auth-toggle-text');

let isLoginMode = true;

function openModal() {
    authModal.classList.remove('hidden');
    gsap.fromTo("#auth-modal .glass-card", 
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
    );
    lenis.stop();
}

function closeModal() {
    gsap.to("#auth-modal .glass-card", {
        scale: 0.8,
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
            authModal.classList.add('hidden');
            lenis.start();
        }
    });
}

if (loginBtnDesktop) loginBtnDesktop.addEventListener('click', openModal);
if (closeAuth) closeAuth.addEventListener('click', closeModal);
document.querySelector('.auth-overlay')?.addEventListener('click', closeModal);

if (authToggleBtn) {
    authToggleBtn.addEventListener('click', () => {
        isLoginMode = !isLoginMode;
        
        if (isLoginMode) {
            authTitle.innerText = 'Welcome Back';
            authSubtitle.innerText = 'Enter your credentials to access your dashboard';
            nameField.classList.add('hidden');
            authSubmit.innerText = 'Login to Account';
            authToggleText.innerText = "Don't have an account?";
            authToggleBtn.innerText = 'Sign Up';
        } else {
            authTitle.innerText = 'Create Account';
            authSubtitle.innerText = 'Join Scaleon to start engineering your growth';
            nameField.classList.remove('hidden');
            authSubmit.innerText = 'Register Now';
            authToggleText.innerText = 'Already have an account?';
            authToggleBtn.innerText = 'Login';
        }
        
        // Subtle transition
        gsap.fromTo(authForm, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 });
    });
}

if (authForm) {
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const originalText = authSubmit.innerText;
        authSubmit.innerText = isLoginMode ? 'Authenticating...' : 'Creating Account...';
        authSubmit.disabled = true;
        
        setTimeout(() => {
            authSubmit.innerText = isLoginMode ? 'Success! Redirecting...' : 'Account Created!';
            setTimeout(closeModal, 1500);
            setTimeout(() => {
                authSubmit.disabled = false;
                authSubmit.innerText = originalText;
            }, 2000);
        }, 1500);
    });
}

// Unique Glitch Shuffle Effect for Numbers
function glitchShuffle(element, finalValue) {
    const chars = '0123456789%.$';
    let iterations = 0;
    const interval = setInterval(() => {
        element.innerText = finalValue.split('')
            .map((char, index) => {
                if (index < iterations) return finalValue[index];
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');
        
        if (iterations >= finalValue.length) clearInterval(interval);
        iterations += 1/3;
    }, 30);
}

// Live Graph Auto-Update Simulation
let liveGraphInterval;

function doLiveGraphUpdate() {
    const velocityEl = document.getElementById('live-velocity');
    const engagementEl = document.getElementById('live-engagement');
    
    if (velocityEl && engagementEl) {
        // Update Velocity Number with Glitch
        const currentVel = parseFloat(velocityEl.innerText);
        const nextVel = (currentVel + (Math.random() * 2 - 1)).toFixed(1);
        glitchShuffle(velocityEl, nextVel);

        // Update Engagement Number with Glitch
        const currentEng = parseFloat(engagementEl.innerText);
        const nextEng = (currentEng + (Math.random() * 0.4 - 0.2)).toFixed(1);
        glitchShuffle(engagementEl, nextEng);

        // Update Top KPIs
        const kpiRev = document.getElementById('kpi-revenue');
        if(kpiRev) {
            const currentVal = parseFloat(kpiRev.innerText.replace(/[₹,]/g, ''));
            const nextVal = currentVal + (Math.random() * 500 - 100);
            const formatted = '₹' + nextVal.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2});
            glitchShuffle(kpiRev, formatted);
        }

        const kpiUsers = document.getElementById('kpi-users');
        if(kpiUsers) {
            const currentVal = parseInt(kpiUsers.innerText.replace(/,/g, ''));
            const nextVal = currentVal + Math.floor(Math.random() * 50 - 10);
            glitchShuffle(kpiUsers, nextVal.toLocaleString('en-US'));
        }

        const kpiConv = document.getElementById('kpi-conv');
        if(kpiConv) {
            const currentVal = parseFloat(kpiConv.innerText.replace('%', ''));
            const nextVal = Math.max(0.1, currentVal + (Math.random() * 0.2 - 0.1)).toFixed(1);
            glitchShuffle(kpiConv, nextVal + '%');
        }

        const kpiSession = document.getElementById('kpi-session');
        if(kpiSession) {
            const parts = kpiSession.innerText.split(':');
            let secs = parseInt(parts[1]) + Math.floor(Math.random() * 5 - 2);
            let mins = parseInt(parts[0]);
            if(secs >= 60) { secs -= 60; mins += 1; }
            if(secs < 0) { secs += 60; mins -= 1; }
            const formatted = String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
            glitchShuffle(kpiSession, formatted);
        }

        // Oscillate Graph Points
        for(let i=1; i<=5; i++) {
            const point = document.getElementById(`point-${i}`);
            if (point) {
                const currentY = parseFloat(point.getAttribute('cy'));
                gsap.to(point, {
                    attr: { cy: currentY + (Math.random() * 10 - 5) },
                    duration: 2,
                    ease: "sine.inOut"
                });
            }
        }

        // Update Table Values
        for(let i=1; i<=4; i++) {
            const tableVal = document.getElementById(`table-val-${i}`);
            if (tableVal) {
                const currentStr = tableVal.innerText.replace(',', '');
                const currentNum = parseInt(currentStr);
                const nextNum = Math.max(100, currentNum + Math.floor(Math.random() * 50 - 20));
                glitchShuffle(tableVal, nextNum.toLocaleString());
            }
        }
    }
}

function startLiveGraph() {
    if (!liveGraphInterval) {
        doLiveGraphUpdate(); // Trigger first update immediately
        liveGraphInterval = setInterval(doLiveGraphUpdate, 3500);
    }
}

// Contact Form handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const originalText = btn.innerText;
        
        btn.innerText = 'Sending...';
        btn.classList.add('opacity-70');
        
        // Simulate API call
        setTimeout(() => {
            btn.innerText = 'Application Received';
            btn.classList.remove('opacity-70');
            btn.classList.add('bg-mint', 'text-black');
            
            // Reset after 3 seconds
            setTimeout(() => {
                contactForm.reset();
                btn.innerText = originalText;
                btn.classList.remove('bg-mint', 'text-black');
            }, 3000);
        }, 1500);
    });
}
// Navbar Scroll Effect (Apple-style dynamic)
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Dynamic Hero Color Cycling
function cycleHeroColors() {
    const glow1 = document.getElementById('hero-glow-1');
    const glow2 = document.getElementById('hero-glow-2');
    const textGradient = document.querySelector('.text-gradient');
    
    const colors = [
        { c1: 'rgba(0, 240, 255, 0.25)', c2: 'rgba(0, 255, 157, 0.25)', text: ['#00f0ff', '#00ff9d'] },
        { c1: 'rgba(0, 255, 157, 0.25)', c2: 'rgba(255, 255, 255, 0.15)', text: ['#00ff9d', '#ffffff'] },
        { c1: 'rgba(255, 255, 255, 0.15)', c2: 'rgba(0, 240, 255, 0.25)', text: ['#ffffff', '#00f0ff'] }
    ];
    
    let index = 0;
    setInterval(() => {
        index = (index + 1) % colors.length;
        const color = colors[index];
        
        if (glow1) gsap.to(glow1, { backgroundColor: color.c1, duration: 4 });
        if (glow2) gsap.to(glow2, { backgroundColor: color.c2, duration: 4 });
        
        // Update text gradient using CSS variables
        if (textGradient) {
            document.documentElement.style.setProperty('--gradient-start', color.text[0]);
            document.documentElement.style.setProperty('--gradient-end', color.text[1]);
        }
    }, 6000);
}

// Initialize Hero Color Cycle
cycleHeroColors();
