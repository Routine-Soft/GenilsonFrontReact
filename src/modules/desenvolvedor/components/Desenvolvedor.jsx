import { Helmet } from 'react-helmet';
import { useSessaoDesenvolvedor } from '../desenvolvedor.hooks';
import LoginDesenvolvedor from './LoginDesenvolvedor';
import PainelSenhas from './PainelSenhas';
import './desenvolvedor.css';

const Desenvolvedor = () => {
    const sessao = useSessaoDesenvolvedor();

    return (
        <div className="dev">
            <Helmet>
                <title>Desenvolvedor - CestSeg</title>
            </Helmet>
            {sessao.logado
                ? <PainelSenhas aoSair={sessao.sair} />
                : <LoginDesenvolvedor entrando={sessao.entrando} erro={sessao.erro} aoEntrar={sessao.login} />}
        </div>
    );
};

export default Desenvolvedor;
