export default {
  async registerCoach(context, data) {
    const userId = context.rootGetters.userId;
    const coachData = {
      firstName: data.first,
      lastName: data.last,
      description: data.desc,
      hourlyRate: data.rate,
      areas: data.areas,
    };

    const token = context.rootGetters.token;
    //提交到服务器 firebase put方法每次更新
    const response = await fetch(
      `https://vue-test-6df26-default-rtdb.firebaseio.com/coaches/${userId}.json?auth=${token}`,
      {
        method: 'PUT',
        body: JSON.stringify(coachData),
      }
    );

    // const responseData = await response.json();

    if (!response.ok) {
      // 处理错误
    }
    // 提交到mutations
    context.commit('registerCoach', {
      ...coachData,
      id: userId,
    });
  },

  async loadCoaches(context, payload) {
    // 手动刷新时获取新数据
    // 或组件切换时时间够刷新了去刷新
    if (!payload.forceRefresh && !context.getters.shouldUpdate) {
      return;
    }

    const response = await fetch(
      'https://vue-test-6df26-default-rtdb.firebaseio.com/coaches.json'
    );
    const responseData = await response.json();
    if (!response.ok) {
      // 处理错误
      const error = new Error(responseData.message || 'Failed to fetch!');
      console.log(error);
      throw error;
    }

    // 将服务器数据格式处理为自己的
    const coaches = [];
    for (const key in responseData) {
      const coach = {
        firstName: responseData[key].firstName,
        lastName: responseData[key].lastName,
        description: responseData[key].description,
        hourlyRate: responseData[key].hourlyRate,
        areas: responseData[key].areas,
        id: key,
      };
      coaches.push(coach);
    }

    context.commit('setCoach', coaches);
    context.commit('setFetchTimestamp');
  },
};
