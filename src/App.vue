<template>
  <div class="container">
    <aside>
      <div class="aside-waper">
        <nav v-for="(item, index) in menuItems" :key="index" @click="selectMenuItem(index)"
          :class="{ 'selected': selectedIndex === index }">
          <li>
            <transition name='fade'>
              <router-link :to="{path:item.path}">
                <span>{{ item.name }}</span>
              </router-link>
              </transition>
          </li>
        </nav>
      </div>
    </aside>
    <main>
      <div class="title-warper">当前展示：{{ titleName }}</div>
      <div class="main-context">
        <Suspense>
          <template #default>
              <router-view></router-view>
          </template>
          <template #fallback>
            <h1>加载中......</h1>
          </template>
        </Suspense>
      </div>
      <footer>@2023 有志者事竟成</footer>
    </main>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue';
export default {
  name: 'App',
  components: {
  },
  setup() {
    const store = useStore();
    let titleName = computed(() => {
      //返回的是ref对象
      return store.state.titleName;
    });

    // 菜单选中处理
    let selectedIndex =  computed(() => {
      //返回的是ref对象
      return store.state.menuIndex;
    });
    let menuItems = [{
      name:"首页",
      path: "/"
    },{
      name:"可视化拖拽",
      path: "/drag"
    },{
      name:"抽奖系统",
      path: "/lucky"
    }];

    const selectMenuItem = (index) => {
      selectedIndex.value = index;
    }
    return { titleName, selectedIndex, menuItems, selectMenuItem };
  }
}
</script>

<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.container {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

aside {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 200px;
  background-color: black;

  .aside-waper {
    padding: 20px 10px;
  }
}

.title-warper {
  position: fixed;
  left: 200px;
  height: 50px;
  line-height: 50px;
  padding-left: 10px;
  font-size: 14px;
  right: 0;
  top: 0;
  background-color: beige;
}

footer {
  position: fixed;
  bottom: 0;
  height: 50px;
  line-height: 50px;
  left: 200px;
  right: 0;
  text-align: center;
}

main {
  position: fixed;
  width: calc(100% - 200px);
  top: 0;
  bottom: 0;
  left: 200px;
}

.main-context {
  position: relative;
  width: 100%;
  height: calc(100% - 100px);
  margin-top: 50px;
  padding: 10px;
  overflow: hidden;
}

li {
  display: inline-block;
  margin: 10px;
}

a {
  color: #fff;
  text-decoration: none;

  :hover {
    color: #42b983;
  }
}

.selected {
  a {
    color: #42b983;
  }
}

// loading 动画效果
/* 定义过渡效果 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
 
/* 进入过渡的起始状态 */
.fade-enter {
  opacity: 0;
}
 
/* 进入过渡的结束状态 */
.fade-enter-to {
  opacity: 1;
}
 
/* 离开过渡的起始状态 */
.fade-leave {
  opacity: 1;
}
 
/* 离开过渡的结束状态 */
.fade-leave-to {
  opacity: 0;
}
</style>
