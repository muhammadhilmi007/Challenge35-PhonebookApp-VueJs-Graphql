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
        <button type="button" @click="$emit('cancel')" :disabled="loading">
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
import { useMutation } from "@vue/apollo-composable";
import { ADD_CONTACT } from "../graphql/mutations";

export default {
  name: "AddContact",
  emits: ["save", "cancel"],

  setup(props, { emit }) {
    const form = reactive({
      name: "",
      phone: "",
    });

    const errors = reactive({
      name: "",
      phone: "",
    });

    const loading = ref(false);

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
        emit("save", { ...form });
      } catch (error) {
        console.error("Error adding contact:", error);
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      errors,
      loading,
      handleSubmit,
    };
  },
};
</script>
