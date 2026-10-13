import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import { LuMenu } from 'react-icons/lu';
import { usePreferencias, useSessao, useUsuario } from '../painel.hooks';
import Sidebar from './Sidebar';
import { SECOES } from './secoes';
import Marca from './shared/Marca';
import Inicio from './inicio/Inicio';
import Historico from './historico/Historico';
import Cursos from './cursos/Cursos';
import Provas from './provas/Provas';
import Gabaritos from './gabaritos/Gabaritos';
import '../styles/theme.css';
import '../styles/ui.css';
import './Painel.css';

const Painel = () => {
    const sessao = useSessao();
    const preferencias = usePreferencias();
    const usuario = useUsuario(sessao.username);
    const [params, setParams] = useSearchParams();
    const [menuAberto, setMenuAberto] = useState(false);

    const aba = SECOES.some((s) => s.id === params.get('aba')) ? params.get('aba') : 'inicio';
    const secao = SECOES.find((s) => s.id === aba);

    // extra: { novo: '1' } abre direto o formulário de cadastro da tela
    const irPara = (novaAba, extra = {}) => {
        setParams(novaAba === 'inicio' ? {} : { aba: novaAba, ...extra });
        setMenuAberto(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Menu aberto no celular: trava a rolagem do fundo e fecha com Esc
    useEffect(() => {
        if (!menuAberto) return undefined;
        const anterior = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const aoTeclar = (e) => { if (e.key === 'Escape') setMenuAberto(false); };
        document.addEventListener('keydown', aoTeclar);
        return () => {
            document.body.style.overflow = anterior;
            document.removeEventListener('keydown', aoTeclar);
        };
    }, [menuAberto]);

    const nome = usuario.dados?.name || sessao.nome || 'CestSeg';

    return (
        <div className="cs app-shell" data-tema={preferencias.tema}>
            <Helmet>
                <title>{`${secao.rotulo} · CestSeg Trabalho`}</title>
            </Helmet>
            <a className="app-pular" href="#conteudo">Ir para o conteúdo</a>

            <header className="app-topbar">
                <button
                    type="button"
                    className="icon-btn app-topbar__menu"
                    aria-label="Abrir menu"
                    aria-expanded={menuAberto}
                    aria-controls="menu-principal"
                    onClick={() => setMenuAberto(true)}
                >
                    <LuMenu aria-hidden="true" />
                </button>
                <button type="button" className="app-topbar__marca" onClick={() => irPara('inicio')} aria-label="Ir para o início">
                    <Marca />
                </button>
            </header>

            <Sidebar
                aba={aba}
                irPara={irPara}
                nome={nome}
                email={usuario.dados?.email}
                aberto={menuAberto}
                aoFechar={() => setMenuAberto(false)}
                aoSair={sessao.sair}
                preferencias={preferencias}
            />
            {menuAberto && <div className="app-overlay" onClick={() => setMenuAberto(false)} aria-hidden="true" />}

            <main id="conteudo" className="app-main" key={aba}>
                {aba === 'inicio' && <Inicio nome={nome} irPara={irPara} />}
                {aba === 'estudando' && <Historico tipo="estudos" />}
                {aba === 'provas-feitas' && <Historico tipo="provasFeitas" />}
                {aba === 'cursos' && <Cursos />}
                {aba === 'provas' && <Provas />}
                {aba === 'gabaritos' && <Gabaritos />}
            </main>
        </div>
    );
};

export default Painel;
