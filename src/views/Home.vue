<template>
  <div class="home">
    <Navbar/>
    <div class="container">
      <div class="row">
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
    name: "home",
    components: {
      Navbar, Card, ModalHistory
    },
    data() {
      return {
        log: [],
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
      axios({ method: "GET", "url": "https://gist.githubusercontent.com/miguelgf/e099e5e5bfde4f6428edb0ae94946c83/raw/fa27e59eb8f14ee131fca5c0c7332ff3b924e0b2/" }).then(result => {
        this.processLog(result.data);
        this.createBook();
      }, error => {
        console.error(error);
      });
    },
    methods: {
      showModalFn: function (showModalData) {
        this.modalData = showModalData;
        this.showModalCallsReg = this.modalData.calls.length > 0;
        this.showModalSmsReg = this.modalData.sms.length > 0;
        this.showModal = true;        
      },
      contactExists(number){
        return this.book.find( el => el.number === number );
      },
      createBook(){        
        this.log.forEach(el => {          
          let phoneNumber;

          if(el.callDirection === 0){
            phoneNumber = el.destinationNumber;
          }else if(el.callDirection === 1){
            phoneNumber = el.sourceNumber;
          }
          
          if(!this.contactExists(phoneNumber)){
            let objContact = {};
            objContact.number = phoneNumber;
            objContact.name = el.name;    
            objContact.calls = [];
            objContact.sms = [];       
            this.book.push(objContact);
          }

          if(el.type === 'C'){
            let objCall = {};
            objCall.callDirection = el.callDirection;
            objCall.date = el.callDate.toLocaleString();
            objCall.duration = el.callDuration.toTimeString().split(' ')[0];
            let contactIndex = this.book.findIndex(x => x.number === phoneNumber);
            this.book[contactIndex].calls.push(objCall);
              
          }else if(el.type === 'S'){
            let objSms = {};
            objSms.smsDirection = el.callDirection;
            objSms.date = el.callDate.toLocaleString();
            let contactIndex = this.book.findIndex(x => x.number === phoneNumber);
            this.book[contactIndex].sms.push(objSms);
          }

        });
      },
      processLog(str){
        
        let regExCalls = /(C|S)(\d|\s){18}(0|1).{24}\d{14,20}/g;
        let callsStrArray = str.match(regExCalls);
        let callsObjArray = [];

        callsStrArray.forEach(callStr => {
          let callObj = {};
          //Remove first Char
          callObj.type = callStr.match(/(C|S)/i)[0];
          callStr = callStr.replace(/(C|S)/i,'');          

          //Get Source Number and remove of string
          callObj.sourceNumber = callStr.match(/(\d|\s){9}/i)[0].trim();
          callStr = callStr.replace(/(\d|\s){9}/i,'');

          //Get Destination Number and remove of string
          callObj.destinationNumber = callStr.match(/(\d|\s){9}/i)[0].trim();
          callStr = callStr.replace(/(\d|\s){9}/i,'');

          //Get Incoming/Outgoing Call Char and remove of string
          callObj.callDirection = parseInt(callStr.match(/(0|1)/i)[0]);
          callStr = callStr.replace(/(0|1)/i,'');

          //Get Name and remove of string
          callObj.name = callStr.match(/.{24}/i)[0].trim();
          callStr = callStr.replace(/.{24}/i,'');

          //Remove white spaces
          callStr = callStr.replace(/\s+/i,'');

          //Get Call Date and remove of string
          let strDate = callStr.match(/\d{14}/i)[0];          
          callObj.callDate = new Date(
            parseInt(strDate.substring(4,8)),
            parseInt(strDate.substring(2,4))-1,
            parseInt(strDate.substring(0,2)),
            parseInt(strDate.substring(8,10)),
            parseInt(strDate.substring(10,12)),
            parseInt(strDate.substring(12,14)),
          );
          callStr = callStr.replace(/\w{14}/i,'');

          //Get Call Duration
          let strDuration = callStr.match(/\d{6}/i);
          if(strDuration !== null){
            callObj.callDuration = new Date(
              0, 0, 0,
              parseInt(strDuration[0].substring(0,2)),
              parseInt(strDuration[0].substring(2,4)),
              parseInt(strDuration[0].substring(4,6)),
            );
          }
          
          
          callsObjArray.push(callObj);
        });

        this.log = callsObjArray;
      }
    }
  };
</script>

<style>

</style>
