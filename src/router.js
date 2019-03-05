import Vue from 'vue'
import Router from 'vue-router'
import v1 from '@/utils/v1'
import nprogress from '@/utils/nprogress'

// Home
import LandingHomeView from '@/views/home/landing/landing'
import SearchHomeView from '@/views/home/search/search'

// Dashboard
import DashboardView from '@/views/root/dashboard/dashboard'

// Admin
import SendMailAdminView from '@/views/root/admin/send.mails/send.mails'
import CreateUserAdminView from '@/views/root/admin/users/create/create'
import SearchUsersAdminView from '@/views/root/admin/users/search/search'
import ServicesAdminView from '@/views/root/admin/services/services'

// Search
import DocumentsSearchView from '@/views/root/search/documents/documents'
import CollectionsSearchView from '@/views/root/search/collections/collections'

// Create
import DocumentsCreateView from '@/views/root/create/documents/documents'
import CollectionsCreateView from '@/views/root/create/collections/collections'

import SettingsView from '@/views/root/settings/settings'
import UserView from '@/views/root/user/user'

// Errors
import NotFoundComponent from '@/routes/404.error.route/404'

Vue.use(Router)

const loadView = view => () => import(/* webpackChunkName: "view-[request]" */ `@/routes/${view}.vue`)

const auth = async (to, from, next) => {
  try {
    await v1.post('/users/me/logged', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })

    if (to.name === 'Root' || to.name === 'Home' || to.name === 'Login' || to.name === 'SignUp') {
      next({
        path: '/dashboard/'
      })
    } else {
      next()
    }
  } catch (e) {
    if (to.name === 'Login' || to.name === 'SignUp' || to.name === 'Home' || to.name === 'Search') {
      next()
    } else {
      next({
        path: '/home/'
      })
    }
  }
}

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
    path: '/',
    name: 'Root',
    component: loadView('root.route/root'),
    beforeEnter: auth,
    children: [{
      path: 'dashboard',
      name: 'DashboardView',
      component: DashboardView
    }, {
      path: '/admin/users/create/',
      name: 'CreateUserAdminView',
      component: CreateUserAdminView
    }, {
      path: '/admin/users/search/',
      name: 'SearchUsersAdminView',
      component: SearchUsersAdminView
    }, {
      path: '/admin/sendmail/',
      name: 'SendMailAdminView',
      component: SendMailAdminView
    }, {
      path: '/admin/services/',
      name: 'ServicesAdminView',
      component: ServicesAdminView
    }, {
      path: 'settings',
      name: 'SettingsView',
      component: SettingsView
    }, {
      path: 'user',
      name: 'UserView',
      component: UserView
    }, {
      path: '/create/documents/',
      name: 'DocumentsCreateView',
      component: DocumentsCreateView
    }, {
      path: '/create/collections/',
      name: 'CollectionsCreateView',
      component: CollectionsCreateView
    }, {
      path: '/search/documents/',
      name: 'DocumentsSearchView',
      component: DocumentsSearchView
    }, {
      path: '/search/collections/',
      name: 'CollectionsSearchView',
      component: CollectionsSearchView
    }, {
      path: '/logout',
      name: 'Logout',
      beforeEnter (to, from, next) {
        localStorage.removeItem('token')
        // let date = (new Date()).toUTCString()
        // document.cookie = `token=; expires=${date}; path=/;`
        next('/')
      }
    }]
  }, {
    path: '/home',
    component: loadView('home.route/home'),
    beforeEnter: auth,
    children: [{
      path: '',
      name: 'Home',
      component: LandingHomeView
    }, {
      path: 'search',
      name: 'Search',
      component: SearchHomeView
    }]
  }, {
    path: '/login',
    name: 'Login',
    component: loadView('login.route/login'),
    beforeEnter: auth
  }, {
    path: '/signup',
    name: 'SignUp',
    component: loadView('signup.route/signup'),
    beforeEnter: auth
  }, {
    path: '/files/:id',
    name: 'Files',
    component: loadView('files.route/files')
  }, {
    path: '*',
    component: NotFoundComponent
  }]
})

export default router
