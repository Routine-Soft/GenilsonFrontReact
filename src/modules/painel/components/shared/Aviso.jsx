import { LuCircleAlert, LuCircleCheck } from 'react-icons/lu';

const Aviso = ({ tipo = 'success', children }) => (
    <p className={`alert alert--${tipo}`} role={tipo === 'error' ? 'alert' : 'status'} key={String(children)}>
        {tipo === 'error' ? <LuCircleAlert aria-hidden="true" /> : <LuCircleCheck aria-hidden="true" />}
        <span>{children}</span>
    </p>
);

export default Aviso;
