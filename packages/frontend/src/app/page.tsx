"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, Star, Bell, ChevronDown, Sparkles, Home as HomeIcon, User, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORIES, COMPANIES } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const featuredCompanies = Object.values(COMPANIES);

  return (
    <div className="min-h-screen font-sans pb-20">

      {/* Header / Navbar */}
      <header className="bg-background sticky top-0 z-40 border-b border-border shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-secondary rounded-xl flex items-center justify-center text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <span className="font-bold text-xl text-slate-900 dark:text-white hidden sm:block">AgendaFácil</span>
          </div>

          <div className="flex-1 max-w-lg mx-6 hidden md:block">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                className="pl-12 h-12 rounded-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 transition-all shadow-sm dark:text-white"
                placeholder="Busque por serviços (ex: barbearia, limpeza)..."
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button size="icon" variant="ghost" className="relative text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
              <Bell className="h-6 w-6" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border border-white dark:border-slate-900" />
            </Button>
            <div className="flex items-center gap-2 cursor-pointer p-1 pr-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
              <Avatar className="h-9 w-9 border border-slate-200 dark:border-slate-700">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <ChevronDown className="h-4 w-4 text-slate-400 hidden sm:block" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-8">

        {/* Mobile Search (Video 1 style) */}
        <div className="md:hidden mb-8">
          <div className="flex justify-between items-start mb-1">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Bom dia, Lucas <span className="text-3xl">👋</span>
            </h1>
            <ThemeToggle />
          </div>
          <p className="text-slate-500 dark:text-slate-400 mb-6">O que vamos agendar hoje?</p>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              className="pl-12 h-12 rounded-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm dark:text-white"
              placeholder="Busque por serviços..."
            />
          </div>
        </div>

        {/* Categories (Chips) */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide mb-8">
          <Button className="rounded-full bg-primary text-white hover:bg-primary/90 px-6 shadow-md shadow-primary/20 shrink-0">
            Todos
          </Button>
          {CATEGORIES.map((cat) => (
            <Button
              key={cat.id}
              variant="outline"
              className="rounded-full border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-primary hover:border-primary dark:hover:border-primary shrink-0 gap-2 px-6"
            >
              <cat.icon className="h-4 w-4" />
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Promo Banner */}
        <div className="relative w-full h-48 md:h-64 rounded-3xl overflow-hidden shadow-xl mb-12 bg-gradient-to-r from-teal-500 to-emerald-600">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?q=80&w=2080&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20" />
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 text-white max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md self-start px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <Ticket className="h-3 w-3" /> Promoção
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Ganhe 15% OFF no primeiro agendamento</h2>
            <p className="text-white/90 mb-6 md:text-lg">Use o cupom <span className="font-bold text-white">AGENDA15</span> e aproveite para conhecer novos serviços.</p>
            <Button className="bg-white text-teal-600 hover:bg-teal-50 font-bold rounded-full w-fit px-8 shadow-lg">
              RESGATAR CUPOM
            </Button>
          </div>
        </div>

        {/* Recommended Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recomendados para você</h2>
          <Link href="#" className="text-sm font-medium text-primary hover:underline">Ver todos</Link>
        </div>

        {/* Vertical Cards Grid (Better for variety) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredCompanies.map((company) => (
            <Link href={`/${company.slug}/booking`} key={company.id} className="group">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-premium hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-800">
                  <Image
                    src={company.coverImage || company.image}
                    alt={company.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm">
                    {company.category}
                  </div>
                  <div className="absolute top-3 right-3 h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-md text-slate-300 hover:text-red-500 transition-colors">
                    <span className="sr-only">Like</span>
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">{company.name}</h3>

                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 flex-1">
                    Especialistas em {company.category.toLowerCase()} com atendimento premium e cafézinho.
                  </p>

                  <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-50 dark:border-slate-800">
                    <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      {company.rating} <span className="text-slate-400">(128)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      2.5 km • {company.location}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border flex justify-around p-4 pb-6 z-50">
        <button className="flex flex-col items-center gap-1 text-primary">
          <HomeIcon className="h-6 w-6" />
          <span className="text-[10px] font-medium">Início</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600">
          <Search className="h-6 w-6" />
          <span className="text-[10px] font-medium">Buscar</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600">
          <Ticket className="h-6 w-6" />
          <span className="text-[10px] font-medium">Pedidos</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600">
          <User className="h-6 w-6" />
          <span className="text-[10px] font-medium">Perfil</span>
        </button>
      </div>

    </div>
  );
}
