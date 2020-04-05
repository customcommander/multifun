const sut = require('./dist');
const test = require('tape');
const td = require('testdouble');

const not_a_function = 42;

test('throws when dispatcher is not a function', t => {
  t.throws( () => sut
                    ( not_a_function
                    , 5, x => x
                    , x => x
                    )
          , 'dispatcher is not a function'
          );

  t.end();
});

test('throws when fallback is not a function', t => {
  t.throws( () => sut
                    ( x => x
                    , 5, x => x
                    )
          , 'fallback is missing'
          );

  t.throws( () => sut
                    ( x => x
                    , 5, x => x
                    , not_a_function
                    )
          , 'fallback is not a function'
          );

  t.end();
});

test('throws when a handler is not a function', t => {
  t.throws( () => sut
                    ( x => x
                    , 5, x => x
                    , 6, not_a_function
                    , 7, x => x
                    , x => x
                    )
          , 'handler is not a function'
          );

  t.end();
});

test('applies dispatcher to the arguments given to the multifunction', t => {
  const dispatcher = td.function();

  td.when(dispatcher(1, 2, 3)).thenReturn(5);

  const multifn = sut
                    ( dispatcher
                    , 5, () => 'OK!'
                    , x => x
                    );

  t.equal(multifn(1, 2, 3), 'OK!');
  t.end();
});

test('applies handler to the arguments given to the multifunction', t => {
  const handler = td.function();

  td.when(handler(1, 2, 3)).thenReturn('OK!');

  const multifn = sut
                    ( () => 5
                    , 5, handler
                    , x => x
                    );

  t.equal(multifn(1, 2, 3), 'OK!');
  t.end();
});

test('applies fallback to the arguments given to the multifunction', t => {
  const fallback = td.function();

  td.when(fallback(1, 2, 3)).thenReturn('OK!');

  const multifn = sut
                    ( () => 42
                    , 5, x => x
                    , fallback
                    );

  t.equal(multifn(1, 2, 3), 'OK!');
  t.end();
});

test('uses strict equality when comparing with the dispatched value', t => {
  const multifn = sut
                    ( () => 5
                    , '5', () => 'NOT OK!'
                    , () => 'OK!'
                    );

  t.equal(multifn(), 'OK!');
  t.end();
});
