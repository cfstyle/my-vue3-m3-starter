import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  argbFromHex,
  hexFromArgb,
  CorePalette
} from '@material/material-color-utilities'

export type ThemeMode = 'light' | 'dark'
export type LayoutContext = 'admin' | 'portal'
export type DensityMode = 'comfortable' | 'compact'

export interface SeedPreset {
  key: string
  name: string
  hex: string
}

export const SEED_PRESETS: SeedPreset[] = [
  { key: 'aurora-purple', name: '极光紫', hex: '#6750A4' },
  { key: 'deep-ocean', name: '深海青', hex: '#006A6A' },
  { key: 'cobalt-blue', name: '商务钴蓝', hex: '#0061A4' },
  { key: 'forest-green', name: '森林绿', hex: '#386A20' }
]

const THEME_STORAGE_KEY = 'm3-theme'
const SEED_STORAGE_KEY = 'm3-seed-color'
const CONTEXT_STORAGE_KEY = 'm3-layout-context'
const DENSITY_STORAGE_KEY = 'm3-density'

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref<ThemeMode>('light')
  const seedColor = ref<string>('#6750A4')
  const layoutContext = ref<LayoutContext>('admin')
  const density = ref<DensityMode>('comfortable')

  const isDark = computed(() => currentTheme.value === 'dark')

  /**
   * 基于官方 HCT 动态色彩算法计算并向 :root 注入完整 M3 变量
   * 严格遵循 M3 HCT 明度规范：浅色模式下所有 container 保持 Tone 90
   */
  const applyM3Theme = (seedHex: string, dark: boolean) => {
    try {
      const argb = argbFromHex(seedHex)
      const corePalette = CorePalette.of(argb)

      const root = document.documentElement

      const p = corePalette.a1
      const s = corePalette.a2
      const t = corePalette.a3
      const n = corePalette.n1
      const nv = corePalette.n2
      const err = corePalette.error

      const tokens: Record<string, string> = dark
        ? {
            // Dark Mode Tokens
            '--md-sys-color-primary': hexFromArgb(p.tone(80)),
            '--md-sys-color-on-primary': hexFromArgb(p.tone(20)),
            '--md-sys-color-primary-container': hexFromArgb(p.tone(30)),
            '--md-sys-color-on-primary-container': hexFromArgb(p.tone(90)),
            '--md-sys-color-inverse-primary': hexFromArgb(p.tone(40)),

            '--md-sys-color-secondary': hexFromArgb(s.tone(80)),
            '--md-sys-color-on-secondary': hexFromArgb(s.tone(20)),
            '--md-sys-color-secondary-container': hexFromArgb(s.tone(30)),
            '--md-sys-color-on-secondary-container': hexFromArgb(s.tone(90)),

            '--md-sys-color-tertiary': hexFromArgb(t.tone(80)),
            '--md-sys-color-on-tertiary': hexFromArgb(t.tone(20)),
            '--md-sys-color-tertiary-container': hexFromArgb(t.tone(30)),
            '--md-sys-color-on-tertiary-container': hexFromArgb(t.tone(90)),

            '--md-sys-color-error': hexFromArgb(err.tone(80)),
            '--md-sys-color-on-error': hexFromArgb(err.tone(20)),
            '--md-sys-color-error-container': hexFromArgb(err.tone(30)),
            '--md-sys-color-on-error-container': hexFromArgb(err.tone(90)),

            '--md-sys-color-surface': hexFromArgb(n.tone(6)),
            '--md-sys-color-surface-dim': hexFromArgb(n.tone(6)),
            '--md-sys-color-surface-bright': hexFromArgb(n.tone(24)),
            '--md-sys-color-surface-container-lowest': hexFromArgb(n.tone(4)),
            '--md-sys-color-surface-container-low': hexFromArgb(n.tone(10)),
            '--md-sys-color-surface-container': hexFromArgb(n.tone(12)),
            '--md-sys-color-surface-container-high': hexFromArgb(n.tone(17)),
            '--md-sys-color-surface-container-highest': hexFromArgb(n.tone(22)),

            '--md-sys-color-on-surface': hexFromArgb(n.tone(90)),
            '--md-sys-color-on-surface-variant': hexFromArgb(nv.tone(80)),
            '--md-sys-color-outline': hexFromArgb(nv.tone(60)),
            '--md-sys-color-outline-variant': hexFromArgb(nv.tone(30)),
            '--md-sys-color-inverse-surface': hexFromArgb(n.tone(90)),
            '--md-sys-color-inverse-on-surface': hexFromArgb(n.tone(20))
          }
        : {
            // Light Mode Tokens (Tone 90 容器平衡规范)
            '--md-sys-color-primary': hexFromArgb(p.tone(40)),
            '--md-sys-color-on-primary': hexFromArgb(p.tone(100)),
            '--md-sys-color-primary-container': hexFromArgb(p.tone(90)),
            '--md-sys-color-on-primary-container': hexFromArgb(p.tone(10)),
            '--md-sys-color-inverse-primary': hexFromArgb(p.tone(80)),

            '--md-sys-color-secondary': hexFromArgb(s.tone(40)),
            '--md-sys-color-on-secondary': hexFromArgb(s.tone(100)),
            '--md-sys-color-secondary-container': hexFromArgb(s.tone(90)),
            '--md-sys-color-on-secondary-container': hexFromArgb(s.tone(10)),

            '--md-sys-color-tertiary': hexFromArgb(t.tone(40)),
            '--md-sys-color-on-tertiary': hexFromArgb(t.tone(100)),
            '--md-sys-color-tertiary-container': hexFromArgb(t.tone(90)),
            '--md-sys-color-on-tertiary-container': hexFromArgb(t.tone(10)),

            '--md-sys-color-error': hexFromArgb(err.tone(40)),
            '--md-sys-color-on-error': hexFromArgb(err.tone(100)),
            '--md-sys-color-error-container': hexFromArgb(err.tone(90)),
            '--md-sys-color-on-error-container': hexFromArgb(err.tone(10)),

            '--md-sys-color-surface': hexFromArgb(n.tone(98)),
            '--md-sys-color-surface-dim': hexFromArgb(n.tone(87)),
            '--md-sys-color-surface-bright': hexFromArgb(n.tone(98)),
            '--md-sys-color-surface-container-lowest': hexFromArgb(n.tone(100)),
            '--md-sys-color-surface-container-low': hexFromArgb(n.tone(96)),
            '--md-sys-color-surface-container': hexFromArgb(n.tone(94)),
            '--md-sys-color-surface-container-high': hexFromArgb(n.tone(92)),
            '--md-sys-color-surface-container-highest': hexFromArgb(n.tone(90)),

            '--md-sys-color-on-surface': hexFromArgb(n.tone(10)),
            '--md-sys-color-on-surface-variant': hexFromArgb(nv.tone(30)),
            '--md-sys-color-outline': hexFromArgb(nv.tone(50)),
            '--md-sys-color-outline-variant': hexFromArgb(nv.tone(80)),
            '--md-sys-color-inverse-surface': hexFromArgb(n.tone(20)),
            '--md-sys-color-inverse-on-surface': hexFromArgb(n.tone(95))
          }

      for (const [varName, varVal] of Object.entries(tokens)) {
        root.style.setProperty(varName, varVal)
      }
    } catch (e) {
      console.warn('Failed to apply M3 HCT dynamic theme:', e)
    }
  }

  const setTheme = (theme: ThemeMode) => {
    currentTheme.value = theme
    document.documentElement.dataset.theme = theme
    localStorage.setItem(THEME_STORAGE_KEY, theme)
    applyM3Theme(seedColor.value, theme === 'dark')
  }

  const toggleTheme = () => {
    setTheme(currentTheme.value === 'dark' ? 'light' : 'dark')
  }

  const setSeedColor = (hex: string) => {
    seedColor.value = hex
    localStorage.setItem(SEED_STORAGE_KEY, hex)
    applyM3Theme(hex, isDark.value)
  }

  const setLayoutContext = (ctx: LayoutContext) => {
    layoutContext.value = ctx
    document.documentElement.dataset.context = ctx
    localStorage.setItem(CONTEXT_STORAGE_KEY, ctx)
  }

  const setDensity = (den: DensityMode) => {
    density.value = den
    document.documentElement.dataset.density = den
    localStorage.setItem(DENSITY_STORAGE_KEY, den)
  }

  const initTheme = () => {
    // 1. 初始化主题（明暗）
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null
    if (savedTheme === 'dark' || savedTheme === 'light') {
      currentTheme.value = savedTheme
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      currentTheme.value = prefersDark ? 'dark' : 'light'
    }
    document.documentElement.dataset.theme = currentTheme.value

    // 2. 初始化种子色
    const savedSeed = localStorage.getItem(SEED_STORAGE_KEY)
    if (savedSeed) {
      seedColor.value = savedSeed
    }

    // 3. 初始化场景预设与密度
    const savedContext = localStorage.getItem(CONTEXT_STORAGE_KEY) as LayoutContext | null
    if (savedContext === 'admin' || savedContext === 'portal') {
      layoutContext.value = savedContext
    }
    document.documentElement.dataset.context = layoutContext.value

    const savedDensity = localStorage.getItem(DENSITY_STORAGE_KEY) as DensityMode | null
    if (savedDensity === 'comfortable' || savedDensity === 'compact') {
      density.value = savedDensity
    }
    document.documentElement.dataset.density = density.value

    // 4. 执行动态色板注入
    applyM3Theme(seedColor.value, currentTheme.value === 'dark')
  }

  return {
    currentTheme,
    isDark,
    seedColor,
    layoutContext,
    density,
    seedPresets: SEED_PRESETS,
    toggleTheme,
    setTheme,
    setSeedColor,
    setLayoutContext,
    setDensity,
    applyM3Theme,
    initTheme
  }
})
