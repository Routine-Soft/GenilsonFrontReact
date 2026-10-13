import { useState } from 'react';
import { LuCheck, LuTrash2, LuX } from 'react-icons/lu';

// Botão "Excluir" que vira "Excluir? ✓ ✗" no próprio lugar
const ConfirmarExclusao = ({ pergunta = 'Excluir?', aoConfirmar }) => {
    const [confirmando, setConfirmando] = useState(false);
    const [excluindo, setExcluindo] = useState(false);

    if (!confirmando) {
        return (
            <button type="button" className="btn btn--danger btn--sm" onClick={() => setConfirmando(true)}>
                <LuTrash2 aria-hidden="true" /> Excluir
            </button>
        );
    }

    const confirmar = async () => {
        setExcluindo(true);
        const ok = await aoConfirmar();
        if (!ok) {
            setExcluindo(false);
            setConfirmando(false);
        }
    };

    return (
        <span className="confirmar" role="group" aria-label={pergunta}>
            {pergunta}
            <button type="button" className="icon-btn icon-btn--danger" onClick={confirmar} disabled={excluindo} aria-label="Sim, excluir" title="Sim, excluir">
                <LuCheck aria-hidden="true" />
            </button>
            <button type="button" className="icon-btn" onClick={() => setConfirmando(false)} disabled={excluindo} aria-label="Não excluir" title="Não excluir">
                <LuX aria-hidden="true" />
            </button>
        </span>
    );
};

export default ConfirmarExclusao;
