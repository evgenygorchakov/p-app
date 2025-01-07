import { createApp as createVueApp, h, type Component } from 'vue'
import { type PageContext } from 'vike/types'
import PageLayout from './PageLayout.vue'

export function createApp(pageContext: PageContext) {
 const { Page } = pageContext

 const pageWithLayout = {
  render() {
    return h(PageLayout, {}, { default: () => h(Page as Component) })
  }
 }

 const app = createVueApp(pageWithLayout)
 return app
}
