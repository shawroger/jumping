<script setup lang="ts">
import navSvg from "../assets/navigation-svgrepo-com.svg"


</script>


<template>
    <div class="form-app row justify-center">
        <VaCard class="flex xl5 lg8 md10 sm10 xs11">
            <VaCardTitle class="row justify-center">
                <img :src="navSvg" alt="jumping-url-logo" />
            </VaCardTitle>
            <VaCardContent class="row justify-center">
                <div class="flex flex-col xs12">
                    <h1 style="text-align: center">Oops, we do not know where to go …</h1>
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
            animation: va-card-title-img-rotating 0.1s linear infinite;
        }

        .va-card-title img:hover {
            animation: va-card-title-img-rotating 0.01s linear infinite;
        }

        @keyframes va-card-title-img-rotating {
            25% {
                transform: rotate(-10deg);
            }

            50% {
                transform: rotate(0deg);
            }

            75% {
                transform: rotate(10deg);
            }

            100% {
                transform: rotate(0deg);
            }
        }
    }
}
</style>