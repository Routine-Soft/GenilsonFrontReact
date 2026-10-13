import { useState } from 'react';
import { LuChevronDown, LuIdCard, LuMail, LuMessageCircle } from 'react-icons/lu';
import { formatarHora, iniciais, linkConversaWhatsApp } from '../../painel.utils';

const CartaoAluno = ({ item, titulo, index }) => {
    const [aberto, setAberto] = useState(false);
    const whatsapp = linkConversaWhatsApp(item.whatsapp);

    return (
        <li className={`card aluno${aberto ? ' is-aberto' : ''}`} style={{ '--i': index }}>
            <button type="button" className="aluno__resumo" onClick={() => setAberto(!aberto)} aria-expanded={aberto}>
                <span className="aluno-avatar" aria-hidden="true">{iniciais(item.name)}</span>
                <span className="aluno__textos">
                    <strong>{item.name || 'Aluno sem nome'}</strong>
                    <span>{titulo || '—'}</span>
                </span>
                <span className="aluno__hora">{formatarHora(item.createdAt)}</span>
                <LuChevronDown className="aluno__seta" aria-hidden="true" />
            </button>

            {aberto && (
                <dl className="aluno__detalhes">
                    <div>
                        <dt><LuMessageCircle aria-hidden="true" /> WhatsApp</dt>
                        <dd>
                            {whatsapp
                                ? <a className="link-whatsapp" href={whatsapp} target="_blank" rel="noopener noreferrer">{item.whatsapp}</a>
                                : 'Não informado'}
                        </dd>
                    </div>
                    <div>
                        <dt><LuMail aria-hidden="true" /> E-mail</dt>
                        <dd>{item.email ? <a className="link" href={`mailto:${item.email}`}>{item.email}</a> : 'Não informado'}</dd>
                    </div>
                    <div>
                        <dt><LuIdCard aria-hidden="true" /> CPF</dt>
                        <dd>{item.cpf || 'Não informado'}</dd>
                    </div>
                </dl>
            )}
        </li>
    );
};

export default CartaoAluno;
