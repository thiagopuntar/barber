import { Calendar as CalendarIcon, User, CheckCircle2, Star, MapPin, Clock } from "lucide-react";

export interface Service {
    id: number;
    name: string;
    description?: string;
    price: string;
    duration: string;
    category: string;
    icon: any;
}

export interface Professional {
    id: number;
    name: string;
    role: string; // e.g., "Instrutor", "Especialista", "Técnico"
    rating: number;
    image: string;
    bio?: string;
}

export interface Company {
    id: string;
    name: string;
    slug: string;
    category: string; // e.g., "Beleza", "Saúde", "Casa"
    rating: number;
    location: string;
    image: string;
    coverImage?: string;
    mapUrl?: string;
    services: Service[];
    professionals: Professional[];
    timeSlots: string[];
}

export const CATEGORIES = [
    { id: "beleza", label: "Beleza & Estética", icon: Star },
    { id: "saude", label: "Saúde & Bem-estar", icon: User },
    { id: "casa", label: "Serviços para Casa", icon: MapPin },
    { id: "aulas", label: "Aulas & Ensino", icon: CalendarIcon },
];

export const COMPANIES: Record<string, Company> = {
    "lumiere-spa": {
        id: "1",
        name: "Lumière Estética",
        slug: "lumiere-spa",
        category: "Beleza",
        rating: 4.9,
        location: "Centro, Rio de Janeiro",
        image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=500&auto=format&fit=crop",
        coverImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop",
        mapUrl: "https://www.google.com/maps/embed?pb=...",
        services: [
            { id: 1, name: "Limpeza de Pele", category: "Face", price: "R$ 120,00", duration: "60 min", icon: User },
            { id: 2, name: "Massagem Relaxante", category: "Corpo", price: "R$ 150,00", duration: "50 min", icon: User },
            { id: 3, name: "Drenagem Linfática", category: "Corpo", price: "R$ 100,00", duration: "45 min", icon: User },
        ],
        professionals: [
            { id: 1, name: "Dra. Ana Silva", role: "Esteticista", rating: 5.0, image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop" },
            { id: 2, name: "Carla Santos", role: "Massoterapeuta", rating: 4.8, image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop" },
        ],
        timeSlots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
    },
    "dr-fix": {
        id: "2",
        name: "Dr. Fix Reparos",
        slug: "dr-fix",
        category: "Casa",
        rating: 4.7,
        location: "Vila Mariana, SP",
        image: "https://images.unsplash.com/photo-1581092921461-eab6245b0262?q=80&w=500&auto=format&fit=crop",
        coverImage: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=1200&auto=format&fit=crop",
        services: [
            { id: 10, name: "Instalação Elétrica", category: "Elétrica", price: "R$ 150,00", duration: "1h", icon: CheckCircle2 },
            { id: 11, name: "Pequenos Reparos", category: "Geral", price: "R$ 80,00", duration: "45 min", icon: CheckCircle2 },
        ],
        professionals: [
            { id: 3, name: "Carlos Oliveira", role: "Técnico", rating: 4.9, image: "https://images.unsplash.com/photo-1537368910025-bc008f3416ef?q=80&w=200&auto=format&fit=crop" },
        ],
        timeSlots: ["08:00", "09:30", "11:00", "13:30", "15:00"]
    },
    "fit-pro": {
        id: "3",
        name: "Studio Fit Pro",
        slug: "fit-pro",
        category: "Aulas",
        rating: 5.0,
        location: "Barra da Tijuca, RJ",
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=500&auto=format&fit=crop",
        coverImage: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop",
        services: [
            { id: 20, name: "Aula Personal", category: "Treino", price: "R$ 90,00", duration: "1h", icon: User },
            { id: 21, name: "Avaliação Física", category: "Saúde", price: "R$ 120,00", duration: "45 min", icon: CalendarIcon },
        ],
        professionals: [
            { id: 4, name: "Roberto Bastos", role: "Personal", rating: 5.0, image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop" },
        ],
        timeSlots: ["06:00", "07:00", "08:00", "18:00", "19:00", "20:00"]
    }
};

export interface Booking {
    id: string;
    customerName: string;
    serviceName: string;
    serviceType: string; // e.g., "Cabelo", "Barba", "Massagem"
    professionalName: string;
    date: string;
    time: string;
    status: "confirmed" | "pending" | "canceled" | "completed";
    price: number;
}

export const BOOKINGS: Booking[] = [
    {
        id: "1",
        customerName: "Lucas Souza",
        serviceName: "Corte Degradê",
        serviceType: "Cabelo",
        professionalName: "João Silva",
        date: "2024-02-20",
        time: "14:00",
        status: "confirmed",
        price: 45.00
    },
    {
        id: "2",
        customerName: "Matheus Oliveira",
        serviceName: "Barba Terapia",
        serviceType: "Barba",
        professionalName: "Carlos Santos",
        date: "2024-02-20",
        time: "15:30",
        status: "pending",
        price: 35.00
    },
    {
        id: "3",
        customerName: "Rafael Lima",
        serviceName: "Corte + Barba",
        serviceType: "Combo",
        professionalName: "João Silva",
        date: "2024-02-20",
        time: "16:45",
        status: "confirmed",
        price: 75.00
    },
    {
        id: "4",
        customerName: "Ana Clara",
        serviceName: "Massagem Relaxante",
        serviceType: "Massagem",
        professionalName: "Dra. Ana",
        date: "2024-02-21",
        time: "09:00",
        status: "confirmed",
        price: 120.00
    },
    {
        id: "5",
        customerName: "Pedro Alves",
        serviceName: "Acabamento",
        serviceType: "Cabelo",
        professionalName: "Carlos Santos",
        date: "2024-02-21",
        time: "10:30",
        status: "canceled",
        price: 20.00
    },
    // Novos Agendamentos para Exemplos da Home
    {
        id: "6",
        customerName: "Mariana Costa",
        serviceName: "Limpeza de Pele",
        serviceType: "Face",
        professionalName: "Dra. Ana Silva", // Lumière Estética
        date: "2024-02-22",
        time: "11:00",
        status: "confirmed",
        price: 120.00
    },
    {
        id: "7",
        customerName: "Roberto Almeida",
        serviceName: "Instalação Elétrica",
        serviceType: "Elétrica",
        professionalName: "Carlos Oliveira", // Dr. Fix
        date: "2024-02-22",
        time: "14:30",
        status: "pending",
        price: 150.00
    },
    {
        id: "8",
        customerName: "Fernanda Lima",
        serviceName: "Aula Personal",
        serviceType: "Treino",
        professionalName: "Roberto Bastos", // Studio Fit Pro
        date: "2024-02-23",
        time: "07:00",
        status: "confirmed",
        price: 90.00
    }
];
