<template>
<div class="card">
    <img class="card-img-top">
    <div class="card-body">
        <h5 class="card-title">{{value.name}}</h5>
        <p class="card-text">{{value.number}}</p>
        <a href="#" @click="openCallHistory()" v-b-modal.myModa class="btn btn-outline-info">Open</a>
    </div>
</div>
</template>

<script>
export default {
    name: "Card",
    props: {
        value: Object
    },
    created(){
        if(this.value.name.length === 0){
            this.value.name = "Unknow"
        }
    },
    methods:{
        openCallHistory(value){       
            this.$parent.showModalFn(this.value);
        }
    }
};
</script>
