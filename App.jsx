import React, { useState, useEffect } from 'react';
import { Wind, ArrowUp, ArrowRight, Info, Fan, Thermometer, Box, MinusCircle, PlusCircle, Grid, Eye, RotateCw, CheckCircle } from 'lucide-react';

const AirflowSimulator = () => {
  const [activeView, setActiveView] = useState('overview');
  const [showHeat, setShowHeat] = useState(false);
  const [fanCount, setFanCount] = useState(3); 
  const [fanSpinSpeed, setFanSpinSpeed] = useState('animate-spin-slow');

  // Estado para o comparador visual
  const [compareMode, setCompareMode] = useState('intake'); // 'intake' ou 'exhaust'

  useEffect(() => {
    if (showHeat) {
      setFanSpinSpeed('animate-spin-fast');
    } else {
      setFanSpinSpeed('animate-spin-slow');
    }
  }, [showHeat]);

  const sections = {
    overview: {
      title: "Visão Geral",
      description: "O segredo dos gabinetes aquário é o efeito chaminé (ar quente sobe) somado à pressão positiva lateral.",
      details: "O ar frio entra por baixo e pela lateral, resfria a GPU e CPU, e o ar quente é expulso por cima e por trás."
    },
    bottom: {
      title: "Inferior",
      role: "Admissão (Intake)",
      fanType: "Reverse Blade",
      why: "Esta é a entrada de ar principal para a GPU. Usamos fans 'Reverse' aqui para que o lado bonito (hélices) fique visível, mas o ar seja puxado para cima."
    },
    side: {
      title: "Lateral",
      role: "Admissão (Intake)",
      fanType: "Reverse Blade",
      why: "Compensa a falta de ar frontal. Joga ar fresco direto na placa mãe/VRM. Fans 'Reverse' mantêm a estética sem mostrar a grade traseira."
    },
    top: {
      title: "Topo",
      role: "Exaustão (Exhaust)",
      fanType: "Padrão (Forward)",
      why: "O ar quente sobe naturalmente. Fans padrão aqui empurram o ar para fora e mostram o lado bonito para quem olha de baixo."
    },
    rear: {
      title: "Traseira",
      role: "Exaustão (Exhaust)",
      fanType: "Padrão (Forward)",
      why: "Remove o calor residual do CPU Cooler. Fan padrão é o ideal aqui."
    }
  };

  const currentInfo = sections[activeView];
  const fansArray = Array.from({ length: fanCount }, (_, i) => i);

  const getSectionStyle = (sectionName) => {
    const isOverview = activeView === 'overview';
    const isActive = activeView === sectionName;
    const opacity = (isOverview || isActive) ? 'opacity-100' : 'opacity-40';
    const transform = isActive ? 'scale-105 md:scale-110 z-20' : 'scale-100 z-10';
    return `${opacity} ${transform}`;
  };

  const getArrowOpacity = (sectionName) => {
     return (activeView === 'overview' || activeView === sectionName) ? 'opacity-100' : 'opacity-0 md:opacity-30';
  };
  
  const ParticleGenerator = ({ type, direction, count = 8, width = '100%', height = '100%' }) => {
    return (
      <div className="absolute pointer-events-none overflow-visible" style={{ width, height, zIndex: 5 }}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${type === 'cold' ? 'bg-cyan-400 shadow-[0_0_4px_#22d3ee]' : 'bg-red-500 shadow-[0_0_4px_#ef4444]'} ${direction === 'up' ? 'animate-particle-up' : 'animate-particle-left'}`}
            style={{
              width: Math.random() > 0.5 ? '3px' : '2px',
              height: Math.random() > 0.5 ? '3px' : '2px',
              left: direction === 'up' ? `${Math.random() * 100}%` : '100%',
              top: direction === 'left' ? `${Math.random() * 100}%` : '100%',
              opacity: 0,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1.5 + Math.random()}s`
            }}
          />
        ))}
      </div>
    );
  };

  // Componente Visual da Fan para Comparação
  const FanVisual = ({ type, mode }) => {
    let showPrettyFace = false;

    if (type === 'standard') {
      if (mode === 'intake') showPrettyFace = false;
      if (mode === 'exhaust') showPrettyFace = true;
    } else {
      if (mode === 'intake') showPrettyFace = true;
      if (mode === 'exhaust') showPrettyFace = false;
    }

    return (
      <div className="relative w-24 h-24 md:w-32 md:h-32 bg-slate-800 rounded-xl border-4 border-slate-600 flex items-center justify-center overflow-hidden shadow-xl group transition-all">
        <div className={`absolute inset-2 rounded-full border-2 border-slate-700 opacity-80 ${fanSpinSpeed}`}>
             <div className="absolute inset-0 border-t-8 border-transparent border-l-8 border-slate-500/50 rounded-full"></div>
             <div className="absolute inset-0 border-b-8 border-transparent border-r-8 border-slate-500/50 rounded-full rotate-45"></div>
        </div>
        
        <div className="absolute w-8 h-8 md:w-10 md:h-10 bg-slate-700 rounded-full border border-slate-500 z-10 flex items-center justify-center">
             <span className="text-[8px] md:text-[10px] font-bold text-slate-400">{type === 'standard' ? 'STD' : 'REV'}</span>
        </div>

        {!showPrettyFace && (
          <div className="absolute inset-0 z-20 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full">
               <div className="absolute top-1/2 left-1/2 w-[140%] h-2 bg-slate-900 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
               <div className="absolute top-1/2 left-1/2 w-[140%] h-2 bg-slate-900 -translate-x-1/2 -translate-y-1/2 -rotate-45"></div>
            </div>
            <div className="absolute top-1/2 left-1/2 w-8 h-8 md:w-11 md:h-11 bg-slate-900 rounded-full -translate-x-1/2 -translate-y-1/2 border border-slate-600 flex items-center justify-center">
                 <span className="text-[6px] md:text-[8px] text-slate-500">12V</span>
            </div>
          </div>
        )}

        {showPrettyFace && (
           <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-transparent pointer-events-none"></div>
        )}

        <div className="absolute -right-8 md:-right-12 top-1/2 -translate-y-1/2 flex flex-col items-center">
            {mode === 'intake' ? (
                <div className="flex flex-col items-center animate-pulse">
                    <span className="text-[10px] md:text-xs text-blue-400 font-bold mb-1">AR</span>
                    <ArrowUp size={20} className="text-blue-500 rotate-0 md:w-6 md:h-6" />
                </div>
            ) : (
                <div className="flex flex-col items-center opacity-50">
                     <span className="text-[10px] md:text-xs text-red-400 font-bold mb-1">AR</span>
                     <ArrowUp size={20} className="text-red-500 rotate-180 md:w-6 md:h-6" />
                </div>
            )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-2 md:p-8 font-sans overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6 md:mb-8 text-center px-2">
          <h1 className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-2 leading-tight">
            Guia de Airflow: Gabinete Aquário
          </h1>
          <p className="text-sm md:text-base text-slate-400">Entenda a física e escolha as fans corretas (Forward vs Reverse)</p>
        </header>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12">
          {/* Controls & Info Panel - Mobile Order 2 */}
          <div className="order-2 lg:order-1 lg:col-span-1 space-y-4 md:space-y-6">
            <div className="bg-slate-800 rounded-xl p-4 md:p-6 shadow-lg border border-slate-700">
              <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center gap-2">
                <Box size={20} className="text-cyan-400" /> 
                Selecione a Área
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(sections).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActiveView(key)}
                    className={`p-2 md:p-3 rounded-lg text-xs md:text-sm font-medium transition-all touch-manipulation ${
                      activeView === key 
                        ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' 
                        : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                    }`}
                  >
                    {sections[key].title}
                  </button>
                ))}
              </div>

              <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-slate-700 space-y-3 md:space-y-4">
                {/* Heat Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <Thermometer size={16} /> Modo Carga (Calor)
                  </span>
                  <button 
                    onClick={() => setShowHeat(!showHeat)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors touch-manipulation ${showHeat ? 'bg-red-500' : 'bg-slate-600'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showHeat ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                {/* Fan Count Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <Grid size={16} /> Fans por lado
                  </span>
                  <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-600">
                    <button 
                      onClick={() => setFanCount(2)}
                      className={`px-3 py-1 rounded text-xs font-bold transition-colors touch-manipulation ${fanCount === 2 ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      2x
                    </button>
                    <button 
                      onClick={() => setFanCount(3)}
                      className={`px-3 py-1 rounded text-xs font-bold transition-colors touch-manipulation ${fanCount === 3 ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      3x
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-4 md:p-6 shadow-lg border border-slate-700 min-h-[160px]">
              <h3 className="text-base md:text-lg font-bold text-cyan-400 mb-2">{currentInfo.title}</h3>
              
              {activeView !== 'overview' && (
                <div className="mb-3 md:mb-4 inline-flex items-center px-2 py-1 md:px-3 rounded-full bg-slate-700 text-[10px] md:text-xs font-mono text-cyan-200 border border-cyan-500/30">
                  <Fan size={12} className="mr-2" />
                  Recomendado: {currentInfo.fanType}
                </div>
              )}
              
              <p className="text-slate-300 leading-relaxed text-xs md:text-sm mb-3">
                {currentInfo.description || currentInfo.why}
              </p>

              {currentInfo.details && (
                <p className="text-slate-400 text-xs md:text-sm italic border-l-2 border-cyan-500 pl-3">
                  {currentInfo.details}
                </p>
              )}
            </div>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-2 bg-slate-800/50 rounded-xl p-2 md:p-8 border border-slate-700 relative overflow-hidden min-h-[400px] md:min-h-[500px] flex flex-col items-center justify-center">
            
            {/* Legenda */}
            <div className="absolute top-2 left-2 md:top-4 md:left-4 z-10 bg-slate-900/50 p-2 rounded border border-slate-700/50 backdrop-blur-sm">
              <span className="flex items-center gap-2 text-[10px] md:text-xs font-mono text-slate-400">
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-blue-500"></div> Ar Frio (Entrada)
              </span>
              <span className="flex items-center gap-2 text-[10px] md:text-xs font-mono text-slate-400 mt-1">
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-500"></div> Ar Quente (Saída)
              </span>
            </div>

            {/* The Case Diagram (CSS Art) */}
            <div className="relative w-full max-w-[280px] md:max-w-md aspect-[3/4] md:aspect-square bg-slate-900/80 border-4 border-slate-600 rounded-lg shadow-2xl p-2 md:p-4 transition-all duration-500 mt-14 mb-5 mx-auto">
              
              {/* Glass Panels Hint */}
              <div className="absolute top-0 right-0 w-1/3 h-full border-l border-slate-700/50 bg-gradient-to-l from-blue-500/5 to-transparent pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-full h-1/3 border-t border-slate-700/50 bg-gradient-to-t from-blue-500/5 to-transparent pointer-events-none"></div>

              {/* MOTHERBOARD AREA */}
              <div className="absolute top-[15%] left-[15%] right-[15%] bottom-[15%] bg-slate-800 border border-slate-600 rounded flex flex-col items-center justify-center z-10">
                <span className="text-slate-600 font-bold text-2xl md:text-4xl opacity-20 mt-10 select-none">MOBO</span>
                
                {/* CPU Cooler */}
                <div className={`absolute top-[20%] w-16 h-16 md:w-24 md:h-24 bg-slate-700 rounded-lg border-2 border-slate-500 flex items-center justify-center transition-colors duration-1000 ${showHeat ? 'shadow-[0_0_30px_rgba(239,68,68,0.4)]' : ''}`}>
                  <div className={`w-12 h-12 md:w-20 md:h-20 rounded-full border-2 border-slate-400 border-dashed animate-spin ${showHeat ? 'animation-duration-500' : 'animation-duration-2000'}`}></div>
                  <span className="absolute text-[10px] md:text-xs font-bold">CPU</span>
                </div>

                {/* GPU */}
                <div className={`absolute bottom-[20%] w-[90%] h-8 md:h-12 bg-slate-700 rounded border-2 border-slate-500 flex items-center justify-center transition-colors duration-1000 ${showHeat ? 'shadow-[0_0_30px_rgba(239,68,68,0.4)]' : ''}`}>
                  <span className="text-[8px] md:text-xs font-bold tracking-widest text-center px-1">PLACA DE VÍDEO</span>
                </div>
              </div>

              {/* FANS & AIRFLOW LAYERS */}
              
              {/* TOP FANS (EXHAUST) */}
              <div className={`absolute top-1 md:top-2 left-0 right-0 h-8 md:h-12 flex justify-center gap-1 md:gap-2 px-4 md:px-8 transition-all duration-300 ${getSectionStyle('top')}`}>
                <div className="absolute inset-0 flex items-center justify-center w-full gap-1 md:gap-2">
                   {fansArray.map(i => (
                    <div key={`top-${i}`} className="flex-1 bg-slate-700 rounded border border-slate-500 flex items-center justify-center relative group">
                      <Fan className={`text-red-400 w-3 h-3 md:w-5 md:h-5 ${fanSpinSpeed}`} />
                      <div className={`absolute -top-4 md:-top-6 flex flex-col items-center animate-bounce transition-opacity duration-300 ${getArrowOpacity('top')}`}>
                        <ArrowUp className="text-red-500 w-3 h-3 md:w-5 md:h-5" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className={`absolute top-2 left-8 right-8 h-16 md:h-20 transition-opacity duration-300 ${getArrowOpacity('top')}`}>
                   <ParticleGenerator type="hot" direction="up" count={8} />
                </div>
              </div>

              {/* REAR FAN (EXHAUST) */}
              <div className={`absolute top-[25%] left-1 md:left-2 w-6 md:w-10 h-16 md:h-24 flex flex-col justify-center transition-all duration-300 ${getSectionStyle('rear')}`}>
                <div className="w-full h-full bg-slate-700 rounded border border-slate-500 flex items-center justify-center relative">
                  <Fan className={`text-red-400 w-3 h-3 md:w-5 md:h-5 ${fanSpinSpeed}`} />
                  <div className={`absolute -left-4 md:-left-6 flex items-center animate-pulse transition-opacity duration-300 ${getArrowOpacity('rear')}`}>
                    <ArrowUp className="text-red-500 -rotate-90 w-3 h-3 md:w-5 md:h-5" />
                  </div>
                  <div className={`absolute top-0 bottom-0 right-[-10px] md:right-[-20px] w-12 md:w-20 h-full transition-opacity duration-300 ${getArrowOpacity('rear')}`}>
                     <ParticleGenerator type="hot" direction="left" count={4} />
                  </div>
                </div>
              </div>

              {/* BOTTOM FANS (INTAKE) */}
              <div className={`absolute bottom-1 md:bottom-2 left-0 right-0 h-8 md:h-12 flex justify-center gap-1 md:gap-2 px-4 md:px-8 transition-all duration-300 ${getSectionStyle('bottom')}`}>
                 <div className="absolute inset-0 flex items-center justify-center w-full gap-1 md:gap-2">
                  {fansArray.map(i => (
                    <div key={`bot-${i}`} className="flex-1 bg-slate-700 rounded border border-slate-500 flex items-center justify-center relative">
                      <Fan className={`text-blue-400 w-3 h-3 md:w-5 md:h-5 ${fanSpinSpeed}`} />
                      <div className={`absolute -top-10 md:-top-16 flex flex-col items-center animate-pulse transition-opacity duration-300 ${getArrowOpacity('bottom')}`}>
                        <div className="h-6 md:h-10 w-0.5 bg-gradient-to-t from-blue-500 to-transparent"></div>
                        <ArrowUp className="text-blue-500 w-3 h-3 md:w-4 md:h-4" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className={`absolute bottom-0 left-8 right-8 h-16 md:h-20 transition-opacity duration-300 ${getArrowOpacity('bottom')}`}>
                   <ParticleGenerator type="cold" direction="up" count={8} />
                </div>
              </div>

              {/* SIDE FANS (INTAKE) */}
              <div className={`absolute top-[20%] right-1 md:right-2 w-6 md:w-10 h-[60%] flex flex-col justify-center gap-1 md:gap-2 transition-all duration-300 ${getSectionStyle('side')}`}>
                {fansArray.map(i => (
                  <div key={`side-${i}`} className="flex-1 bg-slate-700 rounded border border-slate-500 flex items-center justify-center relative">
                     <Fan className={`text-blue-400 w-2.5 h-2.5 md:w-4 md:h-4 ${fanSpinSpeed}`} />
                     <div className={`absolute -left-8 md:-left-12 flex items-center animate-pulse transition-opacity duration-300 ${getArrowOpacity('side')}`}>
                      <ArrowUp className="text-blue-500 -rotate-90 w-3 h-3 md:w-4 md:h-4" />
                      <div className="w-4 md:w-8 h-0.5 bg-gradient-to-l from-blue-500 to-transparent"></div>
                    </div>
                  </div>
                ))}
                 <div className={`absolute top-0 bottom-0 right-0 w-16 md:w-24 h-full transition-opacity duration-300 ${getArrowOpacity('side')}`}>
                    <ParticleGenerator type="cold" direction="left" count={8} />
                 </div>
              </div>

              {/* Center Heat Mixing */}
              {showHeat && (
                <div className="absolute inset-0 pointer-events-none z-0">
                  <div className="absolute top-1/2 left-1/2 w-24 h-24 md:w-32 md:h-32 -translate-x-1/2 -translate-y-1/2 bg-red-500/10 rounded-full blur-2xl animate-pulse"></div>
                  <div className="absolute bottom-1/3 left-1/3 w-16 h-16 md:w-24 md:h-24 bg-blue-500/10 rounded-full blur-xl"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- COMPARADOR VISUAL DE FANS (Seção Intermediária) --- */}
        <div className="bg-slate-800 rounded-xl md:rounded-2xl border border-slate-700 p-4 md:p-8 shadow-xl mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
            <div className="text-center md:text-left">
              <h3 className="text-lg md:text-2xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
                <Eye className="text-cyan-400" /> 
                Comparador Visual
              </h3>
              <p className="text-slate-400 text-xs md:text-sm mt-1">
                Diferença estética ao usar uma fan Forward vs Reverse dentro do gabinete.
              </p>
            </div>
            
            {/* Controles de Modo */}
            <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-600 w-full md:w-auto">
              <button 
                onClick={() => setCompareMode('intake')}
                className={`flex-1 flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 rounded-md text-[10px] md:text-sm font-medium transition-all ${compareMode === 'intake' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                <Wind size={14} className="rotate-90" /> Intake (Entrada)
              </button>
              <button 
                onClick={() => setCompareMode('exhaust')}
                className={`flex-1 flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 rounded-md text-[10px] md:text-sm font-medium transition-all ${compareMode === 'exhaust' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                <Wind size={14} className="-rotate-90" /> Exhaust (Saída)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
          {/* Card Fan Standard */}
          <div className="flex flex-col items-center bg-slate-900/50 p-4 md:p-6 rounded-xl border border-slate-700 relative overflow-hidden">
              <div className="absolute top-0 left-0 bg-slate-700 text-slate-300 text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 rounded-br-lg">FAN PADRÃO</div>
              
              <div className="mb-4 md:mb-6 mt-4">
                  <FanVisual type="standard" mode={compareMode} />
              </div>

              <div className="text-center space-y-1 md:space-y-2">
                  <p className={`font-bold text-sm md:text-lg ${compareMode === 'intake' ? 'text-red-400' : 'text-green-400'}`}>
                      {compareMode === 'intake' ? 'Estética Ruim' : 'Estética Ideal'}
                  </p>
                  <p className="text-xs md:text-sm text-slate-400 px-2 md:px-4 min-h-[3.5rem] flex items-center justify-center">
                      {compareMode === 'intake' 
                          ? "Como entrada de ar, a 'grade' traseira fica visível para quem olha o gabinete."
                          : "Como exaustão, a face bonita fica visível."}
                  </p>
              </div>
          </div>

            {/* Card Fan Reverse */}
            <div className="flex flex-col items-center bg-slate-900/50 p-4 md:p-6 rounded-xl border border-slate-700 relative overflow-hidden">
               <div className="absolute top-0 left-0 bg-cyan-900 text-cyan-200 text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 rounded-br-lg">FAN REVERSE</div>
               
               <div className="mb-4 md:mb-6 mt-4">
                 <FanVisual type="reverse" mode={compareMode} />
               </div>

               <div className="text-center space-y-1 md:space-y-2">
                 <p className={`font-bold text-sm md:text-lg ${compareMode === 'intake' ? 'text-green-400' : 'text-red-400'}`}>
                    {compareMode === 'intake' ? 'Estética Ideal' : 'Estética Ruim'}
                 </p>
                 <p className="text-xs md:text-sm text-slate-400 px-2 md:px-4 min-h-[3.5rem] flex items-center justify-center">
                    {compareMode === 'intake' 
                      ? "O ar entra, mas você continua vendo a face bonita e infinita."
                      : "Como exaustão, você veria a grade traseira."}
                 </p>
               </div>
            </div>
          </div>
        </div>

        {/* --- RESUMO DO CONCEITO (Seção Final) --- */}
        <div className="bg-slate-800 rounded-xl md:rounded-2xl border border-slate-700 p-4 md:p-8 shadow-xl">
          <h3 className="text-lg md:text-2xl font-bold text-white mb-4 md:mb-6 flex items-center gap-2">
            <CheckCircle className="text-green-400" /> Resumo dos Conceitos
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {/* Card Intake */}
            <div className="bg-slate-900/50 p-4 md:p-6 rounded-xl border border-slate-600">
              <h4 className="text-base md:text-lg font-bold text-cyan-400 mb-2 md:mb-3 border-b border-cyan-500/30 pb-2">
                1. Entrada (Intake)
              </h4>
              <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-slate-300">
                <li className="flex items-start gap-1">
                  <span className="font-semibold text-white">Use:</span> Fans Reverse.
                </li>
                <li className="flex items-start gap-1">
                  <span className="font-semibold text-white">Onde:</span> 
                  Parte Inferior e Lateral.
                </li>
                <li className="text-slate-400 text-xs leading-relaxed">
                  As fans laterais empurram o ar frio para GPU e CPU. Usar fans Reverse garante que o lado "bonito" (sem grade) fique visível neste caso.
                </li>
              </ul>
            </div>

            {/* Card Exhaust */}
            <div className="bg-slate-900/50 p-4 md:p-6 rounded-xl border border-slate-600">
              <h4 className="text-base md:text-lg font-bold text-red-400 mb-2 md:mb-3 border-b border-red-500/30 pb-2">
                2. Saída (Exhaust)
              </h4>
              <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-slate-300">
                <li className="flex items-start gap-1">
                  <span className="font-semibold text-white">Use:</span> Fans Padrão (Forward).
                </li>
                <li className="flex items-start gap-1">
                  <span className="font-semibold text-white">Onde:</span> 
                  Topo e Traseira.
                </li>
                <li className="text-slate-400 text-xs leading-relaxed">
                  Fans do topo aceleram a subida do ar quente (convecção). Fans padrão aqui mostram a face bonita para baixo enquanto expelem o ar.
                </li>
              </ul>
            </div>

            {/* Card Pressão Positiva */}
            <div className="bg-slate-900/50 p-4 md:p-6 rounded-xl border border-slate-600">
              <h4 className="text-base md:text-lg font-bold text-green-400 mb-2 md:mb-3 border-b border-green-500/30 pb-2">
                3. Dinâmica de Airflow
              </h4>
              <ul className="space-y-4">
                <li className="text-xs text-slate-400 leading-relaxed mb-4">
                  <span className="font-semibold text-white"> Pressão Negativa (Mais saída):</span> Prioriza o resfriamento, pois o ar quente sai rápido, mas suga poeira por todas as frestas do gabinete.
                </li>
                <li className="text-xs text-slate-400 leading-relaxed mb-4">
                  <span className="font-semibold text-white"> Pressão Positiva (Mais entrada):</span> Prioriza a limpeza. O ar é empurrado para fora pelas frestas, evitando poeira, mas pode criar bolsões de calor interno.
                </li>
                <li className="text-xs text-slate-400 leading-relaxed mb-4">
                  <span className="font-semibold text-white"> Fonte (PSU):</span> Pode contar como exaustor (saída) se montada na parte superior.
                </li>
              </ul>
              <div className="bg-green-500/10 p-2 md:p-3 rounded-lg border border-green-500/20 mt-4">
                <p className="text-[10px] md:text-xs text-green-300">
                  O equilíbrio é o ideal, mas recomenda-se ter uma leve pressão positiva (mais ar entrando que saindo) para reduzir a manutenção com limpeza.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-12 pt-6">
          <div className="text-center text-slate-500 text-xs md:text-sm mt-4 mb-6 px-2">
            <p>Nota: Este guia foca na estética e dinâmica de airflow em gabinetes aquário. Sempre considere as especificações dos componentes e recomendações dos fabricantes para resfriamento ideal.</p>
          </div>
        </div>

      </div>

      <style>{`
        .animate-spin-slow { animation: spin 3s linear infinite; }
        .animate-spin-fast { animation: spin 0.5s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .animate-particle-up { animation: particleUp 2s linear infinite; }
        @keyframes particleUp {
          0% { transform: translateY(10px); opacity: 0; }
          20% { opacity: 0.8; }
          100% { transform: translateY(-80px); opacity: 0; }
        }

        .animate-particle-left { animation: particleLeft 2s linear infinite; }
        @keyframes particleLeft {
          0% { transform: translateX(10px); opacity: 0; }
          20% { opacity: 0.8; }
          100% { transform: translateX(-80px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default AirflowSimulator;