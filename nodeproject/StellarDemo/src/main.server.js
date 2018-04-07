

// import 'bootstrap'

// import Vue from 'vue';

// import BootstrapVue from 'bootstrap-vue'

// Vue.use(BootstrapVue)

// import App from './App.vue';

// // import 'bootstrap/dist/css/bootstrap.css'
// // import 'bootstrap-vue/dist/bootstrap-vue.css'


// import Vue from 'vue'
// import BootstrapVue from 'bootstrap-vue'


// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'


import Vue from 'vue'
// import BootstrapVue from 'bootstrap-vue'
import App from './App.vue'
// import '../node_modules/bootstrap/dist/css/bootstrap.css'
// import '../node_modules/bootstrap-vue/dist/bootstrap-vue.css'

// Vue.use(BootstrapVue);


// Receives the context of the render call, returning a Promise resolution to the root Vue instance.
export default context => {
  return Promise.resolve(
    new Vue({
      render: h => h(App)
    })
    
  );
}