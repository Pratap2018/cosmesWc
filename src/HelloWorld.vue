<script setup>
import { mainnet, bsc } from "@wagmi/core/chains";
import { getAccount ,signTypedData} from "@wagmi/core";

import {
  createWeb3Modal,
  defaultWagmiConfig,
  useWeb3Modal,
  useWeb3ModalEvents,
  useWeb3ModalState,
  useWeb3ModalTheme,
} from "@web3modal/wagmi/vue";

import { coinbaseWallet, walletConnect, injected } from "@wagmi/connectors";
import { reactive } from "vue";

// @ts-expect-error 1. Get projectId
const projectId = "46808fcc7a91e0856a6734652cf14fa2";
if (!projectId) {
  throw new Error("VITE_PROJECT_ID is not set");
}

// 2. Create wagmiConfig
const chains = [mainnet, bsc];
const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  connectors: [coinbaseWallet],
  metadata: {
    name: "Web3Modal Vue Example",
    description: "Web3Modal Vue Example",
    url: "",
    icons: [],
    verifyUrl: "",
  },
});

// 3. Create modal
createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  themeMode: "light",
  themeVariables: {
    "--w3m-color-mix": "#00BB7F",
    "--w3m-color-mix-strength": 20,
  },
});

// 4. Use modal composable
const modal = useWeb3Modal();
const state = useWeb3ModalState();
const { setThemeMode, themeMode, themeVariables } = useWeb3ModalTheme();
const events = useWeb3ModalEvents();

const store=reactive({
  signature:""
})


async function signWC(chainId){
  const domain = {
		name: 'Ether Mail',
		version: '1',
		chainId: chainId,
		verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
	} 

	const types = {
		Person: [
			{ name: 'name', type: 'string' },
			{ name: 'wallet', type: 'address' },
		],
		Mail: [
			{ name: 'from', type: 'Person' },
			{ name: 'to', type: 'Person' },
			{ name: 'contents', type: 'string' },
		],
	} 

	const message = {
		from: {
			name: 'Cow',
			wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
		},
		to: {
			name: 'Bob',
			wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
		},
		contents: 'Hello, Bob!',
	} 
  try{
    const signature= await signTypedData(wagmiConfig,{
      domain,
      message,
      primaryType:'Mail',
      types
    })
    store.signature = signature

  }
  catch(e) {
    console.log(e);
  }

}

</script>

<template>
  <button @click="modal.open()">Open Connect Modal</button>
  <button @click="modal.open({ view: 'Networks' })">Open Network Modal</button>
  <button @click="setThemeMode(themeMode === 'dark' ? 'light' : 'dark')">
    
    Toggle Theme Mode
  </button>
  <button  @click="signWC(getAccount(wagmiConfig).chainId)">Sign TypedData </button>

  <pre>{{ JSON.stringify(state, null, 2) }}</pre>


  <pre v-if="events.data?.properties?.connected==true || events.data.event=='CONNECT_SUCCESS'">
Address:   {{ getAccount(wagmiConfig).address }}</pre>

<pre>Signature : {{ store.signature  }}</pre>

</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
