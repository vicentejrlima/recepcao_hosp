import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'calls.json');

// Função para garantir que o arquivo exista
const ensureFileExists = () => {
    if (!fs.existsSync(filePath)) {
        // Se o arquivo não existir, cria um com dados padrão
        fs.writeFileSync(filePath, JSON.stringify({ currentNumber: 0, calls: [] }, null, 2));
    }
};

// Função para ler as chamadas do arquivo
const readCallsFromFile = () => {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
};

// Função para salvar as chamadas no arquivo
const saveCallsToFile = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export default function handler(req, res) {
    // Garante que o arquivo existe antes de ler
    ensureFileExists();
    
    let { currentNumber: storedCurrentNumber, calls } = readCallsFromFile();

    if (req.method === 'POST') {
        const { number, guiche, date, time, reset } = req.body;

        if (reset) {
            // Reseta o número atual e limpa as chamadas
            storedCurrentNumber = number;
            calls = [];
            saveCallsToFile({ currentNumber: storedCurrentNumber, calls });
            res.status(200).json({ success: true });
        } else {
            // Adiciona nova senha chamada
            storedCurrentNumber = number;
            calls = [{ number, guiche, date, time }, ...calls.slice(0, 9)]; // Mantém as últimas 10 senhas
            saveCallsToFile({ currentNumber: storedCurrentNumber, calls });
            res.status(200).json({ success: true });
        }
    } else if (req.method === 'GET') {
        // Retorna o número atual e as últimas senhas chamadas
        res.status(200).json({ currentNumber: storedCurrentNumber, calls });
    }
}
