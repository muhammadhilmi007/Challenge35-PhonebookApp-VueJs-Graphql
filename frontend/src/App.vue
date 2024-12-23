<template>
  <div class="app">
    <SearchBar
      @search="handleSearch"
      @sort="handleSort"
    />

    <div class="main-content">
      <ContactList
        :contacts="contacts"
        :loading="loading"
        :hasMore="hasMore"
        @load-more="handleLoadMore"
        @edit="handleEdit"
        @delete="handleDelete"
        @avatar-update="handleAvatarUpdate"
      />
    </div>

    <button class="fab" @click="showAddForm = true">
      <i class="fas fa-plus"></i>
    </button>

    <AddContact
      v-if="showAddForm"
      @close="showAddForm = false"
      @save="handleAdd"
    />

    <div v-if="error" class="error-message">
      <i class="fas fa-exclamation-circle"></i>
      {{ error }}
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { GET_CONTACTS } from './graphql/queries'
import { DELETE_CONTACT, UPLOAD_PHOTO } from './graphql/mutations'
import SearchBar from './components/SearchBar.vue'
import ContactList from './components/ContactList.vue'
import AddContact from './components/AddContact.vue'

export default {
  name: 'App',
  components: {
    SearchBar,
    ContactList,
    AddContact
  },

  setup() {
    const contacts = ref([])
    const loading = ref(false)
    const error = ref('')
    const showAddForm = ref(false)
    const hasMore = ref(true)
    const offset = ref(0)
    const limit = ref(10)
    const searchQuery = ref('')
    const sortBy = ref('name')
    const sortOrder = ref('asc')

    const { result, fetchMore, refetch } = useQuery(GET_CONTACTS, {
      variables: {
        search: searchQuery.value,
        sortBy: sortBy.value,
        sortOrder: sortOrder.value,
        offset: offset.value,
        limit: limit.value
      },
      notifyOnNetworkStatusChange: true
    })

    const { mutate: deleteContact } = useMutation(DELETE_CONTACT)
    const { mutate: uploadPhoto } = useMutation(UPLOAD_PHOTO)

    const handleLoadMore = async () => {
      if (loading.value || !hasMore.value) return
      
      try {
        loading.value = true
        offset.value += limit.value
        
        await fetchMore({
          variables: {
            offset: offset.value,
            limit: limit.value,
            search: searchQuery.value,
            sortBy: sortBy.value,
            sortOrder: sortOrder.value
          }
        })
        
        // Update hasMore based on the latest result
        const currentResult = result.value
        hasMore.value = currentResult?.contacts?.length === limit.value
      } catch (err) {
        error.value = 'Error loading more contacts'
        console.error('Load more error:', err)
      } finally {
        loading.value = false
      }
    }

    // Watch query results
    watch(result, (newResult) => {
      if (newResult?.contacts) {
        contacts.value = newResult.contacts
        hasMore.value = newResult.contacts.length === limit.value
      }
    }, { deep: true })

    // Watch for search changes
    watch(searchQuery, async (newValue) => {
      offset.value = 0
      await refetch({
        variables: {
          search: newValue,
          offset: 0,
          limit: limit.value,
          sortBy: sortBy.value,
          sortOrder: sortOrder.value
        }
      })
    })

    // Watch for sort changes
    watch([sortBy, sortOrder], async () => {
      offset.value = 0
      await refetch({
        variables: {
          search: searchQuery.value,
          offset: 0,
          limit: limit.value,
          sortBy: sortBy.value,
          sortOrder: sortOrder.value
        }
      })
    })

    const handleSearch = (query) => {
      searchQuery.value = query
    }

    const handleSort = (by, order) => {
      sortBy.value = by
      sortOrder.value = order
    }

    const handleDelete = async (id) => {
      try {
        const { data } = await deleteContact({ variables: { id } })
        if (data.deleteContact) {
          contacts.value = contacts.value.filter(c => c.id !== id)
        }
      } catch (err) {
        error.value = 'Error deleting contact'
      }
    }

    const handleAvatarUpdate = async (id, formData) => {
      try {
        const { data } = await uploadPhoto({
          variables: {
            id,
            file: formData.get('photo')
          }
        })
        if (data.uploadPhoto) {
          const index = contacts.value.findIndex(c => c.id === id)
          if (index !== -1) {
            contacts.value[index] = data.uploadPhoto
          }
        }
      } catch (err) {
        error.value = 'Error updating avatar'
      }
    }

    onMounted(() => {
      refetch()
    })

    return {
      contacts,
      loading,
      error,
      showAddForm,
      hasMore,
      handleSearch,
      handleSort,
      handleLoadMore,
      handleDelete,
      handleAvatarUpdate,
      handleEdit: (id) => {
        // Implement edit functionality
      },
      handleAdd: (contact) => {
        // Implement add functionality
      }
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Roboto', sans-serif;
  background-color: #f5f5f5;
  color: #333;
  line-height: 1.6;
}

.app {
  width: 100%;
  min-height: 100vh;
  padding-bottom: 80px;
  position: relative;
  background-color: #f5f5f5;
}

.main-content {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
}

@media only screen and (max-width: 600px) {
  .main-content {
    padding: 10px;
  }
}

.fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #B8860B;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  font-size: 24px;
  z-index: 1000;
}

.fab:hover {
  background-color: #906c0a;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.error-message {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #f44336;
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  animation: slideUp 0.3s ease;
  max-width: 90%;
  width: auto;
}

@keyframes slideUp {
  from {
    transform: translate(-50%, 100%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}

@media only screen and (max-width: 600px) {
  .fab {
    bottom: 16px;
    right: 16px;
    width: 48px;
    height: 48px;
    font-size: 20px;
  }

  .error-message {
    left: 16px;
    right: 16px;
    transform: none;
    width: auto;
    max-width: calc(100% - 32px);
  }
}
</style>