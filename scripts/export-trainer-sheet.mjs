// Export the bundled backup to an Excel-compatible CSV. Live edits happen in Google Sheets.
import {writeFile,readFile} from 'node:fs/promises';
import {trainerTeamDefaults,trainerSheetHeader} from '../trainer-teams-data.js';
import {trainersFromCSV,trainerRowsToCSV} from '../trainer-feed.js';
const quote=v=>'"'+String(v).replaceAll('"','""')+'"';
const rows=process.argv[2]?trainersFromCSV(await readFile(process.argv[2],'utf8')):trainerTeamDefaults;
const output=process.argv[3]||'/tmp/gymbound-trainers.csv';await writeFile(output,'\uFEFF'+trainerRowsToCSV(rows));console.log(`Exported ${rows.length} trainer bands to ${output}`);
