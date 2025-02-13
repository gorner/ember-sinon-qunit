import { module } from 'qunit';
import { resolve } from 'rsvp';
import test from 'ember-sinon-qunit/test-support/test';
import assertSinonInTestContext from '../helpers/assert-sinon-in-test-context';

let fooValue = 42;
let origMethod;
let obj;

module('Deprecated | Unit | ember-sinon-qunit', {
  beforeEach() {
    this.foo = fooValue;

    origMethod = () => {};
    obj = {
      method: origMethod
    };
  },

  afterEach(assert) {
    assert.equal(obj.method, origMethod, 'stub was reset');
  }
});

assertSinonInTestContext(test);

test('does not destroy context from beforeEach', function (assert) {
  assert.equal(this.foo, fooValue);
});

test('async with assert.async()', function (assert) {
  assert.expect(2);
  this.stub(obj, 'method');

  const done = assert.async();
  setTimeout(() => {
    assert.notEqual(obj.method, origMethod, 'stub not reset yet');
    done();
  });
});

test('async with Promise', function (assert) {
  assert.expect(2);
  this.stub(obj, 'method');

  return resolve().then(() => {
    assert.notEqual(obj.method, origMethod);
  });
});

test('async with Promise and assert.async()', function (assert) {
  assert.expect(3);
  this.stub(obj, 'method');

  return resolve().then(() => {
    assert.notEqual(obj.method, origMethod, 'stub not reset yet');
    const done = assert.async();
    setTimeout(() => {
      assert.notEqual(obj.method, origMethod, 'stub not reset yet');
      done();
    });
  });
});
