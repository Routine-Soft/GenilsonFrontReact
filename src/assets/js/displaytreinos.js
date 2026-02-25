import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import moment from 'moment';

const DisplayTreinos = () => {
    const [treinos, setTreinos] = useState([]);
    const { username } = useParams();
    const [userData, setUserData] = useState(null);
    const [visibleTreinos, setVisibleTreinos] = useState([]);
    const [editIndex, setEditIndex] = useState(-1);
    const [editedTreino, setEditedTreino] = useState(null);

    // Pega os dados do usuário
    const fetchUserData = async () => {
        try {
            const responseUser = await axios.get(`https://genilson-next.vercel.app/api/user/${username}`);
            setUserData(responseUser.data);
        } catch (error) {
            console.error("Erro ao buscar os dados do usuário: ", error);
        }
    };

    const fetchTreinos = async () => {
        try {
            const response = await axios.get(`https://genilson-next.vercel.app/api/treino/${userData._id}`);
            setTreinos(response.data);
            setVisibleTreinos(Array(response.data.length).fill(false)); // Inicializa o estado de visibilidade dos treinos
        } catch (error) {
            console.error('Erro ao buscar treinos: ', error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [username]);

    useEffect(() => {
        if (userData) {
            fetchTreinos();
        }
    }, [userData]);

    const toggleVisibility = (index) => {
        const newVisibility = [...visibleTreinos];
        newVisibility[index] = !newVisibility[index];
        setVisibleTreinos(newVisibility);
    };

    const handleEditClick = (index) => {
        setEditIndex(index);
        setEditedTreino({ ...treinos[index] });
    };

    const handleDeleteClick = async (id, index) => {
        try {
            await axios.delete(`https://genilson-next.vercel.app/api/treino/${id}`, {
                headers: { Authorization: `${localStorage.getItem("token")}` }
            });
            console.log('deletado com sucesso');
            // Remove o treino da lista após a exclusão
            const updatedTreinos = [...treinos];
            updatedTreinos.splice(index, 1);
            setTreinos(updatedTreinos);

            // Atualiza a visibilidade dos treinos
            const updatedVisibility = [...visibleTreinos];
            updatedVisibility.splice(index, 1);
            setVisibleTreinos(updatedVisibility);
        } catch (error) {
            console.error("Erro ao deletar treino: ", error);
        }
    };

    const handleSaveEdit = async (id) => {
        try {
            await axios.patch(`https://genilson-next.vercel.app/api/treino/${id}`, editedTreino, {
                headers: { Authorization: `${localStorage.getItem("token")}` }
            });
            setEditIndex(-1);
            fetchTreinos();
        } catch (error) {
            console.error("Erro ao atualizar treino: ", error);
        }
    };

    const handleEditChange = (key, value, groupIndex, exerciseIndex) => {
        const updatedTreino = { ...editedTreino };
        updatedTreino[key][groupIndex][exerciseIndex] = value;
        setEditedTreino(updatedTreino);
    };

    return (
        <div className="father-treino">
            <h3>Lista de Treinos</h3>
            {treinos.length === 0 ? (
                <p>Nenhum treino encontrado.</p>
            ) : (
                treinos.map((treino, treinoIndex) => (
                    <div key={treinoIndex}>
                        <button type="button" onClick={() => toggleVisibility(treinoIndex)} className="toggleButton">
                            {visibleTreinos[treinoIndex] ? `Esconder Treino ${treinoIndex + 1}` : `Mostrar Treino ${treinoIndex + 1}`}
                        </button>
                        {visibleTreinos[treinoIndex] && (
                            <>
                                {Object.keys(treino).map((key, index) => (
                                    (key !== "_id" && key !== "userid" && key !== "storeid") && (
                                        <div key={index} className="card-treino">
                                            <h2 style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }}>
                                                {treino[key][0]?.grupoMuscular}
                                            </h2>
                                            {Array.isArray(treino[key]) && treino[key].map((exercicio, i) => (
                                                <div key={i} className="exercicios">
                                                    {editIndex === treinoIndex ? (
                                                        <>
                                                            <input
                                                                type="text"
                                                                value={editedTreino[key][i]?.exercicio}
                                                                onChange={(e) => handleEditChange(key, e.target.value, 0, 'exercicio')}
                                                            />
                                                            <input
                                                                type="text"
                                                                value={editedTreino[key][i]?.series}
                                                                onChange={(e) => handleEditChange(key, e.target.value, 0, 'series')}
                                                            />
                                                            <input
                                                                type="text"
                                                                value={editedTreino[key][i]?.repeticoes}
                                                                onChange={(e) => handleEditChange(key, e.target.value, 0, 'repeticoes')}
                                                            />
                                                        </>
                                                    ) : (
                                                        <>
                                                            {exercicio.exercicio && <p className="itens-treino">{exercicio.exercicio}</p>}
                                                            {exercicio.series && <p className="itens-treino"><b>Séries:</b> <br />{exercicio.series}</p>}
                                                            {exercicio.repeticoes && <p className="itens-treino"><b>Repetições:</b> <br />{exercicio.repeticoes}</p>}
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )
                                ))}
                                {editIndex === treinoIndex ? (
                                    <button onClick={() => handleSaveEdit(treino._id)}>Salvar</button>
                                ) : (
                                    <button onClick={() => handleEditClick(treinoIndex)} className="toggleButton">Editar</button>
                                )}
                                <button onClick={() => handleDeleteClick(treino._id, treinoIndex)} className="toggleButton">Apagar</button>
                            </>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default DisplayTreinos;
