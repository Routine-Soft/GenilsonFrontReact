import { useCallback, useEffect, useState } from 'react';
import { apagarToken, buscarSenhas, entrar, lerToken, salvarSenhas, salvarToken } from './desenvolvedor.api';

export function useSessaoDesenvolvedor() {
    const [logado, setLogado] = useState(() => Boolean(lerToken()));
    const [entrando, setEntrando] = useState(false);
    const [erro, setErro] = useState('');

    const login = async (usuario, senha) => {
        setEntrando(true);
        setErro('');
        try {
            const dados = await entrar(usuario, senha);
            salvarToken(dados.token);
            setLogado(true);
        } catch (e) {
            setErro(e.message);
        } finally {
            setEntrando(false);
        }
    };

    const sair = useCallback(() => {
        apagarToken();
        setLogado(false);
    }, []);

    return { logado, entrando, erro, login, sair };
}

export function useSenhasAcesso(aoExpirar) {
    const [senhas, setSenhas] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');

    useEffect(() => {
        let ignore = false;
        Promise.resolve()
            .then(() => {
                if (ignore) return null;
                setCarregando(true);
                return buscarSenhas();
            })
            .then((dados) => {
                if (!ignore && dados) {
                    setSenhas(dados);
                    setCarregando(false);
                }
            })
            .catch((e) => {
                if (ignore) return;
                if (e.status === 401) return aoExpirar();
                setErro(e.message);
                setCarregando(false);
            });
        return () => { ignore = true; };
    }, [aoExpirar]);

    // Salva a nova senha de um tipo ('estudo' ou 'prova'); devolve true se deu certo
    const salvar = async (tipo, valor) => {
        setErro('');
        setSucesso('');
        try {
            const dados = await salvarSenhas({ [tipo]: valor.trim() });
            setSenhas(dados);
            setSucesso(`Senha ${tipo === 'estudo' ? 'do estudo' : 'da prova'} alterada para ${dados[tipo]}.`);
            return true;
        } catch (e) {
            if (e.status === 401) {
                aoExpirar();
                return false;
            }
            setErro(e.message);
            return false;
        }
    };

    return { senhas, carregando, erro, sucesso, salvar };
}
