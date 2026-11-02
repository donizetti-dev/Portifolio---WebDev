import { createServer } from 'vite';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

console.log('===============================================================');
console.log('CHALLENGER 2 R2 — EMPIRICAL ADVERSARIAL TEST SUITE');
console.log('===============================================================');

let passedAssertions = 0;
let failedAssertions = 0;

function assertCondition(desc, condition, details = '') {
  if (condition) {
    passedAssertions++;
    console.log(`  [PASS] ${desc}`);
  } else {
    failedAssertions++;
    console.error(`  [FAIL] ${desc} ${details ? `— ${details}` : ''}`);
  }
}

async function runAdversarialSuite() {
  console.log('\n--- 1. Initializing Vite In-Sandbox SSR Loader ---');
  const server = await createServer({
    root: ROOT_DIR,
    server: { middlewareMode: true },
    appType: 'custom',
  });

  const githubService = await server.ssrLoadModule('/src/services/githubService.ts');
  const projectsCatalog = await server.ssrLoadModule('/src/config/projectsCatalog.ts');
  const profileData = await server.ssrLoadModule('/src/config/profileData.ts');

  assertCondition('githubService loaded successfully', Boolean(githubService));
  assertCondition('projectsCatalog loaded successfully', Boolean(projectsCatalog));
  assertCondition('profileData loaded successfully', Boolean(profileData));

  const {
    mergeGitHubWithCatalog,
    getCatalogAsEnrichedProjects,
    findProjectBySlug,
    DEFAULT_GITHUB_USERNAME,
    getGitHubUsername,
  } = githubService;

  const {
    CUSTOM_PROJECTS_CATALOG,
    DEFAULT_FEATURED_PROJECT_SLUGS,
    findCatalogMatch,
    toProjectSlug,
  } = projectsCatalog;

  const { PROFILE_DATA } = profileData;

  // -------------------------------------------------------------
  // SUITE 1: Profile & Identity Contracts
  // -------------------------------------------------------------
  console.log('\n--- 2. Profile & Identity Contracts ---');
  assertCondition(
    'PROFILE_DATA.social.linkedin is exact official URL',
    PROFILE_DATA.social.linkedin === 'https://www.linkedin.com/in/donizetti-dev',
    PROFILE_DATA.social.linkedin
  );
  assertCondition(
    'PROFILE_DATA.social.github is exact official URL',
    PROFILE_DATA.social.github === 'https://github.com/donizetti-dev',
    PROFILE_DATA.social.github
  );
  assertCondition(
    'PROFILE_DATA.social.githubUsername is donizetti-dev',
    PROFILE_DATA.social.githubUsername === 'donizetti-dev',
    PROFILE_DATA.social.githubUsername
  );
  assertCondition(
    'PROFILE_DATA.social.email is donizettibatista1@gmail.com',
    PROFILE_DATA.social.email === 'donizettibatista1@gmail.com',
    PROFILE_DATA.social.email
  );
  assertCondition(
    'PROFILE_DATA.handle is donizetti-dev',
    PROFILE_DATA.handle === 'donizetti-dev',
    PROFILE_DATA.handle
  );
  const isDefaultUserDonizetti = DEFAULT_GITHUB_USERNAME
    ? DEFAULT_GITHUB_USERNAME === 'donizetti-dev'
    : fs
        .readFileSync(path.join(ROOT_DIR, 'src', 'services', 'githubService.ts'), 'utf8')
        .includes("DEFAULT_GITHUB_USERNAME = 'donizetti-dev'");

  assertCondition(
    'githubService DEFAULT_GITHUB_USERNAME is donizetti-dev',
    isDefaultUserDonizetti,
    `Value: ${DEFAULT_GITHUB_USERNAME}`
  );
  assertCondition(
    'getGitHubUsername() defaults to donizetti-dev',
    getGitHubUsername() === 'donizetti-dev',
    getGitHubUsername()
  );

  // -------------------------------------------------------------
  // SUITE 2: Catalog Structure & Purity
  // -------------------------------------------------------------
  console.log('\n--- 3. Catalog Structure & Purity ---');
  assertCondition(
    'CUSTOM_PROJECTS_CATALOG has exactly 3 entries',
    CUSTOM_PROJECTS_CATALOG.length === 3,
    `Length: ${CUSTOM_PROJECTS_CATALOG.length}`
  );

  const allowedSlugs = ['news-scraper-api', 'trending-movies', 'infrawatch-terminal'];
  const catalogSlugs = CUSTOM_PROJECTS_CATALOG.map((p) => p.slug);
  assertCondition(
    'Catalog slugs match expected exactly',
    JSON.stringify(catalogSlugs.sort()) === JSON.stringify(allowedSlugs.sort()),
    `Found: ${catalogSlugs.join(', ')}`
  );

  // Negative tests for purged projects
  assertCondition(
    'Catalog does NOT contain portifolio-webdev',
    !catalogSlugs.includes('portifolio-webdev') &&
      !catalogSlugs.includes('catalog-portifolio-webdev')
  );
  assertCondition(
    'Catalog does NOT contain docflow-rpa-pipeline',
    !catalogSlugs.includes('docflow-rpa-pipeline') &&
      !catalogSlugs.includes('catalog-docflow-rpa-pipeline')
  );

  // Check each catalog item
  CUSTOM_PROJECTS_CATALOG.forEach((p) => {
    assertCondition(
      `Project ${p.slug} has valid HTTPS repoUrl`,
      p.repoUrl.startsWith('https://github.com/donizetti-dev/')
    );
    assertCondition(
      `Project ${p.slug} has non-empty description`,
      Boolean(p.description && p.description.length > 20)
    );
    assertCondition(
      `Project ${p.slug} has non-empty problemStatement`,
      Boolean(p.problemStatement && p.problemStatement.length > 20)
    );
    assertCondition(
      `Project ${p.slug} has architectureDecisions array`,
      Array.isArray(p.architectureDecisions) && p.architectureDecisions.length >= 2
    );
    assertCondition(
      `Project ${p.slug} has stack technologies`,
      Array.isArray(p.stack) && p.stack.length >= 3
    );
    assertCondition(`Project ${p.slug} has featuredByDefault: true`, p.featuredByDefault === true);
  });

  // -------------------------------------------------------------
  // SUITE 3: Offline Catalog Fallback & Slug Lookups
  // -------------------------------------------------------------
  console.log('\n--- 4. Offline Catalog Fallback & Slug Lookups ---');
  const fallbackProjects = getCatalogAsEnrichedProjects();
  assertCondition(
    'getCatalogAsEnrichedProjects() returns exactly 3 projects',
    fallbackProjects.length === 3,
    `Length: ${fallbackProjects.length}`
  );
  assertCondition(
    'All fallback projects are marked isCurated: true',
    fallbackProjects.every((p) => p.isCurated === true)
  );
  assertCondition(
    'All fallback projects are marked isFromGitHub: false',
    fallbackProjects.every((p) => p.isFromGitHub === false)
  );

  // Slug lookups
  allowedSlugs.forEach((slug) => {
    const found = findProjectBySlug(slug);
    assertCondition(
      `findProjectBySlug('${slug}') returns valid project`,
      Boolean(found && found.slug === slug)
    );
  });

  // Purged slugs lookups
  assertCondition(
    "findProjectBySlug('portifolio-webdev') is undefined",
    findProjectBySlug('portifolio-webdev') === undefined
  );
  assertCondition(
    "findProjectBySlug('docflow-rpa-pipeline') is undefined",
    findProjectBySlug('docflow-rpa-pipeline') === undefined
  );
  assertCondition(
    "findProjectBySlug('malicious-slug') is undefined",
    findProjectBySlug('malicious-slug') === undefined
  );

  // -------------------------------------------------------------
  // SUITE 4: Adversarial Whitelist Stress Testing (mergeGitHubWithCatalog)
  // -------------------------------------------------------------
  console.log('\n--- 5. Adversarial Whitelist Stress Testing ---');

  // Vector 4.1: Empty GitHub API response
  const mergedEmpty = mergeGitHubWithCatalog([]);
  assertCondition(
    'mergeGitHubWithCatalog([]) returns exactly 3 catalog projects',
    mergedEmpty.length === 3
  );
  assertCondition(
    'mergeGitHubWithCatalog([]) contains all 3 allowed slugs',
    mergedEmpty.every((p) => allowedSlugs.includes(p.slug))
  );

  // Vector 4.2: Legitimate 3 GitHub repos
  const legitGithubRepos = [
    {
      id: 101,
      name: 'news-scraper-api',
      html_url: 'https://github.com/donizetti-dev/news-scraper-api',
      description: 'API REST G1 scraper',
      language: 'Python',
      topics: ['python', 'selenium'],
      stargazers_count: 5,
      forks_count: 1,
      updated_at: '2025-02-15T14:30:00Z',
      fork: false,
    },
    {
      id: 102,
      name: 'Trending_Movie-React',
      html_url: 'https://github.com/donizetti-dev/Trending_Movie-React',
      description: 'React TMDB app',
      language: 'JavaScript',
      topics: ['react', 'tmdb'],
      stargazers_count: 12,
      forks_count: 3,
      updated_at: '2025-02-20T18:00:00Z',
      fork: false,
    },
    {
      id: 103,
      name: 'Infrawatch-Terminal',
      html_url: 'https://github.com/donizetti-dev/Infrawatch-Terminal',
      description: 'Terminal CLI tool',
      language: 'Python',
      topics: ['terminal', 'cli'],
      stargazers_count: 8,
      forks_count: 2,
      updated_at: '2025-01-28T11:15:00Z',
      fork: false,
    },
  ];

  const mergedLegit = mergeGitHubWithCatalog(legitGithubRepos);
  assertCondition(
    'mergeGitHubWithCatalog(legitRepos) returns exactly 3 items',
    mergedLegit.length === 3
  );
  assertCondition(
    'All 3 legit repos have isFromGitHub: true',
    mergedLegit.every((p) => p.isFromGitHub === true)
  );
  assertCondition(
    'All 3 legit repos have stargazersCount > 0',
    mergedLegit.every((p) => p.stargazersCount > 0)
  );

  // Vector 4.3: Adversarial Injection of Unapproved Repositories
  const adversarialSpamRepos = [
    {
      id: 901,
      name: 'docflow-rpa-pipeline',
      fork: false,
      html_url: 'https://github.com/donizetti-dev/docflow-rpa-pipeline',
    },
    {
      id: 902,
      name: 'portifolio-webdev',
      fork: false,
      html_url: 'https://github.com/donizetti-dev/portifolio-webdev',
    },
    {
      id: 903,
      name: 'catalog-portifolio-webdev',
      fork: false,
      html_url: 'https://github.com/donizetti-dev/catalog-portifolio-webdev',
    },
    {
      id: 904,
      name: 'crypto-miner-daemon',
      fork: false,
      html_url: 'https://github.com/donizetti-dev/crypto-miner-daemon',
    },
    {
      id: 905,
      name: 'dotfiles',
      fork: false,
      html_url: 'https://github.com/donizetti-dev/dotfiles',
    },
    {
      id: 906,
      name: 'linux-kernel-fork',
      fork: true,
      html_url: 'https://github.com/torvalds/linux',
    },
    {
      id: 907,
      name: 'news-scraper-api-v2-fake',
      fork: false,
      html_url: 'https://github.com/donizetti-dev/news-scraper-api-v2-fake',
    },
    {
      id: 908,
      name: 'Trending_Movie-React-clone',
      fork: false,
      html_url: 'https://github.com/donizetti-dev/Trending_Movie-React-clone',
    },
    {
      id: 909,
      name: 'Infrawatch-Web-UI',
      fork: false,
      html_url: 'https://github.com/donizetti-dev/Infrawatch-Web-UI',
    },
    {
      id: 910,
      name: 'unauthorized-admin-scripts',
      fork: false,
      html_url: 'https://github.com/donizetti-dev/unauthorized-admin-scripts',
    },
  ];

  const mergedSpamOnly = mergeGitHubWithCatalog(adversarialSpamRepos);
  assertCondition(
    'Spam-only injection: ZERO spam repos admitted, output strictly 3 fallback catalog projects',
    mergedSpamOnly.length === 3,
    `Found length: ${mergedSpamOnly.length}`
  );
  assertCondition(
    'Spam-only injection: None of the spam names leaked into merged output',
    mergedSpamOnly.every(
      (p) => !adversarialSpamRepos.some((spam) => spam.name === p.repoName || spam.name === p.slug)
    )
  );

  // Vector 4.4: Mixed Legitimate + Adversarial Spam Repositories
  const mixedPayload = [...legitGithubRepos, ...adversarialSpamRepos];
  const mergedMixed = mergeGitHubWithCatalog(mixedPayload);
  assertCondition(
    'Mixed payload: strictly 3 approved projects returned',
    mergedMixed.length === 3,
    `Found length: ${mergedMixed.length}`
  );
  const mixedSlugs = mergedMixed.map((p) => p.slug).sort();
  assertCondition(
    'Mixed payload: slugs match exactly approved 3',
    JSON.stringify(mixedSlugs) === JSON.stringify(allowedSlugs.sort()),
    `Slugs: ${mixedSlugs.join(', ')}`
  );

  // Vector 4.5: Adversarial Prototype & Object Poisoning
  const prototypePoisonPayload = [
    { id: 991, name: '__proto__', fork: false },
    { id: 992, name: 'constructor', fork: false },
    { id: 993, name: 'toString', fork: false },
    { id: 994, name: 'valueOf', fork: false },
  ];
  const mergedPoison = mergeGitHubWithCatalog(prototypePoisonPayload);
  assertCondition(
    'Prototype poisoning: returns exactly 3 catalog projects without error',
    mergedPoison.length === 3
  );

  // Vector 4.6: Disabled and Archived Handling
  const archivedAndDisabled = [
    { ...legitGithubRepos[0], archived: true }, // news-scraper-api archived
    { ...legitGithubRepos[1], disabled: true }, // Trending_Movie-React disabled
    legitGithubRepos[2], // Infrawatch-Terminal active
  ];
  const mergedArchived = mergeGitHubWithCatalog(archivedAndDisabled);
  assertCondition(
    'Archived & Disabled: output still has exactly 3 projects (catalog fallback fills skipped items)',
    mergedArchived.length === 3,
    `Found length: ${mergedArchived.length}`
  );
  const fromGithubCount = mergedArchived.filter((p) => p.isFromGitHub).length;
  const fromCatalogCount = mergedArchived.filter((p) => !p.isFromGitHub).length;
  assertCondition(
    'Archived & Disabled: exactly 1 from GitHub (Infrawatch) and 2 from catalog fallback',
    fromGithubCount === 1 && fromCatalogCount === 2,
    `fromGithub: ${fromGithubCount}, fromCatalog: ${fromCatalogCount}`
  );

  // Vector 4.7: Duplicate API responses (Simulated GitHub anomaly)
  const duplicatePayload = [
    legitGithubRepos[0],
    legitGithubRepos[0], // Duplicate!
    legitGithubRepos[1],
    legitGithubRepos[2],
  ];
  const mergedDuplicates = mergeGitHubWithCatalog(duplicatePayload);
  console.log(
    `  [INFO] Duplicate payload test: input had 4 items (1 duplicate). Output length: ${mergedDuplicates.length}`
  );

  // -------------------------------------------------------------
  // SUITE 5: Production Bundle Verification
  // -------------------------------------------------------------
  console.log('\n--- 6. Production Bundle Content Verification ---');
  const distAssetsDir = path.join(ROOT_DIR, 'dist', 'assets');
  if (fs.existsSync(distAssetsDir)) {
    const jsFiles = fs
      .readdirSync(distAssetsDir)
      .filter((f) => f.startsWith('index-') && f.endsWith('.js'));
    assertCondition('dist/assets/index-*.js bundle exists', jsFiles.length > 0);
    if (jsFiles.length > 0) {
      const bundle = fs.readFileSync(path.join(distAssetsDir, jsFiles[0]), 'utf8');

      // Required tokens
      assertCondition(
        'Bundle has linkedin URL',
        bundle.includes('https://www.linkedin.com/in/donizetti-dev')
      );
      assertCondition('Bundle has github URL', bundle.includes('https://github.com/donizetti-dev'));
      assertCondition('Bundle has email', bundle.includes('donizettibatista1@gmail.com'));
      assertCondition(
        'Bundle has news-scraper-api URL',
        bundle.includes('https://github.com/donizetti-dev/news-scraper-api')
      );
      assertCondition(
        'Bundle has Trending_Movie-React URL',
        bundle.includes('https://github.com/donizetti-dev/Trending_Movie-React')
      );
      assertCondition(
        'Bundle has Infrawatch-Terminal URL',
        bundle.includes('https://github.com/donizetti-dev/Infrawatch-Terminal')
      );

      // Forbidden legacy tokens
      assertCondition('Bundle does NOT contain Doni-zete', !/doni-zete/i.test(bundle));
      assertCondition(
        'Bundle does NOT contain donizetti-junior',
        !/donizetti-junior/i.test(bundle)
      );
      assertCondition(
        'Bundle does NOT contain contato@donizetti.dev',
        !/contato@donizetti\.dev/i.test(bundle)
      );
      assertCondition('Bundle does NOT contain docflow', !/docflow/i.test(bundle));
      assertCondition(
        'Bundle does NOT contain catalog-portifolio-webdev',
        !/catalog-portifolio-webdev/i.test(bundle)
      );
    }
  } else {
    assertCondition('dist/assets directory exists', false, 'dist folder missing');
  }

  // -------------------------------------------------------------
  // SUITE 6: docs/ajustes.md Verification
  // -------------------------------------------------------------
  console.log('\n--- 7. Documentation (docs/ajustes.md) Verification ---');
  const docPath = path.join(ROOT_DIR, 'docs', 'ajustes.md');
  assertCondition('docs/ajustes.md exists', fs.existsSync(docPath));
  if (fs.existsSync(docPath)) {
    const docContent = fs.readFileSync(docPath, 'utf8');
    assertCondition(
      'docs/ajustes.md contains Resumo Executivo',
      docContent.includes('Resumo Executivo')
    );
    assertCondition(
      'docs/ajustes.md contains Correção de Links',
      docContent.includes('Correção de Links')
    );
    assertCondition(
      'docs/ajustes.md contains Reformulação da Seção de Projetos',
      docContent.includes('Reformulação da Seção de Projetos')
    );
    assertCondition(
      'docs/ajustes.md contains Relação Completa de Arquivos Modificados',
      docContent.includes('Relação Completa de Arquivos Modificados')
    );
    assertCondition(
      'docs/ajustes.md contains Verificação e Resultados de Testes',
      docContent.includes('Verificação e Resultados de Testes')
    );
    assertCondition('docs/ajustes.md mentions donizetti-dev', docContent.includes('donizetti-dev'));
    assertCondition(
      'docs/ajustes.md mentions donizettibatista1@gmail.com',
      docContent.includes('donizettibatista1@gmail.com')
    );
    assertCondition(
      'docs/ajustes.md mentions news-scraper-api',
      docContent.includes('news-scraper-api')
    );
    assertCondition(
      'docs/ajustes.md mentions Trending_Movie-React',
      docContent.includes('Trending_Movie-React')
    );
    assertCondition(
      'docs/ajustes.md mentions Infrawatch-Terminal',
      docContent.includes('Infrawatch-Terminal')
    );
  }

  await server.close();

  console.log('\n===============================================================');
  console.log(`TOTAL ASSERTIONS: ${passedAssertions + failedAssertions}`);
  console.log(`PASSED: ${passedAssertions}`);
  console.log(`FAILED: ${failedAssertions}`);
  console.log(`FINAL VERDICT: ${failedAssertions === 0 ? 'CONFIRMED' : 'REJECTED'}`);
  console.log('===============================================================');

  if (failedAssertions > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAdversarialSuite().catch((err) => {
  console.error('Fatal error running adversarial suite:', err);
  process.exit(1);
});
