import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const services = [
  { 
    title: 'Aerobics', 
    desc: 'High-energy group participation with music that moves you.',
    fullDesc: 'Our aerobics sessions are designed to boost your cardiovascular health while having fun. We use a mix of modern and traditional Ethiopian rhythms to keep the energy high. Sessions typically accommodate 10-30 people, creating a powerful group dynamic that pushes everyone to their best.',
    img: '/images/sinen_aerobic.png',
    gallery: [
      '/images/sinen_aerobic.png',
      '/images/sinen_aerobic.png'
    ]
  },
  { 
    title: 'Strength', 
    desc: 'Professional weight training with modern equipment.',
    fullDesc: 'Build real power with our comprehensive strength training program. We provide high-quality dumbbells, benches, cable machines, and squat racks. Our trainers focus on proper form and progressive overload to ensure you see consistent gains in muscle mass and functional strength.',
    img: '/images/sinen_strength.jpg',
    gallery: [
      '/images/sinen_strength.jpg',
      '/images/sinen_strength.jpg'
    ]
  },
  { 
    title: 'Boxing', 
    desc: 'Functional cardio power. Boxing bags, pads, and HIIT.',
    fullDesc: 'Unleash your inner warrior with our boxing program. It combines technical skill-building with intense cardio. You will work on heavy bags, speed bags, and pad work with trainers. It is the ultimate way to burn calories, improve coordination, and build mental toughness.',
    img: '/images/sinen_box.png',
    gallery: [
      '/images/sinen_box.png',
      '/images/sinen_box.png'
    ]
  }
];

const ServiceIcon = ({ title, className = "text-orange-500 w-16 h-16" }: { title: string, className?: string }) => {
  switch (title) {
    case 'Aerobics': return <Music className={className} />;
    case 'Strength': return <Dumbbell className={className} />;
    case 'Boxing': return <Zap className={className} />;
    default: return null;
  }
};
import { 
  Phone, 
  MapPin, 
  Clock, 
  Dumbbell, 
  Users, 
  Zap, 
  CheckCircle2, 
  MessageCircle,
  Instagram,
  Facebook,
  Music,
  Target,
  ArrowRight,
  ChevronRight,
  X,
  Star,
  Award,
  ShieldCheck,
  Megaphone
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

/** Utility for tailwind class merging */
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

function Home() {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<null | { title: string, desc: string, fullDesc: string, img: string, gallery: string[] }>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  // Fetch plans from API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/plans/`);
        if (response.ok) {
          const data = await response.json();
          // Handle both paginated and non-paginated responses
          const plansArray = Array.isArray(data) ? data : (data.results || []);
          setPlans(plansArray);
        } else {
          // Fallback to default plans if API fails
          setPlans([
            { name: 'Monthly', price: '3000', duration: 'Monthly', features: 'Full Gym Access\nAll Group Classes\nLocker Service\nProgress Tracking' },
            { name: '3 Months', price: '8000', duration: 'Quarterly', features: 'Full Gym Access\nAll Group Classes\nLocker Service\nProgress Tracking', highlight: true },
            { name: '6 Months', price: '15000', duration: 'Annual', features: 'Full Gym Access\nAll Group Classes\nLocker Service\nProgress Tracking' }
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch plans:', error);
        // Fallback to default plans
        setPlans([
          { name: 'Monthly', price: '3000', duration: 'Monthly', features: 'Full Gym Access\nAll Group Classes\nLocker Service\nProgress Tracking' },
          { name: '3 Months', price: '8000', duration: 'Quarterly', features: 'Full Gym Access\nAll Group Classes\nLocker Service\nProgress Tracking', highlight: true },
          { name: '6 Months', price: '15000', duration: 'Annual', features: 'Full Gym Access\nAll Group Classes\nLocker Service\nProgress Tracking' }
        ]);
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchPlans();
  }, []);

  // Fetch announcements from API
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/announcements/`);
        if (response.ok) {
          const data = await response.json();
          const announcementsArray = Array.isArray(data) ? data : (data.results || []);
          // Only show active announcements
          setAnnouncements(announcementsArray.filter((a: any) => a.is_active));
        }
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
      }
    };

    fetchAnnouncements();
  }, []);

  useEffect(() => {
    // 1. Smooth Scrolling with Lenis
    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // 2. Custom Cursor
    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: 'power3.out'
      });
    };
    window.addEventListener('mousemove', moveCursor);

    const ctx = gsap.context(() => {
      // 3. Hero Parallax & Text Reveal
      const heroTl = gsap.timeline();
      heroTl.from('.reveal-text', {
        y: 120,
        skewY: 7,
        stagger: 0.1,
        duration: 1.2,
        ease: 'power4.out'
      })
      .from('.hero-image', {
        scale: 1.2,
        duration: 2,
        ease: 'power2.out'
      }, 0)
      .from('.hero-ui', {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.8
      }, '-=0.5');

      gsap.to('.hero-image', {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        },
        y: 200,
        scale: 1.1
      });

      // 4. Horizontal Scroll Section
      const horizontalSection = horizontalRef.current;
      if (horizontalSection) {
        const pinWrap = horizontalSection.querySelector('.pin-wrap') as HTMLElement;
        const progressBar = horizontalSection.querySelector('.scroll-progress-bar') as HTMLElement;

        const scrollTween = gsap.to(pinWrap, {
          x: () => -(pinWrap.scrollWidth - window.innerWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: horizontalSection,
            start: 'top top',
            end: () => `+=${pinWrap.scrollWidth}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (progressBar) {
                gsap.to(progressBar, { scaleX: self.progress, duration: 0.1, overwrite: true });
              }
            }
          }
        });

        // Slide content reveals using containerAnimation
        gsap.utils.toArray<HTMLElement>('.slide-content').forEach((content) => {
          gsap.from(content, {
            scrollTrigger: {
              trigger: content,
              containerAnimation: scrollTween,
              start: 'left 85%',
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: 'power3.out'
          });
        });

        // Image parallax inside horizontal scroll
        gsap.utils.toArray<HTMLElement>('.slide-image').forEach((img) => {
          gsap.to(img, {
            scrollTrigger: {
              trigger: img,
              containerAnimation: scrollTween,
              start: 'left right',
              end: 'right left',
              scrub: true
            },
            x: -50,
            ease: 'none'
          });
        });
      }

      // 5. Gallery Parallax
      gsap.utils.toArray<HTMLElement>('.gallery-item').forEach((item) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          },
          y: 100,
          scale: 0.9,
          opacity: 0.5
        });
      });

      // 6. Section Heading Reveals
      gsap.utils.toArray<HTMLElement>('.section-heading').forEach((heading) => {
        gsap.from(heading.querySelectorAll('.char'), {
          scrollTrigger: {
            trigger: heading,
            start: 'top 85%',
          },
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.02,
          ease: 'power3.out'
        });
      });

      // 6. Pricing Cards Float
      gsap.utils.toArray<HTMLElement>('.pricing-card').forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
          },
          y: 100,
          opacity: 0,
          duration: 1,
          delay: i * 0.1,
          ease: 'power4.out'
        });
      });

      // 7. Background Grid Animation
      gsap.to('.bg-grid', {
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5
        },
        y: -100
      });

    }, containerRef.current || undefined);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      cancelAnimationFrame(rafId);
      ctx.revert();
      lenis.destroy();
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div ref={containerRef} className="bg-black text-white font-sans selection:bg-orange-500 selection:text-black overflow-x-hidden">
      {/* Custom Cursor */}
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-8 h-8 border-2 border-orange-500 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference hidden md:block"
      />

      {/* Background Texture */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="bg-grid absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 mix-blend-difference">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 overflow-hidden">
              <img src="/images/sinen_logo.png" alt="Sinen Fitness Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">
              Sinen <span className="text-orange-500">Fitness</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-12 text-xs font-bold uppercase tracking-[0.3em]">
            <button onClick={() => scrollToSection('about')} className="hover:text-orange-500 transition-colors">About</button>
            <button onClick={() => scrollToSection('services')} className="hover:text-orange-500 transition-colors">Services</button>
            <button onClick={() => scrollToSection('gallery')} className="hover:text-orange-500 transition-colors">Gallery</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-orange-500 transition-colors">Pricing</button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-orange-500 transition-colors">Contact</button>
          </div>

          <button 
            onClick={() => navigate('/register')}
            className="hero-ui bg-white text-black px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-orange-500 transition-colors"
          >
            Join the Revolution
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Decorative Phrase */}
        <div className="absolute top-1/4 -left-20 text-[8vw] font-black opacity-5 pointer-events-none select-none italic -rotate-12 whitespace-nowrap">
          NO PAIN NO GAIN
        </div>
        <div className="absolute bottom-1/4 -right-20 text-[8vw] font-black opacity-5 pointer-events-none select-none italic rotate-12 whitespace-nowrap">
          DON'T QUIT
        </div>
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/gym_hero.jpg" 
            alt="Sinen Fitness Club Gym"
            className="hero-image w-full h-full object-cover opacity-40 scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        </div>

        <div className="relative z-10 text-center px-6">
          <div className="hero-ui overflow-hidden mb-4">
            <span className="block text-orange-500 font-black uppercase tracking-[0.5em] text-sm">Addis Ababa, Ethiopia</span>
          </div>
          <h1 className="text-[12vw] md:text-[8vw] font-black uppercase italic tracking-tighter leading-[0.85] mb-8">
            <div className="overflow-hidden">
              <span className="reveal-text block">Work Ethic</span>
            </div>
            <div className="overflow-hidden">
              <span className="reveal-text block text-orange-500">For That</span>
            </div>
            <div className="overflow-hidden">
              <span className="reveal-text block">Energy</span>
            </div>
          </h1>
          <div className="hero-ui flex flex-col md:flex-row items-center justify-center gap-6 mt-12">
            <button 
              onClick={() => navigate('/register')}
              className="group bg-orange-500 text-black px-12 py-5 rounded-full font-black text-lg uppercase tracking-tighter flex items-center gap-3 hover:scale-105 transition-transform"
            >
              Get Started
              <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </button>
            <a href="tel:0934437205" className="text-white font-black uppercase tracking-widest text-sm border-b-2 border-orange-500 pb-1 hover:text-orange-500 transition-colors">
              Call 0934437205
            </a>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 hero-ui">
          <div className="flex flex-col items-center gap-4">
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-50">Scroll to Explore</span>
            <div className="w-px h-20 bg-gradient-to-b from-orange-500 to-transparent" />
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" ref={aboutRef} className="py-24 md:py-40 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 right-0 text-[15vw] md:text-[10vw] font-black opacity-5 pointer-events-none select-none italic rotate-90 translate-x-1/2">
          KEEP ON GOING
        </div>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 md:gap-24 items-center">
          <div className="relative w-full lg:w-1/2 order-2 lg:order-1">
            <div className="absolute -top-10 -left-10 text-[20vw] md:text-[15vw] font-black opacity-5 pointer-events-none select-none italic">SINEN</div>
            <div className="flex items-center gap-4 mb-8">
              <span className="bg-orange-500 text-black px-4 py-1 text-[10px] font-black uppercase italic rounded-sm">ፅናት</span>
              <span className="bg-zinc-800 text-white px-4 py-1 text-[10px] font-black uppercase italic rounded-sm">ትግስት</span>
            </div>
            <h2 className="section-heading text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.9] mb-8 md:mb-12">
              More Than <br /> <span className="text-orange-500">Just A Gym</span>
            </h2>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-6 md:mb-8 italic border-l-2 border-orange-500 pl-6">
              Sinen Fitness Club is Addis Ababa's premier destination for those who value energy, community, and real results.
            </p>
            <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-10 md:mb-12">
              Located on the 5th floor of Fasika Business Center, we offer a unique vantage point for your fitness journey. Our mission is to provide an accessible, high-energy environment.
            </p>
            <div className="grid grid-cols-2 gap-4 md:gap-8">
              <div className="bg-zinc-900/80 backdrop-blur-sm p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 text-orange-500/10 group-hover:scale-110 transition-transform">
                  <Users size={80} />
                </div>
                <div className="text-3xl md:text-4xl font-black text-orange-500 mb-2 italic relative z-10">10+</div>
                <p className="text-[10px] uppercase tracking-widest font-black text-gray-500 relative z-10">Expert Coaches</p>
              </div>
              <div className="bg-zinc-900/80 backdrop-blur-sm p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 text-orange-500/10 group-hover:scale-110 transition-transform">
                  <Users size={80} />
                </div>
                <div className="text-3xl md:text-4xl font-black text-orange-500 mb-2 italic relative z-10">500+</div>
                <p className="text-[10px] uppercase tracking-widest font-black text-gray-500 relative z-10">Active Members</p>
              </div>
            </div>
          </div>
          <div className="relative w-full lg:w-1/2 order-1 lg:order-2">
            <div className="relative aspect-[4/5] md:aspect-[3/4] rounded-[3rem] md:rounded-[4rem] overflow-hidden border-4 md:border-8 border-zinc-900 shadow-2xl">
              <img 
                src="/images/sinen_more.jpg" 
                alt="Sinen Fitness Club" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 bg-orange-500 text-black p-8 md:p-12 rounded-full font-black text-lg md:text-xl uppercase italic rotate-12 shadow-2xl hover:rotate-0 transition-transform cursor-pointer" onClick={() => navigate('/register')}>
              Join the <br /> Revolution
            </div>
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      <section 
        key="announcements" 
        className={`py-24 md:py-32 px-6 bg-black relative overflow-hidden ${announcements.length === 0 ? 'hidden' : ''}`}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[12vw] font-black opacity-5 pointer-events-none select-none italic">
          STAY UPDATED
        </div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="bg-orange-500 text-black px-4 py-1 text-[10px] font-black uppercase italic rounded-sm">አዲስ</span>
            </div>
            <h2 className="text-orange-500 font-bold uppercase tracking-[0.5em] text-xs mb-6">Latest Updates</h2>
            <h3 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">Announcements</h3>
          </div>

          <div className="space-y-6">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="bg-zinc-900/80 backdrop-blur-sm rounded-[2rem] border border-white/10 p-8 hover:border-orange-500/30 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/30 transition-colors">
                    <Megaphone className="w-6 h-6 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-black uppercase italic mb-3 group-hover:text-orange-500 transition-colors">
                      {announcement.title}
                    </h4>
                    <p className="text-gray-400 text-lg leading-relaxed">
                      {announcement.message}
                    </p>
                    <p className="text-xs text-gray-600 mt-4 uppercase tracking-widest font-bold">
                      {new Date(announcement.created_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Horizontal Scroll Section - Services (Redone) */}
      <section id="services" ref={horizontalRef} className="bg-zinc-900 overflow-hidden relative">
        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5 z-20">
          <div className="scroll-progress-bar h-full bg-orange-500 w-full origin-left scale-x-0" />
        </div>
        
        <div className="pin-wrap flex h-screen items-center px-[10vw] pr-[30vw] gap-[10vw] w-max">
          {/* Intro Slide */}
          <div className="flex-shrink-0 w-[80vw] md:w-[45vw]">
            <h2 className="section-heading text-7xl md:text-[10vw] font-black uppercase italic tracking-tighter leading-[0.8] mb-12">
              The <br /> <span className="text-orange-500">Sinen</span> <br /> Way
            </h2>
            <div className="h-px w-40 bg-orange-500 mb-12" />
            <p className="text-gray-400 text-2xl max-w-md leading-relaxed italic">
              "Work ethic for that energy." <br />
              <span className="text-white not-italic font-bold text-lg mt-4 block">— Our Philosophy</span>
            </p>
          </div>

          {services.map((service, i) => (
            <div key={i} className="flex-shrink-0 w-[85vw] md:w-[65vw] flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-1/2 aspect-[4/5] rounded-[4rem] overflow-hidden relative group">
                <img 
                  src={service.img} 
                  alt={service.title} 
                  className="slide-image w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute top-8 left-8">
                  <span className="bg-orange-500 text-black px-4 py-1 text-xs font-black uppercase italic rounded-full">እልህ</span>
                </div>
              </div>
              <div className="w-full md:w-1/2 slide-content">
                <div className="mb-8"><ServiceIcon title={service.title} /></div>
                <h3 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-6">{service.title}</h3>
                <p className="text-gray-400 text-xl leading-relaxed mb-8">{service.desc}</p>
                <button 
                  onClick={() => setSelectedService(service)}
                  className="flex items-center gap-4 text-orange-500 font-black uppercase tracking-widest text-sm group"
                >
                  Learn More <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>
          ))}
          
          {/* Outro Slide / Buffer */}
          <div className="flex-shrink-0 w-[40vw] flex items-center justify-center">
            <div className="text-center">
              <div className="text-orange-500 font-black text-8xl italic opacity-20 mb-4">GO!</div>
              <p className="text-xs uppercase tracking-[0.5em] font-bold text-gray-600">Keep Scrolling</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" ref={galleryRef} className="py-24 md:py-40 px-6 bg-black relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[12vw] font-black opacity-5 pointer-events-none select-none italic whitespace-nowrap">
          NO MORE EXCUSE
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-24">
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="bg-orange-500 text-black px-4 py-1 text-[10px] font-black uppercase italic rounded-sm">አንደኛ</span>
            </div>
            <h2 className="text-orange-500 font-bold uppercase tracking-[0.5em] text-xs mb-6">Visuals</h2>
            <h3 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter">The Energy Hub</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-6 auto-rows-[150px] md:auto-rows-[300px]">
            <div className="gallery-item col-span-2 md:col-span-8 md:row-span-2 rounded-2xl md:rounded-[3rem] overflow-hidden relative group">
              <img src="/images/1.jpg" alt="Sinen Gym 1" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
            </div>
            <div className="gallery-item col-span-1 md:col-span-4 md:row-span-1 rounded-2xl md:rounded-[3rem] overflow-hidden relative group">
              <img src="/images/2.jpg" alt="Sinen Gym 2" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
            </div>
            <div className="gallery-item col-span-1 md:col-span-4 md:row-span-2 rounded-2xl md:rounded-[3rem] overflow-hidden relative group">
              <img src="/images/3.jpg" alt="Sinen Gym 3" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
            </div>
            <div className="gallery-item col-span-1 md:col-span-4 md:row-span-1 rounded-2xl md:rounded-[3rem] overflow-hidden relative group">
              <img src="/images/4.jpg" alt="Sinen Gym 4" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
            </div>
            <div className="gallery-item col-span-1 md:col-span-4 md:row-span-1 rounded-2xl md:rounded-[3rem] overflow-hidden relative group">
              <img src="/images/5.jpg" alt="Sinen Gym 5" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section id="team" className="py-24 md:py-40 px-6 bg-zinc-900 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 text-[15vw] md:text-[10vw] font-black opacity-5 pointer-events-none select-none italic -rotate-90 -translate-x-1/2">
          TEAM SINEN
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 md:mb-24">
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="bg-orange-500 text-black px-4 py-1 text-[10px] font-black uppercase italic rounded-sm">አንደኛ</span>
            </div>
            <h2 className="text-orange-500 font-bold uppercase tracking-[0.5em] text-[10px] mb-6">The Experts</h2>
            <h3 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none">Our Team</h3>
          </div>

          <div className="flex overflow-x-auto lg:grid lg:grid-cols-3 gap-6 md:gap-12 pb-12 lg:pb-0 snap-x snap-mandatory no-scrollbar">
            {[
              { name: 'Coach Sami', role: 'Founder & Head Trainer', specialty: 'Strength & Conditioning', img: '/images/coach_sami_1.jpg' },
              { name: 'Coach Sami', role: 'Lead Aerobics Instructor', specialty: 'Cardio & Group Energy', img: '/images/coach_sami_2.jpg' },
              { name: 'Coach Sami', role: 'Boxing Specialist', specialty: 'Functional Combat', img: '/images/coach_sami_3.jpg' }
            ].map((member, i) => (
              <div key={i} className="group relative flex-shrink-0 w-[85vw] sm:w-[50vw] lg:w-full snap-center">
                <div className="aspect-[3/4] rounded-[3rem] overflow-hidden border-4 border-zinc-800 group-hover:border-orange-500 transition-colors duration-500 relative">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                  
                  <div className="absolute bottom-8 left-8 right-8">
                    <h4 className="text-3xl font-black uppercase italic tracking-tighter mb-1 leading-none">{member.name}</h4>
                    <p className="text-orange-500 font-bold text-[10px] uppercase tracking-widest mb-4">{member.role}</p>
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full w-fit border border-white/10">
                      <Award size={12} className="text-orange-500" />
                      <span className="text-[9px] font-black uppercase tracking-widest">{member.specialty}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} className="py-40 px-6 bg-zinc-900 overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-black text-white/5 pointer-events-none select-none italic">VOICES</div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-orange-500 font-bold uppercase tracking-[0.5em] text-xs mb-6">Success Stories</h2>
            <h3 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">Member Energy</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              { 
                quote: "በሲነን ያለው ጉልበት ተወዳዳሪ የለውም። ገደቤን ለመግፋት ይህን ያህል ተነሳሽነት ተሰምቶኝ አያውቅም።", 
                author: "ANANIA M.", 
                role: "Member since 2023",
                img: "https://picsum.photos/seed/member1/100"
              },
              { 
                quote: "የቡድን ኤሮቢክስ ክፍሎች የሳምንቴ ድምቀት ናቸው። አስደሳች፣ ጠንካራ እና ውጤታማ!", 
                author: "KALEB K.", 
                role: "Aerobics Regular",
                img: "https://picsum.photos/seed/member2/100"
              },
              { 
                quote: "በአዲስ አበባ ምርጥ የአካባቢ ጂም። የ5ኛው ፎቅ እይታ እና የማህበረሰብ ስሜት አስደናቂ ናቸው።", 
                author: "METSI L.", 
                role: "Strength Athlete",
                img: "https://picsum.photos/seed/member3/100"
              },
              { 
                quote: "በትክክል የሚሰራ ተደራሽ የአካል ብቃት። በ3 ወራት ውስጥ እውነተኛ ውጤቶችን አይቻለሁ።", 
                author: "SHIBRE Q.", 
                role: "Fitness Enthusiast",
                img: "https://picsum.photos/seed/member4/100"
              }
            ].map((t, i) => (
              <div key={i} className="bg-black/50 backdrop-blur-xl p-10 rounded-[3rem] border border-white/5 hover:border-orange-500/30 transition-all group">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-orange-500">
                    <img src={t.img} alt={t.author} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h5 className="text-xl font-black uppercase italic">{t.author}</h5>
                    <p className="text-xs uppercase tracking-widest font-bold text-gray-500">{t.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 text-xl italic leading-relaxed group-hover:text-white transition-colors">
                  "{t.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" ref={pricingRef} className="py-24 md:py-40 bg-zinc-900 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 text-[8vw] font-black opacity-5 pointer-events-none select-none italic -rotate-6 translate-y-1/2">
          BE THE BEST VERSION OF YOURSELF
        </div>
        <div className="absolute top-1/2 right-0 text-[6vw] font-black opacity-5 pointer-events-none select-none italic rotate-12 translate-x-1/4">
          STRONGER THAN YOU THINK
        </div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 md:mb-24">
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="bg-orange-500 text-black px-4 py-1 text-[10px] font-black uppercase italic rounded-sm">ትግስት</span>
            </div>
            <h2 className="text-orange-500 font-bold uppercase tracking-[0.5em] text-xs mb-6">Membership</h2>
            <h3 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter">Invest In You</h3>
          </div>

          <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-6 md:gap-12 pb-8 md:pb-0 snap-x snap-mandatory no-scrollbar">
            {loadingPlans ? (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500">Loading plans...</p>
              </div>
            ) : (
              plans.map((plan, i) => {
                const features = plan.features ? plan.features.split('\n') : ['Full Gym Access', 'All Group Classes', 'Locker Service', 'Progress Tracking'];
                const isHighlight = plan.highlight || plan.duration === 'Quarterly' || i === 1;
                const label = plan.duration === 'Monthly' ? 'Starter' : plan.duration === 'Quarterly' ? 'Popular' : 'Elite';
                
                return (
                  <div 
                    key={plan.id || i}
                    className={cn(
                      "pricing-card flex-shrink-0 w-[85%] md:w-full snap-center p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] border flex flex-col items-center text-center transition-transform hover:-translate-y-4 duration-500",
                      isHighlight ? "bg-orange-500 border-orange-400 text-black" : "bg-black border-white/10 text-white"
                    )}
                  >
                    <span className={cn("uppercase tracking-[0.3em] text-[10px] font-black mb-6 md:mb-8", isHighlight ? "text-black/60" : "text-gray-500")}>
                      {label}
                    </span>
                    <h4 className="text-2xl md:text-3xl font-black uppercase italic mb-4">{plan.name}</h4>
                    <div className="flex items-baseline gap-2 mb-8 md:mb-12">
                      <span className="text-5xl md:text-6xl font-black">{parseFloat(plan.price).toLocaleString()}</span>
                      <span className="font-bold opacity-60">ETB</span>
                    </div>
                    <ul className="space-y-3 md:space-y-4 mb-8 md:mb-12 font-bold text-xs md:text-sm opacity-80">
                      {features.map((feature: string, idx: number) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                    <button 
                      onClick={() => navigate('/register')}
                      className={cn(
                        "w-full py-4 md:py-5 rounded-full font-black uppercase tracking-widest text-[10px] md:text-xs transition-all",
                        isHighlight ? "bg-black text-white hover:scale-105" : "bg-white text-black hover:bg-orange-500"
                      )}
                    >
                      Select Plan
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" ref={contactRef} className="py-40 px-6 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 text-[10vw] font-black opacity-5 pointer-events-none select-none italic -rotate-12 translate-y-1/4">
          BE THE BEST VERSION OF YOURSELF
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="mb-24">
            <h2 className="section-heading text-[15vw] lg:text-[10vw] font-black uppercase italic tracking-tighter leading-[0.8] opacity-10 absolute -top-10 left-0 pointer-events-none">
              Connect
            </h2>
            <div className="relative z-10">
              <h3 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">
                Ready to <span className="text-orange-500">Join?</span>
              </h3>
              <p className="text-gray-500 mt-4 max-w-md font-bold uppercase tracking-widest text-xs">
                Visit us at the 5th floor or book your visit now.
              </p>
              <button 
                onClick={() => navigate('/register')}
                className="mt-8 bg-orange-500 text-black px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform"
              >
                Book Your Visit
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Location Tile */}
            <div className="group relative bg-zinc-900/50 rounded-[2rem] p-10 border border-white/5 hover:border-orange-500/50 transition-all overflow-hidden lg:col-span-2">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <MapPin size={160} />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mb-6">
                    <MapPin className="text-black" />
                  </div>
                  <h4 className="text-3xl font-black uppercase italic mb-4">Our Spot</h4>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    Gelan Condominium, Fasika Business Center, <br />
                    <span className="text-white font-bold">5th Floor</span>, Akaki Kaliti, Addis Ababa
                  </p>
                </div>
                <button className="mt-8 flex items-center gap-2 text-orange-500 font-black uppercase tracking-widest text-xs group-hover:gap-4 transition-all">
                  Open in Maps <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Phone Tile */}
            <a href="tel:0934437205" className="group relative bg-zinc-900/50 rounded-[2rem] p-10 border border-white/5 hover:bg-orange-500 transition-all overflow-hidden">
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-black/20">
                  <Phone className="text-white group-hover:text-black" />
                </div>
                <div>
                  <h4 className="text-2xl font-black uppercase italic mb-2 group-hover:text-black">Call Us</h4>
                  <p className="text-gray-500 font-bold text-xl group-hover:text-black/70">0934437205</p>
                </div>
              </div>
            </a>

            {/* WhatsApp Tile */}
            <a href="https://wa.me/251934437205" className="group relative bg-zinc-900/50 rounded-[2rem] p-10 border border-white/5 hover:bg-[#25D366] transition-all overflow-hidden">
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-black/20">
                  <MessageCircle className="text-white group-hover:text-black" />
                </div>
                <div>
                  <h4 className="text-2xl font-black uppercase italic mb-2 group-hover:text-black">WhatsApp</h4>
                  <p className="text-gray-500 font-bold text-xl group-hover:text-black/70">Chat Now</p>
                </div>
              </div>
            </a>

            {/* TikTok Tile */}
            <a href="https://www.tiktok.com/@sinenfitnessclub" className="group relative bg-zinc-900/50 rounded-[2rem] p-10 border border-white/5 hover:bg-white transition-all overflow-hidden lg:col-span-2">
              <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-opacity">
                <svg className="w-64 h-64 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.31-.75.42-1.24 1.25-1.33 2.1-.1.7.1 1.41.53 1.98.5.73 1.36 1.19 2.24 1.17.96.03 1.91-.41 2.46-1.21.46-.72.56-1.61.53-2.45V.02z"/>
                </svg>
              </div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-black/20">
                    <Music className="text-white group-hover:text-black" />
                  </div>
                  <h4 className="text-4xl font-black uppercase italic mb-2 group-hover:text-black">TikTok</h4>
                  <p className="text-gray-500 font-bold text-lg group-hover:text-black/70">@sinenfitnessclub</p>
                </div>
                <div className="flex items-center gap-4 mt-8">
                  <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-4 border-zinc-900 bg-zinc-800 overflow-hidden">
                        <img src={`https://picsum.photos/seed/${i+10}/100`} alt="user" />
                      </div>
                    ))}
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest group-hover:text-black">Join 1.2K+ Followers</span>
                </div>
              </div>
            </a>

            {/* Hours Tile */}
            <div className="group relative bg-zinc-900/50 rounded-[2rem] p-10 border border-white/5 hover:border-orange-500/50 transition-all overflow-hidden lg:col-span-2">
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-6">
                    <Clock className="text-orange-500" />
                  </div>
                  <h4 className="text-3xl font-black uppercase italic mb-6">Open Hours</h4>
                  <div>
                    <p className="text-orange-500 font-black uppercase tracking-widest text-[10px] mb-2">Mon - Sat</p>
                    <p className="text-xl font-bold">12:00 AM - 3:00 PM ET</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 bg-black relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
              <img src="/images/sinen_logo.png" alt="Sinen Fitness Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase italic">
              Sinen <span className="text-orange-500">Fitness</span>
            </span>
          </div>
          <p className="text-gray-600 text-[10px] uppercase tracking-[0.4em] font-black">
            © 2026 Sinen Fitness Club • Addis Ababa
          </p>
          <div className="flex gap-8">
            <Instagram className="text-gray-600 hover:text-orange-500 cursor-pointer transition-colors" />
            <Facebook className="text-gray-600 hover:text-orange-500 cursor-pointer transition-colors" />
            <MessageCircle className="text-gray-600 hover:text-orange-500 cursor-pointer transition-colors" />
          </div>
        </div>
      </footer>

      {/* Service Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedService(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-zinc-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] border border-white/10 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedService(null)}
                className="absolute top-6 right-6 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors z-10"
              >
                <X className="text-white" />
              </button>

              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 aspect-square md:aspect-auto">
                  <img src={selectedService.img} alt={selectedService.title} className="w-full h-full object-cover" />
                </div>
                <div className="w-full md:w-1/2 p-8 md:p-12">
                  <div className="mb-6"><ServiceIcon title={selectedService.title} /></div>
                  <h3 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-6">{selectedService.title}</h3>
                  <p className="text-gray-400 text-lg leading-relaxed mb-8">{selectedService.fullDesc}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {selectedService.gallery.map((img, i) => (
                      <div key={i} className="aspect-video rounded-2xl overflow-hidden border border-white/5">
                        <img src={img} alt="gallery" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-orange-500">
                      <ShieldCheck size={20} />
                      <span className="text-xs font-black uppercase tracking-widest">Certified Trainers</span>
                    </div>
                    <div className="flex items-center gap-3 text-orange-500">
                      <Star size={20} />
                      <span className="text-xs font-black uppercase tracking-widest">Modern Equipment</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Home;
