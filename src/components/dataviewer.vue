<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { loadDB } from "../utils/loadDB";
import navSvg from "../assets/navigation-svgrepo-com.svg"

import { useToast, useModal } from 'vuestic-ui';

const { notify } = useToast();

const db = loadDB();
const storeData = ref([] as string[][]);
const currentSettingMode = ref(db.current());
const choosenMode = ref(db.current().getDesp());
const providerList = db.getProviders().map(e => e.getDesp());

const tableData = computed(() => storeData.value.map((e, k) => ({
    ID: k + 1,
    KEY: e[0],
    URL: e[1]
})))

const filter = ref("")
const currentPage = ref(1);
const filtered = ref(tableData.value);
const perPageOptions = computed(() =>
    [10, 15, 20, 30, 50, 100, 200, 500, 1000].filter(e => e < filtered.value.length)
)

const perPage = ref(perPageOptions.value[0] || 10);
const columns = computed(() => {
    const originCols = [
        {
            key: "ID",
            label: "#",
            thAlign: "center",
            tdAlign: "center",
            tdVerticalAlign: "top",
            tdClass: "table-id-class",
            width: "50px",
        },
        {
            key: "KEY",
            label: "KEY",
            thAlign: "center",
            tdVerticalAlign: "top",
            tdClass: "table-key-class",
            width: "100px"
        },
        {
            key: "URL",
            label: "URL",
            thAlign: "center",
            tdVerticalAlign: "top",
            tdClass: "table-url-class",
        }
    ];

    if (currentSettingMode.value.deleteItem || currentSettingMode.value.editItem) {
        return [...originCols, { key: "ACTION", width: 60 }]
    } else {
        return originCols;
    }

});

const { confirm } = useModal();

const loadingTable = ref(false)
const showUploadModal = ref(false)
const fileUpload = ref([] as any)
const pages = computed(() =>
    perPage.value && perPage.value !== 0 ?
        Math.ceil(filtered.value.length / perPage.value) : filtered.value.length)

function changeSelection() {
    const [provider, _] = db.findByDesp(choosenMode.value);
    if (provider) {
        currentSettingMode.value = provider;
        readData();
    }
}
async function readData() {
    if (typeof currentSettingMode.value.getAll === "function") {
        storeData.value = await currentSettingMode.value.getAll();
    }

    currentPage.value = 1;
}

async function downloadData() {
    if (typeof currentSettingMode.value.download === "function") {
        const message = await currentSettingMode.value.download();
        if (message) {
            notify({
                message,
                color: "#04030C",
                duration: 5000,
                position: 'bottom-right',
                customClass: "toast-success-msg"
            });
        }
    }
}

async function confirmUpload() {
    storeData.value = [];
    loadingTable.value = true;
    if (typeof currentSettingMode.value.rewriteAll === "function" && fileUpload.value.length >= 1) {
        const file = fileUpload.value[0];
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = async (evt) => {
            if (evt && evt.target) {
                const fileString = evt.target.result?.toString();
                if (fileString) {
                    const arraydata = fileString.split("\n").map(e => {
                        const key = e.split(",")[0];
                        const value = e.slice(key.length + 1);
                        return [key, value];
                    })
                    const message = await currentSettingMode.value.rewriteAll!(arraydata);
                    notify({
                        message,
                        color: "#04030C",
                        duration: 5000,
                        position: 'bottom-right',
                        customClass: "toast-success-msg"
                    });


                    await readData();
                    loadingTable.value = false;
                }
            }
        }
    }



}

async function uploadData() {
    showUploadModal.value = true;

}

async function deleteItem(key: string) {
    confirm({
        title: "Warning for Delete",
        message: 'Are you sure to delete the key [' + key + '] permanently?',
    }).then(async (ok) => {
        if (ok && currentSettingMode.value.deleteItem) {
            const message = await currentSettingMode.value.deleteItem(key);

            await readData();
            notify({
                message,
                color: "#04030C",
                duration: 5000,
                position: 'bottom-right',
                customClass: "toast-success-msg"
            });
        }
    });
}


const editKey = ref("");
const editValue = ref("");
const editValueOld = ref("");
const showEditModal = ref(false);

function clickEditItemBtn(key: string, value: string) {
    showEditModal.value = true;
    editKey.value = key;
    editValue.value = value;
    editValueOld.value = value;
}

async function confirmEditItem() {
    if (editValueOld.value === editValue.value) {
        notify({
            message: "You have not changed this value",
            color: "#04030C",
            duration: 5000,
            position: 'bottom-right',
            customClass: "toast-success-msg"
        });
    } else {

        if (currentSettingMode.value.editItem) {
            const message = await currentSettingMode.value.editItem(editKey.value, editValue.value);

            notify({
                message,
                color: "#04030C",
                duration: 5000,
                position: 'bottom-right',
                customClass: "toast-success-msg"
            });
        }

    }
    editKey.value = '';
    editValue.value = '';
    editValueOld.value = '';

    await readData();


}

onMounted(() => readData())

</script>


<template>

    <VaModal v-model="showEditModal" ok-text="OK" maxWidth="600px" @ok="confirmEditItem">
        <div class="row justify-center">
            <div class="flex flex-col xs12">
                <VaInput label="KEY" style="width:100%" v-model="editKey" :readonly="true" />
            </div>
            <div class="flex flex-col xs12" style="margin-top: 2em">
                <VaInput label="EDIT VALUE" style="width:100%" v-model="editValue" />
            </div>
        </div>
    </VaModal>

    <VaModal v-model="showUploadModal" ok-text="OK" maxWidth="600px" @close="fileUpload = []" @ok="confirmUpload">
        <VaFileUpload :disabled="fileUpload.length >= 1" v-model="fileUpload" dropzone file-types="txt,csv" />
    </VaModal>
    <div class="dataview-app row justify-center">
        <VaCard class="flex xl7 lg10 md10 sm10 xs11">
            <VaCardTitle class="row justify-space-around">
                <img :src="navSvg" alt="jumping-url-logo" />

                <VaSelect v-model="choosenMode" label="STORAGE MODE" :options="providerList"
                    @update:modelValue="changeSelection" placeholder="Select an option for storage" />
            </VaCardTitle>
            <VaCardContent class="row justify-center">
                <template v-if="currentSettingMode.getAll">
                    <div class="row help-table-bar justify-space-between">
                        <div class="flex flex-col md10" style="padding-right: 1em;">
                            <VaInput label="SEARCH IN TABLE" v-model="filter" style="width:100%"
                                placeholder="ENTER ANYTHING YOU WANT TO FIND IN TABLE"></VaInput>
                        </div>
                        <div class="flex flex-col md2">
                            <VaSelect label="PAGE SIZE" v-model="perPage" :options="perPageOptions"
                                @update:modelValue="currentPage = 1" />
                        </div>

                        <div class="row md12 help-button-bar justify-space-around">
                            <VaButton @click="downloadData" v-if="currentSettingMode.download">DOWNLOAD</VaButton>
                            <VaButton @click="uploadData" v-if="currentSettingMode.rewriteAll">UPLOAD</VaButton>
                        </div>
                    </div>
                    <VaDataTable :loading="loadingTable" :items="tableData" :columns="columns" :per-page="perPage"
                        :current-page="currentPage" :filter="filter" @filtered="filtered = $event.items">
                        <template #cell(URL)="{ value }">

                            <a :href="value" _target="_blank">{{ value }}</a>

                        </template>

                        <template #bodyAppend>
                            <tr v-if="tableData.length > 0">
                                <td :colspan="columns.length">
                                    <div class="flex justify-center dataview-nav">
                                        <VaPagination v-model="currentPage" :pages="pages" 
                                        :visible-pages="5" />
                                    </div>
                                </td>
                            </tr>
                        </template>
                        <template #cell(ACTION)="{ rowData }">
                            <VaButton @click="clickEditItemBtn(rowData.KEY, rowData.URL)"
                                v-if="currentSettingMode.editItem" preset="plain" icon="edit" />
                            <VaButton @click="deleteItem(rowData.KEY)" v-if="currentSettingMode.deleteItem"
                                preset="plain" icon="delete" class="ml-3" />
                        </template>
                    </VaDataTable>
                </template>
                <template v-else>
                    <p>current mode has no data for view</p>
                </template>

            </VaCardContent>
        </VaCard>
    </div>
</template>

<style lang="less">
.dataview-app {
    min-height: inherit;

    .row.help-table-bar {
        margin-bottom: 2em;
    }

    .help-button-bar {
        margin-top: 1em;
    }

    table {



        td:nth-of-type(1),
        td:nth-of-type(2) {
            text-align: center !important;
        }

        .table-id-class {
            font-size: 0.8em;
        }

        .table-key-class {
            font-weight: bolder;
            font-family: Consolas, monaco, monospace;
        }

        .table-url-class {
            max-width: 100px;
            color: #AB4312;
            font-size: 0.9em;
            overflow: hidden;
            text-align: center;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-family: Consolas, monaco, monospace;

            a,
            a:visited,
            a:hover,
            a:active {
                color: inherit;
                text-decoration: none;
            }
        }

        .dataview-nav {

            margin-top: 2em;

            nav {
                display: flex;
                justify-content: center;
            }
        }
    }



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