<template>



    <v-dialog max-width="1200" v-model="isActive">
        <template v-slot:default="{ isActive }">

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
                                <v-icon icon="mdi-pencil" @click.stop="console.log('edit')"></v-icon>
                                <v-icon icon="mdi-delete" @click.stop="console.log('deleted')"></v-icon>
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
                                            <v-icon icon="mdi-pencil" @click.stop="console.log('edit')"></v-icon>
                                            <v-icon icon="mdi-delete" @click.stop="console.log('deleted')"></v-icon>
                                        </div>
                                    </v-expansion-panel-title>

                                    <v-expansion-panel-text v-show="sectionHasSubsections(section)">
                                        <h5 class="mb-2 text-center text-bold" v-show="sectionHasSubsections(section)">
                                            SUBSECTIONS</h5>
                                        <v-card v-for="subsection in section.subsections" :key="subsection"
                                            class="my-2 pa-2">
                                            <div class="d-flex ga-5 align-center flex-column flex-md-row">
                                                <h4> {{ subsection.subsection_name }}</h4>
                                                <v-icon icon="mdi-pencil" @click.stop="console.log('edit')"></v-icon>
                                                <v-icon icon="mdi-delete" @click.stop="console.log('deleted')"></v-icon>
                                            </div>


                                        </v-card>

                                        <v-btn class="mt-5" text="Add a subsection" variant="outlined"
                                            @click="console.log('added')"></v-btn>
                                    </v-expansion-panel-text>
                                </v-expansion-panel>
                            </v-expansion-panels>


                            <v-btn class="mt-5" text="Add a section" variant="outlined"
                                @click="console.log('added')"></v-btn>

                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
                <div class="pa-5"><v-btn class="my-2" text="Add a chapter" variant="outlined"
                        @click="console.log('added')">
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
    methods: {
        getChapters(id_book) {
            this.chapters = {};
            // this method is calling when book is changed, but it can be changed on editing
            // i'm check  if dialogue of contents is active
            if (this.isActive) {
                httpServer
                    .post("/get-chapters", { id_book: id_book })
                    .then((response) => {
                        this.chapters = response.data
                        console.log('chapters', this.chapters)
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        },
        isObjectEmpty(objToCheck) {
            return objToCheck && Object.keys(objToCheck).length !== 0;
        }
    },
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
        }
    },
    watch: {
        showContentsDialog: function (val) {
            if (val) {
                this.isActive = val
            }
        },
        isActive: function (val) { this.$emit('closeContents', val); },
        book: function (bookValue) { this.copyBook = bookValue, this.getChapters(this.copyBook.id) }
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
        }
    }
}
</script>

<style></style>