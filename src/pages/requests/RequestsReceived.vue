<template>
  <div>
    <base-dialog
      :show="!!error"
      title="An error occurred!"
      @close="handleError"
    >
      {{ error }}
    </base-dialog>
    <section>
      <base-card>
        <header>
          <h2>Requests Received</h2>
        </header>
        <div v-if="isLoading">
          <base-spinner></base-spinner>
        </div>
        <ul v-else-if="hasRequests">
          <request-item
            v-for="request in receivedRequests"
            :key="request.id"
            :email="request.userEmail"
            :message="request.message"
          ></request-item>
        </ul>
        <h3 v-else>You haven't received any requests yet!</h3>
      </base-card>
    </section>
  </div>
</template>

<script>
import requestItem from '../../components/requests/requestItem.vue';

export default {
  components: {
    requestItem,
  },
  data() {
    return {
      error: null,
      isLoading: true,
    };
  },
  computed: {
    hasRequests() {
      return !this.isLoading && this.$store.getters['requests/hasRequests'];
    },
    receivedRequests() {
      console.log(this.$store.getters['requests/requests']);
      return this.$store.getters['requests/requests'];
    },
  },
  created() {
    this.loadRequests();
  },
  methods: {
    async loadRequests() {
      this.isLoading = true;
      // 加载动画
      try {
        await this.$store.dispatch('requests/loadRequests');
      } catch (error) {
        this.error = error.message || 'Someting went wrong!';
      }
      this.isLoading = false;
    },
    handleError() {
      this.error = null;
    },
  },
};
</script>

<style scoped>
header {
  text-align: center;
}

ul {
  list-style: none;
  margin: 2rem auto;
  padding: 0;
  max-width: 30rem;
}

h3 {
  text-align: center;
}
</style>
