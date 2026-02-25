import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // apagar
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const Gabaritos = () => {
    const [cursos, setCursos] = useState([]);
    const [editCursoId, setEditCursoId] = useState(null);
    const [editTitulo, setEditTitulo] = useState('');
    const [editConteudo, setEditConteudo] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCursos();
    }, []);

    const fetchCursos = async () => {
        try {
            const response = await axios.get('https://genilson-next.vercel.app/api/gabarito/buscar');
            setCursos(response.data);
        } catch (error) {
            console.error('Erro ao buscar cursos:', error);
        }
    };

    const handleEdit = (curso) => {
        setEditCursoId(curso._id);
        setEditTitulo(curso.titulo);
        setEditConteudo(curso.conteudogabarito);
    };

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `${token}` } };
            const metadeUrl = 'https://genilson-next.vercel.app/api/curso/';
            // const novolinkUrl = metadeUrl + editNameUrl;
            const response = await axios.patch(`https://genilson-next.vercel.app/api/gabarito/${editCursoId}`, { titulo: editTitulo, conteudogabarito: editConteudo, }, config);
            setCursos(cursos.map(curso => curso._id === editCursoId ? response.data : curso));
            setEditCursoId(null);
            setEditTitulo('');
            setEditConteudo('');
        } catch (error) {
            console.error('Erro ao atualizar curso:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `${token}` } };
            await axios.delete(`https://genilson-next.vercel.app/api/gabarito/${id}`, config);
            setCursos(cursos.filter(curso => curso._id !== id));
        } catch (error) {
            console.error('Erro ao deletar curso:', error);
        }
    };

    const handleShare = (url, nomecurso) => {
        const mensagem = `*CURSO ${nomecurso}* \n\n${url}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
        window.open(whatsappUrl, '_blank');
    };

    // const handleShare = (url) => {
    //     const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(url)}`;
    //     window.open(whatsappUrl, '_blank');
    // };

    return (
        <div id='cursos-father'>
            <h1>GABARITOS</h1>
            <div style={{ marginBottom: '20px' }}>
            <input
                type="text"
                placeholder="🔍 Buscar gabaritos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                    padding: '10px',
                    width: '100%',
                    maxWidth: '400px',
                    fontSize: '16px',
                    borderRadius: '8px',
                    border: '1px solid #ccc'
                }}
            />
        </div>

            <ul>
                {cursos
                    .filter(curso => 
                        curso.titulo.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map(curso => (
                        <li key={curso._id}>
                        {editCursoId === curso._id ? (
                            <div>
                                <input
                                    className='inputs'
                                    type="text"
                                    value={editTitulo}
                                    onChange={(e) => setEditTitulo(e.target.value)}
                                    placeholder="Título do Curso"
                                />
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={editConteudo}
                                    onChange={(event, editor) => setEditConteudo(editor.getData())}
                                    placeholder="Conteúdo do Curso"
                                /><br />
                                <button onClick={handleUpdate}>Salvar</button>
                                <button onClick={() => setEditCursoId(null)}>Cancelar</button>
                            </div>
                        ) : (
                            <div>
                                <span>Título do Gabarito: {curso.titulo}</span><br />
                                <div dangerouslySetInnerHTML={{ __html: curso.conteudogabarito }} />
                                <button onClick={() => handleEdit(curso)}>Editar</button>
                                <button onClick={() => handleDelete(curso._id)}>Deletar</button>
                                {/* <button onClick={() => handleShare(curso.linkUrl, curso.titulo)}>Compartilhar no WhatsApp</button> */}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Gabaritos;
