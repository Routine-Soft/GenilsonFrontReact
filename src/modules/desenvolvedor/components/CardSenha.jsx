import { useState } from 'react';
import { senhaValida } from '../desenvolvedor.utils';

const CardSenha = ({ titulo, descricao, senhaAtual, index, aoSalvar }) => {
    const [editando, setEditando] = useState(false);
    const [nova, setNova] = useState('');
    const [salvando, setSalvando] = useState(false);

    const invalida = nova !== '' && !senhaValida(nova);
    const igual = nova.trim() === senhaAtual;

    const abrir = () => {
        setNova(senhaAtual);
        setEditando(true);
    };

    const enviar = async (e) => {
        e.preventDefault();
        setSalvando(true);
        const ok = await aoSalvar(nova);
        setSalvando(false);
        if (ok) setEditando(false);
    };

    return (
        <section className="dev-card dev-senha" style={{ '--i': index }}>
            <h2 className="dev-senha__titulo">{titulo}</h2>
            <p className="dev-texto-suave">{descricao}</p>

            {editando ? (
                <form onSubmit={enviar} className="dev-senha__form">
                    <label className="dev-campo">
                        <span>Nova senha (só números)</span>
                        <input
                            className="dev-input dev-input--grande"
                            value={nova}
                            onChange={(e) => setNova(e.target.value)}
                            inputMode="numeric"
                            autoComplete="off"
                            autoFocus
                            required
                        />
                    </label>
                    {invalida && <small className="dev-aviso">Use só números, sem espaços ou letras.</small>}
                    <div className="dev-senha__acoes">
                        <button type="button" className="dev-btn dev-btn--fantasma" onClick={() => setEditando(false)} disabled={salvando}>
                            Cancelar
                        </button>
                        <button type="submit" className="dev-btn dev-btn--primario" disabled={salvando || invalida || igual || !nova.trim()}>
                            {salvando ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            ) : (
                <>
                    <div className="dev-senha__atual">
                        <span className="dev-texto-suave">Senha atual</span>
                        <strong className="dev-senha__valor">{senhaAtual}</strong>
                    </div>
                    <button type="button" className="dev-btn dev-btn--primario dev-btn--bloco" onClick={abrir}>
                        Trocar senha
                    </button>
                </>
            )}
        </section>
    );
};

export default CardSenha;
