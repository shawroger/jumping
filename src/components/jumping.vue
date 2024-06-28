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

function checkAppURL(url: string) {
    if(url.includes(":/") && !url.includes("://")) {
        url = url.replace(":/", "://");
    }

    if(url.includes("file:/") && !url.includes("file://")) {
        url = url.replace("file:/", "file://");
    }

    if(url.includes("file://") && !url.includes("file:///")) {
        url = url.replace("file://", "file:///");
    }

    return url;
}

(async function faraway() {
    if (matchProvider) {
        
        const towhere = await matchProvider.getItem(checkAppURL(input.value));
        if (!towhere) {
            router.push("/~404");
            return;
        }
        willgoto.value = towhere;
        showURL.value = matchProvider.showURLText(towhere);
    }
    window.location.assign(willgoto.value);
})()

</script>


<template>
    <div class="jumping-app row justify-center">
        <VaCard class="flex xl7 lg10 md10 sm10 xs11">
            <VaCardTitle class="row justify-center">
                <img :src="navSvg" alt="jumping-url-logo" />
            </VaCardTitle>
            <VaCardContent class="row justify-center jumping-card-content">

                <div class="flex flex-col xs12">
                    <p>current running mode is <b>{{
                        matchProvider.getName() }}</b></p>
                </div>
                <div class="flex flex-col xs12">
                    <p>Please wait … we will jump to</p>
                </div>

                <div class="flex flex-col xs12" style="padding-bottom: 1em;">
                    <p :style="{'color': showURL ? 'orange' : 'inherit'}">
                        <a :href="showURL || 'javascript:void;'" _target="blank">{{ showURL || "finding url …" }}</a>
                    </p>
                </div>


            </VaCardContent>
        </VaCard>
    </div>
</template>

<style lang="less">


.jumping-app {
    max-height: 65vh;

    .va-card {
        margin-top: 2em;

        .va-input:nth-of-type(1) {
            flex-grow: 1;
            margin-right: 1em;
        }

        .va-card-title img {
            width: 35%;
            animation: va-card-title-img-rotating 0.3s linear infinite;
        }

        .va-card-title img:hover {
            animation: va-card-title-img-rotating 0.2s linear infinite;
        }

        .jumping-card-content {

            p {
                overflow: hidden;
                text-align: center;
                white-space: nowrap;
                text-overflow: ellipsis;
                padding-bottom: 0.5em;

                
            }


            div:nth-of-type(2) {
                margin-top: 1.5em;
            }

            div:nth-of-type(3) {
                margin-top: 1.5em;
                padding-bottom: 1em;
            }
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