const EstadoVazio = ({ icone, titulo, texto, children }) => (
    <div className="vazio">
        <span className="vazio__icone" aria-hidden="true">{icone}</span>
        <h3 className="vazio__titulo">{titulo}</h3>
        {texto && <p className="vazio__texto">{texto}</p>}
        {children}
    </div>
);

export default EstadoVazio;
