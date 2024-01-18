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
      <coach-filter @change-filter="setFilter"></coach-filter>
    </section>
    <base-card>
      <section>
        <div class="controls">
          <base-button @click="loadCoaches(true)" mode="outline"
            >Refresh</base-button
          >
          <base-button link to="/auth?redirect=register" v-if="!isLoggedIn"
            >Login and Register as Coach</base-button
          >
          <!-- props 传递Boolean只写名字默认true -->
          <!-- 登陆+不是教练+没有加载 -->
          <base-button
            v-if="isLoggedIn && !isCoach && !isLoading"
            link
            to="/register"
            >Register as Coach</base-button
          >
        </div>
        <div v-if="isLoading">
          <base-spinner></base-spinner>
        </div>
        <ul v-else-if="hasCoaches">
          <coach-item
            v-for="coach in filteredCoaches"
            :key="coach.id"
            :id="coach.id"
            :firstName="coach.firstName"
            :lastName="coach.lastName"
            :areas="coach.areas"
            :rate="coach.hourlyRate"
          >
          </coach-item>
        </ul>
        <h3 v-else>List of coaches</h3>
      </section>
    </base-card>
  </div>
</template>

<script>
import CoachItem from '../../components/coaches/CoachItem.vue';
import CoachFilter from '../../components/coaches/CoachFilter.vue';

export default {
  components: {
    CoachItem,
    CoachFilter,
  },
  data() {
    return {
      error: null,
      isLoading: true,
      activeFilters: {
        frontend: true,
        backend: true,
        career: true,
      },
    };
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isAuthenticated;
    },
    isCoach() {
      return this.$store.getters['coaches/isCoach'];
    },
    filteredCoaches() {
      const coaches = this.$store.getters['coaches/coaches'];
      // 这里过滤只是包含一项，如果是都包含&&多个条件
      return coaches.filter((coach) => {
        if (coach.areas.includes('frontend') && this.activeFilters.frontend) {
          return true;
        }
        if (coach.areas.includes('backend') && this.activeFilters.backend) {
          return true;
        }
        if (coach.areas.includes('career') && this.activeFilters.career) {
          return true;
        }
        return false;
      });
    },
    hasCoaches() {
      return !this.isLoading && this.$store.getters['coaches/hasCoaches'];
    },
  },
  created() {
    this.loadCoaches();
  },
  methods: {
    setFilter(updatedFilter) {
      this.activeFilters = updatedFilter;
    },
    async loadCoaches(refresh = false) {
      this.isLoading = true;
      // 加载动画
      try {
        await this.$store.dispatch('coaches/loadCoaches', {
          forceRefresh: refresh,
        });
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
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.controls {
  display: flex;
  justify-content: space-between;
}
</style>
