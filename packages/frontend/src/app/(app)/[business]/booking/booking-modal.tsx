"use client";

import { useState } from "react";
import { X, Calendar as CalendarIcon, Clock, CreditCard, CheckCircle2, QrCode, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    services: any[];
    totalPrice: number;
    companyName: string;
}

export function BookingModal({ isOpen, onClose, services, totalPrice, companyName }: BookingModalProps) {
    const [step, setStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState<number | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<"pix" | "card" | null>(null);

    if (!isOpen) return null;

    // Fake dates generator (next 14 days)
    const today = new Date();
    const dates = Array.from({ length: 14 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        return {
            day: date.getDate(),
            weekday: date.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3),
            fullDate: date,
        };
    });

    const timeSlots = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

    const handleConfirm = () => {
        // Logic to save to DB would go here
        setStep(3); // Success/Confirmação
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh] border dark:border-slate-800">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            {step === 1 && "Escolha o Horário"}
                            {step === 2 && "Pagamento"}
                            {step === 3 && "Confirmado!"}
                        </h2>
                        {step < 3 && <p className="text-sm text-slate-500 dark:text-slate-400">Agendamento em {companyName}</p>}
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800" onClick={onClose}>
                        <X className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto">

                    {/* Step 1: Date & Time */}
                    {step === 1 && (
                        <div className="space-y-8">
                            {/* Date Picker */}
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                                    <CalendarIcon className="h-4 w-4 text-primary" /> Data
                                </h3>
                                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                                    {dates.map((date, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedDate(idx)}
                                            className={cn(
                                                "flex flex-col items-center justify-center min-w-[4.5rem] h-20 rounded-2xl border transition-all",
                                                selectedDate === idx
                                                    ? "bg-primary text-white border-primary shadow-lg scale-105"
                                                    : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-700"
                                            )}
                                        >
                                            <span className="text-xs font-medium uppercase opacity-80">{date.weekday}</span>
                                            <span className="text-xl font-bold">{date.day}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Time Picker */}
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
                                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-primary" /> Horário
                                </h3>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                    {timeSlots.map((time) => (
                                        <button
                                            key={time}
                                            onClick={() => setSelectedTime(time)}
                                            disabled={!selectedDate && selectedDate !== 0}
                                            className={cn(
                                                "py-2 rounded-xl text-sm font-bold border transition-all",
                                                selectedTime === time
                                                    ? "bg-primary text-white border-primary shadow-md"
                                                    : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary/50 hover:text-primary",
                                                (!selectedDate && selectedDate !== 0) && "opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-900"
                                            )}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Payment */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Resumo</h3>
                                <div className="space-y-2 text-sm">
                                    {services.map(s => (
                                        <div key={s.id} className="flex justify-between">
                                            <span className="text-slate-600 dark:text-slate-300">{s.name}</span>
                                            <span className="font-medium dark:text-slate-200">{s.price}</span>
                                        </div>
                                    ))}
                                    <div className="border-t border-slate-200 dark:border-slate-700 pt-3 mt-3 flex justify-between font-bold text-lg text-slate-900 dark:text-white">
                                        <span>Total</span>
                                        <span>R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
                                    </div>
                                </div>
                            </div>

                            <h3 className="font-semibold text-slate-900 dark:text-white">Forma de Pagamento</h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <button
                                    onClick={() => setPaymentMethod("pix")}
                                    className={cn(
                                        "flex flex-col items-center p-6 rounded-2xl border-2 transition-all gap-3",
                                        paymentMethod === "pix" ? "border-primary bg-primary/5 text-primary" : "border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 dark:text-slate-300"
                                    )}
                                >
                                    <QrCode className="h-8 w-8" />
                                    <span className="font-bold">Pix (Instantâneo)</span>
                                    {paymentMethod === "pix" && <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Recomendado</Badge>}
                                </button>
                                <button
                                    onClick={() => setPaymentMethod("card")}
                                    className={cn(
                                        "flex flex-col items-center p-6 rounded-2xl border-2 transition-all gap-3",
                                        paymentMethod === "card" ? "border-primary bg-primary/5 text-primary" : "border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 dark:text-slate-300"
                                    )}
                                >
                                    <CreditCard className="h-8 w-8" />
                                    <span className="font-bold">Cartão de Crédito</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Success */}
                    {step === 3 && (
                        <div className="text-center py-12 space-y-6">
                            <div className="h-24 w-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto animate-in zoom-in duration-500">
                                <CheckCircle2 className="h-12 w-12" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900">Agendado!</h2>
                                <p className="text-slate-500 mt-2 text-lg">Seu horário está confirmado para<br /><span className="font-bold text-slate-900">Terça, 24 de Outubro às 14:00</span></p>
                            </div>

                            <div className="pt-8 flex flex-col gap-3 max-w-sm mx-auto">
                                <Button className="w-full h-12 rounded-full font-bold bg-slate-100 text-slate-900 hover:bg-slate-200">
                                    Ver meus agendamentos
                                </Button>
                                <Button variant="link" className="text-primary font-bold" onClick={onClose}>
                                    Adicionar ao calendário
                                </Button>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer Actions */}
                {step < 3 && (
                    <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                        {step > 1 ? (
                            <Button variant="ghost" onClick={() => setStep(step - 1)} className="font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200">
                                Voltar
                            </Button>
                        ) : (
                            <div /> // Spacer
                        )}

                        <Button
                            onClick={() => {
                                if (step === 1 && selectedDate !== null && selectedTime) setStep(2);
                                if (step === 2 && paymentMethod) handleConfirm();
                            }}
                            disabled={(step === 1 && (!selectedTime || selectedDate === null)) || (step === 2 && !paymentMethod)}
                            className="bg-primary hover:bg-teal-700 text-white font-bold px-8 h-12 rounded-full shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:shadow-none"
                        >
                            {step === 1 ? "Continuar" : "Confirmar e Agendar"} <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
