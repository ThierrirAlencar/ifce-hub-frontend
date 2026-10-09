import type { TipoEvento } from "../interfaces/eventos";
import { FileText, PenLine, ClipboardList } from "lucide-vue-next";

export const tipos_eventos: Record<
    TipoEvento,
    { rotulo: string; icone: typeof FileText; chip: string; ponto: string }
> = {
    avaliacao: {
        rotulo: "Avaliação",
        icone: PenLine,
        chip: "bg-rose-50 text-rose-700",
        ponto: "bg-rose-500",
    },
    trabalho: {
        rotulo: "Trabalho",
        icone: FileText,
        chip: "bg-amber-50 text-amber-700",
        ponto: "bg-amber-500",
    },
    atividade: {
        rotulo: "Atividade",
        icone: ClipboardList,
        chip: "bg-sky-50 text-sky-700",
        ponto: "bg-sky-500",
    },
};