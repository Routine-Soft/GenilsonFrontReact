import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaDumbbell, FaUserCircle } from 'react-icons/fa';
import { GrHomeRounded } from "react-icons/gr";
import { GoHistory } from "react-icons/go";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { LiaDumbbellSolid } from "react-icons/lia";
import { IoIosLogOut } from "react-icons/io";
import Dados from "./dados";
import History from "./historico";
import HistoryProva from "./historicoProva"
import TreinoCompleto from "./treinoCompletos";
import LoginUser from "./loginUser";
import ResetPasswordRequest from "./resetPasswordrequest";
import MensagemLogar from "../js/mensagemLogar";
import { BsBook } from "react-icons/bs";

const Home = () => {
    const { username } = useParams();
    const [userData, setUserData] = useState(null);
    const [componente, setComponente] = useState(<Dados />);
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    const buttonHistory = () => {
        setComponente(<History />);
    }

    const buttonHistoryProva = () => {
        setComponente(<HistoryProva />);
    }

    const buttonDados = () => {
        setComponente(<Dados />);
    }

    const buttonTreino = () => {
        setComponente(<TreinoCompleto />);
    }

    // Pega os dados 
    const fetchData = async () => {
        try {
            const responseUser = await axios.get(`https://genilson-next.vercel.app/api/user/${username}`);
            setUserData(responseUser.data);
            console.log('parametro: ', username)
        } catch (error) {
            console.error("Erro ao buscar os dados: ", error);
        }
    };

    const clearLocalStorage = () => {
        localStorage.clear();
        window.location.reload()
    };

    useEffect(() => {
        fetchData();
    }, [username]);

    return (
        <div className="father-home">
            <div>
                {!isLoggedIn && (
                    <MensagemLogar />
                )}
            </div>

            {userData ? (
                <div>
                    {componente}
                    <div className="bottom-bar">
                        
                            <button className="bottom-bar-button" onClick={buttonDados}>
                                <GrHomeRounded className="icone-buttonbar"/> Home
                            </button>
                            <button className="bottom-bar-button" onClick={buttonHistory}>
                                <HiOutlineStatusOnline className="icone-buttonbar"/> Estudando Agora
                            </button>
                            <button className="bottom-bar-button" onClick={buttonHistoryProva}>
                                <GoHistory className="icone-buttonbar"/> Provas Feitas
                            </button>
                            <button className="bottom-bar-button" onClick={buttonTreino}>
                                <BsBook className="icone-buttonbar-dumbble"/> Estudos e Provas
                            </button>
                    </div>
                </div>
            ) : (
                <p>Carregando dados do usuário...</p>
            )}
        </div>
    );
};

export default Home;
