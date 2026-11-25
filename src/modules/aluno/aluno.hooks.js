import { useCallback, useEffect, useState } from 'react';
import { baixarArquivo, gerarPdf, podeCompartilhar } from './aluno.utils';

// Carrega o curso ou a prova pelo endereço. "carregando" é calculado: vale até chegar a resposta deste endereço.
export function useCarregar(buscar, nameUrl) {
    const [estado, setEstado] = useState({ chave: null, dados: null, erro: null });

    useEffect(() => {
        let ativo = true;
        buscar(nameUrl)
            .then((dados) => { if (ativo) setEstado({ chave: nameUrl, dados, erro: null }); })
            .catch((erro) => { if (ativo) setEstado({ chave: nameUrl, dados: null, erro }); });
        return () => { ativo = false; };
    }, [buscar, nameUrl]);

    const atual = estado.chave === nameUrl;
    return {
        carregando: !atual,
        dados: atual ? estado.dados : null,
        erro: atual ? estado.erro : null,
    };
}

// PDF do comprovante: começa a gerar assim que o comprovante aparece, para o clique ser na hora.
export function useComprovantePdf(referencia, nomeArquivo, ativo) {
    const [pdf, setPdf] = useState({ nome: null, arquivo: null, erro: false });
    const [mensagem, setMensagem] = useState('');

    useEffect(() => {
        if (!ativo || !referencia.current) return undefined;
        let vivo = true;
        gerarPdf(referencia.current, nomeArquivo)
            .then((blob) => {
                if (vivo) setPdf({ nome: nomeArquivo, arquivo: new File([blob], nomeArquivo, { type: 'application/pdf' }), erro: false });
            })
            .catch(() => { if (vivo) setPdf({ nome: nomeArquivo, arquivo: null, erro: true }); });
        return () => { vivo = false; };
    }, [referencia, nomeArquivo, ativo]);

    const pronto = pdf.nome === nomeArquivo && Boolean(pdf.arquivo);
    const falhou = pdf.nome === nomeArquivo && pdf.erro;

    const baixar = useCallback(async () => {
        try {
            const arquivo = pronto ? pdf.arquivo : await gerarPdf(referencia.current, nomeArquivo);
            baixarArquivo(arquivo, nomeArquivo);
            setMensagem('Comprovante baixado. Ele está na pasta Downloads do aparelho.');
        } catch {
            setMensagem('Não foi possível gerar o PDF. Tente de novo em instantes.');
        }
    }, [pronto, pdf.arquivo, referencia, nomeArquivo]);

    const enviar = useCallback(async (texto) => {
        try {
            await navigator.share({ files: [pdf.arquivo], title: 'Comprovante', text: texto });
        } catch (e) {
            if (e?.name !== 'AbortError') setMensagem('Não foi possível abrir o compartilhar. Use o botão “Baixar comprovante”.');
        }
    }, [pdf.arquivo]);

    return {
        gerando: ativo && !pronto && !falhou,
        podeEnviar: pronto && podeCompartilhar(pdf.arquivo),
        baixar,
        enviar,
        mensagem,
    };
}
