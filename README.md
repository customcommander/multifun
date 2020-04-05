# multifun

Clojure-inspired multimethods for JavaScript.

### Why?

**Problem statement:** JavaScript does not offer native constructs to facilitate the orchestration of functions.

Say we need to generate code that greets someone in a given programming language:

```javascript
greetings('clojure', 'John');
//=> '(print "Hi John!")'

greetings('shell', 'John');
//=> 'echo "Hi John!"'
```

Here's one classic implementation:

```javascript
const greetings = (lang, name) => {
  switch (lang) {
    case CLOJURE:
      return greetings_clojure(name);
    case SHELL:
      return greetings_shell(name);
    default:
      throw new Error(`unknown: ${lang}`);
  }
};
```

Let's take a moment to identify the important bits:

1. We need some parameters (pink)
2. We need a dispatch value to make a decision (yellow)
3. We need a "decision tree" (green)
4. We need a fallback (orange)

![](https://raw.githubusercontent.com/customcommander/multifun/master/docs/code-analysis.png)

Everything else is just implementation details....

It is these details that `multifun` intends to manage so that you can focus on what matters the most:

![](https://raw.githubusercontent.com/customcommander/multifun/master/docs/code-multifun.png)

### How does it work?

```javascript
const multifun = require('@customcommander/multifun');

const xyz =
  multifun
    ( dispatching_fn
    , 'xxx', handle_xxx_fn
    , 'yyy', handle_yyy_fn
    , 'zzz', handle_zzz_fn
    // ...
    , fallback_fn
    );

xyz(...);
```

1.  The 1<sup>st</sup> parameter is the dispatching function.<br>
    It takes all the parameters passed to `xyz` and returns a value.

2.  Then you have a serie of value & handler pairs.<br>
    If a value is strictly equal to the dispatched value, its handler is applied to the parameters passed to `xyz`. (No other pairs will be evaluated.)

3.  And finally a fallback function if no values matched.<br>
    It is applied to the parameters passed to `xyz`.
