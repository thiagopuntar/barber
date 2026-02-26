"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { AuthInput } from "@/components/ui/auth-input";
import { Loader2, Mail, Lock, User, ArrowRight } from "lucide-react";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            window.location.href = "/login";
        }, 1500);
    };

    return (
        <AuthLayout
            imageSrc="https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=2072&auto=format&fit=crop"
            imageAlt="Barber Shop"
            headline={
                <>
                    Comece sua jornada <br />
                    <span className="text-primary">hoje mesmo.</span>
                </>
            }
            subheadline="Crie sua conta gratuitamente e descubra os melhores profissionais de beleza e bem-estar perto de você."
        >
            {/* Header */}
            <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-slate-900">Crie sua conta</h2>
                <p className="mt-2 text-slate-500">Preencha os dados abaixo para se cadastrar.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-4">
                    <AuthInput
                        id="name"
                        label="Nome Completo"
                        icon={User}
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Seu nome"
                    />
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
                    <AuthInput
                        id="password"
                        label="Senha"
                        icon={Lock}
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                    />
                </div>

                <Button variant="auth" type="submit" disabled={isLoading}>
                    {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <>
                            Cadastrar <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                    )}
                </Button>
            </form>

            {/* Footer link */}
            <p className="text-center text-sm text-slate-600">
                Já tem uma conta?{" "}
                <Link href="/login" className="font-bold text-primary hover:underline">
                    Fazer Login
                </Link>
            </p>

            <div className="pt-4 text-center">
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Ao se cadastrar, você concorda com nossos{" "}
                    <a href="#" className="underline">Termos de Uso</a> e{" "}
                    <a href="#" className="underline">Política de Privacidade</a>.
                </p>
            </div>
        </AuthLayout>
    );
}
