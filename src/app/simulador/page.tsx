import SimuladorForm from "@/components/SimuladorForm";

export default function SimuladorPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Simulador de Consórcio</h1>
        <p className="text-slate-500 text-sm mt-1">
          Monte uma estimativa rápida de parcela para apresentar ao cliente.
        </p>
      </div>

      <SimuladorForm />
    </div>
  );
}
