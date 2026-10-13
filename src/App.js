import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./assets/js/home";
import ResetPassword from "./assets/js/resetPasswords";
import LoginUser from "./assets/js/loginUser";
import ResetPasswordRequest from "./assets/js/resetPasswordrequest";
import Login from "./assets/js/login";
import Prova from "./assets/js/questionario";
import ProvaSimples from "./assets/js/questionarioSimples";
import Aprovado from "./assets/js/aprovado";
import Curso from "./assets/js/conteudoCurso";
import CursoSimples from "./assets/js/conteudoCursoOPEN";
import CreateUser from "./assets/js/createUser";
import isTokenValid from "./helps/useAuth";
import Desenvolvedor from "./modules/desenvolvedor/components/Desenvolvedor";
import PainelEntrada from "./modules/painel/components/PainelEntrada";

import './assets/css/home.css';
import './assets/css/history.css';
import './assets/css/treinos.css';
import './assets/css/mensagemLogar.css';
import './assets/css/dados.css';
import './assets/css/createTreino.css';
import './assets/css/login.css';
import './assets/css/primeiroAcesso.css';
import './assets/css/resetPasswordrequest.css';
import './assets/css/questionario.css';

// Redireciona para Home se token válido
const AuthRedirect = ({ children }) => {
  const location = useLocation();

  if (isTokenValid()) {
    const username = localStorage.getItem("AlunoUsername"); // ou outro dado que você tenha salvo
    if (location.pathname === "/" || location.pathname === "/login") {
      return <Navigate to={`/${username}`} replace />;
    }
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <AuthRedirect>
        <Routes>
          <Route path="/painel" element={<PainelEntrada />} />
          <Route path="/:username" element={<Home />} />
          <Route path="/prova/:nameUrl" element={<Prova />} />
          <Route path="/provasimples/:nameUrl" element={<ProvaSimples />} />
          <Route path="/curso/:nameUrl" element={<Curso />} />
          <Route path="/cursosimples/:nameUrl" element={<CursoSimples />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/" element={<LoginUser />} />
          <Route path="/login" element={<LoginUser />} />
          <Route path="/redefinir-senha" element={<ResetPasswordRequest />} />
          <Route path="/loginPage" element={<Login />} />
          <Route path="/createauser" element={<CreateUser />} />
          <Route path="/desenvolvedor" element={<Desenvolvedor />} />
        </Routes>
      </AuthRedirect>
    </Router>
  );
};

export default App;
