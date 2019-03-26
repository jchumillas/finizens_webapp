<template>
  <div class="load-file">
    <Navbar/>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <b-form @submit="onSubmit">
             <b-form-group
              id="phoneInputGroup"
              label="Telephone Number (only works 611111111):"
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
import Environment from "@/config/env.js";
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
      axios({ method: "GET", "url": Environment.url+"/api/agenda/"+number }).then(result => {
        this.form.number = '';
        this.$store.state.books.push(result.data);
        alert("The number is correctly added");
      }, error => {
        alert("There is no log with "+number);
      });
    }
  }
}
</script>