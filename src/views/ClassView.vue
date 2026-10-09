<script setup lang="ts">
    import { computed, ref } from 'vue'
    import { RouterLink, useRoute } from 'vue-router'
    import {
        ArrowLeft,
        CalendarClock,
        CheckCircle2,
        Clock,
        ClipboardList,
        FileText,
        MapPin,
        PenLine,
        UserRound,
        Users,
        Share2
    } from 'lucide-vue-next'
    import type { Turma } from '@/types/interfaces/class'
    import type { TipoAtividade } from '@/types/interfaces/activities'
    import { turmasMock as tmMock } from '@/templates/classes'
    import CompartilharTurmaModal from '@/components/modals/CompartilharTurmaModal.vue'


    const compartilhando = ref(false)

    const turmasMock = tmMock as Turma[]

    const route = useRoute()

    // TODO: substituir por busca na API (ex.: GET /turmas/:id)
    

    const turma = computed(() =>
    turmasMock.find((t) => t.id === route.params.id),
    )

    /* ---------- Filtros ---------- */

    type Filtro = 'todas' | TipoAtividade

    const filtros: { valor: Filtro; rotulo: string }[] = [
    { valor: 'todas', rotulo: 'Todas' },
    { valor: 'avaliacao', rotulo: 'Avaliações' },
    { valor: 'trabalho', rotulo: 'Trabalhos' },
    { valor: 'atividade', rotulo: 'Atividades' },
    ]

    const filtroAtivo = ref<Filtro>('todas')

    const atividadesFiltradas = computed(() => {
    const lista = turma.value?.atividades ?? []
    return lista
        .filter((a) => filtroAtivo.value === 'todas' || a.tipo === filtroAtivo.value)
        .sort((a, b) => new Date(a.prazo).getTime() - new Date(b.prazo).getTime())
    })

    const proximas = computed(() =>
    atividadesFiltradas.value.filter((a) => !a.concluida),
    )

    const anteriores = computed(() =>
    atividadesFiltradas.value.filter((a) => a.concluida).reverse(),
    )

    const totalPendentes = computed(
    () => turma.value?.atividades.filter((a) => !a.concluida).length ?? 0,
    )

    const subtituloAtividades = computed(() => {
    const n = totalPendentes.value
    if (!n) return 'Nenhuma atividade pendente.'
    return n === 1 ? '1 atividade pendente.' : `${n} atividades pendentes.`
    })

    /* ---------- Apresentação ---------- */

    const tipos: Record<TipoAtividade, { rotulo: string; icone: typeof FileText; classe: string }> = {
        avaliacao: {
            rotulo: 'Avaliação',
            icone: PenLine,
            classe: 'bg-rose-50 text-rose-700',
        },
        trabalho: {
            rotulo: 'Trabalho',
            icone: FileText,
            classe: 'bg-amber-50 text-amber-700',
        },
        atividade: {
            rotulo: 'Atividade',
            icone: ClipboardList,
            classe: 'bg-sky-50 text-sky-700',
        },
    }

    const formatoData = new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    })

    function formatarPrazo(iso: string) {
    return formatoData.format(new Date(iso)).replace('.', '')
    }

    function prazoRelativo(iso: string) {
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const alvo = new Date(iso)
    alvo.setHours(0, 0, 0, 0)

    const dias = Math.round((alvo.getTime() - hoje.getTime()) / 86_400_000)

    if (dias < 0) return { texto: 'Prazo vencido', urgente: true }
    if (dias === 0) return { texto: 'Hoje', urgente: true }
    if (dias === 1) return { texto: 'Amanhã', urgente: true }
    return { texto: `Em ${dias} dias`, urgente: dias <= 3 }
    }
</script>

<template>
  <main class="min-h-screen bg-slate-50">
    <div class="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <RouterLink
        to="/my-classes"
        class="inline-flex items-center gap-2 rounded-full text-sm font-semibold text-slate-500 transition-colors hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
      >
        <ArrowLeft class="size-4" aria-hidden="true" />
        Voltar para turmas
      </RouterLink>

      <!-- Turma não encontrada -->
      <div
        v-if="!turma"
        class="mt-6 rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm"
      >
        <h1 class="text-lg font-semibold text-slate-900">Turma não encontrada</h1>
        <p class="mt-1 text-sm text-slate-500">
          Ela pode ter sido removida ou você não tem acesso a ela.
        </p>
        <RouterLink
          to="/my-classes"
          class="mt-5 inline-block rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
        >
          Ver minhas turmas
        </RouterLink>
      </div>

      <template v-else>
        <!-- Cabeçalho da turma -->
        <header class="mt-6">
          <h1 class="text-3xl font-bold tracking-tight text-slate-900">
            {{ turma.disciplina }}
          </h1>
          <p class="mt-1 text-slate-500">{{ turma.codigo }}</p>
        </header>

        <section
          class="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          aria-label="Informações da turma"
        >
          <dl class="grid grid-cols-1 gap-4 text-sm text-slate-600 sm:grid-cols-2">
            <div class="flex items-center gap-2.5">
              <dt class="sr-only">Professor</dt>
              <UserRound class="size-4 shrink-0 text-slate-400" aria-hidden="true" />
              <dd>{{ turma.professor }}</dd>
            </div>
            <div class="flex items-center gap-2.5">
              <dt class="sr-only">Horário</dt>
              <Clock class="size-4 shrink-0 text-slate-400" aria-hidden="true" />
              <dd>{{ turma.horario }}</dd>
            </div>
            <div class="flex items-center gap-2.5">
              <dt class="sr-only">Sala</dt>
              <MapPin class="size-4 shrink-0 text-slate-400" aria-hidden="true" />
              <dd>{{ turma.sala }}</dd>
            </div>
            <div class="flex items-center gap-2.5">
              <dt class="sr-only">Alunos</dt>
              <Users class="size-4 shrink-0 text-slate-400" aria-hidden="true" />
              <dd>{{ turma.totalAlunos }} alunos</dd>
            </div>
          </dl>

          <div class="mt-6 flex items-center gap-2">
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
              @click="compartilhando = true"
            >
              <Share2 class="size-4" aria-hidden="true" />
              Compartilhar
            </button>
          </div>
        </section>

        <!-- Atividades -->
        <section class="mt-10">
          <div class="flex items-center gap-2">
            <CalendarClock class="size-5 text-emerald-700" aria-hidden="true" />
            <h2 class="text-lg font-bold text-slate-900">Atividades da turma</h2>
          </div>
          <p class="mt-1 text-sm text-slate-500">{{ subtituloAtividades }}</p>

          <div
            v-if="turma.atividades.length"
            class="mt-4 flex flex-wrap gap-2"
            role="group"
            aria-label="Filtrar por tipo"
          >
            <button
              v-for="filtro in filtros"
              :key="filtro.valor"
              type="button"
              :aria-pressed="filtroAtivo === filtro.valor"
              class="rounded-full px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
              :class="
                filtroAtivo === filtro.valor
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
              "
              @click="filtroAtivo = filtro.valor"
            >
              {{ filtro.rotulo }}
            </button>
          </div>

          <!-- Turma sem nenhuma atividade -->
          <div
            v-if="!turma.atividades.length"
            class="mt-4 rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm"
          >
            <h3 class="text-lg font-semibold text-slate-900">Agenda livre</h3>
            <p class="mt-1 text-sm text-slate-500">
              Quando o professor publicar avaliações, trabalhos ou atividades, eles aparecerão aqui.
            </p>
          </div>

          <!-- Filtro sem resultados -->
          <div
            v-else-if="!atividadesFiltradas.length"
            class="mt-4 rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm"
          >
            <h3 class="text-lg font-semibold text-slate-900">
              Nada neste filtro
            </h3>
            <p class="mt-1 text-sm text-slate-500">
              Esta turma não tem atividades desse tipo.
            </p>
            <button
              type="button"
              class="mt-5 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
              @click="filtroAtivo = 'todas'"
            >
              Ver todas
            </button>
          </div>

          <template v-else>
            <!-- Próximas -->
            <div v-if="proximas.length" class="mt-6">
              <h3 class="mb-3 text-sm font-semibold text-slate-500">A fazer</h3>
              <ul class="space-y-3">
                <li
                  v-for="atividade in proximas"
                  :key="atividade.id"
                  class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div class="min-w-0">
                      <span
                        class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                        :class="tipos[atividade.tipo].classe"
                      >
                        <component
                          :is="tipos[atividade.tipo].icone"
                          class="size-3.5"
                          aria-hidden="true"
                        />
                        {{ tipos[atividade.tipo].rotulo }}
                      </span>

                      <h4 class="mt-2 text-base font-bold text-slate-900">
                        {{ atividade.titulo }}
                      </h4>
                      <p
                        v-if="atividade.descricao"
                        class="mt-1 max-w-prose text-sm text-slate-500"
                      >
                        {{ atividade.descricao }}
                      </p>
                    </div>

                    <div class="shrink-0 text-sm sm:text-right">
                      <p
                        class="font-semibold"
                        :class="
                          prazoRelativo(atividade.prazo).urgente
                            ? 'text-rose-600'
                            : 'text-emerald-700'
                        "
                      >
                        {{ prazoRelativo(atividade.prazo).texto }}
                      </p>
                      <p class="mt-0.5 text-slate-500">
                        {{ formatarPrazo(atividade.prazo) }}
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Concluídas -->
            <div v-if="anteriores.length" class="mt-8">
              <h3 class="mb-3 text-sm font-semibold text-slate-500">Concluídas</h3>
              <ul class="space-y-3">
                <li
                  v-for="atividade in anteriores"
                  :key="atividade.id"
                  class="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white/70 p-5"
                >
                  <CheckCircle2
                    class="size-5 shrink-0 text-emerald-600"
                    aria-hidden="true"
                  />
                  <div class="min-w-0 flex-1">
                    <h4 class="truncate text-sm font-semibold text-slate-700">
                      {{ atividade.titulo }}
                    </h4>
                    <p class="text-xs text-slate-500">
                      {{ tipos[atividade.tipo].rotulo }} ·
                      {{ formatarPrazo(atividade.prazo) }}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </template>
        </section>
      </template>
    </div>
    <CompartilharTurmaModal v-if="turma" v-model:open="compartilhando" :turma="turma" />
  </main>
</template>