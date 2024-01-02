import { createStore } from 'vuex'

const store = createStore({
    state:{ 
    //状态管理器中定义的数据源
      titleName : "",
      menuIndex:0
    },
    mutations:{
    //同步操作
      changeState(state,payload) {
        state.titleName = payload
      },
      changeMenuIndex(state,payload) {
        state.menuIndex = payload
      }
    },
    actions:{
     //异步操作
    },
    //getters相当于计算属性
    getters:{ 
       getTitleName(state) {
         return state.titleName;
       },
       getMenuIndex(state){
        return state.menuIndex;
       }
    }
 });

 export default store
