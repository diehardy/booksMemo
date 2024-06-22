<template>
  <div>
    <h1 class="mt-2">Your books</h1>


    <v-dialog max-width="500">
      <template v-slot:activator="{ props: activatorProps }">
        <v-row>
          <v-col>
            <v-btn class="ml-5" v-bind="activatorProps" color="success" text="Add a book" variant="flat"></v-btn>
          </v-col>
        </v-row>

      </template>
      <template v-slot:default="{ isActive }">
        <v-card title="Adding a new book">
          <v-text-field label="Name" class="px-5" v-model="book_name"></v-text-field>
          <v-text-field label="Description" class="px-5" v-model="book_description"></v-text-field>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text="Close" variant="flat" @click="isActive.value = false"></v-btn>
            <v-btn text="Add" color="success" variant="flat" @click="addBook(), isActive.value = false"></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>



    <v-row class="d-flex justify-center flex-wrap ga-5  ma-5">
      <v-card color="info" v-for="item in list_of_books" :key="item" cols="2" class="mx-auto text-left"
        prepend-icon="mdi-book-open-blank-variant" width="1200" variant="outlined">
        <template v-slot:title>
          <span class="font-weight-black">{{ item.name }}</span>
        </template>
        <v-card-text class="bg-surface-light pt-4">
          {{ item.description }}

        </v-card-text>
      </v-card>
    </v-row>






    <v-pagination :length="4"></v-pagination>


  </div>
</template>

<script>

import { httpServer } from "@/main"

export default {
  data() {
    return {
      book_name: '',
      book_description: '',
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
          book_name: this.book_name,
          book_description: this.book_description
        })
        .then((response) => {
          console.log(response.data)
        })
        .catch((error) => {
          console.log(error);
        });
      this.book_name = '';
      this.book_description = '';
      this.getBooks();
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
