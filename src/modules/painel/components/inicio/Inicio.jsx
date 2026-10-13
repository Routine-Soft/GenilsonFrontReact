import { LuActivity, LuArrowRight, LuBookOpen, LuClipboardCheck, LuFileCheck, LuListChecks, LuPlus } from 'react-icons/lu';
import { useCadastro, useHistorico } from '../../painel.hooks';
import { contarHoje, contarNoMes, dataPorExtenso, plural, porDia, primeiroNome, saudacao } from '../../painel.utils';
import NumeroAnimado from '../shared/NumeroAnimado';
import Aviso from '../shared/Aviso';
import GraficoSemana from './GraficoSemana';
import ListaRecentes from './ListaRecentes';
import './Inicio.css';

const Inicio = ({ nome, irPara }) => {
    const estudos = useHistorico('estudos');
    const provasFeitas = useHistorico('provasFeitas');
    const cursos = useCadastro('cursos');
    const provas = useCadastro('provas');

    const indicadores = [
        {
            id: 'estudando',
            rotulo: 'Estudando hoje',
            valor: contarHoje(estudos.itens),
            detalhe: `${plural(estudos.itens.length, 'acesso', 'acessos')} no total`,
            icone: <LuActivity />,
            carregando: estudos.carregando,
            aoVivo: true,
        },
        {
            id: 'provas-feitas',
            rotulo: 'Provas feitas no mês',
            valor: contarNoMes(provasFeitas.itens),
            detalhe: `${plural(provasFeitas.itens.length, 'prova feita', 'provas feitas')} no total`,
            icone: <LuClipboardCheck />,
            carregando: provasFeitas.carregando,
        },
        {
            id: 'cursos',
            rotulo: 'Cursos',
            valor: cursos.itens.length,
            detalhe: 'cadastrados no sistema',
            icone: <LuBookOpen />,
            carregando: cursos.carregando,
        },
        {
            id: 'provas',
            rotulo: 'Provas',
            valor: provas.itens.length,
            detalhe: 'cadastradas no sistema',
            icone: <LuListChecks />,
            carregando: provas.carregando,
        },
    ];

    const erro = estudos.erro || provasFeitas.erro || cursos.erro || provas.erro;

    return (
        <div className="page inicio">
            <section className="card card--faixa glass inicio-boasvindas">
                <div className="inicio-boasvindas__textos">
                    <span className="inicio-boasvindas__data">{dataPorExtenso()}</span>
                    <h1 className="inicio-boasvindas__titulo">
                        {saudacao()}, <span className="page-title__texto">{primeiroNome(nome)}</span>!
                    </h1>
                    <p className="page-subtitle">Veja quem está estudando e cuide dos seus cursos e provas.</p>
                </div>
                <div className="inicio-boasvindas__acoes">
                    <button type="button" className="btn btn--primary" onClick={() => irPara('cursos', { novo: '1' })}>
                        <LuPlus aria-hidden="true" /> Novo curso
                    </button>
                    <button type="button" className="btn btn--ghost" onClick={() => irPara('provas', { novo: '1' })}>
                        <LuPlus aria-hidden="true" /> Nova prova
                    </button>
                    <button type="button" className="btn btn--ghost" onClick={() => irPara('gabaritos', { novo: '1' })}>
                        <LuFileCheck aria-hidden="true" /> Novo gabarito
                    </button>
                </div>
                <span className="inicio-boasvindas__enfeite" aria-hidden="true" />
            </section>

            {erro && <div className="alerts"><Aviso tipo="error">{erro}</Aviso></div>}

            <section className="inicio-indicadores cascata" aria-label="Resumo">
                {indicadores.map((item, index) => (
                    <button
                        type="button"
                        key={item.id}
                        className="card indicador"
                        style={{ '--i': index }}
                        onClick={() => irPara(item.id)}
                    >
                        <span className="indicador__topo">
                            <span className="indicador__icone" aria-hidden="true">{item.icone}</span>
                            {item.aoVivo && <span className="badge badge--primary badge--live">ao vivo</span>}
                        </span>
                        {item.carregando ? (
                            <span className="skeleton indicador__skeleton" aria-label="Carregando" />
                        ) : (
                            <strong className="indicador__valor"><NumeroAnimado valor={item.valor} /></strong>
                        )}
                        <span className="indicador__rotulo">{item.rotulo}</span>
                        <span className="indicador__detalhe">
                            {item.carregando ? ' ' : item.detalhe}
                            <LuArrowRight aria-hidden="true" />
                        </span>
                    </button>
                ))}
            </section>

            <GraficoSemana dias={porDia(estudos.itens, 7)} carregando={estudos.carregando} />

            <div className="inicio-listas">
                <ListaRecentes
                    titulo="Quem estudou por último"
                    icone={<LuActivity />}
                    itens={estudos.itens.slice(0, 6)}
                    campoTitulo="tituloCurso"
                    carregando={estudos.carregando}
                    vazio="Ninguém abriu um curso ainda."
                    aoVerTodos={() => irPara('estudando')}
                />
                <ListaRecentes
                    titulo="Últimas provas feitas"
                    icone={<LuClipboardCheck />}
                    itens={provasFeitas.itens.slice(0, 6)}
                    campoTitulo="tituloProva"
                    carregando={provasFeitas.carregando}
                    vazio="Nenhuma prova feita ainda."
                    aoVerTodos={() => irPara('provas-feitas')}
                />
            </div>
        </div>
    );
};

export default Inicio;
