import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Aprovado from "./aprovado";
import logo from '../img/logo.png';

const ProvaSimples = () => {
    const { nameUrl } = useParams();
    const [data, setData] = useState(null);
    const [respostas, setRespostas] = useState({});
    const [total, setTotal] = useState(0);
    const [componente, setComponente] = useState('');
    const [nomeCurso, setnomeCurso] = useState('')

    const fetchNameUrl = async () => {
        try {
            const response = await axios.get(`https://genilson-next.vercel.app/api/prova/${nameUrl}`);
            setData(response.data);
            setnomeCurso(response.data.nameProva)
        } catch (error) {
            console.error(error.response?.data?.message || 'Erro ao buscar dados');
        }
    };

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

    useEffect(() => {
        fetchNameUrl();
    }, [nameUrl]);

    return (
        <div id="questionario-father">
            <div id="questionario-img">
                <img id="img" src={logo} alt="Logo" />
            </div>

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

export default ProvaSimples;
