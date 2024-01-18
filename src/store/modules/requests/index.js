import mutations from './mutations';
import getters from './getters.js';
import actions from './actions.js';

export default {
  namespaced: true,
  state() {
    return {
      requests: [],
    };
  },
  getters,
  mutations,
  actions,
};
