<template>
    <v-row class="d-flex justify-center flex-wrap ga-5  ma-5">
        <v-card color="grey-darken-2" v-for="(book, index) in list_of_books" :key="index" cols="2"
            class="mx-auto text-left" prepend-icon="mdi-book-open-blank-variant" width="1200" variant="outlined">
            <template v-slot:title>
                <span class="font-weight-black new-line">{{ book.name }}</span>
                <v-tooltip
                    :text="book.is_audiobook ? `Audiobook is available at ${book.audiobook_source}` : 'Audiobook isn\'t available'">
                    <template v-slot:activator="{ props }">
                        <a :href="book.audiobook_source" target="_blank">
                            <v-icon v-bind="props" icon="mdi-headphones" placeholder="audiobook" class="ml-5"
                                :color="book.is_audiobook ? 'green' : 'red'"></v-icon>
                        </a>
                    </template>
                </v-tooltip>
            </template>
            <v-row class="pa-5 ga-5">
                <v-btn v-show="book.hasChapter" text="Notes" variant="outlined" prepend-icon="mdi-pencil"
                    @click="this.$router.push({ path: `/book/${book.id}/notes` })"></v-btn>
                <v-btn text="Contents" variant="outlined" prepend-icon="mdi-table-of-contents"
                    @click="this.$emit('editBook', book.id), this.$emit('dialogContents', true)"></v-btn>
                <v-btn text="Edit" v-bind="activatorProps" variant="outlined" prepend-icon="mdi-file-edit"
                    @click="this.$emit('editBook', book.id), this.$emit('dialogAdd', true)"></v-btn>
                <v-btn text="Delete" variant="outlined" prepend-icon="mdi-delete" class="mr-5"
                    @click="this.$emit('deleteBook', book.id)"></v-btn>
            </v-row>
            <v-card-text class="bg-surface-light pt-4">
                {{ book.description }}
            </v-card-text>
        </v-card>
    </v-row>
</template>


<script>

export default {
    props: {
        list_of_books: {
            type: Array,
            required: true,
        }
    },
}
</script>