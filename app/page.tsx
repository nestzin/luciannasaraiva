/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, ArrowRight, KeyRound, CheckCircle2, LogIn, UserPlus, Info } from "lucide-react";

// Configurações Firebase
import { auth, db } from "./lib/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged,
  sendPasswordResetEmail
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

// Funções utilitárias
import { validarCodigoConvite } from "./actions";

export default function AuthScreen() {
  const [activeTab, setActiveTab] = useState<"login" | "convite" | "cadastro">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [codigo, setCodigo] = useState("");
  const [conviteValidoId, setConviteValidoId] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        window.location.href = "/receitas";
      } else {
        setIsVerifying(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError("E-mail ou palavra-passe incorretos.");
      setIsLoading(false);
    }
  };

  const handleRecuperarSenha = async () => {
    setError("");
    setSuccessMessage("");
    
    if (!email) {
      setError("Por favor, preencha o seu e-mail acima para recuperar a palavra-passe.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage("E-mail de recuperação enviado! Verifique a sua caixa de entrada.");
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        setError("Não encontrámos nenhuma conta com este e-mail.");
      } else {
        setError("Erro ao enviar e-mail. Verifique se digitou o e-mail corretamente.");
      }
    }
  };

  const handleValidarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await validarCodigoConvite(codigo);
    if (res.sucesso && res.conviteId) {
      setConviteValidoId(res.conviteId);
      setActiveTab("cadastro");
      setIsLoading(false);
    } else {
      setError(res.erro || "Código de convite inválido.");
      setIsLoading(false);
    }
  };

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      if (userCredential.user) {
        const conviteRef = doc(db, "convites", conviteValidoId);
        await updateDoc(conviteRef, { 
          usado: true,
          utilizador_uid: userCredential.user.uid 
        });
      }
    } catch (err: any) {
      setError(err.code === "auth/email-already-in-use" ? "Este e-mail já está registado." : "Erro ao criar conta. Tente uma senha mais forte.");
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-[#efdfcb] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#975956] border-t-transparent rounded-full animate-spin shadow-lg" />
      </div>
    );
  }

  return (
    <main className="min-h-[100dvh] flex flex-col lg:flex-row bg-[#efdfcb] selection:bg-[#bd9a4f]/30">
      
      {/* LADO ESQUERDO: IMAGEM (Exatos 50% no Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#bd9a4f]/20 shadow-2xl z-20">
<Image 
          src="/agenda_aberta_post.png" 
          alt="Alimentação Saudável e Integrativa" 
          fill 
          priority
          quality={100} 
          sizes="(max-width: 1024px) 100vw, 50vw" // Garante que carrega em alta resolução
          className="object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute bottom-16 left-12 right-12 text-[#efdfcb]">
          <h2 className="text-4xl xl:text-5xl font-serif font-bold leading-tight mb-4 drop-shadow-md">
            Bem-vinda(o) à nossa <br/> página de clientes.
          </h2>
          <p className="text-[#efdfcb]/80 font-medium text-lg xl:text-xl max-w-md drop-shadow-sm">
            Aceda a receitas exclusivas e planejamentos desenhados para a saúde e estética da mulher.
          </p>
        </div>
      </div>

      {/* LADO DIREITO: ÁREA DE LOGIN (Exatos 50% preenchidos no Desktop, Zero Branco) */}
      <div className="w-full lg:w-1/2 min-h-[100dvh] flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-gradient-to-br from-[#efdfcb] to-[#e4cdb5]">
        
        {/* Luzes decorativas de fundo para dar textura rica */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#bd9a4f]/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#975956]/10 rounded-full blur-[100px] pointer-events-none" />

        {/* CONTÊINER CENTRALIZADO (Sem borda de cartão) */}
        <div className="w-full max-w-[480px] relative z-10 flex flex-col">
          
          <div className="flex flex-col items-center mb-10 text-center">
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}
              className="w-28 h-28 relative rounded-full overflow-hidden border-[3px] border-[#bd9a4f] shadow-[0_10px_30px_rgba(189,154,79,0.3)] mb-6 ring-4 ring-[#975956]/10"
            >
              <Image src="/logoinicio.jpg" alt="Logo Lucianna" fill sizes="112px" className="object-cover" priority />
            </motion.div>
            <h1 className="text-4xl font-extrabold text-[#975956] font-serif tracking-tight drop-shadow-sm">Dra. Lucianna</h1>
            <p className="text-[#bd9a4f] font-bold text-sm mt-2 tracking-[0.15em] uppercase">Nutrição Estética da Mulher</p>
          </div>

          {activeTab !== "cadastro" && (
            <div className="flex bg-[#bd9a4f]/15 p-1.5 rounded-2xl mb-10 border border-[#bd9a4f]/20 shadow-inner relative z-10">
              <button 
                onClick={() => { setActiveTab("login"); setError(""); setSuccessMessage(""); }} 
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-[13px] sm:text-sm font-bold rounded-xl relative z-20 transition-colors duration-300 ${activeTab === "login" ? "text-[#efdfcb]" : "text-[#975956] hover:text-[#bd9a4f]"}`}
              >
                <LogIn className="w-4 h-4 sm:w-5 sm:h-5" /> Entrar
              </button>
              <button 
                onClick={() => { setActiveTab("convite"); setError(""); setSuccessMessage(""); }} 
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-[13px] sm:text-sm font-bold rounded-xl relative z-20 transition-colors duration-300 ${activeTab === "convite" ? "text-[#efdfcb]" : "text-[#975956] hover:text-[#bd9a4f]"}`}
              >
                <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" /> Novo Acesso
              </button>
              
              {/* Pílula Animada de Fundo (Aba Ativa) */}
              <motion.div 
                className="absolute inset-y-1.5 left-1.5 w-[calc(50%-6px)] bg-[#975956] rounded-xl shadow-lg border border-[#975956]/50 z-10" 
                animate={{ x: activeTab === "login" ? 0 : "100%" }} 
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            </div>
          )}

          <div className="relative z-10">
            <AnimatePresence mode="wait">
              {/* TELA DE LOGIN */}
              {activeTab === "login" && (
                <motion.form key="login" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} onSubmit={handleLogin} className="flex flex-col gap-4 sm:gap-5">
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#bd9a4f] group-focus-within:text-[#975956] transition-colors" />
                    <input type="email" placeholder="E-mail de acesso" className="w-full pl-12 pr-4 py-4 sm:py-5 bg-[#efdfcb]/40 backdrop-blur-sm border border-[#bd9a4f]/30 rounded-2xl outline-none focus:bg-[#efdfcb]/70 focus:border-[#975956] focus:ring-4 focus:ring-[#975956]/15 transition-all text-[#975956] placeholder:text-[#975956]/60 font-medium text-sm sm:text-base shadow-sm" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#bd9a4f] group-focus-within:text-[#975956] transition-colors" />
                      <input type="password" placeholder="Palavra-passe" className="w-full pl-12 pr-4 py-4 sm:py-5 bg-[#efdfcb]/40 backdrop-blur-sm border border-[#bd9a4f]/30 rounded-2xl outline-none focus:bg-[#efdfcb]/70 focus:border-[#975956] focus:ring-4 focus:ring-[#975956]/15 transition-all text-[#975956] placeholder:text-[#975956]/60 font-medium text-sm sm:text-base shadow-sm" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    
                    <div className="flex justify-end pr-2 mt-1">
                      <button type="button" onClick={handleRecuperarSenha} className="text-[12px] sm:text-[13px] font-bold text-[#bd9a4f] hover:text-[#975956] transition-colors">
                        Esqueceu a palavra-passe?
                      </button>
                    </div>
                  </div>

                  <SubmitButton isLoading={isLoading} text="Entrar no Portal" />
                </motion.form>
              )}

              {/* TELA DE CONVITE */}
              {activeTab === "convite" && (
                <motion.form key="convite" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }} onSubmit={handleValidarCodigo} className="flex flex-col gap-4 sm:gap-5">
                  <div className="text-center mb-1">
                    <p className="text-[13px] sm:text-base text-[#975956]/80 font-medium px-2 leading-relaxed">Insira o código fornecido pela nutricionista para ativar o seu acesso.</p>
                  </div>
                  <div className="relative group">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#bd9a4f] group-focus-within:text-[#975956] transition-colors" />
                    <input type="text" placeholder="Ex: NUTRI-000-XXX" className="w-full pl-12 pr-4 py-4 sm:py-5 bg-[#efdfcb]/40 backdrop-blur-sm border border-[#bd9a4f]/30 rounded-2xl outline-none focus:bg-[#efdfcb]/70 focus:border-[#975956] focus:ring-4 focus:ring-[#975956]/15 transition-all text-[#975956] placeholder:text-[#975956]/50 font-bold uppercase tracking-wider text-sm sm:text-base shadow-sm" value={codigo} onChange={(e) => setCodigo(e.target.value)} required />
                  </div>
                  <SubmitButton isLoading={isLoading} text="Validar Convite" />
                </motion.form>
              )}

              {/* TELA DE CADASTRO FINAL */}
              {activeTab === "cadastro" && (
                <motion.form key="cadastro" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} onSubmit={handleCadastro} className="flex flex-col gap-4 sm:gap-5">
                  <div className="bg-[#bd9a4f]/20 text-[#975956] p-4 rounded-2xl text-[13px] sm:text-sm font-bold border border-[#bd9a4f]/40 mb-1 flex items-center justify-center gap-2 shadow-sm">
                    <CheckCircle2 className="w-5 h-5 text-[#975956] flex-shrink-0" />
                    Convite Validado com Sucesso!
                  </div>
                  
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#bd9a4f] group-focus-within:text-[#975956] transition-colors" />
                    <input type="email" placeholder="O seu melhor e-mail" className="w-full pl-12 pr-4 py-4 sm:py-5 bg-[#efdfcb]/40 backdrop-blur-sm border border-[#bd9a4f]/30 rounded-2xl outline-none focus:bg-[#efdfcb]/70 focus:border-[#975956] focus:ring-4 focus:ring-[#975956]/15 transition-all text-[#975956] placeholder:text-[#975956]/60 font-medium text-sm sm:text-base shadow-sm" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#bd9a4f] group-focus-within:text-[#975956] transition-colors" />
                    <input type="password" placeholder="Crie uma palavra-passe" className="w-full pl-12 pr-4 py-4 sm:py-5 bg-[#efdfcb]/40 backdrop-blur-sm border border-[#bd9a4f]/30 rounded-2xl outline-none focus:bg-[#efdfcb]/70 focus:border-[#975956] focus:ring-4 focus:ring-[#975956]/15 transition-all text-[#975956] placeholder:text-[#975956]/60 font-medium text-sm sm:text-base shadow-sm" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  <SubmitButton isLoading={isLoading} text="Concluir Registo" />
                </motion.form>
              )}
            </AnimatePresence>
          </div>
          
          {error && (
            <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-[#975956] text-[13px] sm:text-sm text-center font-bold mt-6 bg-[#975956]/10 py-3 px-4 rounded-xl border border-[#975956]/30 flex items-center justify-center gap-2">
              <Info className="w-5 h-5 flex-shrink-0" /> {error}
            </motion.p>
          )}

          {successMessage && (
            <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-[#975956] text-[13px] sm:text-sm text-center font-bold mt-6 bg-[#bd9a4f]/20 py-3 px-4 rounded-xl border border-[#bd9a4f]/40 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> {successMessage}
            </motion.p>
          )}

        </div>
        
        {/* Rodapé Alinhado à Paleta */}
        <div className="mt-12 flex flex-col items-center gap-1.5 relative z-10">
          <p className="text-[#975956]/60 text-[10px] sm:text-xs font-semibold tracking-wide text-center px-4">
            &copy; {new Date().getFullYear()} Lucianna Saraiva. Todos os direitos reservados.
          </p>
          <p className="text-[#975956]/50 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold flex items-center gap-1">
            Feito por <a href="https://www.instagram.com/tatsujingroup/" target="_blank" rel="noopener noreferrer" className="text-[#bd9a4f] hover:text-[#975956] transition-colors duration-300">Tatsujin Group</a>
          </p>
        </div>

      </div>
    </main>
  );
}

function SubmitButton({ isLoading, text }: { isLoading: boolean; text: string }) {
  return (
    <button type="submit" disabled={isLoading} className="w-full mt-4 bg-gradient-to-r from-[#975956] to-[#76423f] text-[#efdfcb] font-bold py-4 sm:py-5 rounded-2xl flex items-center justify-center gap-3 shadow-[0_8px_20px_rgba(151,89,86,0.3)] hover:shadow-[0_12px_25px_rgba(151,89,86,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:scale-100 text-sm sm:text-base border border-white/5">
      {isLoading ? <div className="w-6 h-6 border-[3px] border-[#efdfcb]/30 border-t-[#efdfcb] rounded-full animate-spin" /> : <>{text} <ArrowRight className="w-5 h-5 sm:w-5 sm:h-5" /></>}
    </button>
  );
}
