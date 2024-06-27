<script setup lang="ts">
import { ref, defineProps } from "vue"
import { useRouter } from "vue-router"
import { loadDB } from "../utils/loadDB";
import navSvg from "../assets/navigation-svgrepo-com.svg"

const props = defineProps({
    to: {
        type: String,
        default: ""
    },
});


const db = loadDB();
const showURL = ref("");
const willgoto = ref("");
const router = useRouter();
const input = ref(props.to);
const matchProvider = db.matchProvider(input.value);



(async function faraway() {
    if (matchProvider) {
        const towhere = await matchProvider.getItem(input.value);
        if(!towhere) {
            router.push("/~404");
            return;
        }
        willgoto.value = towhere;
        showURL.value = matchProvider.showURLText(towhere);
        console.log(matchProvider)
    }
    window.location.href = willgoto.value;
})()

</script>


<template>
    <div class="form-app row justify-center">
        <VaCard class="flex xl5 lg8 md10 sm10 xs11">
            <VaCardTitle class="row justify-center">
                <img :src="navSvg" alt="jumping-url-logo" />
            </VaCardTitle>
            <VaCardContent class="row justify-center">
                <div class="flex flex-col xs12">
                    <p style="text-align: center">Please wait … we will jump to <span style="color:orange">{{ showURL
                            }}</span></p>
                </div>

                <div class="flex flex-col xs12" style="margin-top: 2em">
                    <p style="text-align: center">current db mode is <span style="font-weight: bold;">{{ matchProvider.getName() }}</span></p>
                </div>
            </VaCardContent>
        </VaCard>
    </div>
</template>

<style lang="less">
@import "vuestic-ui/styles/grid";

.form-app {
    max-height: 65vh;

    .va-card {
        margin-top: 2em;

        .va-input:nth-of-type(1) {
            flex-grow: 1;
            margin-right: 1em;
        }

        .va-card-title img {
            width: 45%;
            animation: va-card-title-img-rotating 0.3s linear infinite;
        }

        .va-card-title img:hover {
            animation: va-card-title-img-rotating 0.2s linear infinite;
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