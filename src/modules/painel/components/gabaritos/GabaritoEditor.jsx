import { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import TelaEditor from '../shared/TelaEditor';

const GabaritoEditor = ({ gabarito, aoVoltar, aoSalvar }) => {
    const [titulo, setTitulo] = useState(gabarito?.titulo || '');
    const [conteudo, setConteudo] = useState(gabarito?.conteudogabarito || '');

    const salvar = () => aoSalvar({ titulo: titulo.trim(), conteudogabarito: conteudo }, gabarito?._id);

    return (
        <TelaEditor
            titulo={gabarito ? 'Editar gabarito' : 'Novo gabarito'}
            subtitulo={gabarito ? gabarito.titulo : 'Escreva as respostas certas da prova.'}
            aoVoltar={aoVoltar}
            aoSalvar={salvar}
            podeSalvar={Boolean(titulo.trim() && conteudo.trim())}
            rotuloSalvar={gabarito ? 'Salvar alterações' : 'Cadastrar gabarito'}
        >
            <div className="field">
                <label className="field__label" htmlFor="gabarito-titulo">Nome do gabarito *</label>
                <input id="gabarito-titulo" className="input" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex.: Gabarito NR 35" required />
            </div>
            <div className="field">
                <span className="field__label">Respostas *</span>
                <CKEditor editor={ClassicEditor} data={conteudo} onChange={(event, editor) => setConteudo(editor.getData())} />
            </div>
        </TelaEditor>
    );
};

export default GabaritoEditor;
