<script>
export default {
  created() {
    this.$store.dispatch('destroyToken')
      .then(() => {
        this.$router.push({ name: 'login' })
      })
  }
}
</script>

