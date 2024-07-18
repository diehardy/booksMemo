<template>
  <v-container>
    <SideMenu v-show="!$route.meta.hideNavbar" />

    <router-view />
  </v-container>
</template>
<script>
import SideMenu from './components/SideMenu.vue';

export default {
  components: {
    SideMenu,
  },
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #12171c;
  text-decoration: none
}

nav a.router-link-exact-active {
  color: #42a5b9;
}
</style>
