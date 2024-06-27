<script setup lang="ts">
import navSvg from "../assets/navigation-svgrepo-com.svg"


</script>


<template>
    <div class="bad404-app row justify-center">
        <VaCard class="flex xl7 lg10 md10 sm10 xs11">
            <VaCardTitle class="row justify-center">
                <img :src="navSvg" alt="jumping-url-logo" />
            </VaCardTitle>
            <VaCardContent class="row justify-center">
                <div class="flex flex-col xs12">
                    <h1 style="text-align: center">Oops, we do not know where to go …</h1>
                </div>
                <div class="row justify-center" style="margin-top: 2em">
                    <VaButton to="/">Let's go home</VaButton>
                </div>
            </VaCardContent>
        </VaCard>
    </div>
</template>

<style lang="less">


.bad404-app {
    max-height: 65vh;

    .va-card {
        margin-top: 2em;
        padding-bottom: 1.5em;

        .va-input:nth-of-type(1) {
            flex-grow: 1;
            margin-right: 1em;
        }

        .va-card-title img {
            width: 35%;
            animation: va-card-title-img-rotating-bad404 0.5s linear infinite;
        }

        .va-card-title img:hover {
            animation: va-card-title-img-rotating-bad404 0.2s linear infinite;
        }

        @keyframes va-card-title-img-rotating-bad404 {
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