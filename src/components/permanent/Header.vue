
<script setup lang="ts">
    import { useRoute } from "vue-router";
    import type { Component } from "vue";
    import { useTheme } from "../../composables/useTheme";
    import {
        User,
        BadgeQuestionMark,
        CalendarClock,
        Home,
        School,
        Sun,
        Moon,
    } from "lucide-vue-next";
    import NotificacoesDropdown from "../dropdown/NotificacoesDropdown.vue";

    const route = useRoute();
    const { theme, toggleTheme } = useTheme();

    const navigationItems: Record<
        string,
        { to: string; label: string; icon: Component; activeColor: string; underlineColor: string }
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
        login: {
            to: "/login",
            label: "Login",
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
</script>

<template>
    <header
        class="bg-emerald-700 px-6 py-4 text-white transition-colors duration-200 dark:bg-emerald-950 flex flex-row items-center justify-between"
    >
        <div class="flex items-center gap-3 w-1/3">
            
            <RouterLink to="/" class="flex items-center gap-3">
                <CalendarClock :size="27" />

                <h1 class="text-2xl font-bold">
                    <strong class="text-amber-300">IF</strong>CE Hub
                </h1>
            </RouterLink>

        </div>

        <nav class="flex items-center justify-center w-1/3 gap-8" aria-label="Navegação principal">
            <RouterLink
                v-for="item in navigationItems"
                :key="item.to"
                :to="item.to"
                :aria-label="item.label"
                :aria-current="route.path === item.to ? 'page' : undefined"
                class="group flex flex-col items-center gap-1"
            >
                <component
                    :is="item.icon"
                    :size="24"
                    class="transition-colors"
                    :class="route.path === item.to ? item.activeColor : 'text-white'"
                    aria-hidden="true"
                />
                <span
                    class="h-0.5 w-4 rounded-full transition-colors"
                    :class="route.path === item.to ? item.underlineColor : 'bg-transparent'"
                    aria-hidden="true"
                />
            </RouterLink>
        </nav>
        <div class="flex items-center justify-end w-1/3 gap-4" aria-label="Ações do usuário">
            <button
                type="button"
                class="cursor-pointer transition-colors hover:text-amber-300"
                :aria-label="theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'"
                :aria-pressed="theme === 'dark'"
                @click="toggleTheme"
            >
                <Sun v-if="theme === 'dark'" :size="24" aria-hidden="true" />
                <Moon v-else :size="24" aria-hidden="true" />
            </button>
            <NotificacoesDropdown></NotificacoesDropdown>
        </div>
    </header>
</template>