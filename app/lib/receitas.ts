// lib/receitas.ts
export type CategoriaReceita = "Café da manhã" | "Almoço" | "Lanche da tarde" | "Jantar";

export interface Receita {
  id: number;
  titulo: string;
  categoria: CategoriaReceita;
  tempo: string;
  calorias: string;
  ingredientes: string[];
  preparo: string;
  videoUrl?: string;
  thumbnailUrl?: string;
}

export const categoriasOrdem: CategoriaReceita[] = ["Café da manhã", "Almoço", "Lanche da tarde", "Jantar"];

export const receitasExemplo: Receita[] = [
  {
    id: 1,
    titulo: "Panqueca Proteica de Aveia",
    categoria: "Café da manhã",
    tempo: "15 min",
    calorias: "220 kcal",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnailUrl: "/agenda_aberta_post.png",
    ingredientes: ["2 Ovos inteiros", "3 colheres de Aveia", "1 Banana", "Canela"],
    preparo: "Amasse a banana, misture com os ovos e aveia. Doure na frigideira untada.",
  },
  {
    id: 2,
    titulo: "Vitamina de Morango e Chia",
    categoria: "Café da manhã",
    tempo: "5 min",
    calorias: "150 kcal",
    thumbnailUrl: "/agenda_aberta_post.png",
    ingredientes: ["Leite vegetal", "Morangos", "1 Colher de Chia"],
    preparo: "Bata tudo no liquidificador e beba sem coar.",
  },
  {
    id: 3,
    titulo: "Bowl de Iogurte com Frutas",
    categoria: "Lanche da tarde",
    tempo: "5 min",
    calorias: "180 kcal",
    thumbnailUrl: "/agenda_aberta_post.png",
    ingredientes: ["Iogurte Natural", "Morangos", "Granola sem açúcar"],
    preparo: "Misture tudo no bowl e sirva gelado.",
  },
  {
    id: 4,
    titulo: "Salada de Grão de Bico e Atum",
    categoria: "Almoço",
    tempo: "10 min",
    calorias: "310 kcal",
    thumbnailUrl: "/agenda_aberta_post.png",
    ingredientes: ["1 lata de Grão de bico", "1 lata de Atum", "Tomate cereja", "Azeite"],
    preparo: "Escorra o grão de bico e o atum. Misture com os legumes picados e tempere com azeite e limão.",
  },
  {
    id: 5,
    titulo: "Sopa Creme de Abóbora",
    categoria: "Jantar",
    tempo: "25 min",
    calorias: "150 kcal",
    thumbnailUrl: "/agenda_aberta_post.png",
    ingredientes: ["Abóbora cabotiá", "Gengibre", "Cebola e alho", "Caldo de legumes"],
    preparo: "Cozinhe a abóbora com os temperos. Bata no liquidificador até virar creme.",
  }
];