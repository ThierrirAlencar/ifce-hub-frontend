<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import {
    Bell,
    BellOff,
    CheckCheck,
    ClipboardList,
    FileText,
    Megaphone,
    PenLine,
} from "lucide-vue-next";

type TipoNotificacao = "avaliacao" | "trabalho" | "atividade" | "aviso";

interface Notificacao {
    id: number;
    tipo: TipoNotificacao;
    titulo: string;
    descricao?: string;
    /** Data de criação em ISO 8601 */
    criadaEm: string;
    lida: boolean;
    /** Rota para onde o usuário vai ao clicar (opcional) */
    link?: string;
}

const minutosAtras = (min: number) =>
    new Date(Date.now() - min * 60_000).toISOString();

// TODO: substituir por dados da API / store (ex.: useNotificacoes())
const notificacoes = ref<Notificacao[]>([
    {
        id: 1,
        tipo: "avaliacao",
        titulo: "Avaliação 2 marcada para 21 de outubro",
        descricao: "Programação Web · 19h00",
        criadaEm: minutosAtras(5),
        lida: false,
        link: "/turmas/1",
    },
    {
        id: 2,
        tipo: "trabalho",
        titulo: "Novo trabalho publicado",
        descricao: "Seminário de modelagem de sistemas, em Engenharia de Software.",
        criadaEm: minutosAtras(125),
        lida: false,
        link: "/turmas/3",
    },
    {
        id: 3,
        tipo: "atividade",
        titulo: "Prazo termina amanhã",
        descricao: "Lista de exercícios de Flexbox e Grid vence às 23h59.",
        criadaEm: minutosAtras(60 * 26),
        lida: true,
        link: "/turmas/1",
    },
    {
        id: 4,
        tipo: "aviso",
        titulo: "Aula de sexta remarcada",
        descricao: "Banco de Dados: a aula acontecerá no Laboratório 2.",
        criadaEm: minutosAtras(60 * 24 * 2),
        lida: true,
        link: "/turmas/2",
    },
    {
        id: 5,
        tipo: "aviso",
        titulo: "Bem-vindo ao IFCE Hub",
        descricao: "Aqui você acompanha suas turmas, atividades e avisos.",
        criadaEm: minutosAtras(60 * 24 * 9),
        lida: true,
    },
]);

const tipos: Record<
    TipoNotificacao,
    { icone: typeof Bell; fundo: string }
> = {
    avaliacao: { icone: PenLine, fundo: "bg-rose-50 text-rose-700" },
    trabalho: { icone: FileText, fundo: "bg-amber-50 text-amber-700" },
    atividade: { icone: ClipboardList, fundo: "bg-sky-50 text-sky-700" },
    aviso: { icone: Megaphone, fundo: "bg-emerald-50 text-emerald-700" },
};

/* ---------- Estado ---------- */

const router = useRouter();

const aberto = ref(false);
const raiz = ref<HTMLElement | null>(null);
const botao = ref<HTMLButtonElement | null>(null);

const naoLidas = computed(
    () => notificacoes.value.filter((n) => !n.lida).length,
);

const textoBadge = computed(() => (naoLidas.value > 9 ? "9+" : naoLidas.value));

const rotuloBotao = computed(() => {
    const n = naoLidas.value;
    if (!n) return "Notificações";
    return `Notificações, ${n} ${n === 1 ? "não lida" : "não lidas"}`;
});

const resumo = computed(() => {
    const n = naoLidas.value;
    if (!n) return "Tudo em dia";
    return n === 1 ? "1 não lida" : `${n} não lidas`;
});

/* ---------- Ações ---------- */

function alternar() {
    aberto.value = !aberto.value;
}

function fechar(devolverFoco = false) {
    aberto.value = false;
    if (devolverFoco) botao.value?.focus();
}

function marcarComoLida(notificacao: Notificacao) {
    if (notificacao.lida) return;
    notificacao.lida = true;
    // TODO: PATCH /notificacoes/:id { lida: true }
}

function marcarTodasComoLidas() {
    notificacoes.value.forEach((n) => (n.lida = true));
    // TODO: POST /notificacoes/marcar-todas-como-lidas
}

function abrir(notificacao: Notificacao) {
    marcarComoLida(notificacao);

    if (notificacao.link) {
        fechar();
        router.push(notificacao.link);
    }
}

/* ---------- Fechar ao clicar ou focar fora ---------- */

function aoPressionarFora(evento: PointerEvent) {
    if (!aberto.value) return;
    if (!raiz.value?.contains(evento.target as Node)) fechar();
}

function aoFocarFora(evento: FocusEvent) {
    if (!aberto.value) return;
    if (!raiz.value?.contains(evento.target as Node)) fechar();
}

onMounted(() => {
    document.addEventListener("pointerdown", aoPressionarFora);
    document.addEventListener("focusin", aoFocarFora);
});

onBeforeUnmount(() => {
    document.removeEventListener("pointerdown", aoPressionarFora);
    document.removeEventListener("focusin", aoFocarFora);
});

/* ---------- Apresentação ---------- */

const formatadorRelativo = new Intl.RelativeTimeFormat("pt-BR", {
    numeric: "auto",
});

function tempoRelativo(iso: string) {
    const segundos = Math.round((new Date(iso).getTime() - Date.now()) / 1000);

    if (Math.abs(segundos) < 60) return "agora";

    const minutos = Math.round(segundos / 60);
    if (Math.abs(minutos) < 60) return formatadorRelativo.format(minutos, "minute");

    const horas = Math.round(minutos / 60);
    if (Math.abs(horas) < 24) return formatadorRelativo.format(horas, "hour");

    const dias = Math.round(horas / 24);
    if (Math.abs(dias) < 7) return formatadorRelativo.format(dias, "day");

    return new Date(iso)
        .toLocaleDateString("pt-BR", { day: "numeric", month: "short" })
        .replace(".", "");
}
</script>

<template>
    <div ref="raiz" class="relative" @keydown.esc="fechar(true)">
        <!-- Botão do header -->
        <button
            ref="botao"
            type="button"
            class="relative flex size-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            :class="aberto ? 'bg-white/15' : ''"
            :aria-expanded="aberto"
            aria-controls="painel-notificacoes"
            :aria-label="rotuloBotao"
            @click="alternar"
        >
            <Bell :size="24" aria-hidden="true" />

            <!-- Ajuste o ring para a cor exata do seu header -->
            <span
                v-if="naoLidas"
                class="absolute right-1 top-1 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-yellow-400 px-1 text-[0.6875rem] font-bold leading-none text-emerald-950 ring-2 ring-[#007a55]"
                aria-hidden="true"
            >
                {{ textoBadge }}
            </span>
        </button>

        <!-- Painel expansível -->
        <Transition
            enter-active-class="transition duration-150 ease-out motion-reduce:transition-none"
            enter-from-class="scale-y-75 opacity-0"
            leave-active-class="transition duration-100 ease-in motion-reduce:transition-none"
            leave-to-class="scale-y-75 opacity-0"
        >
            <div
                v-if="aberto"
                id="painel-notificacoes"
                role="region"
                aria-label="Notificações"
                class="fixed inset-x-3 top-[4.25rem] z-50 origin-top overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-3 sm:w-96 sm:origin-top-right"
            >
                <!-- Cabeçalho do painel -->
                <div
                    class="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4"
                >
                    <div class="min-w-0">
                        <h2 class="text-base font-bold text-slate-900">Notificações</h2>
                        <p class="text-xs text-slate-500">{{ resumo }}</p>
                    </div>

                    <button
                        type="button"
                        :disabled="!naoLidas"
                        class="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40 disabled:pointer-events-none disabled:opacity-40"
                        @click="marcarTodasComoLidas"
                    >
                        <CheckCheck class="size-4" aria-hidden="true" />
                        Marcar como lidas
                    </button>
                </div>

                <!-- Lista -->
                <ul
                    v-if="notificacoes.length"
                    class="max-h-[min(24rem,60vh)] divide-y divide-slate-100 overflow-y-auto overscroll-contain"
                >
                    <li v-for="notificacao in notificacoes" :key="notificacao.id">
                        <button
                            type="button"
                            class="flex w-full items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-slate-50 focus:outline-none focus-visible:bg-slate-50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-600/40"
                            :class="notificacao.lida ? '' : 'bg-emerald-50/40'"
                            @click="abrir(notificacao)"
                        >
                            <span
                                class="flex size-10 shrink-0 items-center justify-center rounded-full"
                                :class="tipos[notificacao.tipo].fundo"
                            >
                                <component
                                    :is="tipos[notificacao.tipo].icone"
                                    class="size-5"
                                    aria-hidden="true"
                                />
                            </span>

                            <span class="min-w-0 flex-1">
                                <span
                                    class="block text-sm text-slate-900"
                                    :class="notificacao.lida ? 'font-medium' : 'font-bold'"
                                >
                                    {{ notificacao.titulo }}
                                </span>
                                <span
                                    v-if="notificacao.descricao"
                                    class="mt-0.5 line-clamp-2 block text-sm text-slate-500"
                                >
                                    {{ notificacao.descricao }}
                                </span>
                                <span class="mt-1 block text-xs text-slate-400">
                                    {{ tempoRelativo(notificacao.criadaEm) }}
                                </span>
                            </span>

                            <span
                                v-if="!notificacao.lida"
                                class="mt-1.5 size-2.5 shrink-0 rounded-full bg-emerald-600"
                            >
                                <span class="sr-only">Não lida</span>
                            </span>
                        </button>
                    </li>
                </ul>

                <!-- Estado vazio -->
                <div v-else class="px-6 py-10 text-center">
                    <span
                        class="mx-auto flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400"
                    >
                        <BellOff class="size-6" aria-hidden="true" />
                    </span>
                    <h3 class="mt-3 font-semibold text-slate-900">Tudo em dia</h3>
                    <p class="mt-1 text-sm text-slate-500">
                        Você não tem notificações por enquanto.
                    </p>
                </div>
            </div>
        </Transition>
    </div>
</template>