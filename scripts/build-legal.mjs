import { readFile, mkdir, writeFile } from 'node:fs/promises'
import ts from 'typescript'

// One content source for app views and accessible, printable HTML pages.
const source = await readFile(new URL('../src/content/legalDocuments.ts', import.meta.url), 'utf8')
const javascript = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText
const { LEGAL_DOCUMENTS, LEGAL_RELEASE_STATUS, LEGAL_VERSION, OPERATOR } = await import(`data:text/javascript;base64,${Buffer.from(javascript).toString('base64')}`)
const escape = value => String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch])
const paths = new Set(LEGAL_DOCUMENTS.map(document => document.path))
function href(value) {
  if (value.startsWith('#/')) {
    const path = value.slice(2)
    return paths.has(path) ? `/legal/${path}.html` : `/${value}`
  }
  return /^(https:|mailto:)/.test(value) ? value : '#'
}
function paragraph(value) {
  return value.split(/(\[[^\]]+\]\([^)]+\))/g).map(part => {
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part)
    return link ? `<a href="${escape(href(link[2]))}">${escape(link[1])}</a>` : escape(part)
  }).join('')
}
await mkdir(new URL('../dist/legal/', import.meta.url), { recursive: true })
for (const document of LEGAL_DOCUMENTS) {
  const navigation = LEGAL_DOCUMENTS.map(item => `<a href="/legal/${escape(item.path)}.html"${item.path === document.path ? ' aria-current="page"' : ''}>${escape(item.title)}</a>`).join('')
  const contents = document.sections.map((section, index) => `<a href="#section-${index}">${escape(section.heading)}</a>`).join('')
  const sections = document.sections.map((section, index) => `<section id="section-${index}"><h2>${escape(section.heading)}</h2>${section.paragraphs.map(text => `<p>${paragraph(text)}</p>`).join('')}${section.items ? `<ul>${section.items.map(text => `<li>${paragraph(text)}</li>`).join('')}</ul>` : ''}</section>`).join('')
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#080d19"><meta name="description" content="${escape(document.summary)}"><link rel="canonical" href="https://transproxy.org/legal/${escape(document.path)}.html"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/legal.css"><title>${escape(document.title)} — TransProxy</title></head><body><a class="skip-link" href="#content">Skip to document</a><header class="site-header"><a class="wordmark" href="/"><span class="staff" aria-hidden="true"></span>TransProxy</a><nav aria-label="Main"><a href="/#/juliens-story">Julien’s Story</a><a href="/#/features">Features</a><a href="/#/legal-requests">Contact &amp; requests</a></nav></header><main id="content"><h1>${escape(document.title)}</h1>${LEGAL_RELEASE_STATUS === 'draft' ? '<p class="draft">Draft policy · Not yet published or in effect</p>' : ''}<p class="version">Version ${escape(LEGAL_VERSION)}</p><p class="summary">${escape(document.summary)}</p><div class="reading-layout"><aside><h2>In this document</h2><nav aria-label="Contents">${contents}</nav></aside><article>${sections}</article></div><nav class="related" aria-label="Legal documents">${navigation}</nav></main><footer>Operated by ${escape(OPERATOR.name)} · <a href="mailto:${escape(OPERATOR.email)}">${escape(OPERATOR.email)}</a>${OPERATOR.postalAddress ? `<p>${escape(OPERATOR.postalAddress)}</p>` : ''}</footer></body></html>`
  await writeFile(new URL(`../dist/legal/${document.path}.html`, import.meta.url), html)
  if (document.path === 'privacy' || document.path === 'terms') await writeFile(new URL(`../dist/${document.path}.html`, import.meta.url), html)
}
console.log(`Generated ${LEGAL_DOCUMENTS.length} matching, printable legal documents (${LEGAL_RELEASE_STATUS}).`)
