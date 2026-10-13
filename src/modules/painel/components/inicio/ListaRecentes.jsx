import { LuArrowRight } from 'react-icons/lu';
import { iniciais, tempoRelativo } from '../../painel.utils';

const ListaRecentes = ({ titulo, icone, itens, campoTitulo, carregando, vazio, aoVerTodos }) => (
    <section className="card recentes">
        <header className="recentes__cabecalho">
            <span className="recentes__icone" aria-hidden="true">{icone}</span>
            <h2 className="secao-titulo">{titulo}</h2>
        </header>

        {carregando ? (
            <ul className="recentes__lista" aria-label="Carregando">
                {[0, 1, 2, 3].map((i) => (
                    <li key={i} className="recentes__item">
                        <span className="skeleton aluno-avatar" />
                        <span className="recentes__textos">
                            <span className="skeleton" style={{ height: 14, width: '60%' }} />
                            <span className="skeleton" style={{ height: 12, width: '85%', marginTop: 8 }} />
                        </span>
                    </li>
                ))}
            </ul>
        ) : itens.length === 0 ? (
            <p className="recentes__vazio">{vazio}</p>
        ) : (
            <ul className="recentes__lista cascata">
                {itens.map((item, index) => (
                    <li key={item._id} className="recentes__item" style={{ '--i': index }}>
                        <span className="aluno-avatar" aria-hidden="true">{iniciais(item.name)}</span>
                        <span className="recentes__textos">
                            <strong>{item.name || 'Aluno sem nome'}</strong>
                            <span>{item[campoTitulo] || '—'}</span>
                        </span>
                        <span className="recentes__quando">{tempoRelativo(item.createdAt)}</span>
                    </li>
                ))}
            </ul>
        )}

        <button type="button" className="btn btn--ghost btn--block recentes__todos" onClick={aoVerTodos}>
            Ver todos <LuArrowRight aria-hidden="true" />
        </button>
    </section>
);

export default ListaRecentes;
