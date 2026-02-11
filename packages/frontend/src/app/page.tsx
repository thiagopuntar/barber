import { redirect } from "next/navigation";

// Redireciona a página inicial (raiz) diretamente para a tela de login.
export default function Home() {
  redirect("/login");
}
