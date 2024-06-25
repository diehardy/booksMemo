<template>
  <div>
    <h1 class="mt-2">Your books</h1>

    <v-row>
      <v-col>
        <v-btn class="ml-5" color="success" text="Add a book" variant="flat"
          @click="showAudiobookDialogue = true"></v-btn>
      </v-col>
    </v-row>
    <AudiobookForm :showAddingDialog="showAudiobookDialogue" :book="book" @close="updateDialogStatus"
      @bookSaved="getBooks" />
    <ContentsForm :showContentsDialog="showContentsDialog" @closeContents="updateContentsDialog" />
    <v-row class="d-flex justify-center flex-wrap ga-5  ma-5">
      <v-card color="info" v-for="item in list_of_books" :key="item" cols="2" class="mx-auto text-left"
        prepend-icon="mdi-book-open-blank-variant" width="1200" variant="outlined">
        <template v-slot:title>
          <span class="font-weight-black" style="white-space: pre-wrap;">{{ item.name }}</span>
          <v-tooltip
            :text="item.is_audiobook ? `Audiobook is available at ${item.audiobook_source}` : 'Audiobook isn\'t available'">
            <template v-slot:activator="{ props }">
              <a :href="item.audiobook_source" target="_blank">
                <v-icon v-bind="props" icon="mdi-headphones" placeholder="audiobook" class="ml-5"
                  :color="item.is_audiobook ? 'green' : 'red'"></v-icon>
              </a>
            </template>
          </v-tooltip>
        </template>

        <v-row class="pa-5 ga-5">
          <v-btn text="Contents" variant="flat" color="purple" prepend-icon="mdi-table-of-contents"
            @click="getBookById(item.id), showContentsDialog = true"></v-btn>
          <v-btn text="Edit" v-bind="activatorProps" variant="flat" color="purple" prepend-icon="mdi-file-edit-outline"
            @click="getBookById(item.id), showAudiobookDialogue = true"></v-btn>
          <v-btn text="Delete" variant="flat" color="red" prepend-icon="mdi-delete" class="mr-5"
            @click="deleteBook(item.id)"></v-btn>
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
import AudiobookForm from "@/components/AudiobookForm.vue"
import ContentsForm from "@/components/ContentsForm.vue"

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
    updateDialogStatus(currentDialogueStatus) { this.showAudiobookDialogue = currentDialogueStatus },
    updateContentsDialog(currentDialogueStatus) { this.showContentsDialog = currentDialogueStatus },
  },
  components: {
    AudiobookForm,
    ContentsForm,
  },
}
</script>

<style></style>
