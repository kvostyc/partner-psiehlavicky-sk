import { createRouter, createWebHistory } from 'vue-router'

import SigninView from '@/views/Authentication/SigninView.vue'
import SignupView from '@/views/Authentication/SignupView.vue'
import CalendarView from '@/views/CalendarView.vue'
import BasicChartView from '@/views/Charts/BasicChartView.vue'
import ECommerceView from '@/views/Dashboard/ECommerceView.vue'
import FormElementsView from '@/views/Forms/FormElementsView.vue'
import FormLayoutView from '@/views/Forms/FormLayoutView.vue'
import SettingsView from '@/views/Pages/SettingsView.vue'
import ProfileView from '@/views/ProfileView.vue'
import TablesView from '@/views/TablesView.vue'
import AlertsView from '@/views/UiElements/AlertsView.vue'
import ButtonsView from '@/views/UiElements/ButtonsView.vue'
import ProductIndex from '@/views/Pages/Product/ProductIndex.vue'
import ShopIndex from '@/views/Pages/Shop/ShopIndex.vue'
import { useUserStore } from '@/stores/userStore'
import ProductCreate from '@/views/Pages/Product/ProductCreate.vue'

const routes = [
  {
    path: '/',
    name: 'eCommerce',
    component: ECommerceView,
    meta: {
      title: 'Dashboard'
    }
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: CalendarView,
    meta: {
      title: 'Calendar'
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: {
      title: 'Profile'
    }
  },
  {
    path: '/forms/form-elements',
    name: 'formElements',
    component: FormElementsView,
    meta: {
      title: 'Form Elements'
    }
  },
  {
    path: '/forms/form-layout',
    name: 'formLayout',
    component: FormLayoutView,
    meta: {
      title: 'Form Layout'
    }
  },
  {
    path: '/tables',
    name: 'tables',
    component: TablesView,
    meta: {
      title: 'Tables'
    }
  },
  {
    path: '/pages/settings',
    name: 'settings',
    component: SettingsView,
    meta: {
      title: 'Settings'
    }
  },
  {
    path: '/charts/basic-chart',
    name: 'basicChart',
    component: BasicChartView,
    meta: {
      title: 'Basic Chart'
    }
  },
  {
    path: '/ui-elements/alerts',
    name: 'alerts',
    component: AlertsView,
    meta: {
      title: 'Alerts'
    }
  },
  {
    path: '/ui-elements/buttons',
    name: 'buttons',
    component: ButtonsView,
    meta: {
      title: 'Buttons'
    }
  },
  {
    path: '/login',
    name: 'signin',
    component: SigninView,
    meta: {
      title: 'Signin'
    }
  },
  {
    path: '/register',
    name: 'signup',
    component: SignupView,
    meta: {
      title: 'Signup'
    }
  },
  {
    path: '/products',
    name: 'products.index',
    component: ProductIndex,
    meta: {
      title: 'Products',
    },
  },
  {
    path: '/product/create',
    name: 'products.create',
    component: ProductCreate,
    meta: {
      title: 'Vytvoriť produkt',
    },
  },
  {
    path: '/product/edit/:id',
    name: 'products.edit',
    component: ProductCreate,
    meta: {
      title: 'Upraviť produkt',
    },
  },
  {
    path: '/shops',
    name: 'shops.index',
    component: ShopIndex,
    meta: {
      title: 'Moje e-shopy',
      permission: "view shop",
    },
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  }
})

router.beforeEach(async (to, from, next) => {
  document.title = `${to.meta.title} | Psiehlavičky Partner`;
  const userStore = useUserStore();

  if (!userStore.user && to.name !== "signin") {
    await userStore.getUser();
  }

  if (typeof to.meta.permission === "string" && !userStore.hasPermission(to.meta.permission)) {
    return next("/403");
  }

  if (typeof to.meta.role === "string" && !userStore.hasRole(to.meta.role)) {
    return next("/403");
  }

  next();
});


export default router
