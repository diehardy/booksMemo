<template>
  <div>
    <h1>All books</h1>

    <v-row class="d-flex justify-center flex-wrap">
      <v-card v-for="item in list_of_books" :key="item" cols="2" class="mx-auto text-left" prepend-icon="$vuetify"
        width="400">
        <template v-slot:title>
          <span class="font-weight-black">{{ item.name }}</span>
        </template>
        <v-card-text class="bg-surface-light pt-4">
          Description of the book!
        </v-card-text>
      </v-card>
    </v-row>



    <v-dialog max-width="500">
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn v-bind="activatorProps" color="surface-variant" text="Add a book" variant="flat"></v-btn>
      </template>
      <template v-slot:default="{ isActive }">
        <v-card title="Adding a new book">
          <v-text-field label="Book's name" class="px-5" v-model="book_name"></v-text-field>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text="Close" variant="flat" @click="isActive.value = false"></v-btn>
            <v-btn text="Add" color="success" variant="flat" @click="addBook(), isActive.value = false"></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>


    <v-pagination :length="4"></v-pagination>


  </div>
</template>

<script>

import { httpServer } from "@/main"

export default {
  data() {
    return {
      book_name: '',
      list_of_books: [],
    }
  },
  mounted() {
    this.getBooks();
  },
  methods: {
    addBook() {
      httpServer
        .post("/add", {
          book_name: this.book_name
        })
        .then((response) => {
          console.log(response.data)
        })
        .catch((error) => {
          console.log(error);
        });
      this.book_name = ''
    },
    getBooks() {
      httpServer
        .get("/get")
        .then((response) => {
          this.list_of_books = response.data.all_books
        })
        .catch((error) => {
          console.log(error);
        });
    },
  }
}
</script>

<style></style>import { httpServer } from '@/main';
