<template>
  <div>
    <section>
      <base-card>
        <h2>{{ fullName }}</h2>
        <h3>${{ rate }}/hour</h3>
      </base-card>
    </section>
    <section>
      <base-card>
        <header>
          <h2>Interested? Reach out now!</h2>
          <base-button link :to="contactLink">Contact</base-button>
        </header>
        <router-view></router-view>
      </base-card>
    </section>
    <section>
      <base-card>
        <base-badge
          v-for="area in areas"
          :key="area"
          :title="area"
          :type="area"
        ></base-badge>
        <p>{{ description }}</p>
      </base-card>
    </section>
  </div>
</template>

<script>
export default {
  props: ['id'],
  data() {
    return {
      selectCoach: null,
    };
  },
  computed: {
    fullName() {
      return this.selectCoach.firstName + ' ' + this.selectCoach.lastName;
    },
    contactLink() {
      return this.$route.path + '/contact';
    },
    rate() {
      return this.selectCoach.hourlyRate;
    },
    areas() {
      return this.selectCoach.areas;
    },
    description() {
      return this.selectCoach.description;
    },
  },
  beforeRouteEnter() {
    console.log('before');
  },
  created() {
    this.selectCoach = this.$store.getters['coaches/coaches'].find(
      (coach) => coach.id === this.id
    );
  },
};
</script>

<style></style>
