<template>



    <v-dialog max-width="1200" v-model="isActive">



        <template v-slot:default="{ isActive }">
            <!-- CONTENT UNIT DIALOG -->
            <v-dialog v-model="contentUnitDialog" max-width="340">
                <v-card :title="isContentExist">
                    <template v-slot:text>
                        <v-text-field label="Description" class="px-5"
                            v-model="contentUnit.name_contents"></v-text-field>
                    </template>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text="Close" variant="flat" @click="contentUnitDialog = false"
                            :color="contentUnit.name_contents ? 'grey-lighten-4' : ''"></v-btn>
                        <v-btn :text="contentUnit.id_contents ? 'Save' : 'Add'" variant="flat"
                            :color="contentUnit.name_contents ? 'grey-darken-4' : ''"
                            @click="saveContentsUnit(contentUnit)"></v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <!-- CARD ITSELF-->
            <v-card>
                <v-card-title class="text-center text-bold mt-2" color="grey-darken-2">
                    <h2 class="text-uppercase new-line">Contents of the book</h2>
                    <h3 class="new-line">{{ copyBook.name }}</h3>
                </v-card-title>

                <h3 class="mt-2 text-center text-bold">
                    {{ hasChapters ? 'CHAPTERS' : 'You need to add chapters' }}</h3>
                <v-expansion-panels variant="inset" class="pa-5" color="grey-lighten-5" v-show="hasChapters">
                    <v-expansion-panel v-for="chapter in chapters" :key="chapter">
                        <v-expansion-panel-title>
                            <div class="d-flex ga-5 align-center">
                                <h4>{{ chapter.chapter_name
                                    }}</h4>
                                <v-icon icon="mdi-pencil"
                                    @click.stop="setContentUnit({ id_contents: chapter.id_chapter, name_contents: chapter.chapter_name, id_book: this.copyBook.id, parent_id: null, type: 'chapter' })"></v-icon>
                                <v-icon icon="mdi-delete"
                                    @click.stop="deleteContents(chapter.id_chapter, 'chapter', this.copyBook.id)"></v-icon>
                            </div>

                        </v-expansion-panel-title>
                        <v-expansion-panel-text>

                            <h4 class="mb-2 text-center text-bold" v-show="chapterHasSections(chapter)">SECTIONS
                            </h4>

                            <v-expansion-panels variant="inset" color="grey-lighten-5"
                                v-show="chapterHasSections(chapter)">
                                <v-expansion-panel v-for="section in chapter.sections" :key="section">

                                    <v-expansion-panel-title>
                                        <div class="d-flex ga-5 align-center">
                                            <h4>{{ section.section_name
                                                }}</h4>
                                            <v-icon icon="mdi-pencil"
                                                @click.stop="setContentUnit({ id_contents: section.id_section, name_contents: section.section_name, id_book: this.copyBook.id, parent_id: section.parent_id, type: 'section' })"></v-icon>
                                            <v-icon icon="mdi-delete"
                                                @click.stop="deleteContents(section.id_section, 'section', this.copyBook.id)"></v-icon>
                                        </div>
                                    </v-expansion-panel-title>

                                    <v-expansion-panel-text v-show="sectionHasSubsections(section)">
                                        <h5 class="mb-2 text-center text-bold" v-show="sectionHasSubsections(section)">
                                            SUBSECTIONS</h5>
                                        <v-card v-for="subsection in section.subsections" :key="subsection"
                                            class="my-2 pa-2">
                                            <div class="d-flex ga-5 align-center flex-column flex-md-row">
                                                <h4> {{ subsection.subsection_name }}</h4>
                                                <v-icon icon="mdi-pencil"
                                                    @click.stop="setContentUnit({ id_contents: subsection.id_subsection, name_contents: subsection.subsection_name, id_book: this.copyBook.id, parent_id: section.id_section, type: 'subsection' })"></v-icon>
                                                <v-icon icon="mdi-delete"
                                                    @click.stop="deleteContents(subsection.id_subsection, 'subsection', this.copyBook.id)"></v-icon>
                                            </div>
                                        </v-card>

                                        <v-btn class="mt-5" text="Add a subsection" variant="outlined"
                                            @click="setContentUnit({ id_contents: null, name_contents: '', id_book: this.copyBook.id, parent_id: section.id_section, type: 'subsection' })"></v-btn>
                                    </v-expansion-panel-text>
                                </v-expansion-panel>
                            </v-expansion-panels>
                            <v-btn class="mt-5" text="Add a section" variant="outlined"
                                @click="setContentUnit({ id_contents: null, name_contents: '', id_book: this.copyBook.id, parent_id: chapter.id_chapter, type: 'section' })"></v-btn>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
                <div class="pa-5"><v-btn class="my-2" text="Add a chapter" variant="outlined"
                        @click="setContentUnit({ id_contents: null, name_contents: '', id_book: this.copyBook.id, parent_id: null, type: 'chapter' })">
                    </v-btn></div>
                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn text="Close" variant="flat" color="grey-lighten-4" @click="isActive.value = false"></v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>


</template>

<script>
import { httpServer } from "@/main"

export default {
    props: {
        showContentsDialog: {
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
            chapters: {},
            contentUnitDialog: false,
            contentUnit: {
                id_contents: null,
                name_contents: null,
                id_book: null,
                parent_id: null,
                type: null,
            }
        }
    },
    methods: {
        getChapters(id_book) {
            this.chapters = {};
            // this method is calling when book is changed, but it can be changed on editing
            // i'm check  if dialogue of contents is active
            if (this.isActive) {
                httpServer
                    .post("/get-contents", { id_book: id_book })
                    .then((response) => {
                        this.chapters = response.data
                    })
                    .catch((error) => {
                        if (error) {
                            console.log('Contents for this book are not found')
                        }
                    });
            }
        },
        saveContentsUnit(contentUnit) {
            const { id_contents, name_contents, id_book, parent_id, type } = contentUnit
            httpServer
                .post("/save-contents", { id_contents: id_contents, name_contents: name_contents, parent_id: parent_id, type: type, id_book: id_book })
                .then(() => {
                    this.contentUnit = {
                        id_contents: null,
                        name_contents: null,
                        id_book: null,
                        parent_id: null,
                        type: null,
                    }
                    this.getChapters(id_book)
                    this.contentUnitDialog = false
                    this.$emit('updatedUnit');
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        setContentUnit(unitData) {
            this.contentUnit = { ...unitData }
            this.contentUnitDialog = true
        },
        deleteContents(id_contents, type, id_book) {
            httpServer
                .post("/delete-contents", { id_contents: id_contents, type: type })
                .then(() => {
                    this.getChapters(id_book)
                    this.$emit('updatedUnit');
                })
                .catch((error) => {
                    console.log(error);
                });
        },

    },
    watch: {
        showContentsDialog: function (val) {
            if (val) {
                this.isActive = val
            }
        },
        isActive: function (val) { this.$emit('closeContents', val); },
        book: function (bookValue) { this.copyBook = bookValue, this.getChapters(this.copyBook.id); }
    },
    computed: {
        hasChapters() {
            return Object.keys(this.chapters).length !== 0;
        },
        chapterHasSections() {
            return chapter => Object.keys(chapter.sections).length !== 0;
        },
        sectionHasSubsections() {
            return section => Object.keys(section.subsections).length !== 0;
        },
        isContentExist() {
            return this.contentUnit.id_contents ? `Editing chosen ${this.contentUnit.type}` : `Adding new ${this.contentUnit.type}`
        }
    }
}
</script>

<style></style>