import { Ingrediente } from "./ingrediente.interface";

export interface IngredienteReceta {
  ingrediente: Ingrediente;
  gramos: number;
}

export interface Receta {
  ingredientes: IngredienteReceta[];
  totalKcal: number;
  totalProteinas: number;
  totalCarbohidratos: number;
  totalGrasas: number;
}
