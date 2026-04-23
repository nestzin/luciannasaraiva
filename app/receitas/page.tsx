"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import { LogOut, Search, Heart, ChefHat } from "lucide-react";

import { auth } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

import { Receita, categoriasOrdem, receitasExemplo, CategoriaReceita } from "../lib/receitas";
import CardReceita from "../components/CardReceita";
import ModalReceita from "../components/ModalReceita";

export default function ReceitasScreen() {
  const [isVerifying, setIsVerifying] = useState(true);
  const [receitaSelecionada, setReceitaSelecionada] = useState<Receita | null>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [favoritos, setFavoritos] = useState<number[]>([]);

  useEffect(() => {
    const favoritosGuardados = localStorage.getItem("receitas_favoritas");
    if (favoritosGuardados) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFavoritos(JSON.parse(favoritosGuardados));
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) window.location.href = "/";
      else setIsVerifying(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    document.body.style.overflow = receitaSelecionada ? "hidden" : "unset";
  }, [receitaSelecionada]);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  const toggleFavorito = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setFavoritos(prev => {
      const novaLista = prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id];
      localStorage.setItem("receitas_favoritas", JSON.stringify(novaLista));
      return novaLista;
    });
  };

  const receitasFiltradas = receitasExemplo.filter(receita => 
    receita.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
    receita.ingredientes.some(i => i.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const receitasFavoritas = receitasFiltradas.filter(r => favoritos.includes(r.id));

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-[#efdfcb] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#975956] border-t-transparent rounded-full animate-spin shadow-lg" />
      </div>
    );
  }

  return (
    // Fundo mistura o Creme e o Cinza Claro da sua paleta
    <main className="min-h-[100dvh] relative bg-gradient-to-br from-[#efdfcb] to-[#d6d4d4] pb-16 text-[#975956] overflow-x-hidden selection:bg-[#bd9a4f]/30">
      
      <div className="fixed top-[-10%] right-[-5%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-[#bd9a4f]/15 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-[#975956]/10 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* HEADER SEM BRANCO PURO */}
      <header className="sticky top-0 z-40 bg-[#efdfcb]/80 backdrop-blur-2xl border-b border-[#bd9a4f]/20 px-4 py-3 sm:py-4 shadow-[0_4px_30px_rgba(151,89,86,0.05)] transition-all">
        <div className="max-w-[1400px] mx-auto w-full flex flex-col sm:flex-row items-center gap-4 sm:gap-6 relative z-10">
          
          <div className="flex items-center justify-between w-full sm:w-auto sm:flex-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 relative rounded-full overflow-hidden border-[2px] border-[#bd9a4f]/30 bg-[#efdfcb] shadow-sm">
                <Image src="/logoinicio.jpg" alt="Logo Lucianna" fill sizes="44px" className="object-cover" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold font-serif leading-tight text-[#975956] drop-shadow-sm">Dra. Lucianna</h2>
            </div>
            
            <button onClick={handleLogout} className="sm:hidden p-2 bg-[#bd9a4f]/15 border border-[#bd9a4f]/30 hover:bg-[#bd9a4f]/30 rounded-full transition-colors text-[#975956] shadow-sm">
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          <div className="relative w-full sm:w-[400px] md:w-[500px] flex-shrink-0 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#bd9a4f] group-focus-within:text-[#975956] transition-colors" />
            <input 
              type="text" 
              placeholder="Pesquisar receita ou ingrediente..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              // Barra de pesquisa dourada translúcida
              className="w-full pl-11 pr-4 py-3 sm:py-3.5 bg-[#bd9a4f]/10 backdrop-blur-md border border-[#bd9a4f]/30 rounded-full outline-none focus:border-[#975956] focus:ring-4 focus:ring-[#975956]/10 transition-all duration-300 text-[#975956] font-bold placeholder:text-[#975956]/50 shadow-inner text-sm sm:text-base hover:bg-[#bd9a4f]/20 focus:bg-[#efdfcb]"
            />
          </div>
          
          <div className="hidden sm:flex sm:flex-1 justify-end">
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 px-5 py-2.5 bg-[#bd9a4f]/10 border border-[#bd9a4f]/30 hover:bg-[#bd9a4f]/20 rounded-full transition-all duration-300 text-[#975956] font-bold text-sm shadow-sm hover:shadow-md"
              title="Sair da conta"
            >
              Sair <LogOut className="w-4 h-4" />
            </button>
          </div>
          
        </div>
      </header>

      <div className="relative z-10 max-w-[1400px] mx-auto p-4 md:p-8 mt-2">
        
        {receitasFavoritas.length > 0 && (
          <section className="mb-14">
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#975956] mb-6 border-b-2 border-[#bd9a4f]/30 pb-3 flex items-center gap-3 drop-shadow-sm">
              <Heart className="w-6 h-6 fill-[#975956] text-[#975956]" /> 
              As Minhas Favoritas
            </h3>
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-8 pt-2 -mx-4 px-[10vw] md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:snap-none md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {receitasFavoritas.map((receita: Receita) => (
                <div key={receita.id} className="w-[80vw] snap-center shrink-0 md:w-auto md:shrink">
                  <CardReceita 
                    receita={receita} 
                    abrirModal={() => setReceitaSelecionada(receita)} 
                    isFavorito={true}
                    toggleFavorito={(e) => toggleFavorito(e, receita.id)}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {searchTerm && receitasFiltradas.length === 0 && (
          <div className="text-center py-16 bg-[#bd9a4f]/10 backdrop-blur-md border border-[#bd9a4f]/20 rounded-[2rem] shadow-sm max-w-2xl mx-auto mt-10">
            <ChefHat className="w-16 h-16 mx-auto text-[#bd9a4f]/60 mb-4" />
            <h3 className="text-xl font-bold text-[#975956]">Nenhuma receita encontrada</h3>
            <p className="text-[#975956]/70 mt-2 font-medium">Tente pesquisar por outro nome ou ingrediente.</p>
          </div>
        )}

        {categoriasOrdem.map((categoria: CategoriaReceita) => {
          const receitasDaCategoria = receitasFiltradas.filter((r: Receita) => r.categoria === categoria);
          if (receitasDaCategoria.length === 0) return null;

          return (
            <section key={categoria} className="mb-12">
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#bd9a4f] mb-6 border-b-2 border-[#bd9a4f]/30 pb-2 drop-shadow-sm">
                {categoria}
              </h3>
              
              <div className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-8 pt-2 -mx-4 px-[10vw] md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:snap-none md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {receitasDaCategoria.map((receita: Receita) => (
                  <div key={receita.id} className="w-[80vw] snap-center shrink-0 md:w-auto md:shrink">
                    <CardReceita 
                      receita={receita} 
                      abrirModal={() => setReceitaSelecionada(receita)} 
                      isFavorito={favoritos.includes(receita.id)}
                      toggleFavorito={(e) => toggleFavorito(e, receita.id)}
                    />
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <AnimatePresence>
        {receitaSelecionada && (
          <ModalReceita 
            receita={receitaSelecionada} 
            fecharModal={() => setReceitaSelecionada(null)} 
          />
        )}
      </AnimatePresence>
    </main>
  );
}