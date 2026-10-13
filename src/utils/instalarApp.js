// Instalação do painel como aplicativo (ícone na área de trabalho / tela inicial).
// O Chrome e o Edge avisam pelo evento "beforeinstallprompt" que dá para instalar; ele pode chegar antes do
// React montar, por isso é guardado aqui e lido pelos componentes com useSyncExternalStore.
let pedidoDeInstalacao = null;
const ouvintes = new Set();

function avisar() {
    ouvintes.forEach((ouvinte) => ouvinte());
}

export function registrarApp() {
    if (typeof window === 'undefined') return;
    window.addEventListener('beforeinstallprompt', (evento) => {
        evento.preventDefault();
        pedidoDeInstalacao = evento;
        avisar();
    });
    window.addEventListener('appinstalled', () => {
        pedidoDeInstalacao = null;
        avisar();
    });
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').catch(() => {});
        });
    }
}

export function assinarInstalacao(ouvinte) {
    ouvintes.add(ouvinte);
    return () => ouvintes.delete(ouvinte);
}

export function podeInstalar() {
    return !!pedidoDeInstalacao;
}

// Abre a janela do navegador "Instalar CestSeg?". O pedido só pode ser usado uma vez.
export async function instalarApp() {
    if (!pedidoDeInstalacao) return false;
    const pedido = pedidoDeInstalacao;
    pedidoDeInstalacao = null;
    avisar();
    await pedido.prompt();
    const { outcome } = await pedido.userChoice;
    return outcome === 'accepted';
}
