"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { AuthInput } from "@/components/ui/auth-input";
import { authClient } from "@/lib/auth-client";
import { Eye, EyeOff, Loader2, Mail, Lock, Facebook } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await authClient.signIn.email(
                { email, password },
                {
                    onSuccess: () => {
                        window.location.href = "/";
                    },
                    onError: (ctx) => alert(ctx.error.message),
                }
            );
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            imageSrc="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop"
            imageAlt="Spa Relax"
            headline={
                <>
                    Agende seu tempo. <br />
                    <span className="text-primary">Cuide de você.</span>
                </>
            }
            subheadline="A maneira mais doce de marcar seus compromissos. De massagens a cortes de cabelo, tudo em um só lugar."
        >
            {/* Social proof (only visible on left, but kept for structure parity) */}

            {/* Header */}
            <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-slate-900">Bem-vindo de volta</h2>
                <p className="mt-2 text-slate-500">Insira seus dados para acessar sua conta.</p>
            </div>

            {/* Social Login Buttons */}
            <div className="flex gap-4">
                <Button variant="outline-auth" className="flex-1 h-12">
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                </Button>
                <Button variant="outline-auth" className="flex-1 h-12">
                    <Facebook className="h-5 w-5 text-blue-600" />
                    Facebook
                </Button>
            </div>

            {/* Divider */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-400">ou continue com e-mail</span>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSignIn} className="space-y-6">
                <div className="space-y-4">
                    <AuthInput
                        id="email"
                        label="E-mail"
                        icon={Mail}
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seunome@exemplo.com"
                    />
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-sm font-semibold text-slate-700" htmlFor="password">
                                Senha
                            </label>
                            <Link href="/forgot-password" className="text-sm text-primary font-medium hover:underline">
                                Esqueceu a senha?
                            </Link>
                        </div>
                        <AuthInput
                            id="password"
                            label=""
                            icon={Lock}
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            rightElement={
                                <button
                                    type="button"
                                    className="text-slate-400 hover:text-slate-600 transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            }
                        />
                    </div>
                </div>

                <Button variant="auth" type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Acessar"}
                </Button>
            </form>

            {/* Footer link */}
            <p className="text-center text-sm text-slate-600">
                Não tem uma conta?{" "}
                <Link href="/register" className="font-bold text-primary hover:underline">
                    Cadastre-se
                </Link>
            </p>

            <div className="pt-8 text-center">
                <p className="text-xs text-slate-400">
                    Ao continuar, você concorda com nossos{" "}
                    <a href="#" className="underline">Termos</a> e{" "}
                    <a href="#" className="underline">Política de Privacidade</a>.
                </p>
            </div>
        </AuthLayout>
    );
}
