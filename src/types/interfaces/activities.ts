export type TipoAtividade = 'avaliacao' | 'trabalho' | 'atividade'

export interface Atividade {
        id: number
        titulo: string
        descricao?: string
        tipo: TipoAtividade
        /** ISO 8601 (ex.: 2026-10-14T23:59:00) */
        prazo: string
        concluida?: boolean
        /** Horário opcional no formato HH:mm */
        hora?: string;
        turmaId: string;
}