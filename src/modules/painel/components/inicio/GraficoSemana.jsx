import { formatarData, plural, rotuloCurtoDoDia } from '../../painel.utils';

// Colunas com quantos alunos abriram um curso em cada um dos últimos dias
const GraficoSemana = ({ dias, carregando }) => {
    const maximo = Math.max(1, ...dias.map((d) => d.total));
    const total = dias.reduce((soma, d) => soma + d.total, 0);
    const maior = dias.reduce((a, b) => (b.total > a.total ? b : a), dias[0]);

    return (
        <section className="card grafico" aria-labelledby="grafico-titulo">
            <header className="grafico__cabecalho">
                <div>
                    <h2 id="grafico-titulo" className="secao-titulo">Alunos estudando nos últimos 7 dias</h2>
                    <p className="secao-subtitulo">
                        {carregando ? 'Carregando...' : `${plural(total, 'curso aberto', 'cursos abertos')} na semana`}
                    </p>
                </div>
            </header>

            {carregando ? (
                <div className="grafico__area" aria-hidden="true">
                    {dias.map((d, i) => (
                        <div key={i} className="grafico__coluna">
                            <span className="skeleton grafico__skeleton" style={{ height: `${30 + ((i * 37) % 60)}%` }} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grafico__area" role="img" aria-label={`Gráfico: ${dias.map((d) => `${rotuloCurtoDoDia(d.dia)} ${d.total}`).join(', ')}`}>
                    {dias.map((d, i) => {
                        const ehHoje = i === dias.length - 1;
                        const mostrarValor = ehHoje || (d === maior && d.total > 0);
                        return (
                            <div key={d.dia.toISOString()} className="grafico__coluna" style={{ '--i': i }}>
                                <div className="grafico__trilho" tabIndex={0} aria-label={`${formatarData(d.dia)}: ${plural(d.total, 'aluno', 'alunos')}`}>
                                    <span className="grafico__dica" role="tooltip">
                                        <strong>{plural(d.total, 'aluno', 'alunos')}</strong>
                                        {formatarData(d.dia)}
                                    </span>
                                    {mostrarValor && <span className="grafico__valor" style={{ bottom: `${(d.total / maximo) * 100}%` }}>{d.total}</span>}
                                    <span className="grafico__barra" style={{ height: `${Math.max(d.total ? 3 : 0, (d.total / maximo) * 100)}%` }} />
                                </div>
                                <span className={`grafico__dia${ehHoje ? ' is-hoje' : ''}`}>{rotuloCurtoDoDia(d.dia)}</span>
                            </div>
                        );
                    })}
                </div>
            )}

            <table className="visualmente-oculto">
                <caption>Alunos que abriram um curso por dia</caption>
                <thead><tr><th>Dia</th><th>Alunos</th></tr></thead>
                <tbody>
                    {dias.map((d) => (
                        <tr key={d.dia.toISOString()}><td>{formatarData(d.dia)}</td><td>{d.total}</td></tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
};

export default GraficoSemana;
