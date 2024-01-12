<template>
    <div class="lucky-draw">
        <div class="prize-list" ref="prizeWrap" :style="bgColor">
            <div class="prize-item" v-for="(item, index) in prizeList" :key="index" :style="prizeStyle(index)">
                <img :src="item.pic" alt="">
                <p>{{ item.name }}</p>
            </div>
        </div>
        <div class="btn" @click="start"></div>
    </div>
</template>
  
<script>
import { setCrumbsAndMenu } from '@/common/common';
import { onMounted, onUnmounted, ref, reactive, toRefs, computed } from 'vue';
import tks from '@/assets/tks.png';
import story from '@/assets/story.png';
import game from '@/assets/game.png';
import bbt from '@/assets/bbt.png';
import homework from '@/assets/homework.png';
import read from '@/assets/read.png';
import sport from '@/assets/sport.png';
import clean from '@/assets/clean.png';

export default {
    name: 'LuckyDraw',
    props: {
    },
    setup() {
        setCrumbsAndMenu(2, "抽奖系统");
        const state = reactive({
            prizeList: [
                { name: '听故事', pic: story},
                { name: '玩游戏', pic: game},
                { name: '吃零食', pic: bbt },
                { name: '谢谢参与', pic: tks },
                { name: '写作业', pic: homework },
                { name: '阅读', pic: read },
                { name: '运动', pic: sport },
                { name: '做家务', pic: clean }
            ], // 后台配置的奖品数据
            isRunning: false, // 是否正在抽奖
            baseRunAngle: 360 * 5, // 总共转动角度 至少5圈
            prizeId: 0, // 中奖id
            totalNumber: 1 // 参与次数
        });
        const prizeWrap = ref(null)
        // 平均每个奖品角度
        const rotateAngle = computed(() => {
            const _degree = 360 / state.prizeList.length
            return _degree
        })
        // 要执行总角度数
        const totalRunAngle = computed(() => {
            return state.baseRunAngle + 360 - state.prizeId * rotateAngle.value - rotateAngle.value / 2
        })
        // 计算绘制转盘背景
        const bgColor = computed(() => {
            const _len = state.prizeList.length
            const colorList = ['#5352b3', '#363589']
            let colorVal = ''
            for (let i = 0; i < _len; i++) {
                colorVal += `${colorList[i % 2]} ${rotateAngle.value * i}deg ${rotateAngle.value * (i + 1)}deg,`
            }
            return `
            background: conic-gradient(${colorVal.slice(0, -1)});
          `
        })
        // 每个奖品布局
        const prizeStyle = computed(() => {
            const _degree = rotateAngle.value
            return (i) => {
                return `
              width: ${2 * 270 * Math.sin(_degree / 2 * Math.PI / 180)}px;
              height: 270px;
              transform: rotate(${_degree * i + _degree / 2}deg);
              transform-origin: 50% 100%;
            `
            }
        })
        onMounted(() => {
            prizeWrap.value.style = `${bgColor.value} transform: rotate(-${rotateAngle.value / 2}deg)`
        })
        onUnmounted(() => {
            if(prizeWrap.value) {
                prizeWrap.value.removeEventListener('transitionend', stopRun);
            }
        })
        // 获取随机数
        const getRandomNum = () => {




            
            const num = Math.floor(Math.random() * state.prizeList.length);
            return num;
        }
        const start = () => {
            if (!state.isRunning) {
                state.isRunning = true
                console.log('开始抽奖，后台请求中奖奖品')
                // 请求返回的奖品编号 这里使用随机数
                let prizeId = getRandomNum()
                console.log('中奖ID>>>', prizeId, state.prizeList[prizeId]);
                // if (state.totalNumber % 300 != 0)  {
                //     const numbers = [3,3];
                //     const randomIndex = Math.floor(Math.random() * numbers.length);
                //     prizeId = numbers[randomIndex];
                //     console.log('当前参与次数：', state.totalNumber);
                // }
                state.totalNumber = state.totalNumber + 1;
                if(state.totalNumber > 100){
                    state.totalNumber = 1;
                }
                state.prizeId = prizeId
                startRun()
            }
        }
        const startRun = () => {
            console.log(state.isRunning, totalRunAngle.value)
            // 设置动效
            prizeWrap.value.style = `
            ${bgColor.value}
            transform: rotate(${totalRunAngle.value}deg);
            transition: all 4s ease;
          `
            // 监听transition动效停止事件
            prizeWrap.value.addEventListener('transitionend', stopRun)
        }
        const stopRun = (e) => {
            console.log(e)
            state.isRunning = false
            prizeWrap.value.style = `
            ${bgColor.value}
            transform: rotate(${totalRunAngle.value - state.baseRunAngle}deg);
          `
        }
        return {
            ...toRefs(state),
            bgColor,
            prizeStyle,
            prizeWrap,
            start
        };
    }
}
</script>
  
<style lang="scss" scoped>
.lucky-draw {
    width: 540px;
    height: 540px;
    /*background: #98d3fc url('https://www.jq22.com/demo/vue-luck-draw-pdmm202010260015/img/bg.a4b976d5.png') no-repeat center / 100% 100%;*/
    /*background: conic-gradient( 
       red 6deg, orange 6deg 18deg, yellow 18deg 45deg, 
       green 45deg 110deg, blue 110deg 200deg, purple 200deg);*/
    margin: 100px auto;
    position: relative;
}

.prize-list {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 10px solid #98d3fc;
    overflow: hidden;
}

.prize-item {
    /*border: 2px solid red;*/
    position: absolute;
    left: 0;
    right: 0;
    top: -10px;
    margin: auto;
}

.prize-item img {
    width: 30%;
    height: 20%;
    margin: 40px auto 10px;
    display: block;
}

.prize-item p {
    color: #fff;
    font-size: 12px;
    text-align: center;
    line-height: 20px;
}

.btn {
    width: 160px;
    height: 160px;
    background: url('https://www.jq22.com/demo/jquerylocal201912122316/img/btn_lottery.png') no-repeat center / 100% 100%;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    cursor: pointer;
}

.btn::before {
    content: "";
    width: 41px;
    height: 39px;
    background: url('https://www.jq22.com/demo/jquerylocal201912122316/img/icon_point.png') no-repeat center / 100% 100%;
    position: absolute;
    left: 0;
    right: 0;
    top: -33px;
    margin: auto;
}
</style>
  