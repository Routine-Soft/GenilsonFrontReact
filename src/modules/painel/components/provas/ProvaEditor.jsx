import { useState } from 'react';
import { LuCircleCheck, LuCircleX } from 'react-icons/lu';
import { LINK_APP, paraSlug, perguntaCompleta, perguntasDaProva, treinosDasPerguntas } from '../../painel.utils';
import TelaEditor from '../shared/TelaEditor';
import CampoLink from '../shared/CampoLink';

const ProvaEditor = ({ prova, outras, aoVoltar, aoSalvar }) => {
    const [nameProva, setNameProva] = useState(prova?.nameProva || '');
    const [nameUrl, setNameUrl] = useState(prova?.nameUrl || '');
    const [linkMexido, setLinkMexido] = useState(Boolean(prova));
    const [perguntas, setPerguntas] = useState(() => perguntasDaProva(prova));

    const emUso = nameUrl !== '' && outras.some((p) => p.nameUrl === nameUrl);
    const completas = perguntas.filter(perguntaCompleta).length;

    const mudarTitulo = (valor) => {
        setNameProva(valor);
        if (!linkMexido) setNameUrl(paraSlug(valor));
    };

    const mudarPergunta = (indice, campo, valor) => {
        setPerguntas((lista) => lista.map((p, i) => (i === indice ? { ...p, [campo]: valor } : p)));
    };

    const salvar = () => aoSalvar({
        ...treinosDasPerguntas(perguntas, prova),
        nameProva: nameProva.trim(),
        nameUrl,
        linkUrl: `${LINK_APP}/prova/${nameUrl}`,
        ...(prova ? {} : { userid: localStorage.getItem('AlunoUserid') }),
    }, prova?._id);

    return (
        <TelaEditor
            titulo={prova ? 'Editar prova' : 'Nova prova'}
            subtitulo={prova ? prova.nameProva : 'Dê um nome, escolha o link e escreva as cinco perguntas.'}
            aoVoltar={aoVoltar}
            aoSalvar={salvar}
            podeSalvar={Boolean(nameProva.trim() && nameUrl) && !emUso && completas === 5}
            rotuloSalvar={prova ? 'Salvar alterações' : 'Cadastrar prova'}
        >
            <div className="field">
                <label className="field__label" htmlFor="prova-titulo">Nome da prova *</label>
                <input id="prova-titulo" className="input" value={nameProva} onChange={(e) => mudarTitulo(e.target.value)} placeholder="Ex.: Prova NR 35 - Trabalho em altura" required />
            </div>

            <CampoLink
                id="prova-link"
                pasta="prova"
                valor={nameUrl}
                aoMudar={(valor) => { setNameUrl(valor); setLinkMexido(true); }}
                emUso={emUso}
            />

            <div className="perguntas__cabecalho">
                <h2 className="secao-titulo">Perguntas</h2>
                <span className={`badge ${completas === 5 ? 'badge--primary' : 'badge--accent'}`}>{completas} de 5 prontas</span>
            </div>

            <ol className="perguntas">
                {perguntas.map((p, i) => (
                    <li key={i} className={`pergunta${perguntaCompleta(p) ? ' is-completa' : ''}`}>
                        <div className="pergunta__numero" aria-hidden="true">{i + 1}</div>
                        <div className="pergunta__campos">
                            <div className="field">
                                <label className="field__label" htmlFor={`p${i}-pergunta`}>Pergunta {i + 1}</label>
                                <input id={`p${i}-pergunta`} className="input" value={p.pergunta} onChange={(e) => mudarPergunta(i, 'pergunta', e.target.value)} placeholder="Escreva a pergunta" />
                            </div>
                            <div className="pergunta__respostas">
                                <div className="field">
                                    <label className="field__label field__label--certa" htmlFor={`p${i}-certa`}>
                                        <LuCircleCheck aria-hidden="true" /> Resposta certa
                                    </label>
                                    <input id={`p${i}-certa`} className="input input--certa" value={p.certa} onChange={(e) => mudarPergunta(i, 'certa', e.target.value)} />
                                </div>
                                <div className="field">
                                    <label className="field__label field__label--errada" htmlFor={`p${i}-errada1`}>
                                        <LuCircleX aria-hidden="true" /> Resposta errada
                                    </label>
                                    <input id={`p${i}-errada1`} className="input" value={p.errada1} onChange={(e) => mudarPergunta(i, 'errada1', e.target.value)} />
                                </div>
                                <div className="field">
                                    <label className="field__label field__label--errada" htmlFor={`p${i}-errada2`}>
                                        <LuCircleX aria-hidden="true" /> Outra resposta errada
                                    </label>
                                    <input id={`p${i}-errada2`} className="input" value={p.errada2} onChange={(e) => mudarPergunta(i, 'errada2', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ol>
            {completas < 5 && <p className="field__hint">Preencha a pergunta e as três respostas de todas as cinco para poder salvar.</p>}
        </TelaEditor>
    );
};

export default ProvaEditor;
