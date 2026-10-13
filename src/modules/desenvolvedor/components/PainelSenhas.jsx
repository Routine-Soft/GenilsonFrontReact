import { useSenhasAcesso } from '../desenvolvedor.hooks';
import { formatarDataHora, TIPOS_SENHA } from '../desenvolvedor.utils';
import CardSenha from './CardSenha';

const PainelSenhas = ({ aoSair }) => {
    const { senhas, carregando, erro, sucesso, salvar } = useSenhasAcesso(aoSair);

    return (
        <main className="dev-painel">
            <header className="dev-painel__topo">
                <div>
                    <h1 className="dev-painel__titulo">Senhas de acesso</h1>
                    <p className="dev-texto-suave">
                        Valem na hora para o app e para as páginas do site.
                        {senhas?.updatedAt && ` Última alteração: ${formatarDataHora(senhas.updatedAt)}.`}
                    </p>
                </div>
                <button type="button" className="dev-btn dev-btn--fantasma" onClick={aoSair}>Sair</button>
            </header>

            {sucesso && <div className="dev-alerta dev-alerta--sucesso" key={sucesso}>{sucesso}</div>}
            {erro && <div className="dev-alerta dev-alerta--erro" key={erro}>{erro}</div>}

            <div className="dev-painel__grade">
                {TIPOS_SENHA.map((item, index) => (
                    carregando
                        ? <div key={item.tipo} className="dev-card dev-skeleton" />
                        : senhas && (
                            <CardSenha
                                key={item.tipo}
                                {...item}
                                index={index}
                                senhaAtual={senhas[item.tipo]}
                                aoSalvar={(valor) => salvar(item.tipo, valor)}
                            />
                        )
                ))}
            </div>
        </main>
    );
};

export default PainelSenhas;
