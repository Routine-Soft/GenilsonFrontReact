import { useSyncExternalStore } from 'react';
import { LuDownload } from 'react-icons/lu';
import { assinarInstalacao, instalarApp, podeInstalar } from '../../../../utils/instalarApp';

// Só aparece quando o navegador permite instalar (Chrome, Edge ou Android, com o app ainda não instalado)
const BotaoInstalar = () => {
    const disponivel = useSyncExternalStore(assinarInstalacao, podeInstalar, () => false);
    if (!disponivel) return null;

    return (
        <button type="button" className="btn btn--ghost btn--sm btn--block sidebar__instalar" onClick={instalarApp}>
            <LuDownload aria-hidden="true" /> Instalar aplicativo
        </button>
    );
};

export default BotaoInstalar;
