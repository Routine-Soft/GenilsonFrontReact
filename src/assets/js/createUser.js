import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'; // Importe useNavigate em vez de useHistory
import { Link } from "react-router-dom";

const CreateUser = () => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState('');
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const checkUsernameAvailability = async () => {
            if (username) {
                try {
                    const response = await axios.get(`https://genilson-next.vercel.app/api/user/check-username/${username}`);
                    setIsUsernameAvailable(response.data.available);
                } catch (error) {
                    console.error('Erro ao verificar disponibilidade do username:', error);
                }
            }
        };

        checkUsernameAvailability();
    }, [username]);

    const creteUser = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`https://genilson-next.vercel.app/api/user/criar`, {name, phone, email, username, password})
            localStorage.setItem('AlunoUserName', name)
            localStorage.setItem('AlunoUserEmail', email)
            localStorage.setItem('AlunoUserid', response.data.user._id)
            localStorage.setItem('AlunoUsername', response.data.user.username)
            localStorage.setItem('userPhone', phone)
            setMessage(response.data.message)
            setTimeout(() => {
                navigate('/loginPage'); // Replace '/login' with the path to your login page
            }, 2000); // Adjust the delay as needed
        } catch (error) {
            setMessage(error.response.data.message)
        }
    }

    return(
        <div className="card-primeiroAcesso">
            <h2>Não tem conta?</h2>
            <p>Crie uma conta grátis</p>
            <form className="form-primeiroAcesso">
            <div className="textfield">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nome"
                    required
                /> <br/>
                <input
                    type="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Whatsapp"
                    required
                /> <br/>
                <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                /> <br/>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="nomedeusuario"
                    required
                /> <br/>
                {isUsernameAvailable === null ? (
                        ''
                    ) : isUsernameAvailable ? (
                        <p>Nome de usuário disponível</p>
                    ) : (
                        <p>Nome de usuário está em uso</p>
                )}
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                required
                />
            </div><br />
            <button onClick={creteUser} className="btn-primeiroAcesso">Cadastrar</button>
            {message && <p>{message}</p>}
        </form>

        </div>
    )
}

export default CreateUser