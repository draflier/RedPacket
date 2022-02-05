import Web3Modal from "web3modal";
//import Web3 from "web3";
import {ethers} from "ethers";

const state = {
  activeAccount: null,
  activeBalance: 0,
  chainId: null,
  chainName: null,
  chainInfoMsg: "Please connect your EVM Web3 Wallet",
  provider: null,
  isConnected: false,
  providerW3m: null, // this is "provider" from Web3Modal
  web3Modal: null
};

const getters = {
  getActiveAccount(state) {
    if (!state.activeAccount) {
      return window.ethereum.selectedAddress;
    }

    return state.activeAccount;
  },
  getActiveBalanceWei(state) {
    return state.activeBalance;
  },
  getActiveBalanceEth(state) {
    return state.ethers.utils.parseEther(state.activeBalance);
  },
  getChainId(state) {
    return state.chainId;
  },
  getChainName(state) {
    return state.chainName;
  },
  getChainInfoMsg(state) {
    return state.chainInfoMsg;
  },
  getEthers(state) {
    if (state.provider) {
      return state.provider;
    } else {
      return new ethers.providers.Web3Provider(state.providerW3m);
    }
  },
  getWeb3Modal(state) {
    return state.web3Modal;
  },
  isUserConnected(state) {
    return state.isConnected;
  }
};

const actions = {

  async initWeb3Modal({ commit }) {
    const providerOptions = {
      // MetaMask is enabled by default
      // Find other providers here: https://github.com/Web3Modal/web3modal/tree/master/docs/providers
    };
    
    const w3mObject = new Web3Modal({
      cacheProvider: true, // optional
      providerOptions // required
    });

    // This will get deprecated soon. Setting it to false removes a warning from the console.
    window.ethereum.autoRefreshOnNetworkChange = false;

    // if the user is flagged as already connected, automatically connect back to Web3Modal
    if (localStorage.getItem('isConnected') === "true") {
      let providerW3m = await w3mObject.connect();
      commit("setIsConnected", true);

      commit("setActiveAccount", window.ethereum.selectedAddress);
      commit("setChainData", window.ethereum.chainId);
      commit("setWeb3Provider", providerW3m);
      let strMsg = "You are currently connected. \n" + window.ethereum.selectedAddress + "\n (" + resolveChainName(window.ethereum.chainId) + ")";
      actions.storeChainInfoMsg({commit, strMsg});
    }

    commit("setWeb3ModalInstance", w3mObject);
  },

  async connectWeb3Modal({ commit }) {
    console.log("Inside connect web3 modal function");
    let providerW3m = await state.web3Modal.connect();
    commit("setIsConnected", true);

    commit("setActiveAccount", window.ethereum.selectedAddress);
    await commit("setChainData", window.ethereum.chainId);
    commit("setWeb3Provider", providerW3m);
    //actions.getChainId(commit);
    //actions.storeChainInfoMsg(commit, strMsg);
    let strMsg = "You are currently connected. \n" + window.ethereum.selectedAddress + "\n (" + resolveChainName(window.ethereum.chainId) + ")";
    actions.storeChainInfoMsg({commit, strMsg});

  },


  async disconnectWeb3Modal({ commit }) {
    commit("disconnectWallet");
    commit("setIsConnected", false);
    commit("setChainInfoMsg", "");
  },

  async ethereumListener({ commit }) {

    window.ethereum.on('accountsChanged', (accounts) => {
      if (state.isConnected) {
        commit("setActiveAccount", accounts[0]);
        commit("setWeb3Provider", state.providerW3m);
        let strMsg = "You are currently connected. \n" + window.ethereum.selectedAddress + "\n (" + resolveChainName(window.ethereum.chainId) + ")";
    actions.storeChainInfoMsg({commit, strMsg});
      }
    });

    window.ethereum.on('chainChanged', (chainId) => {
      commit("setChainData", chainId);
      commit("setWeb3Provider", state.providerW3m);
      let strMsg = "You are currently connected. \n" + window.ethereum.selectedAddress + "\n (" + resolveChainName(window.ethereum.chainId) + ")";
    actions.storeChainInfoMsg({commit, strMsg});
    });

  },

  async fetchActiveBalance({ commit }) {
    let balance = await state.ethers.getBalance(state.activeAccount);
    commit("setActiveBalance", balance);
  },

  async storeChainInfoMsg({ commit, strMsg } ) {
    console.log("strMsg => "+ strMsg);
    commit("setChainInfoMsg", strMsg);
  }
  
};

const mutations = {

  async disconnectWallet(state) {
    console.log("disconnect wallet")
    state.activeAccount = null;
    state.activeBalance = 0;
    state.ethers = null;
    if (state.providerW3m.close && state.providerW3m !== null) {
      await state.providerW3m.close();
    }
    state.providerW3m = null;
    await state.web3Modal.clearCachedProvider();

    window.location.href = '../'; // redirect to the Main page
  },

  setActiveAccount(state, selectedAddress) {
    state.activeAccount = selectedAddress;
  },

  setActiveBalance(state, balance) {
    state.activeBalance = balance;
  },

  setChainData(state, chainId) {
    state.chainId = chainId;
    state.chainName = resolveChainName(chainId);
    
    
  },

  setChainInfoMsg(state, strMsg)
  {
    state.chainInfoMsg = strMsg;
  },

  async setWeb3Provider(state, providerW3m) {
    console.log("Setting provider")
    state.providerW3m = providerW3m;
    state.provider = new ethers.providers.Web3Provider(providerW3m);
    console.log(state.provider);
  },

  setIsConnected(state, isConnected) {
    state.isConnected = isConnected;
    // add to persistent storage so that the user can be logged back in when revisiting website
    localStorage.setItem('isConnected', isConnected);
  },

  setWeb3ModalInstance(state, w3mObject) {
    state.web3Modal = w3mObject;
  }

};

function resolveChainName(strChainID)
{
  let strChainName;
  switch(strChainID) {
    case "0x1":
      strChainName = "Mainnet";
      break;
    case "0x2a":
      strChainName = "Kovan";
      break;
    case "0x3":
      strChainName = "Ropsten";
      break;
    case "0x4":
      strChainName = "Rinkeby";
      break;
    case "0x5":
      strChainName = "Goerli";
      break;
    case "0x61":
      strChainName = "BSC Testnet";
      break;
    case "0x539": // 1337 (often used on localhost)
    case "0x1691": // 5777 (default in Ganache)
    default:
      strChainName = "Localhost";
      break;
  }
  return strChainName;
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
