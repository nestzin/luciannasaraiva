"use client";

import { motion } from "framer-motion";
import { Clock, Flame, PlayCircle, X, ChefHat, Check, UtensilsCrossed, Sparkles } from "lucide-react";
import { Receita } from "../lib/receitas";
import Player from "./Player";

export default function ModalReceita({ receita, fecharModal }: { receita: Receita; fecharModal: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6 md:p-12">
      
      {/* Fundo escuro (neutro) */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
        onClick={fecharModal} className="absolute inset-0 bg-black/60 backdrop-blur-md" 
      />

      <motion.div 
        initial={{ opacity: 0, y: "100%" }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: "100%" }} 
        transition={{ type: "spring", damping: 28, stiffness: 220 }} 
        className="relative w-full h-[90vh] sm:h-auto sm:max-h-[88vh] sm:max-w-4xl bg-gradient-to-br from-[#efdfcb] to-[#d6d4d4] rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.6)] flex flex-col border border-[#bd9a4f]/40"
      >
        
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#bd9a4f]/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#975956]/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="absolute top-3 left-0 right-0 flex justify-center z-50 sm:hidden pointer-events-none">
          <div className="w-12 h-1.5 bg-[#bd9a4f]/50 backdrop-blur-xl rounded-full shadow-sm" />
        </div>

        <button onClick={fecharModal} className="absolute top-4 right-4 sm:top-5 sm:right-5 z-50 bg-[#bd9a4f]/20 hover:bg-[#975956] text-[#975956] hover:text-[#efdfcb] p-2.5 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg border border-[#bd9a4f]/40">
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div className="relative w-full aspect-video sm:aspect-auto sm:h-[40vh] max-h-[450px] bg-[#3a201f] flex-shrink-0 shadow-xl z-10 border-b border-[#bd9a4f]/30">
          {receita.videoUrl ? (
            <Player url={receita.videoUrl} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#efdfcb]/50 flex-col gap-3">
              <PlayCircle className="w-16 h-16 opacity-50 text-[#bd9a4f]" />
              <span className="text-sm sm:text-base font-bold tracking-wide">Vídeo indisponível</span>
            </div>
          )}
        </div>

        <div className="p-6 sm:p-8 md:p-12 overflow-y-auto custom-scrollbar flex-grow relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#bd9a4f]/20 text-[#975956] font-bold text-[11px] sm:text-xs uppercase tracking-widest rounded-full mb-5 border border-[#bd9a4f]/30 shadow-sm">
            <ChefHat className="w-4 h-4 text-[#bd9a4f]" />
            {receita.categoria}
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#975956] mb-6 leading-tight font-serif drop-shadow-sm">
            {receita.titulo}
          </h2>
          
          <div className="flex flex-wrap gap-4 mb-10 border-b border-[#bd9a4f]/20 pb-8">
            <div className="flex items-center gap-2.5 text-sm sm:text-base font-bold text-[#975956] bg-[#bd9a4f]/15 px-5 py-2.5 rounded-2xl shadow-sm border border-[#bd9a4f]/30">
              <Clock className="w-5 h-5 text-[#bd9a4f]" strokeWidth={2.5} /> {receita.tempo}
            </div>
            <div className="flex items-center gap-2.5 text-sm sm:text-base font-bold text-[#975956] bg-[#bd9a4f]/15 px-5 py-2.5 rounded-2xl shadow-sm border border-[#bd9a4f]/30">
              <Flame className="w-5 h-5 text-[#bd9a4f]" strokeWidth={2.5} /> {receita.calorias}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
            <div className="md:col-span-5">
              <h4 className="font-bold text-[#bd9a4f] uppercase text-sm tracking-widest mb-6 flex items-center gap-2.5 drop-shadow-sm">
                <UtensilsCrossed className="w-5 h-5 opacity-80" /> Ingredientes
              </h4>
              <ul className="space-y-4 bg-[#d6d4d4]/40 p-6 sm:p-8 rounded-[2rem] shadow-inner border border-[#bd9a4f]/20">
                {receita.ingredientes.map((i: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3.5 text-[#975956] font-semibold text-base sm:text-lg group">
                    <div className="mt-1 flex-shrink-0 bg-[#efdfcb] shadow-sm rounded-full p-1 border border-[#bd9a4f]/30 group-hover:bg-[#bd9a4f]/30 transition-colors">
                      <Check className="w-3.5 h-3.5 text-[#bd9a4f]" strokeWidth={3} />
                    </div>
                    <span className="leading-snug pt-0.5">{i}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="md:col-span-7">
              <h4 className="font-bold text-[#bd9a4f] uppercase text-sm tracking-widest mb-6 flex items-center gap-2.5 drop-shadow-sm">
                <Sparkles className="w-5 h-5 opacity-80" /> Modo de Preparo
              </h4>
              <div className="relative bg-[#d6d4d4]/40 p-6 sm:p-8 rounded-[2rem] border border-[#bd9a4f]/20 shadow-inner">
                <span className="absolute top-2 left-4 text-8xl text-[#bd9a4f]/20 font-serif leading-none select-none pointer-events-none">"</span>
                <p className="relative z-10 text-[#975956] text-base sm:text-lg leading-relaxed whitespace-pre-line font-semibold">
                  {receita.preparo}
                </p>
              </div>
            </div>
          </div>
          
          <div className="h-6 sm:h-8" />
        </div>
      </motion.div>
    </div>
  );
}