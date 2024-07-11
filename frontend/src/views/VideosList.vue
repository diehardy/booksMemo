<template>
    <div>
        <h1 class="mt-2 text-uppercase">Videos</h1>
        <!-- BTN ADD -->
        <v-row>
            <v-col>
                <v-btn text="Add a video" variant="outlined" @click="videoAddingDialog = true"></v-btn>
            </v-col>
        </v-row>


        <!-- DIALOG ADDING/EDITING -->
        <v-dialog max-width="500" v-model="videoAddingDialog">
            <v-card :title="video.id_video ? 'Editing a video' : 'Adding a video'">
                <v-text-field label="Name" class="px-5" v-model="video.video_name"></v-text-field>
                <v-text-field label="Link" class="px-5" v-model="video.video_link"></v-text-field>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text="Close" variant="flat" @click="closeDialog()"
                        :color="video.video_name ? 'grey-lighten-4' : ''"></v-btn>
                    <v-btn text="Add" variant="flat" :color="video.video_name ? 'grey-darken-4' : ''"
                        @click="saveVideo()"></v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>


        <!-- VIDEOS LIST -->

        <v-row class="d-flex justify-center flex-wrap ga-5  ma-5">
            <v-card color="grey-darken-2" v-for="(video, index) in videos" :key="index" cols="2"
                class="mx-auto text-left" prepend-icon="mdi-book-open-blank-variant" width="1200" variant="outlined">
                <template v-slot:title>
                    <span class="font-weight-black new-line">{{ video.video_name }}</span>

                    <a v-if="video.video_link" :href="video.video_link" target="_blank">
                        <v-icon v-bind="props" icon="mdi-play" placeholder="video" class="ml-5" color="green"></v-icon>
                    </a>
                </template>
                <v-row class="pa-5 ga-5">
                    <v-btn text="Notes" variant="outlined" prepend-icon="mdi-pencil"
                        @click="this.$router.push({ path: `/video/${video.id_video}/notes` })"></v-btn>
                    <v-btn text="Edit" v-bind="activatorProps" variant="outlined" prepend-icon="mdi-file-edit"
                        @click="setVideo(video)"></v-btn>
                    <v-btn text="Delete" variant="outlined" prepend-icon="mdi-delete" class="mr-5"
                        @click="deleteVideo(video.id_video)"></v-btn>
                </v-row>

            </v-card>
        </v-row>
        <!-- PAGINATION -->
        <v-pagination color="grey-darken-2" :length="total_pages" v-model="chosen_page"
            v-show="videos.length > 0"></v-pagination>

    </div>
</template>

<script>
import { httpServer } from "@/main"

export default {
    data() {
        return {
            drawer: null,
            video: {
                id: null,
                video_name: '',
                video_link: '',
            },
            videos: [],
            total_pages: 1,
            chosen_page: 1,
            videoAddingDialog: false,
        }
    },
    methods: {
        saveVideo() {
            httpServer
                .post("/save-video", this.video)
                .then(() => {
                    this.closeDialog()
                    this.getVideos(1)
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        deleteVideo(id_video) {
            httpServer
                .post("/delete-video", { id_video: id_video })
                .then(() => {
                    this.getVideos(1)
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        closeDialog() {
            this.videoAddingDialog = false
        },
        getVideos(page) {
            httpServer
                .post("/get-videos", { chosen_page: page })
                .then((response) => {
                    this.videos = response.data.videos
                    this.total_pages = response.data.pages
                })
                .catch((error) => {
                    console.log(error);
                });
            this.closeDialog()
        },
        setVideo(video) {
            this.videoAddingDialog = true
            this.video = video
        }
    },
    mounted() {
        this.getVideos(this.chosen_page)
    },
    watch: {
        videoAddingDialog: function (val) {
            if (!val) {
                this.video = {
                    id: null,
                    video_name: '',
                    video_link: ''
                }
            }
        },
        chosen_page: function (newPage) {
            this.getVideos(newPage)
        }
    }
}


</script>

<style>
.new-line {
    white-space: pre-wrap;
}
</style>