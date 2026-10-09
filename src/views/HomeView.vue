<script setup lang="ts">
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";
import {
    CalendarClock,
    ChevronLeft,
    ChevronRight,
} from "lucide-vue-next";
import { tipos_eventos } from "@/types/records/idk";
import { turmasMock } from "@/templates/classes";
import type { Atividade } from "@/types/interfaces/activities";

/* ---------- Tipos e dados ---------- */



// TODO: substituir por dados da API (ex.: GET /agenda?mes=2026-10)
const eventos = ref<Atividade[]>(turmasMock.map((turma) => turma.atividades).flat());

function chaveDoPrazo(prazo: string) {
    return prazo.slice(0, 10);
}

function horaDoEvento(evento: Atividade) {
    return evento.hora ?? evento.prazo.slice(11, 16);
}

function nomeDaTurma(turmaId: string) {
    return turmasMock.find((turma) => turma.id === turmaId)?.disciplina ?? turmaId;
}


/* ---------- Utilitários de data ---------- */

const pad = (n: number) => String(n).padStart(2, "0");

const toKey = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const fromKey = (key: string) => {
    const [ano, mes, dia] = key.split("-").map(Number);
    return new Date(ano || 0, mes ? mes - 1 : 0, dia);
};

const capitalizar = (texto: string) =>
    texto.charAt(0).toUpperCase() + texto.slice(1);

function diasAte(key: string) {
    const alvo = fromKey(key).getTime();
    const base = fromKey(hojeKey).getTime();
    return Math.round((alvo - base) / 86_400_000);
}

function textoRelativo(key: string) {
    const dias = diasAte(key);
    if (dias === 0) return "Hoje";
    if (dias === 1) return "Amanhã";
    return `Em ${dias} dias`;
}

/* ---------- Estado do calendário ---------- */

const hoje = new Date();
const hojeKey = toKey(hoje);

const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const dataSelecionada = ref(
    new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()),
);

const mesAtual = ref(new Date(hoje.getFullYear(), hoje.getMonth(), 1));

const chaveSelecionada = computed(() => toKey(dataSelecionada.value));

const tituloMes = computed(() =>
    capitalizar(
        mesAtual.value.toLocaleDateString("pt-BR", {
            month: "long",
            year: "numeric",
        }),
    ),
);

const eventosPorDia = computed(() => {
    const mapa = new Map<string, Atividade[]>();

    for (const evento of eventos.value) {
        const chave = chaveDoPrazo(evento.prazo);
        const lista = mapa.get(chave) ?? [];
        lista.push(evento);
        mapa.set(chave, lista);
    }

    for (const lista of mapa.values()) {
        lista.sort((a, b) => a.prazo.localeCompare(b.prazo));
    }

    return mapa;
});

// Sempre 6 semanas (42 células) para a altura do calendário não "pular" entre meses
const dias = computed(() => {
    const ano = mesAtual.value.getFullYear();
    const mes = mesAtual.value.getMonth();
    const primeiroDiaSemana = new Date(ano, mes, 1).getDay();

    return Array.from({ length: 42 }, (_, i) => {
        const data = new Date(ano, mes, 1 - primeiroDiaSemana + i);
        const chave = toKey(data);

        return {
            data,
            chave,
            numero: data.getDate(),
            foraDoMes: data.getMonth() !== mes,
            eventos: eventosPorDia.value.get(chave) ?? [],
        };
    });
});

const jaEstaEmHoje = computed(
    () =>
        chaveSelecionada.value === hojeKey &&
        mesAtual.value.getMonth() === hoje.getMonth() &&
        mesAtual.value.getFullYear() === hoje.getFullYear(),
);

function mudarMes(quantidade: number) {
    mesAtual.value = new Date(
        mesAtual.value.getFullYear(),
        mesAtual.value.getMonth() + quantidade,
        1,
    );
}

function irParaHoje() {
    dataSelecionada.value = new Date(
        hoje.getFullYear(),
        hoje.getMonth(),
        hoje.getDate(),
    );
    mesAtual.value = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
}

function selecionar(data: Date) {
    dataSelecionada.value = data;

    // Ao clicar em um dia de outro mês, o calendário acompanha
    if (data.getMonth() !== mesAtual.value.getMonth()) {
        mesAtual.value = new Date(data.getFullYear(), data.getMonth(), 1);
    }
}

function rotuloDia(dia: (typeof dias.value)[number]) {
    const data = dia.data.toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
    const n = dia.eventos.length;
    if (!n) return data;
    return `${data}, ${n} ${n === 1 ? "evento" : "eventos"}`;
}

/* ---------- Painel do dia selecionado ---------- */

const numeroDia = computed(() => dataSelecionada.value.getDate());

const nomeDiaSemana = computed(() =>
    capitalizar(
        dataSelecionada.value.toLocaleDateString("pt-BR", { weekday: "long" }),
    ),
);

const mesEAno = computed(() =>
    dataSelecionada.value.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
    }),
);

const eventosDoDia = computed(
    () => eventosPorDia.value.get(chaveSelecionada.value) ?? [],
);

/* ---------- Próximos eventos ---------- */

const proximos = computed(() =>
    eventos.value
        .filter((evento) => !evento.concluida && chaveDoPrazo(evento.prazo) >= hojeKey)
        .sort((a, b) => a.prazo.localeCompare(b.prazo))
        .slice(0, 5),
);

const eventosNaSemana = computed(
    () =>
        eventos.value.filter((evento) => {
            if (evento.concluida) return false;
            const dias = diasAte(chaveDoPrazo(evento.prazo));
            return dias >= 0 && dias <= 7;
        }).length,
);

const subtitulo = computed(() => {
    const n = eventosNaSemana.value;
    if (!n) return "Nenhum evento à vista por enquanto.";
    return n === 1
        ? "1 evento nos próximos 7 dias."
        : `${n} eventos nos próximos 7 dias.`;
});

function mesAbreviado(key: string) {
    return fromKey(key)
        .toLocaleDateString("pt-BR", { month: "short" })
        .replace(".", "");
}
</script>

<template>
    <main class="min-h-screen bg-slate-50">
        <div class="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
            <!-- Título da página -->
            <header class="mb-8">
                <h1 class="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                    Sua agenda
                </h1>
                <p class="mt-2 text-lg text-slate-500">{{ subtitulo }}</p>
            </header>

            <div class="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
                <!-- Calendário -->
                <section
                    class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                    aria-label="Calendário"
                >
                    <div
                        class="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-8 sm:py-5"
                    >
                        <h2 class="text-xl font-bold text-slate-900 sm:text-2xl">
                            {{ tituloMes }}
                        </h2>

                        <div class="flex items-center gap-1">
                            <button
                                v-if="!jaEstaEmHoje"
                                type="button"
                                class="mr-2 rounded-full border border-emerald-600/30 px-4 py-1.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
                                @click="irParaHoje"
                            >
                                Hoje
                            </button>

                            <button
                                type="button"
                                class="flex size-10 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
                                aria-label="Mês anterior"
                                @click="mudarMes(-1)"
                            >
                                <ChevronLeft :size="22" />
                            </button>
                            <button
                                type="button"
                                class="flex size-10 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
                                aria-label="Próximo mês"
                                @click="mudarMes(1)"
                            >
                                <ChevronRight :size="22" />
                            </button>
                        </div>
                    </div>

                    <div class="px-3 pb-6 pt-4 sm:px-6">
                        <div class="mb-2 grid grid-cols-7 text-center" aria-hidden="true">
                            <div
                                v-for="nome in diasSemana"
                                :key="nome"
                                class="text-sm font-semibold text-slate-400"
                            >
                                {{ nome }}
                            </div>
                        </div>

                        <div class="grid grid-cols-7 gap-1">
                            <button
                                v-for="dia in dias"
                                :key="dia.chave"
                                type="button"
                                :aria-label="rotuloDia(dia)"
                                :aria-pressed="dia.chave === chaveSelecionada"
                                :aria-current="dia.chave === hojeKey ? 'date' : undefined"
                                class="relative flex h-14 flex-col items-center justify-center gap-1 rounded-2xl text-base transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/50 sm:h-[4.5rem]"
                                :class="[
                                    dia.chave === chaveSelecionada
                                        ? 'bg-emerald-600 font-bold text-white shadow-sm hover:bg-emerald-700'
                                        : dia.chave === hojeKey
                                          ? 'bg-emerald-50 font-bold text-emerald-700 hover:bg-emerald-100'
                                          : 'font-medium text-slate-700 hover:bg-slate-100',
                                    dia.foraDoMes && dia.chave !== chaveSelecionada
                                        ? 'opacity-40'
                                        : '',
                                ]"
                                @click="selecionar(dia.data)"
                            >
                                <span>{{ dia.numero }}</span>

                                <!-- Marcadores de eventos -->
                                <span class="flex h-1.5 items-center gap-1" aria-hidden="true">
                                    <span
                                        v-for="evento in dia.eventos.slice(0, 3)"
                                        :key="evento.id"
                                        class="size-1.5 rounded-full"
                                        :class="
                                            dia.chave === chaveSelecionada
                                                ? 'bg-white'
                                                : tipos_eventos[evento.tipo].ponto
                                        "
                                    />
                                </span>
                            </button>
                        </div>

                        <!-- Legenda -->
                        <ul
                            class="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-100 px-2 pt-4 text-sm text-slate-500"
                        >
                            <li
                                v-for="(tipo, chave) in tipos_eventos"
                                :key="chave"
                                class="flex items-center gap-2"
                            >
                                <span class="size-2 rounded-full" :class="tipo.ponto" />
                                {{ tipos_eventos[chave].rotulo }}
                            </li>
                        </ul>
                    </div>
                </section>

                <!-- Coluna lateral -->
                <aside class="flex flex-col gap-6 lg:sticky lg:top-6">
                    <!-- Dia selecionado -->
                    <section
                        class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                        aria-live="polite"
                    >
                        <div class="flex items-center gap-4">
                            <div
                                class="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-4xl font-bold text-white"
                            >
                                {{ numeroDia }}
                            </div>
                            <div class="min-w-0">
                                <h2 class="text-xl font-bold text-slate-900">
                                    {{ nomeDiaSemana }}
                                </h2>
                                <p class="text-sm text-slate-500">{{ mesEAno }}</p>
                            </div>
                        </div>

                        <ul v-if="eventosDoDia.length" class="mt-5 space-y-3">
                            <li v-for="evento in eventosDoDia" :key="evento.id">
                                <RouterLink
                                    :to="`/turmas/${evento.turmaId}`"
                                    class="block rounded-2xl border border-slate-200 p-4 transition-colors hover:border-emerald-600/40 hover:bg-emerald-50/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
                                >
                                    <span
                                        class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                                        :class="tipos_eventos[evento.tipo].chip"
                                    >
                                        <component
                                            :is="tipos_eventos[evento.tipo].icone"
                                            class="size-3.5"
                                            aria-hidden="true"
                                        />
                                        {{ tipos_eventos[evento.tipo].rotulo }}
                                    </span>
                                    <p class="mt-2 font-semibold text-slate-900">
                                        {{ evento.titulo }}
                                    </p>
                                    <p class="mt-0.5 text-sm text-slate-500">
                                        {{ nomeDaTurma(evento.turmaId) }}
                                        <template v-if="horaDoEvento(evento)">
                                            · {{ horaDoEvento(evento) }}
                                        </template>
                                    </p>
                                </RouterLink>
                            </li>
                        </ul>

                        <p v-else class="mt-5 text-sm text-slate-500">
                            Nenhum evento neste dia.
                        </p>
                    </section>

                    <!-- Próximos na agenda -->
                    <section
                        class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                        aria-label="Próximos na agenda"
                    >
                        <div class="flex items-center gap-2">
                            <CalendarClock class="size-5 text-emerald-700" aria-hidden="true" />
                            <h2 class="text-lg font-bold text-slate-900">Próximos na agenda</h2>
                        </div>

                        <ul v-if="proximos.length" class="mt-4 space-y-1">
                            <li v-for="evento in proximos" :key="evento.id">
                                <RouterLink
                                    :to="`/turmas/${evento.turmaId}`"
                                    class="flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
                                >
                                    <div
                                        class="flex size-12 shrink-0 flex-col items-center justify-center rounded-xl bg-slate-100 leading-none"
                                    >
                                        <span class="text-lg font-bold text-slate-900">
                                            {{ fromKey(chaveDoPrazo(evento.prazo)).getDate() }}
                                        </span>
                                        <span class="mt-0.5 text-xs text-slate-500">
                                            {{ mesAbreviado(chaveDoPrazo(evento.prazo)) }}
                                        </span>
                                    </div>

                                    <div class="min-w-0 flex-1">
                                        <p class="truncate text-sm font-semibold text-slate-900">
                                            {{ evento.titulo }}
                                        </p>
                                        <p class="truncate text-xs text-slate-500">
                                            {{ nomeDaTurma(evento.turmaId) }} ·
                                            {{ textoRelativo(chaveDoPrazo(evento.prazo)) }}
                                            <template v-if="horaDoEvento(evento)">
                                                · {{ horaDoEvento(evento) }}
                                            </template>
                                        </p>
                                    </div>

                                    <span
                                        class="size-2.5 shrink-0 rounded-full"
                                        :class="tipos_eventos[evento.tipo].ponto"
                                        :title="tipos_eventos[evento.tipo].rotulo"
                                    />
                                </RouterLink>
                            </li>
                        </ul>

                        <div v-else class="mt-4 rounded-2xl bg-slate-50 px-4 py-6 text-center">
                            <h3 class="font-semibold text-slate-900">Agenda livre</h3>
                            <p class="mt-1 text-sm text-slate-500">
                                Quando a turma tiver avaliações, trabalhos ou atividades, eles
                                aparecerão aqui.
                            </p>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    </main>
</template>