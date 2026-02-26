import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Define as variantes de estilo para o botão usando 'class-variance-authority'
// Isso permite criar variações de estilo como 'variant' (cor) e 'size' (tamanho) de forma declarativa

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90",
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline:
                    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
                // Auth pages — full-width pill primary button
                auth: "w-full h-12 rounded-full bg-primary hover:bg-teal-700 text-white font-bold text-lg shadow-lg shadow-primary/20 transition-all",
                // Auth pages — pill outline for social/secondary actions
                "outline-auth": "rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 gap-2 transition-colors",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-sm px-3",
                lg: "h-11 rounded-sm px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

// Interface das props do botão. Estende atributos HTML de botão e variantes definidas.
export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean; // Se true, renderiza o componente filho em vez de um elemento <button>, repassando props.
}


/**
 * Componente de Botão reutilizável.
 * Suporta variantes de estilo (default, outline, ghost, etc.) e tamanhos (sm, default, lg).
 * Pode renderizar como um elemento diferente usando a prop `asChild`.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        // Se asChild for true, usa o Slot para renderizar o filho, senão usa tag button
        const Comp = asChild ? Slot : "button";
        return (

            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
