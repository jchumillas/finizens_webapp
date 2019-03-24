import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import LoadFile from "./views/LoadFile.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home
    },
    {
      path: "/load-file",
      name: "LoadFile",
      component: LoadFile
    }
  ]
});
