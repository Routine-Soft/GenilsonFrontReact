import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LuChevronDown, LuFileCheck, LuPencil, LuPlus } from 'react-icons/lu';
import { useAviso, useCadastro } from '../../painel.hooks';
import { formatarData, normalizar, plural, resumoDoHtml } from '../../painel.utils';
import PageHeader from '../shared/PageHeader';
import Busca from '../shared/Busca';
import EstadoVazio from '../shared/EstadoVazio';
import Aviso from '../shared/Aviso';
import ConfirmarExclusao from '../shared/ConfirmarExclusao';
import GabaritoEditor from './GabaritoEditor';
import '../shared/Cadastros.css';

const Gabaritos = () => {
    const [params, setParams] = useSearchParams();
    const { itens, carregando, erro, salvar, remover } = useCadastro('gabaritos');
    const [busca, setBusca] = useState('');
    const [editando, setEditando] = useState(() => (params.get('novo') ? 'novo' : null));
    const [aberto, setAberto] = useState(null);
    const [aviso, setAviso] = useAviso();
    const [erroAcao, setErroAcao] = useState('');

    const filtrados = useMemo(() => {
        const termo = normalizar(busca);
        return itens.filter((g) => normalizar(g.titulo).includes(termo));
    }, [itens, busca]);

    const fecharEditor = () => {
        setEditando(null);
        if (params.get('novo')) setParams({ aba: 'gabaritos' });
        window.scrollTo({ top: 0 });
    };

    const aoSalvar = async (valores, id) => {
        await salvar(valores, id);
        setAviso(id ? `Gabarito "${valores.titulo}" atualizado.` : `Gabarito "${valores.titulo}" cadastrado.`);
        fecharEditor();
    };

    const aoExcluir = async (gabarito) => {
        setErroAcao('');
        try {
            await remover(gabarito._id);
            setAviso(`Gabarito "${gabarito.titulo}" excluído.`);
            return true;
        } catch (e) {
            setErroAcao(e.message);
            return false;
        }
    };

    if (editando) {
        return <GabaritoEditor gabarito={editando === 'novo' ? null : editando} aoVoltar={fecharEditor} aoSalvar={aoSalvar} />;
    }

    return (
        <div className="page">
            <PageHeader
                titulo="Gabaritos"
                subtitulo="As respostas certas de cada prova, para consultar quando precisar."
                contador={carregando ? null : plural(itens.length, 'gabarito', 'gabaritos')}
            >
                <button type="button" className="btn btn--primary" onClick={() => setEditando('novo')}>
                    <LuPlus aria-hidden="true" /> Novo gabarito
                </button>
            </PageHeader>

            {(aviso || erro || erroAcao) && (
                <div className="alerts">
                    {aviso && <Aviso>{aviso}</Aviso>}
                    {(erro || erroAcao) && <Aviso tipo="error">{erro || erroAcao}</Aviso>}
                </div>
            )}

            {itens.length > 0 && (
                <div className="barra-ferramentas">
                    <Busca valor={busca} aoMudar={setBusca} placeholder="Buscar gabarito pelo nome" />
                </div>
            )}

            {carregando ? (
                <ul className="gabaritos">
                    {[0, 1, 2].map((i) => <li key={i} className="skeleton historico-skeleton" />)}
                </ul>
            ) : itens.length === 0 ? (
                <div className="card">
                    <EstadoVazio icone={<LuFileCheck />} titulo="Nenhum gabarito ainda" texto="Guarde aqui as respostas certas de cada prova.">
                        <button type="button" className="btn btn--primary" onClick={() => setEditando('novo')}>
                            <LuPlus aria-hidden="true" /> Cadastrar gabarito
                        </button>
                    </EstadoVazio>
                </div>
            ) : filtrados.length === 0 ? (
                <div className="card">
                    <EstadoVazio icone={<LuFileCheck />} titulo="Nenhum gabarito com esse nome">
                        <button type="button" className="btn btn--ghost" onClick={() => setBusca('')}>Ver todos</button>
                    </EstadoVazio>
                </div>
            ) : (
                <ul className="gabaritos cascata">
                    {filtrados.map((g, index) => {
                        const estaAberto = aberto === g._id;
                        return (
                            <li key={g._id} className={`card gabarito${estaAberto ? ' is-aberto' : ''}`} style={{ '--i': Math.min(index, 12) }}>
                                <button type="button" className="gabarito__resumo" onClick={() => setAberto(estaAberto ? null : g._id)} aria-expanded={estaAberto}>
                                    <span className="conteudo__icone" aria-hidden="true"><LuFileCheck /></span>
                                    <span className="gabarito__textos">
                                        <strong>{g.titulo || 'Gabarito sem nome'}</strong>
                                        <span>{estaAberto ? (g.createdAt ? `Criado em ${formatarData(g.createdAt)}` : '') : resumoDoHtml(g.conteudogabarito, 110)}</span>
                                    </span>
                                    <LuChevronDown className="aluno__seta" aria-hidden="true" />
                                </button>
                                {estaAberto && (
                                    <div className="gabarito__corpo">
                                        {/* Conteúdo escrito pelo próprio dono no editor */}
                                        <div className="texto-rico" dangerouslySetInnerHTML={{ __html: g.conteudogabarito }} />
                                        <div className="conteudo__rodape">
                                            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setEditando(g)}>
                                                <LuPencil aria-hidden="true" /> Editar
                                            </button>
                                            <ConfirmarExclusao pergunta="Excluir este gabarito?" aoConfirmar={() => aoExcluir(g)} />
                                        </div>
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default Gabaritos;
