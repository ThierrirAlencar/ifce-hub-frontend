<script setup lang="ts">
import { computed, ref } from "vue";
import {
    User,
    Question,
    CalendarClock,
    ObjectsColumn,
    ChevronLeft,
    ChevronRight
} from "@primeicons/vue";

const selectedDate = ref(new Date());

const currentMonth = ref(
    new Date(
        selectedDate.value.getFullYear(),
        selectedDate.value.getMonth(),
        1
    )
);

const weekDays = [
    "DOM",
    "SEG",
    "TER",
    "QUA",
    "QUI",
    "SEX",
    "SÁB"
];

const monthName = computed(() => {
    return currentMonth.value.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric"
    });
});

const calendarDays = computed(() => {
    const year = currentMonth.value.getFullYear();
    const month = currentMonth.value.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Sunday = 0
    const startingDay = firstDay.getDay();

    const daysInMonth = lastDay.getDate();

    const previousMonthLastDay = new Date(year, month, 0).getDate();

    const days = [];

    // Previous month's days
    for (let i = startingDay - 1; i >= 0; i--) {
        days.push({
            date: previousMonthLastDay - i,
            monthOffset: -1
        });
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
        days.push({
            date: day,
            monthOffset: 0
        });
    }

    // Next month's days
    let nextDay = 1;

    while (days.length < 42) {
        days.push({
            date: nextDay++,
            monthOffset: 1
        });
    }

    return days;
});

function changeMonth(amount: number) {
    currentMonth.value = new Date(
        currentMonth.value.getFullYear(),
        currentMonth.value.getMonth() + amount,
        1
    );
}

function goToToday() {
    const today = new Date();

    selectedDate.value = today;

    currentMonth.value = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
    );
}

function selectDate(day: {
    date: number;
    monthOffset: number;
}) {
    const date = new Date(
        currentMonth.value.getFullYear(),
        currentMonth.value.getMonth() + day.monthOffset,
        day.date
    );

    selectedDate.value = date;

    // If the user clicks a day from another month,
    // move the calendar to that month.
    if (day.monthOffset !== 0) {
        currentMonth.value = new Date(
            date.getFullYear(),
            date.getMonth(),
            1
        );
    }
}

function isSelected(day: {
    date: number;
    monthOffset: number;
}) {
    const date = new Date(
        currentMonth.value.getFullYear(),
        currentMonth.value.getMonth() + day.monthOffset,
        day.date
    );

    return (
        date.getFullYear() === selectedDate.value.getFullYear() &&
        date.getMonth() === selectedDate.value.getMonth() &&
        date.getDate() === selectedDate.value.getDate()
    );
}

function isToday(day: {
    date: number;
    monthOffset: number;
}) {
    const today = new Date();

    const date = new Date(
        currentMonth.value.getFullYear(),
        currentMonth.value.getMonth() + day.monthOffset,
        day.date
    );

    return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
    );
}

function isOutsideMonth(day: {
    monthOffset: number;
}) {
    return day.monthOffset !== 0;
}
</script>

<template>


    <main
        class="bg-slate-50 min-h-screen px-6 py-12 flex flex-col items-center"
    >

        <!-- Page heading -->
        <section class="w-full max-w-5xl mb-10">
            <h1 class="text-4xl font-bold text-slate-800">
                Sua agenda
            </h1>

            <p class="text-gray-500 text-xl mt-2">
                Nenhum evento à vista por enquanto.
            </p>
        </section>


        <!-- Upcoming events -->
        <section class="w-full max-w-5xl mb-10">

            <div class="flex items-center gap-3 mb-4">
                <CalendarClock
                    :size="26"
                    color="#0d9488"
                />

                <h2 class="text-2xl font-bold text-slate-800">
                    Próximos na agenda
                </h2>
            </div>

            <div
                class="bg-white rounded-3xl border border-slate-200
                       p-8 text-center shadow-sm"
            >
                <h3 class="text-2xl font-semibold text-slate-800">
                    Agenda livre
                </h3>

                <p class="text-gray-500 mt-2">
                    Quando a turma tiver avaliações, trabalhos ou
                    atividades, eles aparecerão aqui.
                </p>
            </div>

        </section>


        <!-- Calendar -->
        <section class="w-full max-w-5xl">

            <div
                class="bg-white rounded-3xl border border-slate-200
                       shadow-sm overflow-hidden"
            >

                <!-- Calendar header -->
                <div
                    class="px-8 py-6 flex items-center
                           justify-between border-b border-slate-100"
                >

                    <!-- Previous month -->
                    <button
                        @click="changeMonth(-1)"
                        class="w-11 h-11 rounded-full
                               flex items-center justify-center
                               text-slate-500
                               hover:bg-slate-100
                               hover:text-emerald-700
                               transition"
                        aria-label="Mês anterior"
                    >
                        <ChevronLeft :size="22" />
                    </button>


                    <!-- Month -->
                    <div class="text-center">

                        <h2
                            class="text-2xl font-bold
                                
                                   text-slate-800 capitalize"
                        >
                            {{ monthName }}
                        </h2>

                    </div>


                    <!-- Next month -->
                    <button
                        @click="changeMonth(1)"
                        class="w-11 h-11 rounded-full
                               flex items-center justify-center
                               text-slate-500
                               hover:bg-slate-100
                               hover:text-emerald-700
                               transition"
                        aria-label="Próximo mês"
                    >
                        <ChevronRight :size="22" />
                    </button>

                </div>


                <!-- Calendar body -->
                <div class="px-8 pt-6 pb-8">

                    <!-- Weekdays -->
                    <div
                        class="grid grid-cols-7
                               text-center mb-3"
                    >
                        <div
                            v-for="day in weekDays"
                            :key="day"
                            class="text-sm font-bold
                                   text-slate-400 tracking-wide"
                        >
                            {{ day }}
                        </div>
                    </div>


                    <!-- Days -->
                    <div class="grid grid-cols-7">

                        <button
                            v-for="(day, index) in calendarDays"
                            :key="index"
                            @click="selectDate(day)"
                            class="relative
                                   h-16 sm:h-20
                                   flex items-center
                                   justify-center
                                   rounded-2xl
                                   transition-all
                                   group
                                   cursor-pointer
      
                                   "
                            :class="[
                                isSelected(day)
                                    ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
                                    : isToday(day)
                                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                        : 'text-slate-700 hover:bg-slate-300',

                                isOutsideMonth(day)
                                    ? 'opacity-30'
                                    : ''
                            ]"
                        >

                            <span
                                class="text-lg font-medium"
                                :class="
                                    isSelected(day)
                                        ? 'font-bold'
                                        : ''
                                "
                            >
                                {{ day.date }}
                            </span>


                            <!-- Today indicator -->
                            <span
                                v-if="isToday(day) && !isSelected(day)"
                                class="absolute bottom-3
                                       w-1.5 h-1.5
                                       rounded-full
                                       bg-emerald-600"
                            />

                        </button>

                    </div>


                    <!-- Bottom actions -->
                    <div
                        class="mt-6 pt-5
                               border-t border-slate-100
                               flex items-center justify-between"
                    >

                        <button
                            @click="goToToday"
                            class="px-4 py-2 rounded-xl
                                   text-emerald-700
                                   font-semibold
                                   hover:bg-emerald-50
                                   transition"
                        >
                            Hoje
                        </button>


                        <span
                            class="text-sm text-slate-400"
                        >
                            {{
                                selectedDate.toLocaleDateString(
                                    "pt-BR",
                                    {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric"
                                    }
                                )
                            }}
                        </span>

                    </div>

                </div>

            </div>

        </section>

    </main>
</template>