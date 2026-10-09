<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import {
    Check,
    Copy,
    Mail,
    MessageCircle,
    Share2,
    X,
} from "lucide-vue-next";
import type { Turma } from "@/types/interfaces/class";

const props = defineProps<{
    turma: Turma;
    /** Link de convite vindo da API. Se omitido, é montado a partir do código da turma. */
    linkConvite?: string;
}>();

// Requer Vue 3.4+ (defineModel). Uso: <CompartilharTurmaModal v-model:open="aberto" />
const aberto = defineModel<boolean>("open", { default: false });

const painel = ref<HTMLElement | null>(null);
const campoLink = ref<HTMLInputElement | null>(null);
let elementoAnterior: HTMLElement | null = null;

/* ---------- Conteúdo compartilhado ---------- */

// TODO: ajustar a rota de convite para a que existir no backend
const link = computed(
    () =>
        props.linkConvite ??
        `${window.location.origin}/turmas/entrar/${encodeURIComponent(props.turma.codigo)}`,
);

const mensagem = computed(
    () =>
        `Entre na turma ${props.turma.disciplina} (${props.turma.codigo}) pelo IFCE Hub: ${link.value}`,
);

const urlWhatsapp = computed(
    () => `https://wa.me/?text=${encodeURIComponent(mensagem.value)}`,
);

const urlEmail = computed(
    () =>
        `mailto:?subject=${encodeURIComponent(`Convite para a turma ${props.turma.disciplina}`)}` +
        `&body=${encodeURIComponent(mensagem.value)}`,
);

const podeCompartilharNativo =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

/* ---------- Copiar ---------- */

type Alvo = "link" | "codigo";

const copiado = ref<Alvo | null>(null);
const erroCopia = ref(false);
let temporizador: ReturnType<typeof setTimeout> | undefined;

function copiarComFallback(texto: string) {
    const area = document.createElement("textarea");
    area.value = texto;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();

    try {
        return document.execCommand("copy");
    } finally {
        document.body.removeChild(area);
    }
}

async function copiar(texto: string, alvo: Alvo) {
    erroCopia.value = false;

    let ok = false;
    try {
        await navigator.clipboard.writeText(texto);
        ok = true;
    } catch {
        ok = copiarComFallback(texto);
    }

    if (!ok) {
        erroCopia.value = true;
        copiado.value = null;
        return;
    }

    copiado.value = alvo;
    clearTimeout(temporizador);
    temporizador = setTimeout(() => (copiado.value = null), 2000);
}

async function compartilharNativo() {
    try {
        await navigator.share({
            title: `Turma ${props.turma.disciplina}`,
            text: mensagem.value,
            url: link.value,
        });
    } catch {
        // O usuário cancelou o compartilhamento: nada a fazer
    }
}

const avisoLeitorTela = computed(() => {
    if (erroCopia.value) return "Não foi possível copiar.";
    if (copiado.value === "link") return "Link copiado.";
    if (copiado.value === "codigo") return "Código copiado.";
    return "";
});

/* ---------- Abrir, fechar e acessibilidade ---------- */

function fechar() {
    aberto.value = false;
}

function aoTeclar(evento: KeyboardEvent) {
    if (evento.key === "Escape") {
        evento.stopPropagation();
        fechar();
        return;
    }

    if (evento.key !== "Tab" || !painel.value) return;

    // Mantém o foco dentro do modal
    const focaveis = painel.value.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled])',
    );
    if (!focaveis.length) return;

    const primeiro = focaveis[0];
    const ultimo = focaveis[focaveis.length - 1];

    if (evento.shiftKey && document.activeElement === primeiro) {
        evento.preventDefault();
        if(ultimo){
            ultimo.focus();
        }   
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        if(primeiro){
            primeiro.focus();
        }
    }
}

watch(aberto, async (valor) => {
    if (valor) {
        elementoAnterior = document.activeElement as HTMLElement | null;
        document.body.style.overflow = "hidden";
        copiado.value = null;
        erroCopia.value = false;

        await nextTick();
        campoLink.value?.focus();
        campoLink.value?.select();
    } else {
        document.body.style.overflow = "";
        elementoAnterior?.focus();
    }
});

onBeforeUnmount(() => {
    clearTimeout(temporizador);
    document.body.style.overflow = "";
});
</script>

<template>
    <Teleport to="body">
        <Transition
            enter-active-class="transition-opacity duration-150 motion-reduce:transition-none"
            enter-from-class="opacity-0"
            leave-active-class="transition-opacity duration-100 motion-reduce:transition-none"
            leave-to-class="opacity-0"
        >
            <div
                v-if="aberto"
                class="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
                @keydown="aoTeclar"
            >
                <!-- Fundo -->
                <div
                    class="absolute inset-0 bg-slate-900/50"
                    aria-hidden="true"
                    @click="fechar"
                />

                <!-- Painel -->
                <div
                    ref="painel"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="compartilhar-turma-titulo"
                    aria-describedby="compartilhar-turma-descricao"
                    class="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-xl"
                >
                    <div class="flex items-start justify-between gap-4">
                        <div class="min-w-0">
                            <h2
                                id="compartilhar-turma-titulo"
                                class="text-xl font-bold text-slate-900"
                            >
                                Compartilhar turma
                            </h2>
                            <p
                                id="compartilhar-turma-descricao"
                                class="mt-1 truncate text-sm text-slate-500"
                            >
                                {{ turma.disciplina }} · {{ turma.codigo }}
                            </p>
                        </div>

                        <button
                            type="button"
                            class="-mr-2 -mt-2 flex size-10 shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
                            aria-label="Fechar"
                            @click="fechar"
                        >
                            <X :size="20" />
                        </button>
                    </div>

                    <!-- Link de convite -->
                    <div class="mt-6">
                        <label
                            for="compartilhar-turma-link"
                            class="text-sm font-semibold text-slate-700"
                        >
                            Link de convite
                        </label>

                        <div class="mt-2 flex items-center gap-2">
                            <input
                                id="compartilhar-turma-link"
                                ref="campoLink"
                                type="text"
                                readonly
                                :value="link"
                                class="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                                @focus="($event.target as HTMLInputElement).select()"
                            />

                            <button
                                type="button"
                                class="inline-flex w-28 shrink-0 items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
                                @click="copiar(link, 'link')"
                            >
                                <component
                                    :is="copiado === 'link' ? Check : Copy"
                                    class="size-4"
                                    aria-hidden="true"
                                />
                                {{ copiado === "link" ? "Copiado" : "Copiar" }}
                            </button>
                        </div>

                        <p v-if="erroCopia" class="mt-2 text-sm text-rose-600">
                            Não foi possível copiar. Selecione o link e copie manualmente.
                        </p>
                    </div>

                    <!-- Código da turma -->
                    <div class="mt-5">
                        <p class="text-sm font-semibold text-slate-700">Código da turma</p>

                        <div
                            class="mt-2 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 px-4 py-2.5"
                        >
                            <span class="font-mono text-base font-semibold tracking-wide text-slate-900">
                                {{ turma.codigo }}
                            </span>

                            <button
                                type="button"
                                class="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
                                @click="copiar(turma.codigo, 'codigo')"
                            >
                                <component
                                    :is="copiado === 'codigo' ? Check : Copy"
                                    class="size-4"
                                    aria-hidden="true"
                                />
                                {{ copiado === "codigo" ? "Copiado" : "Copiar" }}
                            </button>
                        </div>
                    </div>

                    <!-- Enviar por... -->
                    <div class="mt-6 border-t border-slate-100 pt-5">
                        <p class="text-sm font-semibold text-slate-700">Enviar por</p>

                        <div class="mt-3 grid grid-cols-2 gap-2">
                            <a
                                :href="urlWhatsapp"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-600/40 hover:bg-emerald-50/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
                            >
                                <MessageCircle class="size-4 text-emerald-700" aria-hidden="true" />
                                WhatsApp
                            </a>

                            <a
                                :href="urlEmail"
                                class="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-600/40 hover:bg-emerald-50/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
                            >
                                <Mail class="size-4 text-emerald-700" aria-hidden="true" />
                                E-mail
                            </a>

                            <button
                                v-if="podeCompartilharNativo"
                                type="button"
                                class="col-span-2 flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-600/40 hover:bg-emerald-50/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
                                @click="compartilharNativo"
                            >
                                <Share2 class="size-4 text-emerald-700" aria-hidden="true" />
                                Mais opções
                            </button>
                        </div>
                    </div>

                    <!-- Avisos para leitores de tela -->
                    <p class="sr-only" role="status" aria-live="polite">
                        {{ avisoLeitorTela }}
                    </p>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>