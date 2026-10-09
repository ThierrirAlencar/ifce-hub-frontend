<script setup lang="ts">
    import {
        Github,
        ScrollText
    } from "lucide-vue-next";
</script>

<template>
    <footer
        class="flex items-center justify-between bg-emerald-800 px-6 py-4 text-white transition-colors duration-200 dark:bg-emerald-950"
    >
        <div class="flex items-center gap-3">
            <p class="text-sm">
                &copy; 2026 SystemNineOne. Todos os direitos reservados.
            </p>
        </div>

        <div class="flex gap-8 items-center">
            <a href="https://github.com/ThierrirAlencar" target="_blank" rel="noopener noreferrer" alt="Repositório do projeto no GitHub">
                <Github class="w-6 h-6" />
            </a>
            <!-- Atualizar para o link de Docs da api no futuro -->
            <a href="" target="_blank" rel="noopener noreferrer" alt="Documentação do projeto">
                <ScrollText class="w-6 h-6" />
            </a>
        </div>
    </footer>
</template>