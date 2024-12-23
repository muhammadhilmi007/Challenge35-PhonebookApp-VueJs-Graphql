import { createStore } from 'vuex'

export default createStore({
  state: {
    contacts: [],
    loading: false,
    error: null,
    page: 1,
    hasMore: true,
    sortBy: 'name',
    sortOrder: 'asc',
    search: ''
  },
  
  mutations: {
    SET_CONTACTS(state, contacts) {
      state.contacts = contacts
    },
    ADD_CONTACTS(state, newContacts) {
      state.contacts = [...state.contacts, ...newContacts]
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    SET_PAGE(state, page) {
      state.page = page
    },
    SET_HAS_MORE(state, hasMore) {
      state.hasMore = hasMore
    },
    SET_SORT(state, { sortBy, sortOrder }) {
      state.sortBy = sortBy
      state.sortOrder = sortOrder
    },
    SET_SEARCH(state, search) {
      state.search = search
    },
    UPDATE_CONTACT(state, updatedContact) {
      const index = state.contacts.findIndex(c => c.id === updatedContact.id)
      if (index !== -1) {
        state.contacts.splice(index, 1, updatedContact)
      }
    },
    DELETE_CONTACT(state, id) {
      state.contacts = state.contacts.filter(c => c.id !== id)
    }
  },
  
  actions: {
    resetList({ commit }) {
      commit('SET_CONTACTS', [])
      commit('SET_PAGE', 1)
      commit('SET_HAS_MORE', true)
    },
    
    setSort({ commit, dispatch }, { sortBy, sortOrder }) {
      commit('SET_SORT', { sortBy, sortOrder })
      dispatch('resetList')
    },
    
    setSearch({ commit, dispatch }, search) {
      commit('SET_SEARCH', search)
      dispatch('resetList')
    }
  }
})