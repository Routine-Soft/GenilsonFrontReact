import { useState } from 'react';
import isTokenValid from '../../../helps/useAuth';
import Painel from './Painel';
import Login from './Login';

// Endereço /painel: mostra o login novo ou, se já entrou, o painel novo.
// O painel antigo continua em / e /:username.
const PainelEntrada = () => {
    const [logado, setLogado] = useState(() => isTokenValid());
    return logado ? <Painel /> : <Login aoEntrar={() => setLogado(true)} />;
};

export default PainelEntrada;
