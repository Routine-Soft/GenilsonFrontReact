import { API_URL } from '../shared/api';

// Pergunta ao backend se a senha digitada pelo aluno está certa.
// tipo: 'estudo' (curso) ou 'prova'. Lança erro se não conseguir falar com o servidor.
export async function validarSenhaAcesso(tipo, senha) {
    const resposta = await fetch(`${API_URL}/senha-acesso/validar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo, senha }),
    });

    if (!resposta.ok) {
        throw new Error('Não foi possível verificar a senha');
    }

    const dados = await resposta.json();
    return dados.valida === true;
}
