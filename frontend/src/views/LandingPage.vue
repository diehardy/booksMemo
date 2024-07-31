<!-- Overall, this page looks consistent and doesn't need to be split by components as there's no reusable parts -->

<template>
    <div class="mx-auto">
        <div class="d-flex align-center justify-center">
          <!-- Just improved the readability -->
          <h1 class="title mr-5">
            Learn Faster with
            <span class="text-no-wrap pa-2 title-app">LanguaTool</span>
          </h1>
          <v-img src="../assets/logo.png" max-width="80px" max-height="80px"/>
        </div>
        <v-carousel hide-delimiters>
          <!-- You definitely don't need an empty line and a separate closing tag -->
            <v-carousel-item class="mt-5" v-for="(item, i) in items" :key="i" :src="item.src"/>
        </v-carousel>
        <p class="text mt-2">
          A language learning tool which will help you to study faster.
          Read, take notes, and easily revisit them with page numbers and timecodes.
        </p>
        <h2 class="mt-2">Is it free?</h2>
        <p class="text">
          <b>Yes, it is!</b>
          You can use the entire functionality of LanguaTool without any cost.
          Enjoy all the features without worrying about any fees.
        </p>

        <h2 class="my-2">Start learning</h2>
        <a href="/api/auth/google"> <!-- It's better to not use the absolute links -->
            <v-btn color="#1697F6" prepend-icon="mdi-google">Sign in with Google</v-btn>
        </a>
    </div>
</template>

<script>
export default {
    data() {
        return {
            items: [
                {
                    src: require('../assets/step1.png'),
                },
                {
                    src: require('../assets/step2.png'),
                },
                {
                    src: require('../assets/step3.png'),
                },
            ],
        }
    },
    methods: {
    },
}
</script>


<style scoped>
body {
    background-color: #ad3229; /* semicolon! */
}

h1 {
    font-size: 3rem;
}

h2 {
    font-size: 2.5rem;
}

.title-app {
    width: 8rem;
    background-color: #42ADE2;
    color: white;
    font-weight: 900;

}

.text {
    font-style: italic;
    font-size: 1.5rem;
}
</style>