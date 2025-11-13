import { baixarProva as baixarProvaOriginal } from "./questionario";
import html2pdf from "html2pdf.js";

const Aprovado = () => {

    const baixarProva = () => {
        const element = document.getElementById('questionario-father').cloneNode(true);

        // Remove elementos com classes "tirar1" até "tirar4"
        const classesParaRemover = ['tirar1', 'tirar2', 'tirar3', 'tirar4', 'btn_corrigir'];
        classesParaRemover.forEach(className => {
            const elements = element.getElementsByClassName(className);
            while(elements[0]) {
                elements[0].parentNode.removeChild(elements[0]);
            }
        });

        html2pdf().from(element).save('prova.pdf');
    };

    var name = localStorage.getItem("nomeAluno");
    var cpf = localStorage.getItem("cpfAluno");
    
    return(
        <div id="div-aprovado">
            <p id="aprovado-linha">______________________________________________________</p>
            <h4 id="aprovado_nome">Nome do aluno(a): {name}</h4>
            <h4 id="aprovado-cpf">CPF: {cpf}</h4>
            <h2 id="aprovado-cpf">Parabéns, você foi aprovado(a)!</h2>
            <h3 id="aprovado-cpf" className="tirar1">Não precisa fazer mais nada, você já está registrado.</h3>
            <h4 id="aprovado-cpf" className="tirar2">Escolha uma opção abaixo:</h4>
            <button onClick={baixarProva} className="tirar3">Baixar Prova: Opcional</button>
            <a href="https://cestsegtrabalho.com.br/"><button id="" className="tirar4">Voltar aos Cursos</button></a>
        </div>
    );
};

export default Aprovado;
