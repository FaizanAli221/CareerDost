import Database from 'better-sqlite3';
import { isGenuineJobVacancy, buildJobPostingSchema } from '../src/lib/jobSchema.js';
import { getContentType, getContentTypeLabels, getContextualStatus } from '../src/lib/contentType.js';
import fs from 'fs';

const db = new Database('careerdost.sqlite');

const mwCode = fs.readFileSync('functions/_middleware.js', 'utf8');

// Extract cleanPlainText through generateJobHtml
const codeToEval = mwCode.slice(mwCode.indexOf('function cleanPlainText'), mwCode.indexOf('const CATEGORY_META'));

// Set up global scope for eval
globalThis.getContentType = getContentType;
globalThis.getContentTypeLabels = getContentTypeLabels;
globalThis.getContextualStatus = getContextualStatus;
globalThis.DEFAULT_OG_IMAGE = 'https://careerdost.blog/default.jpg';
globalThis.SITE_URL = 'https://careerdost.blog';

eval(codeToEval);

const article = db.prepare('SELECT * FROM articles WHERE slug = ?').get('spsc-exam-preparation-screening-challan-guide');

try {
  const html = generateJobHtml(article, 'https://careerdost.blog/jobs/' + article.slug);
  console.log('generateJobHtml succeeded, length:', html.length);
} catch (err) {
  console.error('EXACT ERROR IN generateJobHtml:', err);
}
