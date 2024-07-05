<template>
    <div>
        <h1 class="mt-2 text-uppercase ">Book notes</h1>

        <v-card class="mx-auto" max-width="500px">

            <!-- SELECTS -->
            <div class="d-flex flex-column align-center mt-5"
                v-if="contents.chapters.length > 0 || contents.sections.length > 0 || contents.subsections.length > 0">
                <v-select v-show="contents.chapters.length > 0" :items="contents.chapters" density="compact"
                    label="Chapter" width="300px"></v-select>
                <v-select v-show="contents.sections.length > 0 && contents.chapters.length > 0"
                    :items="contents.sections" density="compact" label="Section" width="300px"></v-select>
                <v-select v-show="contents.subsections.length > 0 && contents.sections.length > 0"
                    :items="contents.subsections" density="compact" label="Subsection" width="300px"></v-select>
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

            <b>type: {{ contentsType }}</b>

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
                chapters: [1, 2, 3],
                sections: [2, 5],
                subsections: [],
            },
        }
    },
    methods: {
        getChapters(id_book) {
            httpServer
                .post("/get-contents", { id_book: id_book })
                .then((response) => {
                    this.chapters = response.data
                    console.log(this.chapters)
                    const obj = [2, 5]
                    obj.forEach((el) => {
                        console.log(el);
                    })
                })
                .catch((error) => {
                    if (error) {
                        console.log('Contents for this book are not found', error)
                    }
                });
        }
    },
    mounted() {
        this.getChapters(this.$route.params.id)
    }
}
</script>