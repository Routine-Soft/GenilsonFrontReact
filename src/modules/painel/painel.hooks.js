import { useCallback, useEffect, useState } from 'react';
import * as api from './painel.api';
import { ordenarRecentes } from './painel.utils';

/* ---------- Preferências da tela: tema e tamanho da letra ---------- */

export const TEMAS = ['cestseg', 'claro', 'escuro'];
export const ESCALAS = [0.9, 1, 1.12, 1.25, 1.4];

function lerPreferencia(chave, padrao, validos) {
    try {
        const valor = localStorage.getItem(chave);
        const convertido = typeof padrao === 'number' ? Number(valor) : valor;
        return validos.includes(convertido) ? convertido : padrao;
    } catch {
        return padrao;
    }
}

function salvarPreferencia(chave, valor) {
    try {
        localStorage.setItem(chave, String(valor));
    } catch {
        // navegador sem armazenamento (modo privado): vale só nesta visita
    }
}

export function usePreferencias() {
    const [tema, setTemaState] = useState(() => lerPreferencia('cs-tema', 'cestseg', TEMAS));
    const [escala, setEscalaState] = useState(() => lerPreferencia('cs-escala', 1, ESCALAS));

    // O tamanho da letra muda a base (rem) da página toda enquanto o painel está aberto
    useEffect(() => {
        const raiz = document.documentElement;
        const anterior = raiz.style.fontSize;
        raiz.style.fontSize = `${escala * 100}%`;
        return () => { raiz.style.fontSize = anterior; };
    }, [escala]);

    const setTema = (novo) => {
        setTemaState(novo);
        salvarPreferencia('cs-tema', novo);
    };

    const mudarEscala = (passo) => {
        const atual = ESCALAS.indexOf(escala);
        const nova = ESCALAS[Math.min(ESCALAS.length - 1, Math.max(0, atual + passo))];
        setEscalaState(nova);
        salvarPreferencia('cs-escala', nova);
    };

    return {
        tema,
        setTema,
        escala,
        aumentar: () => mudarEscala(1),
        diminuir: () => mudarEscala(-1),
        podeAumentar: escala < ESCALAS[ESCALAS.length - 1],
        podeDiminuir: escala > ESCALAS[0],
    };
}

/* ---------- Sessão ---------- */

export function useSessao() {
    const username = localStorage.getItem('AlunoUsername');
    const nome = localStorage.getItem('AlunoUserName');

    // Sai das duas versões do painel (as duas usam o mesmo login); tema e letra ficam guardados
    const sair = () => {
        ['token', 'userEmail', 'AlunoUserid', 'AlunoUserName', 'AlunoUsername', 'userPhone'].forEach((chave) => localStorage.removeItem(chave));
        api.limparCache();
        window.location.href = '/painel';
    };

    return { username, nome, sair };
}

export function useLogin() {
    const [entrando, setEntrando] = useState(false);
    const [erro, setErro] = useState('');

    // Devolve o usuário logado ou null
    const entrar = async (email, senha) => {
        setEntrando(true);
        setErro('');
        try {
            const dados = await api.entrar(email, senha);
            localStorage.setItem('token', dados.token);
            localStorage.setItem('userEmail', email.trim());
            localStorage.setItem('AlunoUserid', dados.id);
            localStorage.setItem('AlunoUserName', dados.name);
            localStorage.setItem('AlunoUsername', dados.username);
            localStorage.setItem('userPhone', dados.phone);
            return dados;
        } catch (e) {
            setErro(e.message === 'Senha inválida' || e.message.includes('incorreto')
                ? 'E-mail ou senha incorretos. Confira e tente de novo.'
                : e.message);
            return null;
        } finally {
            setEntrando(false);
        }
    };

    return { entrando, erro, entrar };
}

/* ---------- Carregar dados do servidor ---------- */

// Busca com a função "carregar"; recarregar() busca de novo
function useCarregar(carregar) {
    const [dados, setDados] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [versao, setVersao] = useState(0);

    useEffect(() => {
        let ignore = false;
        Promise.resolve()
            .then(() => {
                if (ignore) return null;
                setCarregando(true);
                setErro('');
                return carregar();
            })
            .then((resposta) => {
                if (!ignore && resposta) {
                    setDados(resposta);
                    setCarregando(false);
                }
            })
            .catch((e) => {
                if (!ignore) {
                    setErro(e.message);
                    setCarregando(false);
                }
            });
        return () => { ignore = true; };
    }, [carregar, versao]);

    const recarregar = useCallback(() => setVersao((v) => v + 1), []);

    return { dados, setDados, carregando, erro, recarregar };
}

export function useUsuario(username) {
    const carregar = useCallback(() => api.buscarUsuario(username), [username]);
    return useCarregar(carregar);
}

// Histórico dos alunos: tipo 'estudos' (abriram um curso) ou 'provasFeitas'
export function useHistorico(tipo) {
    const carregar = useCallback(
        () => (tipo === 'estudos' ? api.listarEstudos() : api.listarProvasFeitas()).then(ordenarRecentes),
        [tipo]
    );
    const { dados, carregando, erro, recarregar } = useCarregar(carregar);
    const atualizar = () => {
        api.limparCache(tipo);
        recarregar();
    };
    return { itens: dados || [], carregando, erro, atualizar };
}

// Cadastro de cursos, provas ou gabaritos, com salvar e excluir
export function useCadastro(recurso) {
    const carregar = useCallback(() => api.listar(recurso).then(ordenarRecentes), [recurso]);
    const { dados, setDados, carregando, erro, recarregar } = useCarregar(carregar);

    // Cria (sem id) ou edita (com id); se der errado, lança o erro para a tela mostrar.
    // Se a lista ainda estava carregando, busca de novo para não perder o que foi salvo.
    const salvar = async (valores, id) => {
        if (carregando) {
            await (id ? api.editar(recurso, id, valores) : api.criar(recurso, valores));
            recarregar();
            return;
        }
        if (id) {
            const atualizado = await api.editar(recurso, id, valores);
            setDados((lista) => (lista || []).map((item) => (item._id === id ? { ...item, ...atualizado } : item)));
        } else {
            const novo = await api.criar(recurso, valores);
            setDados((lista) => [novo, ...(lista || [])]);
        }
    };

    const remover = async (id) => {
        await api.excluir(recurso, id);
        setDados((lista) => (lista || []).filter((item) => item._id !== id));
    };

    return { itens: dados || [], carregando, erro, recarregar, salvar, remover };
}

/* ---------- Mensagem de sucesso que some sozinha ---------- */

export function useAviso() {
    const [aviso, setAviso] = useState('');

    useEffect(() => {
        if (!aviso) return undefined;
        const timer = setTimeout(() => setAviso(''), 4500);
        return () => clearTimeout(timer);
    }, [aviso]);

    return [aviso, setAviso];
}
