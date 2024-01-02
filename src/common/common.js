import { useStore } from 'vuex';

// 设置面包屑名称和菜单选择样式
export function setCrumbsAndMenu(index,name) {
    const store = useStore();
    store.commit('changeState', name);
    store.commit('changeMenuIndex',index);
}