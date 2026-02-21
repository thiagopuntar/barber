"use client";

import { useState } from "react";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { ChevronLeft, MapPin, Star, Share2, Heart, ShieldCheck, Clock, Plus, Minus, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { COMPANIES } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { BookingModal } from "./booking-modal";
import { ThemeToggle } from "@/components/theme-toggle";

export default function BookingPage() {
    const params = useParams();
    const business = params?.business as string;
    const company = business ? COMPANIES[business] : null;

    if (!business) return <div>Carregando...</div>;
    if (!company) return notFound();

    const { services } = company;
    const [selectedServices, setSelectedServices] = useState<number[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleService = (id: number) => {
        if (selectedServices.includes(id)) {
            setSelectedServices(prev => prev.filter(s => s !== id));
        } else {
            setSelectedServices(prev => [...prev, id]);
        }
    };

    const selectedServiceDetails = services.filter(s => selectedServices.includes(s.id));
    const totalPrice = selectedServiceDetails.reduce((acc, curr) => {
        const price = parseFloat(curr.price.replace("R$ ", "").replace(",", "."));
        return acc + price;
    }, 0);

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20">

            {/* Header / Hero */}
            <header className="bg-white">
                {/* Navigation Bar */}
                <div className="container mx-auto px-4 h-16 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="pl-0 hover:bg-transparent hover:text-primary" onClick={() => window.history.back()}>
                            <ChevronLeft className="h-4 w-4 mr-1" /> Voltar
                        </Button>
                        <span>/</span>
                        <span>{company.category}</span>
                        <span>/</span>
                        <span className="text-slate-900 dark:text-slate-100 font-medium">{company.name}</span>
                    </div>
                    <ThemeToggle />
                </div>

                {/* Hero Image */}
                <div className="container mx-auto px-4 pb-8">
                    <div className="relative w-full h-64 md:h-80 rounded-3xl overflow-hidden shadow-lg">
                        <Image src={company.coverImage || company.image} alt={company.name} fill className="object-cover" />
                        <div className="absolute top-4 right-4 flex gap-2">
                            <Badge variant="secondary" className="bg-white/90 backdrop-blur text-teal-700 hover:bg-white font-bold gap-1 px-3 py-1.5 rounded-full">
                                <ShieldCheck className="h-3.5 w-3.5" /> Verificado
                            </Badge>
                            <Badge variant="secondary" className="bg-white/90 backdrop-blur text-green-700 hover:bg-white font-bold gap-1 px-3 py-1.5 rounded-full">
                                <Clock className="h-3.5 w-3.5" /> Aberto agora
                            </Badge>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 mt-[-40px] relative z-10 grid lg:grid-cols-3 gap-8">

                {/* Left Column: Info & services */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Business Info Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800 relative">
                        <div className="absolute -top-10 left-8 h-24 w-24 rounded-2xl bg-white dark:bg-slate-800 p-1 shadow-lg">
                            <div className="relative h-full w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700">
                                <Image src={company.image} alt="Logo" fill className="object-cover" />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mb-2">
                            <Button size="icon" variant="outline" className="rounded-full h-10 w-10 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-500 dark:bg-slate-800/50">
                                <Heart className="h-5 w-5" />
                            </Button>
                            <Button size="icon" variant="outline" className="rounded-full h-10 w-10 border-slate-200 text-slate-400 hover:text-primary">
                                <Share2 className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="mt-4">
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{company.name}</h1>
                            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-500 dark:text-slate-400">
                                <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="font-bold text-slate-900 dark:text-white">{company.rating}</span>
                                    <span>(120 avaliações)</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {company.location}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Services Menu */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Menu de Serviços</h2>
                            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800 mt-1" />
                        </div>

                        {/* Categories / Filter placeholder */}
                        <div className="flex gap-2 mb-6">
                            <Badge variant="outline" className="rounded-full px-4 py-1.5 border-primary bg-primary/5 text-primary cursor-pointer hover:bg-primary/10">Todos</Badge>
                            <Badge variant="outline" className="rounded-full px-4 py-1.5 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">Populares</Badge>
                            <Badge variant="outline" className="rounded-full px-4 py-1.5 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">Pacotes</Badge>
                        </div>

                        <div className="space-y-4">
                            {services.map((service) => {
                                const isSelected = selectedServices.includes(service.id);
                                return (
                                    <div
                                        key={service.id}
                                        className={`group bg-white dark:bg-slate-900 rounded-2xl p-6 border transition-all duration-300 ${isSelected ? 'border-primary ring-1 ring-primary shadow-md' : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'}`}
                                    >
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{service.name}</h3>
                                                    {isSelected && <Badge className="bg-primary text-white text-[10px] h-5">SELECIONADO</Badge>}
                                                </div>
                                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lavagem inclusa.</p>
                                                <div className="flex items-center gap-3 text-sm font-medium">
                                                    <span className="text-slate-900 dark:text-white text-lg font-bold">{service.price}</span>
                                                    <span className="text-slate-400 flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {service.duration}</span>
                                                </div>
                                            </div>
                                            <Button
                                                size="icon"
                                                variant={isSelected ? "default" : "outline"}
                                                onClick={() => toggleService(service.id)}
                                                className={`rounded-full h-12 w-12 shrink-0 transition-all ${isSelected ? 'bg-primary hover:bg-teal-700 border-primary' : 'border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary dark:hover:text-primary dark:text-white dark:bg-slate-800'}`}
                                            >
                                                {isSelected ? <Check className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Column: Sticky Summary */}
                <div className="relative">
                    <div className="sticky top-24 space-y-6">
                        {/* Summary Widget */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Resumo do Agendamento</h3>

                            {selectedServiceDetails.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        {selectedServiceDetails.map(s => (
                                            <div key={s.id} className="flex justify-between text-sm">
                                                <span className="text-slate-600 dark:text-slate-400">{s.name}</span>
                                                <span className="font-bold text-slate-900 dark:text-white">{s.price}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex justify-between items-center">
                                        <div>
                                            <p className="text-xs text-slate-400 uppercase font-bold">Total Estimado</p>
                                            <p className="text-2xl font-bold text-primary">R$ {totalPrice.toFixed(2).replace('.', ',')}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-slate-400 uppercase font-bold">Duração</p>
                                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">~ 45 min</p>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => setIsModalOpen(true)}
                                        className="w-full h-12 rounded-full font-bold text-lg bg-primary hover:bg-teal-700 shadow-lg shadow-primary/20"
                                    >
                                        ESCOLHER HORÁRIO
                                    </Button>
                                    <p className="text-xs text-center text-slate-400">Cancelamento grátis até 2 horas antes.</p>
                                </div>
                            ) : (
                                <div className="py-8 text-center text-slate-400">
                                    <p>Nenhum serviço selecionado.</p>
                                    <p className="text-xs mt-1">Selecione um serviço ao lado para continuar.</p>
                                </div>
                            )}
                        </div>

                        {/* Location Map Widget */}
                        <div className="bg-emerald-100/50 rounded-3xl p-1 border border-emerald-100 overflow-hidden h-64 relative group cursor-pointer">
                            <Image
                                src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=1931&auto=format&fit=crop"
                                alt="Map"
                                fill
                                className="object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-500"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Button variant="secondary" className="bg-white text-slate-900 hover:bg-primary hover:text-white font-bold shadow-lg gap-2">
                                    <MapPin className="h-4 w-4" /> Ver no mapa
                                </Button>
                            </div>
                        </div>

                    </div>
                </div>

            </main>

            {/* Modal */}
            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                services={selectedServiceDetails}
                totalPrice={totalPrice}
                companyName={company.name}
            />
        </div>
    );
}
