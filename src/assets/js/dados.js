import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import moment from 'moment';
import { FaDumbbell, FaUserCircle } from 'react-icons/fa';
import { IoIosLogOut } from "react-icons/io";

const Dados = () => {
    const { username } = useParams();
    const [userData, setUserData] = useState(null);
    const [perimetrias, setPerimetrias] = useState([]);
    const [dobrascutaneas, setDobrasCutaneas] = useState([]);
    const [selectedDobra, setSelectedDobra] = useState(null);
    const [selectedPerimetria, setSelectedPerimetria] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newUserData, setNewUserData] = useState({
        name: "",
        endereco: "",
        phone: "",
        email: "",
        nameperson: "",
        password: "",
    });

    // Fetch de dados do usuário e permissões
    const fetchData = async () => {
        try {
            const responseUser = await axios.get(`https://genilson-next.vercel.app/api/user/${username}`);
            setUserData(responseUser.data);
            // const responseToken = await axios.get(`https://genilson-next.vercel.app/api/protected/user/buscar`, {
            //     headers: { Authorization: `${localStorage.getItem("token")}` }
            // });
            setIsLoggedIn(true);
        } catch (error) {
            console.error("Erro ao buscar dados do usuário:", error);
        }
    };

    // // Fetch de perimetrias e dobras cutâneas
    // const fetchMetrics = async () => {
    //     try {
    //         const responsePerimetrias = await axios.get(`https://genilson-next.vercel.app/api/perimetria/${userData._id}`);
    //         setPerimetrias(responsePerimetrias.data.reverse());

    //         const responseDobrasCutaneas = await axios.get(`https://genilson-next.vercel.app/api/dobrascutaneas/${userData._id}`);
    //         setDobrasCutaneas(responseDobrasCutaneas.data.reverse());
    //     } catch (error) {
    //         console.error("Erro ao buscar métricas do usuário:", error);
    //     }
    // };

    // Atualiza os dados do usuário
    const handleUpdateUserData = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.patch("https://genilson-next.vercel.app/api/protected/userstore/editar", newUserData, {
                headers: { Authorization: `${localStorage.getItem("token")}` }
            });
            setUserData(response.data.userData);
            setIsEditing(false);
        } catch (error) {
            console.error("Erro ao atualizar dados do usuário:", error);
        }
    };

    // Inicia a edição dos dados
    const handleEditClick = () => {
        setIsEditing(true);
        setNewUserData({
            name: userData.name,
            phone: userData.phone,
            email: userData.email,
            password: userData.password, // Inicia o campo de senha vazio
        });
    };

    // Cancela a edição dos dados
    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    // Atualiza o estado dos inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUserData({ ...newUserData, [name]: value });
    };

    // Mostra mais detalhes das dobras cutâneas
    const handleShowMoreDobra = (dobra) => {
        setSelectedDobra(selectedDobra === dobra ? null : dobra);
    };

    // Mostra mais detalhes das perimetrias
    const handleShowMorePerimetria = (perimetria) => {
        setSelectedPerimetria(selectedPerimetria === perimetria ? null : perimetria);
    };

    useEffect(() => {
        fetchData();
    }, [username]);

    // useEffect(() => {
    //     if (userData) {
    //         fetchMetrics();
    //     }
    // }, [userData]);

    return (
        <div className="father-dados">

            {userData && !isEditing && (
                <div>
                    <div className="user-profile">
                        <div className="profile-info">
                            <FaUserCircle className="profile-icon" />
                            <div className="user-info">
                                <h3>{userData.name}</h3>
                                <p>@{userData.username}</p>
                                {isLoggedIn && !isEditing && (
                                <button className="editButton-account" onClick={handleEditClick}>Editar</button>
                                )}
                            </div>
                        </div>
                        <div className="settings">
                            {isLoggedIn && (
                                <button className="bottom-bar-button" onClick={() => { localStorage.clear(); window.location.reload(); }}>
                                    <IoIosLogOut className="profile-icon-logout" />
                                </button>
                            )}
                        </div>
                    </div>

                    <h2 className="title-estado"></h2>
                    <div className="item">
                        {dobrascutaneas.slice(0, 1).map((dobra) => (
                            <ul key={dobra._id}>
                                <p><b>Criado em:</b> {moment(dobra.createdAt).format('DD/MM/YYYY HH:mm')}</p>
                                <p><b>Percentual de Gordura:</b> {dobra.resultadopercentualdegordura}%</p>
                                <p><b>Peso Atual:</b> {dobra.pesoatual}kg</p>
                                {selectedDobra === dobra && (
                                    <>
                                        <p>Peitoral: {dobra.peitoral}</p>
                                        <p>Axilar Média: {dobra.axilarmedia}</p>
                                        <p>Triciptal: {dobra.triciptal}</p>
                                        <p>Subescapular: {dobra.subescapular}</p>
                                        <p>Abdominal: {dobra.abdominal}</p>
                                        <p>Suprailiaca: {dobra.suprailiaca}</p>
                                        <p>Coxa: {dobra.coxa}</p>
                                        <p>Biciptal: {dobra.biciptal}</p>
                                        <p>Panturrilha Média: {dobra.panturrilhaMedia}</p>
                                        <p>Somatório das dobras: {dobra.somatoriodasdobras}</p>
                                        <p>Idade: {dobra.idade}</p>
                                    </>
                                )}
                                <button onClick={() => handleShowMoreDobra(dobra)} className="button-dados">
                                    {selectedDobra === dobra ? "Mostrar Menos" : "Mostrar Mais"}
                                </button>
                            </ul>
                        ))}
                    </div>
                </div>

            )}
            <div className="edit-container">
                {isEditing && (
                    <div className="div-inputs-account">
                        <input type="text" name="name" value={newUserData.name} onChange={handleInputChange} placeholder="Novo Nome" className="input-account" />
                        <input type="text" name="phone" value={newUserData.phone} onChange={handleInputChange} placeholder="Novo Telefone" className="input-account" />
                        <input type="text" name="email" value={newUserData.email} onChange={handleInputChange} placeholder="Novo Email" className="input-account" />
                        <input type="password" name="password" value={newUserData.password} onChange={handleInputChange} placeholder="Nova Senha" className="input-account" /> {/* Campo de senha */}
                        <button className="salvar-account" onClick={handleUpdateUserData}>Salvar</button>
                        <button className="cancel-account" onClick={handleCancelEdit}>Cancelar</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dados;
