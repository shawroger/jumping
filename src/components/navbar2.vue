<template>
    <VaCollapse v-model="value" class="min-w-96" header="Collapse header" solid>
        <template #header="{ value, attrs, iconAttrs, text }">
            <div v-bind="attrs"
                class="w-full flex border-[var(--va-background-border)] border-2 p-2 bg-[var(--va-background-element)]">
                <VaIcon name="va-arrow-down" :class="value ? '' : 'rotate-[-90deg]'" v-bind="iconAttrs" />

                <div class="ml-2">
                    {{ text }}
                </div>
            </div>
        </template>

        <template #body>
            <div class="p-2 border-[var(--va-background-border)] border-2 border-t-0">
                Lorem ipsum dolor sit amet, consectetur adipisci
            </div>
        </template>
    </VaCollapse>
</template>