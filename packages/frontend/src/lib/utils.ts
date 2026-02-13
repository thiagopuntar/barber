import { type ClassValue, clsx } from "clsx"; // Importa utilitários para construir strings de classe condicionalmente
import { twMerge } from "tailwind-merge"; // Importa utilitário para mesclar classes Tailwind conflitantes


/**
 * Combina classes CSS condicionalmente e mescla conflitos do Tailwind.
 * Útil para criar componentes reutilizáveis com variantes.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs)); // Mescla as classes usando clsx e resolve conflitos com twMerge

}
