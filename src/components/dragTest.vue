<template>
    <div>
        <div class="title-msg">单词分类：把以下的单词放到上面对应的分类里</div>
        <div style="margin: 10px;display: flex;flex-direction: column">
            <div style="display: flex;align-items: center;">
                <!-- 拖动目标-->
            <div v-for="(item,index) in list"
                :key="index" class="list-item"
                :class="[activeTypeIndex === index?'list-item-active':'']"
                @dragenter="typeDragenter($event, item,index)"
                @dragover="typeDragover($event, item,index)"
                @dragleave="typeDragleave"
                @drop="typeDrop"
            >
                <div class="title">{{item.type}}</div>

                <template v-if="item.list&&item.list.length">
                <div style="width: 180px;text-align: center;margin: 10px auto;"
                v-for="(c,i2) in item.list" :key="i2">
                    {{c.name}}({{c.en}})
                </div>
                </template>
            </div>
            </div>
            

            <!--    拖动源-->
            <div v-for="(card,i) in cardList"
                :key="i" class="card-item"
                :class="[activeCardIndex === i ? 'active':'']"
                @click="activeCardIndex = i"
                draggable="true"
                @dragstart="cardDragStart($event, card,i)"
                @drag="cardDrag"
                @dragend="cardDragend($event, card,i)"
            >{{card.name}}({{card.en}})</div>
        </div>
    </div>
</template>

<script>
import { setCrumbsAndMenu } from '@/common/common';
export default {
  name: "dragTest",
  setup() {
    setCrumbsAndMenu(1,"可视化拖拽");
  },
  data(){
    return {
      list:[ // 分类数组
        { type:'A',list:[],isError:false },
        { type:'B',list:[],isError:false },
        { type:'C',list:[],isError:false }
      ],
      activeTypeIndex:null, // 选中的分类下标
      cardList:[ // 单词数组
        {name:'苹果',en:'apple',type:'A'},
        {name:'杨桃',en:'carambola',type:'C'},
        {name:'香蕉',en:'banana',type:'B'},
        {name:'蓝莓',en:'blueberry',type:'B'},
        {name:'牛油果',en:'avocado',type:'A'},
        {name:'樱桃',en:'cherry',type:'C'}
      ],
      activeCardIndex:null, // 选中的单词下标
    }
  },
  created() {
    // this.$store.commit('changeState', "可视化拖拽");
    // this.$store.commit('changeMenuIndex', 1);
  },
  methods:{
    cardDragStart(e,item,index){
      this.activeCardIndex = index
      // console.log('cardDragStart--------拖动源：拖动开始时触发----------')
    },
    cardDrag(){
      // console.log('cardDrag-------拖动源：拖动过程中触发-----------')
    },
    cardDragend(e,item,index){
      if(this.activeTypeIndex!=null){
        let typeItem = this.list[this.activeTypeIndex]
        typeItem.list.push(item)
        this.cardList.splice(index,1)
        this.activeTypeIndex = null
      }
      this.activeCardIndex = null
      // console.log('cardDragend-------拖动源：拖动结束触发-----------')
    },
    typeDragenter(e,item,index){
      let cardItem = this.cardList[this.activeCardIndex]

      if(cardItem.type === item.type){
        this.activeTypeIndex = index
      }
      // console.log('typeDragenter-------拖动目标：被拖动元素进入到目标区域时触发-----------')
    },
    typeDragover(e,item,index){
        console.log(index);
      e = e || event;
      if(e.preventDefault){
        e.preventDefault();

        // 修改光标
        let cardItem = this.cardList[this.activeCardIndex]
        if(cardItem.type !== item.type){
          e.dataTransfer.dropEffect = 'none'; // 禁用拖拽到该区域
        } else{
          e.dataTransfer.dropEffect = 'move';//可拖拽到该区域
        }
      }else{
        e.returnValue = false;
      }
      // console.log('typeDragover-------拖动目标：被拖动元素在目标区域移动时触发-----------')
    },
    typeDragleave(){
      this.activeTypeIndex= null
      // console.log('typeDragleave-------拖动目标：被拖动元素离开目标区域时触发-----------')
    },
    typeDrop(){
      // console.log('typeDragenter-------拖动目标：释放鼠标时触发-----------')
    }
  }
}
</script>

<style lang="scss" scoped>
.title-msg {
    text-align:left;
    margin-left: 20px;
}
.list-item{
  border: 1px solid #ccc;
  height: 200px;
  width: 200px;
  display: flex;
  flex-direction: column;
  margin: 10px;
  box-sizing: border-box;
  //transition: all 0.2s;

  .title{
    height: 30px;background: #f5f5f5;text-align: center;line-height: 30px
  }

  &.list-item-active{
    border: 1px solid #0a96ff;
    .title{
      font-weight: bold;
      color: #fff;
      background: #0a96ff;
    }
  }
}
.card-item{
  width: 200px;
  border: 1px solid #ccc;
  padding: 10px;
  margin: 8px;
  text-align: center;
  cursor: pointer;

  &.active{
    border: 1px solid #0a96ff;
    color: #0a96ff;
  }
}
</style>
