import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const navigate = useNavigate();
    const [fichas, setFichas] = useState<{id: number, nome: string}[]>([]);
}