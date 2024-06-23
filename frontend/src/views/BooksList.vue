<template>
  <div>
    <h1 class="mt-2">Your books</h1>


    <v-dialog max-width="500" v-model="showAddingDialog">
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
          <v-checkbox v-model="is_audiobook" label="Audiobook" class="ml-5"></v-checkbox>
          <v-text-field v-show="is_audiobook" label="Source of audiobook" class="px-5"
            v-model="audiobook_source"></v-text-field>

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

          <v-tooltip
            :text="item.is_audiobook ? `Audibook is available at ${item.audiobook_source}` : 'Audiobook isn\'t available'">
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props" icon="mdi-headphones" placeholder="audiobook" class="ml-5"
                :color="item.is_audiobook ? 'green' : 'red'"></v-icon>
            </template>
          </v-tooltip>
        </template>
        <v-row class="pa-5">
          <v-btn text="Delete" variant="flat" color="red" prepend-icon="mdi-delete" class="mr-5"
            @click="deleteBook(item.id)"></v-btn>
          <v-btn text="Edit" variant="flat" color="purple" prepend-icon="mdi-file-edit-outline"
            @click="editBook(item.id)"></v-btn>
          <v-btn text="Contents" variant="flat" color="purple" prepend-icon="mdi-table-of-contents"
            @click="editBook(item.id)"></v-btn>
        </v-row>
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
      showAddingDialog: false,
      book_name: null,
      book_description: null,
      list_of_books: [],
      is_audiobook: false,
      audiobook_source: null,
    }
  },
  watch: {
    showAddingDialog: function (val) {
      if (val) {
        this.resetAddingForm();
      }
    },
    is_audiobook: function (val) {
      if (!val) this.audiobook_source = null
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
          book_description: this.book_description,
          is_audiobook: this.is_audiobook,
          audiobook_source: this.audiobook_source,
        })
        .then((response) => {
          console.log(response.data)
        })
        .catch((error) => {
          console.log(error);
        });
      this.resetAddingForm();
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
    deleteBook(id_book) {
      httpServer
        .post("/delete", {
          id_book: id_book
        })
        .then(() => {
          this.getBooks();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    editBook(id_book) {
      console.log(id_book)
    },
    resetAddingForm() {
      this.book_name = null;
      this.book_description = null;
      this.is_audiobook = false;
      this.audiobook_source = null;
    }
  }
}
</script>

<style></style>
