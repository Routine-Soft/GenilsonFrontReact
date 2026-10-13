import { LuSearch, LuX } from 'react-icons/lu';

const Busca = ({ valor, aoMudar, placeholder }) => (
    <label className="search">
        <LuSearch aria-hidden="true" />
        <input
            type="search"
            className="input"
            value={valor}
            onChange={(e) => aoMudar(e.target.value)}
            placeholder={placeholder}
            aria-label={placeholder}
        />
        {valor && (
            <button type="button" className="icon-btn search__limpar" onClick={() => aoMudar('')} aria-label="Limpar a busca">
                <LuX aria-hidden="true" />
            </button>
        )}
    </label>
);

export default Busca;
