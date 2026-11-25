import { useState } from 'react';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import { validarSenhaAcesso } from '../../senhaAcesso/senhaAcesso.api';
import { cpfValido, emailValido, lerAluno, mascaraCPF, mascaraTelefone, salvarAluno, soNumeros } from '../aluno.utils';

const Campo = ({ id, rotulo, opcional, erro, children }) => (
    <div className={`campo ${erro ? 'campo-invalido' : ''}`}>
        <label htmlFor={id}>
            {rotulo}{opcional && <span className="campo-opcional"> (opcional)</span>}
        </label>
        {children}
        {erro && <p className="campo-erro" id={`${id}-erro`}>{erro}</p>}
    </div>
);

// Dados do aluno + senha (do estudo ou da prova).
// tipoSenha: 'estudo' | 'prova' | null (sem senha). pedirWhatsapp: falso no comprovante da prova sem formulário.
export const FormularioAluno = ({ intro, tipoSenha, pedirWhatsapp = true, textoBotao, aoConcluir }) => {
    const [valores, setValores] = useState(() => {
        const guardado = lerAluno();
        return { ...guardado, cpf: mascaraCPF(guardado.cpf), whatsapp: mascaraTelefone(guardado.whatsapp), senha: '' };
    });
    const [erros, setErros] = useState({});
    const [aviso, setAviso] = useState('');
    const [enviando, setEnviando] = useState('');
    const [verSenha, setVerSenha] = useState(false);

    const mudar = (campo, mascara) => (e) => {
        const valor = mascara ? mascara(e.target.value) : e.target.value;
        setValores((v) => ({ ...v, [campo]: valor }));
        if (erros[campo]) setErros((er) => ({ ...er, [campo]: '' }));
    };

    const validar = () => {
        const novos = {
            nome: valores.nome.trim().length < 3 ? 'Digite seu nome completo.' : '',
            cpf: !cpfValido(valores.cpf) ? 'CPF inválido. Confira os 11 números.' : '',
            whatsapp: pedirWhatsapp && soNumeros(valores.whatsapp).length < 10 ? 'Digite o WhatsApp com DDD.' : '',
            email: valores.email.trim() && !emailValido(valores.email.trim()) ? 'E-mail inválido. Se não tiver, deixe em branco.' : '',
            senha: tipoSenha && !valores.senha ? 'Digite a senha.' : '',
        };
        setErros(novos);
        const primeiro = Object.keys(novos).find((k) => novos[k]);
        if (primeiro) document.getElementById(`aluno-${primeiro}`)?.focus();
        return !primeiro;
    };

    const enviar = async (e) => {
        e.preventDefault();
        setAviso('');
        if (!validar()) return;

        if (tipoSenha) {
            setEnviando('Verificando...');
            try {
                if (!(await validarSenhaAcesso(tipoSenha, valores.senha))) {
                    setErros((er) => ({ ...er, senha: 'Senha incorreta. Confira com quem passou a senha e tente de novo.' }));
                    document.getElementById('aluno-senha')?.focus();
                    setEnviando('');
                    return;
                }
            } catch {
                setAviso('Não foi possível verificar a senha. Confira sua internet e tente de novo.');
                setEnviando('');
                return;
            }
        }

        const aluno = {
            nome: valores.nome.trim().replace(/\s+/g, ' '),
            cpf: valores.cpf,
            whatsapp: valores.whatsapp,
            email: valores.email.trim().toLowerCase(),
            empresa: valores.empresa.trim(),
        };
        salvarAluno(aluno);
        setEnviando('Abrindo...');
        await aoConcluir(aluno);
    };

    const ligar = (campo) => ({
        id: `aluno-${campo}`,
        'aria-invalid': Boolean(erros[campo]),
        'aria-describedby': erros[campo] ? `aluno-${campo}-erro` : undefined,
    });

    return (
        <form className="acesso-form" onSubmit={enviar} noValidate>
            {intro && <p className="acesso-passos">{intro}</p>}

            <Campo id="aluno-nome" rotulo="Nome completo" erro={erros.nome}>
                <input {...ligar('nome')} type="text" autoComplete="name" placeholder="Seu nome completo" value={valores.nome} onChange={mudar('nome')} />
            </Campo>
            <Campo id="aluno-cpf" rotulo="CPF" erro={erros.cpf}>
                <input {...ligar('cpf')} type="text" inputMode="numeric" placeholder="000.000.000-00" value={valores.cpf} onChange={mudar('cpf', mascaraCPF)} />
            </Campo>
            {pedirWhatsapp && (
                <Campo id="aluno-whatsapp" rotulo="WhatsApp" erro={erros.whatsapp}>
                    <input {...ligar('whatsapp')} type="tel" autoComplete="tel-national" placeholder="(00) 00000-0000" value={valores.whatsapp} onChange={mudar('whatsapp', mascaraTelefone)} />
                </Campo>
            )}
            {pedirWhatsapp && (
                <Campo id="aluno-email" rotulo="E-mail" opcional erro={erros.email}>
                    <input {...ligar('email')} type="email" autoComplete="email" placeholder="seuemail@exemplo.com" value={valores.email} onChange={mudar('email')} />
                </Campo>
            )}
            <Campo id="aluno-empresa" rotulo="Empresa onde trabalha" opcional>
                <input id="aluno-empresa" type="text" autoComplete="organization" placeholder="Nome da empresa ou particular" value={valores.empresa} onChange={mudar('empresa')} />
            </Campo>
            {tipoSenha && (
                <Campo id="aluno-senha" rotulo={tipoSenha === 'prova' ? 'Senha da prova' : 'Senha do curso'} erro={erros.senha}>
                    <div className="senha-caixa">
                        <input {...ligar('senha')} type={verSenha ? 'text' : 'password'} inputMode="numeric" autoComplete="off" placeholder="Só números" value={valores.senha} onChange={mudar('senha', soNumeros)} />
                        <button type="button" className="senha-olho" aria-label={verSenha ? 'Esconder senha' : 'Mostrar senha'} aria-pressed={verSenha} onClick={() => setVerSenha((v) => !v)}>
                            {verSenha ? <LuEyeOff aria-hidden="true" /> : <LuEye aria-hidden="true" />}
                        </button>
                    </div>
                </Campo>
            )}

            {aviso && <p className="acesso-aviso" role="alert">{aviso}</p>}
            <button type="submit" className="botao botao-principal botao-grande" disabled={Boolean(enviando)}>
                {enviando || textoBotao}
            </button>
        </form>
    );
};
