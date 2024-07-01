<template>
    <div>
        <h1 class="mt-2 text-uppercase ">Book notes</h1>
        <div width="500px">
            <v-tabs bg-color="grey-darken-2" fixed-tabs>
                <v-tab><v-icon icon="mdi-brain"></v-icon>
                    <h5 class="ml-2">Learning</h5>
                </v-tab>
                <v-tab><v-icon icon="mdi-pencil"></v-icon>
                    <h5 class="ml-2">Notes</h5>
                </v-tab>
            </v-tabs>
        </div>
    </div>
</template>


<script>
export default {
    mounted() {
        console.log(this.$route.params.id)
    }
}
</script>