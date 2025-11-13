import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Aprovado from "./aprovado";
import logo from '../img/logo.png';
import { Helmet } from "react-helmet";


const Prova = () => {
    const { nameUrl } = useParams();
    const [data, setData] = useState(null);
    const [respostas, setRespostas] = useState({});
    const [total, setTotal] = useState(0);
    const [componente, setComponente] = useState('');
    const [showPopup, setShowPopup] = useState(true);
    const [senha, setSenha] = useState('');

    // Estado para dados do formulário
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [cpf, setCpf] = useState('');
    const [curso, setCurso] = useState('');
    const [nome_empresa, setNomeEmpresa] = useState('');
    const [dataGenilson, setDataGenilson] = useState('');
    const [nomeCurso, setnomeCurso] = useState('')

    const fetchNameUrl = async () => {
        try {
            const response = await axios.get(`https://api.comunhaorara.com/prova/${nameUrl}`);
            setData(response.data);
            setnomeCurso(response.data.nameProva)
        } catch (error) {
            console.error(error.response?.data?.message || 'Erro ao buscar dados');
        }
    };
    
    // Validação da senha
    function validarSenha() {
        if (senha.trim() !== '333') {
            alert("Senha incorreta! Tente novamente.");
            return false; // Impede o envio do formulário
        }
        return true; // Permite o envio se a senha estiver correta
    }

    const handleOptionChange = (event) => {
        const { name, id, value } = event.target;
        setRespostas(prevState => ({
            ...prevState,
            [name]: { id, value: parseInt(value) }
        }));
    };

    const TrocarComponente = () => {
        setComponente(<Aprovado />);
    };

    const enviarDados = async () => {
        localStorage.setItem('nomeAluno', name);
        localStorage.setItem('emailAluno', email);
        localStorage.setItem('whatsappAluno', whatsapp);
        localStorage.setItem('cpfAluno', cpf);
        try {
            const response = await axios.post('https://api.comunhaorara.com/historicoprova/criar', {
                tituloProva: nomeCurso,
                name: name,
                email: email,
                whatsapp: whatsapp,
                cpf: cpf
            });
            console.log('Prova Concluída', name);
            console.log('Nome do Aluno:', name);
        } catch (error) {
            console.error('Erro ao acompanhar prova concluída: ', error);
        }
    };
    console.log('Nome do Aluno fora:', name);

    // const EnviarEmail = async () => {
    //     const ebody = `
    //     <div><img src="https://cestsegtrabalho.com.br/wp-content/uploads/2022/09/logo-e1663851774609.png" width="100%"></div>
    //     <br><br>
    //     <h3>O aluno ${name} concluiu a prova de ${nomeCurso} conforme treinamento com nota 10</h3>
    //     <br><br>
    //     <h3 style="margin: 0%;">Nome do aluno:</h3>${name}
    //     <br><br>
    //     <h3>Nome do curso: BOBCAT</h3>
    //     <h3 style="margin: 0%;">Whatsapp do aluno:</h3>${whatsapp}
    //     <br><br>
    //     <h3 style="margin: 0%;">Email do aluno: </h3>${email}
    //     <br><br>
    //     <h3 style="margin: 0%;">CPF do aluno: </h3>${cpf}
    //     <br><br>
    //     <h3 style="margin: 0%;">Nome da Empresa (Opcional): </h3>${nome_empresa}
    //     <br><br>
    //     <h3 style="font-weight: bold;">Data: </h3>${dataGenilson};
    //     `;

    //     window.Email.send({
    //         SecureToken: "58bc9bda-20b7-472d-9522-6edc923b7f69",
    //         To: 'cestsegtrabalho@gmail.com',
    //         From: "cestsegtrabalho@gmail.com",
    //         Subject: "O aluno concluiu a prova",
    //         Body: ebody
    //     }).then(
    //         //message => alert("Email enviado com sucesso!")
    //     ).catch(
    //         error => alert("Erro ao enviar o email: " + error)
    //     );
    // };

    const corrigir = () => {
        let score = 0;
        const newRespostas = { ...respostas };

        Object.keys(respostas).forEach(key => {
            const { id, value } = respostas[key];
            const label = document.getElementById(`label${id}`);
            if (value === 2) {
                score += 2;
                label.style.backgroundColor = 'green';
                label.style.color = 'white';
            } else {
                label.style.backgroundColor = 'red';
                label.style.color = 'white';
            }
        });

        setTotal(score);

        if (score >= 8) {
            setComponente(<Aprovado />);
        } else {
            // Ação adicional se necessário
        }

        const resultado = score >= 8 ? 'Aprovado' : 'Reprovado';
        alert(`Você foi ${resultado}.`);
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validarSenha()) {
            return; // Interrompe o envio se a senha estiver errada
        }
        // Verifica se todos os campos estão preenchidos
        if (name && email && whatsapp && cpf && dataGenilson) {
            setShowPopup(false); // Fecha o popup
            // EnviarEmail();
            enviarDados();
        } else {
            alert("Por favor, preencha todos os campos.");
        }
    };

    useEffect(() => {
        fetchNameUrl();
    }, [nameUrl]);

    return (
        <div id="questionario-father">
            <Helmet>
            <title>{nomeCurso ? `PROVA - ${nomeCurso}` : 'PROVA'}</title>
            </Helmet>
            <div id="questionario-img">
                <img id="img" src={logo} alt="Logo" />
            </div>

            {showPopup && (
                <div id="popup">
                    <div id="popup-content">
                        <h2></h2>
                        <form onSubmit={handleSubmit}>
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
                                placeholder="WhatsApp" 
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
                                translate="no"
                                autoComplete="off"
                                name="notranslate-dataGenilson"
                                className="notranslate"
                                value={dataGenilson} 
                                onChange={(e) => setDataGenilson(e.target.value)} 
                                required 
                            />
                            <input 
                                type="text" 
                                placeholder="Digite a senha" 
                                value={senha} 
                                onChange={(e) => setSenha(e.target.value)} 
                                required 
                            /><br></br>
                            <button type="submit" id="começar-btn">COMEÇAR PROVA</button>
                        </form>
                    </div>
                </div>
            )}

            {componente}
            {data && (
                <div id="child">
                    <h1 id="nameProva">{data.nameProva}</h1>
                    <form name="Questao" id="Questao" method="post">
                        {data.treino1 && data.treino1.map((treino, index) => (
                            <div key={index}>
                                <p><b>1) {treino.grupoMuscular}</b></p>
                                <input type="radio" name="a" id={`errado1_${index}`} value="0" onChange={handleOptionChange} />
                                <label id={`labelerrado1_${index}`} htmlFor={`errado1_${index}`}>
                                    a) {treino.exercicio}
                                </label><br />

                                <input type="radio" name="a" id={`errado2_${index}`} value="0" onChange={handleOptionChange} />
                                <label id={`labelerrado2_${index}`} htmlFor={`errado2_${index}`}>
                                    b) {treino.series}
                                </label><br />

                                <input type="radio" name="a" id={`certo1_${index}`} value="2" onChange={handleOptionChange} />
                                <label id={`labelcerto1_${index}`} htmlFor={`certo1_${index}`}>
                                    c) {treino.repeticoes}
                                </label><br />
                            </div>
                        ))}
                        {data.treino2 && data.treino2.map((treino, index) => (
                            <div key={index}>
                                <p><b>2) {treino.grupoMuscular}</b></p>
                                <input type="radio" name="b" id={`errado3_${index}`} value="0" onChange={handleOptionChange} />
                                <label id={`labelerrado3_${index}`} htmlFor={`errado3_${index}`}>
                                    a) {treino.exercicio}
                                </label><br />

                                <input type="radio" name="b" id={`errado4_${index}`} value="0" onChange={handleOptionChange} />
                                <label id={`labelerrado4_${index}`} htmlFor={`errado4_${index}`}>
                                    b) {treino.series}
                                </label><br />

                                <input type="radio" name="b" id={`certo2_${index}`} value="2" onChange={handleOptionChange} />
                                <label id={`labelcerto2_${index}`} htmlFor={`certo2_${index}`}>
                                    c) {treino.repeticoes}
                                </label><br />
                            </div>
                        ))}
                        {data.treino3 && data.treino3.map((treino, index) => (
                            <div key={index}>
                                <p><b>3) {treino.grupoMuscular}</b></p>
                                <input type="radio" name="c" id={`errado5_${index}`} value="0" onChange={handleOptionChange} />
                                <label id={`labelerrado5_${index}`} htmlFor={`errado5_${index}`}>
                                    a) {treino.exercicio}
                                </label><br />

                                <input type="radio" name="c" id={`errado6_${index}`} value="0" onChange={handleOptionChange} />
                                <label id={`labelerrado6_${index}`} htmlFor={`errado6_${index}`}>
                                    b) {treino.series}
                                </label><br />

                                <input type="radio" name="c" id={`certo3_${index}`} value="2" onChange={handleOptionChange} />
                                <label id={`labelcerto3_${index}`} htmlFor={`certo3_${index}`}>
                                    c) {treino.repeticoes}
                                </label><br />
                            </div>
                        ))}
                        {data.treino4 && data.treino4.map((treino, index) => (
                            <div key={index}>
                                <p><b>4) {treino.grupoMuscular}</b></p>
                                <input type="radio" name="d" id={`errado7_${index}`} value="0" onChange={handleOptionChange} />
                                <label id={`labelerrado7_${index}`} htmlFor={`errado7_${index}`}>
                                    a) {treino.exercicio}
                                </label><br />

                                <input type="radio" name="d" id={`errado8_${index}`} value="0" onChange={handleOptionChange} />
                                <label id={`labelerrado8_${index}`} htmlFor={`errado8_${index}`}>
                                    b) {treino.series}
                                </label><br />

                                <input type="radio" name="d" id={`certo4_${index}`} value="2" onChange={handleOptionChange} />
                                <label id={`labelcerto4_${index}`} htmlFor={`certo4_${index}`}>
                                    c) {treino.repeticoes}
                                </label><br />
                            </div>
                        ))}
                        {data.treino5 && data.treino5.map((treino, index) => (
                            <div key={index}>
                                <p><b>5) {treino.grupoMuscular}</b></p>
                                <input type="radio" name="e" id={`errado9_${index}`} value="0" onChange={handleOptionChange} />
                                <label id={`labelerrado9_${index}`} htmlFor={`errado9_${index}`}>
                                    a) {treino.exercicio}
                                </label><br />

                                <input type="radio" name="e" id={`errado10_${index}`} value="0" onChange={handleOptionChange} />
                                <label id={`labelerrado10_${index}`} htmlFor={`errado10_${index}`}>
                                    b) {treino.series}
                                </label><br />

                                <input type="radio" name="e" id={`certo5_${index}`} value="2" onChange={handleOptionChange} />
                                <label id={`labelcerto5_${index}`} htmlFor={`certo5_${index}`}>
                                    c) {treino.repeticoes}
                                </label><br />
                            </div>
                        ))}
                        <button type="button" id="corrigir" onClick={corrigir}>Corrigir</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Prova;
