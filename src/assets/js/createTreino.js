import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const CreateTreino = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [treino1, setTreino1] = useState([{ grupoMuscular: "", exercicio: "", series: "", repeticoes: "" }]);
    const [treino2, setTreino2] = useState([{ grupoMuscular: "", exercicio: "", series: "", repeticoes: "" }]);
    const [treino3, setTreino3] = useState([{ grupoMuscular: "", exercicio: "", series: "", repeticoes: "" }]);
    const [treino4, setTreino4] = useState([{ grupoMuscular: "", exercicio: "", series: "", repeticoes: "" }]);
    const [treino5, setTreino5] = useState([{ grupoMuscular: "", exercicio: "", series: "", repeticoes: "" }]);
    const [treino6, setTreino6] = useState([{ grupoMuscular: "", exercicio: "", series: "", repeticoes: "" }]);
    const [treino7, setTreino7] = useState([{ grupoMuscular: "", exercicio: "", series: "", repeticoes: "" }]);
    const [nameUrl, setNameUrl] = useState(''); // Novo estado para nameUrl
    const [nameProva, setnameProva] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    const handleInputChange = (index, event, setTreino, treino) => {
        const values = [...treino];
        values[index] = {
            ...values[index],
            [event.target.name]: event.target.value
        };
        setTreino(values);
    };

    const fetchDataToken = async () => {
        try {
            // const responseUserToken = await axios.get(`https://genilson-next.vercel.app/api/protected/user/buscar`, {
            //     headers: { Authorization: `${localStorage.getItem("token")}` }
            // });
            setIsLoggedIn(true);
            console.log('Rota acessada com sucesso');
        } catch (error) {
            setIsLoggedIn(false);
            console.error('Erro ao acessar rota');
        }
    };

    useEffect(() => {
        fetchDataToken()
    }, []);

    // // criar url 
    // const createUrlProva = async () => {
    //     try {
    //         const token = localStorage.getItem('token'); // Obtém o token do localStorage
    //         if (!token) {
    //             console.error('Token não encontrado, faça login novamente.');
    //             return;
    //         }
    //         const config = {
    //             headers: { Authorization: token }
    //         };

    //         const metadeUrl = 'https://genilson-next.vercel.app/prova/'
    //         const urlprova = { urlprova: metadeUrl + nameUrl}
    //         const response = await axios.post('https://genilson-next.vercel.app/api/prova/criar', urlprova, config)
    //         console.log('Deu certo', urlprova)
    //         console.log('Deu certo 2', response)
    //     } catch (error) {
    //         console.error('deu erro', error)
    //     }
    // }

    const createTreino = async () => {
        try {
            const token = localStorage.getItem('token'); // Obtém o token do localStorage
            if (!token) {
                console.error('Token não encontrado, faça login novamente.');
                return;
            }
            const config = {
                headers: { Authorization: token }
            };

            const Userid = localStorage.getItem('AlunoUserid');
            const UserStoreid = localStorage.getItem('userStoreid');
            const username = localStorage.getItem('AlunoUsername');

            const metadeUrl = 'https://app.cestsegtrabalho.com.br/prova/'
            const linkUrl = metadeUrl + nameUrl
            const treinoData = { treino1, treino2, treino3, treino4, treino5, treino6, treino7, userid: Userid, nameUrl, nameProva, linkUrl }; // Inclui nameUrl
            //createUrlProva()
            try {
                await axios.post('https://genilson-next.vercel.app/api/treino/criar', treinoData, config);
                console.log('Treino cadastrado com sucesso');
                window.location.reload()
            } catch (error) {
                console.error('Erro ao criar Treino: ', error);
            }
        } catch (error) {
            console.error('Erro ao criar Treino: ', error);
        }
    };

    const addExerciseFields = (setTreino, treino) => {
        setTreino([...treino, { grupoMuscular: "", exercicio: "", series: "", repeticoes: "" }]);
    };

    const goToLoginUser = () => {
        navigate('/login')
    }

    return (
        <div className="div-inputTreino">
            <form>
                {/* Campo para nameUrl */}
                <div>
                    <label htmlFor="nameUrl" className="labelnome-createProduct">Titulo da Prova:</label>
                    <input
                    
                        type="text"
                        id="nameUrl"
                        value={nameProva}
                        onChange={(e) => setnameProva(e.target.value)}
                        placeholder=""
                        className='inputs'
                        required
                    />
                </div>
                <div>
                    <label htmlFor="nameUrl" className="labelnome-createProduct">url da prova:</label>
                    <p>Minúsculo, tudo junto, sem espaço, ponto e virgula</p>
                    <p>Ex.: www.cestsegtrabalho.com/prova/nomedaprova</p>
                    <input
                        type="text"
                        id="nameUrl"
                        value={nameUrl}
                        onChange={(e) => setNameUrl(e.target.value)}
                        placeholder=""
                        className='inputs'
                        required
                    />
                </div>
                <br />
                {[
                    { treino: treino1, setTreino: setTreino1, label: "Pergunta 1" },
                    { treino: treino2, setTreino: setTreino2, label: "Pergunta 2" },
                    { treino: treino3, setTreino: setTreino3, label: "Pergunta 3" },
                    { treino: treino4, setTreino: setTreino4, label: "Pergunta 4" },
                    { treino: treino5, setTreino: setTreino5, label: "Pergunta 5" },
                ].map(({ treino, setTreino, label }, treinoIndex) => (
                    <div key={treinoIndex}>
                        <label htmlFor={`treino${treinoIndex + 1}`} className="labelnome-createProduct">{label}</label>
                        <br />
                        {treino.map((field, index) => (
                            <div key={index} className="div-inputsTreino">
                                {index === 0 && (
                                    <input
                                        type="text"
                                        name="grupoMuscular"
                                        placeholder="Pergunta"
                                        className='inputs'
                                        value={field.grupoMuscular}
                                        onChange={(e) => handleInputChange(index, e, setTreino, treino)}
                                    />
                                )} <br />
                                <input
                                    type="text"
                                    name="exercicio"
                                    placeholder="Resposta Errada"
                                    className='inputs'
                                    value={field.exercicio}
                                    onChange={(e) => handleInputChange(index, e, setTreino, treino)}
                                />
                                <input
                                    type="text"
                                    name="series"
                                    placeholder="Resposta Errada"
                                    className='inputs'
                                    value={field.series}
                                    onChange={(e) => handleInputChange(index, e, setTreino, treino)}
                                />
                                <input
                                    type="text"
                                    name="repeticoes"
                                    placeholder="Resposta Certa"
                                    className='inputs'
                                    value={field.repeticoes}
                                    onChange={(e) => handleInputChange(index, e, setTreino, treino)}
                                />
                                <br />
                            </div>
                        ))}
                        <br />
                    </div>
                ))}
                {isLoggedIn ? (
                    <button type="button" onClick={createTreino} className="createButton-createProduct">Cadastrar treino</button>
                ) : (
                    <div>
                        <p>Você só pode criar treino se estiver logado</p>
                        <button type="button" onClick={goToLoginUser} className="createButton-createProduct">Fazer Login ou Criar Conta</button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default CreateTreino;
