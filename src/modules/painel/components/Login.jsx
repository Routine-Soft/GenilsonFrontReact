import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { LuEye, LuEyeOff, LuGraduationCap, LuShieldCheck, LuUsers } from 'react-icons/lu';
import { useLogin, usePreferencias } from '../painel.hooks';
import logo from '../../../assets/img/logo.png';
import Aviso from './shared/Aviso';
import Preferencias from './shared/Preferencias';
import '../styles/theme.css';
import '../styles/ui.css';
import './Login.css';

const DESTAQUES = [
    { icone: <LuUsers />, texto: 'Veja na hora quem está estudando' },
    { icone: <LuGraduationCap />, texto: 'Cadastre cursos e provas em minutos' },
    { icone: <LuShieldCheck />, texto: 'Mande o link para o aluno pelo WhatsApp' },
];

const Login = ({ aoEntrar }) => {
    const preferencias = usePreferencias();
    const { entrando, erro, entrar } = useLogin();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [verSenha, setVerSenha] = useState(false);

    const enviar = async (e) => {
        e.preventDefault();
        const usuario = await entrar(email, senha);
        if (usuario) aoEntrar();
    };

    return (
        <div className="cs login" data-tema={preferencias.tema}>
            <Helmet>
                <title>Entrar · CestSeg Trabalho</title>
            </Helmet>

            <section className="login__marca" aria-hidden="true">
                <span className="login__forma login__forma--1" />
                <span className="login__forma login__forma--2" />
                <span className="login__forma login__forma--3" />
                <div className="login__marca-conteudo">
                    <span className="login__logo"><img src={logo} alt="" /></span>
                    <h2 className="login__slogan">Treinamentos de segurança do trabalho, do seu jeito.</h2>
                    <ul className="login__destaques">
                        {DESTAQUES.map((d, i) => (
                            <li key={d.texto} style={{ '--i': i }}>
                                <span className="login__destaque-icone">{d.icone}</span>
                                {d.texto}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="login__lado">
                <div className="login__preferencias">
                    <Preferencias preferencias={preferencias} compacto />
                </div>

                <form className="card glass login__cartao" onSubmit={enviar}>
                    <span className="login__logo login__logo--celular"><img src={logo} alt="CestSeg Trabalho" /></span>
                    <h1 className="login__titulo">Bem-vindo de volta</h1>
                    <p className="page-subtitle">Entre com seu e-mail e senha para abrir o painel.</p>

                    {erro && <Aviso tipo="error">{erro}</Aviso>}

                    <div className="field">
                        <label className="field__label" htmlFor="login-email">E-mail</label>
                        <input
                            id="login-email"
                            className="input"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            autoCapitalize="none"
                            placeholder="seuemail@exemplo.com"
                            required
                        />
                    </div>

                    <div className="field">
                        <label className="field__label" htmlFor="login-senha">Senha</label>
                        <div className="login__senha">
                            <input
                                id="login-senha"
                                className="input"
                                type={verSenha ? 'text' : 'password'}
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                autoComplete="current-password"
                                placeholder="Sua senha"
                                required
                            />
                            <button
                                type="button"
                                className="icon-btn login__ver-senha"
                                onClick={() => setVerSenha(!verSenha)}
                                aria-label={verSenha ? 'Esconder a senha' : 'Mostrar a senha'}
                                title={verSenha ? 'Esconder a senha' : 'Mostrar a senha'}
                            >
                                {verSenha ? <LuEyeOff aria-hidden="true" /> : <LuEye aria-hidden="true" />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className={`btn btn--primary btn--block login__entrar${entrando ? ' btn--loading' : ''}`} disabled={entrando}>
                        {entrando ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <p className="login__rodape">CestSeg Trabalho · Segurança e saúde no trabalho</p>
            </section>
        </div>
    );
};

export default Login;
