import { Scissors, Calendar as CalendarIcon, User, CheckCircle2 } from "lucide-react";

export interface Service {
    id: number;
    name: string;
    price: string;
    duration: string;
    icon: any;
}

export interface Professional {
    id: number;
    name: string;
    role: string;
    image: string;
}

export interface Company {
    name: string;
    slug: string;
    image: string;
    mapUrl: string; // URL do iframe do Google Maps
    services: Service[];
    professionals: Professional[];
    timeSlots: string[];
}

export const COMPANIES: Record<string, Company> = {
    "barbearia-premium": {
        name: "Barbearia Premium",
        slug: "barbearia-premium",
        image: "https://images.unsplash.com/photo-1503951914875-befbb7470d03?w=200&h=200&fit=crop",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3675.2960416233556!2d-43.18223!3d-22.9068!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x997f5e15151515%3A0x1515151515151515!2sCentro%2C%20Rio%20de%20Janeiro%20-%20RJ!5e0!3m2!1spt-BR!2sbr!4v1620000000000!5m2!1spt-BR!2sbr",
        services: [
            { id: 1, name: "Corte de Cabelo", price: "R$ 50,00", duration: "30 min", icon: Scissors },
            { id: 2, name: "Barba", price: "R$ 35,00", duration: "20 min", icon: User },
            { id: 3, name: "Combo Completo", price: "R$ 80,00", duration: "50 min", icon: CheckCircle2 },
        ],
        professionals: [
            { id: 1, name: "Barbeiro João", role: "Master Barber", image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop" },
            { id: 2, name: "Barbeiro Marcos", role: "Especialista", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop" },
            { id: 3, name: "Barbeiro Lucas", role: "Junior Barber", image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop" },
        ],
        timeSlots: [
            "09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00", "15:30", "16:00"
        ]
    },
    "corte-rapido": {
        name: "Corte Rápido",
        slug: "corte-rapido",
        image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=200&h=200&fit=crop",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1970666060606!2d-46.6562!3d-23.5631!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa363%3A0x4e2b0c1234567890!2sAv.%20Paulista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1620000000000!5m2!1spt-BR!2sbr",
        services: [
            { id: 1, name: "Corte Simples", price: "R$ 30,00", duration: "15 min", icon: Scissors },
            { id: 2, name: "Barba Express", price: "R$ 20,00", duration: "10 min", icon: User },
        ],
        professionals: [
            { id: 4, name: "Barbeiro Pedro", role: "Barbeiro", image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=400&fit=crop" },
            { id: 5, name: "Barbeiro Tiago", role: "Barbeiro", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" },
        ],
        timeSlots: [
            "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
        ]
    },
    "barbearia-teste": {
        name: "Barbearia Teste Ltda",
        slug: "barbearia-teste",
        image: "https://images.unsplash.com/photo-1621600411688-4be93cd68504?w=200&h=200&fit=crop",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14697.5452!2d-43.1!3d-22.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDU0JzAwLjAiUyA0M8KwMDYnMDAuMCJX!5e0!3m2!1spt-BR!2sbr!4v1620000000000!5m2!1spt-BR!2sbr",
        services: [
            { id: 1, name: "Corte Teste", price: "R$ 10,00", duration: "15 min", icon: Scissors },
        ],
        professionals: [
            { id: 6, name: "Barbeiro Teste", role: "Tester", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop" },
        ],
        timeSlots: [
            "10:00", "11:00"
        ]
    }
};
