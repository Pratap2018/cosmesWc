<script setup>
import { MsgSend } from "cosmes/client";
import { mainnet, bsc } from "viem/chains";
import { getAccount ,reconnect} from "@wagmi/core";
import HelloWorld from './HelloWorld.vue';

import {
  createWeb3Modal,
  defaultWagmiConfig,
  useWeb3Modal,
  useWeb3ModalEvents,
  useWeb3ModalState,
  useWeb3ModalTheme
} from '@web3modal/wagmi/vue'

// @ts-expect-error 1. Get projectId
const projectId = "46808fcc7a91e0856a6734652cf14fa2"


// modal.subscribeState((st) => {
//   console.log(st);
//   // state.connected=getAccount(config).address

// });
import {
  CompassController,
  ConnectedWallet,
  CosmostationController,
  KeplrController,
  LeapController,
  MetamaskInjectiveController,
  NinjiController,
  StationController,
  WalletController,
  WalletName,
  WalletType,
} from "cosmes/wallet";
import { Buffer } from "buffer";
import { computed, reactive, ref, toRef, toRefs } from "vue";
const state = reactive({
  seletedWallet: "",
  selectedChain: "",
  connected: "",
  wallet: "",
  signature: "",
});

async function connect(type, chainIds, walletType) {
  try {
    const chainInfos = chainIds.map((chainId) => ({
      chainId,
      rpc: getRpc(chainId),
      gasPrice: getGasPrice(chainId),
    }));
    state.wallet = await CONTROLLERS[type].connect(walletType, chainInfos);
    state.connected = computed(
      () => Object.fromEntries(state.wallet)[chainIds].address
    );
    console.log(state.connected);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

const WC_PROJECT_ID = "2b7d5a2da89dd74fed821d184acabf95";
const SIGN_ARBITRARY_MSG = Buffer.from(
  "Hi from CosmeES! This is a test message just to prove that the wallet is working."
);
const TX_MEMO = "signed via cosmes";

const CHAINS = {
  "osmosis-1": "Osmosis",
  "cosmoshub-4": "Cosmos",
  "juno-1": "Juno",
  "kaiyo-1": "Kujira",
  "phoenix-1": "Terra",
  "columbus-5": "Terra Classic",
  "neutron-1": "Neutron",
  "migaloo-1": "Migaloo",
  "injective-1": "Injective",
  "pacific-1": "Sei",
  "dymension_1100-1": "Dymension",
};

const WALLETS = {
  [WalletName.KEPLR]: "Keplr",
  [WalletName.COSMOSTATION]: "Cosmostation",
  [WalletName.STATION]: "Terra Station",
  [WalletName.LEAP]: "Leap",
  [WalletName.COMPASS]: "Compass",
  [WalletName.METAMASK_INJECTIVE]: "MetaMask",
  [WalletName.NINJI]: "Ninji",
};

const TYPES = {
  [WalletType.EXTENSION]: "Extension",
  [WalletType.WALLETCONNECT]: "Wallet Connect",
};
const CONTROLLERS = {
  [WalletName.STATION]: new StationController(),
  [WalletName.KEPLR]: new KeplrController(WC_PROJECT_ID),
  [WalletName.LEAP]: new LeapController(WC_PROJECT_ID),
  [WalletName.COMPASS]: new CompassController(),
  [WalletName.COSMOSTATION]: new CosmostationController(WC_PROJECT_ID),
  [WalletName.METAMASK_INJECTIVE]: new MetamaskInjectiveController(),
  [WalletName.NINJI]: new NinjiController(),
};

function getRpc(chain) {
  switch (chain) {
    case "osmosis-1":
      return "https://rpc.osmosis.zone";
    case "juno-1":
      return "https://juno-rpc.polkachu.com";
    case "kaiyo-1":
      return "https://kujira-rpc.polkachu.com";
    case "phoenix-1":
      return "https://terra-rpc.publicnode.com";
    case "columbus-5":
      return "https://terra-classic-rpc.publicnode.com";
    case "neutron-1":
      return "https://neutron-rpc.polkachu.com";
    case "migaloo-1":
      return "https://migaloo-rpc.polkachu.com";
    case "injective-1":
      return "https://injective-rpc.polkachu.com";
    case "pacific-1":
      return "https://rpc-sei-ia.cosmosia.notional.ventures";
    case "dymension_1100-1":
      return "https://rpc.dymension.nodestake.org";
    case "cosmoshub-4":
      return "https://cosmos-rpc.publicnode.com";

    default:
      throw new Error("Unknown chain");
  }
}

function getGasPrice(chain) {
  switch (chain) {
    case "osmosis-1":
      return { amount: "0.0025", denom: getDenom(chain) };
    case "juno-1":
      return { amount: "0.001", denom: getDenom(chain) };
    case "kaiyo-1":
      return { amount: "0.00119", denom: getDenom(chain) };
    case "phoenix-1":
      return { amount: "0.015", denom: getDenom(chain) };
    case "columbus-5":
      return { amount: "28.325", denom: getDenom(chain) };
    case "neutron-1":
      return { amount: "0.01", denom: getDenom(chain) };
    case "migaloo-1":
      return { amount: "0.25", denom: getDenom(chain) };
    case "injective-1":
      return { amount: "500000000", denom: getDenom(chain) };
    case "pacific-1":
      return { amount: "0.1", denom: getDenom(chain) };
    case "dymension_1100-1":
      return { amount: "20000000000", denom: getDenom(chain) };
    case "cosmoshub-4":
      return { amount: "0.25", denom: getDenom(chain) };
    default:
      throw new Error("Unknown chain");
  }
}

function getDenom(chain) {
  switch (chain) {
    case "osmosis-1":
      return "uosmo";
    case "juno-1":
      return "ujuno";
    case "kaiyo-1":
      return "ukuji";
    case "phoenix-1":
    case "columbus-5":
      return "uluna";
    case "neutron-1":
      return "untrn";
    case "migaloo-1":
      return "uwhale";
    case "injective-1":
      return "inj";
    case "pacific-1":
      return "usei";
    case "dymension_1100-1":
      return "adym";
    case "cosmoshub-4":
      return "uatom";
    default:
      throw new Error("Unknown chain");
  }
}

async function signArbitrary(chainId) {
  const wallet = Object.fromEntries(state.wallet)[chainId];
  console.log(wallet);

  if (!wallet) {
    alert("Wallet not connected yet");
    return;
  }
  try {
    const res = await wallet.signArbitrary(SIGN_ARBITRARY_MSG);
    console.log(res);
    const data = Buffer.from(new Uint8Array(res.data)).toString("utf-8");
    res.data = data;
    state.signature = res;
    alert("Sign success! Check console logs for details.");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}
</script>

<template>
  <div class="row">
    <div class="cosmos column" style="float: left">
      <h1>InterChain</h1>
      <div>
        <p>Chain Id : {{ state.selectedChain }}</p>

        <p>Wallet : {{ state.selectedWallet }}</p>
      </div>
      <br />
      <br />

      <br />
      <div>
        <select v-model="state.selectedChain">
          <option disabled value="">Selcet Chain</option>
          <option value="cosmoshub-4">{{ CHAINS["cosmoshub-4"] }}</option>
          <option value="osmosis-1">{{ CHAINS["osmosis-1"] }}</option>
        </select>
      </div>
      <div>
        <select v-model="state.selectedWallet">
          <option disabled value="">Selcet Wallet</option>
          <option value="keplr">{{ WALLETS["keplr"] }}</option>
          <option value="leap">{{ WALLETS["leap"] }}</option>
        </select>
      </div>
      <div>
        <select v-model="state.selectedWalletType">
          <option disabled value="">Selcet Wallet Type</option>
          <option>extension</option>
          <option>walletConnect</option>
        </select>
      </div>

      <br />
      <div>
        <button
          @click="
            connect(
              state.selectedWallet,
              [state.selectedChain],
              state.selectedWalletType
            )
          "
        >
          connect
        </button>
        <button @click="signArbitrary(state.selectedChain)">
          SignArbitery
        </button>
        <div class="row">
    <div>
      <h3>Connected :</h3>
      <i> {{ state.connected }} </i>
    </div>
    <br />
    <div>
      <h3>Signature :</h3>
      <i>
        {{
          typeof state.signature == "object"
            ? JSON.stringify(state.signature, null, 2)
            : ""
        }}
      </i>
    </div>
  </div>
      </div>

      
    </div>
    <div class="metamask column" style="float: right">
      <h1>EVM</h1>
      <HelloWorld/>
    </div>
  </div>


</template>

<style scoped>
header {
  line-height: 1.5;
}
.cosmos {
  width: 400px !important;
  text-align: center !important;
}
.metamask {
  width: 400px !important;

  text-align: center !important;
}
.column {
  padding: 10px;
  height: 300px;
  float: left;
  width: 50%;
}

.row:after {
  content: "";
  display: table;
  clear: both;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
