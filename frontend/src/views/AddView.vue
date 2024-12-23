<template>
  <div class="add-view">
    <div class="form-container">
      <div class="form-group">
        <input
          type="text"
          v-model="name"
          placeholder="Name"
          class="form-input"
        />
      </div>
      <div class="form-group">
        <input
          type="tel"
          v-model="phone"
          placeholder="Phone Number"
          class="form-input"
          pattern="[0-9]*"
        />
      </div>
      <div class="form-actions">
        <button @click="handleSave" class="btn-save">save</button>
        <button @click="handleCancel" class="btn-cancel">cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMutation } from '@vue/apollo-composable'
import { ADD_CONTACT } from '../graphql/mutations'

export default {
  name: 'AddView',
  
  setup() {
    const router = useRouter()
    const name = ref('')
    const phone = ref('')
    const error = ref('')

    const { mutate: addContact } = useMutation(ADD_CONTACT)

    const handleSave = async () => {
      if (!name.value || !phone.value) {
        error.value = 'Please fill in all fields'
        return
      }

      try {
        await addContact({
          variables: {
            name: name.value,
            phone: phone.value
          }
        })
        router.push('/')
      } catch (err) {
        error.value = 'Error adding contact'
      }
    }

    const handleCancel = () => {
      router.push('/')
    }

    return {
      name,
      phone,
      error,
      handleSave,
      handleCancel
    }
  }
}
</script>

<style scoped>
.add-view {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.form-container {
  background-color: white;
  padding: 32px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  border-color: #B8860B;
  outline: none;
}

.form-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 32px;
}

.btn-save,
.btn-cancel {
  padding: 12px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  text-transform: lowercase;
}

.btn-save {
  background-color: #B8860B;
  color: white;
}

.btn-save:hover {
  background-color: #906c0a;
}

.btn-cancel {
  background-color: #e0e0e0;
  color: #333;
}

.btn-cancel:hover {
  background-color: #d0d0d0;
}

@media (max-width: 600px) {
  .form-container {
    padding: 20px;
  }
}
</style>
