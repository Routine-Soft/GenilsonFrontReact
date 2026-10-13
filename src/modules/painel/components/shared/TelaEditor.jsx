import { useState } from 'react';
import { LuArrowLeft } from 'react-icons/lu';
import Aviso from './Aviso';

// Tela de criar/editar: botão voltar, formulário e rodapé fixo com Cancelar e Salvar
const TelaEditor = ({ titulo, subtitulo, aoVoltar, aoSalvar, podeSalvar = true, rotuloSalvar = 'Salvar', children }) => {
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState('');

    const enviar = async (e) => {
        e.preventDefault();
        setSalvando(true);
        setErro('');
        try {
            await aoSalvar();
        } catch (falha) {
            setErro(falha.message);
            setSalvando(false);
        }
    };

    return (
        <div className="page editor">
            <button type="button" className="btn btn--ghost btn--sm editor__voltar" onClick={aoVoltar}>
                <LuArrowLeft aria-hidden="true" /> Voltar para a lista
            </button>

            <header className="page-header">
                <div>
                    <h1 className="page-title"><span className="page-title__texto">{titulo}</span></h1>
                    {subtitulo && <p className="page-subtitle">{subtitulo}</p>}
                </div>
            </header>

            <form className="card card--faixa editor__form" onSubmit={enviar}>
                {erro && <Aviso tipo="error">{erro}</Aviso>}
                {children}

                <div className="editor__acoes">
                    <button type="button" className="btn btn--ghost" onClick={aoVoltar} disabled={salvando}>Cancelar</button>
                    <button type="submit" className={`btn btn--primary${salvando ? ' btn--loading' : ''}`} disabled={salvando || !podeSalvar}>
                        {salvando ? 'Salvando...' : rotuloSalvar}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TelaEditor;
