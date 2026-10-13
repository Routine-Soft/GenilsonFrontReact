import { useState } from 'react';
import logo from '../../../assets/img/logo.png';

const LoginDesenvolvedor = ({ entrando, erro, aoEntrar }) => {
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');

    const enviar = (e) => {
        e.preventDefault();
        aoEntrar(usuario, senha);
    };

    return (
        <form className="dev-card dev-login" onSubmit={enviar}>
            <img src={logo} alt="CestSeg" className="dev-login__logo" />
            <h1 className="dev-login__titulo">Área do desenvolvedor</h1>
            <p className="dev-texto-suave">Entre para ver e trocar as senhas do estudo e da prova.</p>

            {erro && <div className="dev-alerta dev-alerta--erro" key={erro}>{erro}</div>}

            <label className="dev-campo">
                <span>Usuário</span>
                <input
                    className="dev-input"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    autoComplete="username"
                    autoCapitalize="none"
                    required
                />
            </label>
            <label className="dev-campo">
                <span>Senha</span>
                <input
                    className="dev-input"
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    autoComplete="current-password"
                    required
                />
            </label>

            <button type="submit" className="dev-btn dev-btn--primario dev-btn--bloco" disabled={entrando}>
                {entrando ? 'Entrando...' : 'Entrar'}
            </button>
        </form>
    );
};

export default LoginDesenvolvedor;
