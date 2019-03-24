<template>
  <div class="load-file">
    <Navbar/>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <b-form @submit="onSubmit">
             <b-form-group
              id="phoneInputGroup"
              label="Number Telephone (only works 611111111):"
              label-for="numberInput">
              <b-form-input
                id="numberInput"
                type="number"
                v-model="form.number"
                required
                placeholder="Enter number" />
            </b-form-group>
            <b-button type="submit" variant="primary">Add!</b-button>
          </b-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import axios from "axios";

export default {
  name: "LoadFile",
  components: {
    Navbar
  },
  data() {
    return {
      form: {
        number: ''
      }
    }
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault()
      let number = this.form.number;
      this.getLogFromApi(number);
    },
    getLogFromApi(number){
      axios({ method: "GET", "url": "https://gist.githubusercontent.com/miguelgf/e099e5e5bfde4f6428edb0ae94946c83/raw/fa27e59eb8f14ee131fca5c0c7332ff3b924e0b2/communications."+number+".log" }).then(result => {
        this.form.number = '';
        this.processLog(number, result.data);
      }, error => {
        alert("There is no log with "+number);
      });
    },
    contactExists(book, number){
      return book.find( el => el.number === number );
    },
    processLog(number, str){      
      let regExCalls = /(C|S)(\d|\s){18}(0|1).{24}\d{14,20}/g;
      let callsStrArray = str.match(regExCalls);
      let callsObjArray = [];
      let itemsProcessed = 0;
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
        itemsProcessed++;
        if(itemsProcessed === callsStrArray.length) {
          this.createBook(number, callsObjArray);
        }
      });

      
    },
    createBook(number, callsObjArray){       
      let contacts = []; 
      let itemsProcessed = 0;
      callsObjArray.forEach(el => {          
        let phoneNumber;

        if(el.callDirection === 0){
          phoneNumber = el.destinationNumber;
        }else if(el.callDirection === 1){
          phoneNumber = el.sourceNumber;
        }
        
        if(!this.contactExists(contacts, phoneNumber)){
          let objContact = {};
          objContact.number = phoneNumber;
          objContact.name = el.name;    
          objContact.calls = [];
          objContact.sms = [];       
          contacts.push(objContact);
        }

        if(el.type === 'C'){
          let objCall = {};
          objCall.callDirection = el.callDirection;
          objCall.date = el.callDate.toLocaleString();
          objCall.duration = el.callDuration.toTimeString().split(' ')[0];
          let contactIndex = contacts.findIndex(x => x.number === phoneNumber);
          contacts[contactIndex].calls.push(objCall);
            
        }else if(el.type === 'S'){
          let objSms = {};
          objSms.smsDirection = el.callDirection;
          objSms.date = el.callDate.toLocaleString();
          let contactIndex = contacts.findIndex(x => x.number === phoneNumber);
          contacts[contactIndex].sms.push(objSms);
        }

        itemsProcessed++;
        if(itemsProcessed === callsObjArray.length) {
          let book = {
            number : number,
            contacts: contacts
          }
          this.$store.state.books.push(book);
          alert("The number is correctly added");
        }        
      });      
    }
  }
}
</script>