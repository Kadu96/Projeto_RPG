import React from 'react';

interface EquipamentoProps {
  dados?: unknown; // Aqui passamos o personagem?.equipamentos
}

const EquipamentoCard: React.FC<EquipamentoProps> = ({ dados }) => {
  if (!dados) return <div className="info-value">Nenhum equipamento.</div>;

  // Função auxiliar para renderizar slots (Cintura, Costas, Peitoral)
  const renderSlots = (label: string, categoria: any) => {
    if (!categoria) return null;
    return (
      <div className="equip-item-group">
        <span className="info-label">{label}:</span>
        <div style={{ marginLeft: '15px' }}>
          {categoria.slot1?.nome && (
            <div className="info-value">• {categoria.slot1.nome}: {categoria.slot1.descricao}</div>
          )}
          {categoria.slot2?.nome && (
            <div className="info-value">• {categoria.slot2.nome}: {categoria.slot2.descricao}</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="equip-container-interno">
      {/* Roupa */}
      <div className="info-item">
        <span className="info-label">Roupa:</span>
        <span className="info-value">{dados.roupa || "Nenhuma"}</span>
      </div>

      {/* Mochila */}
      {dados.mochila && (
        <div className="info-item">
          <span className="info-label">Mochila:</span>
          <span className="info-value">
            {dados.mochila.descricao} - {dados.mochila.slotsOcupados || 0} de {dados.mochila.slotsTotais || 0} slots.
          </span>
        </div>
      )}

      {/* Acessórios */}
      {dados.acessorios?.nome && (
        <div className="equip-item-group">
          <span className="info-label">Acessórios:</span>
          <div style={{ marginLeft: '15px' }} className="info-value">
            {dados.acessorios.nome}: {dados.acessorios.efeito}
          </div>
        </div>
      )}

      {/* Slots Complexos */}
      {renderSlots("Cintura", dados.cintura)}
      {renderSlots("Costas", dados.costas)}
      {renderSlots("Peitoral", dados.peitoral)}
    </div>
  );
};

export default EquipamentoCard;