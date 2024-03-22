<script setup>
import { mainnet, bsc } from "@wagmi/core/chains";
import { getAccount, signTypedData } from "@wagmi/core";

import {
    createWeb3Modal,
    defaultWagmiConfig,
    useWeb3Modal,
    useWeb3ModalEvents,
    useWeb3ModalState,
    useWeb3ModalTheme,
} from "@web3modal/wagmi/vue";
import { reconnect } from '@wagmi/core'
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
    // enableEmail,
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
        "--w3m-color-mix": "purple",
        "--w3m-color-mix-strength": 30,
    },
});

// 4. Use modal composable
const modal = useWeb3Modal();
const state = useWeb3ModalState();
const { setThemeMode, themeMode, themeVariables } = useWeb3ModalTheme();
const events = useWeb3ModalEvents();

const store = reactive({
    signature: ""
})


const emit = defineEmits(['evmWalletEvent', 'signatureEvent']);
// TODO; need to find a way to emit this 
const emitCustomEvent = () => {
    if (events?.data?.event == 'CONNECT_SUCCESS') {
        const data = {
            walletAddress: getAccount(wagmiConfig).address,
        }
        console.log('Beofre emitting evmWalletEvent ')
        emit('evmWalletEvent', JSON.stringify(data));
    }
};

function getWalletAddress() {
    emitCustomEvent()
    return getAccount(wagmiConfig).address
}



async function signWC(chainId) {
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
    try {
        const signature = await signTypedData(wagmiConfig, {
            domain,
            message,
            primaryType: 'Mail',
            types
        })
        store.signature = signature

        emit('signatureEvent', signature);
    }
    catch (e) {
        console.log(e);
    }

}

</script>

<template>
    <button class="btn btn-outline-secondary btn-lg" @click="modal.open({ view: 'Networks' })">Connect Wallet</button>
    <button class="btn btn-outline-secondary btn-lg" @click="signWC(getAccount(wagmiConfig).chainId)">Sign TypedData
    </button>

    <pre v-if="events.data?.properties?.connected == true || events.data.event == 'CONNECT_SUCCESS'">
Address:   {{ getWalletAddress() }}</pre>
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
