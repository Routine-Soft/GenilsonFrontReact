import { useEffect, useRef, useState } from 'react';
import { useComprovantePdf } from '../aluno.hooks';
import { LINK_CERTIFICADO, LINK_ORCAMENTO, LINK_SITE, NOTA_MINIMA, acertosMinimos, dataHora, lerAluno, nomeDoComprovante } from '../aluno.utils';
import { Comprovante } from './Comprovante';
import { FormularioAluno } from './FormularioAluno';

const Aprovado = ({ tituloProva, respostas, acertos, nota, quando, aluno }) => {
    const referencia = useRef(null);
    const { data, hora } = dataHora(quando);
    const nomeArquivo = nomeDoComprovante(tituloProva, aluno);
    const pdf = useComprovantePdf(referencia, nomeArquivo, true);
    const primeiroNome = aluno.nome.split(' ')[0];

    return (
        <>
            <div className="resultado-cartao">
                <div className="resultado-icone" aria-hidden="true">✓</div>
                <h2>Parabéns{primeiroNome ? `, ${primeiroNome}` : ''}! Você foi aprovado(a).</h2>
                <p>Você acertou <strong>{acertos} de {respostas.length}</strong> questões ({nota}%).</p>
                <p>Não precisa fazer mais nada: você já está registrado(a).</p>
                <div className="resultado-botoes">
                    <button type="button" className="botao botao-principal botao-grande" onClick={pdf.baixar}>
                        {pdf.gerando ? 'Preparando o PDF...' : 'Baixar comprovante (PDF)'}
                    </button>
                    {pdf.podeEnviar && (
                        <button type="button" className="botao botao-grande" onClick={() => pdf.enviar(`Comprovante da prova ${tituloProva} de ${aluno.nome}.`)}>
                            Enviar comprovante (WhatsApp, e-mail...)
                        </button>
                    )}
                    {pdf.mensagem && <p className="resultado-status" role="status">{pdf.mensagem}</p>}
                    <a className="botao botao-destaque" href={LINK_CERTIFICADO} target="_blank" rel="noopener noreferrer">Pagamento de certificado e reciclagem</a>
                    <a className="botao" href={LINK_ORCAMENTO} target="_blank" rel="noopener noreferrer">Solicitar orçamento</a>
                    <a className="botao botao-texto" href={LINK_SITE}>Voltar aos cursos</a>
                </div>
                <p className="resultado-dica">Envie o comprovante para a sua empresa.</p>
            </div>
            <p className="comprovante-rotulo">Prévia do comprovante</p>
            <div className="comprovante-moldura">
                <Comprovante ref={referencia} tituloProva={tituloProva} aluno={aluno} respostas={respostas} acertos={acertos} nota={nota} data={data} hora={hora} />
            </div>
        </>
    );
};

// Resultado da prova. Na prova sem formulário, o aluno se identifica aqui para o comprovante sair com nome e CPF.
export const Resultado = ({ tituloProva, respostas, quando, alunoInicial }) => {
    const caixa = useRef(null);
    const [aluno, setAluno] = useState(alunoInicial);
    const acertos = respostas.filter((r) => r.acertou).length;
    const nota = Math.round((acertos / respostas.length) * 100);
    const minimo = acertosMinimos(respostas.length);
    const aprovado = acertos >= minimo;

    useEffect(() => {
        caixa.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, []);

    if (!aprovado) {
        return (
            <section className="resultado resultado-reprovado" ref={caixa} aria-live="polite">
                <div className="resultado-cartao">
                    <div className="resultado-icone" aria-hidden="true">✗</div>
                    <h2>Você ainda não atingiu a nota mínima.</h2>
                    <p>Você acertou <strong>{acertos} de {respostas.length}</strong> questões ({nota}%). Para ser aprovado(a), precisa de {NOTA_MINIMA}% ({minimo} acertos).</p>
                    <p>As respostas erradas estão marcadas em vermelho. Revise e faça a prova de novo.</p>
                    <div className="resultado-botoes">
                        <button type="button" className="botao botao-principal botao-grande" onClick={() => { window.scrollTo(0, 0); window.location.reload(); }}>Refazer prova</button>
                        <a className="botao botao-texto" href={LINK_SITE}>Voltar aos cursos</a>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="resultado resultado-aprovado" ref={caixa} aria-live="polite">
            {aluno?.nome && aluno?.cpf ? (
                <Aprovado tituloProva={tituloProva} respostas={respostas} acertos={acertos} nota={nota} quando={quando} aluno={aluno} />
            ) : (
                <div className="resultado-cartao">
                    <div className="resultado-icone" aria-hidden="true">✓</div>
                    <h2>Parabéns! Você foi aprovado(a).</h2>
                    <p>Você acertou <strong>{acertos} de {respostas.length}</strong> questões ({nota}%).</p>
                    <p>Para gerar o seu comprovante, digite seu nome e CPF.</p>
                    <FormularioAluno tipoSenha={null} pedirWhatsapp={false} textoBotao="Gerar comprovante" aoConcluir={() => setAluno(lerAluno())} />
                </div>
            )}
        </section>
    );
};
