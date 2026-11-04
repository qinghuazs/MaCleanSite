import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

// 中英双语：优先读网址里的 ?lang=，其次是上次手动选择，最后看浏览器语言
export type Lang = 'zh' | 'en'
/** 一段双语文案 */
export type L<T = string> = { zh: T; en: T }

const STORAGE_KEY = 'maclean.lang'

function detectLang(): Lang {
  try {
    const q = new URLSearchParams(window.location.search).get('lang')
    if (q === 'zh' || q === 'en') return q
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'zh' || saved === 'en') return saved
  } catch {
    // 隐私模式下 localStorage 可能不可用，忽略
  }
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language]
  return langs.some((l) => l?.toLowerCase().startsWith('zh')) ? 'zh' : 'en'
}

type LangContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  /** 取当前语言的文案 */
  t: <T>(text: L<T>) => T
}

const LangContext = createContext<LangContextValue | null>(null)

export function LangProvider({ title, children }: { title: L; children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang)

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // 忽略
    }
    // 网址里带了 ?lang= 时同步改掉，刷新和分享链接都保持当前语言
    const url = new URL(window.location.href)
    if (url.searchParams.has('lang')) {
      url.searchParams.set('lang', next)
      window.history.replaceState(null, '', url)
    }
  }, [])

  // 同步 <html lang> 与页面标题
  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
    document.title = title[lang]
  }, [lang, title])

  const value = useMemo<LangContextValue>(() => ({ lang, setLang, t: (text) => text[lang] }), [lang, setLang])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang 必须在 LangProvider 里使用')
  return ctx
}
