<template>
    <v-card style="width: 80px; z-index: 999998 !important; position: relative; ">
        <v-fab icon="mdi-menu" @click.stop="drawer = !drawer" v-if="isMobile" variant="flat" color="grey-darken-2"
            class="mobile-btn"></v-fab>

        <v-icon icon="mdi-menu" @click.stop="drawer = !drawer" v-if="!isMobile && !drawer" variant="outlined"></v-icon>
        <v-layout>
            <v-navigation-drawer v-model="drawer" class="v-navigation-drawer" color="white">
                <v-list-item class="menu-btn" append-icon=" mdi-close" @click.stop="drawer = !drawer"></v-list-item>

                <v-list-item :prepend-avatar="user.icon" :title="user.name"></v-list-item>

                <v-divider></v-divider>

                <v-list density="compact" nav>
                    <RouterLink to="/books" :class="{ 'router-link-exact-active': isBook }">
                        <v-list-item prepend-icon="mdi-bookshelf" title="Books" value="Books"></v-list-item>
                    </RouterLink>
                    <RouterLink to="/videos" :class="{ 'router-link-exact-active': isVideo }">
                        <v-list-item prepend-icon="mdi-play-box-multiple" title="Videos" value="Videos"></v-list-item>
                    </RouterLink>
                    <RouterLink to="/settings">
                        <v-list-item prepend-icon="mdi-cog-outline" title="Settings" value="Settings"></v-list-item>
                    </RouterLink>
                    <v-list-item @click="logout()" prepend-icon="mdi-logout" title="Logout"
                        value="Logout"></v-list-item>
                    <!-- <v-list-item><v-select label="Select" width="200px" class="mx-auto"
                            :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"></v-select></v-list-item> -->

                    <!-- <v-select label="Select" width="200px" class="mx-auto"
                        :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"></v-select> -->

                </v-list>

            </v-navigation-drawer>


        </v-layout>

    </v-card>
</template>
<script>
import { httpServer } from "@/main"

export default {

    data() {
        return {
            drawer: null,
            isMobile: this.checkIfMobile(),
            user: {},
        }
    },
    methods: {
        checkIfMobile() {
            return window.matchMedia("(max-width: 767px)").matches;
        },
        getUserProfile() {
            httpServer
                .get("/get-user")
                .then((response) => {
                    this.user = response.data;
                })
                .catch((error) => {
                    if (error.response.status === 401) this.$router.push(process.env.VUE_APP_LOGIN_PAGE)
                });
        },
        logout() {
            httpServer
                .post("/logout", {}, { withCredentials: true })
                .then((response) => {
                    if (response.status === 200) this.$router.push(process.env.VUE_APP_LOGIN_PAGE)
                })
                .catch((error) => {
                    if (error.response.status === 401 || error.response.status === 500) this.$router.push(process.env.VUE_APP_LOGIN_PAGE)
                });
        }
    },
    computed: {
        isBook() {
            return this.$route.path === '/books' || this.$route.path.startsWith('/book/');
        },
        isVideo() {
            return this.$route.path === '/videos' || this.$route.path.startsWith('/video/');

        }
    },
    mounted() {
        this.getUserProfile()
    }
}
</script>

<style scoped>
.mobile-btn {
    position: fixed;
    left: 10px;
    top: 30px;
    z-index: 1000;
}

.menu-btn {
    position: absolute;
    top: 0px;
    right: 0px;
}
</style>

<!-- <v-btn @click="this.$i18n.locale == 'en' ? this.$i18n.locale = 'ru' : this.$i18n.locale = 'en'">change
            locale</v-btn> -->