import { LuLogOut, LuX } from 'react-icons/lu';
import { iniciais } from '../painel.utils';
import Marca from './shared/Marca';
import Preferencias from './shared/Preferencias';
import BotaoInstalar from './shared/BotaoInstalar';
import { SECOES } from './secoes';

const GRUPOS = ['Principal', 'Alunos', 'Conteúdo'];

const Sidebar = ({ aba, irPara, nome, email, aberto, aoFechar, aoSair, preferencias }) => (
    <aside id="menu-principal" className={`sidebar${aberto ? ' is-aberto' : ''}`} aria-label="Menu principal">
        <div className="sidebar__topo">
            <button type="button" className="sidebar__marca" onClick={() => irPara('inicio')} aria-label="Ir para o início">
                <Marca />
            </button>
            <button type="button" className="icon-btn sidebar__fechar" aria-label="Fechar menu" onClick={aoFechar}>
                <LuX aria-hidden="true" />
            </button>
        </div>

        <nav className="sidebar__nav">
            {GRUPOS.map((grupo) => (
                <div className="sidebar__grupo" key={grupo}>
                    <span className="sidebar__titulo">{grupo}</span>
                    <ul>
                        {SECOES.filter((s) => s.grupo === grupo).map((secao) => (
                            <li key={secao.id}>
                                <button
                                    type="button"
                                    className={`sidebar__link${aba === secao.id ? ' is-ativo' : ''}`}
                                    aria-current={aba === secao.id ? 'page' : undefined}
                                    onClick={() => irPara(secao.id)}
                                >
                                    {secao.icone}
                                    <span>{secao.rotulo}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </nav>

        <div className="sidebar__rodape">
            <BotaoInstalar />
            <Preferencias preferencias={preferencias} />

            <div className="sidebar__usuario">
                <span className="sidebar__avatar" aria-hidden="true">{iniciais(nome)}</span>
                <span className="sidebar__usuario-dados">
                    <strong>{nome}</strong>
                    {email && <span>{email}</span>}
                </span>
                <button type="button" className="icon-btn sidebar__sair" onClick={aoSair} aria-label="Sair" title="Sair">
                    <LuLogOut aria-hidden="true" />
                </button>
            </div>
        </div>
    </aside>
);

export default Sidebar;
