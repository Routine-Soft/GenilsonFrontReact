import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import ResetPassword from "./assets/js/resetPasswords";
import ResetPasswordRequest from "./assets/js/resetPasswordrequest";
import ProvaAluno from "./modules/aluno/components/ProvaAluno";
import CursoAluno from "./modules/aluno/components/CursoAluno";
import CreateUser from "./assets/js/createUser";
import Desenvolvedor from "./modules/desenvolvedor/components/Desenvolvedor";
import PainelEntrada from "./modules/painel/components/PainelEntrada";

import './assets/css/login.css';
import './assets/css/primeiroAcesso.css';
import './assets/css/resetPasswordrequest.css';

// Links antigos no formato /#/painel (com #) abrem a página certa
const RedirecionaHash = ({ children }) => {
  const { hash } = useLocation();
  if (hash.startsWith("#/")) return <Navigate to={hash.slice(1)} replace />;
  return children;
};

const App = () => {
  return (
    <Router>
      <RedirecionaHash>
        <Routes>
          {/* Login e painel do dono do sistema */}
          <Route path="/painel" element={<PainelEntrada />} />
          <Route path="/" element={<Navigate to="/painel" replace />} />
          <Route path="/login" element={<Navigate to="/painel" replace />} />
          <Route path="/loginPage" element={<Navigate to="/painel" replace />} />

          {/* Páginas dos alunos (os links ficam no site e no WhatsApp) */}
          <Route path="/prova/:nameUrl" element={<ProvaAluno comFormulario />} />
          <Route path="/provasimples/:nameUrl" element={<ProvaAluno comFormulario={false} />} />
          <Route path="/curso/:nameUrl" element={<CursoAluno comFormulario />} />
          <Route path="/cursosimples/:nameUrl" element={<CursoAluno comFormulario={false} />} />

          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/redefinir-senha" element={<ResetPasswordRequest />} />
          <Route path="/createauser" element={<CreateUser />} />
          <Route path="/desenvolvedor" element={<Desenvolvedor />} />

          {/* Endereço antigo do painel (/nome-do-usuario) e qualquer outro: painel novo */}
          <Route path="*" element={<Navigate to="/painel" replace />} />
        </Routes>
      </RedirecionaHash>
    </Router>
  );
};

export default App;
