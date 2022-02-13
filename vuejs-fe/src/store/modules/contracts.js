import Vault from "../../artifacts/Vault.json";
import IErc20Token from "../../artifacts/IERC20.json";
import addresses from "../../artifacts/hardhat_cfg.json";
import {ethers} from "ethers";


const state = {
  strVaulKey:"",
  strRedeemURL:"",
  strDepositedMsg: "",
  vaultAbi: null,
  vaultContract: null,
  IErc20Abi: null,
  IErc20Contract: null,
  isERC20Approved: false,
  isDeposited: false,  
  isLoading: false,  
  isRedeemed: false,  
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
  getRedeemURL(state) {
    return state.strRedeemURL;
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
  },
  getDepositedMsg(state) {
    return state.strDepositedMsg;
  },
  isERC20Approved(state) {
    return state.isERC20Approved;
  },
  isDeposited(state) {
    return state.isDeposited;
  },
  isLoading(state) {
    return state.isLoading;
  },
  isRedeemed(state) {
    return state.isRedeemed;
  },
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
  storeRedeemURL({commit}, strRedeemURL) {
    commit("setRedeemURL", strRedeemURL);
  },
  storeVaultAbi({commit}) {
    commit("setVaultAbi", Vault.abi);
  },
  storeVaultAddress({ commit }) {
    let vaultAddress = addresses.vault_addr;

    commit("setVaultAddress", vaultAddress);
  },
  storeIsERC20Approved({commit})
  {
    commit("setIsERC20Approved", true);
  },
  storeIsDeposited({commit})
  {
    commit("setDeposited", true);
  },
  async storeDepositedMsg({commit}, strMsg)
  {
    commit("setDepositedMsg", strMsg);
  },
  async storeIsLoading({commit}, blnLoading)
  {
    commit("setIsLoading", blnLoading);
  },
  async storeIsRedeemed({commit}, blnRedeemed)
  {
    commit("setIsRedeemed", blnRedeemed);
  },
};

const mutations = {
  setVaultKey(state, strVaultKey) {
    state.strVaulKey = strVaultKey;
  },
  setRedeemURL(state, strRedeemURL) {
    state.strRedeemURL = strRedeemURL;
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
  },
  setIsERC20Approved(state, blnERC20Approved) {
    state.isERC20Approved = blnERC20Approved;
  },
  setDeposited(state, blnDeposited) {
    state.isDeposited = blnDeposited;
  },
  setDepositedMsg(state, strMsg)
  {
    state.strDepositedMsg = strMsg;
  },
  setIsLoading(state,blnLoading)
  {
    state.isLoading = blnLoading;
  },
  setIsRedeemed(state,blnRedeemed)
  {
    state.isRedeemed = blnRedeemed;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
