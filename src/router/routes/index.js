import { lazy } from "react"

// ** Document title
const TemplateTitle = "%s - Vuexy React Admin Template"

// ** Default Route
const DefaultRoute = "/home"

// ** Merge Routes
const Routes = [
  {
    path: "/home",
    component: lazy(() => import("../../views/Home"))
  },
  {
    path: "/advertisers",
    component: lazy(() => import("../../views/admin/advertisers"))
  },
  {
    path: "/banners",
    component: lazy(() => import("../../views/admin/banners"))
  },
  {
    path: "/profiles",
    component: lazy(() => import("../../views/admin/profiles"))
  },
  {
    path: "/users",
    component: lazy(() => import("../../views/admin/users"))
  },
  {
    path: "/blogconsorcios",
    component: lazy(() => import("../../views/admin/getConsorcio/blog"))
  },
  {
    path: "/categoriesconsorcios",
    component: lazy(() => import("../../views/admin/getConsorcio/categories"))
  },

  {
    path: "/blogconsumo",
    component: lazy(() => import("../../views/admin/getConsumo/blog"))
  },
  {
    path: "/categoriesconsumo",
    component: lazy(() => import("../../views/admin/getConsumo/categories"))
  },

  {
    path: "/blogeducacao",
    component: lazy(() => import("../../views/admin/getEducacao/blog"))
  },
  {
    path: "/categorieseducacao",
    component: lazy(() => import("../../views/admin/getEducacao/categories"))
  },

  {
    path: "/blogfinancas",
    component: lazy(() => import("../../views/admin/getFinancas/blog"))
  },
  {
    path: "/categoriesfinancas",
    component: lazy(() => import("../../views/admin/getFinancas/categories"))
  },

  {
    path: "/bloglazer",
    component: lazy(() => import("../../views/admin/getLazer/blog"))
  },
  {
    path: "/categorieslazer",
    component: lazy(() => import("../../views/admin/getLazer/categories"))
  },

  {
    path: "/blogsaude",
    component: lazy(() => import("../../views/admin/getSaude/blog"))
  },
  {
    path: "/categoriessaude",
    component: lazy(() => import("../../views/admin/getSaude/categories"))
  },
  {
    path: "/login",
    component: lazy(() => import("../../views/Login")),
    layout: "BlankLayout",
    meta: {
      authRoute: true
    }
  },
  {
    path: "/error",
    component: lazy(() => import("../../views/Error")),
    layout: "BlankLayout"
  }
]

export { DefaultRoute, TemplateTitle, Routes }
