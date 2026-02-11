import * as React from "react";
import { cn } from "@/lib/utils";
import { Input, InputProps } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FloatingLabelInputProps extends InputProps {
    label: string;
    labelClassName?: string;
}

/**
 * Componente que combina um Input e um Label para criar o efeito de "Floating Label".
 * O label se move para cima quando o input tem foco ou contém valor.
 */
const FloatingLabelInput = React.forwardRef<
    HTMLInputElement,
    FloatingLabelInputProps
>(({ className, label, labelClassName, id, ...props }, ref) => {
    // Gera um ID único se não for fornecido, para acessibilidade (associar label ao input)
    const generatedId = React.useId();
    const inputId = id || generatedId;


    return (
        <div className="relative">
            <Input
                ref={ref}
                id={inputId}
                className={cn(
                    "peer block w-full appearance-none rounded-none border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500",
                    className // Classes do Tailwind para o input flutuante
                )}

                placeholder=" "
                {...props}
            />
            <Label
                htmlFor={inputId} // Corrigido para fechar a tag corretamente
                className={cn(
                    "absolute left-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 dark:text-gray-400 dark:peer-focus:text-blue-500",
                    labelClassName // Classes do Tailwind para a animação do label
                )}

            >
                {label}
            </Label>
        </div>
    );
});
FloatingLabelInput.displayName = "FloatingLabelInput";

export { FloatingLabelInput };
