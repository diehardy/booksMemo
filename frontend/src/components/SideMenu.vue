<template>
    <v-card style="width: 80px; z-index: 999999 !important">
        <v-fab icon="mdi-menu" @click.stop="drawer = !drawer" v-if="isMobile" variant="flat" color="grey-darken-2"
            class="mobile-btn"></v-fab>

        <v-icon icon="mdi-menu" @click.stop="drawer = !drawer" v-if="!isMobile && !drawer" variant="outlined"></v-icon>
        <v-layout>
            <v-navigation-drawer v-model="drawer" class="v-navigation-drawer" mobile color="white">
                <v-list-item class="menu-btn" append-icon=" mdi-close" @click.stop="drawer = !drawer"></v-list-item>

                <v-list-item prepend-avatar="https://randomuser.me/api/portraits/men/78.jpg"
                    title="Your name"></v-list-item>

                <v-divider></v-divider>

                <v-list density="compact" nav>
                    <RouterLink to="/books">
                        <v-list-item prepend-icon="mdi-bookshelf" title="Books" value=""></v-list-item>
                    </RouterLink>
                    <RouterLink to="/videos">
                        <v-list-item prepend-icon="mdi-play-box-multiple" title="Videos" value="about"></v-list-item>
                    </RouterLink>
                    <RouterLink to="/settings">
                        <v-list-item prepend-icon="mdi-cog-outline" title="Settings" value="about"></v-list-item>
                    </RouterLink>

                </v-list>

            </v-navigation-drawer>


        </v-layout>

    </v-card>
</template>
<script>
export default {
    data() {
        return {
            drawer: null,
            isMobile: navigator.userAgentData.mobile
        }
    },
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