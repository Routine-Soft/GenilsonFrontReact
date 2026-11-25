import { Helmet } from 'react-helmet';
import logo from '../../../assets/img/logo.png';
import { LINK_SITE } from '../aluno.utils';
import './Aluno.css';

// Moldura das páginas do aluno: título da aba e o fundo claro do site de cursos
export const PaginaAluno = ({ titulo, largura = 'normal', children }) => (
    <div className="aluno">
        <Helmet><title>{titulo}</title></Helmet>
        <main className={`prova ${largura === 'larga' ? 'modulo' : ''}`}>{children}</main>
    </div>
);

// Cartão do topo com o logo, a etiqueta (ex.: "Prova online") e o nome
export const Topo = ({ selo, titulo, regra, aluno }) => (
    <header className="prova-topo">
        <img className="prova-logo" src={logo} alt="CESTSEG Trabalho" />
        <p className="prova-selo">{selo}</p>
        <h1 className="prova-titulo">{titulo}</h1>
        {aluno?.nome && (
            <p className="prova-aluno">
                <span>{aluno.nome}</span>
                {aluno.cpf && <span className="prova-aluno-cpf">CPF {aluno.cpf}</span>}
            </p>
        )}
        {regra && <p className="prova-regra">{regra}</p>}
    </header>
);

export const Carregando = () => (
    <PaginaAluno titulo="Carregando...">
        <div className="esqueleto esqueleto-topo" aria-label="Carregando" />
        <div className="esqueleto esqueleto-bloco" />
        <div className="esqueleto esqueleto-bloco" />
    </PaginaAluno>
);

// Curso ou prova que não existe (link errado) ou falha de internet
// oQue: 'Prova' ou 'Curso'
export const NaoEncontrado = ({ oQue, erro }) => {
    const sumiu = erro?.status === 404;
    const nome = oQue === 'Prova' ? 'esta prova' : 'este curso';
    return (
        <PaginaAluno titulo={sumiu ? `${oQue} não encontrad${oQue === 'Prova' ? 'a' : 'o'}` : 'Erro ao carregar'}>
            <div className="estado-vazio">
                <span className="estado-vazio-icone" aria-hidden="true">{sumiu ? '🔎' : '📶'}</span>
                <h2>{sumiu ? `Não encontramos ${nome}` : 'Não foi possível carregar'}</h2>
                <p>{sumiu ? 'Confira o link que você recebeu ou fale com a empresa.' : 'Confira sua internet e tente de novo.'}</p>
                {sumiu
                    ? <a className="botao botao-principal" href={LINK_SITE}>Ver os cursos</a>
                    : <button type="button" className="botao botao-principal" onClick={() => window.location.reload()}>Tentar de novo</button>}
            </div>
        </PaginaAluno>
    );
};
