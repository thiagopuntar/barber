import Image from "next/image";

interface AuthLayoutProps {
    children: React.ReactNode;
    imageSrc: string;
    imageAlt: string;
    headline: React.ReactNode;
    subheadline: string;
}

/**
 * AuthLayout — shared two-column layout for auth pages (Login, Register, Forgot Password).
 * Left: green gradient panel with branding and decorative image.
 * Right: white panel with centered form content.
 */
export function AuthLayout({
    children,
    imageSrc,
    imageAlt,
    headline,
    subheadline,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen w-full font-sans">
            {/* Left Side — Brand / Marketing (hidden on mobile) */}
            <div className="hidden lg:flex w-1/2 flex-col justify-between bg-[#C8F9F0] p-12 relative overflow-hidden">
                {/* Brand Logo */}
                <div className="flex items-center gap-2 z-10">
                    <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-primary shadow-sm">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <span className="font-bold text-xl text-slate-800">AgendaFácil</span>
                </div>

                {/* Hero Copy */}
                <div className="relative z-10 mt-12 max-w-lg">
                    <h1 className="text-5xl font-bold text-slate-900 leading-tight">
                        {headline}
                    </h1>
                    <p className="mt-6 text-slate-600 text-lg">{subheadline}</p>
                </div>

                {/* Hero Image Card */}
                <div className="relative z-10 mt-12 flex-1 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50">
                    <Image
                        src={imageSrc}
                        alt={imageAlt}
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Background Decoration Blob */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-[#A8F0E0] blur-3xl opacity-50 pointer-events-none" />
            </div>

            {/* Right Side — Form Area */}
            <div className="flex w-full lg:w-1/2 items-center justify-center bg-white p-8">
                <div className="w-full max-w-md space-y-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
