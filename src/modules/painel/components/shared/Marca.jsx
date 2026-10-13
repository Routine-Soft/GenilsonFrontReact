import logo from '../../../../assets/img/logo.png';

const Marca = ({ subtitulo = 'Painel de treinamentos' }) => (
    <div className="marca">
        <span className="marca__selo">
            <img src={logo} alt="" />
        </span>
        <span className="marca__textos">
            <strong>CestSeg Trabalho</strong>
            <span>{subtitulo}</span>
        </span>
    </div>
);

export default Marca;
