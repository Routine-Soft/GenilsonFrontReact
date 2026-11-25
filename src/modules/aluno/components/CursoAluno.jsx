import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { avisarInicioEstudo, buscarCurso, registrarInicioCurso } from '../aluno.api';
import { useCarregar } from '../aluno.hooks';
import { LINK_INSTRUTOR, LINK_SITE, linkDoVideo } from '../aluno.utils';
import { Carregando, NaoEncontrado, PaginaAluno, Topo } from './PaginaAluno';
import { FormularioAluno } from './FormularioAluno';

const Conteudo = ({ curso }) => {
    const video = linkDoVideo(curso.urlvideo);
    return (
        <>
            {video && (
                <section className="modulo-video">
                    <div className="video-caixa">
                        <iframe src={video} title={`Vídeo do curso ${curso.titulo}`} allow="autoplay; encrypted-media; fullscreen" allowFullScreen loading="lazy" />
                    </div>
                    <p>Vídeo opcional: ele gasta internet. Sem Wi-Fi? Leia o material abaixo.</p>
                </section>
            )}

            {curso.conteudo && (
                <section className="modulo-conteudo">
                    {/* texto feito no editor do painel (Cursos) */}
                    <div className="curso-texto" dangerouslySetInnerHTML={{ __html: curso.conteudo }} />
                </section>
            )}

            <section className="modulo-ajuda">
                <div>
                    <h2>Dúvidas sobre a matéria?</h2>
                    <p>Fale com o instrutor pelo WhatsApp.</p>
                </div>
                <a className="botao botao-principal" href={LINK_INSTRUTOR} target="_blank" rel="noopener noreferrer">Falar com o instrutor</a>
                <a className="botao" href={LINK_SITE}>Ver outros cursos</a>
            </section>
        </>
    );
};

// Curso do aluno. comFormulario: pede dados e a senha do estudo antes (link /curso/...); sem: abre direto (/cursosimples/...).
const CursoAluno = ({ comFormulario }) => {
    const { nameUrl } = useParams();
    const { carregando, dados: curso, erro } = useCarregar(buscarCurso, nameUrl);
    const [liberado, setLiberado] = useState(!comFormulario);

    if (carregando) return <Carregando />;
    if (erro || !curso) return <NaoEncontrado oQue="Curso" erro={erro || { status: 404 }} />;
    const titulo = String(curso.titulo || '').trim();

    if (!liberado) {
        const entrar = async (aluno) => {
            // "Estudando agora" no painel e o e-mail de aviso para a empresa; se falharem, o aluno segue estudando
            await Promise.allSettled([registrarInicioCurso(titulo, aluno), avisarInicioEstudo(titulo, aluno)]);
            setLiberado(true);
            window.scrollTo(0, 0);
        };
        return (
            <PaginaAluno titulo={`Curso - ${titulo}`}>
                <Topo selo="Curso online" titulo={titulo} />
                <FormularioAluno
                    intro="Preencha seus dados e a senha do curso para começar a estudar. Depois, faça a prova online."
                    tipoSenha="estudo"
                    textoBotao="Começar a estudar"
                    aoConcluir={entrar}
                />
            </PaginaAluno>
        );
    }

    return (
        <PaginaAluno titulo={`Curso - ${titulo}`} largura="larga">
            <Topo selo="Material de estudo" titulo={titulo} />
            <Conteudo curso={curso} />
        </PaginaAluno>
    );
};

export default CursoAluno;
