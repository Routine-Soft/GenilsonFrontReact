import { LINK_APP, paraSlug } from '../../painel.utils';

// Final do endereço (ex.: nr35trabalhoemaltura). Limpa sozinho acentos, espaços e símbolos.
const CampoLink = ({ id, valor, aoMudar, pasta, emUso }) => (
    <div className="field">
        <label className="field__label" htmlFor={id}>Endereço (link) *</label>
        <div className="campo-link">
            <span className="campo-link__prefixo">{LINK_APP.replace('https://', '')}/{pasta}/</span>
            <input
                id={id}
                className="input"
                value={valor}
                onChange={(e) => aoMudar(paraSlug(e.target.value))}
                placeholder="nomedocurso"
                autoComplete="off"
                required
            />
        </div>
        {emUso ? (
            <span className="field__hint field__hint--erro">Esse endereço já está sendo usado. Escolha outro.</span>
        ) : (
            <span className="field__hint">
                Só letras minúsculas e números, tudo junto. O link fica:{' '}
                <strong>{`${LINK_APP}/${pasta}/${valor || '...'}`}</strong>
            </span>
        )}
    </div>
);

export default CampoLink;
