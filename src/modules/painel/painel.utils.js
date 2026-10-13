// Funções puras do painel (datas, textos, links)

export const LINK_APP = 'https://app.cestsegtrabalho.com.br';

export function iniciais(nome = '') {
    const partes = nome.trim().split(/\s+/).filter(Boolean);
    if (partes.length === 0) return '?';
    const primeira = partes[0][0];
    const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
    return (primeira + ultima).toUpperCase();
}

export function primeiroNome(nome = '') {
    return nome.trim().split(/\s+/)[0] || '';
}

// Compara textos sem ligar para maiúsculas e acentos
export function normalizar(texto = '') {
    return String(texto).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

// Parte final do link: minúsculo, sem acento, sem espaço e sem símbolo
export function paraSlug(texto = '') {
    return normalizar(texto).replace(/[^a-z0-9]/g, '');
}

export function plural(qtd, singular, pluralTexto) {
    return `${qtd.toLocaleString('pt-BR')} ${qtd === 1 ? singular : pluralTexto}`;
}

export function saudacao(agora = new Date()) {
    const hora = agora.getHours();
    if (hora < 12) return 'Bom dia';
    if (hora < 18) return 'Boa tarde';
    return 'Boa noite';
}

export function dataPorExtenso(data = new Date()) {
    const texto = data.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

const dois = (n) => String(n).padStart(2, '0');

export function formatarData(data) {
    const d = new Date(data);
    return `${dois(d.getDate())}/${dois(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export function formatarHora(data) {
    const d = new Date(data);
    return `${dois(d.getHours())}:${dois(d.getMinutes())}`;
}

function inicioDoDia(data) {
    const d = new Date(data);
    d.setHours(0, 0, 0, 0);
    return d;
}

function diasAtras(data, agora) {
    return Math.round((inicioDoDia(agora) - inicioDoDia(data)) / 86400000);
}

// "agora mesmo", "há 5 min", "há 2 h", "ontem às 14:30", "12/10/2026 às 09:15"
export function tempoRelativo(data, agora = new Date()) {
    const minutos = Math.floor((agora - new Date(data)) / 60000);
    if (minutos < 1) return 'agora mesmo';
    if (minutos < 60) return `há ${minutos} min`;
    const dias = diasAtras(data, agora);
    if (dias === 0) return `há ${Math.floor(minutos / 60)} h`;
    if (dias === 1) return `ontem às ${formatarHora(data)}`;
    return `${formatarData(data)} às ${formatarHora(data)}`;
}

export function rotuloDoDia(data, agora = new Date()) {
    const dias = diasAtras(data, agora);
    if (dias === 0) return 'Hoje';
    if (dias === 1) return 'Ontem';
    const texto = new Date(data).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// Mais recentes primeiro
export function ordenarRecentes(lista = []) {
    return [...lista].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// Agrupa uma lista (já ordenada) por dia: [{ rotulo, itens }]
export function agruparPorDia(lista, agora = new Date()) {
    const grupos = [];
    for (const item of lista) {
        const rotulo = rotuloDoDia(item.createdAt, agora);
        const ultimo = grupos[grupos.length - 1];
        if (ultimo && ultimo.rotulo === rotulo) ultimo.itens.push(item);
        else grupos.push({ rotulo, itens: [item] });
    }
    return grupos;
}

export function contarHoje(lista = [], agora = new Date()) {
    return lista.filter((item) => diasAtras(item.createdAt, agora) === 0).length;
}

export function contarNoMes(lista = [], agora = new Date()) {
    return lista.filter((item) => {
        const d = new Date(item.createdAt);
        return d.getMonth() === agora.getMonth() && d.getFullYear() === agora.getFullYear();
    }).length;
}

// Quantos registros por dia nos últimos N dias (do mais antigo para hoje)
export function porDia(lista = [], dias = 7, agora = new Date()) {
    const contagem = Array.from({ length: dias }, (_, i) => {
        const dia = inicioDoDia(agora);
        dia.setDate(dia.getDate() - (dias - 1 - i));
        return { dia, total: 0 };
    });
    for (const item of lista) {
        const atras = diasAtras(item.createdAt, agora);
        if (atras >= 0 && atras < dias) contagem[dias - 1 - atras].total += 1;
    }
    return contagem;
}

export function rotuloCurtoDoDia(data, agora = new Date()) {
    if (diasAtras(data, agora) === 0) return 'Hoje';
    return new Date(data).toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
}

/* ---------- Links e WhatsApp ---------- */

export function linkDoCurso(curso, semFormulario = false) {
    // Monta pelo nome do link: alguns cadastros antigos têm o link completo salvo errado
    const base = curso.nameUrl ? `${LINK_APP}/curso/${curso.nameUrl}` : curso.linkUrl || '';
    return semFormulario ? base.replace('/curso/', '/cursosimples/') : base;
}

export function linkDaProva(prova, semFormulario = false) {
    const base = prova.nameUrl ? `${LINK_APP}/prova/${prova.nameUrl}` : prova.linkUrl || '';
    return semFormulario ? base.replace('/prova/', '/provasimples/') : base;
}

export function compartilharNoWhatsApp(mensagem) {
    window.open(`https://wa.me/?text=${encodeURIComponent(mensagem)}`, '_blank', 'noopener');
}

// Link para conversar com o aluno (número só com dígitos, com 55 do Brasil)
export function linkConversaWhatsApp(telefone = '') {
    let numero = String(telefone).replace(/\D/g, '');
    if (!numero) return null;
    if (numero.length <= 11) numero = `55${numero}`;
    return `https://wa.me/${numero}`;
}

// Tira as marcas de HTML para mostrar um resumo do conteúdo
export function resumoDoHtml(html = '', tamanho = 160) {
    const texto = String(html).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
    return texto.length > tamanho ? `${texto.slice(0, tamanho).trim()}…` : texto;
}

/* ---------- Provas: as 5 perguntas ficam em treino1..treino5 ---------- */

export const QTD_PERGUNTAS = 5;

// No banco: grupoMuscular = pergunta, exercicio e series = respostas erradas, repeticoes = resposta certa
export function perguntasDaProva(prova) {
    return Array.from({ length: QTD_PERGUNTAS }, (_, i) => {
        const q = prova?.[`treino${i + 1}`]?.[0] || {};
        return {
            pergunta: q.grupoMuscular || '',
            errada1: q.exercicio || '',
            errada2: q.series || '',
            certa: q.repeticoes || '',
        };
    });
}

// Monta treino1..treino5 de volta, mantendo o resto do que já existia em cada um
export function treinosDasPerguntas(perguntas, prova) {
    const treinos = {};
    perguntas.forEach((p, i) => {
        const chave = `treino${i + 1}`;
        const original = prova?.[chave] || [];
        treinos[chave] = [
            {
                ...(original[0] || {}),
                grupoMuscular: p.pergunta.trim(),
                exercicio: p.errada1.trim(),
                series: p.errada2.trim(),
                repeticoes: p.certa.trim(),
            },
            ...original.slice(1),
        ];
    });
    return treinos;
}

export function perguntaCompleta(p) {
    return Boolean(p.pergunta.trim() && p.errada1.trim() && p.errada2.trim() && p.certa.trim());
}
