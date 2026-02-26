import { type LucideIcon } from "lucide-react";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label?: string;
    icon: LucideIcon;
    rightElement?: React.ReactNode;
}

/**
 * AuthInput — standardized form field for auth pages.
 * Matches the exact visual pattern of the login page:
 * h-12 | rounded-xl | border-slate-200 | bg-slate-50 | icon on the left.
 */
export function AuthInput({ id, label, icon: Icon, rightElement, ...props }: AuthInputProps) {
    return (
        <div>
            {label && (
                <label
                    className="block text-sm font-semibold text-slate-700 mb-1"
                    htmlFor={id}
                >
                    {label}
                </label>
            )}
            <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                    id={id}
                    className="w-full pl-10 h-12 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400 text-slate-900"
                    {...(rightElement ? { style: { paddingRight: "2.5rem" } } : {})}
                    {...props}
                />
                {rightElement && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {rightElement}
                    </div>
                )}
            </div>
        </div>
    );
}
