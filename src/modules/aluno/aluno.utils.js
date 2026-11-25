import html2pdf from 'html2pdf.js';

export const NOTA_MINIMA = 80;
export const WHATSAPP_EMPRESA = '5521973561012';
export const LINK_INSTRUTOR = `https://api.whatsapp.com/send?phone=${WHATSAPP_EMPRESA}&text=${encodeURIComponent('Olá professor. Preciso tirar uma dúvida sobre a matéria do curso')}`;
export const LINK_CERTIFICADO = `https://wa.me/${WHATSAPP_EMPRESA}?text=${encodeURIComponent('Vi no site, quero fazer pagamento do certificado!')}`;
export const LINK_ORCAMENTO = `https://api.whatsapp.com/send?phone=${WHATSAPP_EMPRESA}&text=${encodeURIComponent('Quero Solicitar Orçamento')}`;
export const LINK_SITE = 'https://cestsegtrabalho.com.br/';

// ---------- máscaras e validação ----------
export const soNumeros = (valor) => String(valor || '').replace(/\D/g, '');

export function mascaraCPF(valor) {
    return soNumeros(valor).slice(0, 11)
        .replace(/^(\d{3})(\d)/, '$1.$2')
        .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d{1,2})$/, '.$1-$2');
}

export function mascaraTelefone(valor) {
    const n = soNumeros(valor).replace(/^55(?=\d{10,11}$)/, '').slice(0, 11);
    if (n.length <= 2) return n.length ? `(${n}` : '';
    if (n.length <= 6) return `(${n.slice(0, 2)}) ${n.slice(2)}`;
    if (n.length <= 10) return `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6)}`;
    return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
}

export function cpfValido(cpf) {
    const n = soNumeros(cpf);
    if (n.length !== 11 || /^(\d)\1{10}$/.test(n)) return false;
    for (let t = 9; t < 11; t++) {
        let soma = 0;
        for (let i = 0; i < t; i++) soma += Number(n[i]) * (t + 1 - i);
        if (((soma * 10) % 11) % 10 !== Number(n[t])) return false;
    }
    return true;
}

export const emailValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ---------- dados do aluno guardados no aparelho (curso -> prova -> comprovante) ----------
const CHAVES = { nome: 'alunoNome', cpf: 'alunoCpf', whatsapp: 'alunoWhatsapp', email: 'alunoEmail', empresa: 'alunoEmpresa' };

export function lerAluno() {
    const aluno = {};
    Object.entries(CHAVES).forEach(([campo, chave]) => {
        try {
            aluno[campo] = localStorage.getItem(chave) || '';
        } catch {
            aluno[campo] = '';
        }
    });
    return aluno;
}

export function salvarAluno(aluno) {
    Object.entries(CHAVES).forEach(([campo, chave]) => {
        try {
            localStorage.setItem(chave, aluno[campo] || '');
        } catch {
            // navegador sem localStorage: segue sem guardar
        }
    });
}

// ---------- prova ----------
// No banco cada questão é treinoN[0]: grupoMuscular = pergunta, exercicio e series = erradas, repeticoes = certa.
// A certa sempre vinha em "c)"; aqui as opções são embaralhadas a cada vez que a prova abre.
function embaralhar(lista) {
    const copia = [...lista];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

export function montarQuestoes(prova) {
    return [1, 2, 3, 4, 5]
        .map((n) => prova?.[`treino${n}`]?.[0])
        .filter((q) => q && String(q.grupoMuscular || '').trim())
        .map((q, i) => ({
            numero: i + 1,
            pergunta: String(q.grupoMuscular).trim(),
            opcoes: embaralhar([
                { id: 'a', texto: String(q.exercicio || '').trim(), certa: false },
                { id: 'b', texto: String(q.series || '').trim(), certa: false },
                { id: 'c', texto: String(q.repeticoes || '').trim(), certa: true },
            ].filter((o) => o.texto)),
        }));
}

export const acertosMinimos = (total) => Math.ceil((total * NOTA_MINIMA) / 100);

// ---------- curso ----------
// Link do YouTube ou do Google Drive -> endereço para mostrar o vídeo na página
export function linkDoVideo(url) {
    if (!url) return null;
    const youtube = url.match(/(?:youtube\.com\/(?:embed\/|watch\?v=|shorts\/)|youtu\.be\/)([^\s&?/]+)/);
    if (youtube) return `https://www.youtube.com/embed/${youtube[1]}`;
    const drive = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
    if (drive) return `https://drive.google.com/file/d/${drive[1]}/preview`;
    return null;
}

// ---------- comprovante ----------
export function dataHora(data = new Date()) {
    return {
        data: data.toLocaleDateString('pt-BR'),
        hora: data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };
}

export const formatarTelefone = (tel) => mascaraTelefone(tel) || tel;

// Texto seguro para nome de arquivo: sem acento, sem símbolo, com hífens
export function limparNome(texto) {
    return String(texto || '').normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^\w\s-]/g, ' ').trim().replace(/[\s-]+/g, '-');
}

export function nomeDoComprovante(tituloProva, aluno) {
    return `Comprovante-${limparNome(tituloProva.replace(/^prova\s+/i, ''))}` +
        (aluno.nome ? `-${limparNome(aluno.nome)}` : '') +
        (aluno.cpf ? `-CPF-${soNumeros(aluno.cpf)}` : '') + '.pdf';
}

// Gera o PDF de uma cópia do comprovante com largura fixa de A4 (igual no celular e no computador)
export async function gerarPdf(elemento, nomeArquivo) {
    const area = document.createElement('div');
    area.className = 'comp-pdf-area';
    area.setAttribute('aria-hidden', 'true');
    const copia = elemento.cloneNode(true);
    copia.removeAttribute('id');
    copia.classList.add('comp-a4');
    // o html2pdf copia o elemento para fora da página; embrulhado em .aluno, o CSS do comprovante continua valendo
    const embrulho = document.createElement('div');
    embrulho.className = 'aluno aluno-pdf';
    embrulho.appendChild(copia);
    area.appendChild(embrulho);
    (elemento.closest('.aluno') || document.body).appendChild(area);
    try {
        return await html2pdf().set({
            margin: [12, 12, 12, 12],
            filename: nomeArquivo,
            image: { type: 'jpeg', quality: 0.95 },
            // scrollX/scrollY: sem isso o PDF sai em branco quando a página está rolada
            html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff', scrollX: 0, scrollY: 0 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['css'], avoid: ['.comp-questao', '.comp-rodape', '.comp-bloco'] },
        }).from(embrulho).outputPdf('blob');
    } finally {
        area.remove();
    }
}

export function baixarArquivo(blob, nomeArquivo) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
}

export function podeCompartilhar(arquivo) {
    return Boolean(navigator.canShare && navigator.canShare({ files: [arquivo] }));
}
