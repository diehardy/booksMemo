<template>
    <div>
        <h1 class="mt-2 text-uppercase ">Book notes</h1>
        <div> </div>
    </div>
</template>


<script>
export default {
    mounted() {
        console.log(this.$route.params.id)
    }
}
</script>