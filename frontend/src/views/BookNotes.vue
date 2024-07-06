<template>
    <div>
        <h1 class="mt-2 text-uppercase ">Book notes</h1>
        <!-- DIALOG ADDING/EDITING LEARNING NOTE-->
        <v-dialog max-width="500" v-model="showAddingDialog">
            <v-card title="Add a new note">

                <v-text-field label="Phrase" class="px-5" v-model="noteContents.note_name"></v-text-field>
                <v-text-field label="Meaning" class="px-5" v-model="noteContents.note_description"></v-text-field>
                <v-text-field label="Page" type="number" min="0" max="3000" class="px-5"
                    v-model="noteContents.page"></v-text-field>
                <h4 class="ml-2">{{ book.is_audiobook ? 'Timecode'
                    : 'To add timecodes you have to set a link to an audiobook' }}</h4>
                <div v-if="book.is_audiobook">
                    <v-text-field label="Seconds" type="number" min="0" max="59" class="px-5"
                        v-model='timecode.seconds'></v-text-field>
                    <v-text-field label="Minutes" type="number" min="0" max="59" class="px-5"
                        v-model="timecode.minutes"></v-text-field>
                    <v-text-field label="Hours" type="number" min="0" max="300" class="px-5"
                        v-model="timecode.hours"></v-text-field>
                </div>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text="Close" variant="flat" @click="showAddingDialog = false">Close</v-btn>
                    <v-btn variant="flat"
                        @click="saveNote(noteContents, timecode, chosenContents, contentsType)">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>




        <v-card class="mx-auto" max-width="500px">

            <!-- {{ chosenContents }} -->
            <!-- SELECTS CHAPTERS -->
            <div class="d-flex flex-column align-center mt-5"
                v-if="contents.chapters.length > 0 || contents.sections.length > 0 || contents.subsections.length > 0">
                <v-select v-show="contents.chapters.length > 0" :items="contents.chapters" density="compact"
                    label="Chapter" width="300px" item-title="chapter_name" item-value="id_chapter"
                    v-model="chosenContents.chapter"> <template v-slot:append>
                        <v-icon @click="resetContents('chapter')">mdi-restore</v-icon>
                    </template></v-select>
                <v-select v-show="contents.sections.length > 0 && contents.chapters.length > 0"
                    :items="contents.sections" density="compact" label="Section" width="300px" item-title="section_name"
                    item-value="id_section" v-model="chosenContents.section"><template v-slot:append><v-icon
                            @click="resetContents('section')">mdi-restore</v-icon></template></v-select>
                <v-select v-show="contents.subsections.length > 0 && contents.sections.length > 0"
                    :items="contents.subsections" density="compact" label="Subsection" width="300px"
                    item-title="subsection_name" item-value="id_subsection"
                    v-model="chosenContents.subsection"><template v-slot:append><v-icon
                            @click="resetContents('subsection')">mdi-restore</v-icon></template></v-select>
            </div>
            <div v-else>No chapters found</div>
            <v-tabs bg-color="grey-darken-2 mt-2" fixed-tabs v-model="contentsType">
                <v-tab value="learning"><v-icon icon="mdi-brain"></v-icon>
                    <h5 class="ml-2">Learning</h5>
                </v-tab>
                <v-tab value="notes"><v-icon icon="mdi-pencil"></v-icon>
                    <h5 class="ml-2">Notes</h5>
                </v-tab>
            </v-tabs>
            <v-card-actions>
                <v-btn v-if="chosenContents.chapter" class="ml-5" text="Add a note" variant="outlined"
                    @click="showAddingDialog = true"></v-btn>
                <h4 v-else>Choose a chapter</h4>
            </v-card-actions>
            <!-- ALL NOTES -->
        </v-card>
        <v-row class="d-flex justify-center flex-wrap ga-5  ma-5 ">
            <v-card color="grey-darken-2" v-for="(note, index) in notes" :key="index" cols="2" class="mx-auto text-left"
                prepend-icon="mdi-book-open-blank-variant" width="1200" variant="outlined">
                <template v-slot:title>
                    <span class="font-weight-black new-line">{{ note.phrase }}</span>
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
                <v-row class="pa-5 ga-5 align-center">
                    <v-btn text="Edit" v-bind="activatorProps" variant="outlined" prepend-icon="mdi-file-edit"></v-btn>
                    <v-btn text="Delete" variant="outlined" prepend-icon="mdi-delete" class="mr-5"
                        @click="this.$emit('deleteBook', book.id)"></v-btn>
                    <v-row class="justify-end">
                        <v-chip prepend-icon="mdi-book" class="mx-2 mt-2" color="primary">
                            Page: 22
                        </v-chip>
                        <a :href="book.audiobook_source" target="_blank">
                            <v-chip :model-value="true" class="ma-2" color="green" prepend-icon="mdi-clock-outline">
                                Timecode: 1h 22m 34s
                            </v-chip>
                        </a>

                    </v-row>

                </v-row>
                <v-card-text class="bg-surface-light pt-4">
                    {{ note.meaning }}
                </v-card-text>
            </v-card>
        </v-row>
    </div>
</template>


<script>
import { httpServer } from "@/main"

export default {
    data() {
        return {
            id_book: this.$route.params.id,
            contentsType: '',
            contents: {
                chapters: [],
                sections: [],
                subsections: [],
            },
            chosenContents: {
                chapter: '',
                section: '',
                subsection: ''
            },
            notes: [],
            book: {},
            showAddingDialog: false,
            noteContents: {
                id_note: null,
                note_name: '',
                note_description: '',
                page: null,
            },
            timecode: {
                seconds: null,
                minutes: null,
                hours: null,
            }
        }
    },
    methods: {
        getContentsByStructure(id_book, id_structure, type) {
            httpServer
                .post("/get-contents-by-id", { id_book: id_book, id_structure: id_structure, type: type, })
                .then((response) => {
                    switch (type) {
                        case 'chapter':
                            this.contents.chapters = response.data.contents
                            break;
                        case 'section':
                            this.contents.sections = response.data.contents
                            break;
                        case 'subsection':
                            this.contents.subsections = response.data.contents
                            break;
                        default:
                            console.log('type not found')
                    }
                })
                .catch((error) => {
                    if (error) {
                        console.log('Contents for this book are not found', error)
                    }
                });
        },
        getBookById() {
            httpServer
                .post("/get-by-id", { id_book: this.id_book })
                .then((response) => {
                    this.book = response.data
                    console.log(this.book)
                })
                .catch((error) => {
                    if (error) {
                        console.log('Contents for this book are not found', error)
                    }
                });
        },
        resetContents(type) {
            switch (type) {
                case 'chapter':
                    this.chosenContents = {
                        chapter: '',
                        section: '',
                        subsection: '',
                    }
                    this.contents.sections = []
                    this.contents.subsections = []
                    break;
                case 'section':
                    this.chosenContents.section = null
                    this.chosenContents.subsection = null
                    this.contents.subsections = []
                    break;
                case 'subsection':
                    this.chosenContents.subsection = null
                    break;
                default:
                    console.log('type not found')
            }
        },

        // notes
        saveNote(noteStructure, timecodeStructure, chosenContents, contentsType) {
            let timecode = Number(timecodeStructure.seconds) + Number(timecodeStructure.hours) * 3600 + Number(timecodeStructure.minutes) * 60

            let parent_structure = null
            let parent_type = null
            if (chosenContents.subsection) { parent_structure = chosenContents.subsection; parent_type = 'subsection' }
            else if (chosenContents.section) { parent_structure = chosenContents.section; parent_type = 'section' }
            else if (chosenContents.chapter) { parent_structure = chosenContents.chapter; parent_type = 'chapter' }


            httpServer
                .post("/save-note", { id_note: noteStructure.id, note_name: noteStructure.note_name, note_description: noteStructure.note_description, page: noteStructure.page, timecode, id_book: this.id_book, parent_structure, parent_type, note_type: contentsType })
                .then(() => {
                    this.resetDataNote()
                })
                .catch((error) => {
                    if (error) {
                        console.log('Coudn`t add a note', error)
                    }
                });
            this.showAddingDialog = false
        },
        resetDataNote() {
            this.noteContents = {
                id_note: null,
                note_name: '',
                note_description: '',
                page: null,
            }
            this.timecode = {
                seconds: null,
                minutes: null,
                hours: null,
            }
        }
    },
    mounted() {
        this.getContentsByStructure(this.id_book, null, 'chapter')
        this.getBookById()
    },
    watch: {
        'chosenContents.chapter': function (chapterId) { if (chapterId) this.getContentsByStructure(null, chapterId, 'section') },
        'chosenContents.section': function (sectionId) { if (sectionId) this.getContentsByStructure(null, sectionId, 'subsection') },
        showAddingDialog: function (val) {
            if (val) {
                this.resetDataNote()
            }
        },
    }
}
</script>
