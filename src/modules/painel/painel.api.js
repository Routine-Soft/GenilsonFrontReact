import { API_URL } from '../shared/api';

// Respostas guardadas por alguns minutos, para trocar de tela sem esperar de novo
const cache = new Map();
const VALIDADE_CACHE = 2 * 60 * 1000;

function cabecalhos() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: token } : {}),
    };
}

async function requisitar(caminho, opcoes = {}) {
    let resposta;
    try {
        resposta = await fetch(`${API_URL}${caminho}`, { ...opcoes, headers: cabecalhos() });
    } catch {
        throw new Error('Sem conexão com o servidor. Confira sua internet e tente de novo.');
    }

    const dados = await resposta.json().catch(() => ({}));
    if (!resposta.ok) {
        throw new Error(dados.message || dados.mensagem || dados.error || 'Algo deu errado. Tente de novo.');
    }
    return dados;
}

function buscarComCache(chave, caminho) {
    const guardado = cache.get(chave);
    if (guardado && Date.now() - guardado.quando < VALIDADE_CACHE) {
        return guardado.promessa;
    }
    const promessa = requisitar(caminho).catch((erro) => {
        cache.delete(chave);
        throw erro;
    });
    cache.set(chave, { promessa, quando: Date.now() });
    return promessa;
}

export function limparCache(chave) {
    if (chave) cache.delete(chave);
    else cache.clear();
}

/* ---------- Login e usuário ---------- */

export function entrar(email, password) {
    return requisitar('/user/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), password }),
    });
}

export function buscarUsuario(username) {
    return buscarComCache(`usuario:${username}`, `/user/${encodeURIComponent(username)}`);
}

/* ---------- Alunos (quem estudou e quem fez prova) ---------- */

export const listarEstudos = () => buscarComCache('estudos', '/historicocurso/get');
export const listarProvasFeitas = () => buscarComCache('provasFeitas', '/historicoprova/get');

/* ---------- Cadastros: cursos, provas e gabaritos ---------- */

// Cada cadastro tem a rota de listar, criar e a de editar/excluir por id
const RECURSOS = {
    cursos: { listar: '/curso/buscar', criar: '/curso/criar', item: '/curso' },
    provas: { listar: '/treino/buscar', criar: '/treino/criar', item: '/treino' },
    gabaritos: { listar: '/gabarito/buscar', criar: '/gabarito/criar', item: '/gabarito' },
};

export function listar(recurso) {
    return buscarComCache(recurso, RECURSOS[recurso].listar);
}

export async function criar(recurso, dados) {
    const resposta = await requisitar(RECURSOS[recurso].criar, { method: 'POST', body: JSON.stringify(dados) });
    limparCache(recurso);
    return resposta;
}

export async function editar(recurso, id, dados) {
    const resposta = await requisitar(`${RECURSOS[recurso].item}/${id}`, { method: 'PATCH', body: JSON.stringify(dados) });
    limparCache(recurso);
    return resposta;
}

export async function excluir(recurso, id) {
    await requisitar(`${RECURSOS[recurso].item}/${id}`, { method: 'DELETE' });
    limparCache(recurso);
}
