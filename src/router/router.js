import { createRouter, createWebHistory } from 'vue-router';
import dragTest from '@/components/dragTest.vue';
import helloWorld from '@/components/HelloWorld.vue' ;
// import LuckyDraw from '@/components/LuckyDraw.vue';
 
const routes = [
  { path: '/', component: helloWorld },
  { path: '/drag', component: dragTest },
  { path: '/lucky', component: () => import('@/components/LuckyDraw.vue')}
]
 
export default createRouter({
  history: createWebHistory(),
  routes
})