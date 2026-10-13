const PageHeader = ({ titulo, subtitulo, contador, children }) => (
    <header className="page-header">
        <div>
            <h1 className="page-title">
                <span className="page-title__texto">{titulo}</span>
                {contador && <span className="badge badge--primary">{contador}</span>}
            </h1>
            {subtitulo && <p className="page-subtitle">{subtitulo}</p>}
        </div>
        {children && <div className="page-header__acoes">{children}</div>}
    </header>
);

export default PageHeader;
