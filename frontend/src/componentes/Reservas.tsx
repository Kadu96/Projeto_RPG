import React from "react";

interface ReservasProps {
    label: string;
    atual: number | undefined; 
    maximo?: number | undefined;
}

const Reservas: React.FC<ReservasProps> = ({ label, atual, maximo }) => {
    return (
        <div className="atributo-card">
            <div className="info-label" style={{textTransform: 'capitalize'}}>{label}</div>
            <div className="info-value" style={{fontSize:'1.5rem', fontWeight:'bold'}}>
                {atual !== undefined ? atual : 0}
            </div>
            <div className="modificador" style={{fontSize:'0.9rem', color:'#888'}}>
                Máximo: {maximo !== undefined ? maximo : 0}
            </div>
        </div>
    );
};

export default Reservas;