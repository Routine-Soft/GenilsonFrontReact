import { useState } from 'react';
import isTokenValid from '../../../helps/useAuth';
import Painel from './Painel';
import Login from './Login';

// Endereço /painel: mostra o login ou, se já entrou, o painel.
// /, /login e o endereço antigo /:username levam para cá (App.js).
const PainelEntrada = () => {
    const [logado, setLogado] = useState(() => isTokenValid());
    return logado ? <Painel /> : <Login aoEntrar={() => setLogado(true)} />;
};

export default PainelEntrada;
