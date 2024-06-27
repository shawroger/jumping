<script setup lang="ts">
import { ref } from "vue"
import ClipboardJS from "clipboard";
import { useToast } from 'vuestic-ui'
import { loadDB } from "../utils/loadDB";
import navSvg from "../assets/navigation-svgrepo-com.svg"

const url = ref("")
const generateURL = ref("")
const db = loadDB();
const choosenMode = ref(db.current().getDesp());
const providerList = db.getProviders().map(e => e.getDesp());


const { notify } = useToast();

function changeSelection() {
    const [_, index] = db.findByDesp(choosenMode.value);
    console.log(choosenMode.value, index)
    db.mode(index);
}
async function applyEvent() {
    const input = url.value.trim();
    url.value = input;
    if (!input) {
        notify({
            color: "#04030C",
            position: 'bottom-right',
            message: "Please enter the URL",
        });
        return
    }
    const key = await db.current().addItemByAutoKey(input);
    const targetURL = window.location.origin + "/" + key;
    generateURL.value = key;
    ClipboardJS.copy(targetURL);
    notify({
        message: targetURL,
        color: "#04030C",
        duration: 5000,
        position: 'bottom-right',
        customClass: "toast-success-msg"
    });
}
</script>


<template>
    <div class="form-app row justify-center">
        <VaCard class="flex xl7 lg10 md10 sm10 xs11">
            <VaCardTitle class="row justify-center">
                <img :src="navSvg" alt="jumping-url-logo" />
            </VaCardTitle>
            <VaCardContent class="row justify-center">
                <div class="row justify-space-between align-center" style="margin-bottom: 1em;">
                    <VaInput :required="true" label="URL" v-model="url" placeholder="INPUT YOUR URL" />
                    <VaButton style="height:30px; transform: translateY(9px);" @click="applyEvent">APPLY</VaButton>
                </div>
                <VaInput :readonly="true" label="SHORTEN URL" style="width:100%; margin-bottom: 2em;" v-model="generateURL"
                    placeholder="WILL GENERATE YOUR SHORTEN URL" />
                <!-- <VaCheckbox v-model="useIndexDB" class="mb-6"
                    label="I want to store the URL into indexDB to form a shorter url" /> -->
                <VaSelect v-model="choosenMode" label="STORAGE MODE" :options="providerList"
                @update:modelValue="changeSelection"
                    placeholder="Select an option for storage" />


            </VaCardContent>
        </VaCard>
    </div>
</template>

<style lang="less">



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
            width: 45%;
            animation: va-card-title-img-rotating-form 5s infinite;
            animation-timing-function:cubic-bezier(0.455, 0.03, 0.515, 0.955);
        }

        .va-card-title img:hover {
            animation: va-card-title-img-rotating-form 1s linear infinite;
        }

        @keyframes va-card-title-img-rotating-form {
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