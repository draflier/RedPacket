<template>
  <div>
    
    <navbar-component></navbar-component>
    <main>
      <section class="absolute w-full h-full">
        <div
          class="absolute top-0 w-full h-full bg-gray-900"
          style="background-size: 100%; background-repeat: no-repeat;"
          :style="{'background-image': 'url(' + require('../assets/img/register_bg_2.png').default + ')'}"
        ></div>
        <div class="container mx-auto px-4 h-full">
          <div class="flex content-center items-center justify-center h-full">
            <div class="w-full lg:w-4/12 px-4">
              <div
                class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-300 border-0"
              >
                
                <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
                  <div class="text-black-500 text-center mb-3 font-bold">
                    <small>Welcome to the Draf Red Packet Redemption Module</small>
                  </div>
                  <form>
                    <div class="text-black-400 text-center mb-3 font-bold">
                      <small>{{getChainInfoMsg}}</small>
                    </div>
                    <div class="relative w-full mb-3">
                      <label
                        class="block uppercase text-gray-700 text-xs font-bold mb-2"
                        for="grid-deposit"
                        >Redemption Code</label
                      ><input
                        type="text"
                        class="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                        :value="this.$route.params.vaultKey"
                        style="transition: all 0.15s ease 0s;"
                        ref="redemptionCode"
                        :disabled=isInputDisabled()
                      />
                    </div>
                    <div class="text-center mt-6">

                      <button
                        class="bg-gray-900 text-white active:bg-gray-700 text-sm font-bold px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full"
                        type="button"
                        style="transition: all 0.15s ease 0s;"
                        name="redeemFund"
                        v-on:click="redeemFund"
                        v-bind:class="{'hidden': (!isUserConnected || !isCorrectChain) || (isLoading || isRedeemed)}"
                      >
                        Redeem Red Packet
                      </button>

                      <button
                        class="bg-gray-900 text-white active:bg-gray-700 text-sm font-bold px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full"
                        type="button"
                        style="transition: all 0.15s ease 0s;"
                        name="loading"
                        v-bind:class="{'hidden': (!isUserConnected || !isCorrectChain) || !isLoading}"
                      >
                        Loading...
                      </button>

                      <button
                        class="bg-gray-900 text-white active:bg-gray-700 text-sm font-bold px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full"
                        type="button"
                        style="transition: all 0.15s ease 0s;"
                        name="redeemFund"
                        v-bind:class="{'hidden': (!isUserConnected || !isCorrectChain) || !isRedeemed}"
                      >
                        Red Packet Redeemed
                      </button>
                    </div>
                  </form>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
<script>
import NavbarComponent from "../components/Navbar.vue";

import { mapGetters } from "vuex";


export default {
  name: "deposit-page",
  computed: 
  {
    ...mapGetters("accounts", ["getActiveAccount",
                                "getChainName", 
                                "isUserConnected",
                                "isCorrectChain",
                                "getChainInfoMsg",
                                "getEthers"]),
    ...mapGetters("contracts", ["getIErc20Contract","getVaultContract","getVaultKey","isLoading","isRedeemed"])
  },
  methods:
  {
    async redeemFund() 
    {
      console.log("Inside Redeem Fund");
      let strRedemptionCode = this.$refs.redemptionCode.value;
      await this.$store.dispatch("contracts/fetchVaultContract");
      await this.$store.dispatch("contracts/storeIsLoading",true );
      let objTxn = await this.getVaultContract.getRedPacket(strRedemptionCode);
      await this.getEthers.waitForTransaction(objTxn.hash,3);
      

      await this.$store.dispatch("contracts/storeIsRedeemed",true );
      await this.$store.dispatch("contracts/storeIsLoading",false );
      
    },
    isInputDisabled()
    {
      return this.isLoading || this.isRedeemed;
    }
    
  },
  components: 
  {
    NavbarComponent,
  }
}
</script>
