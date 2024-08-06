
import { toSlugCase } from './case.helpers'

import {
  type ApzStyles,
  type ApzAttributes,
} from '../types'

export function applyStylesToEl (el: HTMLElement, styles: ApzStyles) {
  Object.keys(styles).forEach(key => {
    if (key === 'important') {
      for (const key in styles.important) {
        el.style.setProperty(toSlugCase(key), String(styles.important[key]), 'important')
      }
      return
    }

    if (styles[key] === null) el.style.removeProperty(key)
    else el.style.setProperty(toSlugCase(key), String(styles[key]))
  })
}

export function applyAttributesToEl (el: HTMLElement, attributes: ApzAttributes) {
  for (const key in attributes) {
    if (attributes[key] === null) el.removeAttribute(key)
    else el.setAttribute(key, attributes[key])
  }
}