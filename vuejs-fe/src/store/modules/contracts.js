import Vault from "../../../../hardhat/artifacts/contracts/Vault.sol/Vault.json";
import IErc20Token from "../../../../hardhat/artifacts/contracts/IERC20.sol/IERC20.json";
import addresses from "../../../../hardhat/hardhat_cfg.json";
import {ethers} from "ethers";


const state = {
  strVaulKey:"hahahah",
  vaultAbi: null,
  vaultContract: null,
  IErc20Abi: null,
  IErc20Contract: null
};

const getters = {
  getApproveAmt(state) {
    return state.intApproveAmt;
  },
  getDepositAmt(state) {
    return state.intDepositAmt;
  },
  getVaultKey(state) {
    return state.strVaulKey;
  },
  getRetrieveAmt(state) {
    return state.intDepositAmt;
  },
  getVaultAbi(state) {
    return state.vaultAbi;
  },
  //TODO implement vault address for different chain IDs.
  /*
  getVaultAddress(state) {
    return state.vaultAddress;
  },
  */
  getVaultContract(state) {
    return state.vaultContract;
  },
  getIErc20Abi(state) {
    return state.IErc20Abi;
  },
  getIErc20Address(state) {
    return state.IErc20Address;
  },
  getIErc20Contract(state) {
    return state.IErc20Contract;
  }
};

const actions = {
  async fetchVaultContract({ commit, rootState }) {
    console.log("Inside fetchVaultContract");
    let provider = rootState.accounts.provider;
    console.log(provider);
    let haha = rootState.accounts.activeBalance;
    console.log(haha);
    let vaultAddress = addresses.vault_addr;
    console.log(vaultAddress);
    console.log(Vault.abi);
    let signer = provider.getSigner();
    let contract = new ethers.Contract(vaultAddress,Vault.abi, signer);
    console.log("hihi");
    console.log(contract);
    commit("setVaultContract", contract);
  },

  async fetchIErc20Contract({ commit, rootState }) {
    console.log("Inside fetchIErc20Contract");
    let provider = rootState.accounts.provider;
    let vaultContract = state.vaultContract;
    console.log(vaultContract);
    let addrIErc20 = null;
    if (vaultContract != null)
    {      
      addrIErc20 = await vaultContract.getSupportedToken();
    }
    console.log(" addrIErc20 ==> " + addrIErc20);
    let signer = provider.getSigner();
    let contract = new ethers.Contract(addrIErc20,IErc20Token.abi,signer);
    commit("setIErc20Contract", contract);
  },
  async storeVaultKey({ commit, state }) {
    if (!state.vaultContract) {
      this.fetchVaultContract();
    }

    let strVaultKey = await state.vaultContract.getVaultKey();

    commit("setVaultKey", strVaultKey);
  },
  storeVaultAbi({commit}) {
    commit("setVaultAbi", Vault.abi);
  },
  storeVaultAddress({ commit }) {
    let vaultAddress = addresses.vault_addr;

    commit("setVaultAddress", vaultAddress);
  }
};

const mutations = {
  setVaultKey(state, strVaultKey) {
    state.strVaulKey = strVaultKey;
  },
  setVaultAbi(state, abi) {
    state.vaultAbi = abi;
  },
  setVaultAddress(state, address) {
    state.vaultAddress = address;
  },
  setVaultContract(state, _contract) {
    state.vaultContract = _contract;
  },
  setIErc20Abi(state, abi) {
    state.vaultAbi = abi;
  },
  setIErc20Address(state, address) {
    state.IErc20Address = address;
  },
  setIErc20Contract(state, _contract) {
    state.IErc20Contract = _contract;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
