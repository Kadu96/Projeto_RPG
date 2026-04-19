import React from "react";

interface AtributosProps {
    label: string;
    value: number | undefined; 
}

const Atributos: React.FC<AtributosProps> = ({ label, value }) => {
    return (
        <div className="atributo-card">
            <div className="info-label" style={{textTransform: 'capitalize'}}>{label}</div>
            <div className="info-value" style={{fontSize:'1.5rem', fontWeight:'bold'}}>{value ?? 0}</div>
            <div className="modificador" style={{fontSize:'0.9rem', color:'#888'}}>
                Mod: {value !== undefined ? Math.floor((value - 10) / 2) : 0}
            </div>
        </div>
    );
};

export default Atributos;