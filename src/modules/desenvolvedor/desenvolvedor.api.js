import { API_URL } from '../shared/api';

const CHAVE_TOKEN = 'DesenvolvedorToken';

export function lerToken() {
    return localStorage.getItem(CHAVE_TOKEN);
}

export function salvarToken(token) {
    localStorage.setItem(CHAVE_TOKEN, token);
}

export function apagarToken() {
    localStorage.removeItem(CHAVE_TOKEN);
}

// Faz a requisição e devolve o JSON; erro do backend vira Error com a mensagem em português
async function requisitar(caminho, opcoes = {}) {
    const token = lerToken();
    let resposta;

    try {
        resposta = await fetch(`${API_URL}${caminho}`, {
            ...opcoes,
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        });
    } catch {
        throw new Error('Sem conexão com o servidor. Verifique sua internet.');
    }

    const dados = await resposta.json().catch(() => ({}));

    if (!resposta.ok) {
        const erro = new Error(dados.message || 'Algo deu errado. Tente de novo.');
        erro.status = resposta.status;
        throw erro;
    }

    return dados;
}

export function entrar(usuario, senha) {
    return requisitar('/desenvolvedor/login', {
        method: 'POST',
        body: JSON.stringify({ usuario, senha }),
    });
}

export function buscarSenhas() {
    return requisitar('/desenvolvedor/senhas');
}

export function salvarSenhas(senhas) {
    return requisitar('/desenvolvedor/senhas', {
        method: 'PUT',
        body: JSON.stringify(senhas),
    });
}
