import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import moment from 'moment';

const TreinoGym = () => {
    const [treinos, setTreinos] = useState([]);
    const { username } = useParams();
    const [userData, setUserData] = useState(null);
    
    const fetchUserData = async () => {
        try {
            const responseUser = await axios.get(`https://genilson-next.vercel.app/api/user/${username}`);
            setUserData(responseUser.data);
        } catch (error) {
            console.error("Erro ao buscar os dados da loja: ", error);
        }
    };

    const fetchTreinos = async () => {
        try {
            const response = await axios.get(`https://genilson-next.vercel.app/api/treinogym/buscar`)
            setTreinos(response.data);
        } catch (error) {
            console.error('Erro ao buscar treinos: ', error);
        }
    };

    useEffect(() => {
        fetchUserData()
    }, [username]);

    useEffect(() => {
        if (userData) {
            fetchTreinos();
        }
    }, [userData]);

    return (
        <div className="father-treino">
            {treinos.length === 0 ? (
            <p>Nenhum treino encontrado.</p>
            ) : (
                treinos.map((treino, treinoIndex) => (
                    <div key={treinoIndex}>
                        {Object.keys(treino).map((key, index) => (
                            (key !== "_id" && key !== "userid" && key !== "storeid") && (
                                <div key={index} className="card-treino">
                                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }}>
                                        {treino[key][0]?.grupoMuscular}
                                    </h2>
                                    {Array.isArray(treino[key]) && treino[key].map((exercicio, i) => (
                                        <div key={i} className="exercicios">
                                            {exercicio.exercicio && <p className="itens-treino">{exercicio.exercicio}</p>}
                                            {exercicio.series && <p className="itens-treino"><b>Séries:</b> <br/>{exercicio.series}</p>}
                                            {exercicio.repeticoes && <p className="itens-treino"><b>Repetições:</b> <br/>{exercicio.repeticoes}</p>}
                                        </div>
                                    ))}
                                </div>
                            )
                        ))}
                    </div>
                ))
            )}
        </div>
    );
};

export default TreinoGym;
