import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LuBookOpen, LuPlus, LuVideo } from 'react-icons/lu';
import { useAviso, useCadastro } from '../../painel.hooks';
import { linkDoCurso, normalizar, plural } from '../../painel.utils';
import PageHeader from '../shared/PageHeader';
import Busca from '../shared/Busca';
import EstadoVazio from '../shared/EstadoVazio';
import Aviso from '../shared/Aviso';
import CartaoConteudo from '../shared/CartaoConteudo';
import CursoEditor from './CursoEditor';
import '../shared/Cadastros.css';

const Cursos = () => {
    const [params, setParams] = useSearchParams();
    const { itens, carregando, erro, salvar, remover } = useCadastro('cursos');
    const [busca, setBusca] = useState('');
    const [editando, setEditando] = useState(() => (params.get('novo') ? 'novo' : null));
    const [aviso, setAviso] = useAviso();
    const [erroAcao, setErroAcao] = useState('');

    const filtrados = useMemo(() => {
        const termo = normalizar(busca);
        return itens.filter((c) => normalizar(c.titulo).includes(termo) || normalizar(c.nameUrl).includes(termo));
    }, [itens, busca]);

    const fecharEditor = () => {
        setEditando(null);
        if (params.get('novo')) setParams({ aba: 'cursos' });
        window.scrollTo({ top: 0 });
    };

    const aoSalvar = async (valores, id) => {
        await salvar(valores, id);
        setAviso(id ? `Curso "${valores.titulo}" atualizado.` : `Curso "${valores.titulo}" cadastrado.`);
        fecharEditor();
    };

    const aoExcluir = async (curso) => {
        setErroAcao('');
        try {
            await remover(curso._id);
            setAviso(`Curso "${curso.titulo}" excluído.`);
            return true;
        } catch (e) {
            setErroAcao(e.message);
            return false;
        }
    };

    if (editando) {
        return (
            <CursoEditor
                curso={editando === 'novo' ? null : editando}
                outros={itens.filter((c) => c._id !== editando._id)}
                aoVoltar={fecharEditor}
                aoSalvar={aoSalvar}
            />
        );
    }

    return (
        <div className="page">
            <PageHeader
                titulo="Cursos"
                subtitulo="O conteúdo que o aluno estuda antes da prova."
                contador={carregando ? null : plural(itens.length, 'curso', 'cursos')}
            >
                <button type="button" className="btn btn--primary" onClick={() => setEditando('novo')}>
                    <LuPlus aria-hidden="true" /> Novo curso
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
                    <Busca valor={busca} aoMudar={setBusca} placeholder="Buscar curso pelo nome" />
                </div>
            )}

            {carregando ? (
                <ul className="conteudos">
                    {[0, 1, 2, 3].map((i) => <li key={i} className="skeleton conteudo-skeleton" />)}
                </ul>
            ) : itens.length === 0 ? (
                <div className="card">
                    <EstadoVazio icone={<LuBookOpen />} titulo="Nenhum curso ainda" texto="Cadastre o primeiro curso e mande o link para os alunos pelo WhatsApp.">
                        <button type="button" className="btn btn--primary" onClick={() => setEditando('novo')}>
                            <LuPlus aria-hidden="true" /> Cadastrar curso
                        </button>
                    </EstadoVazio>
                </div>
            ) : filtrados.length === 0 ? (
                <div className="card">
                    <EstadoVazio icone={<LuBookOpen />} titulo="Nenhum curso com esse nome" texto="Confira se o nome está certo ou apague a busca.">
                        <button type="button" className="btn btn--ghost" onClick={() => setBusca('')}>Ver todos</button>
                    </EstadoVazio>
                </div>
            ) : (
                <ul className="conteudos cascata">
                    {filtrados.map((curso, index) => (
                        <CartaoConteudo
                            key={curso._id}
                            index={Math.min(index, 12)}
                            icone={<LuBookOpen />}
                            titulo={curso.titulo || 'Curso sem nome'}
                            criadoEm={curso.createdAt}
                            detalhes={curso.urlvideo ? <span className="badge badge--accent"><LuVideo aria-hidden="true" /> Com vídeo</span> : null}
                            link={linkDoCurso(curso)}
                            linkSemFormulario={linkDoCurso(curso, true)}
                            rotuloWhatsApp="CURSO"
                            aoEditar={() => setEditando(curso)}
                            aoExcluir={() => aoExcluir(curso)}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Cursos;
