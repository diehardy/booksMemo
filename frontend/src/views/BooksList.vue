<template>
  <div>
    <h1 class="mt-2 text-uppercase">Books</h1>

    <v-row>
      <v-col>
        <v-btn text="Add a book" variant="outlined" @click="showAudiobookDialogue = true"></v-btn>
      </v-col>
    </v-row>
    <BookForm :showAddingDialog="showAudiobookDialogue" :book="book" @close="updateAddingDialog" @saveBook="saveBook" />
    <ContentsForm :showContentsDialog="showContentsDialog" @closeContents="updateContentsDialog" :book="book"
      @updatedUnit="getBooks(chosen_page)" />
    <BookCards :list_of_books="list_of_books" @deleteBook="deleteBook" @editBook="getBookById"
      @dialogAdd="updateAddingDialog" @dialogContents="updateContentsDialog" />


    <v-pagination color="grey-darken-2" :length="total_pages" v-model="chosen_page"
      v-show="list_of_books.length > 0"></v-pagination>


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
      chosen_page: 1,
      total_pages: null,
    }
  },
  mounted() {
    this.getBooks();
  },
  methods: {
    getBooks(chosen_page) {
      httpServer
        .post("/get", { chosen_page: chosen_page })
        .then((response) => {
          this.total_pages = response.data.pages
          this.list_of_books = response.data.all_books
        })
        .catch((error) => {
          if (error.response.status === 401) this.$router.push(process.env.VUE_APP_LOGIN_PAGE)
        });
    },
    deleteBook(id_book) {
      httpServer
        .post("/delete", {
          id_book: id_book
        })
        .then((response) => {
          if (response.status === 200) this.getBooks();
          else console.log('smth went wrong...')
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
    saveBook(bookToSave) {
      httpServer
        .post("/save", {
          id: bookToSave.id,
          book_name: bookToSave.name,
          book_description: bookToSave.description,
          is_audiobook: bookToSave.is_audiobook,
          audiobook_source: bookToSave.audiobook_source,
        })
        .then(() => {
          this.chosen_page = 1
          this.getBooks(this.chosen_page)
        })
        .catch((error) => {
          console.log(error);
        });
    },
    updateAddingDialog(currentDialogueStatus) { this.showAudiobookDialogue = currentDialogueStatus },
    updateContentsDialog(currentDialogueStatus) { this.showContentsDialog = currentDialogueStatus },
  },
  watch: {
    chosen_page: function (newPage) {
      this.getBooks(newPage)
    },
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
