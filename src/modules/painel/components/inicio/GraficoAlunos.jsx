import { useState } from 'react';
import { PERIODOS_GRAFICO, agruparPorPeriodo, plural } from '../../painel.utils';

const CHAVE = 'painelGraficoPeriodo';

function periodoGuardado() {
    try {
        const guardado = localStorage.getItem(CHAVE);
        return PERIODOS_GRAFICO.some((p) => p.id === guardado) ? guardado : 'semana';
    } catch {
        return 'semana';
    }
}

// Colunas com quantos alunos abriram um curso, com filtro de período (hoje, 7 dias, 30 dias, 12 meses, tudo)
const GraficoAlunos = ({ estudos, carregando }) => {
    const [periodo, setPeriodo] = useState(periodoGuardado);
    const info = PERIODOS_GRAFICO.find((p) => p.id === periodo);
    const colunas = agruparPorPeriodo(estudos, periodo);
    const maximo = Math.max(1, ...colunas.map((c) => c.total));
    const total = colunas.reduce((soma, c) => soma + c.total, 0);
    const maior = colunas.reduce((a, b) => (b.total > a.total ? b : a), colunas[0]);

    const escolher = (id) => {
        setPeriodo(id);
        try { localStorage.setItem(CHAVE, id); } catch { /* sem localStorage: só não lembra */ }
    };

    return (
        <section className="card grafico" aria-labelledby="grafico-titulo">
            <header className="grafico__cabecalho">
                <div>
                    <h2 id="grafico-titulo" className="secao-titulo">Alunos estudando</h2>
                    <p className="secao-subtitulo">
                        {carregando ? 'Carregando...' : `${plural(total, 'curso aberto', 'cursos abertos')} ${info.resumo}`}
                    </p>
                </div>
                <div className="grafico__filtro" role="radiogroup" aria-label="Período do gráfico">
                    {PERIODOS_GRAFICO.map((p) => (
                        <button
                            key={p.id}
                            type="button"
                            role="radio"
                            aria-checked={p.id === periodo}
                            className={`grafico__opcao${p.id === periodo ? ' is-ativo' : ''}`}
                            onClick={() => escolher(p.id)}
                        >
                            {p.rotulo}
                        </button>
                    ))}
                </div>
            </header>

            {carregando ? (
                <div className="grafico__area" style={{ '--colunas': 7 }} aria-hidden="true">
                    {Array.from({ length: 7 }, (_, i) => (
                        <div key={i} className="grafico__coluna">
                            <span className="skeleton grafico__skeleton" style={{ height: `${30 + ((i * 37) % 60)}%` }} />
                        </div>
                    ))}
                </div>
            ) : (
                <div
                    key={periodo}
                    className={`grafico__area${colunas.length > 12 ? ' is-denso' : ''}`}
                    style={{ '--colunas': colunas.length, '--passo': colunas.length > 12 ? '15ms' : '60ms' }}
                    role="img"
                    aria-label={`Gráfico: ${colunas.map((c) => `${c.rotuloLongo} ${c.total}`).join(', ')}`}
                >
                    {colunas.map((c, i) => {
                        const mostrarValor = c.total > 0 && (c.atual || c === maior) && colunas.length <= 12;
                        return (
                            <div key={c.inicio.toISOString()} className="grafico__coluna" style={{ '--i': i }}>
                                <div className="grafico__trilho" tabIndex={0} aria-label={`${c.rotuloLongo}: ${plural(c.total, 'aluno', 'alunos')}`}>
                                    <span className="grafico__dica" role="tooltip">
                                        <strong>{plural(c.total, 'aluno', 'alunos')}</strong>
                                        {c.rotuloLongo}
                                    </span>
                                    {mostrarValor && <span className="grafico__valor" style={{ bottom: `${(c.total / maximo) * 100}%` }}>{c.total}</span>}
                                    <span className="grafico__barra" style={{ height: `${Math.max(c.total ? 3 : 0, (c.total / maximo) * 100)}%` }} />
                                </div>
                                <span className={`grafico__dia${c.atual ? ' is-hoje' : ''}`} aria-hidden={!c.mostrarRotulo}>
                                    {c.mostrarRotulo ? c.rotulo : ' '}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}

            <table className="visualmente-oculto">
                <caption>Alunos que abriram um curso, {info.resumo}</caption>
                <thead><tr><th>Período</th><th>Alunos</th></tr></thead>
                <tbody>
                    {colunas.map((c) => (
                        <tr key={c.inicio.toISOString()}><td>{c.rotuloLongo}</td><td>{c.total}</td></tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
};

export default GraficoAlunos;
