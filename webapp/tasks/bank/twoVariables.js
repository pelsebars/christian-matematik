import {tasks as one} from '../../two-module1.js';
import {tasks as two} from '../../two-module2.js';
import {tasks as three} from '../../two-module3.js';
import {tasks as four} from '../../two-module4.js';
export const twoTasks=[...one,...two,...three,...four];
