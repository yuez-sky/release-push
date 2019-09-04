import TYPE from '../constants'

import { parse as ghParse } from './github'

export default {
  [TYPE.Github]: ghParse,
}