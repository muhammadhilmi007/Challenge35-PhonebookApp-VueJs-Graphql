<template>
  <div class="search-bar">
    <div class="search-container">
      <button class="nav-btn" @click="toggleSort">
        <i :class="['fa-solid', sortAscending ? 'fa-arrow-up-a-z' : 'fa-arrow-down-a-z']"></i>
      </button>
      
      <div class="search-input-container">
        <i class="fas fa-search search-icon"></i>
        <input
          type="text"
          v-model="searchQuery"
          @input="handleSearch"
          placeholder="Search contacts..."
          class="search-input"
        />
      </div>

      <button class="nav-btn" @click="navigateToAdd">
        <i class="fas fa-user-plus"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import debounce from 'lodash.debounce'

export default {
  name: 'SearchBar',
  emits: ['search', 'sort-change'],
  
  setup(props, { emit }) {
    const router = useRouter()
    const searchQuery = ref('')
    const sortAscending = ref(true)
    
    const debouncedSearch = debounce((value) => {
      emit('search', value)
    }, 300)
    
    const handleSearch = () => {
      debouncedSearch(searchQuery.value)
    }

    const toggleSort = () => {
      sortAscending.value = !sortAscending.value
      emit('sort-change', sortAscending.value)
    }

    const navigateToAdd = () => {
      router.push({ name: 'Add' })
    }
    
    return {
      searchQuery,
      handleSearch,
      sortAscending,
      toggleSort,
      navigateToAdd
    }
  }
}
</script>

<style scoped>
.search-bar {
  padding: 16px;
  background-color: white;
  border-bottom: 1px solid #eee;
}

.search-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-btn {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #B8860B;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: white;
  font-size: 20px;
}

.nav-btn:hover {
  background-color: #906c0a;
}

.search-input-container {
  flex-grow: 1;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  font-size: 16px;
}

.search-input {
  width: 100%;
  height: 48px;
  padding: 0 16px 0 48px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  border-color: #B8860B;
}

@media (max-width: 768px) {
  .search-bar {
    padding: 12px;
  }

  .nav-btn {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }

  .search-input {
    height: 40px;
  }
}
</style>