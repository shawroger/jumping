<script setup lang="ts">
import { ref, computed, Ref, onMounted } from "vue"
import { useToast } from 'vuestic-ui';
import { loadDB } from "../utils/loadDB";
import navSvg from "../assets/navigation-svgrepo-com.svg"
import { I_DBControllerSettings, loadSettings, mergeSettings, setSettings } from "../db/base";

const db = loadDB();
const { notify } = useToast();
const currentSettingMode = ref(db.current());
const choosenMode = ref(db.current().getDesp());
const providerList = db.getProviders().map(e => e.getDesp());

function changeSelection() {
    const [provider, _] = db.findByDesp(choosenMode.value);
    if (provider) {
        currentSettingMode.value = provider;
    }
}

const settingConfig = ref([] as I_DBControllerSettings[]);

const settingValues = ref({} as any);

function loadSettingsFromStorage() {
    settingConfig.value = loadSettings(currentSettingMode.value);
    for (const item of settingConfig.value) {
        settingValues.value[item.name] = item.value;
    }
}

onMounted(() => {
    loadSettingsFromStorage();
})

function confirmChange() {
    const newSettings = mergeSettings(settingConfig.value, settingValues.value);
    setSettings(currentSettingMode.value, newSettings);
    loadSettingsFromStorage();
    notify({
        message: "Settings have changed",
        color: "#04030C",
        duration: 5000,
        position: 'bottom-right',
        customClass: "toast-success-msg"
    });
}

</script>


<template>
    <div class="settings-app row justify-center">
        <VaCard class="flex xl7 lg10 md10 sm10 xs11">
            <VaCardTitle class="row justify-space-around">
                <img :src="navSvg" alt="jumping-url-logo" />

                <VaSelect v-model="choosenMode" label="STORAGE MODE" :options="providerList"
                    @update:modelValue="changeSelection" placeholder="Select an option for storage" />
            </VaCardTitle>
            <VaCardContent class="row justify-center">
                <template v-if="currentSettingMode.getSettings">
                    <div class="row justify-center">
                        <div class="flex flex-col xs12" v-for="item in settingConfig" :key="item.name"
                            style="margin: 0.5em 0">
                            <VaInput :label="item.desp" style="width:100%" v-model="settingValues[item.name]"
                                :type="item.type" />
                        </div>

                        <div class="flex xs12 row justify-center" style="margin-top: 1.5em">
                            <VaButton @click="confirmChange">CONFIRM CHANGE</VaButton>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <p>current mode has no settings for view</p>
                </template>

            </VaCardContent>
        </VaCard>
    </div>
</template>

<style lang="less">
.settings-app {
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