import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import logo from '../img/logo.png';
import { Helmet } from 'react-helmet';

const Curso = () => {
    const { nameUrl } = useParams();
    const [curso, setCurso] = useState(null);
    const [error, setError] = useState(null);

    // Estados do formulário
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [cpf, setCpf] = useState('');
    const [nome_empresa, setNomeEmpresa] = useState('');
    const [dataGenilson, setDataGenilson] = useState('');
    const [showPopup, setShowPopup] = useState(true);
    const [senha, setSenha] = useState('');

    // Função para buscar dados do curso
    const fetchCurso = async () => {
        try {
            const response = await axios.get(`https://api.comunhaorara.com/curso/${nameUrl}`);
            setCurso(response.data);
        } catch (error) {
            setError('Erro ao buscar os dados do curso');
            console.error('Erro ao buscar os dados do curso:', error);
        }
    };

    // Validação da senha
    function validarSenha() {
        if (senha.trim() !== '666') {
            alert("Senha incorreta! Tente novamente.");
            return false; // Impede o envio do formulário
        }
        return true; // Permite o envio se a senha estiver correta
    }

    // Funções para enviar dados e email
    const enviarDados = async () => {
        try {
            const response = await axios.post('https://api.comunhaorara.com/historicocurso/criar', {
                tituloCurso: curso.titulo,
                name: name,
                email: email,
                whatsapp: whatsapp,
                cpf: cpf,
            });
            console.log('Um aluno começou a estudar');
        } catch (error) {
            console.error('Erro ao acompanhar aluno em tempo real', error);
        }
    };

    const EnviarEmail = async () => {
        const ebody = `
        <div><img src="https://cestsegtrabalho.com.br/wp-content/uploads/2022/09/logo-e1663851774609.png" width="100%"></div>
        <br><br>
        <h3>O aluno ${name} concluiu a prova de ${curso.titulo} conforme treinamento com nota 10 </h3>
        <br><br>
        <h3 style="margin: 0%;">Nome do aluno:</h3>${name}
        <br><br>
        <h3>Nome do curso: BOBCAT</h3>
        <h3 style="margin: 0%;">Whatsapp do aluno:</h3>${whatsapp}
        <br><br>
        <h3 style="margin: 0%;">Email do aluno: </h3>${email}
        <br><br>
        <h3 style="margin: 0%;">CPF do aluno: </h3>${cpf}
        <br><br>
        <h3 style="margin: 0%;">Nome da Empresa (Opcional): </h3>${nome_empresa}
        <br><br>
        <h3 style="font-weight: bold;">Data: </h3>${dataGenilson};
        `;

        window.Email.send({
            SecureToken: "58bc9bda-20b7-472d-9522-6edc923b7f69",
            To: 'cestsegtrabalho@gmail.com',
            From: "cestsegtrabalho@gmail.com",
            Subject: "O aluno concluiu a prova",
            Body: ebody
        }).then(
            //message => alert("Email enviado com sucesso!")
        ).catch(
            error => alert("Erro ao enviar o email: " + error)
        );
    };

    const getYoutubeVideoId = (url) => {
        if (!url) return null;
    
        const regex =
            /(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([^\s&?]+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };
    

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validarSenha()) {
            return; // Interrompe o envio se a senha estiver errada
        }
        if (name && email && whatsapp && cpf && dataGenilson) {
            setShowPopup(false); // Fecha o popup
            EnviarEmail();
            enviarDados();
        } else {
            alert("Por favor, preencha todos os campos.");
        }
    };



    useEffect(() => {
        fetchCurso();
    }, [nameUrl]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!curso) {
        return <div>Carregando...</div>;
    }

    return (
        <div id='conteudo-cursoFather'>
            <Helmet>
            <title>{curso.title ? `CURSO - ${curso.title}` : 'CURSO'}</title>
            </Helmet>
            <div id="questionario-img">
                <div id='divDentroQuestionarioImg'>
                    <p id='conteudo-text'><b>CESTSEGTRABALHO</b></p>
                    <p id='conteudo-text'>TREINAMENTO E DOCUMENTAÇÃO SST</p>
                    <p id='conteudo-text'>CNPJ 35560646000108</p>
                </div>
                <img id="img" src={logo} alt="Logo" />
            </div>

            <h1 id='conteudoCurso-titulo'>{curso.titulo}</h1>
            {curso.urlvideo && getYoutubeVideoId(curso.urlvideo) && (
            <div style={{ margin: '20px 0', textAlign: 'center' }}>
                <iframe
                    width="100%"
                    height="315"
                    src={`https://www.youtube.com/embed/${getYoutubeVideoId(curso.urlvideo)}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
            )}

            <div dangerouslySetInnerHTML={{ __html: curso.conteudo }} />

            {showPopup && (
                <div id="popup">
                    <div id="popup-content">
                        <h2></h2>
                        <form 
                            action="https://api.staticforms.xyz/submit"
                            method="post"
                            onSubmit={(e) => {
                                if (!validarSenha()) {
                                    e.preventDefault(); // Impede o envio se a senha estiver incorreta
                                } else {
                                    setShowPopup(false); // Fecha o popup se senha for válida
                                    enviarDados();
                                }
                            }}
                        >
                            <input 
                                type="text" 
                                name="$Nome"
                                placeholder="Nome" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                            />
                            <input 
                                type="email" 
                                placeholder="Email" 
                                name="$Nome"
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                            <input 
                                type="text" 
                                placeholder="WHATSAPP" 
                                name="$Whatsapp"
                                value={whatsapp} 
                                onChange={(e) => setWhatsapp(e.target.value)} 
                                required 
                            />
                            <input 
                                type="text" 
                                placeholder="CPF" 
                                name="$CPF"
                                value={cpf} 
                                onChange={(e) => setCpf(e.target.value)} 
                                required 
                            />
                            <input 
                                type="text" 
                                placeholder="Nome da Empresa (Opcional)" 
                                name="$Empresa ou Particular"
                                value={nome_empresa} 
                                onChange={(e) => setNomeEmpresa(e.target.value)} 
                            />
                            <input 
                            type="text" 
                            placeholder="D a t a"
                            name="$Data"
                            value={dataGenilson} 
                            onChange={(e) => setDataGenilson(e.target.value)} 
                            required 
                            translate="no"
                            autoComplete="off"
                            className="notranslate"
                            />
                            <input 
                                type="text" 
                                placeholder="Digite a senha" 
                                value={senha} 
                                onChange={(e) => setSenha(e.target.value)} 
                                required 
                            /><br></br>
                            <input type="hidden" name="honeypot" style={{ display: 'none' }} />
                            <input 
                                type="hidden" 
                                name="accessKey" 
                                value="91842200-0b17-4fa6-a9fd-84098f62897b" 
                            />
                            <input 
                                type="hidden" 
                                name="subject" 
                                value={`Um aluno começou a estudar: ${curso?.titulo}`} 
                            />
                            <input 
                                type="hidden" 
                                name="replyTo" 
                                value="cestsegtrabalho@gmail.com" 
                            />
                            <input 
                                type="hidden" 
                                name="redirectTo" 
                                value="https://www.cestsegtrabalho.com.br/src/assets/page/modulos/brigada.html" 
                            />
                            <button type="submit" id="começar-btn">Enviar</button>
                        </form>
                        {/* <form onSubmit={handleSubmit}>
                            <input 
                                type="text" 
                                placeholder="Nome" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                            />
                            <input 
                                type="email" 
                                placeholder="Email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                            <input 
                                type="text" 
                                placeholder="WHATSAPP" 
                                value={whatsapp} 
                                onChange={(e) => setWhatsapp(e.target.value)} 
                                required 
                            />
                            <input 
                                type="text" 
                                placeholder="CPF" 
                                value={cpf} 
                                onChange={(e) => setCpf(e.target.value)} 
                                required 
                            />
                            <input 
                                type="text" 
                                placeholder="Nome da Empresa (Opcional)" 
                                value={nome_empresa} 
                                onChange={(e) => setNomeEmpresa(e.target.value)} 
                            />
                            <input 
                            type="text" 
                            placeholder="D a t a"
                            value={dataGenilson} 
                            onChange={(e) => setDataGenilson(e.target.value)} 
                            required 
                            translate="no"
                            autoComplete="off"
                            name="notranslate-dataGenilson"
                            className="notranslate"
                            />
                            <input 
                                type="text" 
                                placeholder="Digite a senha" 
                                value={senha} 
                                onChange={(e) => setSenha(e.target.value)} 
                                required 
                            /><br></br>
                            <button type="submit" id="começar-btn">Enviar</button>
                        </form> */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Curso;
