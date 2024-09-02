import { useEffect, useState, useRef } from 'react';
import Header from './header';


export default function Visualization() {
    const [calls, setCalls] = useState([]);
    const previousCallsRef = useRef([]);
    const audioRef = useRef(null);

    useEffect(() => {
        const fetchCalls = async () => {
            const response = await fetch('/api/calls');
            const data = await response.json();
            setCalls(data.calls || []);

            // Verifica se há uma nova senha e toca o som
            if (previousCallsRef.current.length > 0 && data.calls && data.calls.length > 0) {
                const lastCallNumber = previousCallsRef.current[0]?.number;
                const newCallNumber = data.calls[0]?.number;

                // Toca o som se o número da senha mudou
                if (newCallNumber !== lastCallNumber) {
                    audioRef.current.play();
                }
            }

            // Atualiza o estado anterior para comparação futura
            previousCallsRef.current = data.calls || [];
        };

        // Buscar os dados a cada 2 segundos
        fetchCalls();
        const intervalId = setInterval(fetchCalls, 2000);

        // Limpa o intervalo quando o componente é desmontado
        return () => clearInterval(intervalId);
    }, []);

    return (
        <>
        <Header/>
        <div style={{ padding: 10, textAlign: 'center' }}>
            {/* <h1>Visualização</h1> */}

            {/* Elemento de áudio para a notificação sonora */}
            <audio ref={audioRef} src="/notification.mp3" preload="auto"></audio>

            {calls.length > 0 ? (
                <div>
                    <h2 style={{ fontSize: '100px' }}>SENHA: <b>{calls[0].number}</b></h2>
                    <h3 style={{ fontSize: '3rem' }}>Dirija-se ao: {calls[0].guiche}</h3>
                    <div style={{ marginTop: '40px' }}>
                        <h4>Últimas Senhas:</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {calls.slice(1).map((call, index) => (
                                <li key={index} style={{ marginBottom: '10px', fontSize: '1.2rem' }}>
                                    Senha: {call.number} - Guichê: {call.guiche} - Data: {call.date} - Hora: {call.time}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ) : (
                <p>Nenhuma chamada disponível no momento.</p>
            )}
        </div>
        </>);
}
// "Sgt Vicente - EsSLog"