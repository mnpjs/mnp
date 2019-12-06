import promto from 'promto'
import usually from 'usually'
import bosom from 'bosom'
import readDirStructure, { getFiles } from '@wrote/read-dir-structure'
import { read, write, rm, ensurePath, exists } from '@wrote/wrote'
import argufy, { reduceUsage } from 'argufy'
import { c, b } from 'erte'
import mismatch from 'mismatch'
import askQuestions, { askSingle, confirm } from 'reloquent'
import { Replaceable, replace } from 'restream'
import { aqt } from 'rqt'
import spawn, { fork } from 'spawncommand'
import africa from 'africa'
import cleanStack from '@artdeco/clean-stack'
import indicatrix from 'indicatrix'

module.exports = {
  'exists': exists,
  'ensurePath': ensurePath,
  'cleanStack': cleanStack,
  'indicatrix': indicatrix,
  'promto': promto,
  'usually': usually,
  'bosom': bosom,
  'readDirStructure': readDirStructure,
  'getFiles': getFiles,
  'read': read,
  'write': write,
  'rm': rm,
  'argufy': argufy,
  'reduceUsage': reduceUsage,
  'c': c,
  'b': b,
  'mismatch': mismatch,
  'askQuestions': askQuestions,
  'askSingle': askSingle,
  'confirm': confirm,
  'Replaceable': Replaceable,
  'replace': replace,
  'aqt': aqt,
  'spawn': spawn,
  'fork': fork,
  'africa': africa,
}