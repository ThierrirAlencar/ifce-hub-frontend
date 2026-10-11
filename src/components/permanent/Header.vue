<script setup lang="ts">
import { ref, watch, type Component } from "vue";
import { useRoute } from "vue-router";
import {
  User,
  BadgeQuestionMark,
  CalendarClock,
  Home,
  School,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-vue-next";

import { useTheme } from "../../composables/useTheme";
import NotificacoesDropdown from "../dropdown/NotificacoesDropdown.vue";

const route = useRoute();
const { theme, toggleTheme } = useTheme();

const isMobileMenuOpen = ref(false);

const navigationItems: Record<
  string,
  {
    to: string;
    label: string;
    icon: Component;
    activeColor: string;
    underlineColor: string;
  }
> = {
  home: {
    to: "/",
    label: "Início",
    icon: Home,
    activeColor: "text-amber-300",
    underlineColor: "bg-amber-400",
  },
  classes: {
    to: "/minhas-turmas",
    label: "Minhas turmas",
    icon: School,
    activeColor: "text-sky-300",
    underlineColor: "bg-sky-400",
  },
  profile: {
    to: "/profile",
    label: "Perfil de Usuário",
    icon: User,
    activeColor: "text-red-300",
    underlineColor: "bg-red-400",
  },
  faq: {
    to: "/perguntas-frequentes",
    label: "Perguntas frequentes",
    icon: BadgeQuestionMark,
    activeColor: "text-green-300",
    underlineColor: "bg-green-400",
  },
};

// Fecha o menu após navegar para outra rota.
watch(
  () => route.fullPath,
  () => {
    isMobileMenuOpen.value = false;
  }
);
</script>

<template>
  <header
    class="relative z-50 bg-emerald-700 text-white
           transition-colors duration-200 dark:bg-emerald-950"
  >
    <!-- Barra principal -->
    <div
      class="mx-auto flex min-h-16 w-full items-center
             justify-between gap-3 px-4 py-3
             sm:px-6 md:min-h-20 md:px-8"
    >
      <!-- Logo -->
      <div class="flex min-w-0 flex-1 items-center md:w-1/3">
        <RouterLink
          to="/"
          class="flex min-w-0 items-center gap-2
                 rounded-md focus-visible:outline-none
                 focus-visible:ring-2 focus-visible:ring-amber-300
                 sm:gap-3"
          aria-label="IFCE Hub — página inicial"
        >
          <CalendarClock
            :size="25"
            class="shrink-0 sm:h-7 sm:w-7"
            aria-hidden="true"
          />

          <h1
            class="whitespace-nowrap text-lg font-bold
                   sm:text-xl md:text-2xl"
          >
            <strong class="text-amber-300">IF</strong>CE Hub
          </h1>
        </RouterLink>
      </div>

      <!-- Navegação desktop -->
      <nav
        class="hidden w-1/3 items-center justify-center gap-6
               lg:gap-8 md:flex"
        aria-label="Navegação principal"
      >
        <RouterLink
          v-for="item in navigationItems"
          :key="item.to"
          :to="item.to"
          :aria-label="item.label"
          :aria-current="route.path === item.to ? 'page' : undefined"
          class="group flex flex-col items-center gap-1
                 rounded-md px-1 py-2
                 focus-visible:outline-none
                 focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          <component
            :is="item.icon"
            :size="23"
            :class="[
              'transition-colors duration-200',
              route.path === item.to
                ? item.activeColor
                : 'text-white group-hover:text-amber-200',
            ]"
            aria-hidden="true"
          />

          <span
            :class="[
              'h-0.5 w-5 rounded-full transition-colors',
              route.path === item.to
                ? item.underlineColor
                : 'bg-transparent',
            ]"
            aria-hidden="true"
          />
        </RouterLink>
      </nav>

      <!-- Ações -->
      <div
        class="flex shrink-0 items-center justify-end gap-2
               sm:gap-3 md:w-1/3 md:gap-4"
        aria-label="Ações do usuário"
      >
        <!-- Tema -->
        <button
          type="button"
          class="inline-flex size-10 items-center justify-center
                 rounded-full transition-colors
                 hover:bg-white/10 hover:text-amber-300
                 focus-visible:outline-none
                 focus-visible:ring-2 {{ theme === 'dark' ? 'focus-visible:ring-purple-300' : 'focus-visible:ring-amber-300' }}"
          :aria-label="
            theme === 'dark'
              ? 'Ativar tema claro'
              : 'Ativar tema escuro'
          "
          :aria-pressed="theme === 'dark'"
          @click="toggleTheme"
        >
          <Sun
            v-if="theme === 'dark'"
            :size="21"
            aria-hidden="true"
          />
          <Moon
            v-else
            :size="21"
            aria-hidden="true"
          />
        </button>

        <!-- Notificações -->
        <div class="flex size-10 shrink-0 items-center justify-center">
          <NotificacoesDropdown />
        </div>

        <!-- Botão do menu mobile -->
        <button
          type="button"
          class="inline-flex size-10 items-center justify-center
                 rounded-full transition-colors
                 hover:bg-white/10 hover:text-amber-300
                 focus-visible:outline-none
                 focus-visible:ring-2 {{ theme === 'dark' ? 'focus-visible:ring-purple-300' : 'focus-visible:ring-amber-300' }}
                 md:hidden"
          :aria-label="
            isMobileMenuOpen
              ? 'Fechar menu de navegação'
              : 'Abrir menu de navegação'
          "
          :aria-expanded="isMobileMenuOpen"
          aria-controls="mobile-navigation"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <X v-if="isMobileMenuOpen" :size="24" aria-hidden="true" />
          <Menu v-else :size="24" aria-hidden="true" />
        </button>
      </div>
    </div>

    <!-- Navegação mobile -->
    <nav
      v-if="isMobileMenuOpen"
      id="mobile-navigation"
      class="border-t border-white/15 px-4 py-3
             shadow-lg md:hidden"
      aria-label="Navegação mobile"
    >
      <div class="mx-auto flex max-w-xl flex-col gap-1">
        <RouterLink
          v-for="item in navigationItems"
          :key="item.to"
          :to="item.to"
          :aria-current="route.path === item.to ? 'page' : undefined"
          class="flex min-h-12 items-center gap-3 rounded-lg
                 px-4 py-3 text-sm font-medium
                 transition-colors
                 hover:bg-white/10
                 focus-visible:outline-none
                 focus-visible:ring-2 {{ theme === 'dark' ? 
                  'focus-visible:ring-purple-300 hover:text-purple-300' 
                    : 
                  'focus-visible:ring-amber-300 hover:text-amber-300' 
                 }}"
          :class="
            route.path === item.to
              ? 'bg-white/10 ' + item.activeColor
              : 'text-white'
          "
        >
          <component
            :is="item.icon"
            :size="20"
            class="shrink-0"
            aria-hidden="true"
          />

          <span>{{ item.label }}</span>

          <span
            v-if="route.path === item.to"
            class="ml-auto size-2 rounded-full"
            :class="item.underlineColor"
            aria-hidden="true"
          />
        </RouterLink>
      </div>
    </nav>
  </header>
</template>

