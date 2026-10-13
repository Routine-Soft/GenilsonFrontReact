import { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { LINK_APP, paraSlug } from '../../painel.utils';
import TelaEditor from '../shared/TelaEditor';
import CampoLink from '../shared/CampoLink';

const CursoEditor = ({ curso, outros, aoVoltar, aoSalvar }) => {
    const [titulo, setTitulo] = useState(curso?.titulo || '');
    const [urlvideo, setUrlvideo] = useState(curso?.urlvideo || '');
    const [conteudo, setConteudo] = useState(curso?.conteudo || '');
    const [nameUrl, setNameUrl] = useState(curso?.nameUrl || '');
    const [linkMexido, setLinkMexido] = useState(Boolean(curso));

    const emUso = nameUrl !== '' && outros.some((c) => c.nameUrl === nameUrl);

    // No curso novo, o link acompanha o título até a pessoa mexer nele
    const mudarTitulo = (valor) => {
        setTitulo(valor);
        if (!linkMexido) setNameUrl(paraSlug(valor));
    };

    const salvar = () => aoSalvar({
        titulo: titulo.trim(),
        conteudo,
        urlvideo: urlvideo.trim(),
        nameUrl,
        linkUrl: `${LINK_APP}/curso/${nameUrl}`,
    }, curso?._id);

    return (
        <TelaEditor
            titulo={curso ? 'Editar curso' : 'Novo curso'}
            subtitulo={curso ? curso.titulo : 'Preencha os dados. Depois é só mandar o link para os alunos.'}
            aoVoltar={aoVoltar}
            aoSalvar={salvar}
            podeSalvar={Boolean(titulo.trim() && nameUrl) && !emUso}
            rotuloSalvar={curso ? 'Salvar alterações' : 'Cadastrar curso'}
        >
            <div className="field">
                <label className="field__label" htmlFor="curso-titulo">Nome do curso *</label>
                <input id="curso-titulo" className="input" value={titulo} onChange={(e) => mudarTitulo(e.target.value)} placeholder="Ex.: NR 35 - Trabalho em altura" required />
            </div>

            <CampoLink
                id="curso-link"
                pasta="curso"
                valor={nameUrl}
                aoMudar={(valor) => { setNameUrl(valor); setLinkMexido(true); }}
                emUso={emUso}
            />

            <div className="field">
                <label className="field__label" htmlFor="curso-video">Vídeo (opcional)</label>
                <input id="curso-video" className="input" value={urlvideo} onChange={(e) => setUrlvideo(e.target.value)} placeholder="Cole o link do YouTube ou do Google Drive" inputMode="url" />
                <span className="field__hint">O vídeo aparece no topo do curso.</span>
            </div>

            <div className="field">
                <span className="field__label">Conteúdo do curso</span>
                <CKEditor editor={ClassicEditor} data={conteudo} onChange={(event, editor) => setConteudo(editor.getData())} />
            </div>
        </TelaEditor>
    );
};

export default CursoEditor;
