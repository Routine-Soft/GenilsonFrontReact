import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('As senhas não são iguais');
      return;
    }

    try {
      const response = await axios.post(`https://genilson-next.vercel.app/api/reset-password/${token}`, { password });
      setMessage(response.data.message);
      // Redirect to login page after successful password reset
      setTimeout(() => {
        navigate('/login'); // Replace '/login' with the path to your login page
      }, 2000); // Adjust the delay as needed
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  return (
    <div className="main-login">
      <div className='card-login'>
        <h2 className='h2-resetPassword'>Redefinição <br/>de Senha</h2>
        <form onSubmit={handleSubmit}>
          <div className="textfield">
            <label>Nova Senha:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="textfield">
            <label>Confirmar Senha:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-login">Redefinir Senha</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
