import { forwardRef } from 'react';
import logo from '../../../assets/img/logo.png';
import { formatarTelefone, NOTA_MINIMA, WHATSAPP_EMPRESA } from '../aluno.utils';

const Campo = ({ rotulo, valor }) => (
    <div className="comp-campo">
        <dt>{rotulo}</dt>
        <dd>{valor || <span className="comp-vazio">Não informado</span>}</dd>
    </div>
);

// Comprovante de prova aprovada: vai para o dono da empresa do aluno. É copiado para gerar o PDF (A4).
export const Comprovante = forwardRef(({ tituloProva, aluno, respostas, acertos, nota, data, hora }, ref) => {
    const erros = respostas.length - acertos;
    return (
        <article className="comprovante" ref={ref}>
            <header className="comp-topo">
                <img src={logo} alt="CESTSEG Trabalho" />
                <div className="comp-emissor">
                    <strong>CEST Segurança do Trabalho</strong>
                    <span>cestsegtrabalho.com.br</span>
                    <span>WhatsApp {formatarTelefone(WHATSAPP_EMPRESA)}</span>
                </div>
            </header>

            <div className="comp-faixa">
                <h2>Comprovante de realização de prova</h2>
                <span className="comp-situacao">Aprovado(a)</span>
            </div>

            <p className="comp-declaracao">
                Declaramos que <strong>{aluno.nome || 'o(a) aluno(a)'}</strong>
                {aluno.cpf && <>, CPF <strong>{aluno.cpf}</strong>,</>} realizou a prova online <strong>{tituloProva}</strong> em {data}, às {hora},
                e foi <strong>aprovado(a)</strong> com {nota}% de acertos.
            </p>

            <div className="comp-blocos">
                <section className="comp-bloco">
                    <h3>Dados do aluno</h3>
                    <dl>
                        <Campo rotulo="Nome" valor={aluno.nome} />
                        <Campo rotulo="CPF" valor={aluno.cpf} />
                        <Campo rotulo="Empresa" valor={aluno.empresa} />
                        <Campo rotulo="E-mail" valor={aluno.email} />
                        <Campo rotulo="WhatsApp" valor={aluno.whatsapp} />
                    </dl>
                </section>
                <section className="comp-bloco">
                    <h3>Resultado</h3>
                    <dl>
                        <Campo rotulo="Prova" valor={tituloProva} />
                        <Campo rotulo="Data e hora" valor={`${data} às ${hora}`} />
                        <Campo rotulo="Acertos" valor={`${acertos} de ${respostas.length}${erros ? ` (${erros} ${erros === 1 ? 'erro' : 'erros'})` : ''}`} />
                        <Campo rotulo="Nota" valor={`${nota}% (mínima ${NOTA_MINIMA}%)`} />
                        <Campo rotulo="Situação" valor="Aprovado(a)" />
                    </dl>
                </section>
            </div>

            <section className="comp-respostas">
                <h3>Questões da prova</h3>
                <ol>
                    {respostas.map((r) => (
                        <li key={r.numero} className={`comp-questao ${r.acertou ? 'comp-acerto' : 'comp-erro'}`}>
                            <span className="comp-marca" aria-hidden="true">{r.acertou ? '✓' : '✗'}</span>
                            <div>
                                <p className="comp-pergunta"><strong>{r.numero}.</strong> {r.pergunta}</p>
                                <p className="comp-resposta">
                                    Resposta do aluno: {r.respostaAluno} <em>({r.acertou ? 'correta' : 'incorreta'})</em>
                                </p>
                                {!r.acertou && <p className="comp-resposta comp-correta">Resposta correta: {r.respostaCerta}</p>}
                            </div>
                        </li>
                    ))}
                </ol>
            </section>

            <footer className="comp-rodape">
                <div className="comp-assinaturas">
                    <div><span />Assinatura do(a) aluno(a)</div>
                    <div><span />Visto da empresa</div>
                </div>
                <p>Documento gerado automaticamente pelo sistema de provas online da CEST Segurança do Trabalho em {data} às {hora}.</p>
            </footer>
        </article>
    );
});

Comprovante.displayName = 'Comprovante';
