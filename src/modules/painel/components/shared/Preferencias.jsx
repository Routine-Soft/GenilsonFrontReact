import { LuMinus, LuMoon, LuPlus, LuSun } from 'react-icons/lu';

const OPCOES_TEMA = [
    { valor: 'cestseg', rotulo: 'Cores da CestSeg', icone: <span className="tema-btn__logo" aria-hidden="true" /> },
    { valor: 'claro', rotulo: 'Tema claro', icone: <LuSun aria-hidden="true" /> },
    { valor: 'escuro', rotulo: 'Tema escuro', icone: <LuMoon aria-hidden="true" /> },
];

// Escolha do tema (3 botões com a cor de cada um) e do tamanho da letra
const Preferencias = ({ preferencias, compacto = false }) => {
    const { tema, setTema, escala, aumentar, diminuir, podeAumentar, podeDiminuir } = preferencias;

    return (
        <div className={`preferencias${compacto ? ' preferencias--compacto' : ''}`}>
            <div className="preferencias__linha">
                {!compacto && <span className="preferencias__rotulo">Cores</span>}
                <div className="tema-toggle" role="radiogroup" aria-label="Cores da tela">
                    {OPCOES_TEMA.map((opcao) => (
                        <button
                            key={opcao.valor}
                            type="button"
                            role="radio"
                            aria-checked={tema === opcao.valor}
                            aria-label={opcao.rotulo}
                            title={opcao.rotulo}
                            data-tema={opcao.valor}
                            className="tema-btn"
                            onClick={() => setTema(opcao.valor)}
                        >
                            {opcao.icone}
                        </button>
                    ))}
                </div>
            </div>

            <div className="preferencias__linha">
                {!compacto && <span className="preferencias__rotulo">Letra</span>}
                <div className="letra-toggle" role="group" aria-label="Tamanho da letra">
                    <button type="button" className="letra-btn" onClick={diminuir} disabled={!podeDiminuir} aria-label="Diminuir a letra" title="Diminuir a letra">
                        <LuMinus aria-hidden="true" />
                    </button>
                    <span className="letra-toggle__valor" aria-live="polite">
                        <span className="letra-toggle__a" aria-hidden="true">A</span>
                        {Math.round(escala * 100)}%
                    </span>
                    <button type="button" className="letra-btn" onClick={aumentar} disabled={!podeAumentar} aria-label="Aumentar a letra" title="Aumentar a letra">
                        <LuPlus aria-hidden="true" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Preferencias;
