/**
 * @license
 * Copyright (c) 2020 Julien Gonzalez
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const Nil = Symbol();

const make_multifn =
  (dispatcher, fns, fallback) =>
    (...args) => {
      const dispatched = dispatcher(...args);
      return (fns.find(([x]) => x === dispatched) || [, fallback])[1](...args);
    };

// Throws an error with given message `msg`.
const err =
  msg =>
    { throw new Error(`multifun: ${msg}`); };

// Return `x` if it is a function. Otherwise throw an error.
const assert_fn =
  (x, msg) =>
    typeof x === 'function'
      ? x
      : err(msg);

const assert_pairs =
  ([pair = Nil, ...pairs], ys = []) =>
      pair === Nil
        ? ys
        : assert_pairs
            ( pairs
            , [ ...ys
              , [ pair[0]
                , assert_fn(pair[1], `handler for ${pair[0]} is not a function`)
                ]
              ]
            );

// Group items in a list by pairs.
// e.g. [1, 2, 3, 4] -> [[1, 2], [3, 4]]
const pair =
  (xs, ys = []) =>
    xs.length === 0
      ? ys
      : pair
          ( xs.slice(2)
          , [ ...ys
            , xs.slice(0, 2)
            ]
          );

// better doc please
module.exports =
  (dispatcher, ...rest) =>
    make_multifn
      ( assert_fn
          ( dispatcher
          , 'dispatcher is not a function'
          )
      , assert_pairs
          ( rest.length % 2 === 0
              ? pair(rest)
              : pair(rest.slice(0, -1))
          )
      , assert_fn
          ( rest.length % 2 === 0
              ? null
              : rest[rest.length-1]
          , 'fallback is not a function'
          )
      );
