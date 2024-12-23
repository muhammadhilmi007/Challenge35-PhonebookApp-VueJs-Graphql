<template>
  <div class="landing-page">
    <SearchBar
      @search="handleSearch"
      @sort-change="handleSort"
    />

    <div class="main-content">
      <ContactList
        :contacts="contacts"
        :loading="loading"
        :hasMore="hasMore"
        :sortAscending="sortAscending"
        :searchQuery="searchQuery"
        @load-more="handleLoadMore"
        @edit="handleEdit"
        @delete="confirmDelete"
        @avatar-update="handleAvatarUpdate"
      />
    </div>

    <!-- Add Contact Button -->
    <button class="fab" @click="handleAddClick">
      <i class="fas fa-plus"></i>
    </button>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal">
        <h3>Confirm Delete</h3>
        <p>Apakah anda yakin ingin menghapus data ini?</p>
        <div class="modal-actions">
          <button @click="handleDelete" class="btn-delete">Delete</button>
          <button @click="showDeleteModal = false" class="btn-cancel">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import SearchBar from '../components/SearchBar.vue'
import ContactList from '../components/ContactList.vue'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { GET_CONTACTS } from '../graphql/queries'
import { DELETE_CONTACT, UPLOAD_PHOTO } from '../graphql/mutations'

export default {
  name: 'LandingPage',
  components: {
    SearchBar,
    ContactList
  },
  setup() {
    const router = useRouter()
    const contacts = ref([])
    const loading = ref(false)
    const error = ref('')
    const hasMore = ref(true)
    const offset = ref(0)
    const limit = ref(10)
    const searchQuery = ref('')
    const sortAscending = ref(true)
    const showDeleteModal = ref(false)
    const contactToDelete = ref(null)

    const { result, loading: queryLoading, fetchMore, refetch } = useQuery(GET_CONTACTS, {
      variables: {
        search: searchQuery.value,
        sortOrder: sortAscending.value ? 'asc' : 'desc',
        offset: offset.value,
        limit: limit.value
      },
      notifyOnNetworkStatusChange: true
    })

    watch(result, (newResult) => {
      if (newResult?.contacts) {
        if (offset.value === 0) {
          contacts.value = newResult.contacts
        } else {
          // Create a Set of existing contact IDs
          const existingIds = new Set(contacts.value.map(c => c.id))
          // Only add new contacts that don't already exist
          const newContacts = newResult.contacts.filter(contact => !existingIds.has(contact.id))
          contacts.value = [...contacts.value, ...newContacts]
        }
        hasMore.value = newResult.contacts.length === limit.value
      }
    })

    watch(searchQuery, () => {
      offset.value = 0
      refetch()
    })

    watch(sortAscending, () => {
      offset.value = 0
      refetch()
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
            sortOrder: sortAscending.value ? 'asc' : 'desc'
          }
        })
      } catch (err) {
        error.value = 'Error loading more contacts'
      } finally {
        loading.value = false
      }
    }

    const handleSearch = async (query) => {
      searchQuery.value = query
      offset.value = 0
      await refetch()
    }

    const handleSort = async (ascending) => {
      sortAscending.value = ascending
      offset.value = 0
      await refetch()
    }

    const confirmDelete = (contact) => {
      contactToDelete.value = contact
      showDeleteModal.value = true
    }

    const handleDelete = async () => {
      if (!contactToDelete.value) return

      try {
        await deleteContact({ variables: { id: contactToDelete.value.id } })
        contacts.value = contacts.value.filter(c => c.id !== contactToDelete.value.id)
        showDeleteModal.value = false
        contactToDelete.value = null
      } catch (err) {
        error.value = 'Error deleting contact'
      }
    }

    const handleAvatarUpdate = async ({ id, file }) => {
      try {
        await uploadPhoto({ variables: { id, file } })
        await refetch()
      } catch (err) {
        error.value = 'Error updating avatar'
      }
    }

    const handleAddClick = () => {
      router.push('/add')
    }

    const handleEdit = (contact) => {
      // Implement edit functionality
      console.log('Edit contact:', contact)
    }

    onMounted(() => {
      refetch()
    })

    return {
      contacts,
      loading,
      error,
      hasMore,
      searchQuery,
      sortAscending,
      showDeleteModal,
      handleLoadMore,
      handleSearch,
      handleSort,
      handleDelete,
      confirmDelete,
      handleAvatarUpdate,
      handleAddClick,
      handleEdit
    }
  }
}
</script>

<style scoped>
.landing-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  position: relative;
  padding-bottom: 80px;
}

.main-content {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
}

.modal h3 {
  margin: 0 0 16px 0;
  color: #333;
}

.modal p {
  margin: 0 0 24px 0;
  color: #666;
}

.modal-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
}

.btn-delete, .btn-cancel {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.btn-delete {
  background-color: #f44336;
  color: white;
}

.btn-cancel {
  background-color: #e0e0e0;
  color: #333;
}

/* Responsive Design */
@media (max-width: 600px) {
  .main-content {
    padding: 10px;
  }

  .fab {
    bottom: 16px;
    right: 16px;
    width: 48px;
    height: 48px;
    font-size: 20px;
  }
}
</style>