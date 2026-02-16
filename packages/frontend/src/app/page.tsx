import Link from "next/link";

// Redireciona a página inicial (raiz) diretamente para a tela de login.
export default function Home() {
  return (<div>
    <h1>Home</h1>
    <Link href="/barber123/booking">Booking</Link>
  </div>);
}
