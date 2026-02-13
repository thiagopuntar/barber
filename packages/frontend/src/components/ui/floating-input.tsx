import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface FloatingLabelInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    labelClassName?: string;
    containerClassName?: string;
}

const FloatingLabelInput = React.forwardRef<
    HTMLInputElement,
    FloatingLabelInputProps
>(({ className, label, labelClassName, containerClassName, id, ...props }, ref) => {
    // Generate a unique id if not provided, for the label to associate with input
    const inputId = id || React.useId();

    return (
        <div className={cn("relative", containerClassName)}>
            <Input
                id={inputId}
                className={cn("peer placeholder-transparent", className)}
                placeholder={props.placeholder || " "} // Ensure placeholder exists for peer-placeholder-shown
                ref={ref}
                {...props}
            />
            <Label
                htmlFor={inputId}
                className={cn(
                    "absolute left-3 top-1/2 z-10 -translate-y-1/2 cursor-text px-1 text-sm text-muted-foreground transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:scale-75 peer-focus:bg-background peer-focus:text-primary",
                    // Custom positioning for "modern" look or matching the user's need.
                    // The user's page.tsx passes custom labelClassName.
                    // Adjusting default styles to be more neutral so user's styles can override.
                    "pointer-events-none origin-[0]",
                    labelClassName
                )}
            >
                {label}
            </Label>
        </div>
    );
}
);
FloatingLabelInput.displayName = "FloatingLabelInput";

export { FloatingLabelInput };
