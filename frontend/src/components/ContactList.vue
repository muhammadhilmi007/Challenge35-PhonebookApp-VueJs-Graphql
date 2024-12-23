<template>
  <div class="contact-list">
    <div v-if="contacts.length === 0 && !loading" class="empty-state">
      No contacts found
    </div>

    <div class="contacts-grid">
      <ContactCard
        v-for="contact in sortedContacts"
        :key="contact.id"
        :contact="contact"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
        @avatar-update="$emit('avatar-update', $event)"
      />
    </div>

    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      Loading more contacts...
    </div>

    <div v-if="!hasMore && contacts.length > 0" class="end-message">
      No more contacts to load
    </div>

    <div ref="loadTrigger" class="load-trigger"></div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import ContactCard from './ContactCard.vue'

export default {
  name: 'ContactList',
  components: {
    ContactCard
  },
  props: {
    contacts: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    hasMore: {
      type: Boolean,
      default: true
    },
    sortAscending: {
      type: Boolean,
      default: true
    },
    searchQuery: {
      type: String,
      default: ''
    }
  },
  emits: ['load-more', 'edit', 'delete', 'avatar-update'],

  setup(props, { emit }) {
    const loadTrigger = ref(null)
    let observer = null

    const sortedContacts = computed(() => {
      let filteredContacts = props.contacts
      
      // Filter by search query if present
      if (props.searchQuery) {
        const query = props.searchQuery.toLowerCase()
        filteredContacts = filteredContacts.filter(contact => 
          contact.name.toLowerCase().includes(query)
        )
      }

      // Sort contacts by name
      return [...filteredContacts].sort((a, b) => {
        const nameA = a.name.toLowerCase()
        const nameB = b.name.toLowerCase()
        return props.sortAscending 
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA)
      })
    })

    const createObserver = () => {
      observer = new IntersectionObserver(
        (entries) => {
          const target = entries[0]
          if (target.isIntersecting && !props.loading && props.hasMore) {
            emit('load-more')
          }
        },
        {
          root: null,
          rootMargin: '100px',
          threshold: 0.5
        }
      )

      if (loadTrigger.value) {
        observer.observe(loadTrigger.value)
      }
    }

    onMounted(() => {
      createObserver()
    })

    onUnmounted(() => {
      if (observer) {
        observer.disconnect()
      }
    })

    return {
      loadTrigger,
      sortedContacts
    }
  }
}
</script>

<style scoped>
.contact-list {
  padding: 16px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.contacts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  width: 100%;
}

.empty-state {
  text-align: center;
  padding: 48px 0;
  color: #666;
  font-size: 1.1em;
  width: 100%;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  color: #666;
  gap: 12px;
  width: 100%;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #B8860B;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.end-message {
  text-align: center;
  padding: 24px;
  color: #666;
  font-style: italic;
  width: 100%;
}

.load-trigger {
  height: 20px;
  margin: 20px 0;
  opacity: 0;
  width: 100%;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
  .contact-list {
    padding: 8px;
  }
  
  .contacts-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
  .contacts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
  .contacts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
  .contacts-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
  .contacts-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
