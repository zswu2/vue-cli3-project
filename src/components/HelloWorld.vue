<template>
  <div>welcome to user vue3</div>
</template>

<script>
import { setCrumbsAndMenu } from '@/common/common';
export default {
  name: 'HelloWorld',
  props: {
  },
  setup() {
    setCrumbsAndMenu(0, "首页");
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 div {
    margin:0;
    padding:0;
 }
</style>
