/**
 * Self-hosted faces, imported so Vite fingerprints and emits each woff2.
 * Antonio — display. Manrope — subheads and UI. Source Serif 4 — body copy.
 */
import antonioExt from './assets/fonts/antonio-latin-ext-normal-1.woff2?url'
import antonio from './assets/fonts/antonio-latin-normal-2.woff2?url'
import manropeExt from './assets/fonts/manrope-latin-ext-normal-1.woff2?url'
import manrope from './assets/fonts/manrope-latin-normal-2.woff2?url'
import serifExtItalic from './assets/fonts/sourceserif4-latin-ext-italic-1.woff2?url'
import serifItalic from './assets/fonts/sourceserif4-latin-italic-2.woff2?url'
import serifExt from './assets/fonts/sourceserif4-latin-ext-normal-3.woff2?url'
import serif from './assets/fonts/sourceserif4-latin-normal-4.woff2?url'

const LATIN =
  'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD'
const LATIN_EXT =
  'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF'

const faces: {
  family: string
  style: 'normal' | 'italic'
  weight: string
  src: string
  range: string
}[] = [
  { family: 'Antonio', style: 'normal', weight: '100 700', src: antonioExt, range: LATIN_EXT },
  { family: 'Antonio', style: 'normal', weight: '100 700', src: antonio, range: LATIN },
  { family: 'Manrope', style: 'normal', weight: '200 800', src: manropeExt, range: LATIN_EXT },
  { family: 'Manrope', style: 'normal', weight: '200 800', src: manrope, range: LATIN },
  { family: 'Source Serif 4', style: 'italic', weight: '200 900', src: serifExtItalic, range: LATIN_EXT },
  { family: 'Source Serif 4', style: 'italic', weight: '200 900', src: serifItalic, range: LATIN },
  { family: 'Source Serif 4', style: 'normal', weight: '200 900', src: serifExt, range: LATIN_EXT },
  { family: 'Source Serif 4', style: 'normal', weight: '200 900', src: serif, range: LATIN },
]

const css = faces
  .map(
    (f) => `@font-face{font-family:'${f.family}';font-style:${f.style};font-weight:${f.weight};font-display:swap;src:url('${f.src}') format('woff2');unicode-range:${f.range};}`,
  )
  .join('\n')

const style = document.createElement('style')
style.dataset.ethiohFonts = ''
style.textContent = css
document.head.appendChild(style)
