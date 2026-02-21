<template>
    <div id="toast-container"></div>
</template>

<script setup>
import { useToast } from 'vue-toastification';

//типы уведомлений для удобства
const toast = useToast()

defineExpose({
    success: (message, options = {}) => {
        toast.success(message, {
            timeout: 5000,
            position: 'top-right',
            ...options
        })
    },

    error: (message, options = {}) => {
        toast.error(message, {
            timeout: 7000,
            position: 'top-right',
            ...options
        })
    },

    warning: (message, options = {}) => {
        toast.warning(message, {
            timeout: 5000,
            position: 'top-right',
            ...options
        })
    },

    info: (message, options = {}) => {
        toast.info(message, {
            timeout: 4000,
            position: 'top-right',
            ...options
        })
    },

    //кастомные уведомления

    custom: (message, type = 'default', options = {}) => {
        toast(message, {
            timeout: 5000,
            position: 'top-right',
            type,
            ...options
        })
    }
})
</script>