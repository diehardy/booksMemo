<template>
    <div>
        <h1 class="mt-2 text-uppercase ">Video notes</h1>
        <!-- DIALOG ADDING/EDITING LEARNING NOTE-->
        <v-dialog max-width="500" v-model="showAddingDialog">

            <v-card :title="noteContents.id_note ? 'Editing a note' : 'Add a new note'">
                <v-text-field :label="contentsType == 'learning' ? 'Word' : 'Idea'" class="px-5"
                    v-model="noteContents.video_word"></v-text-field>
                <v-text-field :label="contentsType == 'learning' ? 'Phrase' : 'Sentence'" class="px-5"
                    v-model="noteContents.video_phrase"></v-text-field>
                <v-text-field :label="contentsType == 'learning' ? 'Meaning' : 'Thoughts'" class="px-5"
                    v-model="noteContents.video_explanation"></v-text-field>
                <div>
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
                    <v-btn variant="flat" color="grey-darken-4" @click="saveNote(timecode)">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>



        <!--TABS LEARNING/NOTES -->
        <v-card class="mx-auto" max-width="500px">
            <v-tabs bg-color="grey-darken-2 mt-2" fixed-tabs v-model="contentsType">
                <v-tab value="learning"><v-icon icon="mdi-brain"></v-icon>
                    <h5 class="ml-2">Learning</h5>
                </v-tab>
                <v-tab value="notes"><v-icon icon="mdi-pencil"></v-icon>
                    <h5 class="ml-2">Notes</h5>
                </v-tab>
            </v-tabs>
            <v-card-actions>
                <v-btn class="ml-5" text="Add a note" variant="outlined"
                    @click="resetDataNote(), showAddingDialog = true"></v-btn>
            </v-card-actions>
        </v-card>


        <!-- ALL NOTES -->
        <v-row class="d-flex justify-center flex-wrap ga-5  ma-5 ">
            <v-card color="grey-darken-2" v-for="(note, index) in notes" :key="index" cols="2" class="mx-auto text-left"
                prepend-icon="mdi-book-open-blank-variant" width="1200" variant="outlined">
                <template v-slot:title>
                    <span class="font-weight-black new-line">{{ note.video_phrase }}</span>
                    <a :href="note.video_link + '&t=' + note.timecode" target="_blank">
                        <v-icon v-bind="props" icon="mdi-video" placeholder="video" class="ml-5" color="green"></v-icon>
                    </a>
                </template>
                <v-row class="pa-5 ga-5 align-center">
                    <v-btn text="Edit" v-bind="activatorProps" variant="outlined" prepend-icon="mdi-file-edit"
                        @click="setNote(note), setTimecode(note.timecode)"></v-btn>
                    <v-btn text="Delete" variant="outlined" prepend-icon="mdi-delete" class="mr-5"
                        @click="deleteVideoNote(note.id_note)"></v-btn>
                    <v-row class="justify-end">
                        <v-chip :prepend-icon="contentsType == 'learning' ? 'mdi-book-alphabet' : 'mdi-lightbulb-on'"
                            class="mx-2 mt-2" color="orange-accent-3" v-if="note.video_word">
                            <span class="text-grey-darken-3 font-weight-bold">{{ contentsType == 'learning' ? 'Word' :
                                'Idea' }}:
                                {{ note.video_word }}</span>
                        </v-chip>
                        <a :href="note.video_link + '&t=' + note.timecode" target="_blank" v-if="note.timecode">
                            <v-chip :model-value="true" class="ma-2" color="green font-weight-bold"
                                prepend-icon="mdi-clock-outline">
                                {{ formatTimecode(note.timecode) }}
                            </v-chip>
                        </a>
                    </v-row>

                </v-row>
                <v-card-text class="bg-surface-light pt-4">
                    {{ note.video_explanation }}
                </v-card-text>
            </v-card>
        </v-row>
        <v-pagination color="grey-darken-2" :length="total_pages" v-model="chosen_page"
            v-show="notes.length > 0"></v-pagination>
    </div>
</template>


<script>
import { httpServer } from "@/main"

export default {
    data() {
        return {
            contentsType: '',
            total_pages: 0,
            chosen_page: 1,
            notes: [],
            video: {},
            showAddingDialog: false,
            noteContents: {
                id_note: null,
                video_word: '',
                video_phrase: '',
                video_explanation: '',
                timecode: null,
                note_type: this.contentsType,
            },
            timecode: {
                seconds: null,
                minutes: null,
                hours: null,
            }
        }
    },
    methods: {
        // notes
        saveNote(timecodeStructure) {
            let timecode = Number(timecodeStructure.seconds) + Number(timecodeStructure.hours) * 3600 + Number(timecodeStructure.minutes) * 60
            httpServer
                .post("/save-video-note", { ...this.noteContents, timecode: timecode, note_type: this.contentsType, id_video: this.$route.params.id })
                .then(() => {
                    this.resetDataNote()
                    this.getVideoNotes()
                })
                .catch((error) => {
                    if (error) {
                        console.log('Coudn`t add a note', error)
                    }
                });
            this.showAddingDialog = false
        },

        getVideoNotes() {
            httpServer
                .post("/get-video-notes", { chosen_page: this.chosen_page, contentsType: this.contentsType })
                .then((response) => {
                    this.notes = response.data.notes
                    this.total_pages = response.data.pages
                })
                .catch((error) => {
                    if (error) {
                        console.log('Coudn`t add a note', error)
                    }
                });
        },

        resetDataNote() {
            this.noteContents = {
                id_note: null,
                video_word: '',
                video_phrase: '',
                video_explanation: '',
                timecode: null,
                note_type: this.contentsType,
            }
            this.timecode = {
                seconds: null,
                minutes: null,
                hours: null,
            }
        },
        deleteVideoNote(id_note) {
            httpServer
                .post("/delete-video-note", { id_note })
                .then(() => { this.getVideoNotes() })
                .catch((error) => {
                    if (error) {
                        console.log('Cannot be deleted because: ', error)
                    }
                });
        },
        formatTimecode(timecode) {
            let hours = timecode >= 3600 ? Math.floor(timecode / 3600) : 0
            timecode = timecode - (hours * 3600)
            let minutes = timecode >= 60 ? Math.floor(timecode / 60) : 0
            timecode = timecode - (minutes * 60)
            let seconds = timecode
            return `Timecode: ${hours}h ${minutes}m ${seconds}s`
        },
        setNote(note) {
            this.noteContents = note
            this.showAddingDialog = true
        },
        setTimecode(timecode) {
            let hours = timecode >= 3600 ? Math.floor(timecode / 3600) : 0
            timecode = timecode - (hours * 3600)
            let minutes = timecode >= 60 ? Math.floor(timecode / 60) : 0
            timecode = timecode - (minutes * 60)
            let seconds = timecode
            this.timecode = {
                hours: hours,
                minutes: minutes,
                seconds: seconds
            }
        },

        async checkVideo() {
            await httpServer
                .post("/check-video", { id_video: this.$route.params.id })
                .then((response) => {
                    if (!response.data) this.$router.push({ path: `/videos` })
                })
                .catch((error) => {
                    if (error) {
                        console.log('Cannot be deleted because: ', error)
                    }
                });
        }
    },
    mounted() {
        this.checkVideo()
        this.getVideoNotes()

    },
    watch: {
        chosen_page: function () {
            this.getVideoNotes()
        },
        contentsType: function () {
            this.chosen_page = 1
            this.getVideoNotes()
        }
    },

}
</script>
