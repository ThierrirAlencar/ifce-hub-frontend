
<script setup lang="ts">
    import {
        User,
        Question,
        CalendarClock,
        ObjectsColumn,
    } from "@primeicons/vue";
</script>

<template>
    <header
        class="bg-emerald-700 text-white px-6 py-4 flex justify-between items-center"
    >
        <div class="flex items-center gap-3">
            <CalendarClock :size="27" />

            <h1 class="text-2xl font-bold">
                <strong class="text-amber-300">IF</strong>CE Hub
            </h1>
        </div>

        <div class="flex gap-8 items-center">
            <RouterLink to="/faq">
                <ObjectsColumn :size="24" />
            </RouterLink>

            <RouterLink to="/login">
                <User :size="24" />
            </RouterLink>

            <RouterLink to="/classes">
                <Question :size="24" />
            </RouterLink>
        </div>
    </header>
</template>