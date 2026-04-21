const StatusBar = ({ label, atual, max, colorClass }) => {
  const porcentagem = Math.max(0, Math.min(100, (atual / max) * 100));

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-bold uppercase text-slate-400">{label}</span>
        <span className="text-sm font-mono text-white">{atual} / {max}</span>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-2.5 border border-slate-700">
        <div 
          className={`h-full rounded-full transition-all duration-700 ${colorClass}`} 
          style={{ width: `${porcentagem}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StatusBar;