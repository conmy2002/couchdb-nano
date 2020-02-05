// Licensed under the Apache License, Version 2.0 (the 'License'); you may not
// use this file except in compliance with the License. You may obtain a copy of
// the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations under
// the License.

const Nano = require('..')
const COUCH_URL = 'http://localhost:5984'
const nano = Nano(COUCH_URL)
const nock = require('nock')
const response = { ok: true }

test('should destroy a database - DELETE /db - nano.db.destroy', async () => {
  // mocks
  const scope = nock(COUCH_URL)
    .delete('/db')
    .reply(200, response)

  // test DELETE /db
  const p = await nano.db.destroy('db')
  expect(typeof p).toBe('object')
  expect(p.ok).toBe(true)
  expect(scope.isDone()).toBe(true)
})

test('should handle non-existant database - DELETE /db - nano.db.create', async () => {
  // mocks
  const scope = nock(COUCH_URL)
    .delete('/db')
    .reply(404, {
      error: 'not_found',
      reason: 'Database does not exist.'
    })

  // test DELETE /db
  await expect(nano.db.destroy('db')).rejects.toThrow('Database does not exist')
  expect(scope.isDone()).toBe(true)
})

test('should not attempt to destroy database with empty database name - nano.db.destroy', async () => {
  expect(() => {
    nano.db.destroy('')
  }).toThrowError('missing dbName')
})

test('should not attempt to destroy database with missing database name - nano.db.destroy', async () => {
  expect(() => {
    nano.db.destroy()
  }).toThrowError('missing dbName')
})
