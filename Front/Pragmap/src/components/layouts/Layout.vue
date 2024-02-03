<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-vue-next'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu'
import { RouterLink } from 'vue-router'
import { Toaster } from '@/components/ui/toast'

const mode = useColorMode()
const switchMode = () => {
  mode.value = mode.value === 'light' ? 'dark' : 'light'
}
const components: Array<{ title: string; href: string; description: string }> = [
  {
    title: 'Alert Dialog',
    href: '/roadMap',
    description:
      'A modal dialog that interrupts the user with important content and expects a response.'
  },
  {
    title: 'Hover Card',
    href: '/docs/primitives/hover-card',
    description: 'For sighted users to preview content available behind a link.'
  },
  {
    title: 'Progress',
    href: '/docs/primitives/progress',
    description:
      'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.'
  },
  {
    title: 'Scroll-area',
    href: '/docs/primitives/scroll-area',
    description: 'Visually or semantically separates content.'
  },
  {
    title: 'Tabs',
    href: '/docs/primitives/tabs',
    description:
      'A set of layered sections of content—known as tab panels—that are displayed one at a time.'
  },
  {
    title: 'Tooltip',
    href: '/docs/primitives/tooltip',
    description:
      'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.'
  }
]
</script>

<template>
  <div class="p-6">
    <header class="flex justify-between mb-6">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink :class="navigationMenuTriggerStyle()" as-child>
              <RouterLink to="/">Accueil</RouterLink>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Utlisateurs</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul class="grid gap-2 p-4 md:w-[400px]">
                <li>
                  <RouterLink to="/users">
                    <div
                      class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      data-radix-vue-collection-item=""
                      data-tabindex=""
                      tabindex="-1"
                    >
                      <div class="text-sm font-medium leading-none">
                        Tableau de bord des utilisateurs
                      </div>
                      <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Re-usable components built using Radix UI and Tailwind CSS.
                      </p>
                    </div>
                  </RouterLink>
                </li>
                <li>
                  <RouterLink to="/users/create">
                    <div
                      href="/users/create"
                      class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      data-radix-vue-collection-item=""
                      data-tabindex=""
                      tabindex="-1"
                    >
                      <div class="text-sm font-medium leading-none">Création d'un utilisateur</div>
                      <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        How to install dependencies and structure your app.
                      </p>
                    </div>
                  </RouterLink>
                </li>
                <li>
                  <RouterLink to="/roadMap">
                    <div
                      href="/roadMap"
                      class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      data-radix-vue-collection-item=""
                      data-tabindex=""
                      tabindex="-1"
                    >
                      <div class="text-sm font-medium leading-none">Création d'une RoadMap</div>
                      <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Comment créer une roadmap
                      </p>
                    </div>
                  </RouterLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Components</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul class="grid w-[400px] gap-2 p-4 md:w-[600px] md:grid-cols-2">
                <li v-for="component in components" :key="component.title">
                  <a
                    :href="component.href"
                    class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    data-radix-vue-collection-item=""
                    data-tabindex=""
                    tabindex="-1"
                  >
                    <div class="text-sm font-medium leading-none">
                      {{ component.title }}
                    </div>
                    <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      {{ component.description }}
                    </p>
                  </a>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink :class="navigationMenuTriggerStyle()" as-child>
              <RouterLink to="/logout">Déconnexion</RouterLink>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <Button class="" variant="outline" size="icon" @click="switchMode">
        <Sun v-if="mode === 'light'" class="w-4 h-4" />
        <Moon v-if="mode === 'dark'" class="w-4 h-4" />
      </Button>
    </header>

    <main class="w-full">
      <slot />
    </main>

    <Toaster />
  </div>
</template>
