<template>
  <div class="home">
    <Navbar/>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <b-form-group id="inputGroupPhoneNumbers" label="Select Phone Number:" label-for="inputPhoneNumbers">
            <b-form-select :disabled="phoneNumbers.length == 0" id="inputPhoneNumbers" :options="phoneNumbers" v-model="selectedNumber" v-on:change="onChangeNumber($event)"/>
          </b-form-group>
        </div>
        <div class="col-12">
          <div class="card-deck" style="margin-top: 25px" v-for="i in Math.ceil(book.length / 3)" :key=i>
            <Card v-for="item in book.slice((i - 1) * 3, i * 3)" :value=item :key=item.number></Card>
          </div>
        </div>
      </div>
    </div>

    <ModalHistory v-if="showModal" @close="showModal = false">
      <template slot="modal-header">{{ modalData.name }} ({{ modalData.number }})</template>
      <template slot="call-register">
        <tr v-for="(item, index) in modalData.calls" :value=item :key=index>
            <th scope="row">{{index + 1}}</th>
            <td>
              <div v-if="item.callDirection === 0">
                <i class="fas fa-phone"></i> 
                <i class="fas fa-arrow-right"></i>
              </div>
              <div v-else-if="item.callDirection === 1">
                <i class="fas fa-phone"></i> 
                <i class="fas fa-arrow-left"></i>
              </div>
            </td>
            <td>{{item.date}}</td>
            <td>{{item.duration}}</td>
        </tr>
      </template>

      <template slot="sms-register">
        <tr v-for="(item, index) in modalData.sms" :value=item :key=index>
            <th scope="row">{{index + 1}}</th>
            <td>
              <div v-if="item.smsDirection === 0">
                <i class="fas fa-phone"></i> 
                <i class="fas fa-arrow-right"></i>
              </div>
              <div v-else-if="item.smsDirection === 1">
                <i class="fas fa-phone"></i> 
                <i class="fas fa-arrow-left"></i>
              </div>
            </td>
            <td>{{item.date}}</td>
        </tr>
      </template>
    </ModalHistory>
  </div>
  
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Card from "@/components/Card.vue";
import ModalHistory from "@/components/ModalHistory.vue";
import axios from "axios";

export default {
  name: "Home",
  components: {
    Navbar, Card, ModalHistory
  },
  data() {
    return {
      phoneNumbers: [],
      selectedNumber: null,
      book: [],
      showModal: false,
      modalData: {
        number: Number,
        name: String,
        calls: Array
      },
      showModalCallsReg: false,
      showModalSmsReg: false,
    };
  },
  mounted() {    
    if(this.$store.state.books.length > 0){
      this.$store.state.books.forEach(element => {
        this.phoneNumbers.push(element.number);
      });         
    }
  },
  methods: {
    showModalFn(showModalData) {
      this.modalData = showModalData;
      this.showModalCallsReg = this.modalData.calls.length > 0;
      this.showModalSmsReg = this.modalData.sms.length > 0;
      this.showModal = true;        
    },
    onChangeNumber(){
      let number = parseInt(this.selectedNumber);
      let match = this.$store.state.books.find(el => parseInt(el.number) === number);
      if(match != undefined){
        this.book = match.contacts;
      }
    }       
  }
};
</script>