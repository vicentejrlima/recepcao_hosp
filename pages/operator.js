import { useState, useEffect } from 'react';
import { config } from './api/config';
import Header from './header';

export default function Operator() {
    const [currentNumber, setCurrentNumber] = useState(config.initialNumber);
    const [lastCalls, setLastCalls] = useState([]);
    const [resetNumber, setResetNumber] = useState(config.initialNumber); // Estado para o número de reset personalizado

    useEffect(() => {
        // Carrega o estado inicial da API ao carregar a página
        const loadInitialData = async () => {
            const response = await fetch('/api/calls');
            const data = await response.json();
            setCurrentNumber(data.currentNumber || config.initialNumber); // Carrega o número atual ou o inicial
            setLastCalls(data.calls || []); // Carrega as últimas chamadas
        };

        loadInitialData();
    }, []);

    const callNext = async (guiche) => {
        const nextNumber = currentNumber + 1;
        const now = new Date();
        const currentDate = now.toLocaleDateString(); 
        const currentTime = now.toLocaleTimeString(); 

        setCurrentNumber(nextNumber);

        const newCall = { number: nextNumber, guiche, date: currentDate, time: currentTime };

        // Envia a nova chamada para a API
        await fetch('/api/calls', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCall),
        });

        // Atualiza o estado local com a nova chamada
        setLastCalls((prevCalls) => [newCall, ...prevCalls.slice(0, 9)]);
    };

    const resetNumbers = async () => {
        // Reseta o número atual e as chamadas na API usando o número personalizado
        await fetch('/api/calls', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ number: resetNumber, reset: true }),
        });

        // Reseta o estado local
        setCurrentNumber(resetNumber);
        setLastCalls([]);
    };

    return (
        <>
        <Header/>
        <div style={{ padding: 20, textAlign: 'center' }}>
            <h1>Operador</h1>
            <div style={{ marginBottom: '20px', fontSize: '1.5rem' }}>
                <p><strong>Próxima Senha: {currentNumber + 1}</strong></p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '40px' }}>
                {config.guiches.map((guiche, index) => (
                    <button
                        key={index}
                        onClick={() => callNext(guiche)}
                        style={{
                            padding: '20px',
                            fontSize: '1.5rem',
                            backgroundColor: '#00510f',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            minWidth: '150px',
                        }}
                    >
                        {guiche}
                    </button>
                ))}
            </div>
            <div>
                <h2>Últimas Senhas</h2>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {lastCalls.map((call, index) => (
                        <li key={index} style={{ marginBottom: '10px', fontSize: '1.2rem' }}>
                            Senha: {call.number} - Guichê: {call.guiche} - Data: {call.date} - Hora: {call.time}
                        </li>
                    ))}
                </ul>
            </div>
            <div style={{ marginTop: '40px' }}>
                <input
                    type="number"
                    value={resetNumber}
                    onChange={(e) => setResetNumber(Number(e.target.value))}
                    style={{
                        padding: '10px',
                        fontSize: '1rem',
                        marginBottom: '20px',
                        textAlign: 'center',
                        borderRadius: '5px',
                        border: '1px solid #ccc'
                    }}
                />
                <button
                    onClick={resetNumbers}
                    style={{
                        padding: '15px 30px',
                        fontSize: '1.2rem',
                        backgroundColor: '#f00',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                    }}
                >
                    Resetar Senhas
                </button>
            </div>
        </div>
    </>
    );
}
// "Sgt Vicente - EsSLog"
