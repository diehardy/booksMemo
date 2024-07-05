<template>
    <div>
        <h1 class="mt-2 text-uppercase ">Book notes</h1>

        <v-card class="mx-auto" max-width="500px">
            {{ chosenContents }}
            <!-- SELECTS -->
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
            <div v-else></div>
            <v-tabs bg-color="grey-darken-2 mt-2" fixed-tabs v-model="contentsType">
                <v-tab value="learning"><v-icon icon="mdi-brain"></v-icon>
                    <h5 class="ml-2">Learning</h5>
                </v-tab>
                <v-tab value="notes"><v-icon icon="mdi-pencil"></v-icon>
                    <h5 class="ml-2">Notes</h5>
                </v-tab>
            </v-tabs>
            <pre>
    <b>type: {{ contentsType }}</b>
    <b>chapters: {{ contents.chapters }}</b>
    <b>sections: {{ contents.sections }}</b>
    <b>subsections: {{ contents.subsections }}</b>
</pre>
            <v-row>
                <v-col cols="4">
                    <v-text-field v-model="hours" label="Hours" type="number" min="0"
                        @input="updateTimecode"></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-text-field v-model="minutes" label="Minutes" type="number" min="0" max="59"
                        @input="updateTimecode"></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-text-field v-model="seconds" label="Seconds" type="number" min="0" max="59"
                        @input="updateTimecode"></v-text-field>
                </v-col>
            </v-row>
        </v-card>
    </div>
</template>


<script>
import { httpServer } from "@/main"

export default {
    data() {
        return {
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
        }
    },
    mounted() {
        this.getContentsByStructure(this.$route.params.id, null, 'chapter')
    },
    watch: {
        'chosenContents.chapter': function (chapterId) { if (chapterId) this.getContentsByStructure(null, chapterId, 'section') },
        'chosenContents.section': function (sectionId) { if (sectionId) this.getContentsByStructure(null, sectionId, 'subsection') },
    }
}
</script>