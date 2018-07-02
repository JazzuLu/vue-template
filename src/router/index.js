import Vue from 'vue'
import Router from 'vue-router'
import { $utils } from '../plugins'
Vue.use(Router)

/**
 * 动态扫描路由模块 生成路由
 */
const _import = file => () => import(`@/pages/${file}`)

let requireComponent = route => {
  route.component = _import(route.component)
  if ($utils.isAry(route.children) && route.children.length > 0) {
    route.children.forEach(child => requireComponent(child))
  }
  return route
}

let modules = (r => {
  return r.keys().map(key => requireComponent(r(key).default))
})(require.context('./', true, /^\.\/modules\/((?!\/)[\s\S])+\.js$/))

modules.unshift({
  path: '/',
  component: _import('index.vue'),
  meta: {
    title: '测试信息'
  }
})

export default new Router({
  routes: modules
})
