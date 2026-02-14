"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FloatingLabelInput } from "@/components/ui/floating-input";
import { authClient } from "@/lib/auth-client";
import { Eye, EyeOff, Loader2, Scissors } from "lucide-react";
import Image from "next/image";

// Página de Login
// Gerencia autenticação de usuários (Admin e Clientes)
export default function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState<"admin" | "client">("admin");

    // Função para lidar com o login via email e senha
    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true); // Ativa estado de carregamento
        try {
            // Tenta autenticar usando o authClient
            await authClient.signIn.email(
                { email, password },
                {
                    onSuccess: () => {
                        // Redireciona baseado no papel (role) selecionado
                        if (role === 'admin') {
                            window.location.href = "/dashboard";
                        } else {
                            window.location.href = "/booking";
                        }
                    },
                    onError: (ctx) => alert(ctx.error.message), // Exibe erro em caso de falha
                }
            );
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false); // Desativa estado de carregamento
        }
    };


    const handleGoogleSignIn = async () => {
        alert("Funcionalidade de login com Google seria acionada aqui.");
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 font-sans">
            {/* Background Image with High Contrast & Noise */}
            <div className="absolute inset-0 z-0 select-none">
                <Image
                    src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop"
                    alt="Appointment Background"
                    fill
                    className="object-cover object-center opacity-40 grayscale contrast-125"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-blue-900/20 mix-blend-multiply" />
                <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay pointer-events-none" />
            </div>

            {/* Login Container - Geometry: Sharp, High Contrast */}
            <div className="relative z-10 w-full max-w-[400px] border-l border-r border-t border-b border-zinc-800 bg-zinc-950/80 p-8 backdrop-blur-md sm:p-12 shadow-[0_0_0_1px_rgba(255,255,255,0.05),_0_20px_40px_-20px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-bottom-4 duration-700 rounded-none">

                {/* Role Tabs */}
                <div className="flex w-full mb-8 border border-zinc-800 bg-zinc-900/50 p-1 rounded-sm gap-1">
                    <button
                        type="button"
                        onClick={() => setRole("admin")}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest transition-all rounded-sm ${role === "admin"
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-zinc-300 hover:text-zinc-300 hover:bg-zinc-800"
                            }`}
                    >
                        Administrador
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole("client")}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest transition-all rounded-sm ${role === "client"
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-zinc-300 hover:text-zinc-300 hover:bg-zinc-800"
                            }`}
                    >
                        Cliente
                    </button>
                </div>

                {/* Header Section Removed (Moved to Layout) */}
                <div className="mb-10 text-center">
                    <p className="mt-3 text-xs uppercase tracking-widest text-zinc-300">
                        {role === "admin" ? "Acesso Administrativo" : "Área do Cliente"}
                    </p>
                </div>


                {/* Form Section */}
                <form onSubmit={handleSignIn} className="space-y-6">
                    <div className="space-y-5">
                        <div className="group relative">
                            <FloatingLabelInput
                                label={role === "admin" ? "EMAIL CORPORATIVO" : "SEU EMAIL"}
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                className="border-zinc-800 bg-zinc-900/50 text-white placeholder-transparent focus:border-blue-500 focus:ring-0 rounded-none h-12"
                                labelClassName="text-zinc-300 text-xs tracking-wider uppercase peer-focus:text-blue-500"
                            />
                        </div>

                        <div className="group relative">
                            <FloatingLabelInput
                                label="SENHA"
                                id="password"
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                className="border-zinc-800 bg-zinc-900/50 text-white placeholder-transparent focus:border-blue-500 focus:ring-0 rounded-none h-12 pr-10"
                                labelClassName="text-zinc-300 text-xs tracking-wider uppercase peer-focus:text-blue-500"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-white transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2 cursor-pointer group">
                            <input type="checkbox" className="h-4 w-4 rounded-none border-zinc-700 bg-zinc-900 text-blue-600 focus:ring-offset-0 focus:ring-0 group-hover:border-blue-500 transition-colors" />
                            <span className="text-xs text-zinc-300 group-hover:text-zinc-300 tracking-wide uppercase">Lembrar</span>
                        </label>
                        <Link
                            href="/forgot-password"
                            className="text-xs font-medium uppercase tracking-wide text-blue-500 hover:text-blue-400 hover:underline hover:underline-offset-4"
                        >
                            Recuperar Senha
                        </Link>
                    </div>

                    <Button
                        className="w-full rounded-none bg-blue-600 h-12 text-sm font-bold uppercase tracking-widest text-white shadow-[0_0_20px_-5px_rgba(37,99,235,0.3)] hover:bg-blue-500 hover:shadow-[0_0_25px_-5px_rgba(37,99,235,0.5)] transition-all duration-300 border border-blue-500/50"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (role === "admin" ? "ACESSAR SISTEMA" : "ENTRAR")}
                    </Button>
                </form>

                {/* Divider */}
                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-zinc-800" />
                    </div>
                </div>

                {/* Social Login */}
                <Button
                    variant="outline"
                    type="button"
                    disabled={isLoading}
                    onClick={handleGoogleSignIn}
                    className="w-full rounded-none border-zinc-800 bg-transparent h-12 text-zinc-300 hover:bg-zinc-900 hover:text-white hover:border-zinc-700 transition-all uppercase text-xs tracking-wider font-medium"
                >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    Google
                </Button>

                {/* Footer Links Removed (Moved to Layout) */}

            </div>
        </div>
    );
}
