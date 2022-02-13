<template>
  <qrcode-vue :value="getRedeemURL" :size="size" level="H" />
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
        ...mapGetters("contracts", ["getRedeemURL"]),
    },
    components: {
      QrcodeVue,
    },
  }
</script>