export type TipoEvento = "avaliacao" | "trabalho" | "atividade";

export interface Evento {
    id: number;
    titulo: string;
    turmaId: number;
    turma: string;
    tipo: TipoEvento;
    /** Data local no formato YYYY-MM-DD */
    data: string;
    /** Horário opcional no formato HH:mm */
    hora?: string;
}