/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';
import { RACAS_DATA } from '../data/racas';

export const useFichaStats = (ficha: any) => {
  return useMemo(() => {
    const raca = RACAS_DATA[ficha.raca_id];
    if (!raca) return { ...ficha, vidaMax: 0, manaMax: 0, deslocamentoFinal: 0 };

    // 1. Pegar Bases da Raça
    const pvBaseRaca = raca.recursos.find(r => r.reserva === 'vida')?.valor || 0;
    const manaBaseRaca = raca.recursos.find(r => r.reserva === 'mana')?.valor || 0;
    const vigorBaseRaca = raca.recursos.find(r => r.reserva === 'vigor')?.valor || 0;
    let deslocamento = parseFloat(raca.deslocamento);

    // 2. Cálculos de Progressão (Exemplo: 5 PV por nível além do 1º)
    let vidaMax = pvBaseRaca + ((ficha.nivel - 1) * 5);
    let manaMax = manaBaseRaca + ((ficha.nivel - 1) * 2);
    let vigorMax = vigorBaseRaca + ((ficha.nivel - 1) * 3);

    // 3. Somar Modificadores de Atributos (Ex: +CON na Vida)
    // Aqui você pegaria os valores de ficha.atributos.CON, etc.
    const modCon = Math.floor(((ficha.atributos?.CON || 10) - 10) / 2);
    const modFor = Math.floor(((ficha.atributos?.FOR || 10) - 10) / 2);
    const modDes = Math.floor(((ficha.atributos?.DES || 10) - 10) / 2);
    const modInt = Math.floor(((ficha.atributos?.INT || 10) - 10) / 2);
    const modSab = Math.floor(((ficha.atributos?.SAB || 10) - 10) / 2);
    const modCar = Math.floor(((ficha.atributos?.CAR || 10) - 10) / 2);

    vidaMax += (modCon * ficha.nivel);
    manaMax += (Math.max(modInt, modSab, modCar) * ficha.nivel);
    vigorMax += ((modFor + modDes) * ficha.nivel);

    // Pegamos as magias que já estão salvas no JSONB do banco
    const magiasSalvas = ficha.character_abilities?.magias || [];
    const efeitoMagia = raca?.caracteristicas.find(
      c => c.efeito?.tipo === 'SELECAO_DE_MAGIA'
    )?.efeito;
    const magiasFinais = magiasSalvas.slice(0, efeitoMagia?.valor || 0);

    // 4. Processar Efeitos Ativos das Características da Raça
    raca.caracteristicas.forEach(feat => {
      if (!feat.efeito) return;

      const { tipo, alvo, valor } = feat.efeito;

      if (tipo === 'RECURSO_POR_NIVEL') {
        if (alvo === 'vida') vidaMax += (valor * ficha.nivel);
        if (alvo === 'mana') manaMax += (valor * ficha.nivel);
        if (alvo === 'vigor') vigorMax += (valor * ficha.nivel);
      }

      if (tipo === 'SOMA_STATUS') {
        if (alvo === 'deslocamento') deslocamento += valor;
      }
    });

    return {
      ...ficha,
      vidaMax,
      manaMax,
      vigorMax,
      deslocamentoFinal: deslocamento,
      magiasDisponiveis: magiasFinais, 
      podeEscolherMagia: (efeitoMagia?.valor || 0) > magiasSalvas.length,
      limiteMagiasRaciais: efeitoMagia?.valor || 0
    };
  }, [ficha]);
};