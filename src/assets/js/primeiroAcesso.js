import axios from "axios";
import React, { useState } from "react";

const PrimeiroAcesso = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://genilson-next.vercel.app/api/first-access', { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  return (
    <div className="card-primeiroAcesso">
      <h2>Primeiro acesso?</h2>
      <p>Uma academia criou sua conta? Preencha para receber um email de criação de senha</p>
      <form onSubmit={handleSubmit} className="form-primeiroAcesso">
        <div className="textfield">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu e-mail"
            required
          />
        </div><br />
        <button type="submit" className="btn-primeiroAcesso">Enviar</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}

export default PrimeiroAcesso;
