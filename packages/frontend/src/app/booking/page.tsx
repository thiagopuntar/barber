"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Scissors, Calendar as CalendarIcon, User, CheckCircle2, ChevronRight, ChevronLeft, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data: Dados fictícios para demonstração
const services = [

    { id: 1, name: "Corte de Cabelo", price: "R$ 50,00", duration: "30 min", icon: Scissors },
    { id: 2, name: "Barba", price: "R$ 35,00", duration: "20 min", icon: User },
    { id: 3, name: "Combo Completo", price: "R$ 80,00", duration: "50 min", icon: CheckCircle2 },
];

const professionals = [
    { id: 1, name: "Barbeiro João", role: "Master Barber", image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop" },
    { id: 2, name: "Barbeiro Marcos", role: "Especialista", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop" },
    { id: 3, name: "Barbeiro Lucas", role: "Junior Barber", image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop" },
];

const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00", "15:30", "16:00"
];

// Página de Agendamento (Fluxo do Cliente)
// Implementa um wizard de 4 passos: Serviço -> Profissional -> Data -> Confirmação
export default function BookingPage() {

    const [step, setStep] = useState(1); // Controla o passo atual do wizard

    const [selectedService, setSelectedService] = useState<number | null>(null);
    const [selectedProfessional, setSelectedProfessional] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    // Funções de navegação do wizard
    const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));


    return (
        <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-blue-500/30">
            {/* Texture Overlay */}
            <div className="fixed inset-0 z-0 pointer-events-none bg-noise opacity-[0.03] mix-blend-overlay" />

            {/* Header Simples */}


            <main className="relative z-10 container mx-auto px-4 pt-10 pb-10 max-w-3xl">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-300 mb-2">
                        <span className={cn(step >= 1 && "text-blue-500")}>Serviço</span>
                        <span className={cn(step >= 2 && "text-blue-500")}>Profissional</span>
                        <span className={cn(step >= 3 && "text-blue-500")}>Data & Hora</span>
                        <span className={cn(step >= 4 && "text-blue-500")}>Confirmação</span>
                    </div>
                    <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-600 transition-all duration-500 ease-out"
                            style={{ width: `${(step / 4) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Step 1: Seleção de Serviços */}
                {step === 1 && (

                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center space-y-2">
                            <h1 className="text-2xl font-bold uppercase tracking-widest">Escolha o Serviço</h1>
                            <p className="text-zinc-300 text-xs uppercase tracking-wider">Selecione o tratamento que você deseja.</p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {services.map((service) => (
                                <Card
                                    key={service.id}
                                    className={cn(
                                        "cursor-pointer transition-all duration-200 border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 backdrop-blur-sm group rounded-sm",
                                        selectedService === service.id ? "border-blue-500 shadow-[0_0_15px_-3px_rgba(37,99,235,0.3)] ring-1 ring-blue-500/50" : "hover:border-zinc-700"
                                    )}
                                    onClick={() => setSelectedService(service.id)}
                                >
                                    <CardContent className="flex items-center p-6 gap-4">
                                        <div className={cn(
                                            "h-12 w-12 rounded-sm flex items-center justify-center border transition-colors",
                                            selectedService === service.id ? "bg-blue-600 border-blue-500 text-white" : "bg-zinc-950 border-zinc-800 text-zinc-300 group-hover:text-white"
                                        )}>
                                            <service.icon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold uppercase tracking-wide text-white">{service.name}</h3>
                                            <div className="flex items-center gap-3 mt-1 text-xs text-zinc-300 uppercase tracking-wider">
                                                <span>{service.price}</span>
                                                <span className="w-1 h-1 rounded-full bg-zinc-700" />
                                                <span>{service.duration}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Seleção de Profissionais */}
                {step === 2 && (

                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center space-y-2">
                            <h1 className="text-2xl font-bold uppercase tracking-widest">Escolha o Profissional</h1>
                            <p className="text-zinc-300 text-xs uppercase tracking-wider">Quem vai cuidar do seu estilo hoje?</p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-3">
                            {professionals.map((pro) => (
                                <Card
                                    key={pro.id}
                                    className={cn(
                                        "cursor-pointer transition-all duration-200 border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 backdrop-blur-sm group rounded-sm overflow-hidden",
                                        selectedProfessional === pro.id ? "border-blue-500 shadow-[0_0_15px_-3px_rgba(37,99,235,0.3)] ring-1 ring-blue-500/50" : "hover:border-zinc-700"
                                    )}
                                    onClick={() => setSelectedProfessional(pro.id)}
                                >
                                    <div className="aspect-square relative w-full bg-zinc-950 grayscale group-hover:grayscale-0 transition-all duration-500">
                                        <Image
                                            src={pro.image}
                                            alt={pro.name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-60" />
                                    </div>
                                    <CardContent className="p-4 text-center relative z-10 -mt-10">
                                        <h3 className="font-bold uppercase tracking-wide text-white text-lg">{pro.name}</h3>
                                        <p className="text-xs text-blue-400 uppercase tracking-widest font-bold mt-1">{pro.role}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: Seleção de Data e Hora */}
                {step === 3 && (

                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center space-y-2">
                            <h1 className="text-2xl font-bold uppercase tracking-widest">Data e Hora</h1>
                            <p className="text-zinc-300 text-xs uppercase tracking-wider">Escolha o melhor momento para você.</p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Fake Calendar */}
                            <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm rounded-sm p-4">
                                <div className="text-center text-zinc-300 text-sm uppercase tracking-wider py-10 border-2 border-dashed border-zinc-800 rounded-sm">
                                    <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    Componente de Calendário
                                </div>
                            </Card>

                            {/* Time Slots */}
                            <div className="grid grid-cols-3 gap-2 align-start content-start">
                                {timeSlots.map((time) => (
                                    <button
                                        key={time}
                                        onClick={() => setSelectedTime(time)}
                                        className={cn(
                                            "py-2 text-xs font-bold uppercase tracking-wider rounded-sm border transition-all",
                                            selectedTime === time
                                                ? "bg-blue-600 text-white border-blue-500"
                                                : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-700"
                                        )}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: Confirmação e Resumo */}
                {step === 4 && (

                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-md mx-auto">
                        <div className="text-center space-y-2">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 mb-4 ring-1 ring-blue-500/30">
                                <CheckCircle2 className="h-8 w-8" />
                            </div>
                            <h1 className="text-2xl font-bold uppercase tracking-widest text-white">Confirme o Agendamento</h1>
                            <p className="text-zinc-300 text-xs uppercase tracking-wider">Verifique os detalhes abaixo.</p>
                        </div>

                        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm rounded-sm overflow-hidden">
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                                    <span className="text-xs uppercase tracking-widest text-zinc-300">Serviço</span>
                                    <span className="text-sm font-bold text-white uppercase tracking-wide">Corte de Cabelo</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                                    <span className="text-xs uppercase tracking-widest text-zinc-300">Profissional</span>
                                    <span className="text-sm font-bold text-white uppercase tracking-wide">Barbeiro João</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                                    <span className="text-xs uppercase tracking-widest text-zinc-300">Data</span>
                                    <span className="text-sm font-bold text-white uppercase tracking-wide">12/03/2026</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs uppercase tracking-widest text-zinc-300">Horário</span>
                                    <span className="text-sm font-bold text-white uppercase tracking-wide">14:00</span>
                                </div>
                            </div>
                            <div className="bg-zinc-900 px-6 py-4 flex justify-between items-center border-t border-zinc-800">
                                <span className="text-xs uppercase tracking-widest text-zinc-300">Total</span>
                                <span className="text-xl font-bold text-blue-500 tracking-tight">R$ 50,00</span>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="mt-10 flex justify-between">
                    {step > 1 && (
                        <Button
                            variant="outline"
                            onClick={prevStep}
                            className="border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white uppercase tracking-wider text-xs font-bold h-10 px-6 rounded-sm bg-black/20"
                        >
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Voltar
                        </Button>
                    )}

                    {step < 4 ? (
                        <Button
                            onClick={nextStep}
                            disabled={
                                (step === 1 && !selectedService) ||
                                (step === 2 && !selectedProfessional) ||
                                (step === 3 && !selectedTime)
                            }
                            className="ml-auto bg-blue-600 hover:bg-blue-500 text-white uppercase tracking-wider text-xs font-bold h-10 px-8 rounded-sm shadow-[0_0_15px_-3px_rgba(37,99,235,0.4)]"
                        >
                            Próximo
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            onClick={() => alert("Agendamento Confirmado!")}
                            className="ml-auto w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white uppercase tracking-wider text-xs font-bold h-10 px-8 rounded-sm shadow-[0_0_15px_-3px_rgba(22,163,74,0.4)]"
                        >
                            Confirmar Agendamento
                        </Button>
                    )}
                </div>
            </main>
        </div>
    );
}
