import { type PageContextClient } from 'vike/types';
import { createApp } from './app'

export async function onRenderClient(pageContext: PageContextClient) {
  const app = createApp(pageContext)
  app.mount('#app')
}
