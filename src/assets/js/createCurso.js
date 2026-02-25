import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const CreateCurso = () => {
    const navigate = useNavigate();
    const [titulo, setTitulo] = useState('');
    const [conteudo, setConteudo] = useState('');
    const [urlvideo, setUrlvideo] = useState('')
    const [nameUrl, setNameUrl] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [token, setToken] = useState(null); // Adiciona o estado para armazenar o token

    const fetchDataToken = async () => {
        try {
            const savedToken = localStorage.getItem("token");
            if (savedToken) {
                setToken(savedToken); // Salva o token no estado
                // const responseUserToken = await axios.get(`https://genilson-next.vercel.app/api/protected/user/buscar`, {
                //     headers: { Authorization: `${savedToken}` }
                // });
                setIsLoggedIn(true);
                console.log('Rota acessada com sucesso');
            } else {
                console.error('Token não encontrado');
                setIsLoggedIn(false);
            }
        } catch (error) {
            setIsLoggedIn(false);
            console.error('Erro ao acessar rota', error);
        }
    };

    useEffect(() => {
        fetchDataToken();
    }, []);

    const createCurso = async () => {
        if (!token) {
            console.error('Token não encontrado, faça login novamente.');
            return;
        }
        const config = {
            headers: { Authorization: `${token}` }
        };

        const metadeUrl = 'https://app.cestsegtrabalho.com.br/curso/';
        const linkUrl = metadeUrl + nameUrl;
        const cursoData = { titulo, conteudo, nameUrl, linkUrl, urlvideo };

        try {
            await axios.post('https://genilson-next.vercel.app/api/curso/criar', cursoData, config);
            console.log('Curso cadastrado com sucesso');
            window.location.reload();
        } catch (error) {
            console.error('Erro ao criar curso: ', error);
        }
    };

    const goToLoginUser = () => {
        navigate('/login');
    };

    return (
        <div className="div-inputCurso">
            <form>
                <div>
                    <label htmlFor="titulo" className="labelnome-createCurso">Título do Curso:</label>
                    <input
                        type="text"
                        id="titulo"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        placeholder="Digite o título do curso"
                        className='inputs'
                        required
                    />
                </div>
                <div>
                    <label htmlFor="urlvideo" className="labelnome-createCurso">URL do video do Youtube (opcional):</label>
                    <input
                        type="text"
                        id="titulo"
                        value={urlvideo}
                        onChange={(e) => setUrlvideo(e.target.value)}
                        placeholder="Digite o link do youtube"
                        className='inputs'
                        required
                    />
                </div>
                <div>
                    <label htmlFor="conteudo" className="labelnome-createCurso">Conteúdo do Curso:</label>
                    <CKEditor
                        editor={ClassicEditor}
                        data={conteudo}
                        onChange={(event, editor) => setConteudo(editor.getData())}
                        placeholder="Digite o conteúdo do curso"
                        className="textarea-createCurso"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="nameUrl" className="labelnome-createCurso">URL do Curso:</label>
                    <p>Minúsculo, tudo junto, sem espaço, ponto e vírgula</p>
                    <p>Ex.: www.cestsegtrabalho.com/curso/nomedocurso</p>
                    <input
                        type="text"
                        id="nameUrl"
                        value={nameUrl}
                        onChange={(e) => setNameUrl(e.target.value)}
                        placeholder="Digite a URL do curso"
                        className='inputs'
                        required
                    />
                </div>
                <br />
                {isLoggedIn ? (
                    <button type="button" onClick={createCurso} className="createButton-createCurso">Cadastrar Curso</button>
                ) : (
                    <div>
                        <p>Você só pode criar curso se estiver logado</p>
                        <button type="button" onClick={goToLoginUser} className="createButton-createCurso">Fazer Login ou Criar Conta</button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default CreateCurso;
