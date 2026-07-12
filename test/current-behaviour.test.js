'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

// Baseline copies of pure current rules from index.html.
// These tests document expected prototype behaviour without changing runtime code.
const TEMPORAL_MARKERS = {
  immediate: ['immediate','urgent','asap','immediately','right now','now','critical','emergency','do now','do first'],
  today:     ['today','this morning','this afternoon','this evening','tonight','by eod','by end of day','by close'],
  tomorrow:  ['tomorrow','next day','by tomorrow'],
  week:      ['this week','week','by friday','by thursday','by wednesday','by tuesday','by monday','later this week','next few days'],
  planned:   ['next week','next month','someday','eventually','to plan','to be planned','in future','later','plan later','backlog']
};

function preprocessTaskInput(rawText) {
  if(!rawText) return '';
  return rawText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function detectTaskBoundaries(text) {
  let parts = [];
  if(/\n/.test(text)) {
    parts = text.split(/\n+/).map(s=>s.trim()).filter(s=>s.length>3);
    if(parts.length > 1) return parts;
  }
  if(/^[\s]*[-•*\d\.]+\s/m.test(text)) {
    parts = text.split(/\n?[\s]*[-•*][\s]+|\n?[\s]*\d+[.)]\s+/)
      .map(s=>s.trim()).filter(s=>s.length>3);
    if(parts.length > 1) return parts;
  }
  const verbalSep = /\s+(?:and then|after that|additionally|next up)\s+/gi;
  if(verbalSep.test(text)) {
    parts = text.split(verbalSep).map(s=>s.trim()).filter(s=>s.length>3);
    if(parts.length > 1) return parts;
  }
  return [text];
}

function extractDraftTasks(cleanedText) {
  const boundaries = detectTaskBoundaries(cleanedText);
  return boundaries.map((raw, i) => {
    const text = raw
      .replace(/^(and|also|then|plus|i need to|i want to|i would like to|please|can you|i should|we need to|we should)\s+/i,'')
      .replace(/^[-•*\d.]+\s*/,'')
      .trim();
    const normalised = text.charAt(0).toUpperCase() + text.slice(1);
    let bucket = 'today';
    let confidence = 0.6;
    const lower = text.toLowerCase();
    for(const [b, markers] of Object.entries(TEMPORAL_MARKERS)) {
      if(markers.some(m => lower.includes(m))) {
        bucket = b;
        confidence = 0.85;
        break;
      }
    }
    if(bucket === 'today') {
      if(/\bweek\b/i.test(lower)) { bucket = 'week'; confidence = 0.8; }
      else if(/\bplan\b/i.test(lower) && !/plan\s+my|plan\s+a/i.test(lower)) { bucket = 'planned'; confidence = 0.75; }
    }
    if(normalised.split(' ').length <= 5 && bucket === 'today') confidence = 0.7;
    return { id: 'draft_test_' + i, text: normalised, bucket, confidence, source: raw, included: true };
  }).filter(t => t.text.length > 2);
}

function daysDiff(dateStr, now = new Date('2026-07-11T12:00:00Z')){
  if(!dateStr) return null;
  const today=new Date(now); today.setHours(0,0,0,0);
  const d=new Date(dateStr+'T00:00:00');
  return Math.round((d-today)/(1000*60*60*24));
}

function computeTaskStatus(t, now){
  const createdDiff = daysDiff(t.createdAt||'2026-07-11', now);
  const daysOld = createdDiff!==null ? -createdDiff : 0;
  const dueDiff = t.dueDate ? daysDiff(t.dueDate, now) : null;
  const moveCount = t.moveCount||0;
  if(dueDiff!==null && dueDiff<0) return {cls:'overdue', label:'Overdue', stale:true};
  if(dueDiff!==null && dueDiff<=2 && dueDiff>=0) return {cls:'due-soon', label:'Due soon', stale:false};
  if(moveCount>=3) return {cls:'repeatedly-moved', label:'This has moved a few times', stale:true};
  if(t.bucket==='today' && daysOld>=3) {
    if(daysOld>=5) return {cls:'needs-breakdown', label:'Could be worth breaking down', stale:true};
    return {cls:'stuck', label:'Still hanging around', stale:true};
  }
  return {cls:'on-track', label:'', stale:false};
}

test('preprocessTaskInput normalises whitespace without changing task words', () => {
  assert.equal(preprocessTaskInput('  send report   today\r\n\r\n\r\nreview slides  '), 'send report today\n\nreview slides');
});

test('extractDraftTasks keeps natural multi-word task text and infers buckets', () => {
  const tasks = extractDraftTasks(preprocessTaskInput('send the report today\nand then review the plan this week\nbook hotel next month'));
  assert.deepEqual(tasks.map(t => [t.text, t.bucket]), [
    ['Send the report today', 'today'],
    ['Then review the plan this week', 'week'],
    ['Book hotel next month', 'planned']
  ]);
});

test('extractDraftTasks recognises tomorrow as a first-class bucket', () => {
  const [task] = extractDraftTasks(preprocessTaskInput('prepare the agenda tomorrow'));
  assert.equal(task.bucket, 'tomorrow');
});

test('computeTaskStatus treats overdue due dates as highest priority status', () => {
  const status = computeTaskStatus({bucket:'today', createdAt:'2026-07-01', dueDate:'2026-07-10', moveCount:4});
  assert.deepEqual(status, {cls:'overdue', label:'Overdue', stale:true});
});

test('computeTaskStatus flags repeatedly moved tasks when not overdue', () => {
  const status = computeTaskStatus({bucket:'today', createdAt:'2026-07-11', dueDate:null, moveCount:3});
  assert.deepEqual(status, {cls:'repeatedly-moved', label:'This has moved a few times', stale:true});
});
