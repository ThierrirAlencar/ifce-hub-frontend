import type { Atividade } from "./activities"

type StatusTurma = 'em_andamento' | 'encerrada'

export interface Turma {
    id: string
    disciplina: string
    codigo: string
    professor: string
    horario: string
    sala: string
    totalAlunos: number
    status?: StatusTurma 
    atividades: Atividade[]
}