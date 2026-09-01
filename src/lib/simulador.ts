// Cálculos do simulador de consórcio.
// Mantido separado da tela para ser fácil de ajustar/testar sem mexer no visual.
//
// IMPORTANTE: são fórmulas simplificadas para dar uma estimativa rápida ao
// representante durante a conversa com o cliente. Elas não substituem a
// tabela oficial da administradora — sempre confirme os valores exatos
// antes de formalizar uma proposta.

export interface ResultadoSimulacao {
  valorTotalPago: number;
  parcelaSemLance: number;
  valorLance: number;
  creditoLiquidoComLance: number;
  parcelaComLance: number | null;
}

export function calcularSimulacao(params: {
  valorCredito: number;
  prazoMeses: number;
  taxaAdminPercent: number; // ex: 18 = 18%
  fundoReservaPercent: number; // ex: 2 = 2%
  percentualLance: number; // ex: 20 = 20% do crédito, embutido
}): ResultadoSimulacao {
  const { valorCredito, prazoMeses, taxaAdminPercent, fundoReservaPercent, percentualLance } =
    params;

  // Valor total que será pago ao longo do consórcio (crédito + taxas)
  const valorTotalPago =
    valorCredito * (1 + taxaAdminPercent / 100 + fundoReservaPercent / 100);

  const parcelaSemLance = valorTotalPago / prazoMeses;

  // Lance embutido: "sai" do próprio valor de crédito contratado.
  // O cliente recebe uma carta de crédito menor, mas quita mais rápido/reduz parcela.
  const valorLance = valorCredito * (percentualLance / 100);
  const creditoLiquidoComLance = valorCredito - valorLance;

  let parcelaComLance: number | null = null;
  if (percentualLance > 0) {
    const totalComLance =
      creditoLiquidoComLance * (1 + taxaAdminPercent / 100 + fundoReservaPercent / 100) +
      valorLance; // o lance também compõe o total pago, só que adiantado
    parcelaComLance = totalComLance / prazoMeses;
  }

  return {
    valorTotalPago,
    parcelaSemLance,
    valorLance,
    creditoLiquidoComLance,
    parcelaComLance,
  };
}

export function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
