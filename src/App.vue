<template>
  <div class="container">
    <div class="row row-cols-2 g-3">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <img src="https://cdn.worldvectorlogo.com/logos/ethereum-eth.svg" width="50" height="50"
              style="float:left; margin-right: 10px">
            <h2>EVM Chains</h2>
          </div>
          <div class="card-body minHeight">
            <EvmWallet @evmWalletEvent="evmWalletEventHandler" @signatureEvent="signatureEventHandler" />
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <img src="https://cdn.worldvectorlogo.com/logos/cosmos-2.svg" width="50" height="50"
              style="float:left; margin-right: 10px">
            <h2>Interchain Chains</h2>
          </div>
          <div class="card-body minHeight">
            <InterChainWallet />
          </div>
        </div>
      </div>

      <div class="col-md-12">
        <div class="card">
          <div class="card-body">
            <div class="container">
              <div class="row row-cols-3 g-1">
                <div class="col-md-4">
                  <div class="p-3 border bg-light">WalletAddress</div>
                </div>
                <div class="col-md-5">
                  <div class="p-3 border bg-light">Signature</div>
                </div>
                <div class="col-md-3">
                  <div class="p-3 border bg-light">Network</div>
                </div>
              </div>
              <div class="row row-cols-3 g-1">
                <div class="col-md-4">
                  <div class="p-2 border">{{ walletAddress }}</div>
                </div>
                <div class="col-md-5">
                  <div class="p-2 border">{{ signature }}</div>
                </div>
                <div class="col-md-3">
                  <div class="p-2 border">{{ network }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.minHeight {
  min-height: 350px;
}
</style>

<script>
import EvmWallet from "./components/EvmWallet.vue"
import InterChainWallet from "./components/InterChainWallet.vue"

export default {
  components: {
    EvmWallet,
    InterChainWallet
  },
  data() {
    return {
      walletAddress: "0x12312312",
      signature: "0x123123123123",
      network: "ethereum"
    }
  },
  methods: {
    evmWalletEventHandler(data) {
      console.log('Inside event handler...')
      if (data) {
        data = JSON.parse(data)
        this.walletAddress = data.walletAddress
      }

    },
    signatureEventHandler(data) {
      console.log('Inside signatureEventHandler handler...')

      this.signature = data
    }

  }

}
</script>
