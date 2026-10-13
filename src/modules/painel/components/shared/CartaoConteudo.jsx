import { LuExternalLink, LuLink, LuMessageCircle, LuPencil } from 'react-icons/lu';
import { compartilharNoWhatsApp, formatarData } from '../../painel.utils';
import BotaoCopiar from './BotaoCopiar';
import ConfirmarExclusao from './ConfirmarExclusao';

// Cartão de um curso ou de uma prova: link, compartilhar, editar e excluir
const CartaoConteudo = ({ icone, titulo, detalhes, criadoEm, link, linkSemFormulario, rotuloWhatsApp, index, aoEditar, aoExcluir }) => (
    <li className="card conteudo" style={{ '--i': index }}>
        <div className="conteudo__topo">
            <span className="conteudo__icone" aria-hidden="true">{icone}</span>
            <div className="conteudo__textos">
                <h3 className="conteudo__titulo">{titulo}</h3>
                <div className="conteudo__detalhes">{detalhes}</div>
            </div>
            <button type="button" className="icon-btn" onClick={aoEditar} aria-label={`Editar ${titulo}`} title="Editar">
                <LuPencil aria-hidden="true" />
            </button>
        </div>

        <a className="conteudo__link" href={link} target="_blank" rel="noopener noreferrer">
            <LuLink aria-hidden="true" />
            <span>{link.replace('https://', '')}</span>
            <LuExternalLink aria-hidden="true" />
        </a>

        <div className="conteudo__compartilhar">
            <button type="button" className="btn btn--whatsapp btn--sm" onClick={() => compartilharNoWhatsApp(`*${rotuloWhatsApp} ${titulo}*\n\n${link}`)}>
                <LuMessageCircle aria-hidden="true" /> WhatsApp
            </button>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => compartilharNoWhatsApp(`*${rotuloWhatsApp} ${titulo}*\n\n${linkSemFormulario}`)} title="O aluno abre direto, sem preencher nome e CPF">
                <LuMessageCircle aria-hidden="true" /> Sem formulário
            </button>
            <BotaoCopiar texto={link} />
        </div>

        <div className="conteudo__rodape">
            <span className="conteudo__data">{criadoEm ? `Criado em ${formatarData(criadoEm)}` : ''}</span>
            <ConfirmarExclusao pergunta={`Excluir "${titulo.length > 28 ? `${titulo.slice(0, 28)}…` : titulo}"?`} aoConfirmar={aoExcluir} />
        </div>
    </li>
);

export default CartaoConteudo;
