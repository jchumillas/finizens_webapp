<template>
<nav class="navbar navbar-expand-lg navbar-light bg-light" v-bind:class=" { 'navbarOpen': show }">
  <a class="navbar-brand" href="#">Finizens App</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" v-on:click="toggleNavbar">
      <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarSupportedContent" v-bind:class="{ 'show': show }">
      <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
              <router-link to="/"><a class="nav-link">Contacts</a></router-link>
          </li>
          <li class="nav-item">
              <router-link to="/load-file"><a class="nav-link">Load File</a></router-link>
          </li>
      </ul>
  </div>
</nav>
</template>

<script>
export default {
  name: "Navbar",
  props: {
    msg: String
  },
  data(){
    return{
      show: true
    }
  },
  methods: {
    toggleNavbar() {
      this.show = !this.show;
    }
  }
};
</script>
<style>
  nav{
    margin-bottom: 25px;
  }
</style>
