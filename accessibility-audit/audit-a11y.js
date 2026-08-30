const { JSDOM } = require('jsdom');
const axeCore = require('axe-core');
const fs = require('fs');

const routes = ['/', '/profile', '/upload', '/results'];
const BASE = 'http://localhost:3000';

async function auditRoute(route) {
  const res = await fetch(BASE + route);
  const html = await res.text();

  const dom = new JSDOM(html, {
    url: BASE + route,
    runScripts: 'outside-only', // don't execute app JS (no headless browser here) - audits the real server-rendered HTML, which for these statically-generated routes is the actual production content
    pretendToBeVisual: true,
  });

  // Inject axe-core into the jsdom window and run it
  dom.window.eval(axeCore.source);
  const results = await dom.window.axe.run(dom.window.document, {
    // Rules that specifically require live layout/rendering (e.g. color-contrast
    // needs actual computed styles from a real rendering engine) are skipped -
    // jsdom doesn't paint pixels. Everything else (semantic structure, ARIA,
    // labels, landmarks, alt text, heading order) runs for real.
    rules: { 'color-contrast': { enabled: false } },
  });

  return {
    route,
    violations: results.violations,
    passes: results.passes.length,
  };
}

async function main() {
  const allResults = [];
  for (const route of routes) {
    const r = await auditRoute(route);
    allResults.push(r);
    console.log(`\n=== ${route} ===`);
    console.log(`Passed checks: ${r.passes}`);
    console.log(`Violations: ${r.violations.length}`);
    for (const v of r.violations) {
      console.log(`  [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node(s))`);
    }
  }

  const totalViolations = allResults.reduce((sum, r) => sum + r.violations.length, 0);
  const totalPasses = allResults.reduce((sum, r) => sum + r.passes, 0);
  console.log(`\n=== SUMMARY ===`);
  console.log(`Routes audited: ${routes.length}`);
  console.log(`Total passed checks: ${totalPasses}`);
  console.log(`Total violations: ${totalViolations}`);

  fs.writeFileSync('/tmp/axe-results.json', JSON.stringify(allResults, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
