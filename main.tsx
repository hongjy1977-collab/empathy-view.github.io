/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react';

// --- Background Component ---
function MeshBackground() {
  return (
    <div className="mesh-container">
      <div className="mesh-blob mesh-blob-1" />
      <div className="mesh-blob mesh-blob-2" />
      <div className="mesh-blob mesh-blob-3" />
    </div>
  );
}

function IntroScreen({ onFinish }: { onFinish: () => void; key?: string }) {
  const [isExpanding, setIsExpanding] = useState(false);
  const [coords, setCoords] = useState({ x: '50%', y: '50%' });

  const handleClick = (e: React.MouseEvent) => {
    setCoords({ x: `${e.clientX}px`, y: `${e.clientY}px` });
    setIsExpanding(true);
    setTimeout(onFinish, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-sand-beige overflow-hidden cursor-pointer"
      onClick={handleClick}
      style={{
        // @ts-ignore
        '--mx': coords.x,
        '--my': coords.y,
      }}
    >
      <div className="relative z-10 flex flex-col items-center">
        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-5xl font-black text-center mb-16 text-ink"
        >
          마음을 움직이는 공감,<br />
          <span className="text-amber-glow font-light mt-4 block opacity-60">손을 맞잡아보세요.</span>
        </motion.h1>

        <motion.div 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <HandsSVG strokeColor="#1c1917" />
          <div className="absolute inset-0 bg-amber-glow/10 blur-3xl rounded-full scale-150 animate-pulse" />
        </motion.div>
      </div>

      {/* Circle Mask Expansion Effect */}
      <div 
        className={`absolute inset-0 bg-ink z-20 mask-transition ${isExpanding ? 'mask-transition-active' : ''}`}
      />
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        className="absolute bottom-12 text-[10px] font-bold tracking-[0.6em] uppercase text-ink"
      >
        Click to Experience
      </motion.div>
    </motion.div>
  );
}

function SelectionScreen({ onSelect, onBack }: { onSelect: (section: 'about' | 'project') => void; onBack: () => void; key?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-sand-beige overflow-hidden"
    >
      <MeshBackground />

      <motion.button 
        onClick={onBack}
        whileHover={{ x: -10 }}
        className="fixed top-12 left-12 text-[12px] font-black tracking-widest flex items-center gap-4 group text-ink/30 hover:text-ink z-[60]"
      >
        <ChevronLeft size={16} />
        BACK TO START
      </motion.button>

      <div className="flex flex-col md:flex-row gap-16 md:gap-32 items-center justify-center relative z-10 w-full px-20">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="flex flex-col items-center group cursor-pointer text-center"
          onClick={() => onSelect('about')}
        >
          <span className="text-5xl md:text-7xl font-black tracking-tight text-ink opacity-30 group-hover:opacity-100 transition-all duration-700">
            ABOUT
          </span>
          <div className="mt-6 opacity-0 group-hover:opacity-20 transition-all duration-700">
            <HandsSVG strokeColor="#000" scale={0.4} />
          </div>
        </motion.div>

        {/* Divider for symmetry */}
        <div className="hidden md:block w-px h-24 bg-ink/10" />

        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="flex flex-col items-center group cursor-pointer text-center"
          onClick={() => onSelect('project')}
        >
          <span className="text-5xl md:text-7xl font-black tracking-tight text-ink opacity-30 group-hover:opacity-100 transition-all duration-700">
            PROJECT
          </span>
          <div className="mt-6 opacity-0 group-hover:opacity-20 transition-all duration-700">
            <HandsSVG strokeColor="#000" scale={0.4} />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function HandsSVG({ strokeColor = "#1c1917", scale = 1 }: { strokeColor?: string; scale?: number }) {
  return (
    <svg 
      width={200 * scale} 
      height={120 * scale} 
      viewBox="0 0 200 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="transition-transform duration-500"
    >
      <motion.path
        d="M20 60C20 60 50 50 70 60C90 70 100 85 100 85"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2 }}
      />
      <motion.path
        d="M180 60C180 60 150 50 130 60C110 70 100 85 100 85"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2 }}
      />
      <circle cx="100" cy="85" r="4" fill="#fbbf24" />
    </svg>
  );
}

function MainContent({ initialSection, onBack }: { initialSection: 'about' | 'project'; onBack: () => void; key?: string }) {
  const [currentView, setCurrentView] = useState<'about' | 'project' | 'contact'>(initialSection);
  const [projectIndex, setProjectIndex] = useState(0);
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const y1 = useTransform(smoothProgress, [0, 1], [0, -200]);
  const y2 = useTransform(smoothProgress, [0, 1], [0, 200]);

  const projects = [
    {
      tag: "MAIN FEATURE",
      category: "Official Publication",
      title: "동화책\n‘과거 속으로’",
      keywords: ["Scenario Writing", "Visual Directing", "Full Cycle Planning"],
      description: "‘나도 작가’ 프로젝트에 선정되어 정식 출판된 동화책입니다. 글 작가로서 시나리오 집필과 장면 연출을 총괄하며, 창작의 전 과정을 주도하여 문제 해결형 기획 역량을 처음으로 증명했습니다. 삶의 여정에서 겪는 실패와 좌절이라는 쓰라린 추억들을 있는 그대로 받아들이고 이를 성장의 과정으로 발판 삼아 자신을 믿고 앞으로 나아가자는 격려와 위로를 독자들에게 전하고자 했습니다. 기획부터 출판까지, 이야기가 가진 치유의 힘을 증명한 과정이었습니다.",
      link: "https://www.kihoilbo.co.kr/news/articleView.html?idxno=1093674",
      role: "Author & Lead Director"
    },
    {
      tag: "LEADERSHIP",
      category: "Community Planning",
      title: "학생회 &\n도서부 기획",
      keywords: ["Event Design", "Conflict Mediation", "Execution"],
      description: "공동체의 문제를 파악하고 모두가 즐겁게 참여할 수 있는 행사를 기획/운영했습니다. 리더십을 발휘하여 구성원의 니즈를 조율하고 가시적인 성과를 이끌어냈습니다.",
      role: "Lead Organizer"
    },
    {
      tag: "NARRATIVE FLOW",
      category: "Creative Strategy",
      title: "문학적 통찰\n기반 콘텐츠",
      keywords: ["Textual Analysis", "Content Translation", "Creative Lab"],
      description: "전공 지식을 바탕으로 텍스트 뒤에 숨겨진 의미를 분석하고, 이를 대중적인 콘텐츠로 풀어내는 기획들을 진행하고 있습니다.",
      role: "Content Strategist"
    }
  ];

  const nextProject = () => setProjectIndex((prev) => (prev + 1) % projects.length);
  const prevProject = () => setProjectIndex((prev) => (prev - 1 + projects.length) % projects.length);

  return (
    <div ref={containerRef} className="relative min-h-[100vh]">
      <MeshBackground />
      
      {/* Sticky Navigation */}
      <nav className="fixed top-0 left-0 w-full h-24 px-12 flex justify-between items-center mix-blend-difference text-sand-beige z-[60]">
        <motion.button 
          onClick={onBack}
          whileHover={{ x: -10 }}
          className="text-[12px] font-black tracking-widest flex items-center gap-4 group"
        >
          <ChevronLeft size={16} />
          LEE YEIN
        </motion.button>
        
        <div className="flex gap-12 text-[10px] font-black tracking-widest uppercase">
          <button 
            onClick={() => setCurrentView('about')}
            className={`${currentView === 'about' ? 'text-amber-glow' : 'opacity-40'} transition-all`}
          >
            About
          </button>
          <button 
            onClick={() => setCurrentView('project')}
            className={`${currentView === 'project' ? 'text-amber-glow' : 'opacity-40'} transition-all`}
          >
            Project
          </button>
          <button 
            onClick={() => setCurrentView('contact')}
            className={`${currentView === 'contact' ? 'text-amber-glow' : 'opacity-40'} transition-all`}
          >
            Contact
          </button>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {currentView === 'about' ? (
          <motion.main 
            key="about"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-48 px-12 md:px-24 pb-48"
          >
            <section className="max-w-7xl mx-auto mb-48">
              <div className="mb-24">
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="text-2xl md:text-3xl font-black text-amber-glow tracking-tight border-l-4 border-amber-glow pl-8 py-4 mb-20 max-w-4xl italic"
                >
                  "당연하게 여겨지는 불편함 속에서 저는 콘텐츠의 시작점을 발견합니다."
                </motion.p>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-end gap-20">
                <div className="max-w-2xl relative">
                  <h2 className="text-xl font-black mb-8 text-amber-glow tracking-widest uppercase flex items-center gap-4">
                    <span className="w-12 h-[1px] bg-amber-glow"></span>
                    Identity
                  </h2>
                  <div className="space-y-6">
                    <p className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1] text-ink break-keep">
                      불안정함 속에서<br />
                      기회를 포착하는 <span className="text-amber-glow">기획자.</span>
                    </p>
                    <p className="text-lg md:text-xl font-light text-stone-500 leading-relaxed max-w-lg break-keep italic">
                      "현상을 면밀히 관찰하여 핵심 문제점을 파악하고, 타인이 깊이 공감할 수 있는 서사를 설계하여 실체 있는 해답을 제시합니다."
                    </p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end border-r-4 border-amber-glow/30 pr-8 py-4">
                   <h3 className="text-5xl font-black tracking-tighter mb-2">이예인</h3>
                   <span className="text-xl font-light text-stone-400 mb-6 uppercase tracking-widest">Lee Yein</span>
                   <p className="text-amber-glow font-bold text-lg mb-4">2006. 09. 30</p>
                   <div className="space-y-1 text-ink font-bold text-sm tracking-tight text-right">
                     <p>한성대학교</p>
                     <p className="opacity-100">영미문화콘텐츠트랙 & 문학문화콘텐츠학과</p>
                   </div>
                </div>
              </div>
            </section>

            <section className="mb-48">
              <div className="px-8 py-32 bg-ink/5 border-l-8 border-amber-glow rounded-r-3xl">
                <div className="flex flex-col lg:flex-row gap-20 items-center">
                  <div className="flex-1">
                    <h4 className="text-[10px] font-black tracking-[0.6em] uppercase mb-8 text-amber-glow">Proof of Insight</h4>
                    <motion.h1 
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ duration: 1 }}
                      className="text-4xl md:text-6xl font-black leading-tight tracking-tighter text-ink mb-12"
                    >
                      ‘나도 작가’ 프로젝트<br />작가 선정
                    </motion.h1>
                    <div className="space-y-8">
                      <p className="text-xl md:text-2xl font-medium text-ink/80 leading-relaxed italic border-l-2 border-ink/20 pl-6">
                        "불편함 속에서 기회를 찾고, 문학적 통찰로 해답을 제시합니다."
                      </p>
                      <p className="text-base text-stone-500 font-light leading-relaxed max-w-xl break-keep">
                        이 성취는 일상의 작고 불편한 조각들을 놓치지 않고 발견하여 하나의 완성된 서사(해답)로 엮어내는 저만의 날카로운 기획적 통찰력을 증명하는 유의미한 지표입니다.
                      </p>
                      <motion.a 
                        whileHover={{ x: 10 }}
                        href="https://www.kihoilbo.co.kr/news/articleView.html?idxno=1093674"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 text-sm font-black text-ink group"
                      >
                        <span className="border-b-2 border-amber-glow pb-1 group-hover:border-ink transition-colors">기사에서 성취 확인하기</span>
                        <ArrowRight size={18} className="text-amber-glow" />
                      </motion.a>
                    </div>
                  </div>
                  <div className="w-full lg:w-1/3 flex justify-center">
                     <div className="relative group">
                       <div className="absolute inset-0 bg-amber-glow/20 blur-2xl rounded-full scale-110 group-hover:bg-amber-glow/40 transition-all duration-700" />
                       <HandsSVG strokeColor="#1c1917" scale={1.2} />
                     </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="max-w-7xl mx-auto pb-48">
              <div className="grid md:grid-cols-3 gap-24">
                {[
                  { id: '01', title: 'Problem Solving', desc: '현상 뒤에 숨겨진 문제점을 날카롭게 포착하고 전략적인 해답을 도출하는 기획 프로세스를 지향합니다.' },
                  { id: '02', title: 'Storytelling', desc: '사람의 마음을 움직이는 구조를 설계합니다. 단순한 정보를 넘어 깊은 공감대를 형성하는 기획의 힘을 믿습니다.' },
                  { id: '03', title: 'Communication', desc: '학생회 및 도서부 리더십 활동을 통해 증명된, 구성원의 다양한 니즈를 조율하고 가치를 창출하는 소통 능력.' }
                ].map(cap => (
                  <div key={cap.id} className="group cursor-pointer">
                    <span className="text-xs font-black text-amber-glow mb-6 block tracking-widest">{cap.id} / Capabilities</span>
                    <div className="h-px w-full bg-ink/10 mb-8 group-hover:bg-amber-glow transition-colors duration-500" />
                    <h5 className="text-3xl font-black mb-6 group-hover:translate-x-4 transition-transform duration-500">{cap.title}</h5>
                    <p className="text-stone-500 font-light leading-relaxed">{cap.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </motion.main>
        ) : currentView === 'project' ? (
          <motion.main 
            key="project"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-48 px-12 md:px-24 pb-48"
          >
            <div className="max-w-7xl mx-auto">
              {/* Header Info */}
              <div className="mb-24 flex items-center gap-10">
                <div className="w-12 h-px bg-amber-glow" />
                <h4 className="text-[10px] font-black tracking-[0.8em] uppercase text-amber-glow">Select Archives</h4>
                <div className="flex-1 h-px bg-ink/5" />
                <div className="text-[10px] font-black text-stone-300 tracking-widest italic">INDEX. 0{projectIndex + 1} / 0{projects.length}</div>
              </div>

              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={projectIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="grid lg:grid-cols-[1.2fr_1fr] border border-ink/5 rounded-[40px] overflow-hidden bg-white/30 backdrop-blur-sm shadow-2xl shadow-ink/5"
                  >
                    {/* Left: Content Box */}
                    <div className="p-12 md:p-16 border-r border-ink/5 flex flex-col justify-between h-full min-h-[500px]">
                      <div>
                        <div className="flex gap-3 mb-10">
                          {projects[projectIndex].keywords?.map((kw, idx) => (
                            <span key={idx} className="text-[9px] font-black text-amber-glow uppercase tracking-[0.2em] bg-amber-glow/5 border border-amber-glow/10 px-3 py-1 rounded-full">
                              {kw}
                            </span>
                          ))}
                        </div>
                        
                        <h3 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter mb-12 whitespace-pre-line text-ink">
                          {projects[projectIndex].title}
                        </h3>

                        <div className="flex items-center gap-4 mb-10 opacity-40">
                          <span className="text-[10px] font-black text-stone-500 tracking-[0.4em] uppercase">{projects[projectIndex].category}</span>
                          <div className="h-px flex-1 bg-ink" />
                        </div>
                      </div>

                      <div className="pt-10 border-t border-ink/5 flex flex-wrap gap-8 items-end justify-between">
                        <div className="space-y-1">
                           <h5 className="text-[9px] font-black text-stone-300 uppercase tracking-widest leading-none mb-1">Involvement / Role</h5>
                           <p className="text-sm font-black text-ink">{projects[projectIndex].role}</p>
                        </div>
                        
                        {projects[projectIndex].link && (
                          <motion.a 
                            whileHover={{ scale: 1.05 }}
                            href={projects[projectIndex].link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-ink text-sand-beige px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-amber-glow hover:text-ink transition-all shadow-lg"
                          >
                            Explore Full Details
                          </motion.a>
                        )}
                      </div>
                    </div>

                    {/* Right: Narrative Box */}
                    <div className="p-12 md:p-16 bg-stone-50/50 flex flex-col justify-between h-full relative">
                      <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                         <HandsSVG strokeColor="#1c1917" scale={0.6} />
                      </div>

                      <div className="relative z-10">
                         <div className="w-12 h-px bg-amber-glow mb-10" />
                         <p className="text-lg md:text-xl font-light text-stone-500 leading-relaxed break-keep leading-extra-relaxed italic">
                           "{projects[projectIndex].description}"
                         </p>
                      </div>

                      {/* Integrated Navigation */}
                      <div className="flex justify-between items-center bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-white mt-12">
                        <div className="flex gap-2 ml-2">
                           {projects.map((_, idx) => (
                             <div 
                               key={idx} 
                               className={`h-1 rounded-full transition-all duration-500 ${idx === projectIndex ? 'w-10 bg-amber-glow' : 'w-4 bg-ink/10'}`} 
                             />
                           ))}
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={prevProject} 
                            className="w-12 h-12 rounded-xl flex items-center justify-center bg-ink/5 hover:bg-ink hover:text-sand-beige transition-all group"
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <button 
                            onClick={nextProject} 
                            className="w-12 h-12 rounded-xl flex items-center justify-center bg-ink/5 hover:bg-ink hover:text-sand-beige transition-all group"
                          >
                            <ChevronRight size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.main>
        ) : (
          <motion.main 
            key="contact"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pt-48 px-12 md:px-24 pb-48 flex flex-col items-center justify-center min-h-[90vh] text-center"
          >
            <div className="max-w-4xl mx-auto flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.15 }}
                transition={{ delay: 0.2 }}
                className="mb-12"
              >
                <HandsSVG strokeColor="#1c1917" scale={2} />
              </motion.div>
              
              <h2 className="text-4xl md:text-7xl font-black text-ink mb-12 break-keep leading-tight">
                더 나은 질문을 던지고,<br />
                함께 답을 찾아갈 파트너를 기다립니다.
              </h2>
              
              <div className="w-24 h-1 bg-amber-glow mx-auto mb-16" />
              
              <div className="space-y-4">
                <span className="text-[12px] font-black text-stone-400 uppercase tracking-[0.6em]">Representative Contact</span>
                <p className="text-5xl md:text-7xl font-black text-ink tracking-tighter hover:text-amber-glow transition-colors cursor-pointer">
                  010-2309-4311
                </p>
              </div>
              
              <div className="mt-24 pt-12 border-t border-ink/5 flex flex-col items-center gap-6">
                <p className="text-stone-400 font-light italic">"작은 불편함을 놓치지 않고 완성된 서사로 이어냅니다."</p>
                <div className="flex gap-6">
                   <div className="w-2 h-2 rounded-full bg-amber-glow animate-ping" />
                   <div className="w-2 h-2 rounded-full bg-amber-glow" />
                   <div className="w-2 h-2 rounded-full bg-amber-glow/40" />
                </div>
              </div>
            </div>
          </motion.main>
        )}
      </AnimatePresence>

      <footer className="w-full py-24 text-center">
        <span className="text-[10px] font-black tracking-[1em] opacity-10 uppercase">Shader Strategy / Connection / 2026</span>
      </footer>
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState<'intro' | 'selection' | 'main'>('intro');
  const [initialView, setInitialView] = useState<'about' | 'project'>('about');

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <IntroScreen key="intro" onFinish={() => setStep('selection')} />
        )}
        {step === 'selection' && (
          <SelectionScreen 
            key="selection" 
            onBack={() => setStep('intro')}
            onSelect={(v) => {
              setInitialView(v);
              setStep('main');
            }} 
          />
        )}
        {step === 'main' && (
          <MainContent 
            key="main" 
            initialSection={initialView} 
            onBack={() => setStep('selection')} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
