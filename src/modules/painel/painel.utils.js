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

// Filtro do gráfico do Início: cada período vira colunas (por hora, dia, mês ou ano)
export const PERIODOS_GRAFICO = [
    { id: 'hoje', rotulo: 'Hoje', resumo: 'hoje' },
    { id: 'semana', rotulo: '7 dias', resumo: 'nos últimos 7 dias' },
    { id: 'mes', rotulo: '30 dias', resumo: 'nos últimos 30 dias' },
    { id: 'ano', rotulo: '12 meses', resumo: 'nos últimos 12 meses' },
    { id: 'tudo', rotulo: 'Tudo', resumo: 'desde o início' },
];

const nomeDoMes = (d, formato) => d.toLocaleDateString('pt-BR', formato).replace('.', '');

// Colunas do período, da mais antiga para a atual: { inicio, fim, rotulo, rotuloLongo, total, atual, mostrarRotulo }
function colunasDoPeriodo(periodo, lista, agora) {
    const hoje = inicioDoDia(agora);
    if (periodo === 'hoje') {
        // de 3 em 3 horas: 0h, 3h, ... 21h
        return Array.from({ length: 8 }, (_, i) => {
            const inicio = new Date(hoje); inicio.setHours(i * 3);
            const fim = new Date(hoje); fim.setHours(i * 3 + 3);
            return { inicio, fim, rotulo: `${i * 3}h`, rotuloLongo: `Hoje, das ${i * 3}h às ${i * 3 + 3}h`, atual: agora >= inicio && agora < fim, mostrarRotulo: true };
        });
    }
    if (periodo === 'semana' || periodo === 'mes') {
        const dias = periodo === 'semana' ? 7 : 30;
        return Array.from({ length: dias }, (_, i) => {
            const inicio = new Date(hoje); inicio.setDate(inicio.getDate() - (dias - 1 - i));
            const fim = new Date(inicio); fim.setDate(fim.getDate() + 1);
            const atual = i === dias - 1;
            return {
                inicio, fim, atual,
                rotulo: periodo === 'semana' ? rotuloCurtoDoDia(inicio, agora) : (atual ? 'Hoje' : String(inicio.getDate())),
                rotuloLongo: formatarData(inicio),
                // em 30 dias, mostra o dia só de 5 em 5 (no celular não cabe tudo)
                mostrarRotulo: periodo === 'semana' || atual || (dias - 1 - i) % 5 === 0,
            };
        });
    }
    if (periodo === 'ano') {
        return Array.from({ length: 12 }, (_, i) => {
            const inicio = new Date(agora.getFullYear(), agora.getMonth() - (11 - i), 1);
            const fim = new Date(inicio.getFullYear(), inicio.getMonth() + 1, 1);
            return { inicio, fim, rotulo: nomeDoMes(inicio, { month: 'short' }), rotuloLongo: nomeDoMes(inicio, { month: 'long', year: 'numeric' }), atual: i === 11, mostrarRotulo: true };
        });
    }
    // tudo: um ano por coluna, do primeiro registro até agora
    const anos = lista.map((item) => new Date(item.createdAt).getFullYear()).filter((a) => !Number.isNaN(a));
    const primeiro = Math.min(agora.getFullYear(), ...anos);
    return Array.from({ length: agora.getFullYear() - primeiro + 1 }, (_, i) => {
        const ano = primeiro + i;
        return { inicio: new Date(ano, 0, 1), fim: new Date(ano + 1, 0, 1), rotulo: String(ano), rotuloLongo: `Ano de ${ano}`, atual: ano === agora.getFullYear(), mostrarRotulo: true };
    });
}

export function agruparPorPeriodo(lista = [], periodo = 'semana', agora = new Date()) {
    const colunas = colunasDoPeriodo(periodo, lista, agora).map((c) => ({ ...c, total: 0 }));
    for (const item of lista) {
        const d = new Date(item.createdAt);
        const coluna = colunas.find((c) => d >= c.inicio && d < c.fim);
        if (coluna) coluna.total += 1;
    }
    return colunas;
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

/* ---------- Gabarito automático de cada prova ---------- */

const escaparHtml = (texto = '') => String(texto)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const tituloDoGabarito = (prova) => `Gabarito ${String(prova.nameProva || '').trim()}`;

// Marca que liga o gabarito à prova (o link da prova é único e não muda quando o nome muda)
export const marcaDoGabarito = (prova) => `/prova/${prova.nameUrl}`;

// Conteúdo do gabarito no mesmo formato do editor (texto formatado).
// Na tela do aluno as opções são embaralhadas, por isso o gabarito mostra o texto da resposta certa, sem letra.
export function gabaritoDaProva(prova) {
    const perguntas = perguntasDaProva(prova).filter((p) => p.pergunta.trim());
    const minimo = Math.ceil(perguntas.length * 0.8);
    const itens = perguntas.map((p) => `<li><strong>${escaparHtml(p.pergunta.trim())}</strong><br>Resposta certa: <strong>${escaparHtml(p.certa.trim())}</strong></li>`).join('');
    return {
        titulo: tituloDoGabarito(prova),
        conteudogabarito:
            `<p><strong>Prova:</strong> ${escaparHtml(String(prova.nameProva || '').trim())}<br><strong>Questões:</strong> ${perguntas.length} · <strong>Nota mínima:</strong> 80% (${minimo} acertos)</p>` +
            `<ol>${itens}</ol>` +
            `<p><i>Gabarito atualizado sozinho quando a prova é salva no painel. Link da prova: ${LINK_APP}${marcaDoGabarito(prova)}</i></p>`,
    };
}

// Acha o gabarito de uma prova: pelo link da prova no texto ou, nos antigos, pelo título
export function acharGabarito(gabaritos = [], prova) {
    const marca = `${LINK_APP}${marcaDoGabarito(prova)}<`;
    return gabaritos.find((g) => String(g.conteudogabarito || '').includes(marca))
        || gabaritos.find((g) => g.titulo === tituloDoGabarito(prova));
}
