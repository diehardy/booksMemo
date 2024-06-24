<template>
    <v-dialog max-width="500" v-model="isActive">
        <template v-slot:default="{ isActive }">
            <v-card title="Adding a new book">
                <v-text-field label="Name" class="px-5" v-model="copyBook.book_name"></v-text-field>
                <v-text-field label="Description" class="px-5" v-model="copyBook.book_description"></v-text-field>
                <v-checkbox v-model="copyBook.is_audiobook" label="Audiobook" class="ml-5"></v-checkbox>
                <v-text-field v-show="copyBook.is_audiobook" label="Source of an audiobook" class="px-5"
                    v-model="copyBook.audiobook_source"></v-text-field>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text="Close" variant="flat" @click="isActive.value = false"></v-btn>
                    <v-btn text="Add" color="success" variant="flat" @click="addBook(), isActive.value = false"></v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<script>
import { httpServer } from "@/main"

export default {
    props: {
        showAddingDialog: {
            type: Boolean,
            default: false,
        },
        book: {
            type: Object,
            required: true,
        }
    },
    data() {
        return {
            isActive: false,
            copyBook: { ...this.book },
        }
    },
    watch: {
        showAddingDialog: function (val) {
            if (val) {
                this.isActive = val
                this.resetAddingForm()
            }
        },
        'copyBook.is_audiobook': function (val) { if (!val) this.copyBook.audiobook_source = null },
        isActive: function (val) { this.$emit('close', val); }
    },

    methods: {
        addBook() {
            httpServer
                .post("/add", {
                    book_name: this.copyBook.book_name,
                    book_description: this.copyBook.book_description,
                    is_audiobook: this.copyBook.is_audiobook,
                    audiobook_source: this.copyBook.audiobook_source,
                })
                .then((response) => {
                    console.log(response.data)
                })
                .catch((error) => {
                    console.log(error);
                });
            this.resetAddingForm();
            this.$emit('bookSaved');
        },
        resetAddingForm() {
            this.copyBook.book_name = null;
            this.copyBook.book_description = null;
            this.copyBook.is_audiobook = false;
            this.copyBook.audiobook_source = null;
        },
    }
}
</script>

<style></style>