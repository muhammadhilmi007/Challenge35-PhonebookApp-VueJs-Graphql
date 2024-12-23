<template>
  <div class="add-contact">
    <h2>Add New Contact</h2>
    <form @submit.prevent="handleSubmit" class="contact-form">
      <div class="form-group">
        <label for="name">Name</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
          :class="{ error: errors.name }"
        />
        <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
      </div>

      <div class="form-group">
        <label for="phone">Phone</label>
        <input
          id="phone"
          v-model="form.phone"
          type="tel"
          required
          :class="{ error: errors.phone }"
        />
        <span v-if="errors.phone" class="error-text">{{ errors.phone }}</span>
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="loading">
          {{ loading ? "Saving..." : "Save Contact" }}
        </button>
        <button type="button" @click="handleCancel" :disabled="loading">
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useMutation } from "@vue/apollo-composable";
import { ADD_CONTACT } from "../graphql/mutations";
import { GET_CONTACTS } from "../graphql/queries";

export default {
  name: "AddContact",

  setup() {
    const router = useRouter();
    const form = reactive({
      name: "",
      phone: "",
    });

    const errors = reactive({
      name: "",
      phone: "",
    });

    const loading = ref(false);

    const { mutate: addContact } = useMutation(ADD_CONTACT, {
      update: (cache, { data: { addContact } }) => {
        const data = cache.readQuery({
          query: GET_CONTACTS,
          variables: { offset: 0, limit: 10 }
        });

        if (data) {
          cache.writeQuery({
            query: GET_CONTACTS,
            variables: { offset: 0, limit: 10 },
            data: {
              ...data,
              contacts: [addContact, ...data.contacts]
            }
          });
        }
      }
    });

    const validateForm = () => {
      let isValid = true;
      errors.name = "";
      errors.phone = "";

      if (!form.name.trim()) {
        errors.name = "Name is required";
        isValid = false;
      }

      if (!form.phone.trim()) {
        errors.phone = "Phone is required";
        isValid = false;
      } else if (!/^\d{10,12}$/.test(form.phone)) {
        errors.phone = "Invalid phone number format";
        isValid = false;
      }

      return isValid;
    };

    const handleSubmit = async () => {
      if (!validateForm()) return;

      try {
        loading.value = true;
        await addContact({
          variables: {
            name: form.name.trim(),
            phone: form.phone.trim(),
          },
        });
        router.push('/');
      } catch (error) {
        console.error("Error adding contact:", error);
      } finally {
        loading.value = false;
      }
    };

    const handleCancel = () => {
      router.push('/');
    };

    return {
      form,
      errors,
      loading,
      handleSubmit,
      handleCancel,
    };
  },
};
</script>

<style scoped>
.add-contact {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-bottom: 2rem;
  color: #333;
  text-align: center;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 500;
  color: #666;
}

input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input.error {
  border-color: #dc3545;
}

.error-text {
  color: #dc3545;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

button[type="submit"] {
  background-color: #4CAF50;
  color: white;
}

button[type="submit"]:hover {
  background-color: #45a049;
}

button[type="button"] {
  background-color: #f44336;
  color: white;
}

button[type="button"]:hover {
  background-color: #da190b;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
