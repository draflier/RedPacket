<template>
  <qrcode-vue :value="getVaultKey" :size="size" level="H" />
</template>
<script>
  import QrcodeVue from 'qrcode.vue'
  import { mapGetters } from "vuex";

  export default {
    data() {
      return {
        size: 150,
      }
    },
    computed: {
        ...mapGetters("contracts", ["getVaultKey"]),
    },
    components: {
      QrcodeVue,
    },
  }
</script>