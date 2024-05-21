<script setup>
import { mainnet, bsc, polygon, moonbeam, moonriver } from "@wagmi/core/chains";
import { getAccount, signTypedData, signMessage, connect } from "@wagmi/core";
import { HypersignDID } from "hs-ssi-sdk";
import SignClient from "@walletconnect/sign-client";
import UniversalProvider from "@walletconnect/universal-provider";
import { EthereumProvider } from "@walletconnect/ethereum-provider";
import { ConstantsUtil as CoreConstants } from "@web3modal/scaffold-utils";
import { EthereumEip712Signature2021 } from "ethereumeip712signature2021suite";
import { purposes } from "jsonld-signatures";
function isHex(value, { strict = true } = {}) {
  if (!value) return false;
  if (typeof value !== "string") return false;
  return strict ? /^0x[0-9a-fA-F]*$/.test(value) : value.startsWith("0x");
}
import jsSig from "jsonld-signatures";

import {
  createWeb3Modal,
  defaultWagmiConfig,
  useWeb3Modal,
  useWeb3ModalEvents,
  useWeb3ModalState,
  useWeb3ModalTheme,
} from "@web3modal/wagmi/vue";

import { provide, reactive } from "vue";
import { getAddress, getTypesForEIP712Domain } from "viem";
import jsonld from "jsonld";

const nodeDocumentLoader = jsonld.documentLoader;
import ecdsasecp2019 from "./lds-ecdsa-secp256k1-recovery2019.json";

const CONTEXTS = Object.freeze({
  "https://ns.did.ai/suites/secp256k1-2019/v1/": {
    ...ecdsasecp2019,
  },
});

const docloader = async (url, options) => {
  if (url in CONTEXTS) {
    return {
      contextUrl: null, // this is for a context via a link header
      document: CONTEXTS[url], // this is the actual document that was loaded
      documentUrl: url, // this is the actual context URL after redirects
    };
  }

  return nodeDocumentLoader(url);
};

// @ts-expect-error 1. Get projectId
const projectId = "46808fcc7a91e0856a6734652cf14fa2";

if (!projectId) {
  throw new Error("VITE_PROJECT_ID is not set");
}

// 2. Create wagmiConfig
const chains = [mainnet, bsc, polygon, moonbeam, moonriver];
const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata: {
    name: "Web3Modal Vue Example",
    description: "Web3Modal Vue Example",
    url: "",
    icons: [],
    verifyUrl: "",
  },
});

// 3. Create modal
const w3modal = createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  themeMode: "light",
  themeVariables: {
    "--w3m-color-mix": "#00BB7F",
    "--w3m-color-mix-strength": 20,
  },
});

w3modal.subscribeEvents((e) => {
  console.log(JSON.stringify(e.data));
  if (
    (e.data.event == "MODAL_CLOSE" || e.data.event == "CONNECT_SUCCESS") &&
    (e.data.properties.connected == true ||
      e.data.properties.method == "browser")
  )
    generateDidEVM();
  // alert(JSON.stringify(e.data.properties));
});

// 4. Use modal composable
const modal = useWeb3Modal();
const state = useWeb3ModalState();
const { setThemeMode, themeMode, themeVariables } = useWeb3ModalTheme();
const events = useWeb3ModalEvents();
const store = reactive({
  signature: "",
});

const domain = {};

const types = {
  Person: [
    { name: "name", type: "string" },
    { name: "wallet", type: "address" },
  ],
  Mail: [
    { name: "from", type: "Person" },
    { name: "to", type: "Person" },
    { name: "contents", type: "string" },
  ],
};

const message = {
  from: {
    name: "Cow",
    wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
  },
  to: {
    name: "Bob",
    wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
  },
  contents: "Hello, Bob!",
};
async function signWC(chainId) {
  try {
    const signature = await signTypedData(wagmiConfig, {
      domain,
      message,
      primaryType: "Mail",
      types,
    });
    store.signature = signature;
  } catch (e) {
    console.log(e);
  }
}

async function generateDidEVM() {
  // console.log(CoreConstants);
  console.log(wagmiConfig.state.current);
  console.log(wagmiConfig.connectors);
  const providers = [];
  const connetor = wagmiConfig.connectors.filter(
    (e) => e.uid == wagmiConfig.state.current
  );

  const provider = await Promise.resolve(connetor[0].getProvider());

  console.log(provider);
  provider.enable({});
  provider.on("display_uri", (data) => {
    console.log(data);
    window.open(data);
  });

  // await connect(wagmiConfig, { connector, chainId: "0x1" });
  // console.log(
  //   await signTypedData(wagmiConfig, {
  //     domain,
  //     message,
  //     primaryType: "Mail",
  //     types,
  //   })
  // );
  //   const provider = await UniversalProvider.init({
  //     projectId: projectId,
  //     metadata: {
  //       name: "React App",
  //       description: "Cosmes",
  //       url: "https://walletconnect.com/",
  //       icons: ["https://avatars.githubusercontent.com/u/37784886"],
  //     },
  //     client: await SignClient.init({
  //       projectId
  //     })
  //   });
  //   provider.on('display_uri', uri => {
  //   console.log('display_uri', uri)
  // })
  //  const data= await provider.connect({
  //     optionalNamespaces: {
  //       eip155: {
  //         methods: [
  //           "eth_sendTransaction",
  //           "eth_signTransaction",
  //           "eth_sign",
  //           "personal_sign",
  //           "eth_signTypedData",
  //         ],
  //         chains: ["eip155:1"],
  //         events: ["chainChanged", "accountsChanged"],
  //         rpcMap: {
  //           1:
  //             `https://rpc.walletconnect.com?chainId=eip155:1&projectId=${projectId}` ,
  //         },
  //       },
  //     },
  //     // pairingTopic: "<123...topic>", // optional topic to connect to
  //     // skipPairing: false, // optional to skip pairing ( later it can be resumed by invoking .pair())
  //   });
  // console.log(data);
  //   console.log(
  //     await provider.request({
  //       method: "eth_requestAccounts",
  //       params: [],
  //     })
  //   );

  //   console.log(provider);

  // const provider = await EthereumProvider.init({
  //   projectId,
  //   chains: [1],
  //   showQrModal: true,

  // });

  // provider.on("display_uri", (args) => {
  //   console.log(args);
  // });

  // const accounts = await provider.enable()
  // console.log(provider.request({
  //   method:"eth_requestAccounts",
  // }));

  // console.log(provider);

  const didSdk = new HypersignDID({
    namespace: "testnet",
    nodeRestEndpoint: "https://api.prajna.hypersign.id",
    nodeRpcEndpoint: "https://rpc.prajna.hypersign.id",
  });

  const address = getAccount(wagmiConfig).address;
  const chainId = "0x" + getAccount(wagmiConfig).chainId.toString(16);
  console.log(getAccount(wagmiConfig));

  const didDoc = await didSdk.createByClientSpec({
    methodSpecificId: address,
    address: address,
    clientSpec: "eth-personalSign",
    chainId,
  });
  delete didDoc.keyAgreement;
  const eth = new EthereumEip712Signature2021(
    {},
    { _provider: provider, signTypedData, config: wagmiConfig }
  );
  const proof = await jsSig.sign(didDoc, {
    suite: eth,
    purpose: new purposes.AuthenticationProofPurpose({
      controller: {
        "@context": ["https://w3id.org/security/v2"],
        id: didDoc.authentication[0],
        authentication: didDoc.authentication,
      },
      challenge: "112a155f-7a6d-46c8-b18c-fc032d650ecc",
      domain: "https://authserver.hypersign.id/",
    }),
    documentLoader: docloader,
  });
  console.log(proof);

  // const sign = await didSdk.signByClientSpec({
  //   didDocument: didDoc,
  //   clientSpec: "eth-personalSign",
  //   address: address,
  //   web3: provider,
  // });
  // console.log(sign);
}
</script>

<template>
  <button @click="modal.open({ view: 'Connect' })">Open Connect Modal</button>
  <button @click="modal.open({ view: 'Networks' })">Open Network Modal</button>
  <button @click="setThemeMode(themeMode === 'dark' ? 'light' : 'dark')">
    Toggle Theme Mode
  </button>
  <button @click="signWC(getAccount(wagmiConfig).chainId)">
    Sign TypedData
  </button>

  <pre>{{ JSON.stringify(state, null, 2) }}</pre>
  <pre>{{ JSON.stringify(events, null, 2) }}</pre>

  <pre
    v-if="
      events.data?.properties?.connected == true ||
      events.data.event == 'CONNECT_SUCCESS'
    "
  >
Address:   {{ getAccount(wagmiConfig).address }}</pre
  >

  <pre>Signature : {{ store.signature }}</pre>

  <div
    class="row"
    style="width: fit-content; height: fit-content; padding: 5px"
  >
    <h1>DID</h1>
    <button @click="generateDidEVM">Generate DID</button>
  </div>
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
