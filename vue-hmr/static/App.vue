<template>
  <div>
    <h1>Hello World!</h1>
    <h2>My name is {{ name }}</h2>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: 'Magenta'
    }
  },
  methods: {
    sayHello() {
      console.log('Hello');
    }
  }
}
</script>

<style lang="css">
  h2 {
    color: red;
  }
</style>