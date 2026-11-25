import { API_URL } from '../shared/api';

// Páginas do aluno (curso e prova): tudo é público, sem login.

async function pedir(caminho, opcoes) {
    const resposta = await fetch(`${API_URL}${caminho}`, opcoes);
    if (!resposta.ok) {
        const erro = new Error(resposta.status === 404 ? 'Não encontrado' : 'Não foi possível carregar. Confira sua internet e tente de novo.');
        erro.status = resposta.status;
        throw erro;
    }
    return resposta.json();
}

function enviar(caminho, dados) {
    return pedir(caminho, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
    });
}

export const buscarCurso = (nameUrl) => pedir(`/curso/url/${encodeURIComponent(nameUrl)}`);
export const buscarProva = (nameUrl) => pedir(`/prova/${encodeURIComponent(nameUrl)}`);

// Histórico que aparece no painel ("Estudando agora" e "Provas feitas"). CPF e WhatsApp só com números.
export function registrarInicioCurso(tituloCurso, aluno) {
    return enviar('/historicocurso/criar', {
        tituloCurso,
        name: aluno.nome,
        email: aluno.email,
        whatsapp: aluno.whatsapp.replace(/\D/g, ''),
        cpf: aluno.cpf.replace(/\D/g, ''),
    });
}

export function registrarInicioProva(tituloProva, aluno) {
    return enviar('/historicoprova/criar', {
        tituloProva,
        name: aluno.nome,
        email: aluno.email,
        whatsapp: aluno.whatsapp.replace(/\D/g, ''),
        cpf: aluno.cpf.replace(/\D/g, ''),
    });
}

// E-mail "Um aluno começou a estudar" para a empresa (staticforms, como já era).
// Antes o formulário saía da página; agora vai por trás, sem tirar o aluno do curso.
const STATICFORMS_CHAVE = '91842200-0b17-4fa6-a9fd-84098f62897b';
export function avisarInicioEstudo(tituloCurso, aluno) {
    return fetch('https://api.staticforms.xyz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            accessKey: STATICFORMS_CHAVE,
            subject: `Um aluno começou a estudar: ${tituloCurso}`,
            replyTo: 'cestsegtrabalho@gmail.com',
            honeypot: '',
            $Curso: tituloCurso,
            $Nome: aluno.nome,
            $CPF: aluno.cpf,
            $Whatsapp: aluno.whatsapp,
            $Email: aluno.email || 'Não informado',
            '$Empresa ou Particular': aluno.empresa || 'Não informado',
        }),
    });
}
