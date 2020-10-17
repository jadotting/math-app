import Vue from 'vue';
import firebase from 'firebase';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';

Vue.config.productionTip = false;


Vue.use(BootstrapVue);
Vue.use(ElementUI);

firebase.initializeApp({
  apiKey: 'AIzaSyAgT_FTwwwM5GHBiqxF-2vXunVWBN15qFM',
  authDomain: 'cz3003-assignment.firebaseapp.com',
  databaseURL: 'https://cz3003-assignment.firebaseio.com',
  projectId: 'cz3003-assignment',
  storageBucket: '',
  messagingSenderId: '978246475048',
  appId: '1:978246475048:web:cf075fec9801a67f71041d',
});


firebase.auth().onAuthStateChanged(() => {
  let app;
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App),
    }).$mount('#app');
  }
});
