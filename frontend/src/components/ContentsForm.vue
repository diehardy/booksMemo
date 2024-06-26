<template>



    <v-dialog max-width="1200" v-model="isActive">
        <template v-slot:default="{ isActive }">
            <v-card>
                <v-card-title class="text-center text-bold mt-2" color="grey-darken-2">
                    <h2 class="text-uppercase new-line">Contents of the book</h2>
                </v-card-title>

                <h3 class="mt-2 text-center text-bold">CHAPTERS</h3>

                <v-expansion-panels variant="inset" class="pa-5" color="grey-lighten-5">
                    <v-expansion-panel v-for="i in 3" :key="i">
                        <v-expansion-panel-title>
                            <div class="d-flex ga-5 align-center">
                                <h4>chapter {{ i
                                    }}</h4>
                                <v-icon icon="mdi-pencil" @click.stop="console.log('edit')"></v-icon>
                                <v-icon icon="mdi-delete" @click.stop="console.log('deleted')"></v-icon>
                            </div>

                        </v-expansion-panel-title>
                        <v-expansion-panel-text>

                            <h4 class="mb-2 text-center text-bold">SECTIONS</h4>

                            <v-expansion-panels variant="inset" color="grey-lighten-5">
                                <v-expansion-panel v-for="d in 3" :key="d">

                                    <v-expansion-panel-title>
                                        <div class="d-flex ga-5 align-center">
                                            <h4>section {{ d
                                                }}</h4>
                                            <v-icon icon="mdi-pencil" @click.stop="console.log('edit')"></v-icon>
                                            <v-icon icon="mdi-delete" @click.stop="console.log('deleted')"></v-icon>
                                        </div>
                                    </v-expansion-panel-title>

                                    <v-expansion-panel-text>
                                        <h5 class="mb-2 text-center text-bold">SUBSECTIONS</h5>

                                        <v-card v-for="m in 3" :key="m" class="my-2 pa-2">
                                            <div class="d-flex ga-5 align-center flex-column flex-md-row">
                                                <h4>subsection {{ d
                                                    }}</h4>
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
export default {
    props: {
        showContentsDialog: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            isActive: false,
        }
    },
    watch: {
        showContentsDialog: function (val) {
            if (val) {
                this.isActive = val
                // this.resetAddingForm()
            }
        },
        isActive: function (val) { this.$emit('closeContents', val); },
    },
}
</script>

<style></style>