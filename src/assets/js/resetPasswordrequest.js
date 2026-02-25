import React, { useState } from 'react';
import axios from 'axios';

const ResetPasswordRequest = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://genilson-next.vercel.app/api/request-reset-password', { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  return (
    <div className="main-login">
      <div className="card-login">
        <h2>Redefinir Senha</h2>
          <p>Preencha para receber um email de redefinição de senha</p>
          <form onSubmit={handleSubmit} className="form-primeiroAcesso">
            <div className="textfield">
              <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              required
              />
            </div>
          <button type="submit" className="btn-primeiroAcesso">Enviar</button>
          {message && <p>{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordRequest;
