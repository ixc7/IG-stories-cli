import readline from 'readline'
import https from 'https'
import fs from 'fs'
import { stdout } from 'process'
import { spawn } from 'child_process'
import inquirer from 'inquirer'

import { whichDir, upsertDir /* , rmDir */ } from '../actions/directories.js'
import { getSetKey } from '../actions/keys.js'
import keyboard from '../actions/keyboard.js'
import display from '../actions/display.js'
import utils from '../actions/utils.js'

const { rows, columns } = stdout
