import type { Turma } from "@/types/interfaces/class";

export const turmasMock: Turma[] = [
    {
        id: 'programacao_web_prof_marina_albuquerque',
        disciplina: 'Programação Web',
        codigo: 'TADS-204',
        professor: 'Prof. Marina Albuquerque',
        horario: 'Seg e qua, 19h00 – 20h40',
        sala: 'Laboratório 3',
        totalAlunos: 32,
        atividades: [
            {
                id: 1,
                titulo: 'Entrega do projeto parcial',
                descricao: 'Publicar o repositório com as telas de login e listagem funcionando.',
                tipo: 'trabalho',
                prazo: '2026-10-14T23:59:00',
                turmaId: 'programacao_web_prof_marina_albuquerque'
            },
            {
                id: 2,
                titulo: 'Avaliação 2 — HTTP e APIs REST',
                descricao: 'Prova prática em laboratório, com consulta à documentação.',
                tipo: 'avaliacao',
                prazo: '2026-10-21T19:00:00',
                turmaId: 'programacao_web_prof_marina_albuquerque'
            },
            {
                id: 3,
                titulo: 'Lista de exercícios de Flexbox e Grid',
                tipo: 'atividade',
                prazo: '2026-10-12T23:59:00',
                turmaId: 'programacao_web_prof_marina_albuquerque',
            },
            {
                id: 4,
                titulo: 'Avaliação 1 HTML e CSS',
                tipo: 'avaliacao',
                prazo: '2026-09-23T19:00:00',
                concluida: true,
                turmaId: 'programacao_web_prof_marina_albuquerque'
            },
            {
                id: 5,
                titulo: 'Portfólio pessoal',
                descricao: 'Página estática publicada no GitHub Pages.',
                tipo: 'trabalho',
                prazo: '2026-09-16T23:59:00',
                concluida: true,
                turmaId: 'programacao_web_prof_marina_albuquerque'
            },
        ],
    },
    {
        id: 'banco_de_dados_prof_rafael_nogueira',
        disciplina: 'Banco de Dados',
        codigo: 'TADS-207',
        professor: 'Prof. Rafael Nogueira',
        horario: 'Ter e qui, 19h00 – 20h40',
        sala: 'Sala 12',
        totalAlunos: 28,
        atividades: [
            {
                id: 6,
                titulo: 'Refatorar Banco de dados do projeto final',
                descricao: 'Revisar o modelo de dados e normalizar as tabelas.',
                tipo: 'trabalho',
                prazo: '2026-10-14T23:59:00',
                turmaId: 'banco_de_dados_prof_rafael_nogueira'
            },
            {
                id: 7,
                titulo: 'Avaliação de SQL e modelagem de dados',
                descricao: 'Prova prática em laboratório, com consulta à documentação.',
                tipo: 'trabalho',
                prazo: '2026-10-14T23:59:00',
                turmaId: 'banco_de_dados_prof_rafael_nogueira'
            },
        ],
    },
    {
        id: 'engenharia_de_software_prof_helena_martins',
        disciplina: 'Engenharia de Software',
        codigo: 'TADS-301',
        professor: 'Prof. Helena Martins',
        horario: 'Sex, 19h00 – 22h00',
        sala: 'Sala 08',
        totalAlunos: 30,
        atividades: [],
    },
    {
        id: 'logica_de_programacao_prof_carlos_teixeira',
        disciplina: 'Lógica de Programação',
        codigo: 'TADS-101',
        professor: 'Prof. Carlos Teixeira',
        horario: 'Seg e qua, 21h00 – 22h40',
        sala: 'Laboratório 1',
        totalAlunos: 35,
        atividades: [],
    },
    ]