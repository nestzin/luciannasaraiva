"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from "lucide-react";

export default function Player({ url }: { url: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isMobile, setIsMobile] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  // NOVO ESTADO: Verifica se o utilizador já deu o primeiro Play
  const [hasStarted, setHasStarted] = useState(false); 
  
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  }, []);

  const formatTime = (sec: number) => {
    if (isNaN(sec)) return "00:00";
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    // Marca que o vídeo já começou a rolar pela primeira vez
    if (!hasStarted) {
      setHasStarted(true);
    }

    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
    
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
    if (!isMuted && volume === 0) setVolume(1);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
    setIsMuted(val === 0);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const dur = videoRef.current.duration;
    setCurrentTime(current);
    if (dur > 0) {
      setDuration(dur);
      setProgress((current / dur) * 100);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = percent * videoRef.current.duration;
  };

  const changeSpeed = (s: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = s;
    setSpeed(s);
    setShowSpeedMenu(false);
  };

  const toggleFullScreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) containerRef.current.requestFullscreen().catch(err => console.log(err));
    else document.exitFullscreen();
  };

  const volPercent = Math.round((isMuted ? 0 : volume) * 100);

  if (isMobile) {
    return (
      <div className="relative w-full h-full bg-black flex-shrink-0">
        <video src={url} className="w-full h-full object-contain" controls playsInline preload="metadata" controlsList="nodownload" />
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full bg-black flex-shrink-0 group overflow-hidden select-none" 
      onMouseEnter={() => setIsHovering(true)} 
      onMouseLeave={() => { setIsHovering(false); setShowSpeedMenu(false); }}
    >
      <video 
        ref={videoRef} 
        src={url} 
        preload="metadata" 
        className="w-full h-full object-contain cursor-pointer" 
        onTimeUpdate={handleTimeUpdate} 
        onLoadedMetadata={handleTimeUpdate} 
        onClick={togglePlay} 
        onEnded={() => setIsPlaying(false)} 
      />

      {/* Sombra de fundo: só aparece se o vídeo já tiver começado */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent transition-opacity duration-300 pointer-events-none ${hasStarted && (isHovering || !isPlaying) ? 'opacity-100' : 'opacity-0'}`} />

      {/* Botão Play Gigante (Aparece sempre que está pausado, antes ou depois de começar) */}
      {!isPlaying && (
        <button onClick={togglePlay} className="absolute inset-0 m-auto w-24 h-24 bg-[#964F4C]/90 text-white rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(150,79,76,0.5)] backdrop-blur-sm transition-all hover:scale-110 z-10">
          <Play className="w-12 h-12 ml-2" fill="currentColor" />
        </button>
      )}

      {/* BARRA DE CONTROLES: Só desliza para cima se o vídeo já tiver começado (hasStarted) */}
      <div className={`absolute bottom-0 left-0 right-0 p-5 transition-transform duration-300 ${hasStarted && (isHovering || !isPlaying) ? 'translate-y-0' : 'translate-y-full'}`}>
        
        <div className="w-full h-1.5 bg-white/20 rounded-full mb-5 cursor-pointer hover:h-2.5 transition-all group/bar relative" onClick={handleSeek}>
          <div className="h-full bg-[#C99B53] rounded-full relative shadow-[0_0_12px_rgba(201,155,83,0.9)] transition-all ease-out duration-75" style={{ width: `${progress}%` }}>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover/bar:opacity-100 transition-opacity" />
          </div>
        </div>

        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-5">
            <button onClick={togglePlay} className="hover:text-[#C99B53] transition-colors focus:outline-none hover:scale-110">
              {isPlaying ? <Pause className="w-7 h-7" fill="currentColor" /> : <Play className="w-7 h-7" fill="currentColor" />}
            </button>
            
            <div className="flex items-center group/volume relative h-8">
              <button onClick={toggleMute} className="hover:text-[#C99B53] transition-colors focus:outline-none z-10 hover:scale-110">
                {isMuted || volume === 0 ? <VolumeX className="w-7 h-7" /> : <Volume2 className="w-7 h-7" />}
              </button>
              
              <div className="w-0 opacity-0 overflow-hidden group-hover/volume:w-36 group-hover/volume:opacity-100 transition-all duration-300 ease-in-out flex items-center pl-3 origin-left">
                {/* CSS NÍTIDO E PROFISSIONAL PARA A BOLINHA DO VOLUME */}
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={isMuted ? 0 : volume} 
                  onChange={handleVolumeChange} 
                  className="w-20 h-1.5 rounded-full appearance-none cursor-pointer outline-none transition-all
                  bg-transparent
                  [&::-webkit-slider-thumb]:appearance-none 
                  [&::-webkit-slider-thumb]:w-3.5 
                  [&::-webkit-slider-thumb]:h-3.5 
                  [&::-webkit-slider-thumb]:rounded-full 
                  [&::-webkit-slider-thumb]:bg-white 
                  [&::-webkit-slider-thumb]:shadow-[0_2px_5px_rgba(0,0,0,0.5)]
                  [&::-moz-range-thumb]:appearance-none 
                  [&::-moz-range-thumb]:border-none
                  [&::-moz-range-thumb]:w-3.5 
                  [&::-moz-range-thumb]:h-3.5 
                  [&::-moz-range-thumb]:rounded-full 
                  [&::-moz-range-thumb]:bg-white 
                  [&::-moz-range-thumb]:shadow-[0_2px_5px_rgba(0,0,0,0.5)]" 
                  style={{ background: `linear-gradient(to right, #C99B53 ${volPercent}%, rgba(255,255,255,0.2) ${volPercent}%)` }} 
                />
                <span className="text-[11px] font-bold font-mono text-white/90 ml-2 w-8 text-right">{volPercent}%</span>
              </div>
            </div>

            <div className="text-sm font-medium text-white/90 font-mono tracking-wide ml-2 bg-black/40 px-3 py-1 rounded-md border border-white/10">
              {formatTime(currentTime)} <span className="text-white/40 mx-1">/</span> {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center gap-5 relative">
            {showSpeedMenu && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-12 right-12 bg-black/95 backdrop-blur-xl rounded-xl p-2 flex flex-col gap-1 min-w-[120px] border border-white/10 shadow-2xl z-50">
                {[0.5, 1, 1.25, 1.5, 2].map((s) => (
                  <button key={s} onClick={() => changeSpeed(s)} className={`text-sm py-2 px-3 rounded-lg text-left transition-colors ${speed === s ? 'bg-[#C99B53] text-white font-bold' : 'text-white/80 hover:bg-white/20'}`}>
                    {s}x {s === 1 && <span className="text-xs opacity-60 ml-1">(Normal)</span>}
                  </button>
                ))}
              </motion.div>
            )}
            
            <button onClick={() => setShowSpeedMenu(!showSpeedMenu)} className="flex items-center gap-1.5 text-sm font-bold hover:text-[#C99B53] hover:bg-white/10 transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 focus:outline-none">
              <Settings className="w-4 h-4" /> {speed}x
            </button>

            <button onClick={toggleFullScreen} className="hover:text-[#C99B53] transition-colors focus:outline-none hover:scale-110">
              <Maximize className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}