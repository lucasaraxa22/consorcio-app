import { redirect } from "next/navigation";

export default function Home() {
  // Por enquanto o único módulo pronto é "Leads", então a home já manda pra lá.
  // Quando tivermos mais módulos, esta página vira um dashboard de verdade.
  redirect("/leads");
}
