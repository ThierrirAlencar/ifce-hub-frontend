<script setup lang="ts">
    import { computed, ref } from 'vue'
    import { RouterLink } from 'vue-router'
    import {
        BookOpen,
        Clock,
        MapPin,
        Search,
        UserRound,
        Users,
        ChevronRight,
        CalendarClock,
    } from 'lucide-vue-next'
    import { turmasMock } from '@/templates/classes'
import type { Turma } from '@/types/interfaces/class'

    type StatusTurma = 'em_andamento' | 'encerrada'

    // TODO: substituir por dados da API (ex.: useTurmas() / store)

    const turmas = ref<Turma[]>(turmasMock)

    type Filtro = 'todas' | StatusTurma

    const rotulosStatus: Record<StatusTurma, string> = {
    em_andamento: 'Em andamento',
    encerrada: 'Encerradas',
    }

    const filtros = computed<{ valor: Filtro; rotulo: string }[]>(() => [
    { valor: 'todas', rotulo: 'Todas' },
    ...(['em_andamento', 'encerrada'] as const)
        .filter((status) => turmas.value.some((turma) => turma.status === status))
        .map((status) => ({ valor: status, rotulo: rotulosStatus[status] })),
    ])

    const filtroAtivo = ref<Filtro>('todas')
    const busca = ref('')

    const turmasFiltradas = computed(() => {
    const termo = busca.value.trim().toLowerCase()

    return turmas.value.filter((turma) => {
        const passaFiltro =
        filtroAtivo.value === 'todas' || turma.status === filtroAtivo.value

        const passaBusca =
        !termo ||
        [turma.disciplina, turma.codigo, turma.professor].some((campo) =>
            campo.toLowerCase().includes(termo),
        )

        return passaFiltro && passaBusca
    })
    })

    const totalEmAndamento = computed(
    () => turmas.value.filter((t) => t.status === 'em_andamento').length,
    )

    const subtitulo = computed(() => {
    if (!turmas.value.length) return 'Nenhuma turma por enquanto.'
    if (turmas.value.some((turma) => !turma.status)) {
        const n = turmas.value.length
        return n === 1 ? '1 turma cadastrada.' : `${n} turmas cadastradas.`
    }
    const n = totalEmAndamento.value
    return n === 1 ? '1 turma em andamento.' : `${n} turmas em andamento.`
    })

    const formatoDataAtividade = new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'short',
    })

    function proximaAtividade(turma: Turma) {
    const atividade = turma.atividades
        .filter((item) => !item.concluida)
        .sort((a, b) => new Date(a.prazo).getTime() - new Date(b.prazo).getTime())[0]

    if (!atividade) return null

    return {
        titulo: atividade.titulo,
        data: formatoDataAtividade.format(new Date(atividade.prazo)).replace('.', ''),
    }
    }

    function limparFiltros() {
    busca.value = ''
    filtroAtivo.value = 'todas'
    }
</script>

<template>
  <main class="min-h-screen bg-slate-50">
    <div class="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <!-- Cabeçalho da página -->
      <header>
        <h1 class="text-3xl font-bold tracking-tight text-slate-900">
          Suas turmas
        </h1>
        <p class="mt-1 text-slate-500">{{ subtitulo }}</p>
      </header>

      <!-- Busca e filtros -->
      <section
        v-if="turmas.length"
        class="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <label class="relative block w-full sm:max-w-xs">
          <span class="sr-only">Buscar turma</span>
          <Search
            class="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            v-model="busca"
            type="search"
            placeholder="Buscar por disciplina ou professor"
            class="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
          />
        </label>

        <div
          v-if="filtros.length > 1"
          class="flex flex-wrap gap-2"
          role="group"
          aria-label="Filtrar por situação"
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
      </section>

      <!-- Lista de turmas -->
      <section class="mt-8">
        <div class="mb-4 flex items-center gap-2">
          <BookOpen class="size-5 text-emerald-700" aria-hidden="true" />
          <h2 class="text-lg font-bold text-slate-900">Turmas</h2>
        </div>

        <ul
          v-if="turmasFiltradas.length"
          class="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <li v-for="turma in turmasFiltradas" :key="turma.id">
            <RouterLink
              :to="`/turmas/${turma.id}`"
              class="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors hover:border-emerald-600/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <h3 class="truncate text-lg font-bold text-slate-900">
                    {{ turma.disciplina }}
                  </h3>
                  <p class="mt-0.5 text-sm text-slate-500">{{ turma.codigo }}</p>
                </div>

                <span
                  v-if="turma.status"
                  class="shrink-0 rounded-full px-3 py-1 text-xs font-semibold"
                  :class="
                    turma.status === 'em_andamento'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-slate-100 text-slate-500'
                  "
                >
                  {{ rotulosStatus[turma.status] }}
                </span>
              </div>

              <dl class="mt-5 space-y-2.5 text-sm text-slate-600">
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

              <div
                class="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4"
              >
                <p
                  v-if="proximaAtividade(turma)"
                  class="flex min-w-0 items-center gap-2 text-sm text-slate-600"
                >
                  <CalendarClock
                    class="size-4 shrink-0 text-emerald-700"
                    aria-hidden="true"
                  />
                  <span class="truncate">
                    {{ proximaAtividade(turma)?.titulo }}
                    <span class="font-semibold text-slate-900">
                      · {{ proximaAtividade(turma)?.data }}
                    </span>
                  </span>
                </p>
                <p v-else class="text-sm text-slate-400">Sem atividades à vista</p>

                <ChevronRight
                  class="size-5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-emerald-700"
                  aria-hidden="true"
                />
              </div>
            </RouterLink>
          </li>
        </ul>

        <!-- Estado vazio -->
        <div
          v-else
          class="rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm"
        >
          <template v-if="turmas.length">
            <h3 class="text-lg font-semibold text-slate-900">
              Nenhuma turma encontrada
            </h3>
            <p class="mt-1 text-sm text-slate-500">
              Tente outro termo de busca ou mude o filtro.
            </p>
            <button
              type="button"
              class="mt-5 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
              @click="limparFiltros"
            >
              Limpar filtros
            </button>
          </template>
          <template v-else>
            <h3 class="text-lg font-semibold text-slate-900">Sem turmas por aqui</h3>
            <p class="mt-1 text-sm text-slate-500">
              Quando você for adicionado a uma turma, ela aparecerá aqui.
            </p>
          </template>
        </div>
      </section>
    </div>
  </main>
</template>