<template>
    <div>
        <h1>{{ $t('title.projectName') }}</h1>
        <a href="http://localhost:8000/api/auth/google">
            <v-btn color="#1697F6" prepend-icon="mdi-google">Sign in with Google</v-btn>
        </a>
        <v-btn @click="this.$i18n.locale == 'en' ? this.$i18n.locale = 'ru' : this.$i18n.locale = 'en'">change
            locale</v-btn>
    </div>
</template>

<script>

export default {
    data() {
        return {

        }
    },
    methods: {
    },



}
</script>