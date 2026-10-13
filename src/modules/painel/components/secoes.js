import { LuActivity, LuBookOpen, LuClipboardCheck, LuFileCheck, LuLayoutDashboard, LuListChecks } from 'react-icons/lu';

// Telas do painel (a aba fica no endereço: ?aba=cursos)
export const SECOES = [
    { id: 'inicio', rotulo: 'Início', icone: <LuLayoutDashboard />, grupo: 'Principal' },
    { id: 'estudando', rotulo: 'Estudando agora', icone: <LuActivity />, grupo: 'Alunos' },
    { id: 'provas-feitas', rotulo: 'Provas feitas', icone: <LuClipboardCheck />, grupo: 'Alunos' },
    { id: 'cursos', rotulo: 'Cursos', icone: <LuBookOpen />, grupo: 'Conteúdo' },
    { id: 'provas', rotulo: 'Provas', icone: <LuListChecks />, grupo: 'Conteúdo' },
    { id: 'gabaritos', rotulo: 'Gabaritos', icone: <LuFileCheck />, grupo: 'Conteúdo' },
];
