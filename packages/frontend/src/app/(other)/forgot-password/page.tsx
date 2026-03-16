"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { AuthInput } from "@/components/ui/auth-input";
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
        }, 1500);
    };

    return (
        <AuthLayout
            imageSrc="https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?q=80&w=2071&auto=format&fit=crop"
            imageAlt="Calm Atmosphere"
            headline={
                <>
                    Recupere seu <br />
                    <span className="text-primary">acesso.</span>
                </>
            }
            subheadline="Não se preocupe, acontece com todo mundo. Vamos te ajudar a voltar para sua conta em instantes."
        >
            {/* Back link */}
            <Link
                href="/login"
                className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para Login
            </Link>

            {!isSubmitted ? (
                <>
                    {/* Header */}
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-900">Esqueceu a senha?</h2>
                        <p className="mt-2 text-slate-500">
                            Digite seu e-mail para receber as instruções de redefinição.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleReset} className="space-y-6">
                        <div className="space-y-4">
                            <AuthInput
                                id="email"
                                label="E-mail cadastrado"
                                icon={Mail}
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seunome@exemplo.com"
                            />
                        </div>

                        <Button variant="auth" type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                "Enviar Instruções"
                            )}
                        </Button>
                    </form>
                </>
            ) : (
                /* Success state */
                <div className="text-center py-8 animate-in fade-in zoom-in duration-300">
                    <div className="mx-auto h-20 w-20 bg-secondary rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="h-10 w-10 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">E-mail Enviado!</h2>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                        Se uma conta existir para{" "}
                        <span className="font-semibold text-slate-800">{email}</span>, você
                        receberá as instruções em breve.
                    </p>
                    <Button
                        variant="outline-auth"
                        className="h-12 px-6"
                        onClick={() => setIsSubmitted(false)}
                    >
                        Tentar outro e-mail
                    </Button>
                </div>
            )}
        </AuthLayout>
    );
}
