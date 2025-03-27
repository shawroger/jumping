<script setup lang="ts">
import { ref, defineProps } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vuestic-ui";
import ClipBoard from "clipboardy";
import { loadDB } from "../utils/loadDB";
import navSvg from "../assets/navigation-svgrepo-com.svg";
import { safeAtob } from "../db/justgoto";
import { isArrayURL } from "../utils/checkURL";

const props = defineProps({
  to: {
    type: String,
    default: "",
  },
});

const db = loadDB();
const showURL = ref("");
const willgoto = ref("");
const router = useRouter();
const input = ref(props.to);
const { notify } = useToast();
const matchProvider = ref(db.matchProvider(input.value));

function checkAppURL(url: string) {
  if (url.includes(":/") && !url.includes("://")) {
    url = url.replace(":/", "://");
  }

  if (url.includes("file:/") && !url.includes("file://")) {
    url = url.replace("file:/", "file://");
  }

  if (url.includes("file://") && !url.includes("file:///")) {
    url = url.replace("file://", "file:///");
  }

  return url;
}

function webhookErrorAction() {
  matchProvider.value = db.matchProvider(input.value, ["webhook"]);
  notify({
    message: "Webhook return bad url, try another provider ...",
    color: "warning",
    duration: 5000,
    position: "bottom-right",
  });
  return farAway();
}



async function farAway(): Promise<void> {
  if (matchProvider.value) {
    if (matchProvider.value.getName() === "just-jumping") {
      input.value = safeAtob(input.value);
    }
    try {
      const towhere = await matchProvider.value.getItem(
        checkAppURL(input.value)
      );
      if (!towhere && matchProvider.value.getName() === "webhook") {
        return webhookErrorAction();
      }

      if (!towhere) {
        router.push("/~404");
        return;
      }
      willgoto.value = towhere;
    } catch (err) {
      webhookErrorAction();
    }
  }
  jumpToURL(willgoto.value);
}

farAway();

function jumpToURL(url: string) {
  if(!url) return;
  if (isArrayURL(url)) {
    const links = url.slice(1, -1).split("|");
    showURL.value = links.join("<br />");
    for (let i = 0; i < links.length; i++) {
      if (links[i] && links[i].length > 0) {
        console.log("will jump to " + links[i] + ` URL[${i}]`);
        window.open(links[i], "_blank");
      }
    }
  } else {
    console.log("will jump to " + url);
    window.open(url, "_blank");
    showURL.value = url;
  }
}

function manualJump(event: Event) {
  event.preventDefault();
  jumpToURL(willgoto.value);
  ClipBoard.write(willgoto.value)
    .then(() => {
      notify({
        message: "URL copied to clipboard",
        color: "primary",
        duration: 5000,
        position: "bottom-right",
      });
    })
    .catch((e) => {
      notify({
        message: "Copy to clipboard failed: " + e,
        color: "warning",
        duration: 5000,
        position: "bottom-right",
      });
    });
}
</script>

<template>
  <div class="jumping-app row justify-center">
    <VaCard class="flex xl7 lg10 md10 sm10 xs11">
      <VaCardTitle class="row justify-center">
        <img :src="navSvg" alt="jumping-url-logo" />
      </VaCardTitle>
      <VaCardContent class="row justify-center jumping-card-content">
        <div class="flex flex-col xs12">
          <p>
            current running mode is <b>{{ matchProvider.getName() }}</b>
          </p>
        </div>
        <div class="flex flex-col xs12">
          <p>Please wait … we will jump to</p>
        </div>

        <div class="flex flex-col xs12" style="padding-bottom: 1em">
          <p :style="{ color: showURL ? 'orange' : 'inherit' }">
            <a
              href="javascript:void"
              _target="blank"
              @click="manualJump"
              v-html="showURL || 'finding url …'"
            ></a>
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
