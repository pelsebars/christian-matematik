import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateGrade, estimatedGradeHTML } from '../tasks/estimated-grade.js';

test('Grades use weighted points and exact boundaries, including partial points', () => {
  assert.deepEqual(estimateGrade({ points: 60, max: 80 }), { percent: 75, grade: '7' });
  for (const [percent, grade] of [[0,'−3'],[9.999,'−3'],[10,'00'],[34.999,'00'],[35,'02'],[49.999,'02'],[50,'4'],[64.999,'4'],[65,'7'],[84.999,'7'],[85,'10'],[94.999,'10'],[95,'12'],[100,'12']]) {
    assert.equal(estimateGrade({ points: percent, max: 100 }).grade, grade);
  }
  assert.equal(estimateGrade({ points: 9.5, max: 10 }).grade, '12');
});

test('Pending review and invalid totals never produce a grade', () => {
  for (const result of [{points: 10, max: 10, pending: 2}, {points: 0, max: 0}, {points: -1,max: 10}, {points: 11,max: 10}, {points: NaN,max: 10}, {points: 1,max: Infinity}]) {
    assert.equal(estimateGrade(result), null);
    assert.doesNotMatch(estimatedGradeHTML(result), /Estimeret karakter: <strong>/);
  }
});

test('Result explains its basis, self assessment and own scale', () => {
  const html = estimatedGradeHTML({points: 60, max: 80, self: 5});
  assert.match(html, /75 %/);
  assert.match(html, /80 point = 100 %/);
  assert.match(html, /Estimeret karakter: <strong>7/);
  assert.match(html, /din egen vurdering/);
  assert.match(html, /ikke officielle eksamensgrænser/);
  assert.match(estimatedGradeHTML({points: 94.999,max: 100}), /94,99 %/);
});
