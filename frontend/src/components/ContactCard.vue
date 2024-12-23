<template>
  <div class="contact-card">
    <div class="avatar" @click="handleAvatarClick">
      <img
        :src="contact.photo || '/user-avatar.svg'"
        :alt="contact.name"
      />
    </div>

    <div class="contact-info">
      <div class="name">{{ contact.name }}</div>
      <div class="phone">{{ contact.phone }}</div>
    </div>

    <div class="contact-actions">
      <button class="action-btn" @click="$emit('edit', contact.id)" title="Edit">
        <i class="far fa-edit"></i>
      </button>
      <button class="action-btn" @click="$emit('delete', contact.id)" title="Delete">
        <i class="far fa-trash-alt"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'ContactCard',
  props: {
    contact: {
      type: Object,
      required: true
    }
  },
  emits: ['save', 'delete', 'avatar-update', 'edit'],
  
  setup(props, { emit }) {
    const handleAvatarClick = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const formData = new FormData();
          formData.append('photo', file);
          emit('avatar-update', props.contact.id, formData);
        }
      };
      input.click();
    };

    return {
      handleAvatarClick
    };
  }
};
</script>

<style scoped>
.contact-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #eaeaea;
}

.contact-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  border-color: #d0d0d0;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  cursor: pointer;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.avatar:hover {
  transform: scale(1.05);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.contact-info {
  flex-grow: 1;
  min-width: 0;
}

.name {
  font-size: 1.1em;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.phone {
  font-size: 0.9em;
  color: #7f8c8d;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.contact-actions {
  display: flex;
  gap: 4px;
  margin-left: auto;
}

.action-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  color: #95a5a6;
  transition: all 0.2s ease;
  font-size: 15px;
  padding: 0;
}

.action-btn:hover {
  background-color: #f8f9fa;
}

.action-btn:hover i.fa-edit {
  color: #3498db;
}

.action-btn:hover i.fa-trash-alt {
  color: #e74c3c;
}

.action-btn:active {
  transform: scale(0.95);
}

@media (max-width: 768px) {
  .contact-card {
    padding: 12px;
    gap: 12px;
  }

  .avatar {
    width: 40px;
    height: 40px;
  }

  .contact-actions {
    gap: 2px;
  }

  .action-btn {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }
}
</style>
