// Validates the three locale message files: JSON parse, key parity and list lengths.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const LOCALES = ['sq', 'zh', 'en'];

function flatten(obj, prefix = '', out = []) {
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (Array.isArray(value)) {
      out.push(`${path}#len=${value.length}`);
      value.forEach((item, index) => {
        if (item && typeof item === 'object') flatten(item, `${path}.${index}`, out);
      });
    } else if (value && typeof value === 'object') {
      flatten(value, path, out);
    } else {
      out.push(path);
    }
  }
  return out;
}

const tables = {};
let failed = false;

for (const locale of LOCALES) {
  try {
    const raw = readFileSync(join(root, 'src', 'messages', `${locale}.json`), 'utf8');
    const json = JSON.parse(raw);
    tables[locale] = flatten(json);
    console.log(`[parse] ${locale}.json OK (${tables[locale].length} entries)`);
  } catch (error) {
    failed = true;
    console.error(`[parse] ${locale}.json FAILED: ${error.message}`);
  }
}

if (!failed) {
  const [base, ...others] = LOCALES;
  const baseSet = new Set(tables[base]);

  for (const locale of others) {
    const set = new Set(tables[locale]);
    const missing = tables[base].filter((key) => !set.has(key));
    const extra = tables[locale].filter((key) => !baseSet.has(key));

    if (missing.length || extra.length) {
      failed = true;
      console.error(`[parity] ${locale} differs from ${base}`);
      if (missing.length) console.error(`  missing (${missing.length}): ${missing.slice(0, 20).join(', ')}`);
      if (extra.length) console.error(`  extra (${extra.length}): ${extra.slice(0, 20).join(', ')}`);
    } else {
      console.log(`[parity] ${locale} matches ${base} (${tables[locale].length} keys)`);
    }
  }

  for (const locale of LOCALES) {
    const json = JSON.parse(readFileSync(join(root, 'src', 'messages', `${locale}.json`), 'utf8'));
    const groups = json.facilities?.groups ?? [];
    const items = groups.reduce((sum, group) => sum + (group.items?.length ?? 0), 0);
    console.log(
      `[stats] ${locale}: knowledge=${json.knowledge.sections.length} toc=${json.toc.items.length} ` +
        `facilities=${items} (${groups.length} groups) history=${json.history.events.length} ` +
        `facts=${json.history.facts.length} legends=${json.legends.items.length} ` +
        `route=${json.route.steps.length} faq=${json.faq.items.length} sources=${json.sources.items.length}`
    );
  }
}

if (failed) {
  console.error('\nMessage check FAILED');
  process.exit(1);
}
console.log('\nMessage check PASSED');
