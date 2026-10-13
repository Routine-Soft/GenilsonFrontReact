export const TIPOS_SENHA = [
    { tipo: 'estudo', titulo: 'Senha do estudo', descricao: 'O aluno digita para abrir o curso e estudar.' },
    { tipo: 'prova', titulo: 'Senha da prova', descricao: 'O aluno digita para começar a prova.' },
];

export function senhaValida(senha) {
    return /^\d+$/.test(senha.trim());
}

export function formatarDataHora(data) {
    if (!data) return '';
    return new Date(data).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}
