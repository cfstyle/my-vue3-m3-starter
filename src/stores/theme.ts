import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  argbFromHex,
  hexFromArgb,
  CorePalette,
  Hct,
  TonalPalette
} from '@material/material-color-utilities'

export type ThemeMode = 'light' | 'dark'
export type LayoutContext = 'admin' | 'portal'
export type DensityMode = 'comfortable' | 'compact'

export interface ThemePreset {
  id: string
  key: string
  name: string
  hex: string
  category: string
  description: string
  lowChroma?: boolean
  monochrome?: boolean
}

export type SeedPreset = ThemePreset

/**
 * M3 HCT 动态种子色调色板全局单一数据源 (Single Source of Truth)
 * 包含通用体系 4 套 + 银行金融专属 2 套 (机构藏青、鎏金琥珀)
 */
export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'aurora-purple',
    key: 'aurora-purple',
    name: '极光紫',
    hex: '#6750A4',
    category: '通用系统',
    description: 'Material 3 官方基准色，适合通用平台与产品原型'
  },
  {
    id: 'deep-ocean',
    key: 'deep-ocean',
    name: '深海青',
    hex: '#006A6A',
    category: '科技协作',
    description: '深邃内敛青绿调，适合开发者门户与协同中台'
  },
  {
    id: 'cobalt-blue',
    key: 'cobalt-blue',
    name: '商务钴蓝',
    hex: '#0061A4',
    category: '企业服务',
    description: '稳重冷蓝调，适合运营管控与企业数字化系统'
  },
  {
    id: 'forest-green',
    key: 'forest-green',
    name: '森林绿',
    hex: '#386A20',
    category: '能源健康',
    description: '生机翠绿调，适合 ESG、农业金融与医疗健康'
  },
  {
    id: 'institutional-navy',
    key: 'institutional-navy',
    name: '机构藏青',
    hex: '#1E3A5F',
    category: '银行与风控',
    description: '商业银行、风控大屏与机构投研系统专属沉稳低彩度钢蓝',
    lowChroma: true
  },
  {
    id: 'wealth-amber',
    key: 'wealth-amber',
    name: '鎏金琥珀',
    hex: '#7A5900',
    category: '财富管理',
    description: '私人银行、财富管理与资产配置门户高净值暖金'
  },
  {
    id: 'studio-monochrome',
    key: 'studio-monochrome',
    name: 'Studio 极简',
    hex: '#1F1F1F',
    category: '极简工程',
    description: 'AI Studio 控制台纯白极简风',
    monochrome: true
  }
]

export const SEED_PRESETS = THEME_PRESETS

const THEME_STORAGE_KEY = 'm3-theme'
const SEED_STORAGE_KEY = 'm3-seed-color'
const CONTEXT_STORAGE_KEY = 'm3-layout-context'
const DENSITY_STORAGE_KEY = 'm3-density'

// 防御性 Storage 访问封装（隔离无痕模式或禁用 Cookie 抛错）
const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      return typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem(key) : null
    } catch {
      return null
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value)
      }
    } catch {
      // 容错静默
    }
  }
}

const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/

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
      // 防御校验输入是否为有效 6 位 Hex 格式
      const normalizedHex = HEX_COLOR_REGEX.test(seedHex) ? seedHex : '#6750A4'
      const argb = argbFromHex(normalizedHex)
      const corePalette = CorePalette.of(argb)

      const root = typeof document !== 'undefined' ? document.documentElement : null
      if (!root) return

      let p = corePalette.a1
      let s = corePalette.a2
      const t = corePalette.a3
      let n = corePalette.n1
      let nv = corePalette.n2
      const err = corePalette.error

      // 匹配当前主题预设，若标记 lowChroma 则手动构建低彩度调色板（覆盖 SchemeTonalSpot 强制的高彩度映射）
      const activePreset = THEME_PRESETS.find(
        (preset) => preset.hex.toLowerCase() === normalizedHex.toLowerCase()
      )

      if (activePreset?.monochrome) {
        // 使用 TonalPalette.fromHueAndChroma(0, 0) 生成纯粹的零彩度中性灰阶
        const mono = TonalPalette.fromHueAndChroma(0, 0)
        const monoTokens: Record<string, string> = dark
          ? {
              // 深色模式 (Dark Mode)
              '--md-sys-color-primary': '#E3E3E3',
              '--md-sys-color-on-primary': '#1F1F1F',
              '--md-sys-color-primary-container': '#2D2F31',
              '--md-sys-color-on-primary-container': '#E3E3E3',
              '--md-sys-color-inverse-primary': '#1F1F1F',

              '--md-sys-color-secondary': '#C4C7C5',
              '--md-sys-color-on-secondary': '#1E1F20',
              '--md-sys-color-secondary-container': '#2D2F31',
              '--md-sys-color-on-secondary-container': '#E3E3E3',

              '--md-sys-color-tertiary': '#C4C7C5',
              '--md-sys-color-on-tertiary': '#1E1F20',
              '--md-sys-color-tertiary-container': '#2D2F31',
              '--md-sys-color-on-tertiary-container': '#E3E3E3',

              '--md-sys-color-error': hexFromArgb(err.tone(80)),
              '--md-sys-color-on-error': hexFromArgb(err.tone(20)),
              '--md-sys-color-error-container': hexFromArgb(err.tone(30)),
              '--md-sys-color-on-error-container': hexFromArgb(err.tone(90)),

              '--md-sys-color-surface': '#131314',
              '--md-sys-color-surface-dim': '#131314',
              '--md-sys-color-surface-bright': '#37393B',
              '--md-sys-color-surface-container-lowest': '#0E0E0E',
              '--md-sys-color-surface-container-low': '#1E1F20',
              '--md-sys-color-surface-container': '#282A2C',
              '--md-sys-color-surface-container-high': '#2B2D30',
              '--md-sys-color-surface-container-highest': '#333538',

              '--md-sys-color-on-surface': '#E3E3E3',
              '--md-sys-color-on-surface-variant': '#C4C7C5',
              '--md-sys-color-outline': '#8E918F',
              '--md-sys-color-outline-variant': '#444746',
              '--md-sys-color-inverse-surface': hexFromArgb(mono.tone(90)),
              '--md-sys-color-inverse-on-surface': hexFromArgb(mono.tone(20))
            }
          : {
              // 浅色模式 (Light Mode)
              '--md-sys-color-primary': '#1F1F1F',
              '--md-sys-color-on-primary': '#FFFFFF',
              '--md-sys-color-primary-container': '#ECEEF0',
              '--md-sys-color-on-primary-container': '#1F1F1F',
              '--md-sys-color-inverse-primary': '#E3E3E3',

              '--md-sys-color-secondary': '#444746',
              '--md-sys-color-on-secondary': '#FFFFFF',
              '--md-sys-color-secondary-container': '#ECEEF0',
              '--md-sys-color-on-secondary-container': '#1F1F1F',

              '--md-sys-color-tertiary': '#444746',
              '--md-sys-color-on-tertiary': '#FFFFFF',
              '--md-sys-color-tertiary-container': '#ECEEF0',
              '--md-sys-color-on-tertiary-container': '#1F1F1F',

              '--md-sys-color-error': hexFromArgb(err.tone(40)),
              '--md-sys-color-on-error': hexFromArgb(err.tone(100)),
              '--md-sys-color-error-container': hexFromArgb(err.tone(90)),
              '--md-sys-color-on-error-container': hexFromArgb(err.tone(10)),

              '--md-sys-color-surface': '#FFFFFF',
              '--md-sys-color-surface-dim': '#F1F3F4',
              '--md-sys-color-surface-bright': '#FFFFFF',
              '--md-sys-color-surface-container-lowest': '#FFFFFF',
              '--md-sys-color-surface-container-low': '#F8F9FA',
              '--md-sys-color-surface-container': '#F0F4F9',
              '--md-sys-color-surface-container-high': '#E9EEF6',
              '--md-sys-color-surface-container-highest': '#E1E3E1',

              '--md-sys-color-on-surface': '#1F1F1F',
              '--md-sys-color-on-surface-variant': '#444746',
              '--md-sys-color-outline': '#747775',
              '--md-sys-color-outline-variant': '#E0E3E7',
              '--md-sys-color-inverse-surface': hexFromArgb(mono.tone(20)),
              '--md-sys-color-inverse-on-surface': hexFromArgb(mono.tone(95))
            }

        for (const [varName, varVal] of Object.entries(monoTokens)) {
          root.style.setProperty(varName, varVal)
        }
        return
      }

      if (activePreset?.lowChroma) {
        const hct = Hct.fromInt(argb)
        // 主色板 primaryPalette: 使用 TonalPalette.fromHueAndChroma(hct.hue, 18)（克制的深藏青，而非艳蓝色）
        p = TonalPalette.fromHueAndChroma(hct.hue, 18)
        // 辅助色板 secondaryPalette: 使用 TonalPalette.fromHueAndChroma(hct.hue, 10)（冷灰石板蓝容器）
        s = TonalPalette.fromHueAndChroma(hct.hue, 10)
        // 中性色板 neutralPalette: 使用 TonalPalette.fromHueAndChroma(hct.hue, 4)
        n = TonalPalette.fromHueAndChroma(hct.hue, 4)
        // 中性变体 nv: 保持冷灰质感 (chroma 8)
        nv = TonalPalette.fromHueAndChroma(hct.hue, 8)
      }

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
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = theme
    }
    safeStorage.setItem(THEME_STORAGE_KEY, theme)
    applyM3Theme(seedColor.value, theme === 'dark')
  }

  const toggleTheme = () => {
    setTheme(currentTheme.value === 'dark' ? 'light' : 'dark')
  }

  const setSeedColor = (hex: string) => {
    let validHex = HEX_COLOR_REGEX.test(hex) ? hex : '#6750A4'
    // 兼容历史机构藏青旧值 #1B4978 迁移至微调后的冷峻钢蓝 #1E3A5F
    if (validHex.toLowerCase() === '#1b4978') {
      validHex = '#1E3A5F'
    }
    seedColor.value = validHex
    safeStorage.setItem(SEED_STORAGE_KEY, validHex)
    applyM3Theme(validHex, isDark.value)
  }

  const setLayoutContext = (ctx: LayoutContext) => {
    layoutContext.value = ctx
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.context = ctx
    }
    safeStorage.setItem(CONTEXT_STORAGE_KEY, ctx)
  }

  const setDensity = (den: DensityMode) => {
    density.value = den
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.density = den
    }
    safeStorage.setItem(DENSITY_STORAGE_KEY, den)
  }

  const initTheme = () => {
    // 1. 初始化主题（明暗，带防御白名单校验）
    const savedTheme = safeStorage.getItem(THEME_STORAGE_KEY)
    if (savedTheme === 'dark' || savedTheme === 'light') {
      currentTheme.value = savedTheme
    } else {
      const prefersDark = typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
        : false
      currentTheme.value = prefersDark ? 'dark' : 'light'
    }
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = currentTheme.value
    }

    // 2. 初始化种子色（防御校验正则格式）
    const savedSeed = safeStorage.getItem(SEED_STORAGE_KEY)
    if (savedSeed && HEX_COLOR_REGEX.test(savedSeed)) {
      // 兼容历史机构藏青旧值 #1B4978 迁移至微调后的冷峻钢蓝 #1E3A5F
      seedColor.value = savedSeed.toLowerCase() === '#1b4978' ? '#1E3A5F' : savedSeed
    }

    // 3. 初始化场景预设与密度（白名单校验）
    const savedContext = safeStorage.getItem(CONTEXT_STORAGE_KEY)
    if (savedContext === 'admin' || savedContext === 'portal') {
      layoutContext.value = savedContext
    }
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.context = layoutContext.value
    }

    const savedDensity = safeStorage.getItem(DENSITY_STORAGE_KEY)
    if (savedDensity === 'comfortable' || savedDensity === 'compact') {
      density.value = savedDensity
    }
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.density = density.value
    }

    // 4. 执行动态色板注入
    applyM3Theme(seedColor.value, currentTheme.value === 'dark')
  }

  return {
    currentTheme,
    isDark,
    seedColor,
    layoutContext,
    density,
    THEME_PRESETS,
    themePresets: THEME_PRESETS,
    seedPresets: THEME_PRESETS,
    toggleTheme,
    setTheme,
    setSeedColor,
    setLayoutContext,
    setDensity,
    applyM3Theme,
    initTheme
  }
})
