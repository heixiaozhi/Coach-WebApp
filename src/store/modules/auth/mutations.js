export default {
  setUser(state, paylaod) {
    state.token = paylaod.token;
    state.userId = paylaod.userId;
    state.didAutoLogout = false;
  },
  setAutoLogout(state) {
    state.didAutoLogout = true;
  },
};
