<template>
  <div>
    <h1 class="mt-2 text-uppercase ">Your books</h1>

    <v-row>
      <v-col>
        <v-btn class="ml-5" text="Add a book" variant="outlined" @click="showAudiobookDialogue = true"></v-btn>
      </v-col>
    </v-row>
    <BookForm :showAddingDialog="showAudiobookDialogue" :book="book" @close="updateAddingDialog"
      @bookSaved="getBooks" />
    <ContentsForm :showContentsDialog="showContentsDialog" @closeContents="updateContentsDialog" :book="book" />
    <BookCards :list_of_books="list_of_books" @deleteBook="deleteBook" @editBook="getBookById"
      @dialogAdd="updateAddingDialog" @dialogContents="updateContentsDialog" />


    <v-pagination color="grey-darken-2" :length="4"></v-pagination>


  </div>
</template>

<script>

import { httpServer } from "@/main"
import BookForm from "@/components/BookForm.vue"
import ContentsForm from "@/components/ContentsForm.vue"
import BookCards from "@/components/BookCards.vue"

export default {
  data() {
    return {
      showAudiobookDialogue: false,
      showContentsDialog: false,
      book: {
        id: null,
        name: null,
        escription: null,
        is_audiobook: false,
        audiobook_source: null,
      },
      list_of_books: [],
    }
  },
  mounted() {
    this.getBooks();
  },
  methods: {
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
    getBookById(id_book) {
      httpServer
        .post("/get-by-id", {
          id_book: id_book
        })
        .then((response) => {
          this.book = { ...response.data }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    updateAddingDialog(currentDialogueStatus) { this.showAudiobookDialogue = currentDialogueStatus },
    updateContentsDialog(currentDialogueStatus) { this.showContentsDialog = currentDialogueStatus },
  },
  components: {
    BookForm,
    ContentsForm,
    BookCards,
  },
}
</script>

<style>
.new-line {
  white-space: pre-wrap;
}
</style>
