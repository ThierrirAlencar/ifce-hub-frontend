<script setup lang="ts">

</script>

<template>
    <footer
        class="bg-emerald-800 text-white px-6 py-4 flex justify-between items-center"
    >
        <div class="flex items-center gap-3">
            <p class="text-sm">
                &copy; 2024 IFCE Hub. Todos os direitos reservados.
            </p>
        </div>

        <div class="flex gap-8 items-center">
            <RouterLink to="/" alt="home">
                <Home :size="24" />
            </RouterLink>

            <RouterLink to="/my-classes" alt="minhas turmas">
                <Orbit :size="24" />
            </RouterLink>

            <RouterLink to="/login" alt="login">
                <User :size="24" />
            </RouterLink>

            <RouterLink to="/classes" alt="classes">
                <BadgeQuestionMark :size="24" />
            </RouterLink>
        </div>
    </footer>
</template>