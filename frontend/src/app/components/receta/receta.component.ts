import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { CommonModule } from '@angular/common';
import { RecetaService } from '../../services/receta.service';
import { PlanNutricional } from '../../models/plan-nutricional.interface';
import { Receta } from '../../models/receta.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-receta',
  standalone: true,
  templateUrl: './receta.component.html',
  styleUrls: ['./receta.component.css'],
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, TableModule, PanelModule]
})
export class RecetaComponent {
  plan = signal<PlanNutricional>({
    kcal: 600,
    proteinas: 40,
    carbohidratos: 60,
    grasas: 15
  });

  receta = signal<Receta | null>(null);

  constructor(private recetaService: RecetaService) {}

  generarReceta() {
    const recetaGenerada = this.recetaService.generarReceta(this.plan());
    this.receta.set(recetaGenerada);

    if(recetaGenerada == null){
      Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Por favor completa todos los campos correctamente antes de generar la receta.'
    });
    }
  }

  diferencia(valor: number, objetivo: number): string {
    const diff = Math.round(valor - objetivo);
    if (diff > 0) return `+${diff}`;
    if (diff < 0) return `${diff}`;
    return '✔️';
  }
}
