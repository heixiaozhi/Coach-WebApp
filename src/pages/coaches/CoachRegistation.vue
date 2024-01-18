<template>
  <section>
    <base-card>
      <h2>Register as a coach now!</h2>
      <coach-form @save-data="submitData"></coach-form>
    </base-card>
  </section>
</template>

<script>
import CoachForm from '../../components/coaches/CoachForm.vue';
export default {
  components: {
    CoachForm,
  },
  methods: {
    submitData(data) {
      this.$store.dispatch('coaches/registerCoach', data);
      // 替换url地址，不会像push那样可以返回上一步
      this.$router.replace('/coaches');
    },
  },
};
</script>

<style></style>
