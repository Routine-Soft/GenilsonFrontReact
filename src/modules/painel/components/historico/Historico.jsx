import { useMemo, useState } from 'react';
import { LuActivity, LuClipboardCheck, LuInbox, LuRefreshCw } from 'react-icons/lu';
import { useHistorico } from '../../painel.hooks';
import { agruparPorDia, contarHoje, normalizar, plural } from '../../painel.utils';
import PageHeader from '../shared/PageHeader';
import Busca from '../shared/Busca';
import EstadoVazio from '../shared/EstadoVazio';
import Aviso from '../shared/Aviso';
import CartaoAluno from './CartaoAluno';
import './Historico.css';

const TEXTOS = {
    estudos: {
        titulo: 'Estudando agora',
        subtitulo: 'Alunos que preencheram os dados e abriram um curso.',
        campo: 'tituloCurso',
        icone: <LuActivity />,
        vazio: 'Ninguém abriu um curso ainda',
        unidade: ['acesso', 'acessos'],
    },
    provasFeitas: {
        titulo: 'Provas feitas',
        subtitulo: 'Alunos que preencheram os dados e começaram uma prova.',
        campo: 'tituloProva',
        icone: <LuClipboardCheck />,
        vazio: 'Nenhuma prova feita ainda',
        unidade: ['prova', 'provas'],
    },
};

const PERIODOS = [
    { id: 'hoje', rotulo: 'Hoje', dias: 1 },
    { id: 'semana', rotulo: '7 dias', dias: 7 },
    { id: 'mes', rotulo: '30 dias', dias: 30 },
    { id: 'tudo', rotulo: 'Tudo', dias: null },
];

const POR_PAGINA = 40;

const Historico = ({ tipo }) => {
    const textos = TEXTOS[tipo];
    const { itens, carregando, erro, atualizar } = useHistorico(tipo);
    const [busca, setBusca] = useState('');
    const [periodo, setPeriodo] = useState('tudo');
    const [limite, setLimite] = useState(POR_PAGINA);

    const filtrados = useMemo(() => {
        const termo = normalizar(busca);
        const dias = PERIODOS.find((p) => p.id === periodo).dias;
        const corte = new Date();
        corte.setHours(0, 0, 0, 0);
        if (dias) corte.setDate(corte.getDate() - (dias - 1));

        return itens.filter((item) => {
            if (dias && new Date(item.createdAt) < corte) return false;
            if (!termo) return true;
            return [item.name, item[textos.campo], item.cpf, item.email, item.whatsapp].some((v) => normalizar(v).includes(termo));
        });
    }, [itens, busca, periodo, textos.campo]);

    const grupos = agruparPorDia(filtrados.slice(0, limite));

    const mudarBusca = (valor) => {
        setBusca(valor);
        setLimite(POR_PAGINA);
    };

    const mudarPeriodo = (valor) => {
        setPeriodo(valor);
        setLimite(POR_PAGINA);
    };

    return (
        <div className="page">
            <PageHeader
                titulo={textos.titulo}
                subtitulo={textos.subtitulo}
                contador={carregando ? null : `${contarHoje(itens)} hoje`}
            >
                <button type="button" className="btn btn--ghost" onClick={atualizar} disabled={carregando}>
                    <LuRefreshCw aria-hidden="true" className={carregando ? 'gira' : ''} /> Atualizar
                </button>
            </PageHeader>

            {erro && <div className="alerts"><Aviso tipo="error">{erro}</Aviso></div>}

            <div className="barra-ferramentas">
                <Busca valor={busca} aoMudar={mudarBusca} placeholder="Buscar por aluno, curso, CPF ou e-mail" />
                <div className="periodos" role="radiogroup" aria-label="Período">
                    {PERIODOS.map((p) => (
                        <button
                            key={p.id}
                            type="button"
                            role="radio"
                            aria-checked={periodo === p.id}
                            className="periodo"
                            onClick={() => mudarPeriodo(p.id)}
                        >
                            {p.rotulo}
                        </button>
                    ))}
                </div>
            </div>

            {carregando ? (
                <div className="historico-lista">
                    {[0, 1, 2, 3, 4].map((i) => <div key={i} className="skeleton historico-skeleton" />)}
                </div>
            ) : filtrados.length === 0 ? (
                <div className="card">
                    <EstadoVazio
                        icone={busca ? <LuInbox /> : textos.icone}
                        titulo={busca || periodo !== 'tudo' ? 'Nada encontrado' : textos.vazio}
                        texto={busca || periodo !== 'tudo' ? 'Tente outro nome ou escolha um período maior.' : 'Assim que um aluno preencher os dados, ele aparece aqui.'}
                    >
                        {(busca || periodo !== 'tudo') && (
                            <button type="button" className="btn btn--ghost" onClick={() => { mudarBusca(''); mudarPeriodo('tudo'); }}>
                                Ver todos
                            </button>
                        )}
                    </EstadoVazio>
                </div>
            ) : (
                <>
                    <p className="contagem">{plural(filtrados.length, textos.unidade[0], textos.unidade[1])}</p>
                    {grupos.map((grupo) => (
                        <section key={grupo.rotulo} className="historico-grupo" aria-label={grupo.rotulo}>
                            <h2 className="historico-grupo__titulo">
                                {grupo.rotulo}
                                <span className="badge">{grupo.itens.length}</span>
                            </h2>
                            <ul className="historico-lista cascata">
                                {grupo.itens.map((item, index) => (
                                    <CartaoAluno key={item._id} item={item} titulo={item[textos.campo]} index={Math.min(index, 10)} />
                                ))}
                            </ul>
                        </section>
                    ))}
                    {filtrados.length > limite && (
                        <button type="button" className="btn btn--ghost btn-mais" onClick={() => setLimite((l) => l + POR_PAGINA)}>
                            Mostrar mais ({plural(filtrados.length - limite, 'restante', 'restantes')})
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default Historico;
