<template>



    <v-dialog max-width="1200" v-model="isActive">
        <template v-slot:default="{ isActive }">
            <v-card title="Contents of the book">
                <h3 class="ml-5">Chapters</h3>
                <v-expansion-panels class=" pa-5" variant="inset">
                    <v-expansion-panel v-for="i in 3" :key="i" :title="'Chapter ' + i">
                        <v-expansion-panel-text>
                            <div v-for="m in 3" :key="m">Section {{ i }}</div><br>

                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text="Close" variant="flat" @click="isActive.value = false"></v-btn>
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