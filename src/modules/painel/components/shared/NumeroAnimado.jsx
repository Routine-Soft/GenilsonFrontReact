import { useEffect, useState } from 'react';

const reduzirMovimento = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Número que "sobe" de 0 até o valor
const NumeroAnimado = ({ valor, duracao = 1100 }) => {
    const [mostrado, setMostrado] = useState(0);

    useEffect(() => {
        let quadro;
        const inicio = performance.now();
        const passo = (agora) => {
            const progresso = reduzirMovimento() ? 1 : Math.min(1, (agora - inicio) / duracao);
            const suave = 1 - Math.pow(1 - progresso, 3);
            setMostrado(Math.round(valor * suave));
            if (progresso < 1) quadro = requestAnimationFrame(passo);
        };
        quadro = requestAnimationFrame(passo);
        return () => cancelAnimationFrame(quadro);
    }, [valor, duracao]);

    return <>{mostrado.toLocaleString('pt-BR')}</>;
};

export default NumeroAnimado;
