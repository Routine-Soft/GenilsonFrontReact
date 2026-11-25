import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { buscarProva, registrarInicioProva } from '../aluno.api';
import { useCarregar } from '../aluno.hooks';
import { NOTA_MINIMA, acertosMinimos, montarQuestoes } from '../aluno.utils';
import { Carregando, NaoEncontrado, PaginaAluno, Topo } from './PaginaAluno';
import { FormularioAluno } from './FormularioAluno';
import { Resultado } from './Resultado';

const LETRAS = 'ABCDEFGH';

const Questao = ({ questao, escolhida, corrigida, pendente, aoEscolher }) => {
    const estado = corrigida ? (escolhida?.certa ? 'questao-certa' : 'questao-errada') : pendente ? 'questao-pendente' : '';
    return (
        <fieldset className={`questao ${estado}`} id={`questao-${questao.numero}`}>
            <legend>
                <span className="questao-numero">{questao.numero}</span>
                <span>{questao.pergunta}</span>
            </legend>
            {questao.opcoes.map((opcao, i) => {
                const marcada = escolhida?.id === opcao.id;
                const cor = corrigida && marcada ? (opcao.certa ? 'opcao-certa' : 'opcao-errada') : '';
                return (
                    <label key={opcao.id} className={`opcao ${cor}`}>
                        <input
                            type="radio"
                            name={`questao-${questao.numero}`}
                            checked={marcada}
                            disabled={corrigida}
                            onChange={() => aoEscolher(questao.numero, opcao)}
                        />
                        <span className="opcao-letra">{LETRAS[i]}</span>
                        <span>{opcao.texto}</span>
                    </label>
                );
            })}
        </fieldset>
    );
};

const Questionario = ({ prova, aluno }) => {
    const questoes = useMemo(() => montarQuestoes(prova), [prova]);
    const [escolhas, setEscolhas] = useState({});
    const [pendentes, setPendentes] = useState([]);
    const [resultado, setResultado] = useState(null);
    const minimo = acertosMinimos(questoes.length);
    const respondidas = questoes.filter((q) => escolhas[q.numero]).length;
    const titulo = String(prova.nameProva || '').trim();

    const escolher = (numero, opcao) => {
        setEscolhas((e) => ({ ...e, [numero]: opcao }));
        setPendentes((p) => p.filter((n) => n !== numero));
    };

    const finalizar = (e) => {
        e.preventDefault();
        const faltam = questoes.filter((q) => !escolhas[q.numero]).map((q) => q.numero);
        if (faltam.length) {
            setPendentes(faltam);
            document.getElementById(`questao-${faltam[0]}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        setResultado({
            quando: new Date(),
            respostas: questoes.map((q) => ({
                numero: q.numero,
                pergunta: q.pergunta,
                respostaAluno: escolhas[q.numero].texto,
                respostaCerta: q.opcoes.find((o) => o.certa)?.texto || '',
                acertou: escolhas[q.numero].certa,
            })),
        });
    };

    return (
        <>
            <Topo selo="Prova online" titulo={titulo} aluno={aluno} regra={`${questoes.length} questões · nota mínima ${NOTA_MINIMA}% (${minimo} acertos)`} />
            <form className={`prova-questoes ${resultado ? 'prova-corrigida' : ''}`} onSubmit={finalizar} noValidate>
                {questoes.map((q) => (
                    <Questao
                        key={q.numero}
                        questao={q}
                        escolhida={escolhas[q.numero]}
                        corrigida={Boolean(resultado)}
                        pendente={pendentes.includes(q.numero)}
                        aoEscolher={escolher}
                    />
                ))}
                {!resultado && (
                    <div className="prova-acoes">
                        <p className="prova-progresso" aria-live="polite">Respondidas: {respondidas} de {questoes.length}</p>
                        {pendentes.length > 0 && (
                            <p className="prova-aviso" role="alert">
                                {pendentes.length === 1 ? 'Falta responder 1 questão. Ela está destacada acima.' : `Faltam ${pendentes.length} questões para responder. Elas estão destacadas acima.`}
                            </p>
                        )}
                        <button type="submit" className="botao botao-principal botao-grande">Finalizar prova</button>
                    </div>
                )}
            </form>
            {resultado && <Resultado tituloProva={titulo} respostas={resultado.respostas} quando={resultado.quando} alunoInicial={aluno} />}
        </>
    );
};

// Prova do aluno. comFormulario: pede dados e senha antes (link /prova/...); sem: vai direto (link /provasimples/...).
const ProvaAluno = ({ comFormulario }) => {
    const { nameUrl } = useParams();
    const { carregando, dados: prova, erro } = useCarregar(buscarProva, nameUrl);
    // sem formulário: o aluno confirma nome e CPF só no fim, para o comprovante (Resultado)
    const [aluno, setAluno] = useState(comFormulario ? null : {});

    if (carregando) return <Carregando />;
    if (erro || !prova) return <NaoEncontrado oQue="Prova" erro={erro || { status: 404 }} />;
    const titulo = String(prova.nameProva || '').trim();

    if (!aluno) {
        const entrar = async (dados) => {
            // registra o início da prova no histórico do painel ("Provas feitas"); se falhar, o aluno segue
            await registrarInicioProva(titulo, dados).catch(() => {});
            setAluno(dados);
            window.scrollTo(0, 0);
        };
        return (
            <PaginaAluno titulo={`Prova - ${titulo}`}>
                <Topo selo="Acesso à prova" titulo={titulo} regra={`Nota mínima ${NOTA_MINIMA}% · Depois de aprovado(a), você já fica registrado(a)`} />
                <FormularioAluno
                    intro="Preencha seus dados e a senha da prova. Eles aparecem no comprovante que você recebe ao ser aprovado(a)."
                    tipoSenha="prova"
                    textoBotao="Começar prova"
                    aoConcluir={entrar}
                />
            </PaginaAluno>
        );
    }

    return (
        <PaginaAluno titulo={`Prova - ${titulo}`}>
            <Questionario prova={prova} aluno={comFormulario ? aluno : null} />
        </PaginaAluno>
    );
};

export default ProvaAluno;
