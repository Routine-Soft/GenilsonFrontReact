import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [token, setToken] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState("");
    const [id, setUserId] = useState("");
    const [userUserName, setUserUsername] = useState("");
    const [userPhone, setUserPhone] = useState("");
    const [message, setMessage] = useState('')

    const handleLogin = () => {
      axios.post("https://genilson-next.vercel.app/api/user/login", { email, password })
        .then((response) => {
          const { token, id, name, username, phone } = response.data;
          setToken(token);
          setUserEmail(email);
          setUserId(id);
          setUserName(name);
          setUserUsername(username);
          setUserPhone(phone);
          setIsAuthenticated(true);
          
          localStorage.setItem('token', token);
          localStorage.setItem('userEmail', email);
          localStorage.setItem('AlunoUserid', id);
          localStorage.setItem('AlunoUserName', name);
          localStorage.setItem('AlunoUsername', username);
          localStorage.setItem('userPhone', phone);

          const redirectPath = location.state?.from || `/${username}`; // Obtém o caminho de redirecionamento ou "/" como padrão
          navigate(redirectPath);
          setMessage(response.data.message)
        })
        .catch((error) => {
          if (error.response) {
            setMessage(error.response.data.message);
          } else if (error.request) {
            setMessage("Servidor não respondeu (possível erro de CORS)");
          } else {
            setMessage("Erro inesperado ao fazer login");
          }
        });

    };

    const RedefinirPage = () => {
      navigate('/redefinir-senha')
    }

    return (
        <div className="main-login">
          <div className="card-login">
            <h2>Login</h2>
            <div className="textfield">
              <input
                  type="text"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
              /><br />
            </div>
            <div className="textfield">
              <input
                  type="password"
                  placeholder="Senha"
                  onChange={(e) => setPassword(e.target.value)}
              /><br />
            </div>
            <button onClick={handleLogin} className="btn-login">ENTRAR</button>
            {/* <p className="esqueciSenha">Esqueci senha. <a className="redefinir" onClick={RedefinirPage}>Redefinir senha</a></p> */}
            {message && <p>{message}</p>}
          </div>
        </div>
    );
};

export default Login;
