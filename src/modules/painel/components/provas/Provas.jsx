import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LuListChecks, LuPlus } from 'react-icons/lu';
import { useAviso, useCadastro } from '../../painel.hooks';
import { linkDaProva, normalizar, perguntaCompleta, perguntasDaProva, plural } from '../../painel.utils';
import PageHeader from '../shared/PageHeader';
import Busca from '../shared/Busca';
import EstadoVazio from '../shared/EstadoVazio';
import Aviso from '../shared/Aviso';
import CartaoConteudo from '../shared/CartaoConteudo';
import ProvaEditor from './ProvaEditor';
import '../shared/Cadastros.css';

const Provas = () => {
    const [params, setParams] = useSearchParams();
    const { itens, carregando, erro, salvar, remover } = useCadastro('provas');
    const [busca, setBusca] = useState('');
    const [editando, setEditando] = useState(() => (params.get('novo') ? 'novo' : null));
    const [aviso, setAviso] = useAviso();
    const [erroAcao, setErroAcao] = useState('');

    const filtrados = useMemo(() => {
        const termo = normalizar(busca);
        return itens.filter((p) => normalizar(p.nameProva).includes(termo) || normalizar(p.nameUrl).includes(termo));
    }, [itens, busca]);

    const fecharEditor = () => {
        setEditando(null);
        if (params.get('novo')) setParams({ aba: 'provas' });
        window.scrollTo({ top: 0 });
    };

    const aoSalvar = async (valores, id) => {
        await salvar(valores, id);
        setAviso(id ? `Prova "${valores.nameProva}" atualizada.` : `Prova "${valores.nameProva}" cadastrada.`);
        fecharEditor();
    };

    const aoExcluir = async (prova) => {
        setErroAcao('');
        try {
            await remover(prova._id);
            setAviso(`Prova "${prova.nameProva}" excluída.`);
            return true;
        } catch (e) {
            setErroAcao(e.message);
            return false;
        }
    };

    if (editando) {
        return (
            <ProvaEditor
                prova={editando === 'novo' ? null : editando}
                outras={itens.filter((p) => p._id !== editando._id)}
                aoVoltar={fecharEditor}
                aoSalvar={aoSalvar}
            />
        );
    }

    return (
        <div className="page">
            <PageHeader
                titulo="Provas"
                subtitulo="Cinco perguntas por prova. O aluno passa acertando 4 (nota 8)."
                contador={carregando ? null : plural(itens.length, 'prova', 'provas')}
            >
                <button type="button" className="btn btn--primary" onClick={() => setEditando('novo')}>
                    <LuPlus aria-hidden="true" /> Nova prova
                </button>
            </PageHeader>

            {(aviso || erro || erroAcao) && (
                <div className="alerts">
                    {aviso && <Aviso>{aviso}</Aviso>}
                    {(erro || erroAcao) && <Aviso tipo="error">{erro || erroAcao}</Aviso>}
                </div>
            )}

            {(carregando || itens.length > 0) && (
                <div className="barra-ferramentas">
                    <Busca valor={busca} aoMudar={setBusca} placeholder="Buscar prova pelo nome" />
                </div>
            )}

            {carregando ? (
                <ul className="conteudos">
                    {[0, 1, 2, 3].map((i) => <li key={i} className="skeleton conteudo-skeleton" />)}
                </ul>
            ) : itens.length === 0 ? (
                <div className="card">
                    <EstadoVazio icone={<LuListChecks />} titulo="Nenhuma prova ainda" texto="Cadastre a primeira prova com as cinco perguntas.">
                        <button type="button" className="btn btn--primary" onClick={() => setEditando('novo')}>
                            <LuPlus aria-hidden="true" /> Cadastrar prova
                        </button>
                    </EstadoVazio>
                </div>
            ) : filtrados.length === 0 ? (
                <div className="card">
                    <EstadoVazio icone={<LuListChecks />} titulo="Nenhuma prova com esse nome" texto="Confira se o nome está certo ou apague a busca.">
                        <button type="button" className="btn btn--ghost" onClick={() => setBusca('')}>Ver todas</button>
                    </EstadoVazio>
                </div>
            ) : (
                <ul className="conteudos cascata">
                    {filtrados.map((prova, index) => {
                        const completas = perguntasDaProva(prova).filter(perguntaCompleta).length;
                        return (
                            <CartaoConteudo
                                key={prova._id}
                                index={Math.min(index, 12)}
                                icone={<LuListChecks />}
                                titulo={prova.nameProva || 'Prova sem nome'}
                                criadoEm={prova.createdAt}
                                detalhes={(
                                    <span className={`badge ${completas === 5 ? 'badge--primary' : 'badge--accent'}`}>
                                        {completas === 5 ? '5 perguntas' : `${completas} de 5 perguntas completas`}
                                    </span>
                                )}
                                link={linkDaProva(prova)}
                                linkSemFormulario={linkDaProva(prova, true)}
                                rotuloWhatsApp="PROVA"
                                aoEditar={() => setEditando(prova)}
                                aoExcluir={() => aoExcluir(prova)}
                            />
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default Provas;
