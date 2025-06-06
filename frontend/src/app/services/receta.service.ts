
import { Injectable } from '@angular/core';
import { Ingrediente } from '../models/ingrediente.interface';
import { PlanNutricional } from '../models/plan-nutricional.interface';
import { Receta, IngredienteReceta } from '../models/receta.interface';

@Injectable({ providedIn: 'root' })
export class RecetaService {
    ingredientes: Ingrediente[] = [
        { nombre: 'Arroz', kcalPor100g: 130, proteinaPor100g: 2.7, carbohidratosPor100g: 28, grasaPor100g: 0.3 },
        { nombre: 'Pollo', kcalPor100g: 165, proteinaPor100g: 31, carbohidratosPor100g: 0, grasaPor100g: 3.6 },
        { nombre: 'Tomate', kcalPor100g: 80, proteinaPor100g: 1.2, carbohidratosPor100g: 10, grasaPor100g: 3.5 }
    ];

    /**
     * @description Este metodo se encarga de recorrer los 3 ingredientes a partir de unos valores del ingrediente de "pollo" y los otros ingredientes los va sacando proporcionados
     * unos de los otros. Es decir, el "arroz" proporcionado al "pollo" y el "tomate" proporcionado al "arroz"
     * @param plan 
     * @returns la mejor receta encontrada entre unos valores introducidos
     */
    generarReceta(plan: PlanNutricional): Receta | null { 
        let mejor: Receta | null = null;
        if (
            !plan.kcal || !plan.proteinas || !plan.carbohidratos || !plan.grasas ||
            isNaN(plan.kcal) || isNaN(plan.proteinas) || isNaN(plan.carbohidratos) || isNaN(plan.grasas)
        ) {
            return null
        }

        let menorError = Infinity;

        for (let pollo = 50; pollo <= 300; pollo += 5) {
            for (let arroz = Math.ceil(pollo * 0.5); arroz <= Math.floor(pollo * 1.25); arroz += 5) {
                for (let tomate = Math.ceil(arroz * 0.2); tomate <= Math.floor(arroz * 0.6); tomate += 5) {
                    const receta = this.calcular(pollo, arroz, tomate);
                    const error =
                        Math.abs(plan.kcal - receta.totalKcal) +
                        Math.abs(plan.proteinas - receta.totalProteinas) +
                        Math.abs(plan.carbohidratos - receta.totalCarbohidratos) +
                        Math.abs(plan.grasas - receta.totalGrasas);

                    if (error < menorError) {
                        menorError = error;
                        mejor = receta;
                    }
              
                }
            }
        }
    
        return mejor!;
    }

    /**
     * @description Este metodo se encarga de calcular y sumar todos los valores nutricionales de los ingredientes para sacar el total de las calorias y de cada macronutriente
     * @param pollo 
     * @param arroz 
     * @param tomate 
     * @returns Receta con los ingredientes y los valores nutricionales
     */
    private calcular(pollo: number, arroz: number, tomate: number): Receta {
        const cantidades = [arroz, pollo, tomate];

        const ingredientesReceta: IngredienteReceta[] = this.ingredientes.map((ing, i) => ({
            ingrediente: ing,
            gramos: cantidades[i]
        }));

        let totalKcal = 0;
        let totalProteinas = 0;
        let totalCarbohidratos = 0;
        let totalGrasas = 0;

        for (let i = 0; i < ingredientesReceta.length; i++) {
            const ing = ingredientesReceta[i];
            const factor = ing.gramos / 100;

            totalKcal += ing.ingrediente.kcalPor100g * factor;
            totalProteinas += ing.ingrediente.proteinaPor100g * factor;
            totalCarbohidratos += ing.ingrediente.carbohidratosPor100g * factor;
            totalGrasas += ing.ingrediente.grasaPor100g * factor;
        }
        
        return {
            ingredientes: ingredientesReceta,
            totalKcal,
            totalProteinas,
            totalCarbohidratos,
            totalGrasas
        };
    }
}

