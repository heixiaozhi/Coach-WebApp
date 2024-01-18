<template>
  <div>
    <base-dialog
      :show="!!error"
      title="An error occurrend"
      @close="handleError"
    >
      <p>{{ error }}</p>
    </base-dialog>
    <base-dialog :show="isLoding" title="Authenticating..." fixed>
      <base-spinner></base-spinner>
    </base-dialog>
    <base-card>
      <form @submit.prevent="validataForm">
        <div>
          <label for="email">E-mail</label>
          <input type="email" id="email" v-model.trim="email" />
        </div>
        <div>
          <label for="password">Password</label>
          <input type="password" id="password" v-model.trim="password" />
        </div>
        <p v-if="!formIsValid">
          Please input current eamil and password length >= 6
        </p>
        <base-button>{{ submitButtonCaption }}</base-button>
        <base-button type="button" mode="flat" @click="switchAuthMode">{{
          switchModeButtonCaption
        }}</base-button>
      </form>
    </base-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      mode: 'login',
      formIsValid: true,
      error: null,
      isLoding: false,
    };
  },
  computed: {
    submitButtonCaption() {
      if (this.mode === 'login') {
        return 'Login';
      } else {
        return 'Signup';
      }
    },

    switchModeButtonCaption() {
      if (this.mode === 'login') {
        return 'Signup instead';
      } else {
        return 'Login instead';
      }
    },
  },
  methods: {
    async validataForm() {
      this.formIsValid = true;
      if (
        this.email === '' ||
        !this.email.includes('@') ||
        this.password === '' ||
        this.password.length < 6
      ) {
        this.formIsValid = false;
        return;
      }

      this.isLoding = true;

      const actionPayload = {
        email: this.email,
        password: this.password,
      };
      try {
        // fetch
        if (this.mode === 'login') {
          await this.$store.dispatch('login', actionPayload);
        } else {
          await this.$store.dispatch('signup', actionPayload);
        }

        const redirectUrl = '/' + (this.$route.query.redirect || 'coaches');
        this.$router.replace(redirectUrl);
      } catch (error) {
        console.log(error);
        this.error = error.message || 'Failed to authenticate, try later.';
      }

      this.isLoding = false;
    },
    switchAuthMode() {
      if (this.mode === 'login') {
        this.mode = 'signup';
      } else {
        this.mode = 'login';
      }
    },
    handleError() {
      this.error = null;
    },
  },
};
</script>

<style scoped>
form {
  margin: 1rem;
  padding: 1rem;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

input,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.15rem;
  margin-bottom: 1rem;
}

input:focus,
textarea:focus {
  border-color: #3d008d;
  background-color: #faf6ff;
  outline: none;
}
</style>
