export default {
  registerCoach(state, data) {
    state.coaches.push(data);
  },

  setCoach(state, data) {
    state.coaches = data;
  },

  setFetchTimestamp(state) {
    state.lastFetch = new Date().getTime();
  },
};
