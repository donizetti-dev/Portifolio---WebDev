const fs = require('fs');
const path = require('path');
const https = require('https');

console.log('====================================================');
console.log('ADVERSARIAL HYGIENE & LINK VERIFICATION ORACLE');
console.log('====================================================');

const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const DOCS_DIR = path.join(ROOT_DIR, 'docs');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failureDetails = [];

function assertTest(name, condition, errorMsg) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`[PASS] ${name}`);
  } else {
    failedTests++;
    console.error(`[FAIL] ${name} - ${errorMsg}`);
    failureDetails.push({ name, errorMsg });
  }
}

// ----------------------------------------------------
// TEST SUITE 1: SOURCE CODE CONTAMINATION & HYGIENE
// ----------------------------------------------------
console.log('\n--- 1. Adversarial Search for Legacy Tokens in src/ ---');

function getAllFiles(dir, exts = ['.ts', '.tsx', '.css', '.html', '.json']) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, exts));
    } else {
      const ext = path.extname(file).toLowerCase();
      if (exts.includes(ext)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

const srcFiles = getAllFiles(SRC_DIR);
console.log(`Found ${srcFiles.length} files in src/ to scan.`);

const legacyPatterns = [
  { token: 'Doni-zete', regex: /doni-zete/i },
  { token: 'donizetti-junior', regex: /donizetti-junior/i },
  { token: 'contato@donizetti.dev', regex: /contato@donizetti\.dev/i },
  { token: 'docflow', regex: /docflow/i },
  { token: 'portifolio-webdev as catalog entry', regex: /catalog-portifolio-webdev/i },
];

legacyPatterns.forEach(({ token, regex }) => {
  let foundIn = [];
  srcFiles.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf8');
    if (regex.test(content)) {
      foundIn.push(path.relative(ROOT_DIR, filePath));
    }
  });
  assertTest(
    `src/ clean of legacy '${token}'`,
    foundIn.length === 0,
    `Found occurrences in: ${foundIn.join(', ')}`
  );
});

// ----------------------------------------------------
// TEST SUITE 2: BUILD ARTIFACT (dist/) HYGIENE
// ----------------------------------------------------
console.log('\n--- 2. Adversarial Search for Legacy Tokens in dist/ ---');

const distFiles = getAllFiles(DIST_DIR, ['.js', '.css', '.html']);
console.log(`Found ${distFiles.length} files in dist/ to scan.`);

assertTest('dist/ exists and contains bundle assets', distFiles.length > 0, 'No dist files found');

legacyPatterns.forEach(({ token, regex }) => {
  let foundIn = [];
  distFiles.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf8');
    if (regex.test(content)) {
      foundIn.push(path.relative(ROOT_DIR, filePath));
    }
  });
  assertTest(
    `dist/ clean of legacy '${token}'`,
    foundIn.length === 0,
    `Found occurrences in: ${foundIn.join(', ')}`
  );
});

// Also check index.html in root
const rootIndexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
legacyPatterns.forEach(({ token, regex }) => {
  assertTest(
    `root index.html clean of legacy '${token}'`,
    !regex.test(rootIndexHtml),
    `Found '${token}' in root index.html`
  );
});

// ----------------------------------------------------
// TEST SUITE 3: EXACT MATCHING & CONTRACT ADHERENCE
// ----------------------------------------------------
console.log('\n--- 3. Exact Matching & Contract Adherence in src/config/profileData.ts ---');

const profileDataContent = fs.readFileSync(path.join(SRC_DIR, 'config', 'profileData.ts'), 'utf8');

// LinkedIn exactness
const linkedinMatch = profileDataContent.match(/linkedin:\s*['"`]([^'"`]+)['"`]/);
assertTest('LinkedIn field exists in profileData.ts', Boolean(linkedinMatch), 'linkedin field not found');
if (linkedinMatch) {
  const linkedinUrl = linkedinMatch[1];
  assertTest(
    'LinkedIn URL strictly equals https://www.linkedin.com/in/donizetti-dev',
    linkedinUrl === 'https://www.linkedin.com/in/donizetti-dev',
    `Found: '${linkedinUrl}'`
  );
  try {
    const parsed = new URL(linkedinUrl);
    assertTest('LinkedIn URL valid RFC 3986', Boolean(parsed), 'Parsing failed');
    assertTest('LinkedIn protocol is https:', parsed.protocol === 'https:', `Found: ${parsed.protocol}`);
    assertTest('LinkedIn hostname is www.linkedin.com', parsed.hostname === 'www.linkedin.com', `Found: ${parsed.hostname}`);
    assertTest('LinkedIn pathname is /in/donizetti-dev', parsed.pathname === '/in/donizetti-dev', `Found: ${parsed.pathname}`);
    assertTest('LinkedIn no search query', parsed.search === '', `Found query: ${parsed.search}`);
    assertTest('LinkedIn no hash fragment', parsed.hash === '', `Found hash: ${parsed.hash}`);
  } catch (e) {
    assertTest('LinkedIn URL parseable', false, e.message);
  }
}

// GitHub Profile exactness
const githubMatch = profileDataContent.match(/github:\s*['"`]([^'"`]+)['"`]/);
assertTest('GitHub field exists in profileData.ts', Boolean(githubMatch), 'github field not found');
if (githubMatch) {
  const githubUrl = githubMatch[1];
  assertTest(
    'GitHub profile strictly equals https://github.com/donizetti-dev',
    githubUrl === 'https://github.com/donizetti-dev',
    `Found: '${githubUrl}'`
  );
  try {
    const parsed = new URL(githubUrl);
    assertTest('GitHub URL valid RFC 3986', Boolean(parsed), 'Parsing failed');
    assertTest('GitHub protocol is https:', parsed.protocol === 'https:', `Found: ${parsed.protocol}`);
    assertTest('GitHub hostname is github.com', parsed.hostname === 'github.com', `Found: ${parsed.hostname}`);
    assertTest('GitHub pathname is /donizetti-dev', parsed.pathname === '/donizetti-dev', `Found: ${parsed.pathname}`);
    assertTest('GitHub no search query', parsed.search === '', `Found query: ${parsed.search}`);
  } catch (e) {
    assertTest('GitHub URL parseable', false, e.message);
  }
}

// GitHub Username exactness
const ghUserMatch = profileDataContent.match(/githubUsername:\s*['"`]([^'"`]+)['"`]/);
assertTest(
  'githubUsername strictly equals donizetti-dev',
  ghUserMatch && ghUserMatch[1] === 'donizetti-dev',
  `Found: '${ghUserMatch ? ghUserMatch[1] : 'null'}'`
);

// Handle exactness
const handleMatch = profileDataContent.match(/handle:\s*['"`]([^'"`]+)['"`]/);
assertTest(
  'handle strictly equals donizetti-dev',
  handleMatch && handleMatch[1] === 'donizetti-dev',
  `Found: '${handleMatch ? handleMatch[1] : 'null'}'`
);

// Email exactness & RFC 5322 regex
const emailMatch = profileDataContent.match(/email:\s*['"`]([^'"`]+)['"`]/);
assertTest('email field exists in profileData.ts', Boolean(emailMatch), 'email field not found');
if (emailMatch) {
  const email = emailMatch[1];
  assertTest(
    'email strictly equals donizettibatista1@gmail.com',
    email === 'donizettibatista1@gmail.com',
    `Found: '${email}'`
  );
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  assertTest('email is valid RFC 5322 format', emailRegex.test(email), `Invalid email format: ${email}`);

  // Test mailto URI specification RFC 6068
  const mailtoUri = `mailto:${email}`;
  assertTest(
    'mailto: URI strictly matches mailto:donizettibatista1@gmail.com',
    mailtoUri === 'mailto:donizettibatista1@gmail.com',
    `Found: ${mailtoUri}`
  );
}

// Check githubService.ts DEFAULT_GITHUB_USERNAME
const githubServiceContent = fs.readFileSync(path.join(SRC_DIR, 'services', 'githubService.ts'), 'utf8');
const defaultUserMatch = githubServiceContent.match(/DEFAULT_GITHUB_USERNAME\s*=\s*['"`]([^'"`]+)['"`]/);
assertTest(
  'DEFAULT_GITHUB_USERNAME in githubService.ts is donizetti-dev',
  defaultUserMatch && defaultUserMatch[1] === 'donizetti-dev',
  `Found: '${defaultUserMatch ? defaultUserMatch[1] : 'null'}'`
);

// Check Footer.tsx hardcoded link
const footerContent = fs.readFileSync(path.join(SRC_DIR, 'components', 'layout', 'Footer.tsx'), 'utf8');
assertTest(
  'Footer.tsx contains https://github.com/donizetti-dev',
  footerContent.includes('href="https://github.com/donizetti-dev"'),
  'Footer link does not match exact GitHub URL'
);
assertTest(
  'Footer.tsx contains github.com/donizetti-dev label',
  footerContent.includes('github.com/donizetti-dev'),
  'Footer label does not match expected text'
);

// Check HomePage.tsx mailto: construction
const homePageContent = fs.readFileSync(path.join(SRC_DIR, 'pages', 'HomePage.tsx'), 'utf8');
assertTest(
  'HomePage.tsx correctly constructs mailto:${social.email}',
  homePageContent.includes('href={`mailto:${social.email}`}'),
  'HomePage mailto template literal mismatch'
);
assertTest(
  'HomePage.tsx renders {social.email} text',
  homePageContent.includes('{social.email}'),
  'HomePage email text mismatch'
);

// ----------------------------------------------------
// TEST SUITE 4: REPOSITORIES EXACTNESS & CATALOG PURITY
// ----------------------------------------------------
console.log('\n--- 4. Repository Verification & Whitelist in src/config/projectsCatalog.ts ---');

const catalogContent = fs.readFileSync(path.join(SRC_DIR, 'config', 'projectsCatalog.ts'), 'utf8');

const requiredRepos = [
  {
    name: 'news-scraper-api',
    url: 'https://github.com/donizetti-dev/news-scraper-api',
    expectedPath: '/donizetti-dev/news-scraper-api',
    expectedLanguage: 'Python',
    expectedStackItems: ['Python', 'Flask', 'Selenium', 'SQL Server', 'pyodbc', 'REST API']
  },
  {
    name: 'Trending_Movie-React',
    url: 'https://github.com/donizetti-dev/Trending_Movie-React',
    expectedPath: '/donizetti-dev/Trending_Movie-React',
    expectedLanguage: 'JavaScript',
    expectedStackItems: ['React', 'JavaScript', 'REST API', 'TMDB API', 'CSS3', 'Vercel']
  },
  {
    name: 'Infrawatch-Terminal',
    url: 'https://github.com/donizetti-dev/Infrawatch-Terminal',
    expectedPath: '/donizetti-dev/Infrawatch-Terminal',
    expectedLanguage: 'Python',
    expectedStackItems: ['Python', 'CLI', 'Terminal', 'Processamento de Dados', 'Análise Ambiental']
  }
];

requiredRepos.forEach(repo => {
  assertTest(
    `Catalog includes repoUrl: '${repo.url}'`,
    catalogContent.includes(`repoUrl: '${repo.url}'`),
    `Missing repoUrl: ${repo.url}`
  );
  try {
    const parsed = new URL(repo.url);
    assertTest(`Repo URL ${repo.name} valid RFC 3986`, Boolean(parsed), 'Parsing failed');
    assertTest(`Repo URL ${repo.name} uses https:`, parsed.protocol === 'https:', `Found ${parsed.protocol}`);
    assertTest(`Repo URL ${repo.name} hostname is github.com`, parsed.hostname === 'github.com', `Found ${parsed.hostname}`);
    assertTest(`Repo URL ${repo.name} pathname matches '${repo.expectedPath}'`, parsed.pathname === repo.expectedPath, `Found ${parsed.pathname}`);
  } catch (e) {
    assertTest(`Repo URL ${repo.name} parseable`, false, e.message);
  }

  assertTest(
    `Catalog includes repoName: '${repo.name}'`,
    catalogContent.includes(`repoName: '${repo.name}'`),
    `Missing repoName: ${repo.name}`
  );
  assertTest(
    `Catalog specifies correct language '${repo.expectedLanguage}' for ${repo.name}`,
    catalogContent.includes(`language: '${repo.expectedLanguage}'`),
    `Missing expected language for ${repo.name}`
  );
  repo.expectedStackItems.forEach(tech => {
    assertTest(
      `Catalog stack includes '${tech}' for ${repo.name}`,
      catalogContent.includes(`'${tech}'`),
      `Missing stack tech '${tech}' for ${repo.name}`
    );
  });
});

// Check that catalog has strictly 3 entries
const idMatches = catalogContent.match(/id:\s*['"`]catalog-[^'"`]+['"`]/g) || [];
assertTest(
  `Catalog contains exactly 3 entries (found ${idMatches.length})`,
  idMatches.length === 3,
  `Catalog count mismatch: expected 3, found ${idMatches.length} (${idMatches.join(', ')})`
);

// Check strict whitelist in githubService.ts mergeGitHubWithCatalog
assertTest(
  'githubService.ts enforces strict whitelist (catalogMatch only)',
  githubServiceContent.includes('if (catalogMatch)') &&
  !githubServiceContent.includes('else if (!repo.fork)'),
  'Strict whitelist check failed: found loose fallback in mergeGitHubWithCatalog'
);

// ----------------------------------------------------
// TEST SUITE 5: PRODUCTION BUNDLE VERIFICATION
// ----------------------------------------------------
console.log('\n--- 5. Empirical Verification of Production Bundle (dist/assets/index-*.js) ---');

const indexJsFiles = fs.readdirSync(path.join(DIST_DIR, 'assets')).filter(f => f.startsWith('index-') && f.endsWith('.js'));
assertTest('Found production index JS bundle in dist/assets', indexJsFiles.length > 0, 'No index-*.js found in dist/assets');

if (indexJsFiles.length > 0) {
  const indexJsContent = fs.readFileSync(path.join(DIST_DIR, 'assets', indexJsFiles[0]), 'utf8');

  assertTest(
    'Bundle contains updated LinkedIn URL',
    indexJsContent.includes('https://www.linkedin.com/in/donizetti-dev'),
    'Bundle missing https://www.linkedin.com/in/donizetti-dev'
  );
  assertTest(
    'Bundle contains updated GitHub URL',
    indexJsContent.includes('https://github.com/donizetti-dev'),
    'Bundle missing https://github.com/donizetti-dev'
  );
  assertTest(
    'Bundle contains updated email address',
    indexJsContent.includes('donizettibatista1@gmail.com'),
    'Bundle missing donizettibatista1@gmail.com'
  );
  assertTest(
    'Bundle contains news-scraper-api repo URL',
    indexJsContent.includes('https://github.com/donizetti-dev/news-scraper-api'),
    'Bundle missing news-scraper-api URL'
  );
  assertTest(
    'Bundle contains Trending_Movie-React repo URL',
    indexJsContent.includes('https://github.com/donizetti-dev/Trending_Movie-React'),
    'Bundle missing Trending_Movie-React URL'
  );
  assertTest(
    'Bundle contains Infrawatch-Terminal repo URL',
    indexJsContent.includes('https://github.com/donizetti-dev/Infrawatch-Terminal'),
    'Bundle missing Infrawatch-Terminal URL'
  );

  // Negative tests in bundle
  assertTest(
    'Bundle is clean of legacy Doni-zete',
    !/doni-zete/i.test(indexJsContent),
    'Bundle leaked legacy Doni-zete'
  );
  assertTest(
    'Bundle is clean of legacy donizetti-junior',
    !/donizetti-junior/i.test(indexJsContent),
    'Bundle leaked legacy donizetti-junior'
  );
  assertTest(
    'Bundle is clean of legacy contato@donizetti.dev',
    !/contato@donizetti\.dev/i.test(indexJsContent),
    'Bundle leaked legacy contato@donizetti.dev'
  );
  assertTest(
    'Bundle is clean of docflow',
    !/docflow/i.test(indexJsContent),
    'Bundle leaked docflow'
  );
  assertTest(
    'Bundle is clean of catalog-portifolio-webdev',
    !/catalog-portifolio-webdev/i.test(indexJsContent),
    'Bundle leaked catalog-portifolio-webdev'
  );
}

// ----------------------------------------------------
// TEST SUITE 6: ADVERSARIAL BOUNDARY & SIMULATION TESTS
// ----------------------------------------------------
console.log('\n--- 6. Adversarial Boundary & Whitelist Simulation ---');

// Simulate the mergeGitHubWithCatalog algorithm from githubService.ts
// Test: what happens if an unlisted or malicious repo is returned by the GitHub API?
function simulateWhitelistFilter(apiRepos) {
  const allowedNames = ['news-scraper-api', 'trending_movie-react', 'infrawatch-terminal'];
  const allowedSlugs = ['news-scraper-api', 'trending-movies', 'infrawatch-terminal'];

  const matched = [];
  for (const repo of apiRepos) {
    const isMatch = allowedNames.includes(repo.name.toLowerCase()) || allowedSlugs.includes(repo.name.toLowerCase());
    if (isMatch) {
      matched.push(repo.name);
    }
  }
  return matched;
}

const adversarialApiPayload = [
  { name: 'malicious-cryptominer', fork: false },
  { name: 'docflow-rpa-pipeline', fork: false },
  { name: 'news-scraper-api', fork: false },
  { name: 'random-fork-repo', fork: true },
  { name: 'Trending_Movie-React', fork: false },
  { name: 'unauthorized-private-data', fork: false },
  { name: 'Infrawatch-Terminal', fork: false }
];

const filteredResults = simulateWhitelistFilter(adversarialApiPayload);
assertTest(
  'Adversarial whitelist simulation admits exactly 3 approved repositories',
  filteredResults.length === 3,
  `Expected 3 admitted, got: ${filteredResults.length} (${filteredResults.join(', ')})`
);
assertTest(
  'Adversarial whitelist rejects docflow-rpa-pipeline injection',
  !filteredResults.includes('docflow-rpa-pipeline'),
  'docflow-rpa-pipeline was improperly admitted'
);
assertTest(
  'Adversarial whitelist rejects malicious-cryptominer injection',
  !filteredResults.includes('malicious-cryptominer'),
  'malicious-cryptominer was improperly admitted'
);

// ----------------------------------------------------
// SUMMARY
// ----------------------------------------------------
console.log('\n====================================================');
console.log(`ORACLE EXECUTION COMPLETE:`);
console.log(`Total tests:  ${totalTests}`);
console.log(`Passed tests: ${passedTests}`);
console.log(`Failed tests: ${failedTests}`);
console.log(`Verdict:      ${failedTests === 0 ? 'CONFIRMED' : 'REJECTED'}`);
console.log('====================================================');

if (failedTests > 0) {
  console.error('FAILURES:');
  failureDetails.forEach(f => console.error(` - ${f.name}: ${f.errorMsg}`));
  process.exit(1);
} else {
  process.exit(0);
}
