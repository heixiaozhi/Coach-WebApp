export default {
  async contactCoach(context, payload) {
    const newRequests = {
      userEmail: payload.email,
      message: payload.message,
    };
    console.log(payload.coachId);
    const response = await fetch(
      `https://vue-test-6df26-default-rtdb.firebaseio.com/requests/${payload.coachId}.json`,
      {
        method: 'POST',
        body: JSON.stringify(newRequests),
      }
    );
    const responseData = await response.json();
    if (!response.ok) {
      const error = new Error(responseData.error || 'Filed to send requests.');
      throw error;
    }
    newRequests.id = responseData.name;
    newRequests.coachId = payload.coachId;

    context.commit('addRequest', newRequests);
  },

  async loadRequests(context) {
    const coachId = context.rootGetters.userId;
    const token = context.rootGetters.token;
    const response = await fetch(
      `https://vue-test-6df26-default-rtdb.firebaseio.com/requests/${coachId}.json?auth=${token}`
    );
    const responseData = await response.json();
    if (!response.ok) {
      // 处理错误
      const error = new Error(responseData.message || 'Failed to fetch!');
      console.log(error);
      throw error;
    }

    // 将服务器数据格式处理为自己的
    const requests = [];
    for (const key in responseData) {
      const req = {
        id: key,
        coachId: coachId,
        userEmail: responseData[key].userEmail,
        message: responseData[key].message,
      };
      requests.push(req);
    }

    context.commit('setRequests', requests);
  },
};
