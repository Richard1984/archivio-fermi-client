import Vue from 'vue'
import VueRouter from 'vue-router'

import v1 from '@/utils/v1'

// Home
import LandingHomeView from '@/views/home/landing/landing'
import SearchHomeView from '@/views/home/search/search'

// Dashboard
import DashboardView from '@/views/root/dashboard/dashboard'

// Admin
import AdminView from '@/views/root/admin/admin'
import SendMailAdminView from '@/views/root/admin/send.mails/send.mails'
// import EntitiesAdminView from '@/views/root/admin/entities/entities'
import CreateUserAdminView from '@/views/root/admin/users/create/create'
import SearchUsersAdminView from '@/views/root/admin/users/search/search'
import ServicesAdminView from '@/views/root/admin/services/services'

// Documents
import DocumentsView from '@/views/root/documents/documents'
import DocumentsCreateView from '@/views/root/documents/create/create'
import DocumentsSearchView from '@/views/root/documents/search/search'
import DocumentsTransferView from '@/views/root/documents/transfer/transfer'

// Collections
import CollectionsView from '@/views/root/collections/collections'
import CollectionsCreateView from '@/views/root/collections/create/create'
import CollectionsSearchView from '@/views/root/collections/search/search'

// Settings
import SettingsView from '@/views/root/settings/settings'
import SettingsAccountView from '@/views/root/settings/account/account'
import SettingsAuthenticationView from '@/views/root/settings/authentication/authentication'

// User
import UserView from '@/views/root/user/user'

// Errors
import NotFoundComponent from '@/routes/404.error.route/404'

Vue.use(VueRouter)

const loadView = view => () => import(`@/routes/${view}.vue`)

const auth = async (to, from, next) => {
  try {
    if (!localStorage.getItem('id')) {
      throw new Error('Non si detengono i privilegi necessari.')
    }
    await v1.get('/users/' + localStorage.getItem('id'))
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

const routes = [{
  path: '/',
  component: loadView('root.route/root'),
  beforeEnter: auth,
  children: [{
    path: '',
    name: 'Root',
    redirect: {
      path: '/dashboard/'
    }
  }, {
    path: 'dashboard',
    name: 'DashboardView',
    component: DashboardView
  }, {
    path: '/admin/',
    component: AdminView,
    children: [{
      path: '',
      name: 'AdminView',
      redirect: {
        path: '/admin/services/'
      }
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
    },
    // {
    //   path: '/admin/entities/',
    //   name: 'EntitiesAdminView',
    //   component: EntitiesAdminView
    // },
    {
      path: '/admin/services/',
      name: 'ServicesAdminView',
      component: ServicesAdminView
    }]
  }, {
    path: '/settings/',
    component: SettingsView,
    children: [{
      path: '',
      name: 'SettingsView',
      redirect: {
        path: '/settings/account'
      }
    }, {
      path: '/settings/account',
      name: 'SettingsAccountView',
      component: SettingsAccountView
    }, {
      path: '/settings/authentication',
      name: 'SettingsAuthenticationView',
      component: SettingsAuthenticationView
    }]
  }, {
    path: '/user/:id',
    name: 'UserView',
    component: UserView
  }, {
    path: '/documents/',
    component: DocumentsView,
    children: [{
      path: '',
      name: 'DocumentsView',
      redirect: {
        path: '/documents/create/'
      }
    }, {
      path: '/documents/create',
      name: 'DocumentsCreateView',
      component: DocumentsCreateView
    }, {
      path: '/documents/search',
      name: 'DocumentsSearchView',
      component: DocumentsSearchView
    }, {
      path: '/documents/transfer',
      name: 'DocumentsTransferView',
      component: DocumentsTransferView
    }]
  }, {
    path: '/collections/',
    component: CollectionsView,
    children: [{
      path: '',
      name: 'CollectionsView',
      redirect: {
        path: '/collections/create/'
      }
    }, {
      path: '/collections/create/',
      name: 'CollectionsCreateView',
      component: CollectionsCreateView
    }, {
      path: '/collections/search/',
      name: 'CollectionsSearchView',
      component: CollectionsSearchView
    }]
  }, {
    path: '/logout',
    name: 'Logout',
    beforeEnter (to, from, next) {
      localStorage.clear()
      // let date = (new Date()).toUTCString()
      // document.cookie = `token=; expires=${date}; path=/;`
      next('/home/')
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
  path: '/docs/',
  beforeEnter (to, from, next) {
    window.location = 'https://itisenricofermi.github.io/archivio-digitale-docs/'
  }
}, {
  path: '*',
  component: NotFoundComponent
}]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.afterEach((to, from) => {
  document.title = to.meta.title || 'Archivio Digitale | ITIS Enrico Fermi'
})

export default router
