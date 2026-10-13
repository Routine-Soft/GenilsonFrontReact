import { useEffect, useState } from 'react';
import { LuCheck, LuCopy } from 'react-icons/lu';

const BotaoCopiar = ({ texto, rotulo = 'Copiar link' }) => {
    const [copiado, setCopiado] = useState(false);

    useEffect(() => {
        if (!copiado) return undefined;
        const timer = setTimeout(() => setCopiado(false), 2200);
        return () => clearTimeout(timer);
    }, [copiado]);

    const copiar = async () => {
        try {
            await navigator.clipboard.writeText(texto);
            setCopiado(true);
        } catch {
            window.prompt('Copie o link abaixo:', texto);
        }
    };

    return (
        <button type="button" className={`btn btn--ghost btn--sm${copiado ? ' is-copiado' : ''}`} onClick={copiar}>
            {copiado ? <LuCheck aria-hidden="true" /> : <LuCopy aria-hidden="true" />}
            <span aria-live="polite">{copiado ? 'Copiado!' : rotulo}</span>
        </button>
    );
};

export default BotaoCopiar;
