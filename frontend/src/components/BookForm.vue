<template>
    <v-dialog max-width="500" v-model="isActive">
        <template v-slot:default="{ isActive }">
            <v-card :title="copyBook.id ? 'Editing a chosen book' : 'Adding a new book'">
                <v-text-field label="Name" class="px-5" v-model="copyBook.name"></v-text-field>
                <v-text-field label="Description" class="px-5" v-model="copyBook.description"></v-text-field>
                <v-checkbox v-model="copyBook.is_audiobook" label="Audiobook" class="ml-5"></v-checkbox>
                <v-text-field v-show="copyBook.is_audiobook" label="Source of an audiobook" class="px-5"
                    v-model="copyBook.audiobook_source"></v-text-field>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text="Close" variant="flat" @click="isActive.value = false"
                        :color="copyBook.name ? 'grey-lighten-4' : ''"></v-btn>
                    <v-btn :text="copyBook.id ? 'Save' : 'Add'" variant="flat"
                        :color="copyBook.name ? 'grey-darken-4' : ''"
                        @click="this.$emit('saveBook', this.copyBook), isActive.value = false"></v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<script>
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
        isActive: function (val) { this.$emit('close', val); },
        book: function (bookValue) { this.copyBook = bookValue }
    },

    methods: {
        resetAddingForm() {
            this.copyBook = {
                id: null,
                name: null,
                description: null,
                is_audiobook: false,
                audiobook_source: null
            }
        },
    }
}
</script>

<style></style>