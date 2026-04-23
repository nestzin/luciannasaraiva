"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, Flame, PlayCircle, Heart, ArrowRight } from "lucide-react";
import { Receita } from "../lib/receitas";

interface CardProps {
  receita: Receita;
  abrirModal: () => void;
  isFavorito: boolean;
  toggleFavorito: (e: React.MouseEvent) => void;
}

export default function CardReceita({ receita, abrirModal, isFavorito, toggleFavorito }: CardProps) {
  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      // Fundo Creme 100% puro (sem branco)
      className="bg-[#efdfcb] rounded-[2rem] overflow-hidden shadow-[0_15px_40px_rgba(151,89,86,0.12)] border border-[#bd9a4f]/30 hover:border-[#975956]/40 flex flex-col h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(151,89,86,0.2)] relative group"
    >
      <button 
        onClick={toggleFavorito}
        // Fundo do botão no tom Cinza Claro da paleta
        className="absolute top-4 right-4 z-20 bg-[#d6d4d4]/90 backdrop-blur-md p-2.5 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.15)] hover:scale-110 active:scale-95 transition-all duration-300 border border-[#bd9a4f]/40"
      >
        <Heart 
          className={`w-5 h-5 transition-colors duration-300 ${isFavorito ? 'text-[#975956] fill-[#975956]' : 'text-[#bd9a4f] hover:text-[#975956]'}`} 
        />
      </button>

      <div onClick={abrirModal} className="relative w-full aspect-[4/3] bg-[#bd9a4f]/20 flex items-center justify-center cursor-pointer overflow-hidden border-b border-[#bd9a4f]/20">
        {receita.thumbnailUrl && (
          <Image 
            src={receita.thumbnailUrl} 
            alt={receita.titulo} 
            fill 
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" 
            priority={true} 
            quality={100}
            className="object-cover opacity-90 group-hover:opacity-70 transition-opacity duration-500 group-hover:scale-105" 
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#975956]/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        <PlayCircle className="w-16 h-16 text-[#efdfcb] z-10 opacity-90 group-hover:scale-110 transition-transform duration-500 drop-shadow-lg" />
      </div>

      {/* Container inferior de texto no Creme da paleta */}
      <div className="p-6 md:p-8 flex flex-col flex-grow bg-[#efdfcb]">
        <h4 className="text-2xl font-bold mb-4 line-clamp-2 leading-snug text-[#975956]">{receita.titulo}</h4>
        
        <div className="flex flex-wrap gap-3 mb-6 mt-auto">
          {/* Tags de informação usando o Cinza Claro (#d6d4d4) misturado */}
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#975956] bg-[#d6d4d4]/60 px-3.5 py-1.5 rounded-full border border-[#bd9a4f]/30 shadow-sm">
            <Clock className="w-4 h-4 text-[#bd9a4f]" strokeWidth={2.5} /> {receita.tempo}
          </div>
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#975956] bg-[#d6d4d4]/60 px-3.5 py-1.5 rounded-full border border-[#bd9a4f]/30 shadow-sm">
            <Flame className="w-4 h-4 text-[#bd9a4f]" strokeWidth={2.5} /> {receita.calorias}
          </div>
        </div>
        
        <button onClick={abrirModal} className="w-full bg-gradient-to-r from-[#975956] to-[#76423f] text-[#efdfcb] font-bold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm md:text-base shadow-[0_8px_20px_rgba(151,89,86,0.3)] hover:shadow-[0_12px_25px_rgba(151,89,86,0.4)] hover:-translate-y-0.5 active:scale-95 border border-[#bd9a4f]/20">
          Acessar Receita <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.article>
  );
}