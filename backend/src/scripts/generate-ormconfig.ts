import * as dotenv from 'dotenv';
dotenv.config();

import fs = require('fs');
import { seedsConfigOptions, typeormConfigOptions } from '../ormconfig';

fs.writeFileSync('ormconfig.json', JSON.stringify(typeormConfigOptions, null, 2));
fs.writeFileSync('seeds-ormconfig.json', JSON.stringify(seedsConfigOptions, null, 2));
