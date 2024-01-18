let timer;

export default {
  async login(context, payload) {
    return context.dispatch('auth', {
      ...payload,
      mode: 'login',
    });
  },

  async signup(context, payload) {
    return context.dispatch('auth', {
      ...payload,
      mode: 'signup',
    });
  },

  async auth(context, payload) {
    let url =
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBz3nSwVh-kCfN8s5uSUht2Ujfyd_DpM3M';

    if (payload.mode === 'login') {
      url =
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBz3nSwVh-kCfN8s5uSUht2Ujfyd_DpM3M';
    }

    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
        returnSecureToken: true,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      const error = new Error(
        responseData.message || 'Failed to authenticate.'
      );
      throw error;
    }

    const expiresIn = +responseData.expiresIn * 1000;
    // const expiresIn = 8000;
    const expirationData = new Date().getTime() + expiresIn;

    localStorage.setItem('token', responseData.idToken);
    localStorage.setItem('userId', responseData.localId);
    localStorage.setItem('tokenExpiration', expirationData);

    timer = setTimeout(function () {
      context.dispatch('autoLogout');
    }, expiresIn);

    context.commit('setUser', {
      token: responseData.idToken,
      userId: responseData.localId,
    });
  },

  tryLogin(context) {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const tokenExpiration = localStorage.getItem('tokenExpiration');

    const expiresIn = +tokenExpiration - new Date().getTime();

    if (expiresIn < 0) {
      return;
    }

    // 刷新浏览器，浏览器运行环境会重新加载，之前的setTimeout不会执行
    timer = setTimeout(function () {
      context.dispatch('autoLogout');
    }, expiresIn);

    if (token && userId) {
      context.commit('setUser', {
        token: token,
        userId: userId,
      });
    }
  },

  logout(context) {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('tokenExpiration');

    clearTimeout(timer);

    context.commit('setUser', {
      token: null,
      userId: null,
      tokenExpiration: null,
    });
  },

  autoLogout(context) {
    context.dispatch('logout');
    context.commit('setAutoLogout');
  },
};
