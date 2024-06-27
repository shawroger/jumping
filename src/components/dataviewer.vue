<script setup lang="ts">
import { ref } from "vue"
import { loadDB } from "../utils/loadDB";
import navSvg from "../assets/navigation-svgrepo-com.svg"

const db = loadDB();
const currentSettingMode = ref(db.current());
const choosenMode = ref(db.current().getDesp());
const providerList = db.getProviders().map(e => e.getDesp());

function changeSelection() {
    const [provider, index] = db.findByDesp(choosenMode.value);
    if (provider) {
        currentSettingMode.value = provider;
    }
}



</script>


<template>
    <div class="form-app row justify-center">
        <VaCard class="flex xl6 lg10 md10 sm10 xs11">
            <VaCardTitle class="row justify-space-around">
                <img :src="navSvg" alt="jumping-url-logo" />

                <VaSelect v-model="choosenMode" label="STORAGE MODE" :options="providerList"
                    @update:modelValue="changeSelection" placeholder="Select an option for storage" />
            </VaCardTitle>
            <VaCardContent class="row justify-center">
                <template v-if="currentSettingMode.showAll"></template>
                <template v-else>
                    <p>current mode has no data for view</p>
                </template>

            </VaCardContent>
        </VaCard>
    </div>
</template>

<style lang="less">
@import "vuestic-ui/styles/grid";


.form-app {
    min-height: inherit;

    .va-card {
        margin-top: 1em;
        padding-bottom: 1em;

        .va-input:nth-of-type(1) {
            flex-grow: 1;
            margin-right: 1em;

            @media screen and(max-width: 418px) {
                & {
                    width: calc(100% - 200px);
                }
            }
        }

        .va-card-title img {
            width: 10%;
            margin-right: 2em;
            animation: va-card-title-img-rotating 5s infinite;
            animation-timing-function: cubic-bezier(0.455, 0.03, 0.515, 0.955);
        }

        .va-card-title img:hover {
            animation: va-card-title-img-rotating 1s linear infinite;
        }

        @keyframes va-card-title-img-rotating {
            from {
                transform: rotate(0deg);
            }

            to {
                transform: rotate(360deg);
            }
        }
    }
}
</style>