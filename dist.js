var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// node_modules/stylus/lib/token.js
var require_token = __commonJS({
  "node_modules/stylus/lib/token.js"(exports, module2) {
    var inspect = require("util").inspect;
    var Token = exports = module2.exports = function Token2(type, val) {
      this.type = type;
      this.val = val;
    };
    Token.prototype.inspect = function() {
      var val = " " + inspect(this.val);
      return "[Token:" + this.lineno + ":" + this.column + " \x1B[32m" + this.type + "\x1B[0m\x1B[33m" + (this.val ? val : "") + "\x1B[0m]";
    };
    Token.prototype.toString = function() {
      return (void 0 === this.val ? this.type : this.val).toString();
    };
  }
});

// node_modules/stylus/lib/visitor/index.js
var require_visitor = __commonJS({
  "node_modules/stylus/lib/visitor/index.js"(exports, module2) {
    var Visitor = module2.exports = function Visitor2(root) {
      this.root = root;
    };
    Visitor.prototype.visit = function(node, fn) {
      var method = "visit" + node.constructor.name;
      if (this[method])
        return this[method](node);
      return node;
    };
  }
});

// node_modules/stylus/lib/units.js
var require_units = __commonJS({
  "node_modules/stylus/lib/units.js"(exports, module2) {
    module2.exports = [
      "em",
      "ex",
      "ch",
      "rem",
      "vw",
      "vh",
      "vmin",
      "vmax",
      "cm",
      "mm",
      "in",
      "pt",
      "pc",
      "px",
      "deg",
      "grad",
      "rad",
      "turn",
      "s",
      "ms",
      "Hz",
      "kHz",
      "dpi",
      "dpcm",
      "dppx",
      "x",
      "%",
      "fr"
      // grid-layout (http://www.w3.org/TR/css3-grid-layout/)
    ];
  }
});

// node_modules/stylus/lib/stack/index.js
var require_stack = __commonJS({
  "node_modules/stylus/lib/stack/index.js"(exports, module2) {
    var Stack = module2.exports = function Stack2() {
      Array.apply(this, arguments);
    };
    Stack.prototype.__proto__ = Array.prototype;
    Stack.prototype.push = function(frame) {
      frame.stack = this;
      frame.parent = this.currentFrame;
      return [].push.apply(this, arguments);
    };
    Stack.prototype.__defineGetter__("currentFrame", function() {
      return this[this.length - 1];
    });
    Stack.prototype.getBlockFrame = function(block) {
      for (var i = 0; i < this.length; ++i) {
        if (block == this[i].block) {
          return this[i];
        }
      }
    };
    Stack.prototype.lookup = function(name) {
      var block = this.currentFrame.block, val, ret;
      do {
        var frame = this.getBlockFrame(block);
        if (frame && (val = frame.lookup(name))) {
          return val;
        }
      } while (block = block.parent);
    };
    Stack.prototype.inspect = function() {
      return this.reverse().map(function(frame) {
        return frame.inspect();
      }).join("\n");
    };
    Stack.prototype.toString = function() {
      var block, node, buf = [], location, len = this.length;
      while (len--) {
        block = this[len].block;
        if (node = block.node) {
          location = "(" + node.filename + ":" + (node.lineno + 1) + ":" + node.column + ")";
          switch (node.nodeName) {
            case "function":
              buf.push("    at " + node.name + "() " + location);
              break;
            case "group":
              buf.push('    at "' + node.nodes[0].val + '" ' + location);
              break;
          }
        }
      }
      return buf.join("\n");
    };
  }
});

// node_modules/stylus/lib/stack/scope.js
var require_scope = __commonJS({
  "node_modules/stylus/lib/stack/scope.js"(exports, module2) {
    var Scope = module2.exports = function Scope2() {
      this.locals = {};
    };
    Scope.prototype.add = function(ident) {
      this.locals[ident.name] = ident.val;
    };
    Scope.prototype.lookup = function(name) {
      return hasOwnProperty(this.locals, name) ? this.locals[name] : void 0;
    };
    Scope.prototype.inspect = function() {
      var keys = Object.keys(this.locals).map(function(key) {
        return "@" + key;
      });
      return "[Scope" + (keys.length ? " " + keys.join(", ") : "") + "]";
    };
    function hasOwnProperty(obj, propName) {
      return Object.prototype.hasOwnProperty.call(obj, propName);
    }
  }
});

// node_modules/stylus/lib/stack/frame.js
var require_frame = __commonJS({
  "node_modules/stylus/lib/stack/frame.js"(exports, module2) {
    var Scope = require_scope();
    var Frame = module2.exports = function Frame2(block) {
      this._scope = false === block.scope ? null : new Scope();
      this.block = block;
    };
    Frame.prototype.__defineGetter__("scope", function() {
      return this._scope || this.parent.scope;
    });
    Frame.prototype.lookup = function(name) {
      return this.scope.lookup(name);
    };
    Frame.prototype.inspect = function() {
      return "[Frame " + (false === this.block.scope ? "scope-less" : this.scope.inspect()) + "]";
    };
  }
});

// node_modules/fs.realpath/old.js
var require_old = __commonJS({
  "node_modules/fs.realpath/old.js"(exports) {
    var pathModule = require("path");
    var isWindows = process.platform === "win32";
    var fs = require("fs");
    var DEBUG = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);
    function rethrow() {
      var callback;
      if (DEBUG) {
        var backtrace = new Error();
        callback = debugCallback;
      } else
        callback = missingCallback;
      return callback;
      function debugCallback(err) {
        if (err) {
          backtrace.message = err.message;
          err = backtrace;
          missingCallback(err);
        }
      }
      function missingCallback(err) {
        if (err) {
          if (process.throwDeprecation)
            throw err;
          else if (!process.noDeprecation) {
            var msg = "fs: missing callback " + (err.stack || err.message);
            if (process.traceDeprecation)
              console.trace(msg);
            else
              console.error(msg);
          }
        }
      }
    }
    function maybeCallback(cb) {
      return typeof cb === "function" ? cb : rethrow();
    }
    var normalize = pathModule.normalize;
    if (isWindows) {
      nextPartRe = /(.*?)(?:[\/\\]+|$)/g;
    } else {
      nextPartRe = /(.*?)(?:[\/]+|$)/g;
    }
    var nextPartRe;
    if (isWindows) {
      splitRootRe = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/;
    } else {
      splitRootRe = /^[\/]*/;
    }
    var splitRootRe;
    exports.realpathSync = function realpathSync(p, cache) {
      p = pathModule.resolve(p);
      if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
        return cache[p];
      }
      var original = p, seenLinks = {}, knownHard = {};
      var pos;
      var current;
      var base;
      var previous;
      start();
      function start() {
        var m = splitRootRe.exec(p);
        pos = m[0].length;
        current = m[0];
        base = m[0];
        previous = "";
        if (isWindows && !knownHard[base]) {
          fs.lstatSync(base);
          knownHard[base] = true;
        }
      }
      while (pos < p.length) {
        nextPartRe.lastIndex = pos;
        var result = nextPartRe.exec(p);
        previous = current;
        current += result[0];
        base = previous + result[1];
        pos = nextPartRe.lastIndex;
        if (knownHard[base] || cache && cache[base] === base) {
          continue;
        }
        var resolvedLink;
        if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
          resolvedLink = cache[base];
        } else {
          var stat = fs.lstatSync(base);
          if (!stat.isSymbolicLink()) {
            knownHard[base] = true;
            if (cache)
              cache[base] = base;
            continue;
          }
          var linkTarget = null;
          if (!isWindows) {
            var id = stat.dev.toString(32) + ":" + stat.ino.toString(32);
            if (seenLinks.hasOwnProperty(id)) {
              linkTarget = seenLinks[id];
            }
          }
          if (linkTarget === null) {
            fs.statSync(base);
            linkTarget = fs.readlinkSync(base);
          }
          resolvedLink = pathModule.resolve(previous, linkTarget);
          if (cache)
            cache[base] = resolvedLink;
          if (!isWindows)
            seenLinks[id] = linkTarget;
        }
        p = pathModule.resolve(resolvedLink, p.slice(pos));
        start();
      }
      if (cache)
        cache[original] = p;
      return p;
    };
    exports.realpath = function realpath(p, cache, cb) {
      if (typeof cb !== "function") {
        cb = maybeCallback(cache);
        cache = null;
      }
      p = pathModule.resolve(p);
      if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
        return process.nextTick(cb.bind(null, null, cache[p]));
      }
      var original = p, seenLinks = {}, knownHard = {};
      var pos;
      var current;
      var base;
      var previous;
      start();
      function start() {
        var m = splitRootRe.exec(p);
        pos = m[0].length;
        current = m[0];
        base = m[0];
        previous = "";
        if (isWindows && !knownHard[base]) {
          fs.lstat(base, function(err) {
            if (err)
              return cb(err);
            knownHard[base] = true;
            LOOP();
          });
        } else {
          process.nextTick(LOOP);
        }
      }
      function LOOP() {
        if (pos >= p.length) {
          if (cache)
            cache[original] = p;
          return cb(null, p);
        }
        nextPartRe.lastIndex = pos;
        var result = nextPartRe.exec(p);
        previous = current;
        current += result[0];
        base = previous + result[1];
        pos = nextPartRe.lastIndex;
        if (knownHard[base] || cache && cache[base] === base) {
          return process.nextTick(LOOP);
        }
        if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
          return gotResolvedLink(cache[base]);
        }
        return fs.lstat(base, gotStat);
      }
      function gotStat(err, stat) {
        if (err)
          return cb(err);
        if (!stat.isSymbolicLink()) {
          knownHard[base] = true;
          if (cache)
            cache[base] = base;
          return process.nextTick(LOOP);
        }
        if (!isWindows) {
          var id = stat.dev.toString(32) + ":" + stat.ino.toString(32);
          if (seenLinks.hasOwnProperty(id)) {
            return gotTarget(null, seenLinks[id], base);
          }
        }
        fs.stat(base, function(err2) {
          if (err2)
            return cb(err2);
          fs.readlink(base, function(err3, target) {
            if (!isWindows)
              seenLinks[id] = target;
            gotTarget(err3, target);
          });
        });
      }
      function gotTarget(err, target, base2) {
        if (err)
          return cb(err);
        var resolvedLink = pathModule.resolve(previous, target);
        if (cache)
          cache[base2] = resolvedLink;
        gotResolvedLink(resolvedLink);
      }
      function gotResolvedLink(resolvedLink) {
        p = pathModule.resolve(resolvedLink, p.slice(pos));
        start();
      }
    };
  }
});

// node_modules/fs.realpath/index.js
var require_fs = __commonJS({
  "node_modules/fs.realpath/index.js"(exports, module2) {
    module2.exports = realpath;
    realpath.realpath = realpath;
    realpath.sync = realpathSync;
    realpath.realpathSync = realpathSync;
    realpath.monkeypatch = monkeypatch;
    realpath.unmonkeypatch = unmonkeypatch;
    var fs = require("fs");
    var origRealpath = fs.realpath;
    var origRealpathSync = fs.realpathSync;
    var version = process.version;
    var ok = /^v[0-5]\./.test(version);
    var old = require_old();
    function newError(er) {
      return er && er.syscall === "realpath" && (er.code === "ELOOP" || er.code === "ENOMEM" || er.code === "ENAMETOOLONG");
    }
    function realpath(p, cache, cb) {
      if (ok) {
        return origRealpath(p, cache, cb);
      }
      if (typeof cache === "function") {
        cb = cache;
        cache = null;
      }
      origRealpath(p, cache, function(er, result) {
        if (newError(er)) {
          old.realpath(p, cache, cb);
        } else {
          cb(er, result);
        }
      });
    }
    function realpathSync(p, cache) {
      if (ok) {
        return origRealpathSync(p, cache);
      }
      try {
        return origRealpathSync(p, cache);
      } catch (er) {
        if (newError(er)) {
          return old.realpathSync(p, cache);
        } else {
          throw er;
        }
      }
    }
    function monkeypatch() {
      fs.realpath = realpath;
      fs.realpathSync = realpathSync;
    }
    function unmonkeypatch() {
      fs.realpath = origRealpath;
      fs.realpathSync = origRealpathSync;
    }
  }
});

// node_modules/concat-map/index.js
var require_concat_map = __commonJS({
  "node_modules/concat-map/index.js"(exports, module2) {
    module2.exports = function(xs, fn) {
      var res = [];
      for (var i = 0; i < xs.length; i++) {
        var x = fn(xs[i], i);
        if (isArray(x))
          res.push.apply(res, x);
        else
          res.push(x);
      }
      return res;
    };
    var isArray = Array.isArray || function(xs) {
      return Object.prototype.toString.call(xs) === "[object Array]";
    };
  }
});

// node_modules/balanced-match/index.js
var require_balanced_match = __commonJS({
  "node_modules/balanced-match/index.js"(exports, module2) {
    "use strict";
    module2.exports = balanced;
    function balanced(a, b, str) {
      if (a instanceof RegExp)
        a = maybeMatch(a, str);
      if (b instanceof RegExp)
        b = maybeMatch(b, str);
      var r = range(a, b, str);
      return r && {
        start: r[0],
        end: r[1],
        pre: str.slice(0, r[0]),
        body: str.slice(r[0] + a.length, r[1]),
        post: str.slice(r[1] + b.length)
      };
    }
    function maybeMatch(reg, str) {
      var m = str.match(reg);
      return m ? m[0] : null;
    }
    balanced.range = range;
    function range(a, b, str) {
      var begs, beg, left, right, result;
      var ai = str.indexOf(a);
      var bi = str.indexOf(b, ai + 1);
      var i = ai;
      if (ai >= 0 && bi > 0) {
        if (a === b) {
          return [ai, bi];
        }
        begs = [];
        left = str.length;
        while (i >= 0 && !result) {
          if (i == ai) {
            begs.push(i);
            ai = str.indexOf(a, i + 1);
          } else if (begs.length == 1) {
            result = [begs.pop(), bi];
          } else {
            beg = begs.pop();
            if (beg < left) {
              left = beg;
              right = bi;
            }
            bi = str.indexOf(b, i + 1);
          }
          i = ai < bi && ai >= 0 ? ai : bi;
        }
        if (begs.length) {
          result = [left, right];
        }
      }
      return result;
    }
  }
});

// node_modules/brace-expansion/index.js
var require_brace_expansion = __commonJS({
  "node_modules/brace-expansion/index.js"(exports, module2) {
    var concatMap = require_concat_map();
    var balanced = require_balanced_match();
    module2.exports = expandTop;
    var escSlash = "\0SLASH" + Math.random() + "\0";
    var escOpen = "\0OPEN" + Math.random() + "\0";
    var escClose = "\0CLOSE" + Math.random() + "\0";
    var escComma = "\0COMMA" + Math.random() + "\0";
    var escPeriod = "\0PERIOD" + Math.random() + "\0";
    function numeric(str) {
      return parseInt(str, 10) == str ? parseInt(str, 10) : str.charCodeAt(0);
    }
    function escapeBraces(str) {
      return str.split("\\\\").join(escSlash).split("\\{").join(escOpen).split("\\}").join(escClose).split("\\,").join(escComma).split("\\.").join(escPeriod);
    }
    function unescapeBraces(str) {
      return str.split(escSlash).join("\\").split(escOpen).join("{").split(escClose).join("}").split(escComma).join(",").split(escPeriod).join(".");
    }
    function parseCommaParts(str) {
      if (!str)
        return [""];
      var parts = [];
      var m = balanced("{", "}", str);
      if (!m)
        return str.split(",");
      var pre = m.pre;
      var body = m.body;
      var post = m.post;
      var p = pre.split(",");
      p[p.length - 1] += "{" + body + "}";
      var postParts = parseCommaParts(post);
      if (post.length) {
        p[p.length - 1] += postParts.shift();
        p.push.apply(p, postParts);
      }
      parts.push.apply(parts, p);
      return parts;
    }
    function expandTop(str) {
      if (!str)
        return [];
      if (str.substr(0, 2) === "{}") {
        str = "\\{\\}" + str.substr(2);
      }
      return expand(escapeBraces(str), true).map(unescapeBraces);
    }
    function embrace(str) {
      return "{" + str + "}";
    }
    function isPadded(el) {
      return /^-?0\d/.test(el);
    }
    function lte(i, y) {
      return i <= y;
    }
    function gte(i, y) {
      return i >= y;
    }
    function expand(str, isTop) {
      var expansions = [];
      var m = balanced("{", "}", str);
      if (!m || /\$$/.test(m.pre))
        return [str];
      var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
      var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
      var isSequence = isNumericSequence || isAlphaSequence;
      var isOptions = m.body.indexOf(",") >= 0;
      if (!isSequence && !isOptions) {
        if (m.post.match(/,.*\}/)) {
          str = m.pre + "{" + m.body + escClose + m.post;
          return expand(str);
        }
        return [str];
      }
      var n;
      if (isSequence) {
        n = m.body.split(/\.\./);
      } else {
        n = parseCommaParts(m.body);
        if (n.length === 1) {
          n = expand(n[0], false).map(embrace);
          if (n.length === 1) {
            var post = m.post.length ? expand(m.post, false) : [""];
            return post.map(function(p) {
              return m.pre + n[0] + p;
            });
          }
        }
      }
      var pre = m.pre;
      var post = m.post.length ? expand(m.post, false) : [""];
      var N;
      if (isSequence) {
        var x = numeric(n[0]);
        var y = numeric(n[1]);
        var width = Math.max(n[0].length, n[1].length);
        var incr = n.length == 3 ? Math.abs(numeric(n[2])) : 1;
        var test = lte;
        var reverse = y < x;
        if (reverse) {
          incr *= -1;
          test = gte;
        }
        var pad = n.some(isPadded);
        N = [];
        for (var i = x; test(i, y); i += incr) {
          var c;
          if (isAlphaSequence) {
            c = String.fromCharCode(i);
            if (c === "\\")
              c = "";
          } else {
            c = String(i);
            if (pad) {
              var need = width - c.length;
              if (need > 0) {
                var z = new Array(need + 1).join("0");
                if (i < 0)
                  c = "-" + z + c.slice(1);
                else
                  c = z + c;
              }
            }
          }
          N.push(c);
        }
      } else {
        N = concatMap(n, function(el) {
          return expand(el, false);
        });
      }
      for (var j = 0; j < N.length; j++) {
        for (var k = 0; k < post.length; k++) {
          var expansion = pre + N[j] + post[k];
          if (!isTop || isSequence || expansion)
            expansions.push(expansion);
        }
      }
      return expansions;
    }
  }
});

// node_modules/minimatch/minimatch.js
var require_minimatch = __commonJS({
  "node_modules/minimatch/minimatch.js"(exports, module2) {
    module2.exports = minimatch;
    minimatch.Minimatch = Minimatch;
    var path = function() {
      try {
        return require("path");
      } catch (e) {
      }
    }() || {
      sep: "/"
    };
    minimatch.sep = path.sep;
    var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {};
    var expand = require_brace_expansion();
    var plTypes = {
      "!": { open: "(?:(?!(?:", close: "))[^/]*?)" },
      "?": { open: "(?:", close: ")?" },
      "+": { open: "(?:", close: ")+" },
      "*": { open: "(?:", close: ")*" },
      "@": { open: "(?:", close: ")" }
    };
    var qmark = "[^/]";
    var star = qmark + "*?";
    var twoStarDot = "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?";
    var twoStarNoDot = "(?:(?!(?:\\/|^)\\.).)*?";
    var reSpecials = charSet("().*{}+?[]^$\\!");
    function charSet(s) {
      return s.split("").reduce(function(set, c) {
        set[c] = true;
        return set;
      }, {});
    }
    var slashSplit = /\/+/;
    minimatch.filter = filter;
    function filter(pattern, options) {
      options = options || {};
      return function(p, i, list) {
        return minimatch(p, pattern, options);
      };
    }
    function ext(a, b) {
      b = b || {};
      var t = {};
      Object.keys(a).forEach(function(k) {
        t[k] = a[k];
      });
      Object.keys(b).forEach(function(k) {
        t[k] = b[k];
      });
      return t;
    }
    minimatch.defaults = function(def) {
      if (!def || typeof def !== "object" || !Object.keys(def).length) {
        return minimatch;
      }
      var orig = minimatch;
      var m = function minimatch2(p, pattern, options) {
        return orig(p, pattern, ext(def, options));
      };
      m.Minimatch = function Minimatch2(pattern, options) {
        return new orig.Minimatch(pattern, ext(def, options));
      };
      m.Minimatch.defaults = function defaults(options) {
        return orig.defaults(ext(def, options)).Minimatch;
      };
      m.filter = function filter2(pattern, options) {
        return orig.filter(pattern, ext(def, options));
      };
      m.defaults = function defaults(options) {
        return orig.defaults(ext(def, options));
      };
      m.makeRe = function makeRe2(pattern, options) {
        return orig.makeRe(pattern, ext(def, options));
      };
      m.braceExpand = function braceExpand2(pattern, options) {
        return orig.braceExpand(pattern, ext(def, options));
      };
      m.match = function(list, pattern, options) {
        return orig.match(list, pattern, ext(def, options));
      };
      return m;
    };
    Minimatch.defaults = function(def) {
      return minimatch.defaults(def).Minimatch;
    };
    function minimatch(p, pattern, options) {
      assertValidPattern(pattern);
      if (!options)
        options = {};
      if (!options.nocomment && pattern.charAt(0) === "#") {
        return false;
      }
      return new Minimatch(pattern, options).match(p);
    }
    function Minimatch(pattern, options) {
      if (!(this instanceof Minimatch)) {
        return new Minimatch(pattern, options);
      }
      assertValidPattern(pattern);
      if (!options)
        options = {};
      pattern = pattern.trim();
      if (!options.allowWindowsEscape && path.sep !== "/") {
        pattern = pattern.split(path.sep).join("/");
      }
      this.options = options;
      this.set = [];
      this.pattern = pattern;
      this.regexp = null;
      this.negate = false;
      this.comment = false;
      this.empty = false;
      this.partial = !!options.partial;
      this.make();
    }
    Minimatch.prototype.debug = function() {
    };
    Minimatch.prototype.make = make;
    function make() {
      var pattern = this.pattern;
      var options = this.options;
      if (!options.nocomment && pattern.charAt(0) === "#") {
        this.comment = true;
        return;
      }
      if (!pattern) {
        this.empty = true;
        return;
      }
      this.parseNegate();
      var set = this.globSet = this.braceExpand();
      if (options.debug)
        this.debug = function debug() {
          console.error.apply(console, arguments);
        };
      this.debug(this.pattern, set);
      set = this.globParts = set.map(function(s) {
        return s.split(slashSplit);
      });
      this.debug(this.pattern, set);
      set = set.map(function(s, si, set2) {
        return s.map(this.parse, this);
      }, this);
      this.debug(this.pattern, set);
      set = set.filter(function(s) {
        return s.indexOf(false) === -1;
      });
      this.debug(this.pattern, set);
      this.set = set;
    }
    Minimatch.prototype.parseNegate = parseNegate;
    function parseNegate() {
      var pattern = this.pattern;
      var negate = false;
      var options = this.options;
      var negateOffset = 0;
      if (options.nonegate)
        return;
      for (var i = 0, l = pattern.length; i < l && pattern.charAt(i) === "!"; i++) {
        negate = !negate;
        negateOffset++;
      }
      if (negateOffset)
        this.pattern = pattern.substr(negateOffset);
      this.negate = negate;
    }
    minimatch.braceExpand = function(pattern, options) {
      return braceExpand(pattern, options);
    };
    Minimatch.prototype.braceExpand = braceExpand;
    function braceExpand(pattern, options) {
      if (!options) {
        if (this instanceof Minimatch) {
          options = this.options;
        } else {
          options = {};
        }
      }
      pattern = typeof pattern === "undefined" ? this.pattern : pattern;
      assertValidPattern(pattern);
      if (options.nobrace || !/\{(?:(?!\{).)*\}/.test(pattern)) {
        return [pattern];
      }
      return expand(pattern);
    }
    var MAX_PATTERN_LENGTH = 1024 * 64;
    var assertValidPattern = function(pattern) {
      if (typeof pattern !== "string") {
        throw new TypeError("invalid pattern");
      }
      if (pattern.length > MAX_PATTERN_LENGTH) {
        throw new TypeError("pattern is too long");
      }
    };
    Minimatch.prototype.parse = parse;
    var SUBPARSE = {};
    function parse(pattern, isSub) {
      assertValidPattern(pattern);
      var options = this.options;
      if (pattern === "**") {
        if (!options.noglobstar)
          return GLOBSTAR;
        else
          pattern = "*";
      }
      if (pattern === "")
        return "";
      var re = "";
      var hasMagic = !!options.nocase;
      var escaping = false;
      var patternListStack = [];
      var negativeLists = [];
      var stateChar;
      var inClass = false;
      var reClassStart = -1;
      var classStart = -1;
      var patternStart = pattern.charAt(0) === "." ? "" : options.dot ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))" : "(?!\\.)";
      var self = this;
      function clearStateChar() {
        if (stateChar) {
          switch (stateChar) {
            case "*":
              re += star;
              hasMagic = true;
              break;
            case "?":
              re += qmark;
              hasMagic = true;
              break;
            default:
              re += "\\" + stateChar;
              break;
          }
          self.debug("clearStateChar %j %j", stateChar, re);
          stateChar = false;
        }
      }
      for (var i = 0, len = pattern.length, c; i < len && (c = pattern.charAt(i)); i++) {
        this.debug("%s	%s %s %j", pattern, i, re, c);
        if (escaping && reSpecials[c]) {
          re += "\\" + c;
          escaping = false;
          continue;
        }
        switch (c) {
          case "/": {
            return false;
          }
          case "\\":
            clearStateChar();
            escaping = true;
            continue;
          case "?":
          case "*":
          case "+":
          case "@":
          case "!":
            this.debug("%s	%s %s %j <-- stateChar", pattern, i, re, c);
            if (inClass) {
              this.debug("  in class");
              if (c === "!" && i === classStart + 1)
                c = "^";
              re += c;
              continue;
            }
            self.debug("call clearStateChar %j", stateChar);
            clearStateChar();
            stateChar = c;
            if (options.noext)
              clearStateChar();
            continue;
          case "(":
            if (inClass) {
              re += "(";
              continue;
            }
            if (!stateChar) {
              re += "\\(";
              continue;
            }
            patternListStack.push({
              type: stateChar,
              start: i - 1,
              reStart: re.length,
              open: plTypes[stateChar].open,
              close: plTypes[stateChar].close
            });
            re += stateChar === "!" ? "(?:(?!(?:" : "(?:";
            this.debug("plType %j %j", stateChar, re);
            stateChar = false;
            continue;
          case ")":
            if (inClass || !patternListStack.length) {
              re += "\\)";
              continue;
            }
            clearStateChar();
            hasMagic = true;
            var pl = patternListStack.pop();
            re += pl.close;
            if (pl.type === "!") {
              negativeLists.push(pl);
            }
            pl.reEnd = re.length;
            continue;
          case "|":
            if (inClass || !patternListStack.length || escaping) {
              re += "\\|";
              escaping = false;
              continue;
            }
            clearStateChar();
            re += "|";
            continue;
          case "[":
            clearStateChar();
            if (inClass) {
              re += "\\" + c;
              continue;
            }
            inClass = true;
            classStart = i;
            reClassStart = re.length;
            re += c;
            continue;
          case "]":
            if (i === classStart + 1 || !inClass) {
              re += "\\" + c;
              escaping = false;
              continue;
            }
            var cs = pattern.substring(classStart + 1, i);
            try {
              RegExp("[" + cs + "]");
            } catch (er) {
              var sp = this.parse(cs, SUBPARSE);
              re = re.substr(0, reClassStart) + "\\[" + sp[0] + "\\]";
              hasMagic = hasMagic || sp[1];
              inClass = false;
              continue;
            }
            hasMagic = true;
            inClass = false;
            re += c;
            continue;
          default:
            clearStateChar();
            if (escaping) {
              escaping = false;
            } else if (reSpecials[c] && !(c === "^" && inClass)) {
              re += "\\";
            }
            re += c;
        }
      }
      if (inClass) {
        cs = pattern.substr(classStart + 1);
        sp = this.parse(cs, SUBPARSE);
        re = re.substr(0, reClassStart) + "\\[" + sp[0];
        hasMagic = hasMagic || sp[1];
      }
      for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
        var tail = re.slice(pl.reStart + pl.open.length);
        this.debug("setting tail", re, pl);
        tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function(_, $1, $2) {
          if (!$2) {
            $2 = "\\";
          }
          return $1 + $1 + $2 + "|";
        });
        this.debug("tail=%j\n   %s", tail, tail, pl, re);
        var t = pl.type === "*" ? star : pl.type === "?" ? qmark : "\\" + pl.type;
        hasMagic = true;
        re = re.slice(0, pl.reStart) + t + "\\(" + tail;
      }
      clearStateChar();
      if (escaping) {
        re += "\\\\";
      }
      var addPatternStart = false;
      switch (re.charAt(0)) {
        case "[":
        case ".":
        case "(":
          addPatternStart = true;
      }
      for (var n = negativeLists.length - 1; n > -1; n--) {
        var nl = negativeLists[n];
        var nlBefore = re.slice(0, nl.reStart);
        var nlFirst = re.slice(nl.reStart, nl.reEnd - 8);
        var nlLast = re.slice(nl.reEnd - 8, nl.reEnd);
        var nlAfter = re.slice(nl.reEnd);
        nlLast += nlAfter;
        var openParensBefore = nlBefore.split("(").length - 1;
        var cleanAfter = nlAfter;
        for (i = 0; i < openParensBefore; i++) {
          cleanAfter = cleanAfter.replace(/\)[+*?]?/, "");
        }
        nlAfter = cleanAfter;
        var dollar = "";
        if (nlAfter === "" && isSub !== SUBPARSE) {
          dollar = "$";
        }
        var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast;
        re = newRe;
      }
      if (re !== "" && hasMagic) {
        re = "(?=.)" + re;
      }
      if (addPatternStart) {
        re = patternStart + re;
      }
      if (isSub === SUBPARSE) {
        return [re, hasMagic];
      }
      if (!hasMagic) {
        return globUnescape(pattern);
      }
      var flags = options.nocase ? "i" : "";
      try {
        var regExp = new RegExp("^" + re + "$", flags);
      } catch (er) {
        return new RegExp("$.");
      }
      regExp._glob = pattern;
      regExp._src = re;
      return regExp;
    }
    minimatch.makeRe = function(pattern, options) {
      return new Minimatch(pattern, options || {}).makeRe();
    };
    Minimatch.prototype.makeRe = makeRe;
    function makeRe() {
      if (this.regexp || this.regexp === false)
        return this.regexp;
      var set = this.set;
      if (!set.length) {
        this.regexp = false;
        return this.regexp;
      }
      var options = this.options;
      var twoStar = options.noglobstar ? star : options.dot ? twoStarDot : twoStarNoDot;
      var flags = options.nocase ? "i" : "";
      var re = set.map(function(pattern) {
        return pattern.map(function(p) {
          return p === GLOBSTAR ? twoStar : typeof p === "string" ? regExpEscape(p) : p._src;
        }).join("\\/");
      }).join("|");
      re = "^(?:" + re + ")$";
      if (this.negate)
        re = "^(?!" + re + ").*$";
      try {
        this.regexp = new RegExp(re, flags);
      } catch (ex) {
        this.regexp = false;
      }
      return this.regexp;
    }
    minimatch.match = function(list, pattern, options) {
      options = options || {};
      var mm = new Minimatch(pattern, options);
      list = list.filter(function(f) {
        return mm.match(f);
      });
      if (mm.options.nonull && !list.length) {
        list.push(pattern);
      }
      return list;
    };
    Minimatch.prototype.match = function match(f, partial) {
      if (typeof partial === "undefined")
        partial = this.partial;
      this.debug("match", f, this.pattern);
      if (this.comment)
        return false;
      if (this.empty)
        return f === "";
      if (f === "/" && partial)
        return true;
      var options = this.options;
      if (path.sep !== "/") {
        f = f.split(path.sep).join("/");
      }
      f = f.split(slashSplit);
      this.debug(this.pattern, "split", f);
      var set = this.set;
      this.debug(this.pattern, "set", set);
      var filename;
      var i;
      for (i = f.length - 1; i >= 0; i--) {
        filename = f[i];
        if (filename)
          break;
      }
      for (i = 0; i < set.length; i++) {
        var pattern = set[i];
        var file = f;
        if (options.matchBase && pattern.length === 1) {
          file = [filename];
        }
        var hit = this.matchOne(file, pattern, partial);
        if (hit) {
          if (options.flipNegate)
            return true;
          return !this.negate;
        }
      }
      if (options.flipNegate)
        return false;
      return this.negate;
    };
    Minimatch.prototype.matchOne = function(file, pattern, partial) {
      var options = this.options;
      this.debug(
        "matchOne",
        { "this": this, file, pattern }
      );
      this.debug("matchOne", file.length, pattern.length);
      for (var fi = 0, pi = 0, fl = file.length, pl = pattern.length; fi < fl && pi < pl; fi++, pi++) {
        this.debug("matchOne loop");
        var p = pattern[pi];
        var f = file[fi];
        this.debug(pattern, p, f);
        if (p === false)
          return false;
        if (p === GLOBSTAR) {
          this.debug("GLOBSTAR", [pattern, p, f]);
          var fr = fi;
          var pr = pi + 1;
          if (pr === pl) {
            this.debug("** at the end");
            for (; fi < fl; fi++) {
              if (file[fi] === "." || file[fi] === ".." || !options.dot && file[fi].charAt(0) === ".")
                return false;
            }
            return true;
          }
          while (fr < fl) {
            var swallowee = file[fr];
            this.debug("\nglobstar while", file, fr, pattern, pr, swallowee);
            if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
              this.debug("globstar found match!", fr, fl, swallowee);
              return true;
            } else {
              if (swallowee === "." || swallowee === ".." || !options.dot && swallowee.charAt(0) === ".") {
                this.debug("dot detected!", file, fr, pattern, pr);
                break;
              }
              this.debug("globstar swallow a segment, and continue");
              fr++;
            }
          }
          if (partial) {
            this.debug("\n>>> no match, partial?", file, fr, pattern, pr);
            if (fr === fl)
              return true;
          }
          return false;
        }
        var hit;
        if (typeof p === "string") {
          hit = f === p;
          this.debug("string match", p, f, hit);
        } else {
          hit = f.match(p);
          this.debug("pattern match", p, f, hit);
        }
        if (!hit)
          return false;
      }
      if (fi === fl && pi === pl) {
        return true;
      } else if (fi === fl) {
        return partial;
      } else if (pi === pl) {
        return fi === fl - 1 && file[fi] === "";
      }
      throw new Error("wtf?");
    };
    function globUnescape(s) {
      return s.replace(/\\(.)/g, "$1");
    }
    function regExpEscape(s) {
      return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }
  }
});

// node_modules/inherits/inherits_browser.js
var require_inherits_browser = __commonJS({
  "node_modules/inherits/inherits_browser.js"(exports, module2) {
    if (typeof Object.create === "function") {
      module2.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
        }
      };
    } else {
      module2.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function() {
          };
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        }
      };
    }
  }
});

// node_modules/inherits/inherits.js
var require_inherits = __commonJS({
  "node_modules/inherits/inherits.js"(exports, module2) {
    try {
      util = require("util");
      if (typeof util.inherits !== "function")
        throw "";
      module2.exports = util.inherits;
    } catch (e) {
      module2.exports = require_inherits_browser();
    }
    var util;
  }
});

// node_modules/path-is-absolute/index.js
var require_path_is_absolute = __commonJS({
  "node_modules/path-is-absolute/index.js"(exports, module2) {
    "use strict";
    function posix(path) {
      return path.charAt(0) === "/";
    }
    function win32(path) {
      var splitDeviceRe = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;
      var result = splitDeviceRe.exec(path);
      var device = result[1] || "";
      var isUnc = Boolean(device && device.charAt(1) !== ":");
      return Boolean(result[2] || isUnc);
    }
    module2.exports = process.platform === "win32" ? win32 : posix;
    module2.exports.posix = posix;
    module2.exports.win32 = win32;
  }
});

// node_modules/glob/common.js
var require_common = __commonJS({
  "node_modules/glob/common.js"(exports) {
    exports.setopts = setopts;
    exports.ownProp = ownProp;
    exports.makeAbs = makeAbs;
    exports.finish = finish;
    exports.mark = mark;
    exports.isIgnored = isIgnored;
    exports.childrenIgnored = childrenIgnored;
    function ownProp(obj, field) {
      return Object.prototype.hasOwnProperty.call(obj, field);
    }
    var fs = require("fs");
    var path = require("path");
    var minimatch = require_minimatch();
    var isAbsolute = require_path_is_absolute();
    var Minimatch = minimatch.Minimatch;
    function alphasort(a, b) {
      return a.localeCompare(b, "en");
    }
    function setupIgnores(self, options) {
      self.ignore = options.ignore || [];
      if (!Array.isArray(self.ignore))
        self.ignore = [self.ignore];
      if (self.ignore.length) {
        self.ignore = self.ignore.map(ignoreMap);
      }
    }
    function ignoreMap(pattern) {
      var gmatcher = null;
      if (pattern.slice(-3) === "/**") {
        var gpattern = pattern.replace(/(\/\*\*)+$/, "");
        gmatcher = new Minimatch(gpattern, { dot: true });
      }
      return {
        matcher: new Minimatch(pattern, { dot: true }),
        gmatcher
      };
    }
    function setopts(self, pattern, options) {
      if (!options)
        options = {};
      if (options.matchBase && -1 === pattern.indexOf("/")) {
        if (options.noglobstar) {
          throw new Error("base matching requires globstar");
        }
        pattern = "**/" + pattern;
      }
      self.silent = !!options.silent;
      self.pattern = pattern;
      self.strict = options.strict !== false;
      self.realpath = !!options.realpath;
      self.realpathCache = options.realpathCache || /* @__PURE__ */ Object.create(null);
      self.follow = !!options.follow;
      self.dot = !!options.dot;
      self.mark = !!options.mark;
      self.nodir = !!options.nodir;
      if (self.nodir)
        self.mark = true;
      self.sync = !!options.sync;
      self.nounique = !!options.nounique;
      self.nonull = !!options.nonull;
      self.nosort = !!options.nosort;
      self.nocase = !!options.nocase;
      self.stat = !!options.stat;
      self.noprocess = !!options.noprocess;
      self.absolute = !!options.absolute;
      self.fs = options.fs || fs;
      self.maxLength = options.maxLength || Infinity;
      self.cache = options.cache || /* @__PURE__ */ Object.create(null);
      self.statCache = options.statCache || /* @__PURE__ */ Object.create(null);
      self.symlinks = options.symlinks || /* @__PURE__ */ Object.create(null);
      setupIgnores(self, options);
      self.changedCwd = false;
      var cwd = process.cwd();
      if (!ownProp(options, "cwd"))
        self.cwd = cwd;
      else {
        self.cwd = path.resolve(options.cwd);
        self.changedCwd = self.cwd !== cwd;
      }
      self.root = options.root || path.resolve(self.cwd, "/");
      self.root = path.resolve(self.root);
      if (process.platform === "win32")
        self.root = self.root.replace(/\\/g, "/");
      self.cwdAbs = isAbsolute(self.cwd) ? self.cwd : makeAbs(self, self.cwd);
      if (process.platform === "win32")
        self.cwdAbs = self.cwdAbs.replace(/\\/g, "/");
      self.nomount = !!options.nomount;
      options.nonegate = true;
      options.nocomment = true;
      options.allowWindowsEscape = false;
      self.minimatch = new Minimatch(pattern, options);
      self.options = self.minimatch.options;
    }
    function finish(self) {
      var nou = self.nounique;
      var all = nou ? [] : /* @__PURE__ */ Object.create(null);
      for (var i = 0, l = self.matches.length; i < l; i++) {
        var matches = self.matches[i];
        if (!matches || Object.keys(matches).length === 0) {
          if (self.nonull) {
            var literal = self.minimatch.globSet[i];
            if (nou)
              all.push(literal);
            else
              all[literal] = true;
          }
        } else {
          var m = Object.keys(matches);
          if (nou)
            all.push.apply(all, m);
          else
            m.forEach(function(m2) {
              all[m2] = true;
            });
        }
      }
      if (!nou)
        all = Object.keys(all);
      if (!self.nosort)
        all = all.sort(alphasort);
      if (self.mark) {
        for (var i = 0; i < all.length; i++) {
          all[i] = self._mark(all[i]);
        }
        if (self.nodir) {
          all = all.filter(function(e) {
            var notDir = !/\/$/.test(e);
            var c = self.cache[e] || self.cache[makeAbs(self, e)];
            if (notDir && c)
              notDir = c !== "DIR" && !Array.isArray(c);
            return notDir;
          });
        }
      }
      if (self.ignore.length)
        all = all.filter(function(m2) {
          return !isIgnored(self, m2);
        });
      self.found = all;
    }
    function mark(self, p) {
      var abs = makeAbs(self, p);
      var c = self.cache[abs];
      var m = p;
      if (c) {
        var isDir = c === "DIR" || Array.isArray(c);
        var slash = p.slice(-1) === "/";
        if (isDir && !slash)
          m += "/";
        else if (!isDir && slash)
          m = m.slice(0, -1);
        if (m !== p) {
          var mabs = makeAbs(self, m);
          self.statCache[mabs] = self.statCache[abs];
          self.cache[mabs] = self.cache[abs];
        }
      }
      return m;
    }
    function makeAbs(self, f) {
      var abs = f;
      if (f.charAt(0) === "/") {
        abs = path.join(self.root, f);
      } else if (isAbsolute(f) || f === "") {
        abs = f;
      } else if (self.changedCwd) {
        abs = path.resolve(self.cwd, f);
      } else {
        abs = path.resolve(f);
      }
      if (process.platform === "win32")
        abs = abs.replace(/\\/g, "/");
      return abs;
    }
    function isIgnored(self, path2) {
      if (!self.ignore.length)
        return false;
      return self.ignore.some(function(item) {
        return item.matcher.match(path2) || !!(item.gmatcher && item.gmatcher.match(path2));
      });
    }
    function childrenIgnored(self, path2) {
      if (!self.ignore.length)
        return false;
      return self.ignore.some(function(item) {
        return !!(item.gmatcher && item.gmatcher.match(path2));
      });
    }
  }
});

// node_modules/glob/sync.js
var require_sync = __commonJS({
  "node_modules/glob/sync.js"(exports, module2) {
    module2.exports = globSync;
    globSync.GlobSync = GlobSync;
    var rp = require_fs();
    var minimatch = require_minimatch();
    var Minimatch = minimatch.Minimatch;
    var Glob = require_glob().Glob;
    var util = require("util");
    var path = require("path");
    var assert = require("assert");
    var isAbsolute = require_path_is_absolute();
    var common = require_common();
    var setopts = common.setopts;
    var ownProp = common.ownProp;
    var childrenIgnored = common.childrenIgnored;
    var isIgnored = common.isIgnored;
    function globSync(pattern, options) {
      if (typeof options === "function" || arguments.length === 3)
        throw new TypeError("callback provided to sync glob\nSee: https://github.com/isaacs/node-glob/issues/167");
      return new GlobSync(pattern, options).found;
    }
    function GlobSync(pattern, options) {
      if (!pattern)
        throw new Error("must provide pattern");
      if (typeof options === "function" || arguments.length === 3)
        throw new TypeError("callback provided to sync glob\nSee: https://github.com/isaacs/node-glob/issues/167");
      if (!(this instanceof GlobSync))
        return new GlobSync(pattern, options);
      setopts(this, pattern, options);
      if (this.noprocess)
        return this;
      var n = this.minimatch.set.length;
      this.matches = new Array(n);
      for (var i = 0; i < n; i++) {
        this._process(this.minimatch.set[i], i, false);
      }
      this._finish();
    }
    GlobSync.prototype._finish = function() {
      assert.ok(this instanceof GlobSync);
      if (this.realpath) {
        var self = this;
        this.matches.forEach(function(matchset, index) {
          var set = self.matches[index] = /* @__PURE__ */ Object.create(null);
          for (var p in matchset) {
            try {
              p = self._makeAbs(p);
              var real = rp.realpathSync(p, self.realpathCache);
              set[real] = true;
            } catch (er) {
              if (er.syscall === "stat")
                set[self._makeAbs(p)] = true;
              else
                throw er;
            }
          }
        });
      }
      common.finish(this);
    };
    GlobSync.prototype._process = function(pattern, index, inGlobStar) {
      assert.ok(this instanceof GlobSync);
      var n = 0;
      while (typeof pattern[n] === "string") {
        n++;
      }
      var prefix;
      switch (n) {
        case pattern.length:
          this._processSimple(pattern.join("/"), index);
          return;
        case 0:
          prefix = null;
          break;
        default:
          prefix = pattern.slice(0, n).join("/");
          break;
      }
      var remain = pattern.slice(n);
      var read;
      if (prefix === null)
        read = ".";
      else if (isAbsolute(prefix) || isAbsolute(pattern.map(function(p) {
        return typeof p === "string" ? p : "[*]";
      }).join("/"))) {
        if (!prefix || !isAbsolute(prefix))
          prefix = "/" + prefix;
        read = prefix;
      } else
        read = prefix;
      var abs = this._makeAbs(read);
      if (childrenIgnored(this, read))
        return;
      var isGlobStar = remain[0] === minimatch.GLOBSTAR;
      if (isGlobStar)
        this._processGlobStar(prefix, read, abs, remain, index, inGlobStar);
      else
        this._processReaddir(prefix, read, abs, remain, index, inGlobStar);
    };
    GlobSync.prototype._processReaddir = function(prefix, read, abs, remain, index, inGlobStar) {
      var entries = this._readdir(abs, inGlobStar);
      if (!entries)
        return;
      var pn = remain[0];
      var negate = !!this.minimatch.negate;
      var rawGlob = pn._glob;
      var dotOk = this.dot || rawGlob.charAt(0) === ".";
      var matchedEntries = [];
      for (var i = 0; i < entries.length; i++) {
        var e = entries[i];
        if (e.charAt(0) !== "." || dotOk) {
          var m;
          if (negate && !prefix) {
            m = !e.match(pn);
          } else {
            m = e.match(pn);
          }
          if (m)
            matchedEntries.push(e);
        }
      }
      var len = matchedEntries.length;
      if (len === 0)
        return;
      if (remain.length === 1 && !this.mark && !this.stat) {
        if (!this.matches[index])
          this.matches[index] = /* @__PURE__ */ Object.create(null);
        for (var i = 0; i < len; i++) {
          var e = matchedEntries[i];
          if (prefix) {
            if (prefix.slice(-1) !== "/")
              e = prefix + "/" + e;
            else
              e = prefix + e;
          }
          if (e.charAt(0) === "/" && !this.nomount) {
            e = path.join(this.root, e);
          }
          this._emitMatch(index, e);
        }
        return;
      }
      remain.shift();
      for (var i = 0; i < len; i++) {
        var e = matchedEntries[i];
        var newPattern;
        if (prefix)
          newPattern = [prefix, e];
        else
          newPattern = [e];
        this._process(newPattern.concat(remain), index, inGlobStar);
      }
    };
    GlobSync.prototype._emitMatch = function(index, e) {
      if (isIgnored(this, e))
        return;
      var abs = this._makeAbs(e);
      if (this.mark)
        e = this._mark(e);
      if (this.absolute) {
        e = abs;
      }
      if (this.matches[index][e])
        return;
      if (this.nodir) {
        var c = this.cache[abs];
        if (c === "DIR" || Array.isArray(c))
          return;
      }
      this.matches[index][e] = true;
      if (this.stat)
        this._stat(e);
    };
    GlobSync.prototype._readdirInGlobStar = function(abs) {
      if (this.follow)
        return this._readdir(abs, false);
      var entries;
      var lstat;
      var stat;
      try {
        lstat = this.fs.lstatSync(abs);
      } catch (er) {
        if (er.code === "ENOENT") {
          return null;
        }
      }
      var isSym = lstat && lstat.isSymbolicLink();
      this.symlinks[abs] = isSym;
      if (!isSym && lstat && !lstat.isDirectory())
        this.cache[abs] = "FILE";
      else
        entries = this._readdir(abs, false);
      return entries;
    };
    GlobSync.prototype._readdir = function(abs, inGlobStar) {
      var entries;
      if (inGlobStar && !ownProp(this.symlinks, abs))
        return this._readdirInGlobStar(abs);
      if (ownProp(this.cache, abs)) {
        var c = this.cache[abs];
        if (!c || c === "FILE")
          return null;
        if (Array.isArray(c))
          return c;
      }
      try {
        return this._readdirEntries(abs, this.fs.readdirSync(abs));
      } catch (er) {
        this._readdirError(abs, er);
        return null;
      }
    };
    GlobSync.prototype._readdirEntries = function(abs, entries) {
      if (!this.mark && !this.stat) {
        for (var i = 0; i < entries.length; i++) {
          var e = entries[i];
          if (abs === "/")
            e = abs + e;
          else
            e = abs + "/" + e;
          this.cache[e] = true;
        }
      }
      this.cache[abs] = entries;
      return entries;
    };
    GlobSync.prototype._readdirError = function(f, er) {
      switch (er.code) {
        case "ENOTSUP":
        case "ENOTDIR":
          var abs = this._makeAbs(f);
          this.cache[abs] = "FILE";
          if (abs === this.cwdAbs) {
            var error = new Error(er.code + " invalid cwd " + this.cwd);
            error.path = this.cwd;
            error.code = er.code;
            throw error;
          }
          break;
        case "ENOENT":
        case "ELOOP":
        case "ENAMETOOLONG":
        case "UNKNOWN":
          this.cache[this._makeAbs(f)] = false;
          break;
        default:
          this.cache[this._makeAbs(f)] = false;
          if (this.strict)
            throw er;
          if (!this.silent)
            console.error("glob error", er);
          break;
      }
    };
    GlobSync.prototype._processGlobStar = function(prefix, read, abs, remain, index, inGlobStar) {
      var entries = this._readdir(abs, inGlobStar);
      if (!entries)
        return;
      var remainWithoutGlobStar = remain.slice(1);
      var gspref = prefix ? [prefix] : [];
      var noGlobStar = gspref.concat(remainWithoutGlobStar);
      this._process(noGlobStar, index, false);
      var len = entries.length;
      var isSym = this.symlinks[abs];
      if (isSym && inGlobStar)
        return;
      for (var i = 0; i < len; i++) {
        var e = entries[i];
        if (e.charAt(0) === "." && !this.dot)
          continue;
        var instead = gspref.concat(entries[i], remainWithoutGlobStar);
        this._process(instead, index, true);
        var below = gspref.concat(entries[i], remain);
        this._process(below, index, true);
      }
    };
    GlobSync.prototype._processSimple = function(prefix, index) {
      var exists = this._stat(prefix);
      if (!this.matches[index])
        this.matches[index] = /* @__PURE__ */ Object.create(null);
      if (!exists)
        return;
      if (prefix && isAbsolute(prefix) && !this.nomount) {
        var trail = /[\/\\]$/.test(prefix);
        if (prefix.charAt(0) === "/") {
          prefix = path.join(this.root, prefix);
        } else {
          prefix = path.resolve(this.root, prefix);
          if (trail)
            prefix += "/";
        }
      }
      if (process.platform === "win32")
        prefix = prefix.replace(/\\/g, "/");
      this._emitMatch(index, prefix);
    };
    GlobSync.prototype._stat = function(f) {
      var abs = this._makeAbs(f);
      var needDir = f.slice(-1) === "/";
      if (f.length > this.maxLength)
        return false;
      if (!this.stat && ownProp(this.cache, abs)) {
        var c = this.cache[abs];
        if (Array.isArray(c))
          c = "DIR";
        if (!needDir || c === "DIR")
          return c;
        if (needDir && c === "FILE")
          return false;
      }
      var exists;
      var stat = this.statCache[abs];
      if (!stat) {
        var lstat;
        try {
          lstat = this.fs.lstatSync(abs);
        } catch (er) {
          if (er && (er.code === "ENOENT" || er.code === "ENOTDIR")) {
            this.statCache[abs] = false;
            return false;
          }
        }
        if (lstat && lstat.isSymbolicLink()) {
          try {
            stat = this.fs.statSync(abs);
          } catch (er) {
            stat = lstat;
          }
        } else {
          stat = lstat;
        }
      }
      this.statCache[abs] = stat;
      var c = true;
      if (stat)
        c = stat.isDirectory() ? "DIR" : "FILE";
      this.cache[abs] = this.cache[abs] || c;
      if (needDir && c === "FILE")
        return false;
      return c;
    };
    GlobSync.prototype._mark = function(p) {
      return common.mark(this, p);
    };
    GlobSync.prototype._makeAbs = function(f) {
      return common.makeAbs(this, f);
    };
  }
});

// node_modules/wrappy/wrappy.js
var require_wrappy = __commonJS({
  "node_modules/wrappy/wrappy.js"(exports, module2) {
    module2.exports = wrappy;
    function wrappy(fn, cb) {
      if (fn && cb)
        return wrappy(fn)(cb);
      if (typeof fn !== "function")
        throw new TypeError("need wrapper function");
      Object.keys(fn).forEach(function(k) {
        wrapper[k] = fn[k];
      });
      return wrapper;
      function wrapper() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        var ret = fn.apply(this, args);
        var cb2 = args[args.length - 1];
        if (typeof ret === "function" && ret !== cb2) {
          Object.keys(cb2).forEach(function(k) {
            ret[k] = cb2[k];
          });
        }
        return ret;
      }
    }
  }
});

// node_modules/once/once.js
var require_once = __commonJS({
  "node_modules/once/once.js"(exports, module2) {
    var wrappy = require_wrappy();
    module2.exports = wrappy(once);
    module2.exports.strict = wrappy(onceStrict);
    once.proto = once(function() {
      Object.defineProperty(Function.prototype, "once", {
        value: function() {
          return once(this);
        },
        configurable: true
      });
      Object.defineProperty(Function.prototype, "onceStrict", {
        value: function() {
          return onceStrict(this);
        },
        configurable: true
      });
    });
    function once(fn) {
      var f = function() {
        if (f.called)
          return f.value;
        f.called = true;
        return f.value = fn.apply(this, arguments);
      };
      f.called = false;
      return f;
    }
    function onceStrict(fn) {
      var f = function() {
        if (f.called)
          throw new Error(f.onceError);
        f.called = true;
        return f.value = fn.apply(this, arguments);
      };
      var name = fn.name || "Function wrapped with `once`";
      f.onceError = name + " shouldn't be called more than once";
      f.called = false;
      return f;
    }
  }
});

// node_modules/inflight/inflight.js
var require_inflight = __commonJS({
  "node_modules/inflight/inflight.js"(exports, module2) {
    var wrappy = require_wrappy();
    var reqs = /* @__PURE__ */ Object.create(null);
    var once = require_once();
    module2.exports = wrappy(inflight);
    function inflight(key, cb) {
      if (reqs[key]) {
        reqs[key].push(cb);
        return null;
      } else {
        reqs[key] = [cb];
        return makeres(key);
      }
    }
    function makeres(key) {
      return once(function RES() {
        var cbs = reqs[key];
        var len = cbs.length;
        var args = slice(arguments);
        try {
          for (var i = 0; i < len; i++) {
            cbs[i].apply(null, args);
          }
        } finally {
          if (cbs.length > len) {
            cbs.splice(0, len);
            process.nextTick(function() {
              RES.apply(null, args);
            });
          } else {
            delete reqs[key];
          }
        }
      });
    }
    function slice(args) {
      var length = args.length;
      var array = [];
      for (var i = 0; i < length; i++)
        array[i] = args[i];
      return array;
    }
  }
});

// node_modules/glob/glob.js
var require_glob = __commonJS({
  "node_modules/glob/glob.js"(exports, module2) {
    module2.exports = glob;
    var rp = require_fs();
    var minimatch = require_minimatch();
    var Minimatch = minimatch.Minimatch;
    var inherits = require_inherits();
    var EE = require("events").EventEmitter;
    var path = require("path");
    var assert = require("assert");
    var isAbsolute = require_path_is_absolute();
    var globSync = require_sync();
    var common = require_common();
    var setopts = common.setopts;
    var ownProp = common.ownProp;
    var inflight = require_inflight();
    var util = require("util");
    var childrenIgnored = common.childrenIgnored;
    var isIgnored = common.isIgnored;
    var once = require_once();
    function glob(pattern, options, cb) {
      if (typeof options === "function")
        cb = options, options = {};
      if (!options)
        options = {};
      if (options.sync) {
        if (cb)
          throw new TypeError("callback provided to sync glob");
        return globSync(pattern, options);
      }
      return new Glob(pattern, options, cb);
    }
    glob.sync = globSync;
    var GlobSync = glob.GlobSync = globSync.GlobSync;
    glob.glob = glob;
    function extend(origin, add) {
      if (add === null || typeof add !== "object") {
        return origin;
      }
      var keys = Object.keys(add);
      var i = keys.length;
      while (i--) {
        origin[keys[i]] = add[keys[i]];
      }
      return origin;
    }
    glob.hasMagic = function(pattern, options_) {
      var options = extend({}, options_);
      options.noprocess = true;
      var g = new Glob(pattern, options);
      var set = g.minimatch.set;
      if (!pattern)
        return false;
      if (set.length > 1)
        return true;
      for (var j = 0; j < set[0].length; j++) {
        if (typeof set[0][j] !== "string")
          return true;
      }
      return false;
    };
    glob.Glob = Glob;
    inherits(Glob, EE);
    function Glob(pattern, options, cb) {
      if (typeof options === "function") {
        cb = options;
        options = null;
      }
      if (options && options.sync) {
        if (cb)
          throw new TypeError("callback provided to sync glob");
        return new GlobSync(pattern, options);
      }
      if (!(this instanceof Glob))
        return new Glob(pattern, options, cb);
      setopts(this, pattern, options);
      this._didRealPath = false;
      var n = this.minimatch.set.length;
      this.matches = new Array(n);
      if (typeof cb === "function") {
        cb = once(cb);
        this.on("error", cb);
        this.on("end", function(matches) {
          cb(null, matches);
        });
      }
      var self = this;
      this._processing = 0;
      this._emitQueue = [];
      this._processQueue = [];
      this.paused = false;
      if (this.noprocess)
        return this;
      if (n === 0)
        return done();
      var sync = true;
      for (var i = 0; i < n; i++) {
        this._process(this.minimatch.set[i], i, false, done);
      }
      sync = false;
      function done() {
        --self._processing;
        if (self._processing <= 0) {
          if (sync) {
            process.nextTick(function() {
              self._finish();
            });
          } else {
            self._finish();
          }
        }
      }
    }
    Glob.prototype._finish = function() {
      assert(this instanceof Glob);
      if (this.aborted)
        return;
      if (this.realpath && !this._didRealpath)
        return this._realpath();
      common.finish(this);
      this.emit("end", this.found);
    };
    Glob.prototype._realpath = function() {
      if (this._didRealpath)
        return;
      this._didRealpath = true;
      var n = this.matches.length;
      if (n === 0)
        return this._finish();
      var self = this;
      for (var i = 0; i < this.matches.length; i++)
        this._realpathSet(i, next);
      function next() {
        if (--n === 0)
          self._finish();
      }
    };
    Glob.prototype._realpathSet = function(index, cb) {
      var matchset = this.matches[index];
      if (!matchset)
        return cb();
      var found = Object.keys(matchset);
      var self = this;
      var n = found.length;
      if (n === 0)
        return cb();
      var set = this.matches[index] = /* @__PURE__ */ Object.create(null);
      found.forEach(function(p, i) {
        p = self._makeAbs(p);
        rp.realpath(p, self.realpathCache, function(er, real) {
          if (!er)
            set[real] = true;
          else if (er.syscall === "stat")
            set[p] = true;
          else
            self.emit("error", er);
          if (--n === 0) {
            self.matches[index] = set;
            cb();
          }
        });
      });
    };
    Glob.prototype._mark = function(p) {
      return common.mark(this, p);
    };
    Glob.prototype._makeAbs = function(f) {
      return common.makeAbs(this, f);
    };
    Glob.prototype.abort = function() {
      this.aborted = true;
      this.emit("abort");
    };
    Glob.prototype.pause = function() {
      if (!this.paused) {
        this.paused = true;
        this.emit("pause");
      }
    };
    Glob.prototype.resume = function() {
      if (this.paused) {
        this.emit("resume");
        this.paused = false;
        if (this._emitQueue.length) {
          var eq = this._emitQueue.slice(0);
          this._emitQueue.length = 0;
          for (var i = 0; i < eq.length; i++) {
            var e = eq[i];
            this._emitMatch(e[0], e[1]);
          }
        }
        if (this._processQueue.length) {
          var pq = this._processQueue.slice(0);
          this._processQueue.length = 0;
          for (var i = 0; i < pq.length; i++) {
            var p = pq[i];
            this._processing--;
            this._process(p[0], p[1], p[2], p[3]);
          }
        }
      }
    };
    Glob.prototype._process = function(pattern, index, inGlobStar, cb) {
      assert(this instanceof Glob);
      assert(typeof cb === "function");
      if (this.aborted)
        return;
      this._processing++;
      if (this.paused) {
        this._processQueue.push([pattern, index, inGlobStar, cb]);
        return;
      }
      var n = 0;
      while (typeof pattern[n] === "string") {
        n++;
      }
      var prefix;
      switch (n) {
        case pattern.length:
          this._processSimple(pattern.join("/"), index, cb);
          return;
        case 0:
          prefix = null;
          break;
        default:
          prefix = pattern.slice(0, n).join("/");
          break;
      }
      var remain = pattern.slice(n);
      var read;
      if (prefix === null)
        read = ".";
      else if (isAbsolute(prefix) || isAbsolute(pattern.map(function(p) {
        return typeof p === "string" ? p : "[*]";
      }).join("/"))) {
        if (!prefix || !isAbsolute(prefix))
          prefix = "/" + prefix;
        read = prefix;
      } else
        read = prefix;
      var abs = this._makeAbs(read);
      if (childrenIgnored(this, read))
        return cb();
      var isGlobStar = remain[0] === minimatch.GLOBSTAR;
      if (isGlobStar)
        this._processGlobStar(prefix, read, abs, remain, index, inGlobStar, cb);
      else
        this._processReaddir(prefix, read, abs, remain, index, inGlobStar, cb);
    };
    Glob.prototype._processReaddir = function(prefix, read, abs, remain, index, inGlobStar, cb) {
      var self = this;
      this._readdir(abs, inGlobStar, function(er, entries) {
        return self._processReaddir2(prefix, read, abs, remain, index, inGlobStar, entries, cb);
      });
    };
    Glob.prototype._processReaddir2 = function(prefix, read, abs, remain, index, inGlobStar, entries, cb) {
      if (!entries)
        return cb();
      var pn = remain[0];
      var negate = !!this.minimatch.negate;
      var rawGlob = pn._glob;
      var dotOk = this.dot || rawGlob.charAt(0) === ".";
      var matchedEntries = [];
      for (var i = 0; i < entries.length; i++) {
        var e = entries[i];
        if (e.charAt(0) !== "." || dotOk) {
          var m;
          if (negate && !prefix) {
            m = !e.match(pn);
          } else {
            m = e.match(pn);
          }
          if (m)
            matchedEntries.push(e);
        }
      }
      var len = matchedEntries.length;
      if (len === 0)
        return cb();
      if (remain.length === 1 && !this.mark && !this.stat) {
        if (!this.matches[index])
          this.matches[index] = /* @__PURE__ */ Object.create(null);
        for (var i = 0; i < len; i++) {
          var e = matchedEntries[i];
          if (prefix) {
            if (prefix !== "/")
              e = prefix + "/" + e;
            else
              e = prefix + e;
          }
          if (e.charAt(0) === "/" && !this.nomount) {
            e = path.join(this.root, e);
          }
          this._emitMatch(index, e);
        }
        return cb();
      }
      remain.shift();
      for (var i = 0; i < len; i++) {
        var e = matchedEntries[i];
        var newPattern;
        if (prefix) {
          if (prefix !== "/")
            e = prefix + "/" + e;
          else
            e = prefix + e;
        }
        this._process([e].concat(remain), index, inGlobStar, cb);
      }
      cb();
    };
    Glob.prototype._emitMatch = function(index, e) {
      if (this.aborted)
        return;
      if (isIgnored(this, e))
        return;
      if (this.paused) {
        this._emitQueue.push([index, e]);
        return;
      }
      var abs = isAbsolute(e) ? e : this._makeAbs(e);
      if (this.mark)
        e = this._mark(e);
      if (this.absolute)
        e = abs;
      if (this.matches[index][e])
        return;
      if (this.nodir) {
        var c = this.cache[abs];
        if (c === "DIR" || Array.isArray(c))
          return;
      }
      this.matches[index][e] = true;
      var st = this.statCache[abs];
      if (st)
        this.emit("stat", e, st);
      this.emit("match", e);
    };
    Glob.prototype._readdirInGlobStar = function(abs, cb) {
      if (this.aborted)
        return;
      if (this.follow)
        return this._readdir(abs, false, cb);
      var lstatkey = "lstat\0" + abs;
      var self = this;
      var lstatcb = inflight(lstatkey, lstatcb_);
      if (lstatcb)
        self.fs.lstat(abs, lstatcb);
      function lstatcb_(er, lstat) {
        if (er && er.code === "ENOENT")
          return cb();
        var isSym = lstat && lstat.isSymbolicLink();
        self.symlinks[abs] = isSym;
        if (!isSym && lstat && !lstat.isDirectory()) {
          self.cache[abs] = "FILE";
          cb();
        } else
          self._readdir(abs, false, cb);
      }
    };
    Glob.prototype._readdir = function(abs, inGlobStar, cb) {
      if (this.aborted)
        return;
      cb = inflight("readdir\0" + abs + "\0" + inGlobStar, cb);
      if (!cb)
        return;
      if (inGlobStar && !ownProp(this.symlinks, abs))
        return this._readdirInGlobStar(abs, cb);
      if (ownProp(this.cache, abs)) {
        var c = this.cache[abs];
        if (!c || c === "FILE")
          return cb();
        if (Array.isArray(c))
          return cb(null, c);
      }
      var self = this;
      self.fs.readdir(abs, readdirCb(this, abs, cb));
    };
    function readdirCb(self, abs, cb) {
      return function(er, entries) {
        if (er)
          self._readdirError(abs, er, cb);
        else
          self._readdirEntries(abs, entries, cb);
      };
    }
    Glob.prototype._readdirEntries = function(abs, entries, cb) {
      if (this.aborted)
        return;
      if (!this.mark && !this.stat) {
        for (var i = 0; i < entries.length; i++) {
          var e = entries[i];
          if (abs === "/")
            e = abs + e;
          else
            e = abs + "/" + e;
          this.cache[e] = true;
        }
      }
      this.cache[abs] = entries;
      return cb(null, entries);
    };
    Glob.prototype._readdirError = function(f, er, cb) {
      if (this.aborted)
        return;
      switch (er.code) {
        case "ENOTSUP":
        case "ENOTDIR":
          var abs = this._makeAbs(f);
          this.cache[abs] = "FILE";
          if (abs === this.cwdAbs) {
            var error = new Error(er.code + " invalid cwd " + this.cwd);
            error.path = this.cwd;
            error.code = er.code;
            this.emit("error", error);
            this.abort();
          }
          break;
        case "ENOENT":
        case "ELOOP":
        case "ENAMETOOLONG":
        case "UNKNOWN":
          this.cache[this._makeAbs(f)] = false;
          break;
        default:
          this.cache[this._makeAbs(f)] = false;
          if (this.strict) {
            this.emit("error", er);
            this.abort();
          }
          if (!this.silent)
            console.error("glob error", er);
          break;
      }
      return cb();
    };
    Glob.prototype._processGlobStar = function(prefix, read, abs, remain, index, inGlobStar, cb) {
      var self = this;
      this._readdir(abs, inGlobStar, function(er, entries) {
        self._processGlobStar2(prefix, read, abs, remain, index, inGlobStar, entries, cb);
      });
    };
    Glob.prototype._processGlobStar2 = function(prefix, read, abs, remain, index, inGlobStar, entries, cb) {
      if (!entries)
        return cb();
      var remainWithoutGlobStar = remain.slice(1);
      var gspref = prefix ? [prefix] : [];
      var noGlobStar = gspref.concat(remainWithoutGlobStar);
      this._process(noGlobStar, index, false, cb);
      var isSym = this.symlinks[abs];
      var len = entries.length;
      if (isSym && inGlobStar)
        return cb();
      for (var i = 0; i < len; i++) {
        var e = entries[i];
        if (e.charAt(0) === "." && !this.dot)
          continue;
        var instead = gspref.concat(entries[i], remainWithoutGlobStar);
        this._process(instead, index, true, cb);
        var below = gspref.concat(entries[i], remain);
        this._process(below, index, true, cb);
      }
      cb();
    };
    Glob.prototype._processSimple = function(prefix, index, cb) {
      var self = this;
      this._stat(prefix, function(er, exists) {
        self._processSimple2(prefix, index, er, exists, cb);
      });
    };
    Glob.prototype._processSimple2 = function(prefix, index, er, exists, cb) {
      if (!this.matches[index])
        this.matches[index] = /* @__PURE__ */ Object.create(null);
      if (!exists)
        return cb();
      if (prefix && isAbsolute(prefix) && !this.nomount) {
        var trail = /[\/\\]$/.test(prefix);
        if (prefix.charAt(0) === "/") {
          prefix = path.join(this.root, prefix);
        } else {
          prefix = path.resolve(this.root, prefix);
          if (trail)
            prefix += "/";
        }
      }
      if (process.platform === "win32")
        prefix = prefix.replace(/\\/g, "/");
      this._emitMatch(index, prefix);
      cb();
    };
    Glob.prototype._stat = function(f, cb) {
      var abs = this._makeAbs(f);
      var needDir = f.slice(-1) === "/";
      if (f.length > this.maxLength)
        return cb();
      if (!this.stat && ownProp(this.cache, abs)) {
        var c = this.cache[abs];
        if (Array.isArray(c))
          c = "DIR";
        if (!needDir || c === "DIR")
          return cb(null, c);
        if (needDir && c === "FILE")
          return cb();
      }
      var exists;
      var stat = this.statCache[abs];
      if (stat !== void 0) {
        if (stat === false)
          return cb(null, stat);
        else {
          var type = stat.isDirectory() ? "DIR" : "FILE";
          if (needDir && type === "FILE")
            return cb();
          else
            return cb(null, type, stat);
        }
      }
      var self = this;
      var statcb = inflight("stat\0" + abs, lstatcb_);
      if (statcb)
        self.fs.lstat(abs, statcb);
      function lstatcb_(er, lstat) {
        if (lstat && lstat.isSymbolicLink()) {
          return self.fs.stat(abs, function(er2, stat2) {
            if (er2)
              self._stat2(f, abs, null, lstat, cb);
            else
              self._stat2(f, abs, er2, stat2, cb);
          });
        } else {
          self._stat2(f, abs, er, lstat, cb);
        }
      }
    };
    Glob.prototype._stat2 = function(f, abs, er, stat, cb) {
      if (er && (er.code === "ENOENT" || er.code === "ENOTDIR")) {
        this.statCache[abs] = false;
        return cb();
      }
      var needDir = f.slice(-1) === "/";
      this.statCache[abs] = stat;
      if (abs.slice(-1) === "/" && stat && !stat.isDirectory())
        return cb(null, false, stat);
      var c = true;
      if (stat)
        c = stat.isDirectory() ? "DIR" : "FILE";
      this.cache[abs] = this.cache[abs] || c;
      if (needDir && c === "FILE")
        return cb();
      return cb(null, c, stat);
    };
  }
});

// node_modules/stylus/lib/selector-parser.js
var require_selector_parser = __commonJS({
  "node_modules/stylus/lib/selector-parser.js"(exports, module2) {
    var COMBINATORS = [">", "+", "~"];
    var SelectorParser = module2.exports = function SelectorParser2(str, stack, parts) {
      this.str = str;
      this.stack = stack || [];
      this.parts = parts || [];
      this.pos = 0;
      this.level = 2;
      this.nested = true;
      this.ignore = false;
    };
    SelectorParser.prototype.skip = function(len) {
      this.str = this.str.substr(len);
      this.pos += len;
    };
    SelectorParser.prototype.skipSpaces = function() {
      while (" " == this.str[0])
        this.skip(1);
    };
    SelectorParser.prototype.advance = function() {
      return this.root() || this.relative() || this.initial() || this.escaped() || this.parent() || this.partial() || this.char();
    };
    SelectorParser.prototype.root = function() {
      if (!this.pos && "/" == this.str[0] && "deep" != this.str.slice(1, 5)) {
        this.nested = false;
        this.skip(1);
      }
    };
    SelectorParser.prototype.relative = function(multi) {
      if ((!this.pos || multi) && "../" == this.str.slice(0, 3)) {
        this.nested = false;
        this.skip(3);
        while (this.relative(true))
          this.level++;
        if (!this.raw) {
          var ret = this.stack[this.stack.length - this.level];
          if (ret) {
            return ret;
          } else {
            this.ignore = true;
          }
        }
      }
    };
    SelectorParser.prototype.initial = function() {
      if (!this.pos && "~" == this.str[0] && "/" == this.str[1]) {
        this.nested = false;
        this.skip(2);
        return this.stack[0];
      }
    };
    SelectorParser.prototype.escaped = function() {
      if ("\\" == this.str[0]) {
        var char = this.str[1];
        if ("&" == char || "^" == char) {
          this.skip(2);
          return char;
        }
      }
    };
    SelectorParser.prototype.parent = function() {
      if ("&" == this.str[0]) {
        this.nested = false;
        if (!this.pos && (!this.stack.length || this.raw)) {
          var i = 0;
          while (" " == this.str[++i])
            ;
          if (~COMBINATORS.indexOf(this.str[i])) {
            this.skip(i + 1);
            return;
          }
        }
        this.skip(1);
        if (!this.raw)
          return this.stack[this.stack.length - 1];
      }
    };
    SelectorParser.prototype.partial = function() {
      if ("^" == this.str[0] && "[" == this.str[1]) {
        this.skip(2);
        this.skipSpaces();
        var ret = this.range();
        this.skipSpaces();
        if ("]" != this.str[0])
          return "^[";
        this.nested = false;
        this.skip(1);
        if (ret) {
          return ret;
        } else {
          this.ignore = true;
        }
      }
    };
    SelectorParser.prototype.number = function() {
      var i = 0, ret = "";
      if ("-" == this.str[i])
        ret += this.str[i++];
      while (this.str.charCodeAt(i) >= 48 && this.str.charCodeAt(i) <= 57)
        ret += this.str[i++];
      if (ret) {
        this.skip(i);
        return Number(ret);
      }
    };
    SelectorParser.prototype.range = function() {
      var start = this.number(), ret;
      if (".." == this.str.slice(0, 2)) {
        this.skip(2);
        var end = this.number(), len = this.parts.length;
        if (start < 0)
          start = len + start - 1;
        if (end < 0)
          end = len + end - 1;
        if (start > end) {
          var tmp = start;
          start = end;
          end = tmp;
        }
        if (end < len - 1) {
          ret = this.parts.slice(start, end + 1).map(function(part) {
            var selector = new SelectorParser(part, this.stack, this.parts);
            selector.raw = true;
            return selector.parse();
          }, this).map(function(selector) {
            return (selector.nested ? " " : "") + selector.val;
          }).join("").trim();
        }
      } else {
        ret = this.stack[start < 0 ? this.stack.length + start - 1 : start];
      }
      if (ret) {
        return ret;
      } else {
        this.ignore = true;
      }
    };
    SelectorParser.prototype.char = function() {
      var char = this.str[0];
      this.skip(1);
      return char;
    };
    SelectorParser.prototype.parse = function() {
      var val = "";
      while (this.str.length) {
        val += this.advance() || "";
        if (this.ignore) {
          val = "";
          break;
        }
      }
      return { val: val.trimRight(), nested: this.nested };
    };
  }
});

// node_modules/stylus/lib/utils.js
var require_utils = __commonJS({
  "node_modules/stylus/lib/utils.js"(exports) {
    var nodes = require_nodes();
    var basename = require("path").basename;
    var relative = require("path").relative;
    var join = require("path").join;
    var isAbsolute = require("path").isAbsolute;
    var glob = require_glob();
    var fs = require("fs");
    exports.absolute = isAbsolute || function(path) {
      return path.substr(0, 2) == "\\\\" || "/" === path.charAt(0) || /^[a-z]:[\\\/]/i.test(path);
    };
    exports.lookup = function(path, paths, ignore) {
      var lookup, i = paths.length;
      if (exports.absolute(path)) {
        try {
          fs.statSync(path);
          return path;
        } catch (err) {
        }
      }
      while (i--) {
        try {
          lookup = join(paths[i], path);
          if (ignore == lookup)
            continue;
          fs.statSync(lookup);
          return lookup;
        } catch (err) {
        }
      }
    };
    exports.find = function(path, paths, ignore) {
      var lookup, found, i = paths.length;
      if (exports.absolute(path)) {
        if ((found = glob.sync(path)).length) {
          return found;
        }
      }
      while (i--) {
        lookup = join(paths[i], path);
        if (ignore == lookup)
          continue;
        if ((found = glob.sync(lookup)).length) {
          return found;
        }
      }
    };
    exports.lookupIndex = function(name, paths, filename) {
      var found = exports.find(join(name, "index.styl"), paths, filename);
      if (!found) {
        found = exports.find(join(name, basename(name).replace(/\.styl/i, "") + ".styl"), paths, filename);
      }
      if (!found && !~name.indexOf("node_modules")) {
        found = lookupPackage(join("node_modules", name));
      }
      return found;
      function lookupPackage(dir) {
        var pkg = exports.lookup(join(dir, "package.json"), paths, filename);
        if (!pkg) {
          return /\.styl$/i.test(dir) ? exports.lookupIndex(dir, paths, filename) : lookupPackage(dir + ".styl");
        }
        var main = require(relative(__dirname, pkg)).main;
        if (main) {
          found = exports.find(join(dir, main), paths, filename);
        } else {
          found = exports.lookupIndex(dir, paths, filename);
        }
        return found;
      }
    };
    exports.formatException = function(err, options) {
      var lineno = options.lineno, column = options.column, filename = options.filename, str = options.input, context = options.context || 8, context = context / 2, lines = ("\n" + str).split("\n"), start = Math.max(lineno - context, 1), end = Math.min(lines.length, lineno + context), pad = end.toString().length;
      var context = lines.slice(start, end).map(function(line, i) {
        var curr = i + start;
        return "   " + Array(pad - curr.toString().length + 1).join(" ") + curr + "| " + line + (curr == lineno ? "\n" + Array(curr.toString().length + 5 + column).join("-") + "^" : "");
      }).join("\n");
      err.message = filename + ":" + lineno + ":" + column + "\n" + context + "\n\n" + err.message + "\n" + (err.stylusStack ? err.stylusStack + "\n" : "");
      if (err.fromStylus)
        err.stack = "Error: " + err.message;
      return err;
    };
    exports.assertType = function(node, type, param) {
      exports.assertPresent(node, param);
      if (node.nodeName == type)
        return;
      var actual = node.nodeName, msg = "expected " + (param ? '"' + param + '" to be a ' : "") + type + ", but got " + actual + ":" + node;
      throw new Error("TypeError: " + msg);
    };
    exports.assertString = function(node, param) {
      exports.assertPresent(node, param);
      switch (node.nodeName) {
        case "string":
        case "ident":
        case "literal":
          return;
        default:
          var actual = node.nodeName, msg = "expected string, ident or literal, but got " + actual + ":" + node;
          throw new Error("TypeError: " + msg);
      }
    };
    exports.assertColor = function(node, param) {
      exports.assertPresent(node, param);
      switch (node.nodeName) {
        case "rgba":
        case "hsla":
          return;
        default:
          var actual = node.nodeName, msg = "expected rgba or hsla, but got " + actual + ":" + node;
          throw new Error("TypeError: " + msg);
      }
    };
    exports.assertPresent = function(node, name) {
      if (node)
        return;
      if (name)
        throw new Error('"' + name + '" argument required');
      throw new Error("argument missing");
    };
    exports.unwrap = function(expr) {
      if (expr.preserve)
        return expr;
      if ("arguments" != expr.nodeName && "expression" != expr.nodeName)
        return expr;
      if (1 != expr.nodes.length)
        return expr;
      if ("arguments" != expr.nodes[0].nodeName && "expression" != expr.nodes[0].nodeName)
        return expr;
      return exports.unwrap(expr.nodes[0]);
    };
    exports.coerce = function(val, raw) {
      switch (typeof val) {
        case "function":
          return val;
        case "string":
          return new nodes.String(val);
        case "boolean":
          return new nodes.Boolean(val);
        case "number":
          return new nodes.Unit(val);
        default:
          if (null == val)
            return nodes.null;
          if (Array.isArray(val))
            return exports.coerceArray(val, raw);
          if (val.nodeName)
            return val;
          return exports.coerceObject(val, raw);
      }
    };
    exports.coerceArray = function(val, raw) {
      var expr = new nodes.Expression();
      val.forEach(function(val2) {
        expr.push(exports.coerce(val2, raw));
      });
      return expr;
    };
    exports.coerceObject = function(obj, raw) {
      var node = raw ? new nodes.Object() : new nodes.Expression(), val;
      for (var key in obj) {
        val = exports.coerce(obj[key], raw);
        key = new nodes.Ident(key);
        if (raw) {
          node.set(key, val);
        } else {
          node.push(exports.coerceArray([key, val]));
        }
      }
      return node;
    };
    exports.params = function(fn) {
      return fn.toString().match(/\(([^)]*)\)/)[1].split(/ *, */);
    };
    exports.merge = function(a, b, deep) {
      for (var k in b) {
        if (deep && a[k]) {
          var nodeA = exports.unwrap(a[k]).first, nodeB = exports.unwrap(b[k]).first;
          if ("object" == nodeA.nodeName && "object" == nodeB.nodeName) {
            a[k].first.vals = exports.merge(nodeA.vals, nodeB.vals, deep);
          } else {
            a[k] = b[k];
          }
        } else {
          a[k] = b[k];
        }
      }
      return a;
    };
    exports.uniq = function(arr) {
      var obj = {}, ret = [];
      for (var i = 0, len = arr.length; i < len; ++i) {
        if (arr[i] in obj)
          continue;
        obj[arr[i]] = true;
        ret.push(arr[i]);
      }
      return ret;
    };
    exports.compileSelectors = function(arr, leaveHidden) {
      var selectors = [], Parser = require_selector_parser(), indent = this.indent || "", buf = [];
      function parse(selector, buf2) {
        var parts = [selector.val], str = new Parser(parts[0], parents, parts).parse().val, parents = [];
        if (buf2.length) {
          for (var i = 0, len = buf2.length; i < len; ++i) {
            parts.push(buf2[i]);
            parents.push(str);
            var child = new Parser(buf2[i], parents, parts).parse();
            if (child.nested) {
              str += " " + child.val;
            } else {
              str = child.val;
            }
          }
        }
        return str.trim();
      }
      function compile(arr2, i) {
        if (i) {
          arr2[i].forEach(function(selector) {
            if (!leaveHidden && selector.isPlaceholder)
              return;
            if (selector.inherits) {
              buf.unshift(selector.val);
              compile(arr2, i - 1);
              buf.shift();
            } else {
              selectors.push(indent + parse(selector, buf));
            }
          });
        } else {
          arr2[0].forEach(function(selector) {
            if (!leaveHidden && selector.isPlaceholder)
              return;
            var str = parse(selector, buf);
            if (str)
              selectors.push(indent + str);
          });
        }
      }
      compile(arr, arr.length - 1);
      return exports.uniq(selectors);
    };
    exports.parseString = function(str) {
      var Parser = require_parser(), parser, ret;
      try {
        parser = new Parser(str);
        ret = parser.list();
      } catch (e) {
        ret = new nodes.Literal(str);
      }
      return ret;
    };
  }
});

// node_modules/stylus/lib/functions/add-property.js
var require_add_property = __commonJS({
  "node_modules/stylus/lib/functions/add-property.js"(exports, module2) {
    var utils = require_utils();
    var nodes = require_nodes();
    (module2.exports = function addProperty(name, expr) {
      utils.assertType(name, "expression", "name");
      name = utils.unwrap(name).first;
      utils.assertString(name, "name");
      utils.assertType(expr, "expression", "expr");
      var prop = new nodes.Property([name], expr);
      var block = this.closestBlock;
      var len = block.nodes.length, head = block.nodes.slice(0, block.index), tail = block.nodes.slice(block.index++, len);
      head.push(prop);
      block.nodes = head.concat(tail);
      return prop;
    }).raw = true;
  }
});

// node_modules/stylus/lib/functions/adjust.js
var require_adjust = __commonJS({
  "node_modules/stylus/lib/functions/adjust.js"(exports, module2) {
    var utils = require_utils();
    function adjust(color, prop, amount) {
      utils.assertColor(color, "color");
      utils.assertString(prop, "prop");
      utils.assertType(amount, "unit", "amount");
      var hsl = color.hsla.clone();
      prop = { hue: "h", saturation: "s", lightness: "l" }[prop.string];
      if (!prop)
        throw new Error("invalid adjustment property");
      var val = amount.val;
      if ("%" == amount.type) {
        val = "l" == prop && val > 0 ? (100 - hsl[prop]) * val / 100 : hsl[prop] * (val / 100);
      }
      hsl[prop] += val;
      return hsl.rgba;
    }
    adjust.params = ["color", "prop", "amount"];
    module2.exports = adjust;
  }
});

// node_modules/stylus/lib/functions/rgba.js
var require_rgba = __commonJS({
  "node_modules/stylus/lib/functions/rgba.js"(exports, module2) {
    var utils = require_utils();
    var nodes = require_nodes();
    function rgba(red, green, blue, alpha) {
      switch (arguments.length) {
        case 1:
          utils.assertColor(red);
          return red.rgba;
        case 2:
          utils.assertColor(red);
          var color = red.rgba;
          utils.assertType(green, "unit", "alpha");
          alpha = green.clone();
          if ("%" == alpha.type)
            alpha.val /= 100;
          return new nodes.RGBA(
            color.r,
            color.g,
            color.b,
            alpha.val
          );
        default:
          utils.assertType(red, "unit", "red");
          utils.assertType(green, "unit", "green");
          utils.assertType(blue, "unit", "blue");
          utils.assertType(alpha, "unit", "alpha");
          var r = "%" == red.type ? Math.round(red.val * 2.55) : red.val, g = "%" == green.type ? Math.round(green.val * 2.55) : green.val, b = "%" == blue.type ? Math.round(blue.val * 2.55) : blue.val;
          alpha = alpha.clone();
          if (alpha && "%" == alpha.type)
            alpha.val /= 100;
          return new nodes.RGBA(
            r,
            g,
            b,
            alpha.val
          );
      }
    }
    rgba.params = ["red", "green", "blue", "alpha"];
    module2.exports = rgba;
  }
});

// node_modules/stylus/lib/functions/alpha.js
var require_alpha = __commonJS({
  "node_modules/stylus/lib/functions/alpha.js"(exports, module2) {
    var nodes = require_nodes();
    var rgba = require_rgba();
    function alpha(color, value) {
      color = color.rgba;
      if (value) {
        return rgba(
          new nodes.Unit(color.r),
          new nodes.Unit(color.g),
          new nodes.Unit(color.b),
          value
        );
      }
      return new nodes.Unit(color.a, "");
    }
    alpha.params = ["color", "value"];
    module2.exports = alpha;
  }
});

// node_modules/stylus/lib/functions/base-convert.js
var require_base_convert = __commonJS({
  "node_modules/stylus/lib/functions/base-convert.js"(exports, module2) {
    var utils = require_utils();
    var nodes = require_nodes();
    (module2.exports = function(num, base, width) {
      utils.assertPresent(num, "number");
      utils.assertPresent(base, "base");
      num = utils.unwrap(num).nodes[0].val;
      base = utils.unwrap(base).nodes[0].val;
      width = width && utils.unwrap(width).nodes[0].val || 2;
      var result = Number(num).toString(base);
      while (result.length < width) {
        result = "0" + result;
      }
      return new nodes.Literal(result);
    }).raw = true;
  }
});

// node_modules/stylus/lib/functions/basename.js
var require_basename = __commonJS({
  "node_modules/stylus/lib/functions/basename.js"(exports, module2) {
    var utils = require_utils();
    var path = require("path");
    function basename(p, ext) {
      utils.assertString(p, "path");
      return path.basename(p.val, ext && ext.val);
    }
    basename.params = ["p", "ext"];
    module2.exports = basename;
  }
});

// node_modules/stylus/lib/functions/blend.js
var require_blend = __commonJS({
  "node_modules/stylus/lib/functions/blend.js"(exports, module2) {
    var utils = require_utils();
    var nodes = require_nodes();
    function blend(top, bottom) {
      utils.assertColor(top);
      top = top.rgba;
      bottom = bottom || new nodes.RGBA(255, 255, 255, 1);
      utils.assertColor(bottom);
      bottom = bottom.rgba;
      return new nodes.RGBA(
        top.r * top.a + bottom.r * (1 - top.a),
        top.g * top.a + bottom.g * (1 - top.a),
        top.b * top.a + bottom.b * (1 - top.a),
        top.a + bottom.a - top.a * bottom.a
      );
    }
    blend.params = ["top", "bottom"];
    module2.exports = blend;
  }
});

// node_modules/stylus/lib/functions/blue.js
var require_blue = __commonJS({
  "node_modules/stylus/lib/functions/blue.js"(exports, module2) {
    var nodes = require_nodes();
    var rgba = require_rgba();
    function blue(color, value) {
      color = color.rgba;
      if (value) {
        return rgba(
          new nodes.Unit(color.r),
          new nodes.Unit(color.g),
          value,
          new nodes.Unit(color.a)
        );
      }
      return new nodes.Unit(color.b, "");
    }
    blue.params = ["color", "value"];
    module2.exports = blue;
  }
});

// node_modules/stylus/lib/functions/clone.js
var require_clone = __commonJS({
  "node_modules/stylus/lib/functions/clone.js"(exports, module2) {
    var utils = require_utils();
    (module2.exports = function clone(expr) {
      utils.assertPresent(expr, "expr");
      return expr.clone();
    }).raw = true;
  }
});

// node_modules/stylus/lib/functions/component.js
var require_component = __commonJS({
  "node_modules/stylus/lib/functions/component.js"(exports, module2) {
    var utils = require_utils();
    var nodes = require_nodes();
    var componentMap = {
      red: "r",
      green: "g",
      blue: "b",
      alpha: "a",
      hue: "h",
      saturation: "s",
      lightness: "l"
    };
    var unitMap = {
      hue: "deg",
      saturation: "%",
      lightness: "%"
    };
    var typeMap = {
      red: "rgba",
      blue: "rgba",
      green: "rgba",
      alpha: "rgba",
      hue: "hsla",
      saturation: "hsla",
      lightness: "hsla"
    };
    function component(color, name) {
      utils.assertColor(color, "color");
      utils.assertString(name, "name");
      var name = name.string, unit = unitMap[name], type = typeMap[name], name = componentMap[name];
      if (!name)
        throw new Error('invalid color component "' + name + '"');
      return new nodes.Unit(color[type][name], unit);
    }
    component.params = ["color", "name"];
    module2.exports = component;
  }
});

// node_modules/stylus/lib/functions/luminosity.js
var require_luminosity = __commonJS({
  "node_modules/stylus/lib/functions/luminosity.js"(exports, module2) {
    var utils = require_utils();
    var nodes = require_nodes();
    function luminosity(color) {
      utils.assertColor(color);
      color = color.rgba;
      function processChannel(channel) {
        channel = channel / 255;
        return 0.03928 > channel ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
      }
      return new nodes.Unit(
        0.2126 * processChannel(color.r) + 0.7152 * processChannel(color.g) + 0.0722 * processChannel(color.b)
      );
    }
    luminosity.params = ["color"];
    module2.exports = luminosity;
  }
});

// node_modules/stylus/lib/functions/contrast.js
var require_contrast = __commonJS({
  "node_modules/stylus/lib/functions/contrast.js"(exports, module2) {
    var utils = require_utils();
    var nodes = require_nodes();
    var blend = require_blend();
    var luminosity = require_luminosity();
    function contrast(top, bottom) {
      if ("rgba" != top.nodeName && "hsla" != top.nodeName) {
        return new nodes.Literal("contrast(" + (top.isNull ? "" : top.toString()) + ")");
      }
      var result = new nodes.Object();
      top = top.rgba;
      bottom = bottom || new nodes.RGBA(255, 255, 255, 1);
      utils.assertColor(bottom);
      bottom = bottom.rgba;
      function contrast2(top2, bottom2) {
        if (1 > top2.a) {
          top2 = blend(top2, bottom2);
        }
        var l1 = luminosity(bottom2).val + 0.05, l2 = luminosity(top2).val + 0.05, ratio = l1 / l2;
        if (l2 > l1) {
          ratio = 1 / ratio;
        }
        return Math.round(ratio * 10) / 10;
      }
      if (1 <= bottom.a) {
        var resultRatio = new nodes.Unit(contrast2(top, bottom));
        result.set("ratio", resultRatio);
        result.set("error", new nodes.Unit(0));
        result.set("min", resultRatio);
        result.set("max", resultRatio);
      } else {
        let processChannel2 = function(topChannel, bottomChannel) {
          return Math.min(Math.max(0, (topChannel - bottomChannel * bottom.a) / (1 - bottom.a)), 255);
        };
        var processChannel = processChannel2;
        var onBlack = contrast2(top, blend(bottom, new nodes.RGBA(0, 0, 0, 1))), onWhite = contrast2(top, blend(bottom, new nodes.RGBA(255, 255, 255, 1))), max = Math.max(onBlack, onWhite);
        var closest = new nodes.RGBA(
          processChannel2(top.r, bottom.r),
          processChannel2(top.g, bottom.g),
          processChannel2(top.b, bottom.b),
          1
        );
        var min = contrast2(top, blend(bottom, closest));
        result.set("ratio", new nodes.Unit(Math.round((min + max) * 50) / 100));
        result.set("error", new nodes.Unit(Math.round((max - min) * 50) / 100));
        result.set("min", new nodes.Unit(min));
        result.set("max", new nodes.Unit(max));
      }
      return result;
    }
    contrast.params = ["top", "bottom"];
    module2.exports = contrast;
  }
});

// node_modules/stylus/lib/functions/convert.js
var require_convert = __commonJS({
  "node_modules/stylus/lib/functions/convert.js"(exports, module2) {
    var utils = require_utils();
    function convert(str) {
      utils.assertString(str, "str");
      return utils.parseString(str.string);
    }
    convert.params = ["str"];
    module2.exports = convert;
  }
});

// node_modules/stylus/lib/functions/current-media.js
var require_current_media = __commonJS({
  "node_modules/stylus/lib/functions/current-media.js"(exports, module2) {
    var nodes = require_nodes();
    module2.exports = function currentMedia() {
      var self = this;
      return new nodes.String(lookForMedia(this.closestBlock.node) || "");
      function lookForMedia(node) {
        if ("media" == node.nodeName) {
          node.val = self.visit(node.val);
          return node.toString();
        } else if (node.block.parent.node) {
          return lookForMedia(node.block.parent.node);
        }
      }
    };
  }
});

// node_modules/stylus/lib/functions/define.js
var require_define = __commonJS({
  "node_modules/stylus/lib/functions/define.js"(exports, module2) {
    var utils = require_utils();
    var nodes = require_nodes();
    function define(name, expr, global) {
      utils.assertType(name, "string", "name");
      expr = utils.unwrap(expr);
      var scope = this.currentScope;
      if (global && global.toBoolean().isTrue) {
        scope = this.global.scope;
      }
      var node = new nodes.Ident(name.val, expr);
      scope.add(node);
      return nodes.null;
    }
    define.params = ["name", "expr", "global"];
    module2.exports = define;
  }
});

// node_modules/stylus/lib/functions/dirname.js
var require_dirname = __commonJS({
  "node_modules/stylus/lib/functions/dirname.js"(exports, module2) {
    var utils = require_utils();
    var path = require("path");
    function dirname(p) {
      utils.assertString(p, "path");
      return path.dirname(p.val).replace(/\\/g, "/");
    }
    dirname.params = ["p"];
    module2.exports = dirname;
  }
});

// node_modules/stylus/lib/functions/error.js
var require_error = __commonJS({
  "node_modules/stylus/lib/functions/error.js"(exports, module2) {
    var utils = require_utils();
    function error(msg) {
      utils.assertType(msg, "string", "msg");
      var err = new Error(msg.val);
      err.fromStylus = true;
      throw err;
    }
    error.params = ["msg"];
    module2.exports = error;
  }
});

// node_modules/stylus/lib/functions/extname.js
var require_extname = __commonJS({
  "node_modules/stylus/lib/functions/extname.js"(exports, module2) {
    var utils = require_utils();
    var path = require("path");
    function extname(p) {
      utils.assertString(p, "path");
      return path.extname(p.val);
    }
    extname.params = ["p"];
    module2.exports = extname;
  }
});

// node_modules/stylus/lib/functions/green.js
var require_green = __commonJS({
  "node_modules/stylus/lib/functions/green.js"(exports, module2) {
    var nodes = require_nodes();
    var rgba = require_rgba();
    function green(color, value) {
      color = color.rgba;
      if (value) {
        return rgba(
          new nodes.Unit(color.r),
          value,
          new nodes.Unit(color.b),
          new nodes.Unit(color.a)
        );
      }
      return new nodes.Unit(color.g, "");
    }
    green.params = ["color", "value"];
    module2.exports = green;
  }
});

// node_modules/stylus/lib/functions/hsla.js
var require_hsla = __commonJS({
  "node_modules/stylus/lib/functions/hsla.js"(exports, module2) {
    var utils = require_utils();
    var nodes = require_nodes();
    function hsla(hue, saturation, lightness, alpha) {
      switch (arguments.length) {
        case 1:
          utils.assertColor(hue);
          return hue.hsla;
        case 2:
          utils.assertColor(hue);
          var color = hue.hsla;
          utils.assertType(saturation, "unit", "alpha");
          var alpha = saturation.clone();
          if ("%" == alpha.type)
            alpha.val /= 100;
          return new nodes.HSLA(
            color.h,
            color.s,
            color.l,
            alpha.val
          );
        default:
          utils.assertType(hue, "unit", "hue");
          utils.assertType(saturation, "unit", "saturation");
          utils.assertType(lightness, "unit", "lightness");
          utils.assertType(alpha, "unit", "alpha");
          var alpha = alpha.clone();
          if (alpha && "%" == alpha.type)
            alpha.val /= 100;
          return new nodes.HSLA(
            hue.val,
            saturation.val,
            lightness.val,
            alpha.val
          );
      }
    }
    hsla.params = ["hue", "saturation", "lightness", "alpha"];
    module2.exports = hsla;
  }
});

// node_modules/stylus/lib/functions/hsl.js
var require_hsl = __commonJS({
  "node_modules/stylus/lib/functions/hsl.js"(exports, module2) {
    var utils = require_utils();
    var nodes = require_nodes();
    var hsla = require_hsla();
    function hsl(hue, saturation, lightness) {
      if (1 == arguments.length) {
        utils.assertColor(hue, "color");
        return hue.hsla;
      } else {
        return hsla(
          hue,
          saturation,
          lightness,
          new nodes.Unit(1)
        );
      }
    }
    hsl.params = ["hue", "saturation", "lightness"];
    module2.exports = hsl;
  }
});

// node_modules/stylus/lib/functions/hue.js
var require_hue = __commonJS({
  "node_modules/stylus/lib/functions/hue.js"(exports, module2) {
    var nodes = require_nodes();
    var hsla = require_hsla();
    var component = require_component();
    function hue(color, value) {
      if (value) {
        var hslaColor = color.hsla;
        return hsla(
          value,
          new nodes.Unit(hslaColor.s),
          new nodes.Unit(hslaColor.l),
          new nodes.Unit(hslaColor.a)
        );
      }
      return component(color, new nodes.String("hue"));
    }
    hue.params = ["color", "value"];
    module2.exports = hue;
  }
});

// node_modules/sax/lib/sax.js
var require_sax = __commonJS({
  "node_modules/sax/lib/sax.js"(exports) {
    (function(sax) {
      sax.parser = function(strict, opt) {
        return new SAXParser(strict, opt);
      };
      sax.SAXParser = SAXParser;
      sax.SAXStream = SAXStream;
      sax.createStream = createStream;
      sax.MAX_BUFFER_LENGTH = 64 * 1024;
      var buffers = [
        "comment",
        "sgmlDecl",
        "textNode",
        "tagName",
        "doctype",
        "procInstName",
        "procInstBody",
        "entity",
        "attribName",
        "attribValue",
        "cdata",
        "script"
      ];
      sax.EVENTS = [
        "text",
        "processinginstruction",
        "sgmldeclaration",
        "doctype",
        "comment",
        "opentagstart",
        "attribute",
        "opentag",
        "closetag",
        "opencdata",
        "cdata",
        "closecdata",
        "error",
        "end",
        "ready",
        "script",
        "opennamespace",
        "closenamespace"
      ];
      function SAXParser(strict, opt) {
        if (!(this instanceof SAXParser)) {
          return new SAXParser(strict, opt);
        }
        var parser = this;
        clearBuffers(parser);
        parser.q = parser.c = "";
        parser.bufferCheckPosition = sax.MAX_BUFFER_LENGTH;
        parser.opt = opt || {};
        parser.opt.lowercase = parser.opt.lowercase || parser.opt.lowercasetags;
        parser.looseCase = parser.opt.lowercase ? "toLowerCase" : "toUpperCase";
        parser.tags = [];
        parser.closed = parser.closedRoot = parser.sawRoot = false;
        parser.tag = parser.error = null;
        parser.strict = !!strict;
        parser.noscript = !!(strict || parser.opt.noscript);
        parser.state = S.BEGIN;
        parser.strictEntities = parser.opt.strictEntities;
        parser.ENTITIES = parser.strictEntities ? Object.create(sax.XML_ENTITIES) : Object.create(sax.ENTITIES);
        parser.attribList = [];
        if (parser.opt.xmlns) {
          parser.ns = Object.create(rootNS);
        }
        parser.trackPosition = parser.opt.position !== false;
        if (parser.trackPosition) {
          parser.position = parser.line = parser.column = 0;
        }
        emit(parser, "onready");
      }
      if (!Object.create) {
        Object.create = function(o) {
          function F() {
          }
          F.prototype = o;
          var newf = new F();
          return newf;
        };
      }
      if (!Object.keys) {
        Object.keys = function(o) {
          var a = [];
          for (var i in o)
            if (o.hasOwnProperty(i))
              a.push(i);
          return a;
        };
      }
      function checkBufferLength(parser) {
        var maxAllowed = Math.max(sax.MAX_BUFFER_LENGTH, 10);
        var maxActual = 0;
        for (var i = 0, l = buffers.length; i < l; i++) {
          var len = parser[buffers[i]].length;
          if (len > maxAllowed) {
            switch (buffers[i]) {
              case "textNode":
                closeText(parser);
                break;
              case "cdata":
                emitNode(parser, "oncdata", parser.cdata);
                parser.cdata = "";
                break;
              case "script":
                emitNode(parser, "onscript", parser.script);
                parser.script = "";
                break;
              default:
                error(parser, "Max buffer length exceeded: " + buffers[i]);
            }
          }
          maxActual = Math.max(maxActual, len);
        }
        var m = sax.MAX_BUFFER_LENGTH - maxActual;
        parser.bufferCheckPosition = m + parser.position;
      }
      function clearBuffers(parser) {
        for (var i = 0, l = buffers.length; i < l; i++) {
          parser[buffers[i]] = "";
        }
      }
      function flushBuffers(parser) {
        closeText(parser);
        if (parser.cdata !== "") {
          emitNode(parser, "oncdata", parser.cdata);
          parser.cdata = "";
        }
        if (parser.script !== "") {
          emitNode(parser, "onscript", parser.script);
          parser.script = "";
        }
      }
      SAXParser.prototype = {
        end: function() {
          end(this);
        },
        write,
        resume: function() {
          this.error = null;
          return this;
        },
        close: function() {
          return this.write(null);
        },
        flush: function() {
          flushBuffers(this);
        }
      };
      var Stream;
      try {
        Stream = require("stream").Stream;
      } catch (ex) {
        Stream = function() {
        };
      }
      var streamWraps = sax.EVENTS.filter(function(ev) {
        return ev !== "error" && ev !== "end";
      });
      function createStream(strict, opt) {
        return new SAXStream(strict, opt);
      }
      function SAXStream(strict, opt) {
        if (!(this instanceof SAXStream)) {
          return new SAXStream(strict, opt);
        }
        Stream.apply(this);
        this._parser = new SAXParser(strict, opt);
        this.writable = true;
        this.readable = true;
        var me = this;
        this._parser.onend = function() {
          me.emit("end");
        };
        this._parser.onerror = function(er) {
          me.emit("error", er);
          me._parser.error = null;
        };
        this._decoder = null;
        streamWraps.forEach(function(ev) {
          Object.defineProperty(me, "on" + ev, {
            get: function() {
              return me._parser["on" + ev];
            },
            set: function(h) {
              if (!h) {
                me.removeAllListeners(ev);
                me._parser["on" + ev] = h;
                return h;
              }
              me.on(ev, h);
            },
            enumerable: true,
            configurable: false
          });
        });
      }
      SAXStream.prototype = Object.create(Stream.prototype, {
        constructor: {
          value: SAXStream
        }
      });
      SAXStream.prototype.write = function(data) {
        if (typeof Buffer === "function" && typeof Buffer.isBuffer === "function" && Buffer.isBuffer(data)) {
          if (!this._decoder) {
            var SD = require("string_decoder").StringDecoder;
            this._decoder = new SD("utf8");
          }
          data = this._decoder.write(data);
        }
        this._parser.write(data.toString());
        this.emit("data", data);
        return true;
      };
      SAXStream.prototype.end = function(chunk) {
        if (chunk && chunk.length) {
          this.write(chunk);
        }
        this._parser.end();
        return true;
      };
      SAXStream.prototype.on = function(ev, handler) {
        var me = this;
        if (!me._parser["on" + ev] && streamWraps.indexOf(ev) !== -1) {
          me._parser["on" + ev] = function() {
            var args = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
            args.splice(0, 0, ev);
            me.emit.apply(me, args);
          };
        }
        return Stream.prototype.on.call(me, ev, handler);
      };
      var CDATA = "[CDATA[";
      var DOCTYPE = "DOCTYPE";
      var XML_NAMESPACE = "http://www.w3.org/XML/1998/namespace";
      var XMLNS_NAMESPACE = "http://www.w3.org/2000/xmlns/";
      var rootNS = { xml: XML_NAMESPACE, xmlns: XMLNS_NAMESPACE };
      var nameStart = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
      var nameBody = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
      var entityStart = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
      var entityBody = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
      function isWhitespace(c) {
        return c === " " || c === "\n" || c === "\r" || c === "	";
      }
      function isQuote(c) {
        return c === '"' || c === "'";
      }
      function isAttribEnd(c) {
        return c === ">" || isWhitespace(c);
      }
      function isMatch(regex, c) {
        return regex.test(c);
      }
      function notMatch(regex, c) {
        return !isMatch(regex, c);
      }
      var S = 0;
      sax.STATE = {
        BEGIN: S++,
        // leading byte order mark or whitespace
        BEGIN_WHITESPACE: S++,
        // leading whitespace
        TEXT: S++,
        // general stuff
        TEXT_ENTITY: S++,
        // &amp and such.
        OPEN_WAKA: S++,
        // <
        SGML_DECL: S++,
        // <!BLARG
        SGML_DECL_QUOTED: S++,
        // <!BLARG foo "bar
        DOCTYPE: S++,
        // <!DOCTYPE
        DOCTYPE_QUOTED: S++,
        // <!DOCTYPE "//blah
        DOCTYPE_DTD: S++,
        // <!DOCTYPE "//blah" [ ...
        DOCTYPE_DTD_QUOTED: S++,
        // <!DOCTYPE "//blah" [ "foo
        COMMENT_STARTING: S++,
        // <!-
        COMMENT: S++,
        // <!--
        COMMENT_ENDING: S++,
        // <!-- blah -
        COMMENT_ENDED: S++,
        // <!-- blah --
        CDATA: S++,
        // <![CDATA[ something
        CDATA_ENDING: S++,
        // ]
        CDATA_ENDING_2: S++,
        // ]]
        PROC_INST: S++,
        // <?hi
        PROC_INST_BODY: S++,
        // <?hi there
        PROC_INST_ENDING: S++,
        // <?hi "there" ?
        OPEN_TAG: S++,
        // <strong
        OPEN_TAG_SLASH: S++,
        // <strong /
        ATTRIB: S++,
        // <a
        ATTRIB_NAME: S++,
        // <a foo
        ATTRIB_NAME_SAW_WHITE: S++,
        // <a foo _
        ATTRIB_VALUE: S++,
        // <a foo=
        ATTRIB_VALUE_QUOTED: S++,
        // <a foo="bar
        ATTRIB_VALUE_CLOSED: S++,
        // <a foo="bar"
        ATTRIB_VALUE_UNQUOTED: S++,
        // <a foo=bar
        ATTRIB_VALUE_ENTITY_Q: S++,
        // <foo bar="&quot;"
        ATTRIB_VALUE_ENTITY_U: S++,
        // <foo bar=&quot
        CLOSE_TAG: S++,
        // </a
        CLOSE_TAG_SAW_WHITE: S++,
        // </a   >
        SCRIPT: S++,
        // <script> ...
        SCRIPT_ENDING: S++
        // <script> ... <
      };
      sax.XML_ENTITIES = {
        "amp": "&",
        "gt": ">",
        "lt": "<",
        "quot": '"',
        "apos": "'"
      };
      sax.ENTITIES = {
        "amp": "&",
        "gt": ">",
        "lt": "<",
        "quot": '"',
        "apos": "'",
        "AElig": 198,
        "Aacute": 193,
        "Acirc": 194,
        "Agrave": 192,
        "Aring": 197,
        "Atilde": 195,
        "Auml": 196,
        "Ccedil": 199,
        "ETH": 208,
        "Eacute": 201,
        "Ecirc": 202,
        "Egrave": 200,
        "Euml": 203,
        "Iacute": 205,
        "Icirc": 206,
        "Igrave": 204,
        "Iuml": 207,
        "Ntilde": 209,
        "Oacute": 211,
        "Ocirc": 212,
        "Ograve": 210,
        "Oslash": 216,
        "Otilde": 213,
        "Ouml": 214,
        "THORN": 222,
        "Uacute": 218,
        "Ucirc": 219,
        "Ugrave": 217,
        "Uuml": 220,
        "Yacute": 221,
        "aacute": 225,
        "acirc": 226,
        "aelig": 230,
        "agrave": 224,
        "aring": 229,
        "atilde": 227,
        "auml": 228,
        "ccedil": 231,
        "eacute": 233,
        "ecirc": 234,
        "egrave": 232,
        "eth": 240,
        "euml": 235,
        "iacute": 237,
        "icirc": 238,
        "igrave": 236,
        "iuml": 239,
        "ntilde": 241,
        "oacute": 243,
        "ocirc": 244,
        "ograve": 242,
        "oslash": 248,
        "otilde": 245,
        "ouml": 246,
        "szlig": 223,
        "thorn": 254,
        "uacute": 250,
        "ucirc": 251,
        "ugrave": 249,
        "uuml": 252,
        "yacute": 253,
        "yuml": 255,
        "copy": 169,
        "reg": 174,
        "nbsp": 160,
        "iexcl": 161,
        "cent": 162,
        "pound": 163,
        "curren": 164,
        "yen": 165,
        "brvbar": 166,
        "sect": 167,
        "uml": 168,
        "ordf": 170,
        "laquo": 171,
        "not": 172,
        "shy": 173,
        "macr": 175,
        "deg": 176,
        "plusmn": 177,
        "sup1": 185,
        "sup2": 178,
        "sup3": 179,
        "acute": 180,
        "micro": 181,
        "para": 182,
        "middot": 183,
        "cedil": 184,
        "ordm": 186,
        "raquo": 187,
        "frac14": 188,
        "frac12": 189,
        "frac34": 190,
        "iquest": 191,
        "times": 215,
        "divide": 247,
        "OElig": 338,
        "oelig": 339,
        "Scaron": 352,
        "scaron": 353,
        "Yuml": 376,
        "fnof": 402,
        "circ": 710,
        "tilde": 732,
        "Alpha": 913,
        "Beta": 914,
        "Gamma": 915,
        "Delta": 916,
        "Epsilon": 917,
        "Zeta": 918,
        "Eta": 919,
        "Theta": 920,
        "Iota": 921,
        "Kappa": 922,
        "Lambda": 923,
        "Mu": 924,
        "Nu": 925,
        "Xi": 926,
        "Omicron": 927,
        "Pi": 928,
        "Rho": 929,
        "Sigma": 931,
        "Tau": 932,
        "Upsilon": 933,
        "Phi": 934,
        "Chi": 935,
        "Psi": 936,
        "Omega": 937,
        "alpha": 945,
        "beta": 946,
        "gamma": 947,
        "delta": 948,
        "epsilon": 949,
        "zeta": 950,
        "eta": 951,
        "theta": 952,
        "iota": 953,
        "kappa": 954,
        "lambda": 955,
        "mu": 956,
        "nu": 957,
        "xi": 958,
        "omicron": 959,
        "pi": 960,
        "rho": 961,
        "sigmaf": 962,
        "sigma": 963,
        "tau": 964,
        "upsilon": 965,
        "phi": 966,
        "chi": 967,
        "psi": 968,
        "omega": 969,
        "thetasym": 977,
        "upsih": 978,
        "piv": 982,
        "ensp": 8194,
        "emsp": 8195,
        "thinsp": 8201,
        "zwnj": 8204,
        "zwj": 8205,
        "lrm": 8206,
        "rlm": 8207,
        "ndash": 8211,
        "mdash": 8212,
        "lsquo": 8216,
        "rsquo": 8217,
        "sbquo": 8218,
        "ldquo": 8220,
        "rdquo": 8221,
        "bdquo": 8222,
        "dagger": 8224,
        "Dagger": 8225,
        "bull": 8226,
        "hellip": 8230,
        "permil": 8240,
        "prime": 8242,
        "Prime": 8243,
        "lsaquo": 8249,
        "rsaquo": 8250,
        "oline": 8254,
        "frasl": 8260,
        "euro": 8364,
        "image": 8465,
        "weierp": 8472,
        "real": 8476,
        "trade": 8482,
        "alefsym": 8501,
        "larr": 8592,
        "uarr": 8593,
        "rarr": 8594,
        "darr": 8595,
        "harr": 8596,
        "crarr": 8629,
        "lArr": 8656,
        "uArr": 8657,
        "rArr": 8658,
        "dArr": 8659,
        "hArr": 8660,
        "forall": 8704,
        "part": 8706,
        "exist": 8707,
        "empty": 8709,
        "nabla": 8711,
        "isin": 8712,
        "notin": 8713,
        "ni": 8715,
        "prod": 8719,
        "sum": 8721,
        "minus": 8722,
        "lowast": 8727,
        "radic": 8730,
        "prop": 8733,
        "infin": 8734,
        "ang": 8736,
        "and": 8743,
        "or": 8744,
        "cap": 8745,
        "cup": 8746,
        "int": 8747,
        "there4": 8756,
        "sim": 8764,
        "cong": 8773,
        "asymp": 8776,
        "ne": 8800,
        "equiv": 8801,
        "le": 8804,
        "ge": 8805,
        "sub": 8834,
        "sup": 8835,
        "nsub": 8836,
        "sube": 8838,
        "supe": 8839,
        "oplus": 8853,
        "otimes": 8855,
        "perp": 8869,
        "sdot": 8901,
        "lceil": 8968,
        "rceil": 8969,
        "lfloor": 8970,
        "rfloor": 8971,
        "lang": 9001,
        "rang": 9002,
        "loz": 9674,
        "spades": 9824,
        "clubs": 9827,
        "hearts": 9829,
        "diams": 9830
      };
      Object.keys(sax.ENTITIES).forEach(function(key) {
        var e = sax.ENTITIES[key];
        var s2 = typeof e === "number" ? String.fromCharCode(e) : e;
        sax.ENTITIES[key] = s2;
      });
      for (var s in sax.STATE) {
        sax.STATE[sax.STATE[s]] = s;
      }
      S = sax.STATE;
      function emit(parser, event, data) {
        parser[event] && parser[event](data);
      }
      function emitNode(parser, nodeType, data) {
        if (parser.textNode)
          closeText(parser);
        emit(parser, nodeType, data);
      }
      function closeText(parser) {
        parser.textNode = textopts(parser.opt, parser.textNode);
        if (parser.textNode)
          emit(parser, "ontext", parser.textNode);
        parser.textNode = "";
      }
      function textopts(opt, text) {
        if (opt.trim)
          text = text.trim();
        if (opt.normalize)
          text = text.replace(/\s+/g, " ");
        return text;
      }
      function error(parser, er) {
        closeText(parser);
        if (parser.trackPosition) {
          er += "\nLine: " + parser.line + "\nColumn: " + parser.column + "\nChar: " + parser.c;
        }
        er = new Error(er);
        parser.error = er;
        emit(parser, "onerror", er);
        return parser;
      }
      function end(parser) {
        if (parser.sawRoot && !parser.closedRoot)
          strictFail(parser, "Unclosed root tag");
        if (parser.state !== S.BEGIN && parser.state !== S.BEGIN_WHITESPACE && parser.state !== S.TEXT) {
          error(parser, "Unexpected end");
        }
        closeText(parser);
        parser.c = "";
        parser.closed = true;
        emit(parser, "onend");
        SAXParser.call(parser, parser.strict, parser.opt);
        return parser;
      }
      function strictFail(parser, message) {
        if (typeof parser !== "object" || !(parser instanceof SAXParser)) {
          throw new Error("bad call to strictFail");
        }
        if (parser.strict) {
          error(parser, message);
        }
      }
      function newTag(parser) {
        if (!parser.strict)
          parser.tagName = parser.tagName[parser.looseCase]();
        var parent = parser.tags[parser.tags.length - 1] || parser;
        var tag = parser.tag = { name: parser.tagName, attributes: {} };
        if (parser.opt.xmlns) {
          tag.ns = parent.ns;
        }
        parser.attribList.length = 0;
        emitNode(parser, "onopentagstart", tag);
      }
      function qname(name, attribute) {
        var i = name.indexOf(":");
        var qualName = i < 0 ? ["", name] : name.split(":");
        var prefix = qualName[0];
        var local = qualName[1];
        if (attribute && name === "xmlns") {
          prefix = "xmlns";
          local = "";
        }
        return { prefix, local };
      }
      function attrib(parser) {
        if (!parser.strict) {
          parser.attribName = parser.attribName[parser.looseCase]();
        }
        if (parser.attribList.indexOf(parser.attribName) !== -1 || parser.tag.attributes.hasOwnProperty(parser.attribName)) {
          parser.attribName = parser.attribValue = "";
          return;
        }
        if (parser.opt.xmlns) {
          var qn = qname(parser.attribName, true);
          var prefix = qn.prefix;
          var local = qn.local;
          if (prefix === "xmlns") {
            if (local === "xml" && parser.attribValue !== XML_NAMESPACE) {
              strictFail(
                parser,
                "xml: prefix must be bound to " + XML_NAMESPACE + "\nActual: " + parser.attribValue
              );
            } else if (local === "xmlns" && parser.attribValue !== XMLNS_NAMESPACE) {
              strictFail(
                parser,
                "xmlns: prefix must be bound to " + XMLNS_NAMESPACE + "\nActual: " + parser.attribValue
              );
            } else {
              var tag = parser.tag;
              var parent = parser.tags[parser.tags.length - 1] || parser;
              if (tag.ns === parent.ns) {
                tag.ns = Object.create(parent.ns);
              }
              tag.ns[local] = parser.attribValue;
            }
          }
          parser.attribList.push([parser.attribName, parser.attribValue]);
        } else {
          parser.tag.attributes[parser.attribName] = parser.attribValue;
          emitNode(parser, "onattribute", {
            name: parser.attribName,
            value: parser.attribValue
          });
        }
        parser.attribName = parser.attribValue = "";
      }
      function openTag(parser, selfClosing) {
        if (parser.opt.xmlns) {
          var tag = parser.tag;
          var qn = qname(parser.tagName);
          tag.prefix = qn.prefix;
          tag.local = qn.local;
          tag.uri = tag.ns[qn.prefix] || "";
          if (tag.prefix && !tag.uri) {
            strictFail(parser, "Unbound namespace prefix: " + JSON.stringify(parser.tagName));
            tag.uri = qn.prefix;
          }
          var parent = parser.tags[parser.tags.length - 1] || parser;
          if (tag.ns && parent.ns !== tag.ns) {
            Object.keys(tag.ns).forEach(function(p) {
              emitNode(parser, "onopennamespace", {
                prefix: p,
                uri: tag.ns[p]
              });
            });
          }
          for (var i = 0, l = parser.attribList.length; i < l; i++) {
            var nv = parser.attribList[i];
            var name = nv[0];
            var value = nv[1];
            var qualName = qname(name, true);
            var prefix = qualName.prefix;
            var local = qualName.local;
            var uri = prefix === "" ? "" : tag.ns[prefix] || "";
            var a = {
              name,
              value,
              prefix,
              local,
              uri
            };
            if (prefix && prefix !== "xmlns" && !uri) {
              strictFail(parser, "Unbound namespace prefix: " + JSON.stringify(prefix));
              a.uri = prefix;
            }
            parser.tag.attributes[name] = a;
            emitNode(parser, "onattribute", a);
          }
          parser.attribList.length = 0;
        }
        parser.tag.isSelfClosing = !!selfClosing;
        parser.sawRoot = true;
        parser.tags.push(parser.tag);
        emitNode(parser, "onopentag", parser.tag);
        if (!selfClosing) {
          if (!parser.noscript && parser.tagName.toLowerCase() === "script") {
            parser.state = S.SCRIPT;
          } else {
            parser.state = S.TEXT;
          }
          parser.tag = null;
          parser.tagName = "";
        }
        parser.attribName = parser.attribValue = "";
        parser.attribList.length = 0;
      }
      function closeTag(parser) {
        if (!parser.tagName) {
          strictFail(parser, "Weird empty close tag.");
          parser.textNode += "</>";
          parser.state = S.TEXT;
          return;
        }
        if (parser.script) {
          if (parser.tagName !== "script") {
            parser.script += "</" + parser.tagName + ">";
            parser.tagName = "";
            parser.state = S.SCRIPT;
            return;
          }
          emitNode(parser, "onscript", parser.script);
          parser.script = "";
        }
        var t = parser.tags.length;
        var tagName = parser.tagName;
        if (!parser.strict) {
          tagName = tagName[parser.looseCase]();
        }
        var closeTo = tagName;
        while (t--) {
          var close = parser.tags[t];
          if (close.name !== closeTo) {
            strictFail(parser, "Unexpected close tag");
          } else {
            break;
          }
        }
        if (t < 0) {
          strictFail(parser, "Unmatched closing tag: " + parser.tagName);
          parser.textNode += "</" + parser.tagName + ">";
          parser.state = S.TEXT;
          return;
        }
        parser.tagName = tagName;
        var s2 = parser.tags.length;
        while (s2-- > t) {
          var tag = parser.tag = parser.tags.pop();
          parser.tagName = parser.tag.name;
          emitNode(parser, "onclosetag", parser.tagName);
          var x = {};
          for (var i in tag.ns) {
            x[i] = tag.ns[i];
          }
          var parent = parser.tags[parser.tags.length - 1] || parser;
          if (parser.opt.xmlns && tag.ns !== parent.ns) {
            Object.keys(tag.ns).forEach(function(p) {
              var n = tag.ns[p];
              emitNode(parser, "onclosenamespace", { prefix: p, uri: n });
            });
          }
        }
        if (t === 0)
          parser.closedRoot = true;
        parser.tagName = parser.attribValue = parser.attribName = "";
        parser.attribList.length = 0;
        parser.state = S.TEXT;
      }
      function parseEntity(parser) {
        var entity = parser.entity;
        var entityLC = entity.toLowerCase();
        var num;
        var numStr = "";
        if (parser.ENTITIES[entity]) {
          return parser.ENTITIES[entity];
        }
        if (parser.ENTITIES[entityLC]) {
          return parser.ENTITIES[entityLC];
        }
        entity = entityLC;
        if (entity.charAt(0) === "#") {
          if (entity.charAt(1) === "x") {
            entity = entity.slice(2);
            num = parseInt(entity, 16);
            numStr = num.toString(16);
          } else {
            entity = entity.slice(1);
            num = parseInt(entity, 10);
            numStr = num.toString(10);
          }
        }
        entity = entity.replace(/^0+/, "");
        if (isNaN(num) || numStr.toLowerCase() !== entity) {
          strictFail(parser, "Invalid character entity");
          return "&" + parser.entity + ";";
        }
        return String.fromCodePoint(num);
      }
      function beginWhiteSpace(parser, c) {
        if (c === "<") {
          parser.state = S.OPEN_WAKA;
          parser.startTagPosition = parser.position;
        } else if (!isWhitespace(c)) {
          strictFail(parser, "Non-whitespace before first tag.");
          parser.textNode = c;
          parser.state = S.TEXT;
        }
      }
      function charAt(chunk, i) {
        var result = "";
        if (i < chunk.length) {
          result = chunk.charAt(i);
        }
        return result;
      }
      function write(chunk) {
        var parser = this;
        if (this.error) {
          throw this.error;
        }
        if (parser.closed) {
          return error(
            parser,
            "Cannot write after close. Assign an onready handler."
          );
        }
        if (chunk === null) {
          return end(parser);
        }
        if (typeof chunk === "object") {
          chunk = chunk.toString();
        }
        var i = 0;
        var c = "";
        while (true) {
          c = charAt(chunk, i++);
          parser.c = c;
          if (!c) {
            break;
          }
          if (parser.trackPosition) {
            parser.position++;
            if (c === "\n") {
              parser.line++;
              parser.column = 0;
            } else {
              parser.column++;
            }
          }
          switch (parser.state) {
            case S.BEGIN:
              parser.state = S.BEGIN_WHITESPACE;
              if (c === "\uFEFF") {
                continue;
              }
              beginWhiteSpace(parser, c);
              continue;
            case S.BEGIN_WHITESPACE:
              beginWhiteSpace(parser, c);
              continue;
            case S.TEXT:
              if (parser.sawRoot && !parser.closedRoot) {
                var starti = i - 1;
                while (c && c !== "<" && c !== "&") {
                  c = charAt(chunk, i++);
                  if (c && parser.trackPosition) {
                    parser.position++;
                    if (c === "\n") {
                      parser.line++;
                      parser.column = 0;
                    } else {
                      parser.column++;
                    }
                  }
                }
                parser.textNode += chunk.substring(starti, i - 1);
              }
              if (c === "<" && !(parser.sawRoot && parser.closedRoot && !parser.strict)) {
                parser.state = S.OPEN_WAKA;
                parser.startTagPosition = parser.position;
              } else {
                if (!isWhitespace(c) && (!parser.sawRoot || parser.closedRoot)) {
                  strictFail(parser, "Text data outside of root node.");
                }
                if (c === "&") {
                  parser.state = S.TEXT_ENTITY;
                } else {
                  parser.textNode += c;
                }
              }
              continue;
            case S.SCRIPT:
              if (c === "<") {
                parser.state = S.SCRIPT_ENDING;
              } else {
                parser.script += c;
              }
              continue;
            case S.SCRIPT_ENDING:
              if (c === "/") {
                parser.state = S.CLOSE_TAG;
              } else {
                parser.script += "<" + c;
                parser.state = S.SCRIPT;
              }
              continue;
            case S.OPEN_WAKA:
              if (c === "!") {
                parser.state = S.SGML_DECL;
                parser.sgmlDecl = "";
              } else if (isWhitespace(c)) {
              } else if (isMatch(nameStart, c)) {
                parser.state = S.OPEN_TAG;
                parser.tagName = c;
              } else if (c === "/") {
                parser.state = S.CLOSE_TAG;
                parser.tagName = "";
              } else if (c === "?") {
                parser.state = S.PROC_INST;
                parser.procInstName = parser.procInstBody = "";
              } else {
                strictFail(parser, "Unencoded <");
                if (parser.startTagPosition + 1 < parser.position) {
                  var pad = parser.position - parser.startTagPosition;
                  c = new Array(pad).join(" ") + c;
                }
                parser.textNode += "<" + c;
                parser.state = S.TEXT;
              }
              continue;
            case S.SGML_DECL:
              if ((parser.sgmlDecl + c).toUpperCase() === CDATA) {
                emitNode(parser, "onopencdata");
                parser.state = S.CDATA;
                parser.sgmlDecl = "";
                parser.cdata = "";
              } else if (parser.sgmlDecl + c === "--") {
                parser.state = S.COMMENT;
                parser.comment = "";
                parser.sgmlDecl = "";
              } else if ((parser.sgmlDecl + c).toUpperCase() === DOCTYPE) {
                parser.state = S.DOCTYPE;
                if (parser.doctype || parser.sawRoot) {
                  strictFail(
                    parser,
                    "Inappropriately located doctype declaration"
                  );
                }
                parser.doctype = "";
                parser.sgmlDecl = "";
              } else if (c === ">") {
                emitNode(parser, "onsgmldeclaration", parser.sgmlDecl);
                parser.sgmlDecl = "";
                parser.state = S.TEXT;
              } else if (isQuote(c)) {
                parser.state = S.SGML_DECL_QUOTED;
                parser.sgmlDecl += c;
              } else {
                parser.sgmlDecl += c;
              }
              continue;
            case S.SGML_DECL_QUOTED:
              if (c === parser.q) {
                parser.state = S.SGML_DECL;
                parser.q = "";
              }
              parser.sgmlDecl += c;
              continue;
            case S.DOCTYPE:
              if (c === ">") {
                parser.state = S.TEXT;
                emitNode(parser, "ondoctype", parser.doctype);
                parser.doctype = true;
              } else {
                parser.doctype += c;
                if (c === "[") {
                  parser.state = S.DOCTYPE_DTD;
                } else if (isQuote(c)) {
                  parser.state = S.DOCTYPE_QUOTED;
                  parser.q = c;
                }
              }
              continue;
            case S.DOCTYPE_QUOTED:
              parser.doctype += c;
              if (c === parser.q) {
                parser.q = "";
                parser.state = S.DOCTYPE;
              }
              continue;
            case S.DOCTYPE_DTD:
              parser.doctype += c;
              if (c === "]") {
                parser.state = S.DOCTYPE;
              } else if (isQuote(c)) {
                parser.state = S.DOCTYPE_DTD_QUOTED;
                parser.q = c;
              }
              continue;
            case S.DOCTYPE_DTD_QUOTED:
              parser.doctype += c;
              if (c === parser.q) {
                parser.state = S.DOCTYPE_DTD;
                parser.q = "";
              }
              continue;
            case S.COMMENT:
              if (c === "-") {
                parser.state = S.COMMENT_ENDING;
              } else {
                parser.comment += c;
              }
              continue;
            case S.COMMENT_ENDING:
              if (c === "-") {
                parser.state = S.COMMENT_ENDED;
                parser.comment = textopts(parser.opt, parser.comment);
                if (parser.comment) {
                  emitNode(parser, "oncomment", parser.comment);
                }
                parser.comment = "";
              } else {
                parser.comment += "-" + c;
                parser.state = S.COMMENT;
              }
              continue;
            case S.COMMENT_ENDED:
              if (c !== ">") {
                strictFail(parser, "Malformed comment");
                parser.comment += "--" + c;
                parser.state = S.COMMENT;
              } else {
                parser.state = S.TEXT;
              }
              continue;
            case S.CDATA:
              if (c === "]") {
                parser.state = S.CDATA_ENDING;
              } else {
                parser.cdata += c;
              }
              continue;
            case S.CDATA_ENDING:
              if (c === "]") {
                parser.state = S.CDATA_ENDING_2;
              } else {
                parser.cdata += "]" + c;
                parser.state = S.CDATA;
              }
              continue;
            case S.CDATA_ENDING_2:
              if (c === ">") {
                if (parser.cdata) {
                  emitNode(parser, "oncdata", parser.cdata);
                }
                emitNode(parser, "onclosecdata");
                parser.cdata = "";
                parser.state = S.TEXT;
              } else if (c === "]") {
                parser.cdata += "]";
              } else {
                parser.cdata += "]]" + c;
                parser.state = S.CDATA;
              }
              continue;
            case S.PROC_INST:
              if (c === "?") {
                parser.state = S.PROC_INST_ENDING;
              } else if (isWhitespace(c)) {
                parser.state = S.PROC_INST_BODY;
              } else {
                parser.procInstName += c;
              }
              continue;
            case S.PROC_INST_BODY:
              if (!parser.procInstBody && isWhitespace(c)) {
                continue;
              } else if (c === "?") {
                parser.state = S.PROC_INST_ENDING;
              } else {
                parser.procInstBody += c;
              }
              continue;
            case S.PROC_INST_ENDING:
              if (c === ">") {
                emitNode(parser, "onprocessinginstruction", {
                  name: parser.procInstName,
                  body: parser.procInstBody
                });
                parser.procInstName = parser.procInstBody = "";
                parser.state = S.TEXT;
              } else {
                parser.procInstBody += "?" + c;
                parser.state = S.PROC_INST_BODY;
              }
              continue;
            case S.OPEN_TAG:
              if (isMatch(nameBody, c)) {
                parser.tagName += c;
              } else {
                newTag(parser);
                if (c === ">") {
                  openTag(parser);
                } else if (c === "/") {
                  parser.state = S.OPEN_TAG_SLASH;
                } else {
                  if (!isWhitespace(c)) {
                    strictFail(parser, "Invalid character in tag name");
                  }
                  parser.state = S.ATTRIB;
                }
              }
              continue;
            case S.OPEN_TAG_SLASH:
              if (c === ">") {
                openTag(parser, true);
                closeTag(parser);
              } else {
                strictFail(parser, "Forward-slash in opening tag not followed by >");
                parser.state = S.ATTRIB;
              }
              continue;
            case S.ATTRIB:
              if (isWhitespace(c)) {
                continue;
              } else if (c === ">") {
                openTag(parser);
              } else if (c === "/") {
                parser.state = S.OPEN_TAG_SLASH;
              } else if (isMatch(nameStart, c)) {
                parser.attribName = c;
                parser.attribValue = "";
                parser.state = S.ATTRIB_NAME;
              } else {
                strictFail(parser, "Invalid attribute name");
              }
              continue;
            case S.ATTRIB_NAME:
              if (c === "=") {
                parser.state = S.ATTRIB_VALUE;
              } else if (c === ">") {
                strictFail(parser, "Attribute without value");
                parser.attribValue = parser.attribName;
                attrib(parser);
                openTag(parser);
              } else if (isWhitespace(c)) {
                parser.state = S.ATTRIB_NAME_SAW_WHITE;
              } else if (isMatch(nameBody, c)) {
                parser.attribName += c;
              } else {
                strictFail(parser, "Invalid attribute name");
              }
              continue;
            case S.ATTRIB_NAME_SAW_WHITE:
              if (c === "=") {
                parser.state = S.ATTRIB_VALUE;
              } else if (isWhitespace(c)) {
                continue;
              } else {
                strictFail(parser, "Attribute without value");
                parser.tag.attributes[parser.attribName] = "";
                parser.attribValue = "";
                emitNode(parser, "onattribute", {
                  name: parser.attribName,
                  value: ""
                });
                parser.attribName = "";
                if (c === ">") {
                  openTag(parser);
                } else if (isMatch(nameStart, c)) {
                  parser.attribName = c;
                  parser.state = S.ATTRIB_NAME;
                } else {
                  strictFail(parser, "Invalid attribute name");
                  parser.state = S.ATTRIB;
                }
              }
              continue;
            case S.ATTRIB_VALUE:
              if (isWhitespace(c)) {
                continue;
              } else if (isQuote(c)) {
                parser.q = c;
                parser.state = S.ATTRIB_VALUE_QUOTED;
              } else {
                strictFail(parser, "Unquoted attribute value");
                parser.state = S.ATTRIB_VALUE_UNQUOTED;
                parser.attribValue = c;
              }
              continue;
            case S.ATTRIB_VALUE_QUOTED:
              if (c !== parser.q) {
                if (c === "&") {
                  parser.state = S.ATTRIB_VALUE_ENTITY_Q;
                } else {
                  parser.attribValue += c;
                }
                continue;
              }
              attrib(parser);
              parser.q = "";
              parser.state = S.ATTRIB_VALUE_CLOSED;
              continue;
            case S.ATTRIB_VALUE_CLOSED:
              if (isWhitespace(c)) {
                parser.state = S.ATTRIB;
              } else if (c === ">") {
                openTag(parser);
              } else if (c === "/") {
                parser.state = S.OPEN_TAG_SLASH;
              } else if (isMatch(nameStart, c)) {
                strictFail(parser, "No whitespace between attributes");
                parser.attribName = c;
                parser.attribValue = "";
                parser.state = S.ATTRIB_NAME;
              } else {
                strictFail(parser, "Invalid attribute name");
              }
              continue;
            case S.ATTRIB_VALUE_UNQUOTED:
              if (!isAttribEnd(c)) {
                if (c === "&") {
                  parser.state = S.ATTRIB_VALUE_ENTITY_U;
                } else {
                  parser.attribValue += c;
                }
                continue;
              }
              attrib(parser);
              if (c === ">") {
                openTag(parser);
              } else {
                parser.state = S.ATTRIB;
              }
              continue;
            case S.CLOSE_TAG:
              if (!parser.tagName) {
                if (isWhitespace(c)) {
                  continue;
                } else if (notMatch(nameStart, c)) {
                  if (parser.script) {
                    parser.script += "</" + c;
                    parser.state = S.SCRIPT;
                  } else {
                    strictFail(parser, "Invalid tagname in closing tag.");
                  }
                } else {
                  parser.tagName = c;
                }
              } else if (c === ">") {
                closeTag(parser);
              } else if (isMatch(nameBody, c)) {
                parser.tagName += c;
              } else if (parser.script) {
                parser.script += "</" + parser.tagName;
                parser.tagName = "";
                parser.state = S.SCRIPT;
              } else {
                if (!isWhitespace(c)) {
                  strictFail(parser, "Invalid tagname in closing tag");
                }
                parser.state = S.CLOSE_TAG_SAW_WHITE;
              }
              continue;
            case S.CLOSE_TAG_SAW_WHITE:
              if (isWhitespace(c)) {
                continue;
              }
              if (c === ">") {
                closeTag(parser);
              } else {
                strictFail(parser, "Invalid characters in closing tag");
              }
              continue;
            case S.TEXT_ENTITY:
            case S.ATTRIB_VALUE_ENTITY_Q:
            case S.ATTRIB_VALUE_ENTITY_U:
              var returnState;
              var buffer;
              switch (parser.state) {
                case S.TEXT_ENTITY:
                  returnState = S.TEXT;
                  buffer = "textNode";
                  break;
                case S.ATTRIB_VALUE_ENTITY_Q:
                  returnState = S.ATTRIB_VALUE_QUOTED;
                  buffer = "attribValue";
                  break;
                case S.ATTRIB_VALUE_ENTITY_U:
                  returnState = S.ATTRIB_VALUE_UNQUOTED;
                  buffer = "attribValue";
                  break;
              }
              if (c === ";") {
                parser[buffer] += parseEntity(parser);
                parser.entity = "";
                parser.state = returnState;
              } else if (isMatch(parser.entity.length ? entityBody : entityStart, c)) {
                parser.entity += c;
              } else {
                strictFail(parser, "Invalid character in entity name");
                parser[buffer] += "&" + parser.entity + c;
                parser.entity = "";
                parser.state = returnState;
              }
              continue;
            default:
              throw new Error(parser, "Unknown state: " + parser.state);
          }
        }
        if (parser.position >= parser.bufferCheckPosition) {
          checkBufferLength(parser);
        }
        return parser;
      }
      if (!String.fromCodePoint) {
        (function() {
          var stringFromCharCode = String.fromCharCode;
          var floor = Math.floor;
          var fromCodePoint = function() {
            var MAX_SIZE = 16384;
            var codeUnits = [];
            var highSurrogate;
            var lowSurrogate;
            var index = -1;
            var length = arguments.length;
            if (!length) {
              return "";
            }
            var result = "";
            while (++index < length) {
              var codePoint = Number(arguments[index]);
              if (!isFinite(codePoint) || // `NaN`, `+Infinity`, or `-Infinity`
              codePoint < 0 || // not a valid Unicode code point
              codePoint > 1114111 || // not a valid Unicode code point
              floor(codePoint) !== codePoint) {
                throw RangeError("Invalid code point: " + codePoint);
              }
              if (codePoint <= 65535) {
                codeUnits.push(codePoint);
              } else {
                codePoint -= 65536;
                highSurrogate = (codePoint >> 10) + 55296;
                lowSurrogate = codePoint % 1024 + 56320;
                codeUnits.push(highSurrogate, lowSurrogate);
              }
              if (index + 1 === length || codeUnits.length > MAX_SIZE) {
                result += stringFromCharCode.apply(null, codeUnits);
                codeUnits.length = 0;
              }
            }
            return result;
          };
          if (Object.defineProperty) {
            Object.defineProperty(String, "fromCodePoint", {
              value: fromCodePoint,
              configurable: true,
              writable: true
            });
          } else {
            String.fromCodePoint = fromCodePoint;
          }
        })();
      }
    })(typeof exports === "undefined" ? exports.sax = {} : exports);
  }
});

// node_modules/stylus/lib/functions/image.js
var require_image = __commonJS({
  "node_modules/stylus/lib/functions/image.js"(exports, module2) {
    var utils = require_utils();
    var Buffer2 = require("buffer").Buffer;
    var fs = require("fs");
    var path = require("path");
    var sax = require_sax();
    var Image = module2.exports = function Image2(ctx, path2) {
      this.ctx = ctx;
      this.path = utils.lookup(path2, ctx.paths);
      if (!this.path)
        throw new Error("failed to locate file " + path2);
    };
    Image.prototype.open = function() {
      this.fd = fs.openSync(this.path, "r");
      this.length = fs.fstatSync(this.fd).size;
      this.extname = path.extname(this.path).slice(1);
    };
    Image.prototype.close = function() {
      if (this.fd)
        fs.closeSync(this.fd);
    };
    Image.prototype.type = function() {
      var type, buf = Buffer2.alloc(4);
      fs.readSync(this.fd, buf, 0, 4, 0);
      if (71 == buf[0] && 73 == buf[1] && 70 == buf[2])
        type = "gif";
      else if (80 == buf[1] && 78 == buf[2] && 71 == buf[3])
        type = "png";
      else if (255 == buf[0] && 216 == buf[1])
        type = "jpeg";
      else if ("svg" == this.extname)
        type = this.extname;
      return type;
    };
    Image.prototype.size = function() {
      var type = this.type(), width, height, buf, offset, blockSize, parser;
      function uint16(b) {
        return b[1] << 8 | b[0];
      }
      function uint32(b) {
        return b[0] << 24 | b[1] << 16 | b[2] << 8 | b[3];
      }
      switch (type) {
        case "jpeg":
          buf = Buffer2.alloc(this.length);
          fs.readSync(this.fd, buf, 0, this.length, 0);
          offset = 4;
          blockSize = buf[offset] << 8 | buf[offset + 1];
          while (offset < this.length) {
            offset += blockSize;
            if (offset >= this.length || 255 != buf[offset])
              break;
            if (192 == buf[offset + 1] || 194 == buf[offset + 1]) {
              height = buf[offset + 5] << 8 | buf[offset + 6];
              width = buf[offset + 7] << 8 | buf[offset + 8];
            } else {
              offset += 2;
              blockSize = buf[offset] << 8 | buf[offset + 1];
            }
          }
          break;
        case "png":
          buf = Buffer2.alloc(8);
          fs.readSync(this.fd, buf, 0, 8, 16);
          width = uint32(buf);
          height = uint32(buf.slice(4, 8));
          break;
        case "gif":
          buf = Buffer2.alloc(4);
          fs.readSync(this.fd, buf, 0, 4, 6);
          width = uint16(buf);
          height = uint16(buf.slice(2, 4));
          break;
        case "svg":
          offset = Math.min(this.length, 1024);
          buf = Buffer2.alloc(offset);
          fs.readSync(this.fd, buf, 0, offset, 0);
          buf = buf.toString("utf8");
          parser = sax.parser(true);
          parser.onopentag = function(node) {
            if ("svg" == node.name && node.attributes.width && node.attributes.height) {
              width = parseInt(node.attributes.width, 10);
              height = parseInt(node.attributes.height, 10);
            }
          };
          parser.write(buf).close();
          break;
      }
      if ("number" != typeof width)
        throw new Error('failed to find width of "' + this.path + '"');
      if ("number" != typeof height)
        throw new Error('failed to find height of "' + this.path + '"');
      return [width, height];
    };
  }
});

// node_modules/stylus/lib/functions/image-size.js
var require_image_size = __commonJS({
  "node_modules/stylus/lib/functions/image-size.js"(exports, module2) {
    var utils = require_utils();
    var nodes = require_nodes();
    var Image = require_image();
    function imageSize(img, ignoreErr) {
      utils.assertType(img, "string", "img");
      try {
        var img = new Image(this, img.string);
      } catch (err) {
        if (ignoreErr) {
          return [new nodes.Unit(0), new nodes.Unit(0)];
        } else {
          throw err;
        }
      }
      img.open();
      var size = img.size();
      img.close();
      var expr = [];
      expr.push(new nodes.Unit(size[0], "px"));
      expr.push(new nodes.Unit(size[1], "px"));
      return expr;
    }
    imageSize.params = ["img", "ignoreErr"];
    module2.exports = imageSize;
  }
});

// node_modules/stylus/lib/functions/json.js
var require_json = __commonJS({
  "node_modules/stylus/lib/functions/json.js"(exports, module2) {
    var utils = require_utils();
    var nodes = require_nodes();
    var readFile = require("fs").readFileSync;
    function json(path, local, namePrefix) {
      utils.assertString(path, "path");
      path = path.string;
      var found = utils.lookup(path, this.options.paths, this.options.filename), options = local && "object" == local.nodeName && local;
      if (!found) {
        if (options && options.get("optional").toBoolean().isTrue) {
          return nodes.null;
        }
        throw new Error("failed to locate .json file " + path);
      }
      var json2 = JSON.parse(readFile(found, "utf8"));
      if (options) {
        return convert(json2, options);
      } else {
        oldJson.call(this, json2, local, namePrefix);
      }
      function convert(obj, options2) {
        var ret = new nodes.Object(), leaveStrings = options2.get("leave-strings").toBoolean();
        for (var key in obj) {
          var val = obj[key];
          if ("object" == typeof val) {
            ret.set(key, convert(val, options2));
          } else {
            val = utils.coerce(val);
            if ("string" == val.nodeName && leaveStrings.isFalse) {
              val = utils.parseString(val.string);
            }
            ret.set(key, val);
          }
        }
        return ret;
      }
    }
    json.params = ["path", "local", "namePrefix"];
    module2.exports = json;
    function oldJson(json2, local, namePrefix) {
      if (namePrefix) {
        utils.assertString(namePrefix, "namePrefix");
        namePrefix = namePrefix.val;
      } else {
        namePrefix = "";
      }
      local = local ? local.toBoolean() : new nodes.Boolean(local);
      var scope = local.isTrue ? this.currentScope : this.global.scope;
      convert(json2);
      return;
      function convert(obj, prefix) {
        prefix = prefix ? prefix + "-" : "";
        for (var key in obj) {
          var val = obj[key];
          var name = prefix + key;
          if ("object" == typeof val) {
            convert(val, name);
          } else {
            val = utils.coerce(val);
            if ("string" == val.nodeName)
              val = utils.parseString(val.string);
            scope.add({ name: namePrefix + name, val });
          }
        }
      }
    }
  }
});

// node_modules/stylus/lib/functions/length.js
var require_length = __commonJS({
  "node_modules/stylus/lib/functions/length.js"(exports, module2) {
    var utils = require_utils();
    (module2.exports = function length(expr) {
      if (expr) {
        if (expr.nodes) {
          var nodes = utils.unwrap(expr).nodes;
          if (1 == nodes.length && "object" == nodes[0].nodeName) {
            return nodes[0].length;
          } else if (1 == nodes.length && "string" == nodes[0].nodeName) {
            return nodes[0].val.length;
          } else {
            return nodes.length;
          }
        } else {
          return 1;
        }
      }
      return 0;
    }).raw = true;
  }
});

// node_modules/stylus/lib/functions/lightness.js
var require_lightness = __commonJS({
  "node_modules/stylus/lib/functions/lightness.js"(exports, module2) {
    var nodes = require_nodes();
    var hsla = require_hsla();
    var component = require_component();
    function lightness(color, value) {
      if (value) {
        var hslaColor = color.hsla;
        return hsla(
          new nodes.Unit(hslaColor.h),
          new nodes.Unit(hslaColor.s),
          value,
          new nodes.Unit(hslaColor.a)
        );
      }
      return component(color, new nodes.String("lightness"));
    }
    lightness.params = ["color", "value"];
    module2.exports = lightness;
  }
});

// node_modules/stylus/lib/functions/list-separator.js
var require_list_separator = __commonJS({
  "node_modules/stylus/lib/functions/list-separator.js"(exports, module2) {
    var utils = require_utils();
    var nodes = require_nodes();
    (module2.exports = function listSeparator(list) {
      list = utils.unwrap(list);
      return new nodes.String(list.isList ? "," : " ");
    }).raw = true;
  }
});

// node_modules/stylus/lib/functions/lookup.js
var require_lookup = __commonJS({
  "node_modules/stylus/lib/functions/lookup.js"(exports, module2) {
    var utils = require_utils();
    var nodes = require_nodes();
    function lookup(name) {
      utils.assertType(name, "string", "name");
      var node = this.lookup(name.val);
      if (!node)
        return nodes.null;
      return this.visit(node);
    }
    lookup.params = ["name"];
    module2.exports = lookup;
  }
});

// node_modules/stylus/lib/functions/match.js
var require_match = __commonJS({
  "node_modules/stylus/lib/functions/match.js"(exports, module2) {
    var utils = require_utils();
    var nodes = require_nodes();
    var VALID_FLAGS = "igm";
    function match(pattern, val, flags) {
      utils.assertType(pattern, "string", "pattern");
      utils.assertString(val, "val");
      var re = new RegExp(pattern.val, validateFlags(flags) ? flags.string : "");
      return val.string.match(re);
    }
    match.params = ["pattern", "val", "flags"];
    module2.exports = match;
    function validateFlags(flags) {
      flags = flags && flags.string;
      if (flags) {
        return flags.split("").every(function(flag) {
          return ~VALID_FLAGS.indexOf(flag);
        });
      }
      return false;
    }
  }
});

// node_modules/stylus/lib/functions/math.js
var require_math = __commonJS({
  "node_modules/stylus/lib/functions/math.js"(exports, module2) {
    var utils = require_utils();
    var nodes = require_nodes();
    function math(n, fn) {
      utils.assertType(n, "unit", "n");
      utils.assertString(fn, "fn");
      return new nodes.Unit(Math[fn.string](n.val), n.type);
    }
    math.params = ["n", "fn"];
    module2.exports = math;
  }
});

// node_modules/stylus/lib/functions/merge.js
var require_merge = __commonJS({
  "node_modules/stylus/lib/functions/merge.js"(exports, module2) {
    var utils = require_utils();
    (module2.exports = function merge(dest) {
      utils.assertPresent(dest, "dest");
      dest = utils.unwrap(dest).first;
      utils.assertType(dest, "object", "dest");
      var last = utils.unwrap(arguments[arguments.length - 1]).first, deep = true === last.val;
      for (var i = 1, len = arguments.length - deep; i < len; ++i) {
        utils.merge(dest.vals, utils.unwrap(arguments[i]).first.vals, deep);
      }
      return dest;
    }).raw = true;
  }
});

// node_modules/stylus/lib/functions/operate.js
var require_operate = __commonJS({
  "node_modules/stylus/lib/functions/operate.js"(exports, module2) {
    var utils = require_utils();
    function operate(op, left, right) {
      utils.assertType(op, "string", "op");
      utils.assertPresent(left, "left");
      utils.assertPresent(right, "right");
      return left.operate(op.val, right);
    }
    operate.params = ["op", "left", "right"];
    module2.exports = operate;
  }
});

// node_modules/stylus/lib/functions/opposite-position.js
var require_opposite_position = __commonJS({
  "node_modules/stylus/lib/functions/opposite-position.js"(exports, module2) {
    var utils = require_utils();
    var nodes = require_nodes();
    (module2.exports = function oppositePosition(positions) {
      var expr = [];
      utils.unwrap(positions).nodes.forEach(function(pos, i) {
        utils.assertString(pos, "position " + i);
        pos = function() {
          switch (pos.string) {
            case "top":
              return "bottom";
            case "bottom":
              return "top";
            case "left":
              return "right";
            case "right":
              return "left";
            case "center":
              return "center";
            default:
              throw new Error("invalid position " + pos);
          }
        }();
        expr.push(new nodes.Literal(pos));
      });
      return expr;
    }).raw = true;
  }
});

// node_modules/stylus/lib/functions/p.js
var require_p = __commonJS({
  "node_modules/stylus/lib/functions/p.js"(exports, module2) {
    var utils = require_utils();
    var nodes = require_nodes();
    (module2.exports = function p() {
      [].slice.call(arguments).forEach(function(expr) {
        expr = utils.unwrap(expr);
        if (!expr.nodes.length)
          return;
        console.log("\x1B[90minspect:\x1B[0m %s", expr.toString().replace(/^\(|\)$/g, ""));
      });
      return nodes.null;
    }).raw = true;
  }
});

// node_modules/stylus/lib/functions/pathjoin.js
var require_pathjoin = __commonJS({
  "node_modules/stylus/lib/functions/pathjoin.js"(exports, module2) {
    var path = require("path");
    (module2.exports = function pathjoin() {
      var paths = [].slice.call(arguments).map(function(path2) {
        return path2.first.string;
      });
      return path.join.apply(null, paths).replace(/\\/g, "/");
    }).raw = true;
  }
});

// node_modules/stylus/lib/functions/pop.js
var require_pop = __commonJS({
  "node_modules/stylus/lib/functions/pop.js"(exports, module2) {
    var utils = require_utils();
    (module2.exports = function pop(expr) {
      expr = utils.unwrap(expr);
      return expr.nodes.pop();
    }).raw = true;
  }
});

// node_modules/stylus/lib/functions/push.js
var require_push = __commonJS({
  "node_modules/stylus/lib/functions/push.js"(exports, module2) {
    var utils = require_utils();
    (module2.exports = function(expr) {
      expr = utils.unwrap(expr);
      for (var i = 1, len = arguments.length; i < len; ++i) {
        expr.nodes.push(utils.unwrap(arguments[i]).clone());
      }
      return expr.nodes.length;
    }).raw = true;
  }
});

// node_modules/stylus/lib/functions/range.js
var require_range = __commonJS({
  "node_modules/stylus/lib/functions/range.js"(exports, module2) {
    var utils = require_utils();
    var nodes = require_nodes();
    function range(start, stop, step) {
      utils.assertType(start, "unit", "start");
      utils.assertType(stop, "unit", "stop");
      if (step) {
        utils.assertType(step, "unit", "step");
        if (0 == step.val) {
          throw new Error('ArgumentError: "step" argument must not be zero');
        }
      } else {
        step = new nodes.Unit(1);
      }
      var list = new nodes.Expression();
      for (var i = start.val; i <= stop.val; i += step.val) {
        list.push(new nodes.Unit(i, start.type));
      }
      return list;
    }
    range.params = ["start", "stop", "step"];
    module2.exports = range;
  }
});

// node_modules/stylus/lib/functions/red.js
var require_red = __commonJS({
  "node_modules/stylus/lib/functions/red.js"(exports, module2) {
    var nodes = require_nodes();
    var rgba = require_rgba();
    function red(color, value) {
      color = color.rgba;
      if (value) {
        return rgba(
          value,
          new nodes.Unit(color.g),
          new nodes.Unit(color.b),
          new nodes.Unit(color.a)
        );
      }
      return new nodes.Unit(color.r, "");
    }
    red.params = ["color", "value"];
    module2.exports = red;
  }
});

// node_modules/stylus/lib/functions/remove.js
var require_remove = __commonJS({
  "node_modules/stylus/lib/functions/remove.js"(exports, module2) {
    var utils = require_utils();
    function remove(object, key) {
      utils.assertType(object, "object", "object");
      utils.assertString(key, "key");
      delete object.vals[key.string];
      return object;
    }
    remove.params = ["object", "key"];
    module2.exports = remove;
  }
});

// node_modules/stylus/lib/functions/replace.js
var require_replace = __commonJS({
  "node_modules/stylus/lib/functions/replace.js"(exports, module2) {
    var utils = require_utils();
    var nodes = require_nodes();
    function replace(pattern, replacement, val) {
      utils.assertString(pattern, "pattern");
      utils.assertString(replacement, "replacement");
      utils.assertString(val, "val");
      pattern = new RegExp(pattern.string, "g");
      var res = val.string.replace(pattern, replacement.string);
      return val instanceof nodes.Ident ? new nodes.Ident(res) : new nodes.String(res);
    }
    replace.params = ["pattern", "replacement", "val"];
    module2.exports = replace;
  }
});

// node_modules/stylus/lib/functions/rgb.js
var require_rgb = __commonJS({
  "node_modules/stylus/lib/functions/rgb.js"(exports, module2) {
    var utils = require_utils();
    var nodes = require_nodes();
    var rgba = require_rgba();
    function rgb(red, green, blue) {
      switch (arguments.length) {
        case 1:
          utils.assertColor(red);
          var color = red.rgba;
          return new nodes.RGBA(
            color.r,
            color.g,
            color.b,
            1
          );
        default:
          return rgba(
            red,
            green,
            blue,
            new nodes.Unit(1)
          );
      }
    }
    rgb.params = ["red", "green", "blue"];
    module2.exports = rgb;
  }
});

// node_modules/stylus/lib/functions/convert-angle.js
var require_convert_angle = __commonJS({
  "node_modules/stylus/lib/functions/convert-angle.js"(exports, module2) {
    module2.exports = function convertAngle(value, unitName) {
      var factors = {
        "rad": 1,
        "deg": 180 / Math.PI,
        "turn": 0.5 / Math.PI,
        "grad": 200 / Math.PI
      };
      return value * factors[unitName];
    };
  }
});

// node_modules/stylus/lib/functions/atan.js
var require_atan = __commonJS({
  "node_modules/stylus/lib/functions/atan.js"(exports, module2) {
    var nodes = require_nodes();
    var convert = require_convert_angle();
    module2.exports = function atan(trigValue, output) {
      var output = typeof output !== "undefined" ? output : "deg";
      var value = Math.atan(trigValue);
      var m = Math.pow(10, 9);
      var convertedValue = convert(value, output);
      convertedValue = Math.round(convertedValue * m) / m;
      return new nodes.Unit(convertedValue, output);
    };
  }
});

// node_modules/stylus/lib/functions/asin.js
var require_asin = __commonJS({
  "node_modules/stylus/lib/functions/asin.js"(exports, module2) {
    var nodes = require_nodes();
    var convert = require_convert_angle();
    module2.exports = function atan(trigValue, output) {
      var output = typeof output !== "undefined" ? output : "deg";
      var m = Math.pow(10, 9);
      var value = Math.asin(trigValue);
      var convertedValue = convert(value, output);
      convertedValue = Math.round(convertedValue * m) / m;
      return new nodes.Unit(convertedValue, output);
    };
  }
});

// node_modules/stylus/lib/functions/acos.js
var require_acos = __commonJS({
  "node_modules/stylus/lib/functions/acos.js"(exports, module2) {
    var nodes = require_nodes();
    var convert = require_convert_angle();
    var asin = require_asin();
    module2.exports = function acos(trigValue, output) {
      var output = typeof output !== "undefined" ? output : "deg";
      var convertedValue = convert(Math.PI / 2, output) - asin(trigValue, output).val;
      var m = Math.pow(10, 9);
      convertedValue = Math.round(convertedValue * m) / m;
      return new nodes.Unit(convertedValue, output);
    };
  }
});

// node_modules/stylus/lib/visitor/compiler.js
var require_compiler = __commonJS({
  "node_modules/stylus/lib/visitor/compiler.js"(exports, module2) {
    var Visitor = require_visitor();
    var utils = require_utils();
    var fs = require("fs");
    var Compiler = module2.exports = function Compiler2(root, options) {
      options = options || {};
      this.compress = options.compress;
      this.firebug = options.firebug;
      this.linenos = options.linenos;
      this.spaces = options["indent spaces"] || 2;
      this.indents = 1;
      Visitor.call(this, root);
      this.stack = [];
    };
    Compiler.prototype.__proto__ = Visitor.prototype;
    Compiler.prototype.compile = function() {
      return this.visit(this.root);
    };
    Compiler.prototype.out = function(str, node) {
      return str;
    };
    Compiler.prototype.__defineGetter__("indent", function() {
      if (this.compress)
        return "";
      return new Array(this.indents).join(Array(this.spaces + 1).join(" "));
    });
    Compiler.prototype.needBrackets = function(node) {
      return 1 == this.indents || "atrule" != node.nodeName || node.hasOnlyProperties;
    };
    Compiler.prototype.visitRoot = function(block) {
      this.buf = "";
      for (var i = 0, len = block.nodes.length; i < len; ++i) {
        var node = block.nodes[i];
        if (this.linenos || this.firebug)
          this.debugInfo(node);
        var ret = this.visit(node);
        if (ret)
          this.buf += this.out(ret + "\n", node);
      }
      return this.buf;
    };
    Compiler.prototype.visitBlock = function(block) {
      var node, separator = this.compress ? "" : "\n", needBrackets, lastPropertyIndex;
      if (block.hasProperties && !block.lacksRenderedSelectors) {
        needBrackets = this.needBrackets(block.node);
        if (this.compress) {
          for (var i = block.nodes.length - 1; i >= 0; --i) {
            if (block.nodes[i].nodeName === "property") {
              lastPropertyIndex = i;
              break;
            }
          }
        }
        if (needBrackets) {
          this.buf += this.out(this.compress ? "{" : " {\n");
          ++this.indents;
        }
        for (var i = 0, len = block.nodes.length; i < len; ++i) {
          this.last = lastPropertyIndex === i;
          node = block.nodes[i];
          switch (node.nodeName) {
            case "null":
            case "expression":
            case "function":
            case "group":
            case "block":
            case "unit":
            case "media":
            case "keyframes":
            case "atrule":
            case "supports":
              continue;
            case (!this.compress && node.inline && "comment"):
              this.buf = this.buf.slice(0, -1);
              this.buf += this.out(" " + this.visit(node) + "\n", node);
              break;
            case "property":
              var ret = this.visit(node) + separator;
              this.buf += this.compress ? ret : this.out(ret, node);
              break;
            default:
              this.buf += this.out(this.visit(node) + separator, node);
          }
        }
        if (needBrackets) {
          --this.indents;
          this.buf += this.out(this.indent + "}" + separator);
        }
      }
      for (var i = 0, len = block.nodes.length; i < len; ++i) {
        node = block.nodes[i];
        switch (node.nodeName) {
          case "group":
          case "block":
          case "keyframes":
            if (this.linenos || this.firebug)
              this.debugInfo(node);
            this.visit(node);
            break;
          case "media":
          case "import":
          case "atrule":
          case "supports":
            this.visit(node);
            break;
          case "comment":
            if (!node.suppress) {
              this.buf += this.out(this.indent + this.visit(node) + "\n", node);
            }
            break;
          case "charset":
          case "literal":
          case "namespace":
            this.buf += this.out(this.visit(node) + "\n", node);
            break;
        }
      }
    };
    Compiler.prototype.visitKeyframes = function(node) {
      if (!node.frames)
        return;
      var prefix = "official" == node.prefix ? "" : "-" + node.prefix + "-";
      this.buf += this.out("@" + prefix + "keyframes " + this.visit(node.val) + (this.compress ? "{" : " {\n"), node);
      this.keyframe = true;
      ++this.indents;
      this.visit(node.block);
      --this.indents;
      this.keyframe = false;
      this.buf += this.out("}" + (this.compress ? "" : "\n"));
    };
    Compiler.prototype.visitMedia = function(media) {
      var val = media.val;
      if (!media.hasOutput || !val.nodes.length)
        return;
      this.buf += this.out("@media ", media);
      this.visit(val);
      this.buf += this.out(this.compress ? "{" : " {\n");
      ++this.indents;
      this.visit(media.block);
      --this.indents;
      this.buf += this.out("}" + (this.compress ? "" : "\n"));
    };
    Compiler.prototype.visitQueryList = function(queries) {
      for (var i = 0, len = queries.nodes.length; i < len; ++i) {
        this.visit(queries.nodes[i]);
        if (len - 1 != i)
          this.buf += this.out("," + (this.compress ? "" : " "));
      }
    };
    Compiler.prototype.visitQuery = function(node) {
      var len = node.nodes.length;
      if (node.predicate)
        this.buf += this.out(node.predicate + " ");
      if (node.type)
        this.buf += this.out(node.type + (len ? " and " : ""));
      for (var i = 0; i < len; ++i) {
        this.buf += this.out(this.visit(node.nodes[i]));
        if (len - 1 != i)
          this.buf += this.out(" and ");
      }
    };
    Compiler.prototype.visitFeature = function(node) {
      if (!node.expr) {
        return node.name;
      } else if (node.expr.isEmpty) {
        return "(" + node.name + ")";
      } else {
        return "(" + node.name + ":" + (this.compress ? "" : " ") + this.visit(node.expr) + ")";
      }
    };
    Compiler.prototype.visitImport = function(imported) {
      this.buf += this.out("@import " + this.visit(imported.path) + ";\n", imported);
    };
    Compiler.prototype.visitAtrule = function(atrule) {
      var newline = this.compress ? "" : "\n";
      this.buf += this.out(this.indent + "@" + atrule.type, atrule);
      if (atrule.val)
        this.buf += this.out(" " + atrule.val.trim());
      if (atrule.block) {
        if (atrule.block.isEmpty) {
          this.buf += this.out((this.compress ? "" : " ") + "{}" + newline);
        } else if (atrule.hasOnlyProperties) {
          this.visit(atrule.block);
        } else {
          this.buf += this.out(this.compress ? "{" : " {\n");
          ++this.indents;
          this.visit(atrule.block);
          --this.indents;
          this.buf += this.out(this.indent + "}" + newline);
        }
      } else {
        this.buf += this.out(";" + newline);
      }
    };
    Compiler.prototype.visitSupports = function(node) {
      if (!node.hasOutput)
        return;
      this.buf += this.out(this.indent + "@supports ", node);
      this.isCondition = true;
      this.buf += this.out(this.visit(node.condition));
      this.isCondition = false;
      this.buf += this.out(this.compress ? "{" : " {\n");
      ++this.indents;
      this.visit(node.block);
      --this.indents;
      this.buf += this.out(this.indent + "}" + (this.compress ? "" : "\n"));
    }, /**
     * Visit Comment.
     */
    Compiler.prototype.visitComment = function(comment) {
      return this.compress ? comment.suppress ? "" : comment.str : comment.str;
    };
    Compiler.prototype.visitFunction = function(fn) {
      return fn.name;
    };
    Compiler.prototype.visitCharset = function(charset) {
      return "@charset " + this.visit(charset.val) + ";";
    };
    Compiler.prototype.visitNamespace = function(namespace) {
      return "@namespace " + (namespace.prefix ? this.visit(namespace.prefix) + " " : "") + this.visit(namespace.val) + ";";
    };
    Compiler.prototype.visitLiteral = function(lit) {
      var val = lit.val;
      if (lit.css)
        val = val.replace(/^  /gm, "");
      return val;
    };
    Compiler.prototype.visitBoolean = function(bool) {
      return bool.toString();
    };
    Compiler.prototype.visitRGBA = function(rgba) {
      return rgba.toString();
    };
    Compiler.prototype.visitHSLA = function(hsla) {
      return hsla.rgba.toString();
    };
    Compiler.prototype.visitUnit = function(unit) {
      var type = unit.type || "", n = unit.val, float = n != (n | 0);
      if (this.compress) {
        if (!["%", "s", "ms", "deg", "fr"].includes(type) && 0 == n)
          return "0";
        if (float && n < 1 && n > -1) {
          return n.toString().replace("0.", ".") + type;
        }
      }
      return (float ? parseFloat(n.toFixed(15)) : n).toString() + type;
    };
    Compiler.prototype.visitGroup = function(group) {
      var stack = this.keyframe ? [] : this.stack, comma = this.compress ? "," : ",\n";
      stack.push(group.nodes);
      if (group.block.hasProperties) {
        var selectors = utils.compileSelectors.call(this, stack), len = selectors.length;
        if (len) {
          if (this.keyframe)
            comma = this.compress ? "," : ", ";
          for (var i = 0; i < len; ++i) {
            var selector = selectors[i], last = i == len - 1;
            if (this.keyframe)
              selector = i ? selector.trim() : selector;
            this.buf += this.out(selector + (last ? "" : comma), group.nodes[i]);
          }
        } else {
          group.block.lacksRenderedSelectors = true;
        }
      }
      this.visit(group.block);
      stack.pop();
    };
    Compiler.prototype.visitIdent = function(ident) {
      return ident.name;
    };
    Compiler.prototype.visitString = function(string) {
      return this.isURL ? string.val : string.toString();
    };
    Compiler.prototype.visitNull = function(node) {
      return "";
    };
    Compiler.prototype.visitCall = function(call) {
      this.isURL = "url" == call.name;
      var args = call.args.nodes.map(function(arg) {
        return this.visit(arg);
      }, this).join(this.compress ? "," : ", ");
      if (this.isURL)
        args = '"' + args + '"';
      this.isURL = false;
      return call.name + "(" + args + ")";
    };
    Compiler.prototype.visitExpression = function(expr) {
      var buf = [], self = this, len = expr.nodes.length, nodes = expr.nodes.map(function(node) {
        return self.visit(node);
      });
      nodes.forEach(function(node, i) {
        var last = i == len - 1;
        buf.push(node);
        if ("/" == nodes[i + 1] || "/" == node)
          return;
        if (last)
          return;
        var space = self.isURL || self.isCondition && (")" == nodes[i + 1] || "(" == node) ? "" : " ";
        buf.push(expr.isList ? self.compress ? "," : ", " : space);
      });
      return buf.join("");
    };
    Compiler.prototype.visitArguments = Compiler.prototype.visitExpression;
    Compiler.prototype.visitProperty = function(prop) {
      var val = this.visit(prop.expr).trim(), name = prop.name || prop.segments.join(""), arr = [];
      if (name === "@apply") {
        arr.push(
          this.out(this.indent),
          this.out(name + " ", prop),
          this.out(val, prop.expr),
          this.out(this.compress ? this.last ? "" : ";" : ";")
        );
        return arr.join("");
      }
      arr.push(
        this.out(this.indent),
        this.out(name + (this.compress ? ":" : ": "), prop),
        this.out(val, prop.expr),
        this.out(this.compress ? this.last ? "" : ";" : ";")
      );
      return arr.join("");
    };
    Compiler.prototype.debugInfo = function(node) {
      var path = node.filename == "stdin" ? "stdin" : fs.realpathSync(node.filename), line = (node.nodes && node.nodes.length ? node.nodes[0].lineno : node.lineno) || 1;
      if (this.linenos) {
        this.buf += "\n/* line " + line + " : " + path + " */\n";
      }
      if (this.firebug) {
        path = "file\\:\\/\\/" + path.replace(/([.:/\\])/g, function(m) {
          return "\\" + (m === "\\" ? "/" : m);
        });
        line = "\\00003" + line;
        this.buf += "\n@media -stylus-debug-info{filename{font-family:" + path + "}line{font-family:" + line + "}}\n";
      }
    };
  }
});

// node_modules/stylus/lib/functions/s.js
var require_s = __commonJS({
  "node_modules/stylus/lib/functions/s.js"(exports, module2) {
    var utils = require_utils();
    var nodes = require_nodes();
    var Compiler = require_compiler();
    (module2.exports = function s(fmt) {
      fmt = utils.unwrap(fmt).nodes[0];
      utils.assertString(fmt);
      var self = this, str = fmt.string, args = arguments, i = 1;
      str = str.replace(/%(s|d)/g, function(_, specifier) {
        var arg = args[i++] || nodes.null;
        switch (specifier) {
          case "s":
            return new Compiler(arg, self.options).compile();
          case "d":
            arg = utils.unwrap(arg).first;
            if ("unit" != arg.nodeName)
              throw new Error("%d requires a unit");
            return arg.val;
        }
      });
      return new nodes.Literal(str);
    }).raw = true;
  }
});

// node_modules/stylus/lib/functions/saturation.js
var require_saturation = __commonJS({
  "node_modules/stylus/lib/functions/saturation.js"(exports, module2) {
    var nodes = require_nodes();
    var hsla = require_hsla();
    var component = require_component();
    function saturation(color, value) {
      if (value) {
        var hslaColor = color.hsla;
        return hsla(
          new nodes.Unit(hslaColor.h),
          value,
          new nodes.Unit(hslaColor.l),
          new nodes.Unit(hslaColor.a)
        );
      }
      return component(color, new nodes.String("saturation"));
    }
    saturation.params = ["color", "value"];
    module2.exports = saturation;
  }
});

// node_modules/stylus/lib/visitor/normalizer.js
var require_normalizer = __commonJS({
  "node_modules/stylus/lib/visitor/normalizer.js"(exports, module2) {
    var Visitor = require_visitor();
    var nodes = require_nodes();
    var utils = require_utils();
    var Normalizer = module2.exports = function Normalizer2(root, options) {
      options = options || {};
      Visitor.call(this, root);
      this.hoist = options["hoist atrules"];
      this.stack = [];
      this.map = {};
      this.imports = [];
    };
    Normalizer.prototype.__proto__ = Visitor.prototype;
    Normalizer.prototype.normalize = function() {
      var ret = this.visit(this.root);
      if (this.hoist) {
        if (this.imports.length)
          ret.nodes = this.imports.concat(ret.nodes);
        if (this.charset)
          ret.nodes = [this.charset].concat(ret.nodes);
      }
      return ret;
    };
    Normalizer.prototype.bubble = function(node) {
      var props = [], other = [], self = this;
      function filterProps(block2) {
        block2.nodes.forEach(function(node2) {
          node2 = self.visit(node2);
          switch (node2.nodeName) {
            case "property":
              props.push(node2);
              break;
            case "block":
              filterProps(node2);
              break;
            default:
              other.push(node2);
          }
        });
      }
      filterProps(node.block);
      if (props.length) {
        var selector = new nodes.Selector([new nodes.Literal("&")]);
        selector.lineno = node.lineno;
        selector.column = node.column;
        selector.filename = node.filename;
        selector.val = "&";
        var group = new nodes.Group();
        group.lineno = node.lineno;
        group.column = node.column;
        group.filename = node.filename;
        var block = new nodes.Block(node.block, group);
        block.lineno = node.lineno;
        block.column = node.column;
        block.filename = node.filename;
        props.forEach(function(prop) {
          block.push(prop);
        });
        group.push(selector);
        group.block = block;
        node.block.nodes = [];
        node.block.push(group);
        other.forEach(function(n) {
          node.block.push(n);
        });
        var group = this.closestGroup(node.block);
        if (group)
          node.group = group.clone();
        node.bubbled = true;
      }
    };
    Normalizer.prototype.closestGroup = function(block) {
      var parent = block.parent, node;
      while (parent && (node = parent.node)) {
        if ("group" == node.nodeName)
          return node;
        parent = node.block && node.block.parent;
      }
    };
    Normalizer.prototype.visitRoot = function(block) {
      var ret = new nodes.Root(), node;
      for (var i = 0; i < block.nodes.length; ++i) {
        node = block.nodes[i];
        switch (node.nodeName) {
          case "null":
          case "expression":
          case "function":
          case "unit":
          case "atblock":
            continue;
          default:
            this.rootIndex = i;
            ret.push(this.visit(node));
        }
      }
      return ret;
    };
    Normalizer.prototype.visitProperty = function(prop) {
      this.visit(prop.expr);
      return prop;
    };
    Normalizer.prototype.visitExpression = function(expr) {
      expr.nodes = expr.nodes.map(function(node) {
        if ("block" == node.nodeName) {
          var literal = new nodes.Literal("block");
          literal.lineno = expr.lineno;
          literal.column = expr.column;
          return literal;
        }
        return node;
      });
      return expr;
    };
    Normalizer.prototype.visitBlock = function(block) {
      var node;
      if (block.hasProperties) {
        for (var i = 0, len = block.nodes.length; i < len; ++i) {
          node = block.nodes[i];
          switch (node.nodeName) {
            case "null":
            case "expression":
            case "function":
            case "group":
            case "unit":
            case "atblock":
              continue;
            default:
              block.nodes[i] = this.visit(node);
          }
        }
      }
      for (var i = 0, len = block.nodes.length; i < len; ++i) {
        node = block.nodes[i];
        block.nodes[i] = this.visit(node);
      }
      return block;
    };
    Normalizer.prototype.visitGroup = function(group) {
      var stack = this.stack, map = this.map, parts;
      group.nodes.forEach(function(selector, i) {
        if (!~selector.val.indexOf(","))
          return;
        if (~selector.val.indexOf("\\,")) {
          selector.val = selector.val.replace(/\\,/g, ",");
          return;
        }
        parts = selector.val.split(",");
        var root = "/" == selector.val.charAt(0), part, s;
        for (var k = 0, len = parts.length; k < len; ++k) {
          part = parts[k].trim();
          if (root && k > 0 && !~part.indexOf("&")) {
            part = "/" + part;
          }
          s = new nodes.Selector([new nodes.Literal(part)]);
          s.val = part;
          s.block = group.block;
          group.nodes[i++] = s;
        }
      });
      stack.push(group.nodes);
      var selectors = utils.compileSelectors(stack, true);
      selectors.forEach(function(selector) {
        map[selector] = map[selector] || [];
        map[selector].push(group);
      });
      this.extend(group, selectors);
      stack.pop();
      return group;
    };
    Normalizer.prototype.visitFunction = function() {
      return nodes.null;
    };
    Normalizer.prototype.visitMedia = function(media) {
      var medias = [], group = this.closestGroup(media.block), parent;
      function mergeQueries(block) {
        block.nodes.forEach(function(node, i) {
          switch (node.nodeName) {
            case "media":
              node.val = media.val.merge(node.val);
              medias.push(node);
              block.nodes[i] = nodes.null;
              break;
            case "block":
              mergeQueries(node);
              break;
            default:
              if (node.block && node.block.nodes)
                mergeQueries(node.block);
          }
        });
      }
      mergeQueries(media.block);
      this.bubble(media);
      if (medias.length) {
        medias.forEach(function(node) {
          if (group) {
            group.block.push(node);
          } else {
            this.root.nodes.splice(++this.rootIndex, 0, node);
          }
          node = this.visit(node);
          parent = node.block.parent;
          if (node.bubbled && (!group || "group" == parent.node.nodeName)) {
            node.group.block = node.block.nodes[0].block;
            node.block.nodes[0] = node.group;
          }
        }, this);
      }
      return media;
    };
    Normalizer.prototype.visitSupports = function(node) {
      this.bubble(node);
      return node;
    };
    Normalizer.prototype.visitAtrule = function(node) {
      if (node.block)
        node.block = this.visit(node.block);
      return node;
    };
    Normalizer.prototype.visitKeyframes = function(node) {
      var frames = node.block.nodes.filter(function(frame) {
        return frame.block && frame.block.hasProperties;
      });
      node.frames = frames.length;
      return node;
    };
    Normalizer.prototype.visitImport = function(node) {
      this.imports.push(node);
      return this.hoist ? nodes.null : node;
    };
    Normalizer.prototype.visitCharset = function(node) {
      this.charset = node;
      return this.hoist ? nodes.null : node;
    };
    Normalizer.prototype.extend = function(group, selectors) {
      var map = this.map, self = this, parent = this.closestGroup(group.block);
      group.extends.forEach(function(extend) {
        var groups = map[extend.selector];
        if (!groups) {
          if (extend.optional)
            return;
          groups = self._checkForPrefixedGroups(extend.selector);
          if (!groups) {
            var err = new Error('Failed to @extend "' + extend.selector + '"');
            err.lineno = extend.lineno;
            err.column = extend.column;
            throw err;
          }
        }
        selectors.forEach(function(selector) {
          var node = new nodes.Selector();
          node.val = selector;
          node.inherits = false;
          groups.forEach(function(group2) {
            if (!parent || parent != group2)
              self.extend(group2, selectors);
            group2.push(node);
          });
        });
      });
      group.block = this.visit(group.block);
    };
    Normalizer.prototype._checkForPrefixedGroups = function(selector) {
      var prefix = [];
      var map = this.map;
      var result = null;
      for (var i = 0; i < this.stack.length; i++) {
        var stackElementArray = this.stack[i];
        var stackElement = stackElementArray[0];
        prefix.push(stackElement.val);
        var fullSelector = prefix.join(" ") + " " + selector;
        result = map[fullSelector];
        if (result)
          break;
      }
      return result;
    };
  }
});

// node_modules/stylus/lib/functions/selector-exists.js
var require_selector_exists = __commonJS({
  "node_modules/stylus/lib/functions/selector-exists.js"(exports, module2) {
    var utils = require_utils();
    function selectorExists(sel) {
      utils.assertString(sel, "selector");
      if (!this.__selectorsMap__) {
        var Normalizer = require_normalizer(), visitor = new Normalizer(this.root.clone());
        visitor.visit(visitor.root);
        this.__selectorsMap__ = visitor.map;
      }
      return sel.string in this.__selectorsMap__;
    }
    selectorExists.params = ["sel"];
    module2.exports = selectorExists;
  }
});

// node_modules/stylus/lib/functions/selector.js
var require_selector = __commonJS({
  "node_modules/stylus/lib/functions/selector.js"(exports, module2) {
    var utils = require_utils();
    (module2.exports = function selector() {
      var stack = this.selectorStack, args = [].slice.call(arguments);
      if (1 == args.length) {
        var expr = utils.unwrap(args[0]), len = expr.nodes.length;
        if (1 == len) {
          utils.assertString(expr.first, "selector");
          var SelectorParser = require_selector_parser(), val = expr.first.string, parsed = new SelectorParser(val).parse().val;
          if (parsed == val)
            return val;
          stack.push(parse(val));
        } else if (len > 1) {
          if (expr.isList) {
            pushToStack(expr.nodes, stack);
          } else {
            stack.push(parse(expr.nodes.map(function(node) {
              utils.assertString(node, "selector");
              return node.string;
            }).join(" ")));
          }
        }
      } else if (args.length > 1) {
        pushToStack(args, stack);
      }
      return stack.length ? utils.compileSelectors(stack).join(",") : "&";
    }).raw = true;
    function pushToStack(selectors, stack) {
      selectors.forEach(function(sel) {
        sel = sel.first;
        utils.assertString(sel, "selector");
        stack.push(parse(sel.string));
      });
    }
    function parse(selector) {
      var Parser = new require("../parser"), parser = new Parser(selector), nodes;
      parser.state.push("selector-parts");
      nodes = parser.selector();
      nodes.forEach(function(node) {
        node.val = node.segments.map(function(seg) {
          return seg.toString();
        }).join("");
      });
      return nodes;
    }
  }
});

// node_modules/stylus/lib/functions/selectors.js
var require_selectors = __commonJS({
  "node_modules/stylus/lib/functions/selectors.js"(exports, module2) {
    var nodes = require_nodes();
    var Parser = require_selector_parser();
    module2.exports = function selectors() {
      var stack = this.selectorStack, expr = new nodes.Expression(true);
      if (stack.length) {
        for (var i = 0; i < stack.length; i++) {
          var group = stack[i], nested;
          if (group.length > 1) {
            expr.push(new nodes.String(group.map(function(selector2) {
              nested = new Parser(selector2.val).parse().nested;
              return (nested && i ? "& " : "") + selector2.val;
            }).join(",")));
          } else {
            var selector = group[0].val;
            nested = new Parser(selector).parse().nested;
            expr.push(new nodes.String((nested && i ? "& " : "") + selector));
          }
        }
      } else {
        expr.push(new nodes.String("&"));
      }
      return expr;
    };
  }
});

// node_modules/stylus/lib/functions/shift.js
var require_shift = __commonJS({
  "node_modules/stylus/lib/functions/shift.js"(exports, module2) {
    var utils = require_utils();
    (module2.exports = function(expr) {
      expr = utils.unwrap(expr);
      return expr.nodes.shift();
    }).raw = true;
  }
});

// node_modules/stylus/lib/functions/split.js
var require_split = __commonJS({
  "node_modules/stylus/lib/functions/split.js"(exports, module2) {
    var utils = require_utils();
    var nodes = require_nodes();
    function split(delim, val) {
      utils.assertString(delim, "delimiter");
      utils.assertString(val, "val");
      var splitted = val.string.split(delim.string);
      var expr = new nodes.Expression();
      var ItemNode = val instanceof nodes.Ident ? nodes.Ident : nodes.String;
      for (var i = 0, len = splitted.length; i < len; ++i) {
        expr.nodes.push(new ItemNode(splitted[i]));
      }
      return expr;
    }
    split.params = ["delim", "val"];
    module2.exports = split;
  }
});

// node_modules/stylus/lib/functions/substr.js
var require_substr = __commonJS({
  "node_modules/stylus/lib/functions/substr.js"(exports, module2) {
    var utils = require_utils();
    var nodes = require_nodes();
    function substr(val, start, length) {
      utils.assertString(val, "val");
      utils.assertType(start, "unit", "start");
      length = length && length.val;
      var res = val.string.substr(start.val, length);
      return val instanceof nodes.Ident ? new nodes.Ident(res) : new nodes.String(res);
    }
    substr.params = ["val", "start", "length"];
    module2.exports = substr;
  }
});

// node_modules/stylus/lib/functions/slice.js
var require_slice = __commonJS({
  "node_modules/stylus/lib/functions/slice.js"(exports, module2) {
    var utils = require_utils();
    var nodes = require_nodes();
    (module2.exports = function slice(val, start, end) {
      start = start && start.nodes[0].val;
      end = end && end.nodes[0].val;
      val = utils.unwrap(val).nodes;
      if (val.length > 1) {
        return utils.coerce(val.slice(start, end), true);
      }
      var result = val[0].string.slice(start, end);
      return val[0] instanceof nodes.Ident ? new nodes.Ident(result) : new nodes.String(result);
    }).raw = true;
  }
});

// node_modules/stylus/lib/functions/tan.js
var require_tan = __commonJS({
  "node_modules/stylus/lib/functions/tan.js"(exports, module2) {
    var utils = require_utils();
    var nodes = require_nodes();
    function tan(angle) {
      utils.assertType(angle, "unit", "angle");
      var radians = angle.val;
      if (angle.type === "deg") {
        radians *= Math.PI / 180;
      }
      var m = Math.pow(10, 9);
      var sin = Math.round(Math.sin(radians) * m) / m, cos = Math.round(Math.cos(radians) * m) / m, tan2 = Math.round(m * sin / cos) / m;
      return new nodes.Unit(tan2, "");
    }
    tan.params = ["angle"];
    module2.exports = tan;
  }
});

// node_modules/stylus/lib/functions/trace.js
var require_trace = __commonJS({
  "node_modules/stylus/lib/functions/trace.js"(exports, module2) {
    var nodes = require_nodes();
    module2.exports = function trace() {
      console.log(this.stack);
      return nodes.null;
    };
  }
});

// node_modules/stylus/lib/functions/transparentify.js
var require_transparentify = __commonJS({
  "node_modules/stylus/lib/functions/transparentify.js"(exports, module2) {
    var utils = require_utils();
    var nodes = require_nodes();
    function transparentify(top, bottom, alpha) {
      utils.assertColor(top);
      top = top.rgba;
      bottom = bottom || new nodes.RGBA(255, 255, 255, 1);
      if (!alpha && bottom && !bottom.rgba) {
        alpha = bottom;
        bottom = new nodes.RGBA(255, 255, 255, 1);
      }
      utils.assertColor(bottom);
      bottom = bottom.rgba;
      var bestAlpha = ["r", "g", "b"].map(function(channel) {
        return (top[channel] - bottom[channel]) / ((0 < top[channel] - bottom[channel] ? 255 : 0) - bottom[channel]);
      }).sort(function(a, b) {
        return b - a;
      })[0];
      if (alpha) {
        utils.assertType(alpha, "unit", "alpha");
        if ("%" == alpha.type) {
          bestAlpha = alpha.val / 100;
        } else if (!alpha.type) {
          bestAlpha = alpha = alpha.val;
        }
      }
      bestAlpha = Math.max(Math.min(bestAlpha, 1), 0);
      function processChannel(channel) {
        if (0 == bestAlpha) {
          return bottom[channel];
        } else {
          return bottom[channel] + (top[channel] - bottom[channel]) / bestAlpha;
        }
      }
      return new nodes.RGBA(
        processChannel("r"),
        processChannel("g"),
        processChannel("b"),
        Math.round(bestAlpha * 100) / 100
      );
    }
    transparentify.params = ["top", "bottom", "alpha"];
    module2.exports = transparentify;
  }
});

// node_modules/stylus/lib/functions/type.js
var require_type = __commonJS({
  "node_modules/stylus/lib/functions/type.js"(exports, module2) {
    var utils = require_utils();
    function type(node) {
      utils.assertPresent(node, "expression");
      return node.nodeName;
    }
    type.params = ["node"];
    module2.exports = type;
  }
});

// node_modules/stylus/lib/functions/unit.js
var require_unit = __commonJS({
  "node_modules/stylus/lib/functions/unit.js"(exports, module2) {
    var utils = require_utils();
    var nodes = require_nodes();
    function unit(unit2, type) {
      utils.assertType(unit2, "unit", "unit");
      if (type) {
        utils.assertString(type, "type");
        return new nodes.Unit(unit2.val, type.string);
      } else {
        return unit2.type || "";
      }
    }
    unit.params = ["unit", "type"];
    module2.exports = unit;
  }
});

// node_modules/stylus/lib/functions/unquote.js
var require_unquote = __commonJS({
  "node_modules/stylus/lib/functions/unquote.js"(exports, module2) {
    var utils = require_utils();
    var nodes = require_nodes();
    function unquote(string) {
      utils.assertString(string, "string");
      return new nodes.Literal(string.string);
    }
    unquote.params = ["string"];
    module2.exports = unquote;
  }
});

// node_modules/stylus/lib/functions/unshift.js
var require_unshift = __commonJS({
  "node_modules/stylus/lib/functions/unshift.js"(exports, module2) {
    var utils = require_utils();
    (module2.exports = function(expr) {
      expr = utils.unwrap(expr);
      for (var i = 1, len = arguments.length; i < len; ++i) {
        expr.nodes.unshift(utils.unwrap(arguments[i]));
      }
      return expr.nodes.length;
    }).raw = true;
  }
});

// node_modules/stylus/lib/functions/use.js
var require_use = __commonJS({
  "node_modules/stylus/lib/functions/use.js"(exports, module2) {
    var utils = require_utils();
    var path = require("path");
    function use(plugin, options) {
      utils.assertString(plugin, "plugin");
      if (options) {
        utils.assertType(options, "object", "options");
        options = parseObject(options);
      }
      plugin = plugin.string;
      var found = utils.lookup(plugin, this.options.paths, this.options.filename);
      if (!found)
        throw new Error('failed to locate plugin file "' + plugin + '"');
      var fn = require(path.resolve(found));
      if ("function" != typeof fn) {
        throw new Error('plugin "' + plugin + '" does not export a function');
      }
      this.renderer.use(fn(options || this.options));
    }
    use.params = ["plugin", "options"];
    module2.exports = use;
    function parseObject(obj) {
      obj = obj.vals;
      for (var key in obj) {
        var nodes = obj[key].nodes[0].nodes;
        if (nodes && nodes.length) {
          obj[key] = [];
          for (var i = 0, len = nodes.length; i < len; ++i) {
            obj[key].push(convert(nodes[i]));
          }
        } else {
          obj[key] = convert(obj[key].first);
        }
      }
      return obj;
      function convert(node) {
        switch (node.nodeName) {
          case "object":
            return parseObject(node);
          case "boolean":
            return node.isTrue;
          case "unit":
            return node.type ? node.toString() : +node.val;
          case "string":
          case "literal":
            return node.val;
          default:
            return node.toString();
        }
      }
    }
  }
});

// node_modules/stylus/lib/functions/warn.js
var require_warn = __commonJS({
  "node_modules/stylus/lib/functions/warn.js"(exports, module2) {
    var utils = require_utils();
    var nodes = require_nodes();
    function warn(msg) {
      utils.assertType(msg, "string", "msg");
      console.warn("Warning: %s", msg.val);
      return nodes.null;
    }
    warn.params = ["msg"];
    module2.exports = warn;
  }
});

// node_modules/stylus/lib/functions/math-prop.js
var require_math_prop = __commonJS({
  "node_modules/stylus/lib/functions/math-prop.js"(exports, module2) {
    var nodes = require_nodes();
    function math(prop) {
      return new nodes.Unit(Math[prop.string]);
    }
    math.params = ["prop"];
    module2.exports = math;
  }
});

// node_modules/stylus/lib/functions/prefix-classes.js
var require_prefix_classes = __commonJS({
  "node_modules/stylus/lib/functions/prefix-classes.js"(exports, module2) {
    var utils = require_utils();
    function prefixClasses(prefix, block) {
      utils.assertString(prefix, "prefix");
      utils.assertType(block, "block", "block");
      var _prefix = this.prefix;
      this.options.prefix = this.prefix = prefix.string;
      block = this.visit(block);
      this.options.prefix = this.prefix = _prefix;
      return block;
    }
    prefixClasses.params = ["prefix", "block"];
    module2.exports = prefixClasses;
  }
});

// node_modules/stylus/lib/functions/index.js
var require_functions = __commonJS({
  "node_modules/stylus/lib/functions/index.js"(exports) {
    exports["add-property"] = require_add_property();
    exports.adjust = require_adjust();
    exports.alpha = require_alpha();
    exports["base-convert"] = require_base_convert();
    exports.basename = require_basename();
    exports.blend = require_blend();
    exports.blue = require_blue();
    exports.clone = require_clone();
    exports.component = require_component();
    exports.contrast = require_contrast();
    exports.convert = require_convert();
    exports["current-media"] = require_current_media();
    exports.define = require_define();
    exports.dirname = require_dirname();
    exports.error = require_error();
    exports.extname = require_extname();
    exports.green = require_green();
    exports.hsl = require_hsl();
    exports.hsla = require_hsla();
    exports.hue = require_hue();
    exports["image-size"] = require_image_size();
    exports.json = require_json();
    exports.length = require_length();
    exports.lightness = require_lightness();
    exports["list-separator"] = require_list_separator();
    exports.lookup = require_lookup();
    exports.luminosity = require_luminosity();
    exports.match = require_match();
    exports.math = require_math();
    exports.merge = exports.extend = require_merge();
    exports.operate = require_operate();
    exports["opposite-position"] = require_opposite_position();
    exports.p = require_p();
    exports.pathjoin = require_pathjoin();
    exports.pop = require_pop();
    exports.push = exports.append = require_push();
    exports.range = require_range();
    exports.red = require_red();
    exports.remove = require_remove();
    exports.replace = require_replace();
    exports.rgb = require_rgb();
    exports.atan = require_atan();
    exports.asin = require_asin();
    exports.acos = require_acos();
    exports.rgba = require_rgba();
    exports.s = require_s();
    exports.saturation = require_saturation();
    exports["selector-exists"] = require_selector_exists();
    exports.selector = require_selector();
    exports.selectors = require_selectors();
    exports.shift = require_shift();
    exports.split = require_split();
    exports.substr = require_substr();
    exports.slice = require_slice();
    exports.tan = require_tan();
    exports.trace = require_trace();
    exports.transparentify = require_transparentify();
    exports.type = exports.typeof = exports["type-of"] = require_type();
    exports.unit = require_unit();
    exports.unquote = require_unquote();
    exports.unshift = exports.prepend = require_unshift();
    exports.use = require_use();
    exports.warn = require_warn();
    exports["-math-prop"] = require_math_prop();
    exports["-prefix-classes"] = require_prefix_classes();
  }
});

// node_modules/stylus/lib/colors.js
var require_colors = __commonJS({
  "node_modules/stylus/lib/colors.js"(exports, module2) {
    module2.exports = {
      aliceblue: [240, 248, 255, 1],
      antiquewhite: [250, 235, 215, 1],
      aqua: [0, 255, 255, 1],
      aquamarine: [127, 255, 212, 1],
      azure: [240, 255, 255, 1],
      beige: [245, 245, 220, 1],
      bisque: [255, 228, 196, 1],
      black: [0, 0, 0, 1],
      blanchedalmond: [255, 235, 205, 1],
      blue: [0, 0, 255, 1],
      blueviolet: [138, 43, 226, 1],
      brown: [165, 42, 42, 1],
      burlywood: [222, 184, 135, 1],
      cadetblue: [95, 158, 160, 1],
      chartreuse: [127, 255, 0, 1],
      chocolate: [210, 105, 30, 1],
      coral: [255, 127, 80, 1],
      cornflowerblue: [100, 149, 237, 1],
      cornsilk: [255, 248, 220, 1],
      crimson: [220, 20, 60, 1],
      cyan: [0, 255, 255, 1],
      darkblue: [0, 0, 139, 1],
      darkcyan: [0, 139, 139, 1],
      darkgoldenrod: [184, 134, 11, 1],
      darkgray: [169, 169, 169, 1],
      darkgreen: [0, 100, 0, 1],
      darkgrey: [169, 169, 169, 1],
      darkkhaki: [189, 183, 107, 1],
      darkmagenta: [139, 0, 139, 1],
      darkolivegreen: [85, 107, 47, 1],
      darkorange: [255, 140, 0, 1],
      darkorchid: [153, 50, 204, 1],
      darkred: [139, 0, 0, 1],
      darksalmon: [233, 150, 122, 1],
      darkseagreen: [143, 188, 143, 1],
      darkslateblue: [72, 61, 139, 1],
      darkslategray: [47, 79, 79, 1],
      darkslategrey: [47, 79, 79, 1],
      darkturquoise: [0, 206, 209, 1],
      darkviolet: [148, 0, 211, 1],
      deeppink: [255, 20, 147, 1],
      deepskyblue: [0, 191, 255, 1],
      dimgray: [105, 105, 105, 1],
      dimgrey: [105, 105, 105, 1],
      dodgerblue: [30, 144, 255, 1],
      firebrick: [178, 34, 34, 1],
      floralwhite: [255, 250, 240, 1],
      forestgreen: [34, 139, 34, 1],
      fuchsia: [255, 0, 255, 1],
      gainsboro: [220, 220, 220, 1],
      ghostwhite: [248, 248, 255, 1],
      gold: [255, 215, 0, 1],
      goldenrod: [218, 165, 32, 1],
      gray: [128, 128, 128, 1],
      green: [0, 128, 0, 1],
      greenyellow: [173, 255, 47, 1],
      grey: [128, 128, 128, 1],
      honeydew: [240, 255, 240, 1],
      hotpink: [255, 105, 180, 1],
      indianred: [205, 92, 92, 1],
      indigo: [75, 0, 130, 1],
      ivory: [255, 255, 240, 1],
      khaki: [240, 230, 140, 1],
      lavender: [230, 230, 250, 1],
      lavenderblush: [255, 240, 245, 1],
      lawngreen: [124, 252, 0, 1],
      lemonchiffon: [255, 250, 205, 1],
      lightblue: [173, 216, 230, 1],
      lightcoral: [240, 128, 128, 1],
      lightcyan: [224, 255, 255, 1],
      lightgoldenrodyellow: [250, 250, 210, 1],
      lightgray: [211, 211, 211, 1],
      lightgreen: [144, 238, 144, 1],
      lightgrey: [211, 211, 211, 1],
      lightpink: [255, 182, 193, 1],
      lightsalmon: [255, 160, 122, 1],
      lightseagreen: [32, 178, 170, 1],
      lightskyblue: [135, 206, 250, 1],
      lightslategray: [119, 136, 153, 1],
      lightslategrey: [119, 136, 153, 1],
      lightsteelblue: [176, 196, 222, 1],
      lightyellow: [255, 255, 224, 1],
      lime: [0, 255, 0, 1],
      limegreen: [50, 205, 50, 1],
      linen: [250, 240, 230, 1],
      magenta: [255, 0, 255, 1],
      maroon: [128, 0, 0, 1],
      mediumaquamarine: [102, 205, 170, 1],
      mediumblue: [0, 0, 205, 1],
      mediumorchid: [186, 85, 211, 1],
      mediumpurple: [147, 112, 219, 1],
      mediumseagreen: [60, 179, 113, 1],
      mediumslateblue: [123, 104, 238, 1],
      mediumspringgreen: [0, 250, 154, 1],
      mediumturquoise: [72, 209, 204, 1],
      mediumvioletred: [199, 21, 133, 1],
      midnightblue: [25, 25, 112, 1],
      mintcream: [245, 255, 250, 1],
      mistyrose: [255, 228, 225, 1],
      moccasin: [255, 228, 181, 1],
      navajowhite: [255, 222, 173, 1],
      navy: [0, 0, 128, 1],
      oldlace: [253, 245, 230, 1],
      olive: [128, 128, 0, 1],
      olivedrab: [107, 142, 35, 1],
      orange: [255, 165, 0, 1],
      orangered: [255, 69, 0, 1],
      orchid: [218, 112, 214, 1],
      palegoldenrod: [238, 232, 170, 1],
      palegreen: [152, 251, 152, 1],
      paleturquoise: [175, 238, 238, 1],
      palevioletred: [219, 112, 147, 1],
      papayawhip: [255, 239, 213, 1],
      peachpuff: [255, 218, 185, 1],
      peru: [205, 133, 63, 1],
      pink: [255, 192, 203, 1],
      plum: [221, 160, 221, 1],
      powderblue: [176, 224, 230, 1],
      purple: [128, 0, 128, 1],
      red: [255, 0, 0, 1],
      rosybrown: [188, 143, 143, 1],
      royalblue: [65, 105, 225, 1],
      saddlebrown: [139, 69, 19, 1],
      salmon: [250, 128, 114, 1],
      sandybrown: [244, 164, 96, 1],
      seagreen: [46, 139, 87, 1],
      seashell: [255, 245, 238, 1],
      sienna: [160, 82, 45, 1],
      silver: [192, 192, 192, 1],
      skyblue: [135, 206, 235, 1],
      slateblue: [106, 90, 205, 1],
      slategray: [112, 128, 144, 1],
      slategrey: [112, 128, 144, 1],
      snow: [255, 250, 250, 1],
      springgreen: [0, 255, 127, 1],
      steelblue: [70, 130, 180, 1],
      tan: [210, 180, 140, 1],
      teal: [0, 128, 128, 1],
      thistle: [216, 191, 216, 1],
      tomato: [255, 99, 71, 1],
      transparent: [0, 0, 0, 0],
      turquoise: [64, 224, 208, 1],
      violet: [238, 130, 238, 1],
      wheat: [245, 222, 179, 1],
      white: [255, 255, 255, 1],
      whitesmoke: [245, 245, 245, 1],
      yellow: [255, 255, 0, 1],
      yellowgreen: [154, 205, 50, 1],
      rebeccapurple: [102, 51, 153, 1]
    };
  }
});

// node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/ms/index.js"(exports, module2) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module2.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
    }
  }
});

// node_modules/debug/src/common.js
var require_common2 = __commonJS({
  "node_modules/debug/src/common.js"(exports, module2) {
    function setup(env) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled;
      createDebug.humanize = require_ms();
      createDebug.destroy = destroy;
      Object.keys(env).forEach((key) => {
        createDebug[key] = env[key];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        let hash = 0;
        for (let i = 0; i < namespace.length; i++) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i);
          hash |= 0;
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug(...args) {
          if (!debug.enabled) {
            return;
          }
          const self = debug;
          const curr = Number(/* @__PURE__ */ new Date());
          const ms = curr - (prevTime || curr);
          self.diff = ms;
          self.prev = prevTime;
          self.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
            if (match === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug.formatters[format];
            if (typeof formatter === "function") {
              const val = args[index];
              match = formatter.call(self, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug.formatArgs.call(self, args);
          const logFn = self.log || createDebug.log;
          logFn.apply(self, args);
        }
        debug.namespace = namespace;
        debug.useColors = createDebug.useColors();
        debug.color = createDebug.selectColor(namespace);
        debug.extend = extend;
        debug.destroy = createDebug.destroy;
        Object.defineProperty(debug, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => {
            if (enableOverride !== null) {
              return enableOverride;
            }
            if (namespacesCache !== createDebug.namespaces) {
              namespacesCache = createDebug.namespaces;
              enabledCache = createDebug.enabled(namespace);
            }
            return enabledCache;
          },
          set: (v) => {
            enableOverride = v;
          }
        });
        if (typeof createDebug.init === "function") {
          createDebug.init(debug);
        }
        return debug;
      }
      function extend(namespace, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        let i;
        const split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
        const len = split.length;
        for (i = 0; i < len; i++) {
          if (!split[i]) {
            continue;
          }
          namespaces = split[i].replace(/\*/g, ".*?");
          if (namespaces[0] === "-") {
            createDebug.skips.push(new RegExp("^" + namespaces.slice(1) + "$"));
          } else {
            createDebug.names.push(new RegExp("^" + namespaces + "$"));
          }
        }
      }
      function disable() {
        const namespaces = [
          ...createDebug.names.map(toNamespace),
          ...createDebug.skips.map(toNamespace).map((namespace) => "-" + namespace)
        ].join(",");
        createDebug.enable("");
        return namespaces;
      }
      function enabled(name) {
        if (name[name.length - 1] === "*") {
          return true;
        }
        let i;
        let len;
        for (i = 0, len = createDebug.skips.length; i < len; i++) {
          if (createDebug.skips[i].test(name)) {
            return false;
          }
        }
        for (i = 0, len = createDebug.names.length; i < len; i++) {
          if (createDebug.names[i].test(name)) {
            return true;
          }
        }
        return false;
      }
      function toNamespace(regexp) {
        return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, "*");
      }
      function coerce(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy() {
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module2.exports = setup;
  }
});

// node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "node_modules/debug/src/browser.js"(exports, module2) {
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = localstorage();
    exports.destroy = (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module2.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports.storage.setItem("debug", namespaces);
        } else {
          exports.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      let r;
      try {
        r = exports.storage.getItem("debug");
      } catch (error) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module2.exports = require_common2()(exports);
    var { formatters } = module2.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  }
});

// node_modules/debug/src/node.js
var require_node = __commonJS({
  "node_modules/debug/src/node.js"(exports, module2) {
    var tty = require("tty");
    var util = require("util");
    exports.init = init;
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.destroy = util.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    );
    exports.colors = [6, 2, 3, 4, 5, 1];
    try {
      const supportsColor = require("supports-color");
      if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports.colors = [
          20,
          21,
          26,
          27,
          32,
          33,
          38,
          39,
          40,
          41,
          42,
          43,
          44,
          45,
          56,
          57,
          62,
          63,
          68,
          69,
          74,
          75,
          76,
          77,
          78,
          79,
          80,
          81,
          92,
          93,
          98,
          99,
          112,
          113,
          128,
          129,
          134,
          135,
          148,
          149,
          160,
          161,
          162,
          163,
          164,
          165,
          166,
          167,
          168,
          169,
          170,
          171,
          172,
          173,
          178,
          179,
          184,
          185,
          196,
          197,
          198,
          199,
          200,
          201,
          202,
          203,
          204,
          205,
          206,
          207,
          208,
          209,
          214,
          215,
          220,
          221
        ];
      }
    } catch (error) {
    }
    exports.inspectOpts = Object.keys(process.env).filter((key) => {
      return /^debug_/i.test(key);
    }).reduce((obj, key) => {
      const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
        return k.toUpperCase();
      });
      let val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
      } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
      } else if (val === "null") {
        val = null;
      } else {
        val = Number(val);
      }
      obj[prop] = val;
      return obj;
    }, {});
    function useColors() {
      return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(process.stderr.fd);
    }
    function formatArgs(args) {
      const { namespace: name, useColors: useColors2 } = this;
      if (useColors2) {
        const c = this.color;
        const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
        const prefix = `  ${colorCode};1m${name} \x1B[0m`;
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push(colorCode + "m+" + module2.exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = getDate() + name + " " + args[0];
      }
    }
    function getDate() {
      if (exports.inspectOpts.hideDate) {
        return "";
      }
      return (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function log(...args) {
      return process.stderr.write(util.format(...args) + "\n");
    }
    function save(namespaces) {
      if (namespaces) {
        process.env.DEBUG = namespaces;
      } else {
        delete process.env.DEBUG;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    function init(debug) {
      debug.inspectOpts = {};
      const keys = Object.keys(exports.inspectOpts);
      for (let i = 0; i < keys.length; i++) {
        debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
      }
    }
    module2.exports = require_common2()(exports);
    var { formatters } = module2.exports;
    formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
    };
    formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts);
    };
  }
});

// node_modules/debug/src/index.js
var require_src = __commonJS({
  "node_modules/debug/src/index.js"(exports, module2) {
    if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) {
      module2.exports = require_browser();
    } else {
      module2.exports = require_node();
    }
  }
});

// node_modules/stylus/lib/functions/url.js
var require_url = __commonJS({
  "node_modules/stylus/lib/functions/url.js"(exports, module2) {
    var Compiler = require_compiler();
    var events = require_renderer().events;
    var nodes = require_nodes();
    var parse = require("url").parse;
    var extname = require("path").extname;
    var utils = require_utils();
    var fs = require("fs");
    var defaultMimes = {
      ".gif": "image/gif",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".svg": "image/svg+xml",
      ".webp": "image/webp",
      ".ttf": "application/x-font-ttf",
      ".eot": "application/vnd.ms-fontobject",
      ".woff": "application/font-woff",
      ".woff2": "application/font-woff2"
    };
    var encodingTypes = {
      BASE_64: "base64",
      UTF8: "charset=utf-8"
    };
    module2.exports = function(options) {
      options = options || {};
      var _paths = options.paths || [];
      var sizeLimit = null != options.limit ? options.limit : 3e4;
      var mimes = options.mimes || defaultMimes;
      function fn(url, enc) {
        var compiler = new Compiler(url), encoding = encodingTypes.BASE_64;
        compiler.isURL = true;
        url = url.nodes.map(function(node) {
          return compiler.visit(node);
        }).join("");
        url = parse(url);
        var ext = extname(url.pathname || ""), mime = mimes[ext], hash = url.hash || "", literal = new nodes.Literal('url("' + url.href + '")'), paths = _paths.concat(this.paths), buf, result;
        if (!mime)
          return literal;
        if (url.protocol)
          return literal;
        var found = utils.lookup(url.pathname, paths);
        if (!found) {
          events.emit(
            "file not found",
            "File " + literal + " could not be found, literal url retained!"
          );
          return literal;
        }
        buf = fs.readFileSync(found);
        if (false !== sizeLimit && buf.length > sizeLimit)
          return literal;
        if (enc && "utf8" == enc.first.val.toLowerCase()) {
          encoding = encodingTypes.UTF8;
          result = buf.toString().replace(/\s+/g, " ").replace(/[{}\|\\\^~\[\]`"<>#%]/g, function(match) {
            return "%" + match[0].charCodeAt(0).toString(16).toUpperCase();
          }).trim();
        } else {
          result = buf.toString(encoding) + hash;
        }
        return new nodes.Literal('url("data:' + mime + ";" + encoding + "," + result + '")');
      }
      ;
      fn.raw = true;
      return fn;
    };
    module2.exports.mimes = defaultMimes;
  }
});

// node_modules/stylus/lib/visitor/evaluator.js
var require_evaluator = __commonJS({
  "node_modules/stylus/lib/visitor/evaluator.js"(exports, module2) {
    var Visitor = require_visitor();
    var units = require_units();
    var nodes = require_nodes();
    var Stack = require_stack();
    var Frame = require_frame();
    var utils = require_utils();
    var bifs = require_functions();
    var dirname = require("path").dirname;
    var colors = require_colors();
    var debug = require_src()("stylus:evaluator");
    var fs = require("fs");
    function importFile(node, file, literal) {
      var importStack = this.importStack, Parser = require_parser(), stat;
      if (node.once) {
        if (this.requireHistory[file])
          return nodes.null;
        this.requireHistory[file] = true;
        if (literal && !this.includeCSS) {
          return node;
        }
      }
      if (~importStack.indexOf(file))
        throw new Error("import loop has been found");
      var str = fs.readFileSync(file, "utf8");
      if (!str.trim())
        return nodes.null;
      node.path = file;
      node.dirname = dirname(file);
      stat = fs.statSync(file);
      node.mtime = stat.mtime;
      this.paths.push(node.dirname);
      if (this.options._imports)
        this.options._imports.push(node.clone());
      importStack.push(file);
      nodes.filename = file;
      if (literal) {
        literal = new nodes.Literal(str.replace(/\r\n?/g, "\n"));
        literal.lineno = literal.column = 1;
        if (!this.resolveURL)
          return literal;
      }
      var block = new nodes.Block(), parser = new Parser(str, utils.merge({ root: block }, this.options));
      try {
        block = parser.parse();
      } catch (err) {
        var line = parser.lexer.lineno, column = parser.lexer.column;
        if (literal && this.includeCSS && this.resolveURL) {
          this.warn("ParseError: " + file + ":" + line + ":" + column + ". This file included as-is");
          return literal;
        } else {
          err.filename = file;
          err.lineno = line;
          err.column = column;
          err.input = str;
          throw err;
        }
      }
      block = block.clone(this.currentBlock);
      block.parent = this.currentBlock;
      block.scope = false;
      var ret = this.visit(block);
      importStack.pop();
      if (!this.resolveURL || this.resolveURL.nocheck)
        this.paths.pop();
      return ret;
    }
    var Evaluator = module2.exports = function Evaluator2(root, options) {
      options = options || {};
      Visitor.call(this, root);
      var functions = this.functions = options.functions || {};
      this.stack = new Stack();
      this.imports = options.imports || [];
      this.globals = options.globals || {};
      this.paths = options.paths || [];
      this.prefix = options.prefix || "";
      this.filename = options.filename;
      this.includeCSS = options["include css"];
      this.resolveURL = functions.url && "resolver" == functions.url.name && functions.url.options;
      this.paths.push(dirname(options.filename || "."));
      this.stack.push(this.global = new Frame(root));
      this.warnings = options.warn;
      this.options = options;
      this.calling = [];
      this.importStack = [];
      this.requireHistory = {};
      this.return = 0;
    };
    Evaluator.prototype.__proto__ = Visitor.prototype;
    var visit = Visitor.prototype.visit;
    Evaluator.prototype.visit = function(node) {
      try {
        return visit.call(this, node);
      } catch (err) {
        if (err.filename)
          throw err;
        err.lineno = node.lineno;
        err.column = node.column;
        err.filename = node.filename;
        err.stylusStack = this.stack.toString();
        try {
          err.input = fs.readFileSync(err.filename, "utf8");
        } catch (err2) {
        }
        throw err;
      }
    };
    Evaluator.prototype.setup = function() {
      var root = this.root;
      var imports = [];
      this.populateGlobalScope();
      this.imports.forEach(function(file) {
        var expr = new nodes.Expression();
        expr.push(new nodes.String(file));
        imports.push(new nodes.Import(expr));
      }, this);
      root.nodes = imports.concat(root.nodes);
    };
    Evaluator.prototype.populateGlobalScope = function() {
      var scope = this.global.scope;
      Object.keys(colors).forEach(function(name) {
        var color = colors[name], rgba = new nodes.RGBA(color[0], color[1], color[2], color[3]), node = new nodes.Ident(name, rgba);
        rgba.name = name;
        scope.add(node);
      });
      scope.add(new nodes.Ident(
        "embedurl",
        new nodes.Function("embedurl", require_url()({
          limit: false
        }))
      ));
      var globals = this.globals;
      Object.keys(globals).forEach(function(name) {
        var val = globals[name];
        if (!val.nodeName)
          val = new nodes.Literal(val);
        scope.add(new nodes.Ident(name, val));
      });
    };
    Evaluator.prototype.evaluate = function() {
      debug("eval %s", this.filename);
      this.setup();
      return this.visit(this.root);
    };
    Evaluator.prototype.visitGroup = function(group) {
      group.nodes = group.nodes.map(function(selector) {
        selector.val = this.interpolate(selector);
        debug("ruleset %s", selector.val);
        return selector;
      }, this);
      group.block = this.visit(group.block);
      return group;
    };
    Evaluator.prototype.visitReturn = function(ret) {
      ret.expr = this.visit(ret.expr);
      throw ret;
    };
    Evaluator.prototype.visitMedia = function(media) {
      media.block = this.visit(media.block);
      media.val = this.visit(media.val);
      return media;
    };
    Evaluator.prototype.visitQueryList = function(queries) {
      var val, query;
      queries.nodes.forEach(this.visit, this);
      if (1 == queries.nodes.length) {
        query = queries.nodes[0];
        if (val = this.lookup(query.type)) {
          val = val.first.string;
          if (!val)
            return queries;
          var Parser = require_parser(), parser = new Parser(val, this.options);
          queries = this.visit(parser.queries());
        }
      }
      return queries;
    };
    Evaluator.prototype.visitQuery = function(node) {
      node.predicate = this.visit(node.predicate);
      node.type = this.visit(node.type);
      node.nodes.forEach(this.visit, this);
      return node;
    };
    Evaluator.prototype.visitFeature = function(node) {
      node.name = this.interpolate(node);
      if (node.expr) {
        this.return++;
        node.expr = this.visit(node.expr);
        this.return--;
      }
      return node;
    };
    Evaluator.prototype.visitObject = function(obj) {
      for (var key in obj.vals) {
        obj.vals[key] = this.visit(obj.vals[key]);
      }
      return obj;
    };
    Evaluator.prototype.visitMember = function(node) {
      var left = node.left, right = node.right, obj = this.visit(left).first;
      if ("object" != obj.nodeName) {
        throw new Error(left.toString() + " has no property ." + right);
      }
      if (node.val) {
        this.return++;
        obj.set(right.name, this.visit(node.val));
        this.return--;
      }
      return obj.get(right.name);
    };
    Evaluator.prototype.visitKeyframes = function(keyframes) {
      var val;
      if (keyframes.fabricated)
        return keyframes;
      keyframes.val = this.interpolate(keyframes).trim();
      if (val = this.lookup(keyframes.val)) {
        keyframes.val = val.first.string || val.first.name;
      }
      keyframes.block = this.visit(keyframes.block);
      if ("official" != keyframes.prefix)
        return keyframes;
      this.vendors.forEach(function(prefix) {
        if ("ms" == prefix)
          return;
        var node = keyframes.clone();
        node.val = keyframes.val;
        node.prefix = prefix;
        node.block = keyframes.block;
        node.fabricated = true;
        this.currentBlock.push(node);
      }, this);
      return nodes.null;
    };
    Evaluator.prototype.visitFunction = function(fn) {
      var local = this.stack.currentFrame.scope.lookup(fn.name);
      if (local)
        this.warn("local " + local.nodeName + ' "' + fn.name + '" previously defined in this scope');
      var user = this.functions[fn.name];
      if (user)
        this.warn('user-defined function "' + fn.name + '" is already defined');
      var bif = bifs[fn.name];
      if (bif)
        this.warn('built-in function "' + fn.name + '" is already defined');
      return fn;
    };
    Evaluator.prototype.visitEach = function(each) {
      this.return++;
      var expr = utils.unwrap(this.visit(each.expr)), len = expr.nodes.length, val = new nodes.Ident(each.val), key = new nodes.Ident(each.key || "__index__"), scope = this.currentScope, block = this.currentBlock, vals = [], self = this, body, obj;
      this.return--;
      each.block.scope = false;
      function visitBody(key2, val2) {
        scope.add(val2);
        scope.add(key2);
        body = self.visit(each.block.clone());
        vals = vals.concat(body.nodes);
      }
      if (1 == len && "object" == expr.nodes[0].nodeName) {
        obj = expr.nodes[0];
        for (var prop in obj.vals) {
          val.val = new nodes.String(prop);
          key.val = obj.get(prop);
          visitBody(key, val);
        }
      } else {
        for (var i = 0; i < len; ++i) {
          val.val = expr.nodes[i];
          key.val = new nodes.Unit(i);
          visitBody(key, val);
        }
      }
      this.mixin(vals, block);
      return vals[vals.length - 1] || nodes.null;
    };
    Evaluator.prototype.visitCall = function(call) {
      debug("call %s", call);
      var fn = this.lookup(call.name), literal, ret;
      this.ignoreColors = "url" == call.name;
      if (fn && "expression" == fn.nodeName) {
        fn = fn.nodes[0];
      }
      if (fn && "function" != fn.nodeName) {
        fn = this.lookupFunction(call.name);
      }
      if (!fn || fn.nodeName != "function") {
        debug("%s is undefined", call);
        if ("calc" == this.unvendorize(call.name)) {
          literal = call.args.nodes && call.args.nodes[0];
          if (literal)
            ret = new nodes.Literal(call.name + literal);
        } else {
          ret = this.literalCall(call);
        }
        this.ignoreColors = false;
        return ret;
      }
      this.calling.push(call.name);
      if (this.calling.length > 200) {
        throw new RangeError("Maximum stylus call stack size exceeded");
      }
      if ("expression" == fn.nodeName)
        fn = fn.first;
      this.return++;
      var args = this.visit(call.args);
      for (var key in args.map) {
        args.map[key] = this.visit(args.map[key].clone());
      }
      this.return--;
      if (fn.fn) {
        debug("%s is built-in", call);
        ret = this.invokeBuiltin(fn.fn, args);
      } else if ("function" == fn.nodeName) {
        debug("%s is user-defined", call);
        if (call.block)
          call.block = this.visit(call.block);
        ret = this.invokeFunction(fn, args, call.block);
      }
      this.calling.pop();
      this.ignoreColors = false;
      return ret;
    };
    Evaluator.prototype.visitIdent = function(ident) {
      var prop;
      if (ident.property) {
        if (prop = this.lookupProperty(ident.name)) {
          return this.visit(prop.expr.clone());
        }
        return nodes.null;
      } else if (ident.val.isNull) {
        var val = this.lookup(ident.name);
        if (val && ident.mixin)
          this.mixinNode(val);
        return val ? this.visit(val) : ident;
      } else {
        this.return++;
        ident.val = this.visit(ident.val);
        this.return--;
        this.currentScope.add(ident);
        return ident.val;
      }
    };
    Evaluator.prototype.visitBinOp = function(binop) {
      if ("is defined" == binop.op)
        return this.isDefined(binop.left);
      this.return++;
      var op = binop.op, left = this.visit(binop.left), right = "||" == op || "&&" == op ? binop.right : this.visit(binop.right);
      var val = binop.val ? this.visit(binop.val) : null;
      this.return--;
      try {
        return this.visit(left.operate(op, right, val));
      } catch (err) {
        if ("CoercionError" == err.name) {
          switch (op) {
            case "==":
              return nodes.false;
            case "!=":
              return nodes.true;
          }
        }
        throw err;
      }
    };
    Evaluator.prototype.visitUnaryOp = function(unary) {
      var op = unary.op, node = this.visit(unary.expr);
      if ("!" != op) {
        node = node.first.clone();
        utils.assertType(node, "unit");
      }
      switch (op) {
        case "-":
          node.val = -node.val;
          break;
        case "+":
          node.val = +node.val;
          break;
        case "~":
          node.val = ~node.val;
          break;
        case "!":
          return node.toBoolean().negate();
      }
      return node;
    };
    Evaluator.prototype.visitTernary = function(ternary) {
      var ok = this.visit(ternary.cond).toBoolean();
      return ok.isTrue ? this.visit(ternary.trueExpr) : this.visit(ternary.falseExpr);
    };
    Evaluator.prototype.visitExpression = function(expr) {
      for (var i = 0, len = expr.nodes.length; i < len; ++i) {
        expr.nodes[i] = this.visit(expr.nodes[i]);
      }
      if (this.castable(expr))
        expr = this.cast(expr);
      return expr;
    };
    Evaluator.prototype.visitArguments = Evaluator.prototype.visitExpression;
    Evaluator.prototype.visitProperty = function(prop) {
      var name = this.interpolate(prop), fn = this.lookup(name), call = fn && "function" == fn.first.nodeName, literal = ~this.calling.indexOf(name), _prop = this.property;
      if (call && !literal && !prop.literal) {
        var args = nodes.Arguments.fromExpression(utils.unwrap(prop.expr.clone()));
        prop.name = name;
        this.property = prop;
        this.return++;
        this.property.expr = this.visit(prop.expr);
        this.return--;
        var ret = this.visit(new nodes.Call(name, args));
        this.property = _prop;
        return ret;
      } else {
        this.return++;
        prop.name = name;
        prop.literal = true;
        this.property = prop;
        prop.expr = this.visit(prop.expr);
        this.property = _prop;
        this.return--;
        return prop;
      }
    };
    Evaluator.prototype.visitRoot = function(block) {
      if (block != this.root) {
        block.constructor = nodes.Block;
        return this.visit(block);
      }
      for (var i = 0; i < block.nodes.length; ++i) {
        block.index = i;
        block.nodes[i] = this.visit(block.nodes[i]);
      }
      return block;
    };
    Evaluator.prototype.visitBlock = function(block) {
      this.stack.push(new Frame(block));
      for (block.index = 0; block.index < block.nodes.length; ++block.index) {
        try {
          block.nodes[block.index] = this.visit(block.nodes[block.index]);
        } catch (err) {
          if ("return" == err.nodeName) {
            if (this.return) {
              this.stack.pop();
              throw err;
            } else {
              block.nodes[block.index] = err;
              break;
            }
          } else {
            throw err;
          }
        }
      }
      this.stack.pop();
      return block;
    };
    Evaluator.prototype.visitAtblock = function(atblock) {
      atblock.block = this.visit(atblock.block);
      return atblock;
    };
    Evaluator.prototype.visitAtrule = function(atrule) {
      atrule.val = this.interpolate(atrule);
      if (atrule.block)
        atrule.block = this.visit(atrule.block);
      return atrule;
    };
    Evaluator.prototype.visitSupports = function(node) {
      var condition = node.condition, val;
      this.return++;
      node.condition = this.visit(condition);
      this.return--;
      val = condition.first;
      if (1 == condition.nodes.length && "string" == val.nodeName) {
        node.condition = val.string;
      }
      node.block = this.visit(node.block);
      return node;
    };
    Evaluator.prototype.visitIf = function(node) {
      var ret, block = this.currentBlock, negate = node.negate;
      this.return++;
      var ok = this.visit(node.cond).first.toBoolean();
      this.return--;
      node.block.scope = node.block.hasMedia;
      if (negate) {
        if (ok.isFalse) {
          ret = this.visit(node.block);
        }
      } else {
        if (ok.isTrue) {
          ret = this.visit(node.block);
        } else if (node.elses.length) {
          var elses = node.elses, len = elses.length, cond;
          for (var i = 0; i < len; ++i) {
            if (elses[i].cond) {
              elses[i].block.scope = elses[i].block.hasMedia;
              this.return++;
              cond = this.visit(elses[i].cond).first.toBoolean();
              this.return--;
              if (cond.isTrue) {
                ret = this.visit(elses[i].block);
                break;
              }
            } else {
              elses[i].scope = elses[i].hasMedia;
              ret = this.visit(elses[i]);
            }
          }
        }
      }
      if (ret && !node.postfix && block.node && ~[
        "group",
        "atrule",
        "media",
        "supports",
        "keyframes"
      ].indexOf(block.node.nodeName)) {
        this.mixin(ret.nodes, block);
        return nodes.null;
      }
      return ret || nodes.null;
    };
    Evaluator.prototype.visitExtend = function(extend) {
      var block = this.currentBlock;
      if ("group" != block.node.nodeName)
        block = this.closestGroup;
      extend.selectors.forEach(function(selector) {
        block.node.extends.push({
          // Cloning the selector for when we are in a loop and don't want it to affect
          // the selector nodes and cause the values to be different to expected
          selector: this.interpolate(selector.clone()).trim(),
          optional: selector.optional,
          lineno: selector.lineno,
          column: selector.column
        });
      }, this);
      return nodes.null;
    };
    Evaluator.prototype.visitImport = function(imported) {
      this.return++;
      var path = this.visit(imported.path).first, nodeName = imported.once ? "require" : "import", found, literal;
      this.return--;
      debug("import %s", path);
      if ("url" == path.name) {
        if (imported.once)
          throw new Error("You cannot @require a url");
        return imported;
      }
      if (!path.string)
        throw new Error("@" + nodeName + " string expected");
      var name = path = path.string;
      if (/(?:url\s*\(\s*)?['"]?(?:#|(?:https?:)?\/\/)/i.test(path)) {
        if (imported.once)
          throw new Error("You cannot @require a url");
        return imported;
      }
      if (/\.css(?:"|$)/.test(path)) {
        literal = true;
        if (!imported.once && !this.includeCSS) {
          return imported;
        }
      }
      if (!literal && !/\.styl$/i.test(path))
        path += ".styl";
      found = utils.find(path, this.paths, this.filename);
      if (!found) {
        found = utils.lookupIndex(name, this.paths, this.filename);
      }
      if (!found)
        throw new Error("failed to locate @" + nodeName + " file " + path);
      var block = new nodes.Block();
      for (var i = 0, len = found.length; i < len; ++i) {
        block.push(importFile.call(this, imported, found[i], literal));
      }
      return block;
    };
    Evaluator.prototype.invokeFunction = function(fn, args, content) {
      var block = new nodes.Block(fn.block.parent);
      var body = fn.block.clone(block);
      var mixinBlock = this.stack.currentFrame.block;
      this.stack.push(new Frame(block));
      var scope = this.currentScope;
      if ("arguments" != args.nodeName) {
        var expr = new nodes.Expression();
        expr.push(args);
        args = nodes.Arguments.fromExpression(expr);
      }
      scope.add(new nodes.Ident("arguments", args));
      scope.add(new nodes.Ident("mixin", this.return ? nodes.false : new nodes.String(mixinBlock.nodeName)));
      if (this.property) {
        var prop = this.propertyExpression(this.property, fn.name);
        scope.add(new nodes.Ident("current-property", prop));
      } else {
        scope.add(new nodes.Ident("current-property", nodes.null));
      }
      var expr = new nodes.Expression();
      for (var i = this.calling.length - 1; i--; ) {
        expr.push(new nodes.Literal(this.calling[i]));
      }
      ;
      scope.add(new nodes.Ident("called-from", expr));
      var i = 0, len = args.nodes.length;
      fn.params.nodes.forEach(function(node) {
        if (node.rest) {
          node.val = new nodes.Expression();
          for (; i < len; ++i)
            node.val.push(args.nodes[i]);
          node.val.preserve = true;
          node.val.isList = args.isList;
        } else {
          var arg = args.map[node.name] || args.nodes[i++];
          node = node.clone();
          if (arg) {
            arg.isEmpty ? args.nodes[i - 1] = this.visit(node) : node.val = arg;
          } else {
            args.push(node.val);
          }
          if (node.val.isNull) {
            throw new Error('argument "' + node + '" required for ' + fn);
          }
        }
        scope.add(node);
      }, this);
      if (content)
        scope.add(new nodes.Ident("block", content, true));
      return this.invoke(body, true, fn.filename);
    };
    Evaluator.prototype.invokeBuiltin = function(fn, args) {
      if (fn.raw) {
        args = args.nodes;
      } else {
        if (!fn.params) {
          fn.params = utils.params(fn);
        }
        args = fn.params.reduce(function(ret, param) {
          var arg = args.map[param] || args.nodes.shift();
          if (arg) {
            arg = utils.unwrap(arg);
            var len = arg.nodes.length;
            if (len > 1) {
              for (var i = 0; i < len; ++i) {
                ret.push(utils.unwrap(arg.nodes[i].first));
              }
            } else {
              ret.push(arg.first);
            }
          }
          return ret;
        }, []);
      }
      var body = utils.coerce(fn.apply(this, args));
      var expr = new nodes.Expression();
      expr.push(body);
      body = expr;
      return this.invoke(body);
    };
    Evaluator.prototype.invoke = function(body, stack, filename) {
      var self = this, ret;
      if (filename)
        this.paths.push(dirname(filename));
      if (this.return) {
        ret = this.eval(body.nodes);
        if (stack)
          this.stack.pop();
      } else {
        body = this.visit(body);
        if (stack)
          this.stack.pop();
        this.mixin(body.nodes, this.currentBlock);
        ret = nodes.null;
      }
      if (filename)
        this.paths.pop();
      return ret;
    };
    Evaluator.prototype.mixin = function(nodes2, block) {
      if (!nodes2.length)
        return;
      var len = block.nodes.length, head = block.nodes.slice(0, block.index), tail = block.nodes.slice(block.index + 1, len);
      this._mixin(nodes2, head, block);
      block.index = 0;
      block.nodes = head.concat(tail);
    };
    Evaluator.prototype._mixin = function(items, dest, block) {
      var node, len = items.length;
      for (var i = 0; i < len; ++i) {
        switch ((node = items[i]).nodeName) {
          case "return":
            return;
          case "block":
            this._mixin(node.nodes, dest, block);
            break;
          case "media":
            var parentNode = node.block.parent.node;
            if (parentNode && "call" != parentNode.nodeName) {
              node.block.parent = block;
            }
          case "property":
            var val = node.expr;
            if (node.literal && "block" == val.first.name) {
              val = utils.unwrap(val);
              val.nodes[0] = new nodes.Literal("block");
            }
          default:
            dest.push(node);
        }
      }
    };
    Evaluator.prototype.mixinNode = function(node) {
      node = this.visit(node.first);
      switch (node.nodeName) {
        case "object":
          this.mixinObject(node);
          return nodes.null;
        case "block":
        case "atblock":
          this.mixin(node.nodes, this.currentBlock);
          return nodes.null;
      }
    };
    Evaluator.prototype.mixinObject = function(object) {
      var Parser = require_parser(), root = this.root, str = "$block " + object.toBlock(), parser = new Parser(str, utils.merge({ root: block }, this.options)), block;
      try {
        block = parser.parse();
      } catch (err) {
        err.filename = this.filename;
        err.lineno = parser.lexer.lineno;
        err.column = parser.lexer.column;
        err.input = str;
        throw err;
      }
      block.parent = root;
      block.scope = false;
      var ret = this.visit(block), vals = ret.first.nodes;
      for (var i = 0, len = vals.length; i < len; ++i) {
        if (vals[i].block) {
          this.mixin(vals[i].block.nodes, this.currentBlock);
          break;
        }
      }
    };
    Evaluator.prototype.eval = function(vals) {
      if (!vals)
        return nodes.null;
      var len = vals.length, node = nodes.null;
      try {
        for (var i = 0; i < len; ++i) {
          node = vals[i];
          switch (node.nodeName) {
            case "if":
              if ("block" != node.block.nodeName) {
                node = this.visit(node);
                break;
              }
            case "each":
            case "block":
              node = this.visit(node);
              if (node.nodes)
                node = this.eval(node.nodes);
              break;
            default:
              node = this.visit(node);
          }
        }
      } catch (err) {
        if ("return" == err.nodeName) {
          return err.expr;
        } else {
          throw err;
        }
      }
      return node;
    };
    Evaluator.prototype.literalCall = function(call) {
      call.args = this.visit(call.args);
      return call;
    };
    Evaluator.prototype.lookupProperty = function(name) {
      var i = this.stack.length, index = this.currentBlock.index, top = i, nodes2, block, len, other;
      while (i--) {
        block = this.stack[i].block;
        if (!block.node)
          continue;
        switch (block.node.nodeName) {
          case "group":
          case "function":
          case "if":
          case "each":
          case "atrule":
          case "media":
          case "atblock":
          case "call":
            nodes2 = block.nodes;
            if (i + 1 == top) {
              while (index--) {
                if (this.property == nodes2[index])
                  continue;
                other = this.interpolate(nodes2[index]);
                if (name == other)
                  return nodes2[index].clone();
              }
            } else {
              len = nodes2.length;
              while (len--) {
                if ("property" != nodes2[len].nodeName || this.property == nodes2[len])
                  continue;
                other = this.interpolate(nodes2[len]);
                if (name == other)
                  return nodes2[len].clone();
              }
            }
            break;
        }
      }
      return nodes2.null;
    };
    Evaluator.prototype.__defineGetter__("closestBlock", function() {
      var i = this.stack.length, block;
      while (i--) {
        block = this.stack[i].block;
        if (block.node) {
          switch (block.node.nodeName) {
            case "group":
            case "keyframes":
            case "atrule":
            case "atblock":
            case "media":
            case "call":
              return block;
          }
        }
      }
    });
    Evaluator.prototype.__defineGetter__("closestGroup", function() {
      var i = this.stack.length, block;
      while (i--) {
        block = this.stack[i].block;
        if (block.node && "group" == block.node.nodeName) {
          return block;
        }
      }
    });
    Evaluator.prototype.__defineGetter__("selectorStack", function() {
      var block, stack = [];
      for (var i = 0, len = this.stack.length; i < len; ++i) {
        block = this.stack[i].block;
        if (block.node && "group" == block.node.nodeName) {
          block.node.nodes.forEach(function(selector) {
            if (!selector.val)
              selector.val = this.interpolate(selector);
          }, this);
          stack.push(block.node.nodes);
        }
      }
      return stack;
    });
    Evaluator.prototype.lookup = function(name) {
      var val;
      if (this.ignoreColors && name in colors)
        return;
      if (val = this.stack.lookup(name)) {
        return utils.unwrap(val);
      } else {
        return this.lookupFunction(name);
      }
    };
    Evaluator.prototype.interpolate = function(node) {
      var self = this, isSelector = "selector" == node.nodeName;
      function toString(node2) {
        switch (node2.nodeName) {
          case "function":
          case "ident":
            return node2.name;
          case "literal":
          case "string":
            if (self.prefix && !node2.prefixed && !node2.val.nodeName) {
              node2.val = node2.val.replace(/\.(?=[\w-])|^\.$/g, "." + self.prefix);
              node2.prefixed = true;
            }
            return node2.val;
          case "unit":
            return "%" == node2.type ? node2.val + "%" : node2.val;
          case "member":
            return toString(self.visit(node2));
          case "expression":
            if (self.calling && ~self.calling.indexOf("selector") && self._selector)
              return self._selector;
            self.return++;
            var ret = toString(self.visit(node2).first);
            self.return--;
            if (isSelector)
              self._selector = ret;
            return ret;
        }
      }
      if (node.segments) {
        return node.segments.map(toString).join("");
      } else {
        return toString(node);
      }
    };
    Evaluator.prototype.lookupFunction = function(name) {
      var fn = this.functions[name] || bifs[name];
      if (fn)
        return new nodes.Function(name, fn);
    };
    Evaluator.prototype.isDefined = function(node) {
      if ("ident" == node.nodeName) {
        return nodes.Boolean(this.lookup(node.name));
      } else {
        throw new Error('invalid "is defined" check on non-variable ' + node);
      }
    };
    Evaluator.prototype.propertyExpression = function(prop, name) {
      var expr = new nodes.Expression(), val = prop.expr.clone();
      expr.push(new nodes.String(prop.name));
      function replace(node) {
        if ("call" == node.nodeName && name == node.name) {
          return new nodes.Literal("__CALL__");
        }
        if (node.nodes)
          node.nodes = node.nodes.map(replace);
        return node;
      }
      replace(val);
      expr.push(val);
      return expr;
    };
    Evaluator.prototype.cast = function(expr) {
      return new nodes.Unit(expr.first.val, expr.nodes[1].name);
    };
    Evaluator.prototype.castable = function(expr) {
      return 2 == expr.nodes.length && "unit" == expr.first.nodeName && ~units.indexOf(expr.nodes[1].name);
    };
    Evaluator.prototype.warn = function(msg) {
      if (!this.warnings)
        return;
      console.warn("\x1B[33mWarning:\x1B[0m " + msg);
    };
    Evaluator.prototype.__defineGetter__("currentBlock", function() {
      return this.stack.currentFrame.block;
    });
    Evaluator.prototype.__defineGetter__("vendors", function() {
      return this.lookup("vendors").nodes.map(function(node) {
        return node.string;
      });
    });
    Evaluator.prototype.unvendorize = function(prop) {
      for (var i = 0, len = this.vendors.length; i < len; i++) {
        if ("official" != this.vendors[i]) {
          var vendor = "-" + this.vendors[i] + "-";
          if (~prop.indexOf(vendor))
            return prop.replace(vendor, "");
        }
      }
      return prop;
    };
    Evaluator.prototype.__defineGetter__("currentScope", function() {
      return this.stack.currentFrame.scope;
    });
    Evaluator.prototype.__defineGetter__("currentFrame", function() {
      return this.stack.currentFrame;
    });
  }
});

// node_modules/stylus/lib/nodes/node.js
var require_node2 = __commonJS({
  "node_modules/stylus/lib/nodes/node.js"(exports, module2) {
    var Evaluator = require_evaluator();
    var utils = require_utils();
    var nodes = require_nodes();
    function CoercionError(msg) {
      this.name = "CoercionError";
      this.message = msg;
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, CoercionError);
      }
    }
    CoercionError.prototype.__proto__ = Error.prototype;
    var Node = module2.exports = function Node2() {
      this.lineno = nodes.lineno || 1;
      this.column = nodes.column || 1;
      this.filename = nodes.filename;
    };
    Node.prototype = {
      constructor: Node,
      /**
       * Return this node.
       *
       * @return {Node}
       * @api public
       */
      get first() {
        return this;
      },
      /**
       * Return hash.
       *
       * @return {String}
       * @api public
       */
      get hash() {
        return this.val;
      },
      /**
       * Return node name.
       *
       * @return {String}
       * @api public
       */
      get nodeName() {
        return this.constructor.name.toLowerCase();
      },
      /**
       * Return this node.
       * 
       * @return {Node}
       * @api public
       */
      clone: function() {
        return this;
      },
      /**
       * Return a JSON representation of this node.
       *
       * @return {Object}
       * @api public
       */
      toJSON: function() {
        return {
          lineno: this.lineno,
          column: this.column,
          filename: this.filename
        };
      },
      /**
       * Nodes by default evaluate to themselves.
       *
       * @return {Node}
       * @api public
       */
      eval: function() {
        return new Evaluator(this).evaluate();
      },
      /**
       * Return true.
       *
       * @return {Boolean}
       * @api public
       */
      toBoolean: function() {
        return nodes.true;
      },
      /**
       * Return the expression, or wrap this node in an expression.
       *
       * @return {Expression}
       * @api public
       */
      toExpression: function() {
        if ("expression" == this.nodeName)
          return this;
        var expr = new nodes.Expression();
        expr.push(this);
        return expr;
      },
      /**
       * Return false if `op` is generally not coerced.
       *
       * @param {String} op
       * @return {Boolean}
       * @api private
       */
      shouldCoerce: function(op) {
        switch (op) {
          case "is a":
          case "in":
          case "||":
          case "&&":
            return false;
          default:
            return true;
        }
      },
      /**
       * Operate on `right` with the given `op`.
       *
       * @param {String} op
       * @param {Node} right
       * @return {Node}
       * @api public
       */
      operate: function(op, right) {
        switch (op) {
          case "is a":
            if ("string" == right.first.nodeName) {
              return nodes.Boolean(this.nodeName == right.val);
            } else {
              throw new Error('"is a" expects a string, got ' + right.toString());
            }
          case "==":
            return nodes.Boolean(this.hash == right.hash);
          case "!=":
            return nodes.Boolean(this.hash != right.hash);
          case ">=":
            return nodes.Boolean(this.hash >= right.hash);
          case "<=":
            return nodes.Boolean(this.hash <= right.hash);
          case ">":
            return nodes.Boolean(this.hash > right.hash);
          case "<":
            return nodes.Boolean(this.hash < right.hash);
          case "||":
            return this.toBoolean().isTrue ? this : right;
          case "in":
            var vals = utils.unwrap(right).nodes, len = vals && vals.length, hash = this.hash;
            if (!vals)
              throw new Error('"in" given invalid right-hand operand, expecting an expression');
            if (1 == len && "object" == vals[0].nodeName) {
              return nodes.Boolean(vals[0].has(this.hash));
            }
            for (var i = 0; i < len; ++i) {
              if (hash == vals[i].hash) {
                return nodes.true;
              }
            }
            return nodes.false;
          case "&&":
            var a = this.toBoolean(), b = right.toBoolean();
            return a.isTrue && b.isTrue ? right : a.isFalse ? this : right;
          default:
            if ("[]" == op) {
              var msg = "cannot perform " + this + "[" + right + "]";
            } else {
              var msg = "cannot perform " + this + " " + op + " " + right;
            }
            throw new Error(msg);
        }
      },
      /**
       * Default coercion throws.
       *
       * @param {Node} other
       * @return {Node}
       * @api public
       */
      coerce: function(other) {
        if (other.nodeName == this.nodeName)
          return other;
        throw new CoercionError("cannot coerce " + other + " to " + this.nodeName);
      }
    };
  }
});

// node_modules/stylus/lib/nodes/root.js
var require_root = __commonJS({
  "node_modules/stylus/lib/nodes/root.js"(exports, module2) {
    var Node = require_node2();
    var Root = module2.exports = function Root2() {
      this.nodes = [];
    };
    Root.prototype.__proto__ = Node.prototype;
    Root.prototype.push = function(node) {
      this.nodes.push(node);
    };
    Root.prototype.unshift = function(node) {
      this.nodes.unshift(node);
    };
    Root.prototype.clone = function() {
      var clone = new Root();
      clone.lineno = this.lineno;
      clone.column = this.column;
      clone.filename = this.filename;
      this.nodes.forEach(function(node) {
        clone.push(node.clone(clone, clone));
      });
      return clone;
    };
    Root.prototype.toString = function() {
      return "[Root]";
    };
    Root.prototype.toJSON = function() {
      return {
        __type: "Root",
        nodes: this.nodes,
        lineno: this.lineno,
        column: this.column,
        filename: this.filename
      };
    };
  }
});

// node_modules/stylus/lib/nodes/null.js
var require_null = __commonJS({
  "node_modules/stylus/lib/nodes/null.js"(exports, module2) {
    var Node = require_node2();
    var nodes = require_nodes();
    var Null = module2.exports = function Null2() {
    };
    Null.prototype.__proto__ = Node.prototype;
    Null.prototype.inspect = Null.prototype.toString = function() {
      return "null";
    };
    Null.prototype.toBoolean = function() {
      return nodes.false;
    };
    Null.prototype.__defineGetter__("isNull", function() {
      return true;
    });
    Null.prototype.__defineGetter__("hash", function() {
      return null;
    });
    Null.prototype.toJSON = function() {
      return {
        __type: "Null",
        lineno: this.lineno,
        column: this.column,
        filename: this.filename
      };
    };
  }
});

// node_modules/stylus/lib/nodes/each.js
var require_each = __commonJS({
  "node_modules/stylus/lib/nodes/each.js"(exports, module2) {
    var Node = require_node2();
    var nodes = require_nodes();
    var Each = module2.exports = function Each2(val, key, expr, block) {
      Node.call(this);
      this.val = val;
      this.key = key;
      this.expr = expr;
      this.block = block;
    };
    Each.prototype.__proto__ = Node.prototype;
    Each.prototype.clone = function(parent) {
      var clone = new Each(this.val, this.key);
      clone.expr = this.expr.clone(parent, clone);
      clone.block = this.block.clone(parent, clone);
      clone.lineno = this.lineno;
      clone.column = this.column;
      clone.filename = this.filename;
      return clone;
    };
    Each.prototype.toJSON = function() {
      return {
        __type: "Each",
        val: this.val,
        key: this.key,
        expr: this.expr,
        block: this.block,
        lineno: this.lineno,
        column: this.column,
        filename: this.filename
      };
    };
  }
});

// node_modules/stylus/lib/nodes/if.js
var require_if = __commonJS({
  "node_modules/stylus/lib/nodes/if.js"(exports, module2) {
    var Node = require_node2();
    var If = module2.exports = function If2(cond, negate) {
      Node.call(this);
      this.cond = cond;
      this.elses = [];
      if (negate && negate.nodeName) {
        this.block = negate;
      } else {
        this.negate = negate;
      }
    };
    If.prototype.__proto__ = Node.prototype;
    If.prototype.clone = function(parent) {
      var clone = new If();
      clone.cond = this.cond.clone(parent, clone);
      clone.block = this.block.clone(parent, clone);
      clone.elses = this.elses.map(function(node) {
        return node.clone(parent, clone);
      });
      clone.negate = this.negate;
      clone.postfix = this.postfix;
      clone.lineno = this.lineno;
      clone.column = this.column;
      clone.filename = this.filename;
      return clone;
    };
    If.prototype.toJSON = function() {
      return {
        __type: "If",
        cond: this.cond,
        block: this.block,
        elses: this.elses,
        negate: this.negate,
        postfix: this.postfix,
        lineno: this.lineno,
        column: this.column,
        filename: this.filename
      };
    };
  }
});

// node_modules/stylus/lib/nodes/call.js
var require_call = __commonJS({
  "node_modules/stylus/lib/nodes/call.js"(exports, module2) {
    var Node = require_node2();
    var Call = module2.exports = function Call2(name, args) {
      Node.call(this);
      this.name = name;
      this.args = args;
    };
    Call.prototype.__proto__ = Node.prototype;
    Call.prototype.clone = function(parent) {
      var clone = new Call(this.name);
      clone.args = this.args.clone(parent, clone);
      if (this.block)
        clone.block = this.block.clone(parent, clone);
      clone.lineno = this.lineno;
      clone.column = this.column;
      clone.filename = this.filename;
      return clone;
    };
    Call.prototype.toString = function() {
      var args = this.args.nodes.map(function(node) {
        var str = node.toString();
        return str.slice(1, str.length - 1);
      }).join(", ");
      return this.name + "(" + args + ")";
    };
    Call.prototype.toJSON = function() {
      var json = {
        __type: "Call",
        name: this.name,
        args: this.args,
        lineno: this.lineno,
        column: this.column,
        filename: this.filename
      };
      if (this.block)
        json.block = this.block;
      return json;
    };
  }
});

// node_modules/stylus/lib/nodes/unaryop.js
var require_unaryop = __commonJS({
  "node_modules/stylus/lib/nodes/unaryop.js"(exports, module2) {
    var Node = require_node2();
    var UnaryOp = module2.exports = function UnaryOp2(op, expr) {
      Node.call(this);
      this.op = op;
      this.expr = expr;
    };
    UnaryOp.prototype.__proto__ = Node.prototype;
    UnaryOp.prototype.clone = function(parent) {
      var clone = new UnaryOp(this.op);
      clone.expr = this.expr.clone(parent, clone);
      clone.lineno = this.lineno;
      clone.column = this.column;
      clone.filename = this.filename;
      return clone;
    };
    UnaryOp.prototype.toJSON = function() {
      return {
        __type: "UnaryOp",
        op: this.op,
        expr: this.expr,
        lineno: this.lineno,
        column: this.column,
        filename: this.filename
      };
    };
  }
});

// node_modules/stylus/lib/nodes/binop.js
var require_binop = __commonJS({
  "node_modules/stylus/lib/nodes/binop.js"(exports, module2) {
    var Node = require_node2();
    var BinOp = module2.exports = function BinOp2(op, left, right) {
      Node.call(this);
      this.op = op;
      this.left = left;
      this.right = right;
    };
    BinOp.prototype.__proto__ = Node.prototype;
    BinOp.prototype.clone = function(parent) {
      var clone = new BinOp(this.op);
      clone.left = this.left.clone(parent, clone);
      clone.right = this.right && this.right.clone(parent, clone);
      clone.lineno = this.lineno;
      clone.column = this.column;
      clone.filename = this.filename;
      if (this.val)
        clone.val = this.val.clone(parent, clone);
      return clone;
    };
    BinOp.prototype.toString = function() {
      return this.left.toString() + " " + this.op + " " + this.right.toString();
    };
    BinOp.prototype.toJSON = function() {
      var json = {
        __type: "BinOp",
        left: this.left,
        right: this.right,
        op: this.op,
        lineno: this.lineno,
        column: this.column,
        filename: this.filename
      };
      if (this.val)
        json.val = this.val;
      return json;
    };
  }
});

// node_modules/stylus/lib/nodes/ternary.js
var require_ternary = __commonJS({
  "node_modules/stylus/lib/nodes/ternary.js"(exports, module2) {
    var Node = require_node2();
    var Ternary = module2.exports = function Ternary2(cond, trueExpr, falseExpr) {
      Node.call(this);
      this.cond = cond;
      this.trueExpr = trueExpr;
      this.falseExpr = falseExpr;
    };
    Ternary.prototype.__proto__ = Node.prototype;
    Ternary.prototype.clone = function(parent) {
      var clone = new Ternary();
      clone.cond = this.cond.clone(parent, clone);
      clone.trueExpr = this.trueExpr.clone(parent, clone);
      clone.falseExpr = this.falseExpr.clone(parent, clone);
      clone.lineno = this.lineno;
      clone.column = this.column;
      clone.filename = this.filename;
      return clone;
    };
    Ternary.prototype.toJSON = function() {
      return {
        __type: "Ternary",
        cond: this.cond,
        trueExpr: this.trueExpr,
        falseExpr: this.falseExpr,
        lineno: this.lineno,
        column: this.column,
        filename: this.filename
      };
    };
  }
});

// node_modules/stylus/lib/nodes/block.js
var require_block = __commonJS({
  "node_modules/stylus/lib/nodes/block.js"(exports, module2) {
    var Node = require_node2();
    var Block = module2.exports = function Block2(parent, node) {
      Node.call(this);
      this.nodes = [];
      this.parent = parent;
      this.node = node;
      this.scope = true;
    };
    Block.prototype.__proto__ = Node.prototype;
    Block.prototype.__defineGetter__("hasProperties", function() {
      for (var i = 0, len = this.nodes.length; i < len; ++i) {
        if ("property" == this.nodes[i].nodeName) {
          return true;
        }
      }
    });
    Block.prototype.__defineGetter__("hasMedia", function() {
      for (var i = 0, len = this.nodes.length; i < len; ++i) {
        var nodeName = this.nodes[i].nodeName;
        if ("media" == nodeName) {
          return true;
        }
      }
      return false;
    });
    Block.prototype.__defineGetter__("isEmpty", function() {
      return !this.nodes.length || this.nodes.every(function(n) {
        return n.nodeName == "comment";
      });
    });
    Block.prototype.clone = function(parent, node) {
      parent = parent || this.parent;
      var clone = new Block(parent, node || this.node);
      clone.lineno = this.lineno;
      clone.column = this.column;
      clone.filename = this.filename;
      clone.scope = this.scope;
      this.nodes.forEach(function(node2) {
        clone.push(node2.clone(clone, clone));
      });
      return clone;
    };
    Block.prototype.push = function(node) {
      this.nodes.push(node);
    };
    Block.prototype.toJSON = function() {
      return {
        __type: "Block",
        // parent: this.parent,
        // node: this.node,
        scope: this.scope,
        lineno: this.lineno,
        column: this.column,
        filename: this.filename,
        nodes: this.nodes
      };
    };
  }
});

// node_modules/stylus/lib/nodes/unit.js
var require_unit2 = __commonJS({
  "node_modules/stylus/lib/nodes/unit.js"(exports, module2) {
    var Node = require_node2();
    var nodes = require_nodes();
    var FACTOR_TABLE = {
      "mm": { val: 1, label: "mm" },
      "cm": { val: 10, label: "mm" },
      "in": { val: 25.4, label: "mm" },
      "pt": { val: 25.4 / 72, label: "mm" },
      "ms": { val: 1, label: "ms" },
      "s": { val: 1e3, label: "ms" },
      "Hz": { val: 1, label: "Hz" },
      "kHz": { val: 1e3, label: "Hz" }
    };
    var Unit = module2.exports = function Unit2(val, type) {
      Node.call(this);
      this.val = val;
      this.type = type;
    };
    Unit.prototype.__proto__ = Node.prototype;
    Unit.prototype.toBoolean = function() {
      return nodes.Boolean(this.type ? true : this.val);
    };
    Unit.prototype.toString = function() {
      return this.val + (this.type || "");
    };
    Unit.prototype.clone = function() {
      var clone = new Unit(this.val, this.type);
      clone.lineno = this.lineno;
      clone.column = this.column;
      clone.filename = this.filename;
      return clone;
    };
    Unit.prototype.toJSON = function() {
      return {
        __type: "Unit",
        val: this.val,
        type: this.type,
        lineno: this.lineno,
        column: this.column,
        filename: this.filename
      };
    };
    Unit.prototype.operate = function(op, right) {
      var type = this.type || right.first.type;
      if ("rgba" == right.nodeName || "hsla" == right.nodeName) {
        return right.operate(op, this);
      }
      if (this.shouldCoerce(op)) {
        right = right.first;
        if ("%" != this.type && ("-" == op || "+" == op) && "%" == right.type) {
          right = new Unit(this.val * (right.val / 100), "%");
        } else {
          right = this.coerce(right);
        }
        switch (op) {
          case "-":
            return new Unit(this.val - right.val, type);
          case "+":
            type = type || right.type == "%" && right.type;
            return new Unit(this.val + right.val, type);
          case "/":
            return new Unit(this.val / right.val, type);
          case "*":
            return new Unit(this.val * right.val, type);
          case "%":
            return new Unit(this.val % right.val, type);
          case "**":
            return new Unit(Math.pow(this.val, right.val), type);
          case "..":
          case "...":
            var start = this.val, end = right.val, expr = new nodes.Expression(), inclusive = ".." == op;
            if (start < end) {
              do {
                expr.push(new nodes.Unit(start));
              } while (inclusive ? ++start <= end : ++start < end);
            } else {
              do {
                expr.push(new nodes.Unit(start));
              } while (inclusive ? --start >= end : --start > end);
            }
            return expr;
        }
      }
      return Node.prototype.operate.call(this, op, right);
    };
    Unit.prototype.coerce = function(other) {
      if ("unit" == other.nodeName) {
        var a = this, b = other, factorA = FACTOR_TABLE[a.type], factorB = FACTOR_TABLE[b.type];
        if (factorA && factorB && factorA.label == factorB.label) {
          var bVal = b.val * (factorB.val / factorA.val);
          return new nodes.Unit(bVal, a.type);
        } else {
          return new nodes.Unit(b.val, a.type);
        }
      } else if ("string" == other.nodeName) {
        if ("%" == other.val)
          return new nodes.Unit(0, "%");
        var val = parseFloat(other.val);
        if (isNaN(val))
          Node.prototype.coerce.call(this, other);
        return new nodes.Unit(val);
      } else {
        return Node.prototype.coerce.call(this, other);
      }
    };
  }
});

// node_modules/stylus/lib/nodes/string.js
var require_string = __commonJS({
  "node_modules/stylus/lib/nodes/string.js"(exports, module2) {
    var Node = require_node2();
    var sprintf = require_functions().s;
    var utils = require_utils();
    var nodes = require_nodes();
    var String2 = module2.exports = function String3(val, quote) {
      Node.call(this);
      this.val = val;
      this.string = val;
      this.prefixed = false;
      if (typeof quote !== "string") {
        this.quote = "'";
      } else {
        this.quote = quote;
      }
    };
    String2.prototype.__proto__ = Node.prototype;
    String2.prototype.toString = function() {
      return this.quote + this.val + this.quote;
    };
    String2.prototype.clone = function() {
      var clone = new String2(this.val, this.quote);
      clone.lineno = this.lineno;
      clone.column = this.column;
      clone.filename = this.filename;
      return clone;
    };
    String2.prototype.toJSON = function() {
      return {
        __type: "String",
        val: this.val,
        quote: this.quote,
        lineno: this.lineno,
        column: this.column,
        filename: this.filename
      };
    };
    String2.prototype.toBoolean = function() {
      return nodes.Boolean(this.val.length);
    };
    String2.prototype.coerce = function(other) {
      switch (other.nodeName) {
        case "string":
          return other;
        case "expression":
          return new String2(other.nodes.map(function(node) {
            return this.coerce(node).val;
          }, this).join(" "));
        default:
          return new String2(other.toString());
      }
    };
    String2.prototype.operate = function(op, right) {
      switch (op) {
        case "%":
          var expr = new nodes.Expression();
          expr.push(this);
          var args = "expression" == right.nodeName ? utils.unwrap(right).nodes : [right];
          return sprintf.apply(null, [expr].concat(args));
        case "+":
          var expr = new nodes.Expression();
          expr.push(new String2(this.val + this.coerce(right).val));
          return expr;
        default:
          return Node.prototype.operate.call(this, op, right);
      }
    };
  }
});

// node_modules/stylus/lib/nodes/hsla.js
var require_hsla2 = __commonJS({
  "node_modules/stylus/lib/nodes/hsla.js"(exports, module2) {
    var Node = require_node2();
    var nodes = require_nodes();
    var HSLA = exports = module2.exports = function HSLA2(h, s, l, a) {
      Node.call(this);
      this.h = clampDegrees(h);
      this.s = clampPercentage(s);
      this.l = clampPercentage(l);
      this.a = clampAlpha(a);
      this.hsla = this;
    };
    HSLA.prototype.__proto__ = Node.prototype;
    HSLA.prototype.toString = function() {
      return "hsla(" + this.h + "," + this.s.toFixed(0) + "%," + this.l.toFixed(0) + "%," + this.a + ")";
    };
    HSLA.prototype.clone = function(parent) {
      var clone = new HSLA(
        this.h,
        this.s,
        this.l,
        this.a
      );
      clone.lineno = this.lineno;
      clone.column = this.column;
      clone.filename = this.filename;
      return clone;
    };
    HSLA.prototype.toJSON = function() {
      return {
        __type: "HSLA",
        h: this.h,
        s: this.s,
        l: this.l,
        a: this.a,
        lineno: this.lineno,
        column: this.column,
        filename: this.filename
      };
    };
    HSLA.prototype.__defineGetter__("rgba", function() {
      return nodes.RGBA.fromHSLA(this);
    });
    HSLA.prototype.__defineGetter__("hash", function() {
      return this.rgba.toString();
    });
    HSLA.prototype.add = function(h, s, l) {
      return new HSLA(
        this.h + h,
        this.s + s,
        this.l + l,
        this.a
      );
    };
    HSLA.prototype.sub = function(h, s, l) {
      return this.add(-h, -s, -l);
    };
    HSLA.prototype.operate = function(op, right) {
      switch (op) {
        case "==":
        case "!=":
        case "<=":
        case ">=":
        case "<":
        case ">":
        case "is a":
        case "||":
        case "&&":
          return this.rgba.operate(op, right);
        default:
          return this.rgba.operate(op, right).hsla;
      }
    };
    exports.fromRGBA = function(rgba) {
      var r = rgba.r / 255, g = rgba.g / 255, b = rgba.b / 255, a = rgba.a;
      var min = Math.min(r, g, b), max = Math.max(r, g, b), l = (max + min) / 2, d = max - min, h, s;
      switch (max) {
        case min:
          h = 0;
          break;
        case r:
          h = 60 * (g - b) / d;
          break;
        case g:
          h = 60 * (b - r) / d + 120;
          break;
        case b:
          h = 60 * (r - g) / d + 240;
          break;
      }
      if (max == min) {
        s = 0;
      } else if (l < 0.5) {
        s = d / (2 * l);
      } else {
        s = d / (2 - 2 * l);
      }
      h %= 360;
      s *= 100;
      l *= 100;
      return new HSLA(h, s, l, a);
    };
    HSLA.prototype.adjustLightness = function(percent) {
      this.l = clampPercentage(this.l + this.l * (percent / 100));
      return this;
    };
    HSLA.prototype.adjustHue = function(deg) {
      this.h = clampDegrees(this.h + deg);
      return this;
    };
    function clampDegrees(n) {
      n = n % 360;
      return n >= 0 ? n : 360 + n;
    }
    function clampPercentage(n) {
      return Math.max(0, Math.min(n, 100));
    }
    function clampAlpha(n) {
      return Math.max(0, Math.min(n, 1));
    }
  }
});

// node_modules/stylus/lib/nodes/rgba.js
var require_rgba2 = __commonJS({
  "node_modules/stylus/lib/nodes/rgba.js"(exports, module2) {
    var Node = require_node2();
    var HSLA = require_hsla2();
    var functions = require_functions();
    var adjust = functions.adjust;
    var nodes = require_nodes();
    var RGBA = exports = module2.exports = function RGBA2(r, g, b, a) {
      Node.call(this);
      this.r = clamp(r);
      this.g = clamp(g);
      this.b = clamp(b);
      this.a = clampAlpha(a);
      this.name = "";
      this.rgba = this;
    };
    RGBA.prototype.__proto__ = Node.prototype;
    RGBA.withoutClamping = function(r, g, b, a) {
      var rgba = new RGBA(0, 0, 0, 0);
      rgba.r = r;
      rgba.g = g;
      rgba.b = b;
      rgba.a = a;
      return rgba;
    };
    RGBA.prototype.clone = function() {
      var clone = new RGBA(
        this.r,
        this.g,
        this.b,
        this.a
      );
      clone.raw = this.raw;
      clone.name = this.name;
      clone.lineno = this.lineno;
      clone.column = this.column;
      clone.filename = this.filename;
      return clone;
    };
    RGBA.prototype.toJSON = function() {
      return {
        __type: "RGBA",
        r: this.r,
        g: this.g,
        b: this.b,
        a: this.a,
        raw: this.raw,
        name: this.name,
        lineno: this.lineno,
        column: this.column,
        filename: this.filename
      };
    };
    RGBA.prototype.toBoolean = function() {
      return nodes.true;
    };
    RGBA.prototype.__defineGetter__("hsla", function() {
      return HSLA.fromRGBA(this);
    });
    RGBA.prototype.__defineGetter__("hash", function() {
      return this.toString();
    });
    RGBA.prototype.add = function(r, g, b, a) {
      return new RGBA(
        this.r + r,
        this.g + g,
        this.b + b,
        this.a + a
      );
    };
    RGBA.prototype.sub = function(r, g, b, a) {
      return new RGBA(
        this.r - r,
        this.g - g,
        this.b - b,
        a == 1 ? this.a : this.a - a
      );
    };
    RGBA.prototype.multiply = function(n) {
      return new RGBA(
        this.r * n,
        this.g * n,
        this.b * n,
        this.a
      );
    };
    RGBA.prototype.divide = function(n) {
      return new RGBA(
        this.r / n,
        this.g / n,
        this.b / n,
        this.a
      );
    };
    RGBA.prototype.operate = function(op, right) {
      if ("in" != op)
        right = right.first;
      switch (op) {
        case "is a":
          if ("string" == right.nodeName && "color" == right.string) {
            return nodes.true;
          }
          break;
        case "+":
          switch (right.nodeName) {
            case "unit":
              var n = right.val;
              switch (right.type) {
                case "%":
                  return adjust(this, new nodes.String("lightness"), right);
                case "deg":
                  return this.hsla.adjustHue(n).rgba;
                default:
                  return this.add(n, n, n, 0);
              }
            case "rgba":
              return this.add(right.r, right.g, right.b, right.a);
            case "hsla":
              return this.hsla.add(right.h, right.s, right.l);
          }
          break;
        case "-":
          switch (right.nodeName) {
            case "unit":
              var n = right.val;
              switch (right.type) {
                case "%":
                  return adjust(this, new nodes.String("lightness"), new nodes.Unit(-n, "%"));
                case "deg":
                  return this.hsla.adjustHue(-n).rgba;
                default:
                  return this.sub(n, n, n, 0);
              }
            case "rgba":
              return this.sub(right.r, right.g, right.b, right.a);
            case "hsla":
              return this.hsla.sub(right.h, right.s, right.l);
          }
          break;
        case "*":
          switch (right.nodeName) {
            case "unit":
              return this.multiply(right.val);
          }
          break;
        case "/":
          switch (right.nodeName) {
            case "unit":
              return this.divide(right.val);
          }
          break;
      }
      return Node.prototype.operate.call(this, op, right);
    };
    RGBA.prototype.toString = function() {
      function pad(n) {
        return n < 16 ? "0" + n.toString(16) : n.toString(16);
      }
      if ("transparent" == this.name)
        return this.name;
      if (1 == this.a) {
        var r = pad(this.r), g = pad(this.g), b = pad(this.b);
        if (r[0] == r[1] && g[0] == g[1] && b[0] == b[1]) {
          return "#" + r[0] + g[0] + b[0];
        } else {
          return "#" + r + g + b;
        }
      } else {
        return "rgba(" + this.r + "," + this.g + "," + this.b + "," + +this.a.toFixed(3) + ")";
      }
    };
    exports.fromHSLA = function(hsla) {
      var h = hsla.h / 360, s = hsla.s / 100, l = hsla.l / 100, a = hsla.a;
      var m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s, m1 = l * 2 - m2;
      var r = hue(h + 1 / 3) * 255, g = hue(h) * 255, b = hue(h - 1 / 3) * 255;
      function hue(h2) {
        if (h2 < 0)
          ++h2;
        if (h2 > 1)
          --h2;
        if (h2 * 6 < 1)
          return m1 + (m2 - m1) * h2 * 6;
        if (h2 * 2 < 1)
          return m2;
        if (h2 * 3 < 2)
          return m1 + (m2 - m1) * (2 / 3 - h2) * 6;
        return m1;
      }
      return new RGBA(r, g, b, a);
    };
    function clamp(n) {
      return Math.max(0, Math.min(n.toFixed(0), 255));
    }
    function clampAlpha(n) {
      return Math.max(0, Math.min(n, 1));
    }
  }
});

// node_modules/stylus/lib/nodes/ident.js
var require_ident = __commonJS({
  "node_modules/stylus/lib/nodes/ident.js"(exports, module2) {
    var Node = require_node2();
    var nodes = require_nodes();
    var Ident = module2.exports = function Ident2(name, val, mixin) {
      Node.call(this);
      this.name = name;
      this.string = name;
      this.val = val || nodes.null;
      this.mixin = !!mixin;
    };
    Ident.prototype.__defineGetter__("isEmpty", function() {
      return void 0 == this.val;
    });
    Ident.prototype.__defineGetter__("hash", function() {
      return this.name;
    });
    Ident.prototype.__proto__ = Node.prototype;
    Ident.prototype.clone = function(parent) {
      var clone = new Ident(this.name);
      clone.val = this.val.clone(parent, clone);
      clone.mixin = this.mixin;
      clone.lineno = this.lineno;
      clone.column = this.column;
      clone.filename = this.filename;
      clone.property = this.property;
      clone.rest = this.rest;
      return clone;
    };
    Ident.prototype.toJSON = function() {
      return {
        __type: "Ident",
        name: this.name,
        val: this.val,
        mixin: this.mixin,
        property: this.property,
        rest: this.rest,
        lineno: this.lineno,
        column: this.column,
        filename: this.filename
      };
    };
    Ident.prototype.toString = function() {
      return this.name;
    };
    Ident.prototype.coerce = function(other) {
      switch (other.nodeName) {
        case "ident":
        case "string":
        case "literal":
          return new Ident(other.string);
        case "unit":
          return new Ident(other.toString());
        default:
          return Node.prototype.coerce.call(this, other);
      }
    };
    Ident.prototype.operate = function(op, right) {
      var val = right.first;
      switch (op) {
        case "-":
          if ("unit" == val.nodeName) {
            var expr = new nodes.Expression();
            val = val.clone();
            val.val = -val.val;
            expr.push(this);
            expr.push(val);
            return expr;
          }
        case "+":
          return new nodes.Ident(this.string + this.coerce(val).string);
      }
      return Node.prototype.operate.call(this, op, right);
    };
  }
});

// node_modules/stylus/lib/nodes/group.js
var require_group = __commonJS({
  "node_modules/stylus/lib/nodes/group.js"(exports, module2) {
    var Node = require_node2();
    var Group = module2.exports = function Group2() {
      Node.call(this);
      this.nodes = [];
      this.extends = [];
    };
    Group.prototype.__proto__ = Node.prototype;
    Group.prototype.push = function(selector) {
      this.nodes.push(selector);
    };
    Group.prototype.__defineGetter__("block", function() {
      return this.nodes[0].block;
    });
    Group.prototype.__defineSetter__("block", function(block) {
      for (var i = 0, len = this.nodes.length; i < len; ++i) {
        this.nodes[i].block = block;
      }
    });
    Group.prototype.__defineGetter__("hasOnlyPlaceholders", function() {
      return this.nodes.every(function(selector) {
        return selector.isPlaceholder;
      });
    });
    Group.prototype.clone = function(parent) {
      var clone = new Group();
      clone.lineno = this.lineno;
      clone.column = this.column;
      this.nodes.forEach(function(node) {
        clone.push(node.clone(parent, clone));
      });
      clone.filename = this.filename;
      clone.block = this.block.clone(parent, clone);
      return clone;
    };
    Group.prototype.toJSON = function() {
      return {
        __type: "Group",
        nodes: this.nodes,
        block: this.block,
        lineno: this.lineno,
        column: this.column,
        filename: this.filename
      };
    };
  }
});

// node_modules/stylus/lib/nodes/literal.js
var require_literal = __commonJS({
  "node_modules/stylus/lib/nodes/literal.js"(exports, module2) {
    var Node = require_node2();
    var nodes = require_nodes();
    var Literal = module2.exports = function Literal2(str) {
      Node.call(this);
      this.val = str;
      this.string = str;
      this.prefixed = false;
    };
    Literal.prototype.__proto__ = Node.prototype;
    Literal.prototype.__defineGetter__("hash", function() {
      return this.val;
    });
    Literal.prototype.toString = function() {
      return this.val.toString();
    };
    Literal.prototype.coerce = function(other) {
      switch (other.nodeName) {
        case "ident":
        case "string":
        case "literal":
          return new Literal(other.string);
        default:
          return Node.prototype.coerce.call(this, other);
      }
    };
    Literal.prototype.operate = function(op, right) {
      var val = right.first;
      switch (op) {
        case "+":
          return new nodes.Literal(this.string + this.coerce(val).string);
        default:
          return Node.prototype.operate.call(this, op, right);
      }
    };
    Literal.prototype.toJSON = function() {
      return {
        __type: "Literal",
        val: this.val,
        string: this.string,
        prefixed: this.prefixed,
        lineno: this.lineno,
        column: this.column,
        filename: this.filename
      };
    };
  }
});

// node_modules/stylus/lib/nodes/boolean.js
var require_boolean = __commonJS({
  "node_modules/stylus/lib/nodes/boolean.js"(exports, module2) {
    var Node = require_node2();
    var nodes = require_nodes();
    var Boolean2 = module2.exports = function Boolean3(val) {
      Node.call(this);
      if (this.nodeName) {
        this.val = !!val;
      } else {
        return new Boolean3(val);
      }
    };
    Boolean2.prototype.__proto__ = Node.prototype;
    Boolean2.prototype.toBoolean = function() {
      return this;
    };
    Boolean2.prototype.__defineGetter__("isTrue", function() {
      return this.val;
    });
    Boolean2.prototype.__defineGetter__("isFalse", function() {
      return !this.val;
    });
    Boolean2.prototype.negate = function() {
      return new Boolean2(!this.val);
    };
    Boolean2.prototype.inspect = function() {
      return "[Boolean " + this.val + "]";
    };
    Boolean2.prototype.toString = function() {
      return this.val ? "true" : "false";
    };
    Boolean2.prototype.toJSON = function() {
      return {
        __type: "Boolean",
        val: this.val
      };
    };
  }
});

// node_modules/stylus/lib/nodes/return.js
var require_return = __commonJS({
  "node_modules/stylus/lib/nodes/return.js"(exports, module2) {
    var Node = require_node2();
    var nodes = require_nodes();
    var Return = module2.exports = function Return2(expr) {
      this.expr = expr || nodes.null;
    };
    Return.prototype.__proto__ = Node.prototype;
    Return.prototype.clone = function(parent) {
      var clone = new Return();
      clone.expr = this.expr.clone(parent, clone);
      clone.lineno = this.lineno;
      clone.column = this.column;
      clone.filename = this.filename;
      return clone;
    };
    Return.prototype.toJSON = function() {
      return {
        __type: "Return",
        expr: this.expr,
        lineno: this.lineno,
        column: this.column,
        filename: this.filename
      };
    };
  }
});

// node_modules/stylus/lib/nodes/atrule.js
var require_atrule = __commonJS({
  "node_modules/stylus/lib/nodes/atrule.js"(exports, module2) {
    var Node = require_node2();
    var Atrule = module2.exports = function Atrule2(type) {
      Node.call(this);
      this.type = type;
    };
    Atrule.prototype.__proto__ = Node.prototype;
    Atrule.prototype.__defineGetter__("hasOnlyProperties", function() {
      if (!this.block)
        return false;
      var nodes = this.block.nodes;
      for (var i = 0, len = nodes.length; i < len; ++i) {
        var nodeName = nodes[i].nodeName;
        switch (nodes[i].nodeName) {
          case "property":
          case "expression":
          case "comment":
            continue;
          default:
            return false;
        }
      }
      return true;
    });
    Atrule.prototype.clone = function(parent) {
      var clone = new Atrule(this.type);
      if (this.block)
        clone.block = this.block.clone(parent, clone);
      clone.segments = this.segments.map(function(node) {
        return node.clone(parent, clone);
      });
      clone.lineno = this.lineno;
      clone.column = this.column;
      clone.filename = this.filename;
      return clone;
    };
    Atrule.prototype.toJSON = function() {
      var json = {
        __type: "Atrule",
        type: this.type,
        segments: this.segments,
        lineno: this.lineno,
        column: this.column,
        filename: this.filename
      };
      if (this.block)
        json.block = this.block;
      return json;
    };
    Atrule.prototype.toString = function() {
      return "@" + this.type;
    };
    Atrule.prototype.__defineGetter__("hasOutput", function() {
      return !!this.block && hasOutput(this.block);
    });
    function hasOutput(block) {
      var nodes = block.nodes;
      if (nodes.every(function(node) {
        return "group" == node.nodeName && node.hasOnlyPlaceholders;
      }))
        return false;
      return nodes.some(function(node) {
        switch (node.nodeName) {
          case "property":
          case "literal":
          case "import":
            return true;
          case "block":
            return hasOutput(node);
          default:
            if (node.block)
              return hasOutput(node.block);
        }
      });
    }
  }
});

// node_modules/stylus/lib/nodes/media.js
var require_media = __commonJS({
  "node_modules/stylus/lib/nodes/media.js"(exports, module2) {
    var Atrule = require_atrule();
    var Media = module2.exports = function Media2(val) {
      Atrule.call(this, "media");
      this.val = val;
    };
    Media.prototype.__proto__ = Atrule.prototype;
    Media.prototype.clone = function(parent) {
      var clone = new Media();
      clone.val = this.val.clone(parent, clone);
      clone.block = this.block.clone(parent, clone);
      clone.lineno = this.lineno;
      clone.column = this.column;
      clone.filename = this.filename;
      return clone;
    };
    Media.prototype.toJSON = function() {
      return {
        __type: "Media",
        val: this.val,
        block: this.block,
        lineno: this.lineno,
        column: this.column,
        filename: this.filename
      };
    };
    Media.prototype.toString = function() {
      return "@media " + this.val;
    };
  }
});

// node_modules/stylus/lib/nodes/query-list.js
var require_query_list = __commonJS({
  "node_modules/stylus/lib/nodes/query-list.js"(exports, module2) {
    var Node = require_node2();
    var QueryList = module2.exports = function QueryList2() {
      Node.call(this);
      this.nodes = [];
    };
    QueryList.prototype.__proto__ = Node.prototype;
    QueryList.prototype.clone = function(parent) {
      var clone = new QueryList();
      clone.lineno = this.lineno;
      clone.column = this.column;
      clone.filename = this.filename;
      for (var i = 0; i < this.nodes.length; ++i) {
        clone.push(this.nodes[i].clone(parent, clone));
      }
      return clone;
    };
    QueryList.prototype.push = function(node) {
      this.nodes.push(node);
    };
    QueryList.prototype.merge = function(other) {
      var list = new QueryList(), merged;
      this.nodes.forEach(function(query) {
        for (var i = 0, len = other.nodes.length; i < len; ++i) {
          merged = query.merge(other.nodes[i]);
          if (merged)
            list.push(merged);
        }
      });
      return list;
    };
    QueryList.prototype.toString = function() {
      return "(" + this.nodes.map(function(node) {
        return node.toString();
      }).join(", ") + ")";
    };
    QueryList.prototype.toJSON = function() {
      return {
        __type: "QueryList",
        nodes: this.nodes,
        lineno: this.lineno,
        column: this.column,
        filename: this.filename
      };
    };
  }
});

// node_modules/stylus/lib/nodes/query.js
var require_query = __commonJS({
  "node_modules/stylus/lib/nodes/query.js"(exports, module2) {
    var Node = require_node2();
    var Query = module2.exports = function Query2() {
      Node.call(this);
      this.nodes = [];
      this.type = "";
      this.predicate = "";
    };
    Query.prototype.__proto__ = Node.prototype;
    Query.prototype.clone = function(parent) {
      var clone = new Query();
      clone.predicate = this.predicate;
      clone.type = this.type;
      for (var i = 0, len = this.nodes.length; i < len; ++i) {
        clone.push(this.nodes[i].clone(parent, clone));
      }
      clone.lineno = this.lineno;
      clone.column = this.column;
      clone.filename = this.filename;
      return clone;
    };
    Query.prototype.push = function(feature) {
      this.nodes.push(feature);
    };
    Query.prototype.__defineGetter__("resolvedType", function() {
      if (this.type) {
        return this.type.nodeName ? this.type.string : this.type;
      }
    });
    Query.prototype.__defineGetter__("resolvedPredicate", function() {
      if (this.predicate) {
        return this.predicate.nodeName ? this.predicate.string : this.predicate;
      }
    });
    Query.prototype.merge = function(other) {
      var query = new Query(), p1 = this.resolvedPredicate, p2 = other.resolvedPredicate, t1 = this.resolvedType, t2 = other.resolvedType, type, pred;
      t1 = t1 || t2;
      t2 = t2 || t1;
      if ("not" == p1 ^ "not" == p2) {
        if (t1 == t2)
          return;
        type = "not" == p1 ? t2 : t1;
        pred = "not" == p1 ? p2 : p1;
      } else if ("not" == p1 && "not" == p2) {
        if (t1 != t2)
          return;
        type = t1;
        pred = "not";
      } else if (t1 != t2) {
        return;
      } else {
        type = t1;
        pred = p1 || p2;
      }
      query.predicate = pred;
      query.type = type;
      query.nodes = this.nodes.concat(other.nodes);
      return query;
    };
    Query.prototype.toString = function() {
      var pred = this.predicate ? this.predicate + " " : "", type = this.type || "", len = this.nodes.length, str = pred + type;
      if (len) {
        str += (type && " and ") + this.nodes.map(function(expr) {
          return expr.toString();
        }).join(" and ");
      }
      return str;
    };
    Query.prototype.toJSON = function() {
      return {
        __type: "Query",
        predicate: this.predicate,
        type: this.type,
        nodes: this.nodes,
        lineno: this.lineno,
        column: this.column,
        filename: this.filename
      };
    };
  }
});

// node_modules/stylus/lib/nodes/feature.js
var require_feature = __commonJS({
  "node_modules/stylus/lib/nodes/feature.js"(exports, module2) {
    var Node = require_node2();
    var Feature = module2.exports = function Feature2(segs) {
      Node.call(this);
      this.segments = segs;
      this.expr = null;
    };
    Feature.prototype.__proto__ = Node.prototype;
    Feature.prototype.clone = function(parent) {
      var clone = new Feature();
      clone.segments = this.segments.map(function(node) {
        return node.clone(parent, clone);
      });
      if (this.expr)
        clone.expr = this.expr.clone(parent, clone);
      if (this.name)
        clone.name = this.name;
      clone.lineno = this.lineno;
      clone.column = this.column;
      clone.filename = this.filename;
      return clone;
    };
    Feature.prototype.toString = function() {
      if (this.expr) {
        return "(" + this.segments.join("") + ": " + this.expr.toString() + ")";
      } else {
        return this.segments.join("");
      }
    };
    Feature.prototype.toJSON = function() {
      var json = {
        __type: "Feature",
        segments: this.segments,
        lineno: this.lineno,
        column: this.column,
        filename: this.filename
      };
      if (this.expr)
        json.expr = this.expr;
      if (this.name)
        json.name = this.name;
      return json;
    };
  }
});

// node_modules/stylus/lib/nodes/params.js
var require_params = __commonJS({
  "node_modules/stylus/lib/nodes/params.js"(exports, module2) {
    var Node = require_node2();
    var Params = module2.exports = function Params2() {
      Node.call(this);
      this.nodes = [];
    };
    Params.prototype.__defineGetter__("length", function() {
      return this.nodes.length;
    });
    Params.prototype.__proto__ = Node.prototype;
    Params.prototype.push = function(node) {
      this.nodes.push(node);
    };
    Params.prototype.clone = function(parent) {
      var clone = new Params();
      clone.lineno = this.lineno;
      clone.column = this.column;
      clone.filename = this.filename;
      this.nodes.forEach(function(node) {
        clone.push(node.clone(parent, clone));
      });
      return clone;
    };
    Params.prototype.toJSON = function() {
      return {
        __type: "Params",
        nodes: this.nodes,
        lineno: this.lineno,
        column: this.column,
        filename: this.filename
      };
    };
  }
});

// node_modules/stylus/lib/nodes/comment.js
var require_comment = __commonJS({
  "node_modules/stylus/lib/nodes/comment.js"(exports, module2) {
    var Node = require_node2();
    var Comment = module2.exports = function Comment2(str, suppress, inline) {
      Node.call(this);
      this.str = str;
      this.suppress = suppress;
      this.inline = inline;
    };
    Comment.prototype.__proto__ = Node.prototype;
    Comment.prototype.toJSON = function() {
      return {
        __type: "Comment",
        str: this.str,
        suppress: this.suppress,
        inline: this.inline,
        lineno: this.lineno,
        column: this.column,
        filename: this.filename
      };
    };
    Comment.prototype.toString = function() {
      return this.str;
    };
  }
});

// node_modules/stylus/lib/nodes/keyframes.js
var require_keyframes = __commonJS({
  "node_modules/stylus/lib/nodes/keyframes.js"(exports, module2) {
    var Atrule = require_atrule();
    var Keyframes = module2.exports = function Keyframes2(segs, prefix) {
      Atrule.call(this, "keyframes");
      this.segments = segs;
      this.prefix = prefix || "official";
    };
    Keyframes.prototype.__proto__ = Atrule.prototype;
    Keyframes.prototype.clone = function(parent) {
      var clone = new Keyframes();
      clone.lineno = this.lineno;
      clone.column = this.column;
      clone.filename = this.filename;
      clone.segments = this.segments.map(function(node) {
        return node.clone(parent, clone);
      });
      clone.prefix = this.prefix;
      clone.block = this.block.clone(parent, clone);
      return clone;
    };
    Keyframes.prototype.toJSON = function() {
      return {
        __type: "Keyframes",
        segments: this.segments,
        prefix: this.prefix,
        block: this.block,
        lineno: this.lineno,
        column: this.column,
        filename: this.filename
      };
    };
    Keyframes.prototype.toString = function() {
      return "@keyframes " + this.segments.join("");
    };
  }
});

// node_modules/stylus/lib/nodes/member.js
var require_member = __commonJS({
  "node_modules/stylus/lib/nodes/member.js"(exports, module2) {
    var Node = require_node2();
    var Member = module2.exports = function Member2(left, right) {
      Node.call(this);
      this.left = left;
      this.right = right;
    };
    Member.prototype.__proto__ = Node.prototype;
    Member.prototype.clone = function(parent) {
      var clone = new Member();
      clone.left = this.left.clone(parent, clone);
      clone.right = this.right.clone(parent, clone);
      if (this.val)
        clone.val = this.val.clone(parent, clone);
      clone.lineno = this.lineno;
      clone.column = this.column;
      clone.filename = this.filename;
      return clone;
    };
    Member.prototype.toJSON = function() {
      var json = {
        __type: "Member",
        left: this.left,
        right: this.right,
        lineno: this.lineno,
        column: this.column,
        filename: this.filename
      };
      if (this.val)
        json.val = this.val;
      return json;
    };
    Member.prototype.toString = function() {
      return this.left.toString() + "." + this.right.toString();
    };
  }
});

// node_modules/stylus/lib/nodes/charset.js
var require_charset = __commonJS({
  "node_modules/stylus/lib/nodes/charset.js"(exports, module2) {
    var Node = require_node2();
    var Charset = module2.exports = function Charset2(val) {
      Node.call(this);
      this.val = val;
    };
    Charset.prototype.__proto__ = Node.prototype;
    Charset.prototype.toString = function() {
      return "@charset " + this.val;
    };
    Charset.prototype.toJSON = function() {
      return {
        __type: "Charset",
        val: this.val,
        lineno: this.lineno,
        column: this.column,
        filename: this.filename
      };
    };
  }
});

// node_modules/stylus/lib/nodes/namespace.js
var require_namespace = __commonJS({
  "node_modules/stylus/lib/nodes/namespace.js"(exports, module2) {
    var Node = require_node2();
    var Namespace = module2.exports = function Namespace2(val, prefix) {
      Node.call(this);
      this.val = val;
      this.prefix = prefix;
    };
    Namespace.prototype.__proto__ = Node.prototype;
    Namespace.prototype.toString = function() {
      return "@namespace " + (this.prefix ? this.prefix + " " : "") + this.val;
    };
    Namespace.prototype.toJSON = function() {
      return {
        __type: "Namespace",
        val: this.val,
        prefix: this.prefix,
        lineno: this.lineno,
        column: this.column,
        filename: this.filename
      };
    };
  }
});

// node_modules/stylus/lib/nodes/import.js
var require_import = __commonJS({
  "node_modules/stylus/lib/nodes/import.js"(exports, module2) {
    var Node = require_node2();
    var Import = module2.exports = function Import2(expr, once) {
      Node.call(this);
      this.path = expr;
      this.once = once || false;
    };
    Import.prototype.__proto__ = Node.prototype;
    Import.prototype.clone = function(parent) {
      var clone = new Import();
      clone.path = this.path.nodeName ? this.path.clone(parent, clone) : this.path;
      clone.once = this.once;
      clone.mtime = this.mtime;
      clone.lineno = this.lineno;
      clone.column = this.column;
      clone.filename = this.filename;
      return clone;
    };
    Import.prototype.toJSON = function() {
      return {
        __type: "Import",
        path: this.path,
        once: this.once,
        mtime: this.mtime,
        lineno: this.lineno,
        column: this.column,
        filename: this.filename
      };
    };
  }
});

// node_modules/stylus/lib/nodes/extend.js
var require_extend = __commonJS({
  "node_modules/stylus/lib/nodes/extend.js"(exports, module2) {
    var Node = require_node2();
    var Extend = module2.exports = function Extend2(selectors) {
      Node.call(this);
      this.selectors = selectors;
    };
    Extend.prototype.__proto__ = Node.prototype;
    Extend.prototype.clone = function() {
      return new Extend(this.selectors);
    };
    Extend.prototype.toString = function() {
      return "@extend " + this.selectors.join(", ");
    };
    Extend.prototype.toJSON = function() {
      return {
        __type: "Extend",
        selectors: this.selectors,
        lineno: this.lineno,
        column: this.column,
        filename: this.filename
      };
    };
  }
});

// node_modules/stylus/lib/nodes/object.js
var require_object = __commonJS({
  "node_modules/stylus/lib/nodes/object.js"(exports, module2) {
    var Node = require_node2();
    var nodes = require_nodes();
    var nativeObj = {}.constructor;
    var Object2 = module2.exports = function Object3() {
      Node.call(this);
      this.vals = {};
      this.keys = {};
    };
    Object2.prototype.__proto__ = Node.prototype;
    Object2.prototype.setValue = function(key, val) {
      this.vals[key] = val;
      return this;
    };
    Object2.prototype.set = Object2.prototype.setValue;
    Object2.prototype.setKey = function(key, val) {
      this.keys[key] = val;
      return this;
    };
    Object2.prototype.__defineGetter__("length", function() {
      return nativeObj.keys(this.vals).length;
    });
    Object2.prototype.get = function(key) {
      return this.vals[key] || nodes.null;
    };
    Object2.prototype.has = function(key) {
      return key in this.vals;
    };
    Object2.prototype.operate = function(op, right) {
      switch (op) {
        case ".":
        case "[]":
          return this.get(right.hash);
        case "==":
          var vals = this.vals, a, b;
          if ("object" != right.nodeName || this.length != right.length)
            return nodes.false;
          for (var key in vals) {
            a = vals[key];
            b = right.vals[key];
            if (a.operate(op, b).isFalse)
              return nodes.false;
          }
          return nodes.true;
        case "!=":
          return this.operate("==", right).negate();
        default:
          return Node.prototype.operate.call(this, op, right);
      }
    };
    Object2.prototype.toBoolean = function() {
      return nodes.Boolean(this.length);
    };
    Object2.prototype.toBlock = function() {
      var str = "{", key, val;
      for (key in this.vals) {
        val = this.get(key);
        if ("object" == val.first.nodeName) {
          str += key + " " + val.first.toBlock();
        } else {
          switch (key) {
            case "@charset":
              str += key + " " + val.first.toString() + ";";
              break;
            default:
              str += key + ":" + toString(val) + ";";
          }
        }
      }
      str += "}";
      return str;
      function toString(node) {
        if (node.nodes) {
          return node.nodes.map(toString).join(node.isList ? "," : " ");
        } else if ("literal" == node.nodeName && "," == node.val) {
          return "\\,";
        }
        return node.toString();
      }
    };
    Object2.prototype.clone = function(parent) {
      var clone = new Object2();
      clone.lineno = this.lineno;
      clone.column = this.column;
      clone.filename = this.filename;
      var key;
      for (key in this.vals) {
        clone.vals[key] = this.vals[key].clone(parent, clone);
      }
      for (key in this.keys) {
        clone.keys[key] = this.keys[key].clone(parent, clone);
      }
      return clone;
    };
    Object2.prototype.toJSON = function() {
      return {
        __type: "Object",
        vals: this.vals,
        keys: this.keys,
        lineno: this.lineno,
        column: this.column,
        filename: this.filename
      };
    };
    Object2.prototype.toString = function() {
      var obj = {};
      for (var prop in this.vals) {
        obj[prop] = this.vals[prop].toString();
      }
      return JSON.stringify(obj);
    };
  }
});

// node_modules/stylus/lib/nodes/function.js
var require_function = __commonJS({
  "node_modules/stylus/lib/nodes/function.js"(exports, module2) {
    var Node = require_node2();
    var Function2 = module2.exports = function Function3(name, params, body) {
      Node.call(this);
      this.name = name;
      this.params = params;
      this.block = body;
      if ("function" == typeof params)
        this.fn = params;
    };
    Function2.prototype.__defineGetter__("arity", function() {
      return this.params.length;
    });
    Function2.prototype.__proto__ = Node.prototype;
    Function2.prototype.__defineGetter__("hash", function() {
      return "function " + this.name;
    });
    Function2.prototype.clone = function(parent) {
      if (this.fn) {
        var clone = new Function2(
          this.name,
          this.fn
        );
      } else {
        var clone = new Function2(this.name);
        clone.params = this.params.clone(parent, clone);
        clone.block = this.block.clone(parent, clone);
      }
      clone.lineno = this.lineno;
      clone.column = this.column;
      clone.filename = this.filename;
      return clone;
    };
    Function2.prototype.toString = function() {
      if (this.fn) {
        return this.name + "(" + this.fn.toString().match(/^function *\w*\((.*?)\)/).slice(1).join(", ") + ")";
      } else {
        return this.name + "(" + this.params.nodes.join(", ") + ")";
      }
    };
    Function2.prototype.toJSON = function() {
      var json = {
        __type: "Function",
        name: this.name,
        lineno: this.lineno,
        column: this.column,
        filename: this.filename
      };
      if (this.fn) {
        json.fn = this.fn;
      } else {
        json.params = this.params;
        json.block = this.block;
      }
      return json;
    };
  }
});

// node_modules/stylus/lib/nodes/property.js
var require_property = __commonJS({
  "node_modules/stylus/lib/nodes/property.js"(exports, module2) {
    var Node = require_node2();
    var Property = module2.exports = function Property2(segs, expr) {
      Node.call(this);
      this.segments = segs;
      this.expr = expr;
    };
    Property.prototype.__proto__ = Node.prototype;
    Property.prototype.clone = function(parent) {
      var clone = new Property(this.segments);
      clone.name = this.name;
      if (this.literal)
        clone.literal = this.literal;
      clone.lineno = this.lineno;
      clone.column = this.column;
      clone.filename = this.filename;
      clone.segments = this.segments.map(function(node) {
        return node.clone(parent, clone);
      });
      if (this.expr)
        clone.expr = this.expr.clone(parent, clone);
      return clone;
    };
    Property.prototype.toJSON = function() {
      var json = {
        __type: "Property",
        segments: this.segments,
        name: this.name,
        lineno: this.lineno,
        column: this.column,
        filename: this.filename
      };
      if (this.expr)
        json.expr = this.expr;
      if (this.literal)
        json.literal = this.literal;
      return json;
    };
    Property.prototype.toString = function() {
      return "property(" + this.segments.join("") + ", " + this.expr + ")";
    };
    Property.prototype.operate = function(op, right, val) {
      return this.expr.operate(op, right, val);
    };
  }
});

// node_modules/stylus/lib/nodes/selector.js
var require_selector2 = __commonJS({
  "node_modules/stylus/lib/nodes/selector.js"(exports, module2) {
    var Block = require_block();
    var Node = require_node2();
    var Selector = module2.exports = function Selector2(segs) {
      Node.call(this);
      this.inherits = true;
      this.segments = segs;
      this.optional = false;
    };
    Selector.prototype.__proto__ = Node.prototype;
    Selector.prototype.toString = function() {
      return this.segments.join("") + (this.optional ? " !optional" : "");
    };
    Selector.prototype.__defineGetter__("isPlaceholder", function() {
      return this.val && ~this.val.substr(0, 2).indexOf("$");
    });
    Selector.prototype.clone = function(parent) {
      var clone = new Selector();
      clone.lineno = this.lineno;
      clone.column = this.column;
      clone.filename = this.filename;
      clone.inherits = this.inherits;
      clone.val = this.val;
      clone.segments = this.segments.map(function(node) {
        return node.clone(parent, clone);
      });
      clone.optional = this.optional;
      return clone;
    };
    Selector.prototype.toJSON = function() {
      return {
        __type: "Selector",
        inherits: this.inherits,
        segments: this.segments,
        optional: this.optional,
        val: this.val,
        lineno: this.lineno,
        column: this.column,
        filename: this.filename
      };
    };
  }
});

// node_modules/stylus/lib/nodes/expression.js
var require_expression = __commonJS({
  "node_modules/stylus/lib/nodes/expression.js"(exports, module2) {
    var Node = require_node2();
    var nodes = require_nodes();
    var utils = require_utils();
    var Expression = module2.exports = function Expression2(isList) {
      Node.call(this);
      this.nodes = [];
      this.isList = isList;
    };
    Expression.prototype.__defineGetter__("isEmpty", function() {
      return !this.nodes.length;
    });
    Expression.prototype.__defineGetter__("first", function() {
      return this.nodes[0] ? this.nodes[0].first : nodes.null;
    });
    Expression.prototype.__defineGetter__("hash", function() {
      return this.nodes.map(function(node) {
        return node.hash;
      }).join("::");
    });
    Expression.prototype.__proto__ = Node.prototype;
    Expression.prototype.clone = function(parent) {
      var clone = new this.constructor(this.isList);
      clone.preserve = this.preserve;
      clone.lineno = this.lineno;
      clone.column = this.column;
      clone.filename = this.filename;
      clone.nodes = this.nodes.map(function(node) {
        return node.clone(parent, clone);
      });
      return clone;
    };
    Expression.prototype.push = function(node) {
      this.nodes.push(node);
    };
    Expression.prototype.operate = function(op, right, val) {
      switch (op) {
        case "[]=":
          var self = this, range = utils.unwrap(right).nodes, val = utils.unwrap(val), len, node;
          range.forEach(function(unit) {
            len = self.nodes.length;
            if ("unit" == unit.nodeName) {
              var i2 = unit.val < 0 ? len + unit.val : unit.val, n = i2;
              while (i2-- > len)
                self.nodes[i2] = nodes.null;
              self.nodes[n] = val;
            } else if (unit.string) {
              node = self.nodes[0];
              if (node && "object" == node.nodeName)
                node.set(unit.string, val.clone());
            }
          });
          return val;
        case "[]":
          var expr = new nodes.Expression(), vals = utils.unwrap(this).nodes, range = utils.unwrap(right).nodes, node;
          range.forEach(function(unit) {
            if ("unit" == unit.nodeName) {
              node = vals[unit.val < 0 ? vals.length + unit.val : unit.val];
            } else if ("object" == vals[0].nodeName) {
              node = vals[0].get(unit.string);
            }
            if (node)
              expr.push(node);
          });
          return expr.isEmpty ? nodes.null : utils.unwrap(expr);
        case "||":
          return this.toBoolean().isTrue ? this : right;
        case "in":
          return Node.prototype.operate.call(this, op, right);
        case "!=":
          return this.operate("==", right, val).negate();
        case "==":
          var len = this.nodes.length, right = right.toExpression(), a, b;
          if (len != right.nodes.length)
            return nodes.false;
          for (var i = 0; i < len; ++i) {
            a = this.nodes[i];
            b = right.nodes[i];
            if (a.operate(op, b).isTrue)
              continue;
            return nodes.false;
          }
          return nodes.true;
          break;
        default:
          return this.first.operate(op, right, val);
      }
    };
    Expression.prototype.toBoolean = function() {
      if (this.nodes.length > 1)
        return nodes.true;
      return this.first.toBoolean();
    };
    Expression.prototype.toString = function() {
      return "(" + this.nodes.map(function(node) {
        return node.toString();
      }).join(this.isList ? ", " : " ") + ")";
    };
    Expression.prototype.toJSON = function() {
      return {
        __type: "Expression",
        isList: this.isList,
        preserve: this.preserve,
        lineno: this.lineno,
        column: this.column,
        filename: this.filename,
        nodes: this.nodes
      };
    };
  }
});

// node_modules/stylus/lib/nodes/arguments.js
var require_arguments = __commonJS({
  "node_modules/stylus/lib/nodes/arguments.js"(exports, module2) {
    var nodes = require_nodes();
    var Arguments = module2.exports = function Arguments2() {
      nodes.Expression.call(this);
      this.map = {};
    };
    Arguments.prototype.__proto__ = nodes.Expression.prototype;
    Arguments.fromExpression = function(expr) {
      var args = new Arguments(), len = expr.nodes.length;
      args.lineno = expr.lineno;
      args.column = expr.column;
      args.isList = expr.isList;
      for (var i = 0; i < len; ++i) {
        args.push(expr.nodes[i]);
      }
      return args;
    };
    Arguments.prototype.clone = function(parent) {
      var clone = nodes.Expression.prototype.clone.call(this, parent);
      clone.map = {};
      for (var key in this.map) {
        clone.map[key] = this.map[key].clone(parent, clone);
      }
      clone.isList = this.isList;
      clone.lineno = this.lineno;
      clone.column = this.column;
      clone.filename = this.filename;
      return clone;
    };
    Arguments.prototype.toJSON = function() {
      return {
        __type: "Arguments",
        map: this.map,
        isList: this.isList,
        preserve: this.preserve,
        lineno: this.lineno,
        column: this.column,
        filename: this.filename,
        nodes: this.nodes
      };
    };
  }
});

// node_modules/stylus/lib/nodes/atblock.js
var require_atblock = __commonJS({
  "node_modules/stylus/lib/nodes/atblock.js"(exports, module2) {
    var Node = require_node2();
    var Atblock = module2.exports = function Atblock2() {
      Node.call(this);
    };
    Atblock.prototype.__defineGetter__("nodes", function() {
      return this.block.nodes;
    });
    Atblock.prototype.__proto__ = Node.prototype;
    Atblock.prototype.clone = function(parent) {
      var clone = new Atblock();
      clone.block = this.block.clone(parent, clone);
      clone.lineno = this.lineno;
      clone.column = this.column;
      clone.filename = this.filename;
      return clone;
    };
    Atblock.prototype.toString = function() {
      return "@block";
    };
    Atblock.prototype.toJSON = function() {
      return {
        __type: "Atblock",
        block: this.block,
        lineno: this.lineno,
        column: this.column,
        fileno: this.fileno
      };
    };
  }
});

// node_modules/stylus/lib/nodes/supports.js
var require_supports = __commonJS({
  "node_modules/stylus/lib/nodes/supports.js"(exports, module2) {
    var Atrule = require_atrule();
    var Supports = module2.exports = function Supports2(condition) {
      Atrule.call(this, "supports");
      this.condition = condition;
    };
    Supports.prototype.__proto__ = Atrule.prototype;
    Supports.prototype.clone = function(parent) {
      var clone = new Supports();
      clone.condition = this.condition.clone(parent, clone);
      clone.block = this.block.clone(parent, clone);
      clone.lineno = this.lineno;
      clone.column = this.column;
      clone.filename = this.filename;
      return clone;
    };
    Supports.prototype.toJSON = function() {
      return {
        __type: "Supports",
        condition: this.condition,
        block: this.block,
        lineno: this.lineno,
        column: this.column,
        filename: this.filename
      };
    };
    Supports.prototype.toString = function() {
      return "@supports " + this.condition;
    };
  }
});

// node_modules/stylus/lib/nodes/index.js
var require_nodes = __commonJS({
  "node_modules/stylus/lib/nodes/index.js"(exports) {
    exports.lineno = null;
    exports.column = null;
    exports.filename = null;
    exports.Node = require_node2();
    exports.Root = require_root();
    exports.Null = require_null();
    exports.Each = require_each();
    exports.If = require_if();
    exports.Call = require_call();
    exports.UnaryOp = require_unaryop();
    exports.BinOp = require_binop();
    exports.Ternary = require_ternary();
    exports.Block = require_block();
    exports.Unit = require_unit2();
    exports.String = require_string();
    exports.HSLA = require_hsla2();
    exports.RGBA = require_rgba2();
    exports.Ident = require_ident();
    exports.Group = require_group();
    exports.Literal = require_literal();
    exports.Boolean = require_boolean();
    exports.Return = require_return();
    exports.Media = require_media();
    exports.QueryList = require_query_list();
    exports.Query = require_query();
    exports.Feature = require_feature();
    exports.Params = require_params();
    exports.Comment = require_comment();
    exports.Keyframes = require_keyframes();
    exports.Member = require_member();
    exports.Charset = require_charset();
    exports.Namespace = require_namespace();
    exports.Import = require_import();
    exports.Extend = require_extend();
    exports.Object = require_object();
    exports.Function = require_function();
    exports.Property = require_property();
    exports.Selector = require_selector2();
    exports.Expression = require_expression();
    exports.Arguments = require_arguments();
    exports.Atblock = require_atblock();
    exports.Atrule = require_atrule();
    exports.Supports = require_supports();
    exports.true = new exports.Boolean(true);
    exports.false = new exports.Boolean(false);
    exports.null = new exports.Null();
  }
});

// node_modules/stylus/lib/errors.js
var require_errors = __commonJS({
  "node_modules/stylus/lib/errors.js"(exports) {
    exports.ParseError = ParseError;
    exports.SyntaxError = SyntaxError;
    function ParseError(msg) {
      this.name = "ParseError";
      this.message = msg;
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, ParseError);
      }
    }
    ParseError.prototype.__proto__ = Error.prototype;
    function SyntaxError(msg) {
      this.name = "SyntaxError";
      this.message = msg;
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, ParseError);
      }
    }
    SyntaxError.prototype.__proto__ = Error.prototype;
  }
});

// node_modules/stylus/lib/lexer.js
var require_lexer = __commonJS({
  "node_modules/stylus/lib/lexer.js"(exports, module2) {
    var Token = require_token();
    var nodes = require_nodes();
    var errors = require_errors();
    exports = module2.exports = Lexer;
    var alias = {
      "and": "&&",
      "or": "||",
      "is": "==",
      "isnt": "!=",
      "is not": "!=",
      ":=": "?="
    };
    function Lexer(str, options) {
      options = options || {};
      this.stash = [];
      this.indentStack = [];
      this.indentRe = null;
      this.lineno = 1;
      this.column = 1;
      function comment(str2, val, offset, s) {
        var inComment = s.lastIndexOf("/*", offset) > s.lastIndexOf("*/", offset), commentIdx = s.lastIndexOf("//", offset), i = s.lastIndexOf("\n", offset), double = 0, single = 0;
        if (~commentIdx && commentIdx > i) {
          while (i != offset) {
            if ("'" == s[i])
              single ? single-- : single++;
            if ('"' == s[i])
              double ? double-- : double++;
            if ("/" == s[i] && "/" == s[i + 1]) {
              inComment = !single && !double;
              break;
            }
            ++i;
          }
        }
        return inComment ? str2 : val === "," && /^[,\t\n]+$/.test(str2) ? str2.replace(/\n/, "\r") : val + "\r";
      }
      ;
      if ("\uFEFF" == str.charAt(0))
        str = str.slice(1);
      this.str = str.replace(/\s+$/, "\n").replace(/\r\n?/g, "\n").replace(/\\ *\n/g, "\r").replace(/([,(:](?!\/\/[^ ])) *(?:\/\/[^\n]*|\/\*.*?\*\/)?\n\s*/g, comment).replace(/\s*\n[ \t]*([,)])/g, comment);
    }
    Lexer.prototype = {
      /**
       * Custom inspect.
       */
      inspect: function() {
        var tok, tmp = this.str, buf = [];
        while ("eos" != (tok = this.next()).type) {
          buf.push(tok.inspect());
        }
        this.str = tmp;
        return buf.concat(tok.inspect()).join("\n");
      },
      /**
       * Lookahead `n` tokens.
       *
       * @param {Number} n
       * @return {Object}
       * @api private
       */
      lookahead: function(n) {
        var fetch2 = n - this.stash.length;
        while (fetch2-- > 0)
          this.stash.push(this.advance());
        return this.stash[--n];
      },
      /**
       * Consume the given `len`.
       *
       * @param {Number|Array} len
       * @api private
       */
      skip: function(len) {
        var chunk = len[0];
        len = chunk ? chunk.length : len;
        this.str = this.str.substr(len);
        if (chunk) {
          this.move(chunk);
        } else {
          this.column += len;
        }
      },
      /**
       * Move current line and column position.
       *
       * @param {String} str
       * @api private
       */
      move: function(str) {
        var lines = str.match(/\n/g), idx = str.lastIndexOf("\n");
        if (lines)
          this.lineno += lines.length;
        this.column = ~idx ? str.length - idx : this.column + str.length;
      },
      /**
       * Fetch next token including those stashed by peek.
       *
       * @return {Token}
       * @api private
       */
      next: function() {
        var tok = this.stashed() || this.advance();
        this.prev = tok;
        return tok;
      },
      /**
       * Check if the current token is a part of selector.
       *
       * @return {Boolean}
       * @api private
       */
      isPartOfSelector: function() {
        var tok = this.stash[this.stash.length - 1] || this.prev;
        switch (tok && tok.type) {
          case "color":
            return 2 == tok.val.raw.length;
          case ".":
          case "[":
            return true;
        }
        return false;
      },
      /**
       * Fetch next token.
       *
       * @return {Token}
       * @api private
       */
      advance: function() {
        var column = this.column, line = this.lineno, tok = this.eos() || this.null() || this.sep() || this.keyword() || this.urlchars() || this.comment() || this.newline() || this.escaped() || this.important() || this.literal() || this.anonFunc() || this.atrule() || this.function() || this.brace() || this.paren() || this.color() || this.string() || this.unit() || this.namedop() || this.boolean() || this.unicode() || this.ident() || this.op() || function() {
          var token = this.eol();
          if (token) {
            column = token.column;
            line = token.lineno;
          }
          return token;
        }.call(this) || this.space() || this.selector();
        tok.lineno = line;
        tok.column = column;
        return tok;
      },
      /**
       * Lookahead a single token.
       *
       * @return {Token}
       * @api private
       */
      peek: function() {
        return this.lookahead(1);
      },
      /**
       * Return the next possibly stashed token.
       *
       * @return {Token}
       * @api private
       */
      stashed: function() {
        return this.stash.shift();
      },
      /**
       * EOS | trailing outdents.
       */
      eos: function() {
        if (this.str.length)
          return;
        if (this.indentStack.length) {
          this.indentStack.shift();
          return new Token("outdent");
        } else {
          return new Token("eos");
        }
      },
      /**
       * url char
       */
      urlchars: function() {
        var captures;
        if (!this.isURL)
          return;
        if (captures = /^[\/:@.;?&=*!,<>#%0-9]+/.exec(this.str)) {
          this.skip(captures);
          return new Token("literal", new nodes.Literal(captures[0]));
        }
      },
      /**
       * ';' [ \t]*
       */
      sep: function() {
        var captures;
        if (captures = /^;[ \t]*/.exec(this.str)) {
          this.skip(captures);
          return new Token(";");
        }
      },
      /**
       * '\r'
       */
      eol: function() {
        if ("\r" == this.str[0]) {
          ++this.lineno;
          this.skip(1);
          this.column = 1;
          while (this.space())
            ;
          return this.advance();
        }
      },
      /**
       * ' '+
       */
      space: function() {
        var captures;
        if (captures = /^([ \t]+)/.exec(this.str)) {
          this.skip(captures);
          return new Token("space");
        }
      },
      /**
       * '\\' . ' '*
       */
      escaped: function() {
        var captures;
        if (captures = /^\\(.)[ \t]*/.exec(this.str)) {
          var c = captures[1];
          this.skip(captures);
          return new Token("ident", new nodes.Literal(c));
        }
      },
      /**
       * '@css' ' '* '{' .* '}' ' '*
       */
      literal: function() {
        var captures;
        if (captures = /^@css[ \t]*\{/.exec(this.str)) {
          this.skip(captures);
          var c, braces = 1, css2 = "", node;
          while (c = this.str[0]) {
            this.str = this.str.substr(1);
            switch (c) {
              case "{":
                ++braces;
                break;
              case "}":
                --braces;
                break;
              case "\n":
              case "\r":
                ++this.lineno;
                break;
            }
            css2 += c;
            if (!braces)
              break;
          }
          css2 = css2.replace(/\s*}$/, "");
          node = new nodes.Literal(css2);
          node.css = true;
          return new Token("literal", node);
        }
      },
      /**
       * '!important' ' '*
       */
      important: function() {
        var captures;
        if (captures = /^!important[ \t]*/.exec(this.str)) {
          this.skip(captures);
          return new Token("ident", new nodes.Literal("!important"));
        }
      },
      /**
       * '{' | '}'
       */
      brace: function() {
        var captures;
        if (captures = /^([{}])/.exec(this.str)) {
          this.skip(1);
          var brace = captures[1];
          return new Token(brace, brace);
        }
      },
      /**
       * '(' | ')' ' '*
       */
      paren: function() {
        var captures;
        if (captures = /^([()])([ \t]*)/.exec(this.str)) {
          var paren = captures[1];
          this.skip(captures);
          if (")" == paren)
            this.isURL = false;
          var tok = new Token(paren, paren);
          tok.space = captures[2];
          return tok;
        }
      },
      /**
       * 'null'
       */
      null: function() {
        var captures, tok;
        if (captures = /^(null)\b[ \t]*/.exec(this.str)) {
          this.skip(captures);
          if (this.isPartOfSelector()) {
            tok = new Token("ident", new nodes.Ident(captures[0]));
          } else {
            tok = new Token("null", nodes.null);
          }
          return tok;
        }
      },
      /**
       *   'if'
       * | 'else'
       * | 'unless'
       * | 'return'
       * | 'for'
       * | 'in'
       */
      keyword: function() {
        var captures, tok;
        if (captures = /^(return|if|else|unless|for|in)\b(?!-)[ \t]*/.exec(this.str)) {
          var keyword = captures[1];
          this.skip(captures);
          if (this.isPartOfSelector()) {
            tok = new Token("ident", new nodes.Ident(captures[0]));
          } else {
            tok = new Token(keyword, keyword);
          }
          return tok;
        }
      },
      /**
       *   'not'
       * | 'and'
       * | 'or'
       * | 'is'
       * | 'is not'
       * | 'isnt'
       * | 'is a'
       * | 'is defined'
       */
      namedop: function() {
        var captures, tok;
        if (captures = /^(not|and|or|is a|is defined|isnt|is not|is)(?!-)\b([ \t]*)/.exec(this.str)) {
          var op = captures[1];
          this.skip(captures);
          if (this.isPartOfSelector()) {
            tok = new Token("ident", new nodes.Ident(captures[0]));
          } else {
            op = alias[op] || op;
            tok = new Token(op, op);
          }
          tok.space = captures[2];
          return tok;
        }
      },
      /**
       *   ','
       * | '+'
       * | '+='
       * | '-'
       * | '-='
       * | '*'
       * | '*='
       * | '/'
       * | '/='
       * | '%'
       * | '%='
       * | '**'
       * | '!'
       * | '&'
       * | '&&'
       * | '||'
       * | '>'
       * | '>='
       * | '<'
       * | '<='
       * | '='
       * | '=='
       * | '!='
       * | '!'
       * | '~'
       * | '?='
       * | ':='
       * | '?'
       * | ':'
       * | '['
       * | ']'
       * | '.'
       * | '..'
       * | '...'
       */
      op: function() {
        var captures;
        if (captures = /^([.]{1,3}|&&|\|\||[!<>=?:]=|\*\*|[-+*\/%]=?|[,=?:!~<>&\[\]])([ \t]*)/.exec(this.str)) {
          var op = captures[1];
          this.skip(captures);
          op = alias[op] || op;
          var tok = new Token(op, op);
          tok.space = captures[2];
          this.isURL = false;
          return tok;
        }
      },
      /**
       * '@('
       */
      anonFunc: function() {
        var tok;
        if ("@" == this.str[0] && "(" == this.str[1]) {
          this.skip(2);
          tok = new Token("function", new nodes.Ident("anonymous"));
          tok.anonymous = true;
          return tok;
        }
      },
      /**
       * '@' (-(\w+)-)?[a-zA-Z0-9-_]+
       */
      atrule: function() {
        var captures;
        if (captures = /^@(?!apply)(?:-(\w+)-)?([a-zA-Z0-9-_]+)[ \t]*/.exec(this.str)) {
          this.skip(captures);
          var vendor = captures[1], type = captures[2], tok;
          switch (type) {
            case "require":
            case "import":
            case "charset":
            case "namespace":
            case "media":
            case "scope":
            case "supports":
              return new Token(type);
            case "document":
              return new Token("-moz-document");
            case "block":
              return new Token("atblock");
            case "extend":
            case "extends":
              return new Token("extend");
            case "keyframes":
              return new Token(type, vendor);
            default:
              return new Token("atrule", vendor ? "-" + vendor + "-" + type : type);
          }
        }
      },
      /**
       * '//' *
       */
      comment: function() {
        if ("/" == this.str[0] && "/" == this.str[1]) {
          var end = this.str.indexOf("\n");
          if (-1 == end)
            end = this.str.length;
          this.skip(end);
          return this.advance();
        }
        if ("/" == this.str[0] && "*" == this.str[1]) {
          var end = this.str.indexOf("*/");
          if (-1 == end)
            end = this.str.length;
          var str = this.str.substr(0, end + 2), lines = str.split(/\n|\r/).length - 1, suppress = true, inline = false;
          this.lineno += lines;
          this.skip(end + 2);
          if ("!" == str[2]) {
            str = str.replace("*!", "*");
            suppress = false;
          }
          if (this.prev && ";" == this.prev.type)
            inline = true;
          return new Token("comment", new nodes.Comment(str, suppress, inline));
        }
      },
      /**
       * 'true' | 'false'
       */
      boolean: function() {
        var captures;
        if (captures = /^(true|false)\b([ \t]*)/.exec(this.str)) {
          var val = nodes.Boolean("true" == captures[1]);
          this.skip(captures);
          var tok = new Token("boolean", val);
          tok.space = captures[2];
          return tok;
        }
      },
      /**
       * 'U+' [0-9A-Fa-f?]{1,6}(?:-[0-9A-Fa-f]{1,6})?
       */
      unicode: function() {
        var captures;
        if (captures = /^u\+[0-9a-f?]{1,6}(?:-[0-9a-f]{1,6})?/i.exec(this.str)) {
          this.skip(captures);
          return new Token("literal", new nodes.Literal(captures[0]));
        }
      },
      /**
       * -*[_a-zA-Z$] [-\w\d$]* '('
       */
      function: function() {
        var captures;
        if (captures = /^(-*[_a-zA-Z$][-\w\d$]*)\(([ \t]*)/.exec(this.str)) {
          var name = captures[1];
          this.skip(captures);
          this.isURL = "url" == name;
          var tok = new Token("function", new nodes.Ident(name));
          tok.space = captures[2];
          return tok;
        }
      },
      /**
       * -*[_a-zA-Z$] [-\w\d$]*
       */
      ident: function() {
        var captures;
        if (captures = /^-*([_a-zA-Z$]|@apply)[-\w\d$]*/.exec(this.str)) {
          this.skip(captures);
          return new Token("ident", new nodes.Ident(captures[0]));
        }
      },
      /**
       * '\n' ' '+
       */
      newline: function() {
        var captures, re;
        if (this.indentRe) {
          captures = this.indentRe.exec(this.str);
        } else {
          re = /^\n([\t]*)[ \t]*/;
          captures = re.exec(this.str);
          if (captures && !captures[1].length) {
            re = /^\n([ \t]*)/;
            captures = re.exec(this.str);
          }
          if (captures && captures[1].length)
            this.indentRe = re;
        }
        if (captures) {
          var tok, indents = captures[1].length;
          this.skip(captures);
          if (this.str[0] === " " || this.str[0] === "	") {
            throw new errors.SyntaxError("Invalid indentation. You can use tabs or spaces to indent, but not both.");
          }
          if ("\n" == this.str[0])
            return this.advance();
          if (this.indentStack.length && indents < this.indentStack[0]) {
            while (this.indentStack.length && this.indentStack[0] > indents) {
              this.stash.push(new Token("outdent"));
              this.indentStack.shift();
            }
            tok = this.stash.pop();
          } else if (indents && indents != this.indentStack[0]) {
            this.indentStack.unshift(indents);
            tok = new Token("indent");
          } else {
            tok = new Token("newline");
          }
          return tok;
        }
      },
      /**
       * '-'? (digit+ | digit* '.' digit+) unit
       */
      unit: function() {
        var captures;
        if (captures = /^(-)?(\d+\.\d+|\d+|\.\d+)(%|[a-zA-Z]+)?[ \t]*/.exec(this.str)) {
          this.skip(captures);
          var n = parseFloat(captures[2]);
          if ("-" == captures[1])
            n = -n;
          var node = new nodes.Unit(n, captures[3]);
          node.raw = captures[0];
          return new Token("unit", node);
        }
      },
      /**
       * '"' [^"]+ '"' | "'"" [^']+ "'"
       */
      string: function() {
        var captures;
        if (captures = /^("[^"]*"|'[^']*')[ \t]*/.exec(this.str)) {
          var str = captures[1], quote = captures[0][0];
          this.skip(captures);
          str = str.slice(1, -1).replace(/\\n/g, "\n");
          return new Token("string", new nodes.String(str, quote));
        }
      },
      /**
       * #rrggbbaa | #rrggbb | #rgba | #rgb | #nn | #n
       */
      color: function() {
        return this.rrggbbaa() || this.rrggbb() || this.rgba() || this.rgb() || this.nn() || this.n();
      },
      /**
       * #n
       */
      n: function() {
        var captures;
        if (captures = /^#([a-fA-F0-9]{1})[ \t]*/.exec(this.str)) {
          this.skip(captures);
          var n = parseInt(captures[1] + captures[1], 16), color = new nodes.RGBA(n, n, n, 1);
          color.raw = captures[0];
          return new Token("color", color);
        }
      },
      /**
       * #nn
       */
      nn: function() {
        var captures;
        if (captures = /^#([a-fA-F0-9]{2})[ \t]*/.exec(this.str)) {
          this.skip(captures);
          var n = parseInt(captures[1], 16), color = new nodes.RGBA(n, n, n, 1);
          color.raw = captures[0];
          return new Token("color", color);
        }
      },
      /**
       * #rgb
       */
      rgb: function() {
        var captures;
        if (captures = /^#([a-fA-F0-9]{3})[ \t]*/.exec(this.str)) {
          this.skip(captures);
          var rgb = captures[1], r = parseInt(rgb[0] + rgb[0], 16), g = parseInt(rgb[1] + rgb[1], 16), b = parseInt(rgb[2] + rgb[2], 16), color = new nodes.RGBA(r, g, b, 1);
          color.raw = captures[0];
          return new Token("color", color);
        }
      },
      /**
       * #rgba
       */
      rgba: function() {
        var captures;
        if (captures = /^#([a-fA-F0-9]{4})[ \t]*/.exec(this.str)) {
          this.skip(captures);
          var rgb = captures[1], r = parseInt(rgb[0] + rgb[0], 16), g = parseInt(rgb[1] + rgb[1], 16), b = parseInt(rgb[2] + rgb[2], 16), a = parseInt(rgb[3] + rgb[3], 16), color = new nodes.RGBA(r, g, b, a / 255);
          color.raw = captures[0];
          return new Token("color", color);
        }
      },
      /**
       * #rrggbb
       */
      rrggbb: function() {
        var captures;
        if (captures = /^#([a-fA-F0-9]{6})[ \t]*/.exec(this.str)) {
          this.skip(captures);
          var rgb = captures[1], r = parseInt(rgb.substr(0, 2), 16), g = parseInt(rgb.substr(2, 2), 16), b = parseInt(rgb.substr(4, 2), 16), color = new nodes.RGBA(r, g, b, 1);
          color.raw = captures[0];
          return new Token("color", color);
        }
      },
      /**
       * #rrggbbaa
       */
      rrggbbaa: function() {
        var captures;
        if (captures = /^#([a-fA-F0-9]{8})[ \t]*/.exec(this.str)) {
          this.skip(captures);
          var rgb = captures[1], r = parseInt(rgb.substr(0, 2), 16), g = parseInt(rgb.substr(2, 2), 16), b = parseInt(rgb.substr(4, 2), 16), a = parseInt(rgb.substr(6, 2), 16), color = new nodes.RGBA(r, g, b, a / 255);
          color.raw = captures[0];
          return new Token("color", color);
        }
      },
      /**
       * ^|[^\n,;]+
       */
      selector: function() {
        var captures;
        if (captures = /^\^|.*?(?=\/\/(?![^\[]*\])|[,\n{])/.exec(this.str)) {
          var selector = captures[0];
          this.skip(captures);
          return new Token("selector", selector);
        }
      }
    };
  }
});

// node_modules/stylus/lib/cache/memory.js
var require_memory = __commonJS({
  "node_modules/stylus/lib/cache/memory.js"(exports, module2) {
    var crypto = require("crypto");
    var nodes = require_nodes();
    var MemoryCache = module2.exports = function(options) {
      options = options || {};
      this.limit = options["cache limit"] || 256;
      this._cache = {};
      this.length = 0;
      this.head = this.tail = null;
    };
    MemoryCache.prototype.set = function(key, value) {
      var clone = value.clone(), item;
      clone.filename = nodes.filename;
      clone.lineno = nodes.lineno;
      clone.column = nodes.column;
      item = { key, value: clone };
      this._cache[key] = item;
      if (this.tail) {
        this.tail.next = item;
        item.prev = this.tail;
      } else {
        this.head = item;
      }
      this.tail = item;
      if (this.length++ == this.limit)
        this.purge();
    };
    MemoryCache.prototype.get = function(key) {
      var item = this._cache[key], val = item.value.clone();
      if (item == this.tail)
        return val;
      if (item.next) {
        if (item == this.head)
          this.head = item.next;
        item.next.prev = item.prev;
      }
      if (item.prev)
        item.prev.next = item.next;
      item.next = null;
      item.prev = this.tail;
      if (this.tail)
        this.tail.next = item;
      this.tail = item;
      return val;
    };
    MemoryCache.prototype.has = function(key) {
      return !!this._cache[key];
    };
    MemoryCache.prototype.key = function(str, options) {
      var hash = crypto.createHash("sha1");
      hash.update(str + options.prefix);
      return hash.digest("hex");
    };
    MemoryCache.prototype.purge = function() {
      var item = this.head;
      if (this.head.next) {
        this.head = this.head.next;
        this.head.prev = null;
      }
      this._cache[item.key] = item.prev = item.next = null;
      this.length--;
    };
  }
});

// node_modules/stylus/lib/cache/null.js
var require_null2 = __commonJS({
  "node_modules/stylus/lib/cache/null.js"(exports, module2) {
    var NullCache = module2.exports = function() {
    };
    NullCache.prototype.set = function(key, value) {
    };
    NullCache.prototype.get = function(key) {
    };
    NullCache.prototype.has = function(key) {
      return false;
    };
    NullCache.prototype.key = function(str, options) {
      return "";
    };
  }
});

// node_modules/stylus/lib/cache/index.js
var require_cache = __commonJS({
  "node_modules/stylus/lib/cache/index.js"(exports, module2) {
    var getCache = module2.exports = function(name, options) {
      if ("function" == typeof name)
        return new name(options);
      var cache;
      switch (name) {
        case "memory":
          cache = require_memory();
          break;
        default:
          cache = require_null2();
      }
      return new cache(options);
    };
  }
});

// node_modules/stylus/lib/parser.js
var require_parser = __commonJS({
  "node_modules/stylus/lib/parser.js"(exports, module2) {
    var Lexer = require_lexer();
    var nodes = require_nodes();
    var Token = require_token();
    var units = require_units();
    var errors = require_errors();
    var cache = require_cache();
    var debug = {
      lexer: require_src()("stylus:lexer"),
      selector: require_src()("stylus:parser:selector")
    };
    var selectorTokens = [
      "ident",
      "string",
      "selector",
      "function",
      "comment",
      "boolean",
      "space",
      "color",
      "unit",
      "for",
      "in",
      "[",
      "]",
      "(",
      ")",
      "+",
      "-",
      "*",
      "*=",
      "<",
      ">",
      "=",
      ":",
      "&",
      "&&",
      "~",
      "{",
      "}",
      ".",
      "..",
      "/"
    ];
    var pseudoSelectors = [
      // https://www.w3.org/TR/selectors-4/#logical-combination
      // Logical Combinations
      "is",
      "has",
      "where",
      "not",
      "dir",
      "lang",
      "any-link",
      "link",
      "visited",
      "local-link",
      "target",
      "scope",
      "hover",
      "active",
      "focus",
      "drop",
      "current",
      "past",
      "future",
      "enabled",
      "disabled",
      "read-only",
      "read-write",
      "placeholder-shown",
      "checked",
      "indeterminate",
      "valid",
      "invalid",
      "in-range",
      "out-of-range",
      "required",
      "optional",
      "user-error",
      "root",
      "empty",
      "blank",
      "nth-child",
      "nth-last-child",
      "first-child",
      "last-child",
      "only-child",
      "nth-of-type",
      "nth-last-of-type",
      "first-of-type",
      "last-of-type",
      "only-of-type",
      "nth-match",
      "nth-last-match",
      "nth-column",
      "nth-last-column",
      "first-line",
      "first-letter",
      "before",
      "after",
      "selection"
    ];
    var Parser = module2.exports = function Parser2(str, options) {
      var self = this;
      options = options || {};
      Parser2.cache = Parser2.cache || Parser2.getCache(options);
      this.hash = Parser2.cache.key(str, options);
      this.lexer = {};
      if (!Parser2.cache.has(this.hash)) {
        this.lexer = new Lexer(str, options);
      }
      this.prefix = options.prefix || "";
      this.root = options.root || new nodes.Root();
      this.state = ["root"];
      this.stash = [];
      this.parens = 0;
      this.css = 0;
      this.state.pop = function() {
        self.prevState = [].pop.call(this);
      };
    };
    Parser.getCache = function(options) {
      return false === options.cache ? cache(false) : cache(options.cache || "memory", options);
    };
    Parser.prototype = {
      /**
       * Constructor.
       */
      constructor: Parser,
      /**
       * Return current state.
       *
       * @return {String}
       * @api private
       */
      currentState: function() {
        return this.state[this.state.length - 1];
      },
      /**
       * Return previous state.
       *
       * @return {String}
       * @api private
       */
      previousState: function() {
        return this.state[this.state.length - 2];
      },
      /**
       * Parse the input, then return the root node.
       *
       * @return {Node}
       * @api private
       */
      parse: function() {
        var block = this.parent = this.root;
        if (Parser.cache.has(this.hash)) {
          block = Parser.cache.get(this.hash);
          if ("block" == block.nodeName)
            block.constructor = nodes.Root;
        } else {
          while ("eos" != this.peek().type) {
            this.skipWhitespace();
            if ("eos" == this.peek().type)
              break;
            var stmt = this.statement();
            this.accept(";");
            if (!stmt)
              this.error("unexpected token {peek}, not allowed at the root level");
            block.push(stmt);
          }
          Parser.cache.set(this.hash, block);
        }
        return block;
      },
      /**
       * Throw an `Error` with the given `msg`.
       *
       * @param {String} msg
       * @api private
       */
      error: function(msg) {
        var type = this.peek().type, val = void 0 == this.peek().val ? "" : " " + this.peek().toString();
        if (val.trim() == type.trim())
          val = "";
        throw new errors.ParseError(msg.replace("{peek}", '"' + type + val + '"'));
      },
      /**
       * Accept the given token `type`, and return it,
       * otherwise return `undefined`.
       *
       * @param {String} type
       * @return {Token}
       * @api private
       */
      accept: function(type) {
        if (type == this.peek().type) {
          return this.next();
        }
      },
      /**
       * Expect token `type` and return it, throw otherwise.
       *
       * @param {String} type
       * @return {Token}
       * @api private
       */
      expect: function(type) {
        if (type != this.peek().type) {
          this.error('expected "' + type + '", got {peek}');
        }
        return this.next();
      },
      /**
       * Get the next token.
       *
       * @return {Token}
       * @api private
       */
      next: function() {
        var tok = this.stash.length ? this.stash.pop() : this.lexer.next(), line = tok.lineno, column = tok.column || 1;
        if (tok.val && tok.val.nodeName) {
          tok.val.lineno = line;
          tok.val.column = column;
        }
        nodes.lineno = line;
        nodes.column = column;
        debug.lexer("%s %s", tok.type, tok.val || "");
        return tok;
      },
      /**
       * Peek with lookahead(1).
       *
       * @return {Token}
       * @api private
       */
      peek: function() {
        return this.lexer.peek();
      },
      /**
       * Lookahead `n` tokens.
       *
       * @param {Number} n
       * @return {Token}
       * @api private
       */
      lookahead: function(n) {
        return this.lexer.lookahead(n);
      },
      /**
       * Check if the token at `n` is a valid selector token.
       *
       * @param {Number} n
       * @return {Boolean}
       * @api private
       */
      isSelectorToken: function(n) {
        var la = this.lookahead(n).type;
        switch (la) {
          case "for":
            return this.bracketed;
          case "[":
            this.bracketed = true;
            return true;
          case "]":
            this.bracketed = false;
            return true;
          default:
            return ~selectorTokens.indexOf(la);
        }
      },
      /**
       * Check if the token at `n` is a pseudo selector.
       *
       * @param {Number} n
       * @return {Boolean}
       * @api private
       */
      isPseudoSelector: function(n) {
        var val = this.lookahead(n).val;
        return val && ~pseudoSelectors.indexOf(val.name);
      },
      /**
       * Check if the current line contains `type`.
       *
       * @param {String} type
       * @return {Boolean}
       * @api private
       */
      lineContains: function(type) {
        var i = 1, la;
        while (la = this.lookahead(i++)) {
          if (~["indent", "outdent", "newline", "eos"].indexOf(la.type))
            return;
          if (type == la.type)
            return true;
        }
      },
      /**
       * Valid selector tokens.
       */
      selectorToken: function() {
        if (this.isSelectorToken(1)) {
          if ("{" == this.peek().type) {
            if (!this.lineContains("}"))
              return;
            var i = 0, la;
            while (la = this.lookahead(++i)) {
              if ("}" == la.type) {
                if (i == 2 || i == 3 && this.lookahead(i - 1).type == "space")
                  return;
                break;
              }
              if (":" == la.type)
                return;
            }
          }
          return this.next();
        }
      },
      /**
       * Skip the given `tokens`.
       *
       * @param {Array} tokens
       * @api private
       */
      skip: function(tokens) {
        while (~tokens.indexOf(this.peek().type))
          this.next();
      },
      /**
       * Consume whitespace.
       */
      skipWhitespace: function() {
        this.skip(["space", "indent", "outdent", "newline"]);
      },
      /**
       * Consume newlines.
       */
      skipNewlines: function() {
        while ("newline" == this.peek().type)
          this.next();
      },
      /**
       * Consume spaces.
       */
      skipSpaces: function() {
        while ("space" == this.peek().type)
          this.next();
      },
      /**
       * Consume spaces and comments.
       */
      skipSpacesAndComments: function() {
        while ("space" == this.peek().type || "comment" == this.peek().type)
          this.next();
      },
      /**
       * Check if the following sequence of tokens
       * forms a function definition, ie trailing
       * `{` or indentation.
       */
      looksLikeFunctionDefinition: function(i) {
        return "indent" == this.lookahead(i).type || "{" == this.lookahead(i).type;
      },
      /**
       * Check if the following sequence of tokens
       * forms a selector.
       *
       * @param {Boolean} [fromProperty]
       * @return {Boolean}
       * @api private
       */
      looksLikeSelector: function(fromProperty) {
        var i = 1, node, brace;
        if (fromProperty && ":" == this.lookahead(i + 1).type && (this.lookahead(i + 1).space || "indent" == this.lookahead(i + 2).type))
          return false;
        while ("ident" == this.lookahead(i).type && ("newline" == this.lookahead(i + 1).type || "," == this.lookahead(i + 1).type))
          i += 2;
        while (this.isSelectorToken(i) || "," == this.lookahead(i).type) {
          if ("selector" == this.lookahead(i).type)
            return true;
          if ("&" == this.lookahead(i + 1).type)
            return true;
          if (i > 1 && "ident" === this.lookahead(i - 1).type && "." === this.lookahead(i).type && "ident" === this.lookahead(i + 1).type) {
            while (node = this.lookahead(i + 2)) {
              if ([
                "indent",
                "outdent",
                "{",
                ";",
                "eos",
                "selector",
                "media",
                "if",
                "atrule",
                ")",
                "}",
                "unit",
                "[",
                "for",
                "function"
              ].indexOf(node.type) !== -1) {
                if (node.type === "[") {
                  while ((node = this.lookahead(i + 3)) && node.type !== "]") {
                    if (~[".", "unit"].indexOf(node.type)) {
                      return false;
                    }
                    i += 1;
                  }
                } else {
                  if (this.isPseudoSelector(i + 2)) {
                    return true;
                  }
                  if (node.type === ")" && this.lookahead(i + 3) && this.lookahead(i + 3).type === "}") {
                    break;
                  }
                  return [
                    "outdent",
                    ";",
                    "eos",
                    "media",
                    "if",
                    "atrule",
                    ")",
                    "}",
                    "unit",
                    "for",
                    "function"
                  ].indexOf(node.type) === -1;
                }
              }
              i += 1;
            }
            return true;
          }
          if ("." == this.lookahead(i).type && "ident" == this.lookahead(i + 1).type) {
            return true;
          }
          if ("*" == this.lookahead(i).type && "newline" == this.lookahead(i + 1).type)
            return true;
          if (":" == this.lookahead(i).type && ":" == this.lookahead(i + 1).type)
            return true;
          if ("color" == this.lookahead(i).type && "newline" == this.lookahead(i - 1).type)
            return true;
          if (this.looksLikeAttributeSelector(i))
            return true;
          if (("=" == this.lookahead(i).type || "function" == this.lookahead(i).type) && "{" == this.lookahead(i + 1).type)
            return false;
          if (":" == this.lookahead(i).type && !this.isPseudoSelector(i + 1) && this.lineContains("."))
            return false;
          if ("{" == this.lookahead(i).type)
            brace = true;
          else if ("}" == this.lookahead(i).type)
            brace = false;
          if (brace && ":" == this.lookahead(i).type)
            return true;
          if ("space" == this.lookahead(i).type && "{" == this.lookahead(i + 1).type)
            return true;
          if (":" == this.lookahead(i++).type && !this.lookahead(i - 1).space && this.isPseudoSelector(i))
            return true;
          if ("space" == this.lookahead(i).type && "newline" == this.lookahead(i + 1).type && "{" == this.lookahead(i + 2).type)
            return true;
          if ("," == this.lookahead(i).type && "newline" == this.lookahead(i + 1).type)
            return true;
        }
        if ("," == this.lookahead(i).type && "newline" == this.lookahead(i + 1).type)
          return true;
        if ("{" == this.lookahead(i).type && "newline" == this.lookahead(i + 1).type)
          return true;
        if (this.css) {
          if (";" == this.lookahead(i).type || "}" == this.lookahead(i - 1).type)
            return false;
        }
        while (!~[
          "indent",
          "outdent",
          "newline",
          "for",
          "if",
          ";",
          "}",
          "eos"
        ].indexOf(this.lookahead(i).type))
          ++i;
        if ("indent" == this.lookahead(i).type)
          return true;
      },
      /**
       * Check if the following sequence of tokens
       * forms an attribute selector.
       */
      looksLikeAttributeSelector: function(n) {
        var type = this.lookahead(n).type;
        if ("=" == type && this.bracketed)
          return true;
        return ("ident" == type || "string" == type) && "]" == this.lookahead(n + 1).type && ("newline" == this.lookahead(n + 2).type || this.isSelectorToken(n + 2)) && !this.lineContains(":") && !this.lineContains("=");
      },
      /**
       * Check if the following sequence of tokens
       * forms a keyframe block.
       */
      looksLikeKeyframe: function() {
        var i = 2, type;
        switch (this.lookahead(i).type) {
          case "{":
          case "indent":
          case ",":
            return true;
          case "newline":
            while ("unit" == this.lookahead(++i).type || "newline" == this.lookahead(i).type)
              ;
            type = this.lookahead(i).type;
            return "indent" == type || "{" == type;
        }
      },
      /**
       * Check if the current state supports selectors.
       */
      stateAllowsSelector: function() {
        switch (this.currentState()) {
          case "root":
          case "atblock":
          case "selector":
          case "conditional":
          case "function":
          case "atrule":
          case "for":
            return true;
        }
      },
      /**
       * Try to assign @block to the node.
       *
       * @param {Expression} expr
       * @private
       */
      assignAtblock: function(expr) {
        try {
          expr.push(this.atblock(expr));
        } catch (err) {
          this.error("invalid right-hand side operand in assignment, got {peek}");
        }
      },
      /**
       *   statement
       * | statement 'if' expression
       * | statement 'unless' expression
       */
      statement: function() {
        var stmt = this.stmt(), state = this.prevState, block, op;
        if (this.allowPostfix) {
          this.allowPostfix = false;
          state = "expression";
        }
        switch (state) {
          case "assignment":
          case "expression":
          case "function arguments":
            while (op = this.accept("if") || this.accept("unless") || this.accept("for")) {
              switch (op.type) {
                case "if":
                case "unless":
                  stmt = new nodes.If(this.expression(), stmt);
                  stmt.postfix = true;
                  stmt.negate = "unless" == op.type;
                  this.accept(";");
                  break;
                case "for":
                  var key, val = this.id().name;
                  if (this.accept(","))
                    key = this.id().name;
                  this.expect("in");
                  var each = new nodes.Each(val, key, this.expression());
                  block = new nodes.Block(this.parent, each);
                  block.push(stmt);
                  each.block = block;
                  stmt = each;
              }
            }
        }
        return stmt;
      },
      /**
       *    ident
       *  | selector
       *  | literal
       *  | charset
       *  | namespace
       *  | import
       *  | require
       *  | media
       *  | atrule
       *  | scope
       *  | keyframes
       *  | mozdocument
       *  | for
       *  | if
       *  | unless
       *  | comment
       *  | expression
       *  | 'return' expression
       */
      stmt: function() {
        var tok = this.peek(), selector;
        switch (tok.type) {
          case "keyframes":
            return this.keyframes();
          case "-moz-document":
            return this.mozdocument();
          case "comment":
          case "selector":
          case "literal":
          case "charset":
          case "namespace":
          case "import":
          case "require":
          case "extend":
          case "media":
          case "atrule":
          case "ident":
          case "scope":
          case "supports":
          case "unless":
          case "function":
          case "for":
          case "if":
            return this[tok.type]();
          case "return":
            return this.return();
          case "{":
            return this.property();
          default:
            if (this.stateAllowsSelector()) {
              switch (tok.type) {
                case "color":
                case "~":
                case ">":
                case "<":
                case ":":
                case "&":
                case "&&":
                case "[":
                case ".":
                case "/":
                  selector = this.selector();
                  selector.column = tok.column;
                  selector.lineno = tok.lineno;
                  return selector;
                case "..":
                  if ("/" == this.lookahead(2).type)
                    return this.selector();
                case "+":
                  return "function" == this.lookahead(2).type ? this.functionCall() : this.selector();
                case "*":
                  return this.property();
                case "unit":
                  if (this.looksLikeKeyframe()) {
                    selector = this.selector();
                    selector.column = tok.column;
                    selector.lineno = tok.lineno;
                    return selector;
                  }
                case "-":
                  if ("{" == this.lookahead(2).type)
                    return this.property();
              }
            }
            var expr = this.expression();
            if (expr.isEmpty)
              this.error("unexpected {peek}");
            return expr;
        }
      },
      /**
       * indent (!outdent)+ outdent
       */
      block: function(node, scope) {
        var delim, stmt, next, block = this.parent = new nodes.Block(this.parent, node);
        if (false === scope)
          block.scope = false;
        this.accept("newline");
        if (this.accept("{")) {
          this.css++;
          delim = "}";
          this.skipWhitespace();
        } else {
          delim = "outdent";
          this.expect("indent");
        }
        while (delim != this.peek().type) {
          if (this.css) {
            if (this.accept("newline") || this.accept("indent"))
              continue;
            stmt = this.statement();
            this.accept(";");
            this.skipWhitespace();
          } else {
            if (this.accept("newline"))
              continue;
            next = this.lookahead(2).type;
            if ("indent" == this.peek().type && ~["outdent", "newline", "comment"].indexOf(next)) {
              this.skip(["indent", "outdent"]);
              continue;
            }
            if ("eos" == this.peek().type)
              return block;
            stmt = this.statement();
            this.accept(";");
          }
          if (!stmt)
            this.error("unexpected token {peek} in block");
          block.push(stmt);
        }
        if (this.css) {
          this.skipWhitespace();
          this.expect("}");
          this.skipSpaces();
          this.css--;
        } else {
          this.expect("outdent");
        }
        this.parent = block.parent;
        return block;
      },
      /**
       * comment space*
       */
      comment: function() {
        var node = this.next().val;
        this.skipSpaces();
        return node;
      },
      /**
       * for val (',' key) in expr
       */
      for: function() {
        this.expect("for");
        var key, val = this.id().name;
        if (this.accept(","))
          key = this.id().name;
        this.expect("in");
        this.state.push("for");
        this.cond = true;
        var each = new nodes.Each(val, key, this.expression());
        this.cond = false;
        each.block = this.block(each, false);
        this.state.pop();
        return each;
      },
      /**
       * return expression
       */
      return: function() {
        this.expect("return");
        var expr = this.expression();
        return expr.isEmpty ? new nodes.Return() : new nodes.Return(expr);
      },
      /**
       * unless expression block
       */
      unless: function() {
        this.expect("unless");
        this.state.push("conditional");
        this.cond = true;
        var node = new nodes.If(this.expression(), true);
        this.cond = false;
        node.block = this.block(node, false);
        this.state.pop();
        return node;
      },
      /**
       * if expression block (else block)?
       */
      if: function() {
        var token = this.expect("if");
        this.state.push("conditional");
        this.cond = true;
        var node = new nodes.If(this.expression()), cond, block, item;
        node.column = token.column;
        this.cond = false;
        node.block = this.block(node, false);
        this.skip(["newline", "comment"]);
        while (this.accept("else")) {
          token = this.accept("if");
          if (token) {
            this.cond = true;
            cond = this.expression();
            this.cond = false;
            block = this.block(node, false);
            item = new nodes.If(cond, block);
            item.column = token.column;
            node.elses.push(item);
          } else {
            node.elses.push(this.block(node, false));
            break;
          }
          this.skip(["newline", "comment"]);
        }
        this.state.pop();
        return node;
      },
      /**
       * @block
       *
       * @param {Expression} [node]
       */
      atblock: function(node) {
        if (!node)
          this.expect("atblock");
        node = new nodes.Atblock();
        this.state.push("atblock");
        node.block = this.block(node, false);
        this.state.pop();
        return node;
      },
      /**
       * atrule selector? block?
       */
      atrule: function() {
        var type = this.expect("atrule").val, node = new nodes.Atrule(type), tok;
        this.skipSpacesAndComments();
        node.segments = this.selectorParts();
        this.skipSpacesAndComments();
        tok = this.peek().type;
        if ("indent" == tok || "{" == tok || "newline" == tok && "{" == this.lookahead(2).type) {
          this.state.push("atrule");
          node.block = this.block(node);
          this.state.pop();
        }
        return node;
      },
      /**
       * scope
       */
      scope: function() {
        this.expect("scope");
        var selector = this.selectorParts().map(function(selector2) {
          return selector2.val;
        }).join("");
        this.selectorScope = selector.trim();
        return nodes.null;
      },
      /**
       * supports
       */
      supports: function() {
        this.expect("supports");
        var node = new nodes.Supports(this.supportsCondition());
        this.state.push("atrule");
        node.block = this.block(node);
        this.state.pop();
        return node;
      },
      /**
       *   supports negation
       * | supports op
       * | expression
       */
      supportsCondition: function() {
        var node = this.supportsNegation() || this.supportsOp();
        if (!node) {
          this.cond = true;
          node = this.expression();
          this.cond = false;
        }
        return node;
      },
      /**
       * 'not' supports feature
       */
      supportsNegation: function() {
        if (this.accept("not")) {
          var node = new nodes.Expression();
          node.push(new nodes.Literal("not"));
          node.push(this.supportsFeature());
          return node;
        }
      },
      /**
       * supports feature (('and' | 'or') supports feature)+
       */
      supportsOp: function() {
        var feature = this.supportsFeature(), op, expr;
        if (feature) {
          expr = new nodes.Expression();
          expr.push(feature);
          while (op = this.accept("&&") || this.accept("||")) {
            expr.push(new nodes.Literal("&&" == op.val ? "and" : "or"));
            expr.push(this.supportsFeature());
          }
          return expr;
        }
      },
      /**
       *   ('(' supports condition ')')
       * | feature
       */
      supportsFeature: function() {
        this.skipSpacesAndComments();
        if ("(" == this.peek().type) {
          var la = this.lookahead(2).type;
          if ("ident" == la || "{" == la) {
            return this.feature();
          } else {
            this.expect("(");
            var node = new nodes.Expression();
            node.push(new nodes.Literal("("));
            node.push(this.supportsCondition());
            this.expect(")");
            node.push(new nodes.Literal(")"));
            this.skipSpacesAndComments();
            return node;
          }
        }
      },
      /**
       * extend
       */
      extend: function() {
        var tok = this.expect("extend"), selectors = [], sel, node, arr;
        do {
          arr = this.selectorParts();
          if (!arr.length)
            continue;
          sel = new nodes.Selector(arr);
          selectors.push(sel);
          if ("!" !== this.peek().type)
            continue;
          tok = this.lookahead(2);
          if ("ident" !== tok.type || "optional" !== tok.val.name)
            continue;
          this.skip(["!", "ident"]);
          sel.optional = true;
        } while (this.accept(","));
        node = new nodes.Extend(selectors);
        node.lineno = tok.lineno;
        node.column = tok.column;
        return node;
      },
      /**
       * media queries
       */
      media: function() {
        this.expect("media");
        this.state.push("atrule");
        var media = new nodes.Media(this.queries());
        media.block = this.block(media);
        this.state.pop();
        return media;
      },
      /**
       * query (',' query)*
       */
      queries: function() {
        var queries = new nodes.QueryList(), skip = ["comment", "newline", "space"];
        do {
          this.skip(skip);
          queries.push(this.query());
          this.skip(skip);
        } while (this.accept(","));
        return queries;
      },
      /**
       *   expression
       * | (ident | 'not')? ident ('and' feature)*
       * | feature ('and' feature)*
       */
      query: function() {
        var query = new nodes.Query(), expr, pred, id;
        if ("ident" == this.peek().type && ("." == this.lookahead(2).type || "[" == this.lookahead(2).type)) {
          this.cond = true;
          expr = this.expression();
          this.cond = false;
          query.push(new nodes.Feature(expr.nodes));
          return query;
        }
        if (pred = this.accept("ident") || this.accept("not")) {
          pred = new nodes.Literal(pred.val.string || pred.val);
          this.skipSpacesAndComments();
          if (id = this.accept("ident")) {
            query.type = id.val;
            query.predicate = pred;
          } else {
            query.type = pred;
          }
          this.skipSpacesAndComments();
          if (!this.accept("&&"))
            return query;
        }
        do {
          query.push(this.feature());
        } while (this.accept("&&"));
        return query;
      },
      /**
       * '(' ident ( ':'? expression )? ')'
       */
      feature: function() {
        this.skipSpacesAndComments();
        this.expect("(");
        this.skipSpacesAndComments();
        var node = new nodes.Feature(this.interpolate());
        this.skipSpacesAndComments();
        this.accept(":");
        this.skipSpacesAndComments();
        this.inProperty = true;
        node.expr = this.list();
        this.inProperty = false;
        this.skipSpacesAndComments();
        this.expect(")");
        this.skipSpacesAndComments();
        return node;
      },
      /**
       * @-moz-document call (',' call)* block
       */
      mozdocument: function() {
        this.expect("-moz-document");
        var mozdocument = new nodes.Atrule("-moz-document"), calls = [];
        do {
          this.skipSpacesAndComments();
          calls.push(this.functionCall());
          this.skipSpacesAndComments();
        } while (this.accept(","));
        mozdocument.segments = [new nodes.Literal(calls.join(", "))];
        this.state.push("atrule");
        mozdocument.block = this.block(mozdocument, false);
        this.state.pop();
        return mozdocument;
      },
      /**
       * import expression
       */
      import: function() {
        this.expect("import");
        this.allowPostfix = true;
        return new nodes.Import(this.expression(), false);
      },
      /**
       * require expression
       */
      require: function() {
        this.expect("require");
        this.allowPostfix = true;
        return new nodes.Import(this.expression(), true);
      },
      /**
       * charset string
       */
      charset: function() {
        this.expect("charset");
        var str = this.expect("string").val;
        this.allowPostfix = true;
        return new nodes.Charset(str);
      },
      /**
       * namespace ident? (string | url)
       */
      namespace: function() {
        var str, prefix;
        this.expect("namespace");
        this.skipSpacesAndComments();
        if (prefix = this.accept("ident")) {
          prefix = prefix.val;
        }
        this.skipSpacesAndComments();
        str = this.accept("string") || this.url();
        this.allowPostfix = true;
        return new nodes.Namespace(str, prefix);
      },
      /**
       * keyframes name block
       */
      keyframes: function() {
        var tok = this.expect("keyframes"), keyframes;
        this.skipSpacesAndComments();
        keyframes = new nodes.Keyframes(this.selectorParts(), tok.val);
        keyframes.column = tok.column;
        this.skipSpacesAndComments();
        this.state.push("atrule");
        keyframes.block = this.block(keyframes);
        this.state.pop();
        return keyframes;
      },
      /**
       * literal
       */
      literal: function() {
        return this.expect("literal").val;
      },
      /**
       * ident space?
       */
      id: function() {
        var tok = this.expect("ident");
        this.accept("space");
        return tok.val;
      },
      /**
       *   ident
       * | assignment
       * | property
       * | selector
       */
      ident: function() {
        var i = 2, la = this.lookahead(i).type;
        while ("space" == la)
          la = this.lookahead(++i).type;
        switch (la) {
          case "=":
          case "?=":
          case "-=":
          case "+=":
          case "*=":
          case "/=":
          case "%=":
            return this.assignment();
          case ".":
            if ("space" == this.lookahead(i - 1).type)
              return this.selector();
            if (this._ident == this.peek())
              return this.id();
            while ("=" != this.lookahead(++i).type && !~["[", ",", "newline", "indent", "eos"].indexOf(this.lookahead(i).type))
              ;
            if ("=" == this.lookahead(i).type) {
              this._ident = this.peek();
              return this.expression();
            } else if (this.looksLikeSelector() && this.stateAllowsSelector()) {
              return this.selector();
            }
          case "[":
            if (this._ident == this.peek())
              return this.id();
            while ("]" != this.lookahead(i++).type && "selector" != this.lookahead(i).type && "eos" != this.lookahead(i).type)
              ;
            if ("=" == this.lookahead(i).type) {
              this._ident = this.peek();
              return this.expression();
            } else if (this.looksLikeSelector() && this.stateAllowsSelector()) {
              return this.selector();
            }
          case "-":
          case "+":
          case "/":
          case "*":
          case "%":
          case "**":
          case "&&":
          case "||":
          case ">":
          case "<":
          case ">=":
          case "<=":
          case "!=":
          case "==":
          case "?":
          case "in":
          case "is a":
          case "is defined":
            if (this._ident == this.peek()) {
              return this.id();
            } else {
              this._ident = this.peek();
              switch (this.currentState()) {
                case "for":
                case "selector":
                  return this.property();
                case "root":
                case "atblock":
                case "atrule":
                  return "[" == la ? this.subscript() : this.selector();
                case "function":
                case "conditional":
                  return this.looksLikeSelector() ? this.selector() : this.expression();
                default:
                  return this.operand ? this.id() : this.expression();
              }
            }
          default:
            switch (this.currentState()) {
              case "root":
                return this.selector();
              case "for":
              case "selector":
              case "function":
              case "conditional":
              case "atblock":
              case "atrule":
                return this.property();
              default:
                var id = this.id();
                if ("interpolation" == this.previousState())
                  id.mixin = true;
                return id;
            }
        }
      },
      /**
       * '*'? (ident | '{' expression '}')+
       */
      interpolate: function() {
        var node, segs = [], star;
        star = this.accept("*");
        if (star)
          segs.push(new nodes.Literal("*"));
        while (true) {
          if (this.accept("{")) {
            this.state.push("interpolation");
            segs.push(this.expression());
            this.expect("}");
            this.state.pop();
          } else if (node = this.accept("-")) {
            segs.push(new nodes.Literal("-"));
          } else if (node = this.accept("ident")) {
            segs.push(node.val);
          } else {
            break;
          }
        }
        if (!segs.length)
          this.expect("ident");
        return segs;
      },
      /**
       *   property ':'? expression
       * | ident
       */
      property: function() {
        if (this.looksLikeSelector(true))
          return this.selector();
        var ident = this.interpolate(), prop = new nodes.Property(ident), ret = prop;
        this.accept("space");
        if (this.accept(":"))
          this.accept("space");
        this.state.push("property");
        this.inProperty = true;
        prop.expr = this.list();
        if (prop.expr.isEmpty)
          ret = ident[0];
        this.inProperty = false;
        this.allowPostfix = true;
        this.state.pop();
        this.accept(";");
        return ret;
      },
      /**
       *   selector ',' selector
       * | selector newline selector
       * | selector block
       */
      selector: function() {
        var arr, group = new nodes.Group(), scope = this.selectorScope, isRoot = "root" == this.currentState(), selector;
        do {
          this.accept("newline");
          arr = this.selectorParts();
          if (isRoot && scope)
            arr.unshift(new nodes.Literal(scope + " "));
          if (arr.length) {
            selector = new nodes.Selector(arr);
            selector.lineno = arr[0].lineno;
            selector.column = arr[0].column;
            group.push(selector);
          }
        } while (this.accept(",") || this.accept("newline"));
        if ("selector-parts" == this.currentState())
          return group.nodes;
        this.state.push("selector");
        group.block = this.block(group);
        this.state.pop();
        return group;
      },
      selectorParts: function() {
        var tok, arr = [];
        while (tok = this.selectorToken()) {
          debug.selector("%s", tok);
          switch (tok.type) {
            case "{":
              this.skipSpaces();
              var expr = this.expression();
              this.skipSpaces();
              this.expect("}");
              arr.push(expr);
              break;
            case (this.prefix && "."):
              var literal = new nodes.Literal(tok.val + this.prefix);
              literal.prefixed = true;
              arr.push(literal);
              break;
            case "comment":
              break;
            case "color":
            case "unit":
              arr.push(new nodes.Literal(tok.val.raw));
              break;
            case "space":
              arr.push(new nodes.Literal(" "));
              break;
            case "function":
              arr.push(new nodes.Literal(tok.val.name + "("));
              break;
            case "ident":
              arr.push(new nodes.Literal(tok.val.name || tok.val.string));
              break;
            default:
              arr.push(new nodes.Literal(tok.val));
              if (tok.space)
                arr.push(new nodes.Literal(" "));
          }
        }
        return arr;
      },
      /**
       * ident ('=' | '?=') expression
       */
      assignment: function() {
        var op, node, ident = this.id(), name = ident.name;
        if (op = this.accept("=") || this.accept("?=") || this.accept("+=") || this.accept("-=") || this.accept("*=") || this.accept("/=") || this.accept("%=")) {
          this.state.push("assignment");
          var expr = this.list();
          if (expr.isEmpty)
            this.assignAtblock(expr);
          node = new nodes.Ident(name, expr);
          node.lineno = ident.lineno;
          node.column = ident.column;
          this.state.pop();
          switch (op.type) {
            case "?=":
              var defined = new nodes.BinOp("is defined", node), lookup = new nodes.Expression();
              lookup.push(new nodes.Ident(name));
              node = new nodes.Ternary(defined, lookup, node);
              break;
            case "+=":
            case "-=":
            case "*=":
            case "/=":
            case "%=":
              node.val = new nodes.BinOp(op.type[0], new nodes.Ident(name), expr);
              break;
          }
        }
        return node;
      },
      /**
       *   definition
       * | call
       */
      function: function() {
        var parens = 1, i = 2, tok;
        out:
          while (tok = this.lookahead(i++)) {
            switch (tok.type) {
              case "function":
              case "(":
                ++parens;
                break;
              case ")":
                if (!--parens)
                  break out;
                break;
              case "eos":
                this.error('failed to find closing paren ")"');
            }
          }
        switch (this.currentState()) {
          case "expression":
            return this.functionCall();
          default:
            return this.looksLikeFunctionDefinition(i) ? this.functionDefinition() : this.expression();
        }
      },
      /**
       * url '(' (expression | urlchars)+ ')'
       */
      url: function() {
        this.expect("function");
        this.state.push("function arguments");
        var args = this.args();
        this.expect(")");
        this.state.pop();
        return new nodes.Call("url", args);
      },
      /**
       * '+'? ident '(' expression ')' block?
       */
      functionCall: function() {
        var withBlock = this.accept("+");
        if ("url" == this.peek().val.name)
          return this.url();
        var tok = this.expect("function").val;
        var name = tok.name;
        this.state.push("function arguments");
        this.parens++;
        var args = this.args();
        this.expect(")");
        this.parens--;
        this.state.pop();
        var call = new nodes.Call(name, args);
        call.column = tok.column;
        call.lineno = tok.lineno;
        if (withBlock) {
          this.state.push("function");
          call.block = this.block(call);
          this.state.pop();
        }
        return call;
      },
      /**
       * ident '(' params ')' block
       */
      functionDefinition: function() {
        var tok = this.expect("function"), name = tok.val.name;
        this.state.push("function params");
        this.skipWhitespace();
        var params = this.params();
        this.skipWhitespace();
        this.expect(")");
        this.state.pop();
        this.state.push("function");
        var fn = new nodes.Function(name, params);
        fn.column = tok.column;
        fn.lineno = tok.lineno;
        fn.block = this.block(fn);
        this.state.pop();
        return new nodes.Ident(name, fn);
      },
      /**
       *   ident
       * | ident '...'
       * | ident '=' expression
       * | ident ',' ident
       */
      params: function() {
        var tok, node, params = new nodes.Params();
        while (tok = this.accept("ident")) {
          this.accept("space");
          params.push(node = tok.val);
          if (this.accept("...")) {
            node.rest = true;
          } else if (this.accept("=")) {
            node.val = this.expression();
          }
          this.skipWhitespace();
          this.accept(",");
          this.skipWhitespace();
        }
        return params;
      },
      /**
       * (ident ':')? expression (',' (ident ':')? expression)*
       */
      args: function() {
        var args = new nodes.Arguments(), keyword;
        do {
          if ("ident" == this.peek().type && ":" == this.lookahead(2).type) {
            keyword = this.next().val.string;
            this.expect(":");
            args.map[keyword] = this.expression();
          } else {
            args.push(this.expression());
          }
        } while (this.accept(","));
        return args;
      },
      /**
       * expression (',' expression)*
       */
      list: function() {
        var node = this.expression();
        while (this.accept(",")) {
          if (node.isList) {
            list.push(this.expression());
          } else {
            var list = new nodes.Expression(true);
            list.push(node);
            list.push(this.expression());
            node = list;
          }
        }
        return node;
      },
      /**
       * negation+
       */
      expression: function() {
        var node, expr = new nodes.Expression();
        this.state.push("expression");
        while (node = this.negation()) {
          if (!node)
            this.error("unexpected token {peek} in expression");
          expr.push(node);
        }
        this.state.pop();
        if (expr.nodes.length) {
          expr.lineno = expr.nodes[0].lineno;
          expr.column = expr.nodes[0].column;
        }
        return expr;
      },
      /**
       *   'not' ternary
       * | ternary
       */
      negation: function() {
        if (this.accept("not")) {
          return new nodes.UnaryOp("!", this.negation());
        }
        return this.ternary();
      },
      /**
       * logical ('?' expression ':' expression)?
       */
      ternary: function() {
        var node = this.logical();
        if (this.accept("?")) {
          var trueExpr = this.expression();
          this.expect(":");
          var falseExpr = this.expression();
          node = new nodes.Ternary(node, trueExpr, falseExpr);
        }
        return node;
      },
      /**
       * typecheck (('&&' | '||') typecheck)*
       */
      logical: function() {
        var op, node = this.typecheck();
        while (op = this.accept("&&") || this.accept("||")) {
          node = new nodes.BinOp(op.type, node, this.typecheck());
        }
        return node;
      },
      /**
       * equality ('is a' equality)*
       */
      typecheck: function() {
        var op, node = this.equality();
        while (op = this.accept("is a")) {
          this.operand = true;
          if (!node)
            this.error('illegal unary "' + op + '", missing left-hand operand');
          node = new nodes.BinOp(op.type, node, this.equality());
          this.operand = false;
        }
        return node;
      },
      /**
       * in (('==' | '!=') in)*
       */
      equality: function() {
        var op, node = this.in();
        while (op = this.accept("==") || this.accept("!=")) {
          this.operand = true;
          if (!node)
            this.error('illegal unary "' + op + '", missing left-hand operand');
          node = new nodes.BinOp(op.type, node, this.in());
          this.operand = false;
        }
        return node;
      },
      /**
       * relational ('in' relational)*
       */
      in: function() {
        var node = this.relational();
        while (this.accept("in")) {
          this.operand = true;
          if (!node)
            this.error('illegal unary "in", missing left-hand operand');
          node = new nodes.BinOp("in", node, this.relational());
          this.operand = false;
        }
        return node;
      },
      /**
       * range (('>=' | '<=' | '>' | '<') range)*
       */
      relational: function() {
        var op, node = this.range();
        while (op = this.accept(">=") || this.accept("<=") || this.accept("<") || this.accept(">")) {
          this.operand = true;
          if (!node)
            this.error('illegal unary "' + op + '", missing left-hand operand');
          node = new nodes.BinOp(op.type, node, this.range());
          this.operand = false;
        }
        return node;
      },
      /**
       * additive (('..' | '...') additive)*
       */
      range: function() {
        var op, node = this.additive();
        if (op = this.accept("...") || this.accept("..")) {
          this.operand = true;
          if (!node)
            this.error('illegal unary "' + op + '", missing left-hand operand');
          node = new nodes.BinOp(op.val, node, this.additive());
          this.operand = false;
        }
        return node;
      },
      /**
       * multiplicative (('+' | '-') multiplicative)*
       */
      additive: function() {
        var op, node = this.multiplicative();
        while (op = this.accept("+") || this.accept("-")) {
          this.operand = true;
          node = new nodes.BinOp(op.type, node, this.multiplicative());
          this.operand = false;
        }
        return node;
      },
      /**
       * defined (('**' | '*' | '/' | '%') defined)*
       */
      multiplicative: function() {
        var op, node = this.defined();
        while (op = this.accept("**") || this.accept("*") || this.accept("/") || this.accept("%")) {
          this.operand = true;
          if ("/" == op && this.inProperty && !this.parens) {
            this.stash.push(new Token("literal", new nodes.Literal("/")));
            this.operand = false;
            return node;
          } else {
            if (!node)
              this.error('illegal unary "' + op + '", missing left-hand operand');
            node = new nodes.BinOp(op.type, node, this.defined());
            this.operand = false;
          }
        }
        return node;
      },
      /**
       *    unary 'is defined'
       *  | unary
       */
      defined: function() {
        var node = this.unary();
        if (this.accept("is defined")) {
          if (!node)
            this.error('illegal unary "is defined", missing left-hand operand');
          node = new nodes.BinOp("is defined", node);
        }
        return node;
      },
      /**
       *   ('!' | '~' | '+' | '-') unary
       * | subscript
       */
      unary: function() {
        var op, node;
        if (op = this.accept("!") || this.accept("~") || this.accept("+") || this.accept("-")) {
          this.operand = true;
          node = this.unary();
          if (!node)
            this.error('illegal unary "' + op + '"');
          node = new nodes.UnaryOp(op.type, node);
          this.operand = false;
          return node;
        }
        return this.subscript();
      },
      /**
       *   member ('[' expression ']')+ '='?
       * | member
       */
      subscript: function() {
        var node = this.member(), id;
        while (this.accept("[")) {
          node = new nodes.BinOp("[]", node, this.expression());
          this.expect("]");
        }
        if (this.accept("=")) {
          node.op += "=";
          node.val = this.list();
          if (node.val.isEmpty)
            this.assignAtblock(node.val);
        }
        return node;
      },
      /**
       *   primary ('.' id)+ '='?
       * | primary
       */
      member: function() {
        var node = this.primary();
        if (node) {
          while (this.accept(".")) {
            var id = new nodes.Ident(this.expect("ident").val.string);
            node = new nodes.Member(node, id);
          }
          this.skipSpaces();
          if (this.accept("=")) {
            node.val = this.list();
            if (node.val.isEmpty)
              this.assignAtblock(node.val);
          }
        }
        return node;
      },
      /**
       *   '{' '}'
       * | '{' pair (ws pair)* '}'
       */
      object: function() {
        var obj = new nodes.Object(), id, val, comma, hash;
        this.expect("{");
        this.skipWhitespace();
        while (!this.accept("}")) {
          if (this.accept("comment") || this.accept("newline"))
            continue;
          if (!comma)
            this.accept(",");
          id = this.accept("ident") || this.accept("string");
          if (!id) {
            this.error('expected "ident" or "string", got {peek}');
          }
          hash = id.val.hash;
          this.skipSpacesAndComments();
          this.expect(":");
          val = this.expression();
          obj.setValue(hash, val);
          obj.setKey(hash, id.val);
          comma = this.accept(",");
          this.skipWhitespace();
        }
        return obj;
      },
      /**
       *   unit
       * | null
       * | color
       * | string
       * | ident
       * | boolean
       * | literal
       * | object
       * | atblock
       * | atrule
       * | '(' expression ')' '%'?
       */
      primary: function() {
        var tok;
        this.skipSpaces();
        if (this.accept("(")) {
          ++this.parens;
          var expr = this.expression(), paren = this.expect(")");
          --this.parens;
          if (this.accept("%"))
            expr.push(new nodes.Ident("%"));
          tok = this.peek();
          if (!paren.space && "ident" == tok.type && ~units.indexOf(tok.val.string)) {
            expr.push(new nodes.Ident(tok.val.string));
            this.next();
          }
          return expr;
        }
        tok = this.peek();
        switch (tok.type) {
          case "null":
          case "unit":
          case "color":
          case "string":
          case "literal":
          case "boolean":
          case "comment":
            return this.next().val;
          case (!this.cond && "{"):
            return this.object();
          case "atblock":
            return this.atblock();
          case "atrule":
            var id = new nodes.Ident(this.next().val);
            id.property = true;
            return id;
          case "ident":
            return this.ident();
          case "function":
            return tok.anonymous ? this.functionDefinition() : this.functionCall();
        }
      }
    };
  }
});

// node_modules/source-map/lib/base64.js
var require_base64 = __commonJS({
  "node_modules/source-map/lib/base64.js"(exports) {
    var intToCharMap = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
    exports.encode = function(number) {
      if (0 <= number && number < intToCharMap.length) {
        return intToCharMap[number];
      }
      throw new TypeError("Must be between 0 and 63: " + number);
    };
  }
});

// node_modules/source-map/lib/base64-vlq.js
var require_base64_vlq = __commonJS({
  "node_modules/source-map/lib/base64-vlq.js"(exports) {
    var base64 = require_base64();
    var VLQ_BASE_SHIFT = 5;
    var VLQ_BASE = 1 << VLQ_BASE_SHIFT;
    var VLQ_BASE_MASK = VLQ_BASE - 1;
    var VLQ_CONTINUATION_BIT = VLQ_BASE;
    function toVLQSigned(aValue) {
      return aValue < 0 ? (-aValue << 1) + 1 : (aValue << 1) + 0;
    }
    exports.encode = function base64VLQ_encode(aValue) {
      let encoded = "";
      let digit;
      let vlq = toVLQSigned(aValue);
      do {
        digit = vlq & VLQ_BASE_MASK;
        vlq >>>= VLQ_BASE_SHIFT;
        if (vlq > 0) {
          digit |= VLQ_CONTINUATION_BIT;
        }
        encoded += base64.encode(digit);
      } while (vlq > 0);
      return encoded;
    };
  }
});

// node_modules/source-map/lib/util.js
var require_util = __commonJS({
  "node_modules/source-map/lib/util.js"(exports) {
    function getArg(aArgs, aName, aDefaultValue) {
      if (aName in aArgs) {
        return aArgs[aName];
      } else if (arguments.length === 3) {
        return aDefaultValue;
      }
      throw new Error('"' + aName + '" is a required argument.');
    }
    exports.getArg = getArg;
    var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/;
    var dataUrlRegexp = /^data:.+\,.+$/;
    function urlParse(aUrl) {
      const match = aUrl.match(urlRegexp);
      if (!match) {
        return null;
      }
      return {
        scheme: match[1],
        auth: match[2],
        host: match[3],
        port: match[4],
        path: match[5]
      };
    }
    exports.urlParse = urlParse;
    function urlGenerate(aParsedUrl) {
      let url = "";
      if (aParsedUrl.scheme) {
        url += aParsedUrl.scheme + ":";
      }
      url += "//";
      if (aParsedUrl.auth) {
        url += aParsedUrl.auth + "@";
      }
      if (aParsedUrl.host) {
        url += aParsedUrl.host;
      }
      if (aParsedUrl.port) {
        url += ":" + aParsedUrl.port;
      }
      if (aParsedUrl.path) {
        url += aParsedUrl.path;
      }
      return url;
    }
    exports.urlGenerate = urlGenerate;
    var MAX_CACHED_INPUTS = 32;
    function lruMemoize(f) {
      const cache = [];
      return function(input) {
        for (let i = 0; i < cache.length; i++) {
          if (cache[i].input === input) {
            const temp = cache[0];
            cache[0] = cache[i];
            cache[i] = temp;
            return cache[0].result;
          }
        }
        const result = f(input);
        cache.unshift({
          input,
          result
        });
        if (cache.length > MAX_CACHED_INPUTS) {
          cache.pop();
        }
        return result;
      };
    }
    var normalize = lruMemoize(function normalize2(aPath) {
      let path = aPath;
      const url = urlParse(aPath);
      if (url) {
        if (!url.path) {
          return aPath;
        }
        path = url.path;
      }
      const isAbsolute = exports.isAbsolute(path);
      const parts = [];
      let start = 0;
      let i = 0;
      while (true) {
        start = i;
        i = path.indexOf("/", start);
        if (i === -1) {
          parts.push(path.slice(start));
          break;
        } else {
          parts.push(path.slice(start, i));
          while (i < path.length && path[i] === "/") {
            i++;
          }
        }
      }
      let up = 0;
      for (i = parts.length - 1; i >= 0; i--) {
        const part = parts[i];
        if (part === ".") {
          parts.splice(i, 1);
        } else if (part === "..") {
          up++;
        } else if (up > 0) {
          if (part === "") {
            parts.splice(i + 1, up);
            up = 0;
          } else {
            parts.splice(i, 2);
            up--;
          }
        }
      }
      path = parts.join("/");
      if (path === "") {
        path = isAbsolute ? "/" : ".";
      }
      if (url) {
        url.path = path;
        return urlGenerate(url);
      }
      return path;
    });
    exports.normalize = normalize;
    function join(aRoot, aPath) {
      if (aRoot === "") {
        aRoot = ".";
      }
      if (aPath === "") {
        aPath = ".";
      }
      const aPathUrl = urlParse(aPath);
      const aRootUrl = urlParse(aRoot);
      if (aRootUrl) {
        aRoot = aRootUrl.path || "/";
      }
      if (aPathUrl && !aPathUrl.scheme) {
        if (aRootUrl) {
          aPathUrl.scheme = aRootUrl.scheme;
        }
        return urlGenerate(aPathUrl);
      }
      if (aPathUrl || aPath.match(dataUrlRegexp)) {
        return aPath;
      }
      if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
        aRootUrl.host = aPath;
        return urlGenerate(aRootUrl);
      }
      const joined = aPath.charAt(0) === "/" ? aPath : normalize(aRoot.replace(/\/+$/, "") + "/" + aPath);
      if (aRootUrl) {
        aRootUrl.path = joined;
        return urlGenerate(aRootUrl);
      }
      return joined;
    }
    exports.join = join;
    exports.isAbsolute = function(aPath) {
      return aPath.charAt(0) === "/" || urlRegexp.test(aPath);
    };
    function relative(aRoot, aPath) {
      if (aRoot === "") {
        aRoot = ".";
      }
      aRoot = aRoot.replace(/\/$/, "");
      let level = 0;
      while (aPath.indexOf(aRoot + "/") !== 0) {
        const index = aRoot.lastIndexOf("/");
        if (index < 0) {
          return aPath;
        }
        aRoot = aRoot.slice(0, index);
        if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
          return aPath;
        }
        ++level;
      }
      return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
    }
    exports.relative = relative;
    var supportsNullProto = function() {
      const obj = /* @__PURE__ */ Object.create(null);
      return !("__proto__" in obj);
    }();
    function identity(s) {
      return s;
    }
    function toSetString(aStr) {
      if (isProtoString(aStr)) {
        return "$" + aStr;
      }
      return aStr;
    }
    exports.toSetString = supportsNullProto ? identity : toSetString;
    function fromSetString(aStr) {
      if (isProtoString(aStr)) {
        return aStr.slice(1);
      }
      return aStr;
    }
    exports.fromSetString = supportsNullProto ? identity : fromSetString;
    function isProtoString(s) {
      if (!s) {
        return false;
      }
      const length = s.length;
      if (length < 9) {
        return false;
      }
      if (s.charCodeAt(length - 1) !== 95 || s.charCodeAt(length - 2) !== 95 || s.charCodeAt(length - 3) !== 111 || s.charCodeAt(length - 4) !== 116 || s.charCodeAt(length - 5) !== 111 || s.charCodeAt(length - 6) !== 114 || s.charCodeAt(length - 7) !== 112 || s.charCodeAt(length - 8) !== 95 || s.charCodeAt(length - 9) !== 95) {
        return false;
      }
      for (let i = length - 10; i >= 0; i--) {
        if (s.charCodeAt(i) !== 36) {
          return false;
        }
      }
      return true;
    }
    function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
      let cmp = strcmp(mappingA.source, mappingB.source);
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalLine - mappingB.originalLine;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalColumn - mappingB.originalColumn;
      if (cmp !== 0 || onlyCompareOriginal) {
        return cmp;
      }
      cmp = mappingA.generatedColumn - mappingB.generatedColumn;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.generatedLine - mappingB.generatedLine;
      if (cmp !== 0) {
        return cmp;
      }
      return strcmp(mappingA.name, mappingB.name);
    }
    exports.compareByOriginalPositions = compareByOriginalPositions;
    function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
      let cmp = mappingA.generatedLine - mappingB.generatedLine;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.generatedColumn - mappingB.generatedColumn;
      if (cmp !== 0 || onlyCompareGenerated) {
        return cmp;
      }
      cmp = strcmp(mappingA.source, mappingB.source);
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalLine - mappingB.originalLine;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalColumn - mappingB.originalColumn;
      if (cmp !== 0) {
        return cmp;
      }
      return strcmp(mappingA.name, mappingB.name);
    }
    exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;
    function strcmp(aStr1, aStr2) {
      if (aStr1 === aStr2) {
        return 0;
      }
      if (aStr1 === null) {
        return 1;
      }
      if (aStr2 === null) {
        return -1;
      }
      if (aStr1 > aStr2) {
        return 1;
      }
      return -1;
    }
    function compareByGeneratedPositionsInflated(mappingA, mappingB) {
      let cmp = mappingA.generatedLine - mappingB.generatedLine;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.generatedColumn - mappingB.generatedColumn;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = strcmp(mappingA.source, mappingB.source);
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalLine - mappingB.originalLine;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalColumn - mappingB.originalColumn;
      if (cmp !== 0) {
        return cmp;
      }
      return strcmp(mappingA.name, mappingB.name);
    }
    exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;
    function parseSourceMapInput(str) {
      return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ""));
    }
    exports.parseSourceMapInput = parseSourceMapInput;
    function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
      sourceURL = sourceURL || "";
      if (sourceRoot) {
        if (sourceRoot[sourceRoot.length - 1] !== "/" && sourceURL[0] !== "/") {
          sourceRoot += "/";
        }
        sourceURL = sourceRoot + sourceURL;
      }
      if (sourceMapURL) {
        const parsed = urlParse(sourceMapURL);
        if (!parsed) {
          throw new Error("sourceMapURL could not be parsed");
        }
        if (parsed.path) {
          const index = parsed.path.lastIndexOf("/");
          if (index >= 0) {
            parsed.path = parsed.path.substring(0, index + 1);
          }
        }
        sourceURL = join(urlGenerate(parsed), sourceURL);
      }
      return normalize(sourceURL);
    }
    exports.computeSourceURL = computeSourceURL;
  }
});

// node_modules/source-map/lib/array-set.js
var require_array_set = __commonJS({
  "node_modules/source-map/lib/array-set.js"(exports) {
    var ArraySet = class {
      constructor() {
        this._array = [];
        this._set = /* @__PURE__ */ new Map();
      }
      /**
       * Static method for creating ArraySet instances from an existing array.
       */
      static fromArray(aArray, aAllowDuplicates) {
        const set = new ArraySet();
        for (let i = 0, len = aArray.length; i < len; i++) {
          set.add(aArray[i], aAllowDuplicates);
        }
        return set;
      }
      /**
       * Return how many unique items are in this ArraySet. If duplicates have been
       * added, than those do not count towards the size.
       *
       * @returns Number
       */
      size() {
        return this._set.size;
      }
      /**
       * Add the given string to this set.
       *
       * @param String aStr
       */
      add(aStr, aAllowDuplicates) {
        const isDuplicate = this.has(aStr);
        const idx = this._array.length;
        if (!isDuplicate || aAllowDuplicates) {
          this._array.push(aStr);
        }
        if (!isDuplicate) {
          this._set.set(aStr, idx);
        }
      }
      /**
       * Is the given string a member of this set?
       *
       * @param String aStr
       */
      has(aStr) {
        return this._set.has(aStr);
      }
      /**
       * What is the index of the given string in the array?
       *
       * @param String aStr
       */
      indexOf(aStr) {
        const idx = this._set.get(aStr);
        if (idx >= 0) {
          return idx;
        }
        throw new Error('"' + aStr + '" is not in the set.');
      }
      /**
       * What is the element at the given index?
       *
       * @param Number aIdx
       */
      at(aIdx) {
        if (aIdx >= 0 && aIdx < this._array.length) {
          return this._array[aIdx];
        }
        throw new Error("No element indexed by " + aIdx);
      }
      /**
       * Returns the array representation of this set (which has the proper indices
       * indicated by indexOf). Note that this is a copy of the internal array used
       * for storing the members so that no one can mess with internal state.
       */
      toArray() {
        return this._array.slice();
      }
    };
    exports.ArraySet = ArraySet;
  }
});

// node_modules/source-map/lib/mapping-list.js
var require_mapping_list = __commonJS({
  "node_modules/source-map/lib/mapping-list.js"(exports) {
    var util = require_util();
    function generatedPositionAfter(mappingA, mappingB) {
      const lineA = mappingA.generatedLine;
      const lineB = mappingB.generatedLine;
      const columnA = mappingA.generatedColumn;
      const columnB = mappingB.generatedColumn;
      return lineB > lineA || lineB == lineA && columnB >= columnA || util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
    }
    var MappingList = class {
      constructor() {
        this._array = [];
        this._sorted = true;
        this._last = { generatedLine: -1, generatedColumn: 0 };
      }
      /**
       * Iterate through internal items. This method takes the same arguments that
       * `Array.prototype.forEach` takes.
       *
       * NOTE: The order of the mappings is NOT guaranteed.
       */
      unsortedForEach(aCallback, aThisArg) {
        this._array.forEach(aCallback, aThisArg);
      }
      /**
       * Add the given source mapping.
       *
       * @param Object aMapping
       */
      add(aMapping) {
        if (generatedPositionAfter(this._last, aMapping)) {
          this._last = aMapping;
          this._array.push(aMapping);
        } else {
          this._sorted = false;
          this._array.push(aMapping);
        }
      }
      /**
       * Returns the flat, sorted array of mappings. The mappings are sorted by
       * generated position.
       *
       * WARNING: This method returns internal data without copying, for
       * performance. The return value must NOT be mutated, and should be treated as
       * an immutable borrow. If you want to take ownership, you must make your own
       * copy.
       */
      toArray() {
        if (!this._sorted) {
          this._array.sort(util.compareByGeneratedPositionsInflated);
          this._sorted = true;
        }
        return this._array;
      }
    };
    exports.MappingList = MappingList;
  }
});

// node_modules/source-map/lib/source-map-generator.js
var require_source_map_generator = __commonJS({
  "node_modules/source-map/lib/source-map-generator.js"(exports) {
    var base64VLQ = require_base64_vlq();
    var util = require_util();
    var ArraySet = require_array_set().ArraySet;
    var MappingList = require_mapping_list().MappingList;
    var SourceMapGenerator = class {
      constructor(aArgs) {
        if (!aArgs) {
          aArgs = {};
        }
        this._file = util.getArg(aArgs, "file", null);
        this._sourceRoot = util.getArg(aArgs, "sourceRoot", null);
        this._skipValidation = util.getArg(aArgs, "skipValidation", false);
        this._sources = new ArraySet();
        this._names = new ArraySet();
        this._mappings = new MappingList();
        this._sourcesContents = null;
      }
      /**
       * Creates a new SourceMapGenerator based on a SourceMapConsumer
       *
       * @param aSourceMapConsumer The SourceMap.
       */
      static fromSourceMap(aSourceMapConsumer) {
        const sourceRoot = aSourceMapConsumer.sourceRoot;
        const generator = new SourceMapGenerator({
          file: aSourceMapConsumer.file,
          sourceRoot
        });
        aSourceMapConsumer.eachMapping(function(mapping) {
          const newMapping = {
            generated: {
              line: mapping.generatedLine,
              column: mapping.generatedColumn
            }
          };
          if (mapping.source != null) {
            newMapping.source = mapping.source;
            if (sourceRoot != null) {
              newMapping.source = util.relative(sourceRoot, newMapping.source);
            }
            newMapping.original = {
              line: mapping.originalLine,
              column: mapping.originalColumn
            };
            if (mapping.name != null) {
              newMapping.name = mapping.name;
            }
          }
          generator.addMapping(newMapping);
        });
        aSourceMapConsumer.sources.forEach(function(sourceFile) {
          let sourceRelative = sourceFile;
          if (sourceRoot !== null) {
            sourceRelative = util.relative(sourceRoot, sourceFile);
          }
          if (!generator._sources.has(sourceRelative)) {
            generator._sources.add(sourceRelative);
          }
          const content = aSourceMapConsumer.sourceContentFor(sourceFile);
          if (content != null) {
            generator.setSourceContent(sourceFile, content);
          }
        });
        return generator;
      }
      /**
       * Add a single mapping from original source line and column to the generated
       * source's line and column for this source map being created. The mapping
       * object should have the following properties:
       *
       *   - generated: An object with the generated line and column positions.
       *   - original: An object with the original line and column positions.
       *   - source: The original source file (relative to the sourceRoot).
       *   - name: An optional original token name for this mapping.
       */
      addMapping(aArgs) {
        const generated = util.getArg(aArgs, "generated");
        const original = util.getArg(aArgs, "original", null);
        let source = util.getArg(aArgs, "source", null);
        let name = util.getArg(aArgs, "name", null);
        if (!this._skipValidation) {
          this._validateMapping(generated, original, source, name);
        }
        if (source != null) {
          source = String(source);
          if (!this._sources.has(source)) {
            this._sources.add(source);
          }
        }
        if (name != null) {
          name = String(name);
          if (!this._names.has(name)) {
            this._names.add(name);
          }
        }
        this._mappings.add({
          generatedLine: generated.line,
          generatedColumn: generated.column,
          originalLine: original != null && original.line,
          originalColumn: original != null && original.column,
          source,
          name
        });
      }
      /**
       * Set the source content for a source file.
       */
      setSourceContent(aSourceFile, aSourceContent) {
        let source = aSourceFile;
        if (this._sourceRoot != null) {
          source = util.relative(this._sourceRoot, source);
        }
        if (aSourceContent != null) {
          if (!this._sourcesContents) {
            this._sourcesContents = /* @__PURE__ */ Object.create(null);
          }
          this._sourcesContents[util.toSetString(source)] = aSourceContent;
        } else if (this._sourcesContents) {
          delete this._sourcesContents[util.toSetString(source)];
          if (Object.keys(this._sourcesContents).length === 0) {
            this._sourcesContents = null;
          }
        }
      }
      /**
       * Applies the mappings of a sub-source-map for a specific source file to the
       * source map being generated. Each mapping to the supplied source file is
       * rewritten using the supplied source map. Note: The resolution for the
       * resulting mappings is the minimium of this map and the supplied map.
       *
       * @param aSourceMapConsumer The source map to be applied.
       * @param aSourceFile Optional. The filename of the source file.
       *        If omitted, SourceMapConsumer's file property will be used.
       * @param aSourceMapPath Optional. The dirname of the path to the source map
       *        to be applied. If relative, it is relative to the SourceMapConsumer.
       *        This parameter is needed when the two source maps aren't in the same
       *        directory, and the source map to be applied contains relative source
       *        paths. If so, those relative source paths need to be rewritten
       *        relative to the SourceMapGenerator.
       */
      applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
        let sourceFile = aSourceFile;
        if (aSourceFile == null) {
          if (aSourceMapConsumer.file == null) {
            throw new Error(
              `SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map's "file" property. Both were omitted.`
            );
          }
          sourceFile = aSourceMapConsumer.file;
        }
        const sourceRoot = this._sourceRoot;
        if (sourceRoot != null) {
          sourceFile = util.relative(sourceRoot, sourceFile);
        }
        const newSources = this._mappings.toArray().length > 0 ? new ArraySet() : this._sources;
        const newNames = new ArraySet();
        this._mappings.unsortedForEach(function(mapping) {
          if (mapping.source === sourceFile && mapping.originalLine != null) {
            const original = aSourceMapConsumer.originalPositionFor({
              line: mapping.originalLine,
              column: mapping.originalColumn
            });
            if (original.source != null) {
              mapping.source = original.source;
              if (aSourceMapPath != null) {
                mapping.source = util.join(aSourceMapPath, mapping.source);
              }
              if (sourceRoot != null) {
                mapping.source = util.relative(sourceRoot, mapping.source);
              }
              mapping.originalLine = original.line;
              mapping.originalColumn = original.column;
              if (original.name != null) {
                mapping.name = original.name;
              }
            }
          }
          const source = mapping.source;
          if (source != null && !newSources.has(source)) {
            newSources.add(source);
          }
          const name = mapping.name;
          if (name != null && !newNames.has(name)) {
            newNames.add(name);
          }
        }, this);
        this._sources = newSources;
        this._names = newNames;
        aSourceMapConsumer.sources.forEach(function(srcFile) {
          const content = aSourceMapConsumer.sourceContentFor(srcFile);
          if (content != null) {
            if (aSourceMapPath != null) {
              srcFile = util.join(aSourceMapPath, srcFile);
            }
            if (sourceRoot != null) {
              srcFile = util.relative(sourceRoot, srcFile);
            }
            this.setSourceContent(srcFile, content);
          }
        }, this);
      }
      /**
       * A mapping can have one of the three levels of data:
       *
       *   1. Just the generated position.
       *   2. The Generated position, original position, and original source.
       *   3. Generated and original position, original source, as well as a name
       *      token.
       *
       * To maintain consistency, we validate that any new mapping being added falls
       * in to one of these categories.
       */
      _validateMapping(aGenerated, aOriginal, aSource, aName) {
        if (aOriginal && typeof aOriginal.line !== "number" && typeof aOriginal.column !== "number") {
          throw new Error(
            "original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values."
          );
        }
        if (aGenerated && "line" in aGenerated && "column" in aGenerated && aGenerated.line > 0 && aGenerated.column >= 0 && !aOriginal && !aSource && !aName) {
        } else if (aGenerated && "line" in aGenerated && "column" in aGenerated && aOriginal && "line" in aOriginal && "column" in aOriginal && aGenerated.line > 0 && aGenerated.column >= 0 && aOriginal.line > 0 && aOriginal.column >= 0 && aSource) {
        } else {
          throw new Error("Invalid mapping: " + JSON.stringify({
            generated: aGenerated,
            source: aSource,
            original: aOriginal,
            name: aName
          }));
        }
      }
      /**
       * Serialize the accumulated mappings in to the stream of base 64 VLQs
       * specified by the source map format.
       */
      _serializeMappings() {
        let previousGeneratedColumn = 0;
        let previousGeneratedLine = 1;
        let previousOriginalColumn = 0;
        let previousOriginalLine = 0;
        let previousName = 0;
        let previousSource = 0;
        let result = "";
        let next;
        let mapping;
        let nameIdx;
        let sourceIdx;
        const mappings = this._mappings.toArray();
        for (let i = 0, len = mappings.length; i < len; i++) {
          mapping = mappings[i];
          next = "";
          if (mapping.generatedLine !== previousGeneratedLine) {
            previousGeneratedColumn = 0;
            while (mapping.generatedLine !== previousGeneratedLine) {
              next += ";";
              previousGeneratedLine++;
            }
          } else if (i > 0) {
            if (!util.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
              continue;
            }
            next += ",";
          }
          next += base64VLQ.encode(mapping.generatedColumn - previousGeneratedColumn);
          previousGeneratedColumn = mapping.generatedColumn;
          if (mapping.source != null) {
            sourceIdx = this._sources.indexOf(mapping.source);
            next += base64VLQ.encode(sourceIdx - previousSource);
            previousSource = sourceIdx;
            next += base64VLQ.encode(mapping.originalLine - 1 - previousOriginalLine);
            previousOriginalLine = mapping.originalLine - 1;
            next += base64VLQ.encode(mapping.originalColumn - previousOriginalColumn);
            previousOriginalColumn = mapping.originalColumn;
            if (mapping.name != null) {
              nameIdx = this._names.indexOf(mapping.name);
              next += base64VLQ.encode(nameIdx - previousName);
              previousName = nameIdx;
            }
          }
          result += next;
        }
        return result;
      }
      _generateSourcesContent(aSources, aSourceRoot) {
        return aSources.map(function(source) {
          if (!this._sourcesContents) {
            return null;
          }
          if (aSourceRoot != null) {
            source = util.relative(aSourceRoot, source);
          }
          const key = util.toSetString(source);
          return Object.prototype.hasOwnProperty.call(this._sourcesContents, key) ? this._sourcesContents[key] : null;
        }, this);
      }
      /**
       * Externalize the source map.
       */
      toJSON() {
        const map = {
          version: this._version,
          sources: this._sources.toArray(),
          names: this._names.toArray(),
          mappings: this._serializeMappings()
        };
        if (this._file != null) {
          map.file = this._file;
        }
        if (this._sourceRoot != null) {
          map.sourceRoot = this._sourceRoot;
        }
        if (this._sourcesContents) {
          map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
        }
        return map;
      }
      /**
       * Render the source map being generated to a string.
       */
      toString() {
        return JSON.stringify(this.toJSON());
      }
    };
    SourceMapGenerator.prototype._version = 3;
    exports.SourceMapGenerator = SourceMapGenerator;
  }
});

// node_modules/source-map/lib/binary-search.js
var require_binary_search = __commonJS({
  "node_modules/source-map/lib/binary-search.js"(exports) {
    exports.GREATEST_LOWER_BOUND = 1;
    exports.LEAST_UPPER_BOUND = 2;
    function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
      const mid = Math.floor((aHigh - aLow) / 2) + aLow;
      const cmp = aCompare(aNeedle, aHaystack[mid], true);
      if (cmp === 0) {
        return mid;
      } else if (cmp > 0) {
        if (aHigh - mid > 1) {
          return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
        }
        if (aBias == exports.LEAST_UPPER_BOUND) {
          return aHigh < aHaystack.length ? aHigh : -1;
        }
        return mid;
      }
      if (mid - aLow > 1) {
        return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
      }
      if (aBias == exports.LEAST_UPPER_BOUND) {
        return mid;
      }
      return aLow < 0 ? -1 : aLow;
    }
    exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
      if (aHaystack.length === 0) {
        return -1;
      }
      let index = recursiveSearch(
        -1,
        aHaystack.length,
        aNeedle,
        aHaystack,
        aCompare,
        aBias || exports.GREATEST_LOWER_BOUND
      );
      if (index < 0) {
        return -1;
      }
      while (index - 1 >= 0) {
        if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
          break;
        }
        --index;
      }
      return index;
    };
  }
});

// node_modules/source-map/lib/read-wasm.js
var require_read_wasm = __commonJS({
  "node_modules/source-map/lib/read-wasm.js"(exports, module2) {
    var isBrowserEnvironment = function() {
      return typeof window !== "undefined" && this === window;
    }.call();
    if (isBrowserEnvironment) {
      let mappingsWasm = null;
      module2.exports = function readWasm() {
        if (typeof mappingsWasm === "string") {
          return fetch(mappingsWasm).then((response) => response.arrayBuffer());
        }
        if (mappingsWasm instanceof ArrayBuffer) {
          return Promise.resolve(mappingsWasm);
        }
        throw new Error("You must provide the string URL or ArrayBuffer contents of lib/mappings.wasm by calling SourceMapConsumer.initialize({ 'lib/mappings.wasm': ... }) before using SourceMapConsumer");
      };
      module2.exports.initialize = (input) => mappingsWasm = input;
    } else {
      const fs = require("fs");
      const path = require("path");
      module2.exports = function readWasm() {
        return new Promise((resolve, reject) => {
          const wasmPath = path.join(__dirname, "mappings.wasm");
          fs.readFile(wasmPath, null, (error, data) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(data.buffer);
          });
        });
      };
      module2.exports.initialize = (_) => {
        console.debug("SourceMapConsumer.initialize is a no-op when running in node.js");
      };
    }
  }
});

// node_modules/source-map/lib/wasm.js
var require_wasm = __commonJS({
  "node_modules/source-map/lib/wasm.js"(exports, module2) {
    var readWasm = require_read_wasm();
    function Mapping() {
      this.generatedLine = 0;
      this.generatedColumn = 0;
      this.lastGeneratedColumn = null;
      this.source = null;
      this.originalLine = null;
      this.originalColumn = null;
      this.name = null;
    }
    var cachedWasm = null;
    module2.exports = function wasm() {
      if (cachedWasm) {
        return cachedWasm;
      }
      const callbackStack = [];
      cachedWasm = readWasm().then((buffer) => {
        return WebAssembly.instantiate(buffer, {
          env: {
            mapping_callback(generatedLine, generatedColumn, hasLastGeneratedColumn, lastGeneratedColumn, hasOriginal, source, originalLine, originalColumn, hasName, name) {
              const mapping = new Mapping();
              mapping.generatedLine = generatedLine + 1;
              mapping.generatedColumn = generatedColumn;
              if (hasLastGeneratedColumn) {
                mapping.lastGeneratedColumn = lastGeneratedColumn - 1;
              }
              if (hasOriginal) {
                mapping.source = source;
                mapping.originalLine = originalLine + 1;
                mapping.originalColumn = originalColumn;
                if (hasName) {
                  mapping.name = name;
                }
              }
              callbackStack[callbackStack.length - 1](mapping);
            },
            start_all_generated_locations_for() {
              console.time("all_generated_locations_for");
            },
            end_all_generated_locations_for() {
              console.timeEnd("all_generated_locations_for");
            },
            start_compute_column_spans() {
              console.time("compute_column_spans");
            },
            end_compute_column_spans() {
              console.timeEnd("compute_column_spans");
            },
            start_generated_location_for() {
              console.time("generated_location_for");
            },
            end_generated_location_for() {
              console.timeEnd("generated_location_for");
            },
            start_original_location_for() {
              console.time("original_location_for");
            },
            end_original_location_for() {
              console.timeEnd("original_location_for");
            },
            start_parse_mappings() {
              console.time("parse_mappings");
            },
            end_parse_mappings() {
              console.timeEnd("parse_mappings");
            },
            start_sort_by_generated_location() {
              console.time("sort_by_generated_location");
            },
            end_sort_by_generated_location() {
              console.timeEnd("sort_by_generated_location");
            },
            start_sort_by_original_location() {
              console.time("sort_by_original_location");
            },
            end_sort_by_original_location() {
              console.timeEnd("sort_by_original_location");
            }
          }
        });
      }).then((Wasm) => {
        return {
          exports: Wasm.instance.exports,
          withMappingCallback: (mappingCallback, f) => {
            callbackStack.push(mappingCallback);
            try {
              f();
            } finally {
              callbackStack.pop();
            }
          }
        };
      }).then(null, (e) => {
        cachedWasm = null;
        throw e;
      });
      return cachedWasm;
    };
  }
});

// node_modules/source-map/lib/source-map-consumer.js
var require_source_map_consumer = __commonJS({
  "node_modules/source-map/lib/source-map-consumer.js"(exports) {
    var util = require_util();
    var binarySearch = require_binary_search();
    var ArraySet = require_array_set().ArraySet;
    var base64VLQ = require_base64_vlq();
    var readWasm = require_read_wasm();
    var wasm = require_wasm();
    var INTERNAL = Symbol("smcInternal");
    var SourceMapConsumer = class {
      constructor(aSourceMap, aSourceMapURL) {
        if (aSourceMap == INTERNAL) {
          return Promise.resolve(this);
        }
        return _factory(aSourceMap, aSourceMapURL);
      }
      static initialize(opts) {
        readWasm.initialize(opts["lib/mappings.wasm"]);
      }
      static fromSourceMap(aSourceMap, aSourceMapURL) {
        return _factoryBSM(aSourceMap, aSourceMapURL);
      }
      /**
       * Construct a new `SourceMapConsumer` from `rawSourceMap` and `sourceMapUrl`
       * (see the `SourceMapConsumer` constructor for details. Then, invoke the `async
       * function f(SourceMapConsumer) -> T` with the newly constructed consumer, wait
       * for `f` to complete, call `destroy` on the consumer, and return `f`'s return
       * value.
       *
       * You must not use the consumer after `f` completes!
       *
       * By using `with`, you do not have to remember to manually call `destroy` on
       * the consumer, since it will be called automatically once `f` completes.
       *
       * ```js
       * const xSquared = await SourceMapConsumer.with(
       *   myRawSourceMap,
       *   null,
       *   async function (consumer) {
       *     // Use `consumer` inside here and don't worry about remembering
       *     // to call `destroy`.
       *
       *     const x = await whatever(consumer);
       *     return x * x;
       *   }
       * );
       *
       * // You may not use that `consumer` anymore out here; it has
       * // been destroyed. But you can use `xSquared`.
       * console.log(xSquared);
       * ```
       */
      static async with(rawSourceMap, sourceMapUrl, f) {
        const consumer = await new SourceMapConsumer(rawSourceMap, sourceMapUrl);
        try {
          return await f(consumer);
        } finally {
          consumer.destroy();
        }
      }
      /**
       * Parse the mappings in a string in to a data structure which we can easily
       * query (the ordered arrays in the `this.__generatedMappings` and
       * `this.__originalMappings` properties).
       */
      _parseMappings(aStr, aSourceRoot) {
        throw new Error("Subclasses must implement _parseMappings");
      }
      /**
       * Iterate over each mapping between an original source/line/column and a
       * generated line/column in this source map.
       *
       * @param Function aCallback
       *        The function that is called with each mapping.
       * @param Object aContext
       *        Optional. If specified, this object will be the value of `this` every
       *        time that `aCallback` is called.
       * @param aOrder
       *        Either `SourceMapConsumer.GENERATED_ORDER` or
       *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
       *        iterate over the mappings sorted by the generated file's line/column
       *        order or the original's source/line/column order, respectively. Defaults to
       *        `SourceMapConsumer.GENERATED_ORDER`.
       */
      eachMapping(aCallback, aContext, aOrder) {
        throw new Error("Subclasses must implement eachMapping");
      }
      /**
       * Returns all generated line and column information for the original source,
       * line, and column provided. If no column is provided, returns all mappings
       * corresponding to a either the line we are searching for or the next
       * closest line that has any mappings. Otherwise, returns all mappings
       * corresponding to the given line and either the column we are searching for
       * or the next closest column that has any offsets.
       *
       * The only argument is an object with the following properties:
       *
       *   - source: The filename of the original source.
       *   - line: The line number in the original source.  The line number is 1-based.
       *   - column: Optional. the column number in the original source.
       *    The column number is 0-based.
       *
       * and an array of objects is returned, each with the following properties:
       *
       *   - line: The line number in the generated source, or null.  The
       *    line number is 1-based.
       *   - column: The column number in the generated source, or null.
       *    The column number is 0-based.
       */
      allGeneratedPositionsFor(aArgs) {
        throw new Error("Subclasses must implement allGeneratedPositionsFor");
      }
      destroy() {
        throw new Error("Subclasses must implement destroy");
      }
    };
    SourceMapConsumer.prototype._version = 3;
    SourceMapConsumer.GENERATED_ORDER = 1;
    SourceMapConsumer.ORIGINAL_ORDER = 2;
    SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
    SourceMapConsumer.LEAST_UPPER_BOUND = 2;
    exports.SourceMapConsumer = SourceMapConsumer;
    var BasicSourceMapConsumer = class extends SourceMapConsumer {
      constructor(aSourceMap, aSourceMapURL) {
        return super(INTERNAL).then((that) => {
          let sourceMap = aSourceMap;
          if (typeof aSourceMap === "string") {
            sourceMap = util.parseSourceMapInput(aSourceMap);
          }
          const version = util.getArg(sourceMap, "version");
          let sources = util.getArg(sourceMap, "sources");
          const names = util.getArg(sourceMap, "names", []);
          let sourceRoot = util.getArg(sourceMap, "sourceRoot", null);
          const sourcesContent = util.getArg(sourceMap, "sourcesContent", null);
          const mappings = util.getArg(sourceMap, "mappings");
          const file = util.getArg(sourceMap, "file", null);
          if (version != that._version) {
            throw new Error("Unsupported version: " + version);
          }
          if (sourceRoot) {
            sourceRoot = util.normalize(sourceRoot);
          }
          sources = sources.map(String).map(util.normalize).map(function(source) {
            return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source) ? util.relative(sourceRoot, source) : source;
          });
          that._names = ArraySet.fromArray(names.map(String), true);
          that._sources = ArraySet.fromArray(sources, true);
          that._absoluteSources = that._sources.toArray().map(function(s) {
            return util.computeSourceURL(sourceRoot, s, aSourceMapURL);
          });
          that.sourceRoot = sourceRoot;
          that.sourcesContent = sourcesContent;
          that._mappings = mappings;
          that._sourceMapURL = aSourceMapURL;
          that.file = file;
          that._computedColumnSpans = false;
          that._mappingsPtr = 0;
          that._wasm = null;
          return wasm().then((w) => {
            that._wasm = w;
            return that;
          });
        });
      }
      /**
       * Utility function to find the index of a source.  Returns -1 if not
       * found.
       */
      _findSourceIndex(aSource) {
        let relativeSource = aSource;
        if (this.sourceRoot != null) {
          relativeSource = util.relative(this.sourceRoot, relativeSource);
        }
        if (this._sources.has(relativeSource)) {
          return this._sources.indexOf(relativeSource);
        }
        for (let i = 0; i < this._absoluteSources.length; ++i) {
          if (this._absoluteSources[i] == aSource) {
            return i;
          }
        }
        return -1;
      }
      /**
       * Create a BasicSourceMapConsumer from a SourceMapGenerator.
       *
       * @param SourceMapGenerator aSourceMap
       *        The source map that will be consumed.
       * @param String aSourceMapURL
       *        The URL at which the source map can be found (optional)
       * @returns BasicSourceMapConsumer
       */
      static fromSourceMap(aSourceMap, aSourceMapURL) {
        return new BasicSourceMapConsumer(aSourceMap.toString());
      }
      get sources() {
        return this._absoluteSources.slice();
      }
      _getMappingsPtr() {
        if (this._mappingsPtr === 0) {
          this._parseMappings(this._mappings, this.sourceRoot);
        }
        return this._mappingsPtr;
      }
      /**
       * Parse the mappings in a string in to a data structure which we can easily
       * query (the ordered arrays in the `this.__generatedMappings` and
       * `this.__originalMappings` properties).
       */
      _parseMappings(aStr, aSourceRoot) {
        const size = aStr.length;
        const mappingsBufPtr = this._wasm.exports.allocate_mappings(size);
        const mappingsBuf = new Uint8Array(this._wasm.exports.memory.buffer, mappingsBufPtr, size);
        for (let i = 0; i < size; i++) {
          mappingsBuf[i] = aStr.charCodeAt(i);
        }
        const mappingsPtr = this._wasm.exports.parse_mappings(mappingsBufPtr);
        if (!mappingsPtr) {
          const error = this._wasm.exports.get_last_error();
          let msg = `Error parsing mappings (code ${error}): `;
          switch (error) {
            case 1:
              msg += "the mappings contained a negative line, column, source index, or name index";
              break;
            case 2:
              msg += "the mappings contained a number larger than 2**32";
              break;
            case 3:
              msg += "reached EOF while in the middle of parsing a VLQ";
              break;
            case 4:
              msg += "invalid base 64 character while parsing a VLQ";
              break;
            default:
              msg += "unknown error code";
              break;
          }
          throw new Error(msg);
        }
        this._mappingsPtr = mappingsPtr;
      }
      eachMapping(aCallback, aContext, aOrder) {
        const context = aContext || null;
        const order = aOrder || SourceMapConsumer.GENERATED_ORDER;
        const sourceRoot = this.sourceRoot;
        this._wasm.withMappingCallback(
          (mapping) => {
            if (mapping.source !== null) {
              mapping.source = this._sources.at(mapping.source);
              mapping.source = util.computeSourceURL(sourceRoot, mapping.source, this._sourceMapURL);
              if (mapping.name !== null) {
                mapping.name = this._names.at(mapping.name);
              }
            }
            aCallback.call(context, mapping);
          },
          () => {
            switch (order) {
              case SourceMapConsumer.GENERATED_ORDER:
                this._wasm.exports.by_generated_location(this._getMappingsPtr());
                break;
              case SourceMapConsumer.ORIGINAL_ORDER:
                this._wasm.exports.by_original_location(this._getMappingsPtr());
                break;
              default:
                throw new Error("Unknown order of iteration.");
            }
          }
        );
      }
      allGeneratedPositionsFor(aArgs) {
        let source = util.getArg(aArgs, "source");
        const originalLine = util.getArg(aArgs, "line");
        const originalColumn = aArgs.column || 0;
        source = this._findSourceIndex(source);
        if (source < 0) {
          return [];
        }
        if (originalLine < 1) {
          throw new Error("Line numbers must be >= 1");
        }
        if (originalColumn < 0) {
          throw new Error("Column numbers must be >= 0");
        }
        const mappings = [];
        this._wasm.withMappingCallback(
          (m) => {
            let lastColumn = m.lastGeneratedColumn;
            if (this._computedColumnSpans && lastColumn === null) {
              lastColumn = Infinity;
            }
            mappings.push({
              line: m.generatedLine,
              column: m.generatedColumn,
              lastColumn
            });
          },
          () => {
            this._wasm.exports.all_generated_locations_for(
              this._getMappingsPtr(),
              source,
              originalLine - 1,
              "column" in aArgs,
              originalColumn
            );
          }
        );
        return mappings;
      }
      destroy() {
        if (this._mappingsPtr !== 0) {
          this._wasm.exports.free_mappings(this._mappingsPtr);
          this._mappingsPtr = 0;
        }
      }
      /**
       * Compute the last column for each generated mapping. The last column is
       * inclusive.
       */
      computeColumnSpans() {
        if (this._computedColumnSpans) {
          return;
        }
        this._wasm.exports.compute_column_spans(this._getMappingsPtr());
        this._computedColumnSpans = true;
      }
      /**
       * Returns the original source, line, and column information for the generated
       * source's line and column positions provided. The only argument is an object
       * with the following properties:
       *
       *   - line: The line number in the generated source.  The line number
       *     is 1-based.
       *   - column: The column number in the generated source.  The column
       *     number is 0-based.
       *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
       *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
       *     closest element that is smaller than or greater than the one we are
       *     searching for, respectively, if the exact element cannot be found.
       *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
       *
       * and an object is returned with the following properties:
       *
       *   - source: The original source file, or null.
       *   - line: The line number in the original source, or null.  The
       *     line number is 1-based.
       *   - column: The column number in the original source, or null.  The
       *     column number is 0-based.
       *   - name: The original identifier, or null.
       */
      originalPositionFor(aArgs) {
        const needle = {
          generatedLine: util.getArg(aArgs, "line"),
          generatedColumn: util.getArg(aArgs, "column")
        };
        if (needle.generatedLine < 1) {
          throw new Error("Line numbers must be >= 1");
        }
        if (needle.generatedColumn < 0) {
          throw new Error("Column numbers must be >= 0");
        }
        let bias = util.getArg(aArgs, "bias", SourceMapConsumer.GREATEST_LOWER_BOUND);
        if (bias == null) {
          bias = SourceMapConsumer.GREATEST_LOWER_BOUND;
        }
        let mapping;
        this._wasm.withMappingCallback((m) => mapping = m, () => {
          this._wasm.exports.original_location_for(
            this._getMappingsPtr(),
            needle.generatedLine - 1,
            needle.generatedColumn,
            bias
          );
        });
        if (mapping) {
          if (mapping.generatedLine === needle.generatedLine) {
            let source = util.getArg(mapping, "source", null);
            if (source !== null) {
              source = this._sources.at(source);
              source = util.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
            }
            let name = util.getArg(mapping, "name", null);
            if (name !== null) {
              name = this._names.at(name);
            }
            return {
              source,
              line: util.getArg(mapping, "originalLine", null),
              column: util.getArg(mapping, "originalColumn", null),
              name
            };
          }
        }
        return {
          source: null,
          line: null,
          column: null,
          name: null
        };
      }
      /**
       * Return true if we have the source content for every source in the source
       * map, false otherwise.
       */
      hasContentsOfAllSources() {
        if (!this.sourcesContent) {
          return false;
        }
        return this.sourcesContent.length >= this._sources.size() && !this.sourcesContent.some(function(sc) {
          return sc == null;
        });
      }
      /**
       * Returns the original source content. The only argument is the url of the
       * original source file. Returns null if no original source content is
       * available.
       */
      sourceContentFor(aSource, nullOnMissing) {
        if (!this.sourcesContent) {
          return null;
        }
        const index = this._findSourceIndex(aSource);
        if (index >= 0) {
          return this.sourcesContent[index];
        }
        let relativeSource = aSource;
        if (this.sourceRoot != null) {
          relativeSource = util.relative(this.sourceRoot, relativeSource);
        }
        let url;
        if (this.sourceRoot != null && (url = util.urlParse(this.sourceRoot))) {
          const fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
          if (url.scheme == "file" && this._sources.has(fileUriAbsPath)) {
            return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)];
          }
          if ((!url.path || url.path == "/") && this._sources.has("/" + relativeSource)) {
            return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
          }
        }
        if (nullOnMissing) {
          return null;
        }
        throw new Error('"' + relativeSource + '" is not in the SourceMap.');
      }
      /**
       * Returns the generated line and column information for the original source,
       * line, and column positions provided. The only argument is an object with
       * the following properties:
       *
       *   - source: The filename of the original source.
       *   - line: The line number in the original source.  The line number
       *     is 1-based.
       *   - column: The column number in the original source.  The column
       *     number is 0-based.
       *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
       *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
       *     closest element that is smaller than or greater than the one we are
       *     searching for, respectively, if the exact element cannot be found.
       *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
       *
       * and an object is returned with the following properties:
       *
       *   - line: The line number in the generated source, or null.  The
       *     line number is 1-based.
       *   - column: The column number in the generated source, or null.
       *     The column number is 0-based.
       */
      generatedPositionFor(aArgs) {
        let source = util.getArg(aArgs, "source");
        source = this._findSourceIndex(source);
        if (source < 0) {
          return {
            line: null,
            column: null,
            lastColumn: null
          };
        }
        const needle = {
          source,
          originalLine: util.getArg(aArgs, "line"),
          originalColumn: util.getArg(aArgs, "column")
        };
        if (needle.originalLine < 1) {
          throw new Error("Line numbers must be >= 1");
        }
        if (needle.originalColumn < 0) {
          throw new Error("Column numbers must be >= 0");
        }
        let bias = util.getArg(aArgs, "bias", SourceMapConsumer.GREATEST_LOWER_BOUND);
        if (bias == null) {
          bias = SourceMapConsumer.GREATEST_LOWER_BOUND;
        }
        let mapping;
        this._wasm.withMappingCallback((m) => mapping = m, () => {
          this._wasm.exports.generated_location_for(
            this._getMappingsPtr(),
            needle.source,
            needle.originalLine - 1,
            needle.originalColumn,
            bias
          );
        });
        if (mapping) {
          if (mapping.source === needle.source) {
            let lastColumn = mapping.lastGeneratedColumn;
            if (this._computedColumnSpans && lastColumn === null) {
              lastColumn = Infinity;
            }
            return {
              line: util.getArg(mapping, "generatedLine", null),
              column: util.getArg(mapping, "generatedColumn", null),
              lastColumn
            };
          }
        }
        return {
          line: null,
          column: null,
          lastColumn: null
        };
      }
    };
    BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;
    exports.BasicSourceMapConsumer = BasicSourceMapConsumer;
    var IndexedSourceMapConsumer = class extends SourceMapConsumer {
      constructor(aSourceMap, aSourceMapURL) {
        return super(INTERNAL).then((that) => {
          let sourceMap = aSourceMap;
          if (typeof aSourceMap === "string") {
            sourceMap = util.parseSourceMapInput(aSourceMap);
          }
          const version = util.getArg(sourceMap, "version");
          const sections = util.getArg(sourceMap, "sections");
          if (version != that._version) {
            throw new Error("Unsupported version: " + version);
          }
          that._sources = new ArraySet();
          that._names = new ArraySet();
          that.__generatedMappings = null;
          that.__originalMappings = null;
          that.__generatedMappingsUnsorted = null;
          that.__originalMappingsUnsorted = null;
          let lastOffset = {
            line: -1,
            column: 0
          };
          return Promise.all(sections.map((s) => {
            if (s.url) {
              throw new Error("Support for url field in sections not implemented.");
            }
            const offset = util.getArg(s, "offset");
            const offsetLine = util.getArg(offset, "line");
            const offsetColumn = util.getArg(offset, "column");
            if (offsetLine < lastOffset.line || offsetLine === lastOffset.line && offsetColumn < lastOffset.column) {
              throw new Error("Section offsets must be ordered and non-overlapping.");
            }
            lastOffset = offset;
            const cons = new SourceMapConsumer(util.getArg(s, "map"), aSourceMapURL);
            return cons.then((consumer) => {
              return {
                generatedOffset: {
                  // The offset fields are 0-based, but we use 1-based indices when
                  // encoding/decoding from VLQ.
                  generatedLine: offsetLine + 1,
                  generatedColumn: offsetColumn + 1
                },
                consumer
              };
            });
          })).then((s) => {
            that._sections = s;
            return that;
          });
        });
      }
      // `__generatedMappings` and `__originalMappings` are arrays that hold the
      // parsed mapping coordinates from the source map's "mappings" attribute. They
      // are lazily instantiated, accessed via the `_generatedMappings` and
      // `_originalMappings` getters respectively, and we only parse the mappings
      // and create these arrays once queried for a source location. We jump through
      // these hoops because there can be many thousands of mappings, and parsing
      // them is expensive, so we only want to do it if we must.
      //
      // Each object in the arrays is of the form:
      //
      //     {
      //       generatedLine: The line number in the generated code,
      //       generatedColumn: The column number in the generated code,
      //       source: The path to the original source file that generated this
      //               chunk of code,
      //       originalLine: The line number in the original source that
      //                     corresponds to this chunk of generated code,
      //       originalColumn: The column number in the original source that
      //                       corresponds to this chunk of generated code,
      //       name: The name of the original symbol which generated this chunk of
      //             code.
      //     }
      //
      // All properties except for `generatedLine` and `generatedColumn` can be
      // `null`.
      //
      // `_generatedMappings` is ordered by the generated positions.
      //
      // `_originalMappings` is ordered by the original positions.
      get _generatedMappings() {
        if (!this.__generatedMappings) {
          this._sortGeneratedMappings();
        }
        return this.__generatedMappings;
      }
      get _originalMappings() {
        if (!this.__originalMappings) {
          this._sortOriginalMappings();
        }
        return this.__originalMappings;
      }
      get _generatedMappingsUnsorted() {
        if (!this.__generatedMappingsUnsorted) {
          this._parseMappings(this._mappings, this.sourceRoot);
        }
        return this.__generatedMappingsUnsorted;
      }
      get _originalMappingsUnsorted() {
        if (!this.__originalMappingsUnsorted) {
          this._parseMappings(this._mappings, this.sourceRoot);
        }
        return this.__originalMappingsUnsorted;
      }
      _sortGeneratedMappings() {
        const mappings = this._generatedMappingsUnsorted;
        mappings.sort(util.compareByGeneratedPositionsDeflated);
        this.__generatedMappings = mappings;
      }
      _sortOriginalMappings() {
        const mappings = this._originalMappingsUnsorted;
        mappings.sort(util.compareByOriginalPositions);
        this.__originalMappings = mappings;
      }
      /**
       * The list of original sources.
       */
      get sources() {
        const sources = [];
        for (let i = 0; i < this._sections.length; i++) {
          for (let j = 0; j < this._sections[i].consumer.sources.length; j++) {
            sources.push(this._sections[i].consumer.sources[j]);
          }
        }
        return sources;
      }
      /**
       * Returns the original source, line, and column information for the generated
       * source's line and column positions provided. The only argument is an object
       * with the following properties:
       *
       *   - line: The line number in the generated source.  The line number
       *     is 1-based.
       *   - column: The column number in the generated source.  The column
       *     number is 0-based.
       *
       * and an object is returned with the following properties:
       *
       *   - source: The original source file, or null.
       *   - line: The line number in the original source, or null.  The
       *     line number is 1-based.
       *   - column: The column number in the original source, or null.  The
       *     column number is 0-based.
       *   - name: The original identifier, or null.
       */
      originalPositionFor(aArgs) {
        const needle = {
          generatedLine: util.getArg(aArgs, "line"),
          generatedColumn: util.getArg(aArgs, "column")
        };
        const sectionIndex = binarySearch.search(
          needle,
          this._sections,
          function(aNeedle, section2) {
            const cmp = aNeedle.generatedLine - section2.generatedOffset.generatedLine;
            if (cmp) {
              return cmp;
            }
            return aNeedle.generatedColumn - section2.generatedOffset.generatedColumn;
          }
        );
        const section = this._sections[sectionIndex];
        if (!section) {
          return {
            source: null,
            line: null,
            column: null,
            name: null
          };
        }
        return section.consumer.originalPositionFor({
          line: needle.generatedLine - (section.generatedOffset.generatedLine - 1),
          column: needle.generatedColumn - (section.generatedOffset.generatedLine === needle.generatedLine ? section.generatedOffset.generatedColumn - 1 : 0),
          bias: aArgs.bias
        });
      }
      /**
       * Return true if we have the source content for every source in the source
       * map, false otherwise.
       */
      hasContentsOfAllSources() {
        return this._sections.every(function(s) {
          return s.consumer.hasContentsOfAllSources();
        });
      }
      /**
       * Returns the original source content. The only argument is the url of the
       * original source file. Returns null if no original source content is
       * available.
       */
      sourceContentFor(aSource, nullOnMissing) {
        for (let i = 0; i < this._sections.length; i++) {
          const section = this._sections[i];
          const content = section.consumer.sourceContentFor(aSource, true);
          if (content) {
            return content;
          }
        }
        if (nullOnMissing) {
          return null;
        }
        throw new Error('"' + aSource + '" is not in the SourceMap.');
      }
      /**
       * Returns the generated line and column information for the original source,
       * line, and column positions provided. The only argument is an object with
       * the following properties:
       *
       *   - source: The filename of the original source.
       *   - line: The line number in the original source.  The line number
       *     is 1-based.
       *   - column: The column number in the original source.  The column
       *     number is 0-based.
       *
       * and an object is returned with the following properties:
       *
       *   - line: The line number in the generated source, or null.  The
       *     line number is 1-based.
       *   - column: The column number in the generated source, or null.
       *     The column number is 0-based.
       */
      generatedPositionFor(aArgs) {
        for (let i = 0; i < this._sections.length; i++) {
          const section = this._sections[i];
          if (section.consumer._findSourceIndex(util.getArg(aArgs, "source")) === -1) {
            continue;
          }
          const generatedPosition = section.consumer.generatedPositionFor(aArgs);
          if (generatedPosition) {
            const ret = {
              line: generatedPosition.line + (section.generatedOffset.generatedLine - 1),
              column: generatedPosition.column + (section.generatedOffset.generatedLine === generatedPosition.line ? section.generatedOffset.generatedColumn - 1 : 0)
            };
            return ret;
          }
        }
        return {
          line: null,
          column: null
        };
      }
      /**
       * Parse the mappings in a string in to a data structure which we can easily
       * query (the ordered arrays in the `this.__generatedMappings` and
       * `this.__originalMappings` properties).
       */
      _parseMappings(aStr, aSourceRoot) {
        const generatedMappings = this.__generatedMappingsUnsorted = [];
        const originalMappings = this.__originalMappingsUnsorted = [];
        for (let i = 0; i < this._sections.length; i++) {
          const section = this._sections[i];
          const sectionMappings = [];
          section.consumer.eachMapping((m) => sectionMappings.push(m));
          for (let j = 0; j < sectionMappings.length; j++) {
            const mapping = sectionMappings[j];
            let source = util.computeSourceURL(section.consumer.sourceRoot, null, this._sourceMapURL);
            this._sources.add(source);
            source = this._sources.indexOf(source);
            let name = null;
            if (mapping.name) {
              this._names.add(mapping.name);
              name = this._names.indexOf(mapping.name);
            }
            const adjustedMapping = {
              source,
              generatedLine: mapping.generatedLine + (section.generatedOffset.generatedLine - 1),
              generatedColumn: mapping.generatedColumn + (section.generatedOffset.generatedLine === mapping.generatedLine ? section.generatedOffset.generatedColumn - 1 : 0),
              originalLine: mapping.originalLine,
              originalColumn: mapping.originalColumn,
              name
            };
            generatedMappings.push(adjustedMapping);
            if (typeof adjustedMapping.originalLine === "number") {
              originalMappings.push(adjustedMapping);
            }
          }
        }
      }
      eachMapping(aCallback, aContext, aOrder) {
        const context = aContext || null;
        const order = aOrder || SourceMapConsumer.GENERATED_ORDER;
        let mappings;
        switch (order) {
          case SourceMapConsumer.GENERATED_ORDER:
            mappings = this._generatedMappings;
            break;
          case SourceMapConsumer.ORIGINAL_ORDER:
            mappings = this._originalMappings;
            break;
          default:
            throw new Error("Unknown order of iteration.");
        }
        const sourceRoot = this.sourceRoot;
        mappings.map(function(mapping) {
          let source = null;
          if (mapping.source !== null) {
            source = this._sources.at(mapping.source);
            source = util.computeSourceURL(sourceRoot, source, this._sourceMapURL);
          }
          return {
            source,
            generatedLine: mapping.generatedLine,
            generatedColumn: mapping.generatedColumn,
            originalLine: mapping.originalLine,
            originalColumn: mapping.originalColumn,
            name: mapping.name === null ? null : this._names.at(mapping.name)
          };
        }, this).forEach(aCallback, context);
      }
      /**
       * Find the mapping that best matches the hypothetical "needle" mapping that
       * we are searching for in the given "haystack" of mappings.
       */
      _findMapping(aNeedle, aMappings, aLineName, aColumnName, aComparator, aBias) {
        if (aNeedle[aLineName] <= 0) {
          throw new TypeError("Line must be greater than or equal to 1, got " + aNeedle[aLineName]);
        }
        if (aNeedle[aColumnName] < 0) {
          throw new TypeError("Column must be greater than or equal to 0, got " + aNeedle[aColumnName]);
        }
        return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
      }
      allGeneratedPositionsFor(aArgs) {
        const line = util.getArg(aArgs, "line");
        const needle = {
          source: util.getArg(aArgs, "source"),
          originalLine: line,
          originalColumn: util.getArg(aArgs, "column", 0)
        };
        needle.source = this._findSourceIndex(needle.source);
        if (needle.source < 0) {
          return [];
        }
        if (needle.originalLine < 1) {
          throw new Error("Line numbers must be >= 1");
        }
        if (needle.originalColumn < 0) {
          throw new Error("Column numbers must be >= 0");
        }
        const mappings = [];
        let index = this._findMapping(
          needle,
          this._originalMappings,
          "originalLine",
          "originalColumn",
          util.compareByOriginalPositions,
          binarySearch.LEAST_UPPER_BOUND
        );
        if (index >= 0) {
          let mapping = this._originalMappings[index];
          if (aArgs.column === void 0) {
            const originalLine = mapping.originalLine;
            while (mapping && mapping.originalLine === originalLine) {
              let lastColumn = mapping.lastGeneratedColumn;
              if (this._computedColumnSpans && lastColumn === null) {
                lastColumn = Infinity;
              }
              mappings.push({
                line: util.getArg(mapping, "generatedLine", null),
                column: util.getArg(mapping, "generatedColumn", null),
                lastColumn
              });
              mapping = this._originalMappings[++index];
            }
          } else {
            const originalColumn = mapping.originalColumn;
            while (mapping && mapping.originalLine === line && mapping.originalColumn == originalColumn) {
              let lastColumn = mapping.lastGeneratedColumn;
              if (this._computedColumnSpans && lastColumn === null) {
                lastColumn = Infinity;
              }
              mappings.push({
                line: util.getArg(mapping, "generatedLine", null),
                column: util.getArg(mapping, "generatedColumn", null),
                lastColumn
              });
              mapping = this._originalMappings[++index];
            }
          }
        }
        return mappings;
      }
      destroy() {
        for (let i = 0; i < this._sections.length; i++) {
          this._sections[i].consumer.destroy();
        }
      }
    };
    exports.IndexedSourceMapConsumer = IndexedSourceMapConsumer;
    function _factory(aSourceMap, aSourceMapURL) {
      let sourceMap = aSourceMap;
      if (typeof aSourceMap === "string") {
        sourceMap = util.parseSourceMapInput(aSourceMap);
      }
      const consumer = sourceMap.sections != null ? new IndexedSourceMapConsumer(sourceMap, aSourceMapURL) : new BasicSourceMapConsumer(sourceMap, aSourceMapURL);
      return Promise.resolve(consumer);
    }
    function _factoryBSM(aSourceMap, aSourceMapURL) {
      return BasicSourceMapConsumer.fromSourceMap(aSourceMap, aSourceMapURL);
    }
  }
});

// node_modules/source-map/lib/source-node.js
var require_source_node = __commonJS({
  "node_modules/source-map/lib/source-node.js"(exports) {
    var SourceMapGenerator = require_source_map_generator().SourceMapGenerator;
    var util = require_util();
    var REGEX_NEWLINE = /(\r?\n)/;
    var NEWLINE_CODE = 10;
    var isSourceNode = "$$$isSourceNode$$$";
    var SourceNode = class {
      constructor(aLine, aColumn, aSource, aChunks, aName) {
        this.children = [];
        this.sourceContents = {};
        this.line = aLine == null ? null : aLine;
        this.column = aColumn == null ? null : aColumn;
        this.source = aSource == null ? null : aSource;
        this.name = aName == null ? null : aName;
        this[isSourceNode] = true;
        if (aChunks != null)
          this.add(aChunks);
      }
      /**
       * Creates a SourceNode from generated code and a SourceMapConsumer.
       *
       * @param aGeneratedCode The generated code
       * @param aSourceMapConsumer The SourceMap for the generated code
       * @param aRelativePath Optional. The path that relative sources in the
       *        SourceMapConsumer should be relative to.
       */
      static fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
        const node = new SourceNode();
        const remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
        let remainingLinesIndex = 0;
        const shiftNextLine = function() {
          const lineContents = getNextLine();
          const newLine = getNextLine() || "";
          return lineContents + newLine;
          function getNextLine() {
            return remainingLinesIndex < remainingLines.length ? remainingLines[remainingLinesIndex++] : void 0;
          }
        };
        let lastGeneratedLine = 1, lastGeneratedColumn = 0;
        let lastMapping = null;
        let nextLine;
        aSourceMapConsumer.eachMapping(function(mapping) {
          if (lastMapping !== null) {
            if (lastGeneratedLine < mapping.generatedLine) {
              addMappingWithCode(lastMapping, shiftNextLine());
              lastGeneratedLine++;
              lastGeneratedColumn = 0;
            } else {
              nextLine = remainingLines[remainingLinesIndex] || "";
              const code = nextLine.substr(0, mapping.generatedColumn - lastGeneratedColumn);
              remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn - lastGeneratedColumn);
              lastGeneratedColumn = mapping.generatedColumn;
              addMappingWithCode(lastMapping, code);
              lastMapping = mapping;
              return;
            }
          }
          while (lastGeneratedLine < mapping.generatedLine) {
            node.add(shiftNextLine());
            lastGeneratedLine++;
          }
          if (lastGeneratedColumn < mapping.generatedColumn) {
            nextLine = remainingLines[remainingLinesIndex] || "";
            node.add(nextLine.substr(0, mapping.generatedColumn));
            remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn);
            lastGeneratedColumn = mapping.generatedColumn;
          }
          lastMapping = mapping;
        }, this);
        if (remainingLinesIndex < remainingLines.length) {
          if (lastMapping) {
            addMappingWithCode(lastMapping, shiftNextLine());
          }
          node.add(remainingLines.splice(remainingLinesIndex).join(""));
        }
        aSourceMapConsumer.sources.forEach(function(sourceFile) {
          const content = aSourceMapConsumer.sourceContentFor(sourceFile);
          if (content != null) {
            if (aRelativePath != null) {
              sourceFile = util.join(aRelativePath, sourceFile);
            }
            node.setSourceContent(sourceFile, content);
          }
        });
        return node;
        function addMappingWithCode(mapping, code) {
          if (mapping === null || mapping.source === void 0) {
            node.add(code);
          } else {
            const source = aRelativePath ? util.join(aRelativePath, mapping.source) : mapping.source;
            node.add(new SourceNode(
              mapping.originalLine,
              mapping.originalColumn,
              source,
              code,
              mapping.name
            ));
          }
        }
      }
      /**
       * Add a chunk of generated JS to this source node.
       *
       * @param aChunk A string snippet of generated JS code, another instance of
       *        SourceNode, or an array where each member is one of those things.
       */
      add(aChunk) {
        if (Array.isArray(aChunk)) {
          aChunk.forEach(function(chunk) {
            this.add(chunk);
          }, this);
        } else if (aChunk[isSourceNode] || typeof aChunk === "string") {
          if (aChunk) {
            this.children.push(aChunk);
          }
        } else {
          throw new TypeError(
            "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
          );
        }
        return this;
      }
      /**
       * Add a chunk of generated JS to the beginning of this source node.
       *
       * @param aChunk A string snippet of generated JS code, another instance of
       *        SourceNode, or an array where each member is one of those things.
       */
      prepend(aChunk) {
        if (Array.isArray(aChunk)) {
          for (let i = aChunk.length - 1; i >= 0; i--) {
            this.prepend(aChunk[i]);
          }
        } else if (aChunk[isSourceNode] || typeof aChunk === "string") {
          this.children.unshift(aChunk);
        } else {
          throw new TypeError(
            "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
          );
        }
        return this;
      }
      /**
       * Walk over the tree of JS snippets in this node and its children. The
       * walking function is called once for each snippet of JS and is passed that
       * snippet and the its original associated source's line/column location.
       *
       * @param aFn The traversal function.
       */
      walk(aFn) {
        let chunk;
        for (let i = 0, len = this.children.length; i < len; i++) {
          chunk = this.children[i];
          if (chunk[isSourceNode]) {
            chunk.walk(aFn);
          } else if (chunk !== "") {
            aFn(chunk, {
              source: this.source,
              line: this.line,
              column: this.column,
              name: this.name
            });
          }
        }
      }
      /**
       * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
       * each of `this.children`.
       *
       * @param aSep The separator.
       */
      join(aSep) {
        let newChildren;
        let i;
        const len = this.children.length;
        if (len > 0) {
          newChildren = [];
          for (i = 0; i < len - 1; i++) {
            newChildren.push(this.children[i]);
            newChildren.push(aSep);
          }
          newChildren.push(this.children[i]);
          this.children = newChildren;
        }
        return this;
      }
      /**
       * Call String.prototype.replace on the very right-most source snippet. Useful
       * for trimming whitespace from the end of a source node, etc.
       *
       * @param aPattern The pattern to replace.
       * @param aReplacement The thing to replace the pattern with.
       */
      replaceRight(aPattern, aReplacement) {
        const lastChild = this.children[this.children.length - 1];
        if (lastChild[isSourceNode]) {
          lastChild.replaceRight(aPattern, aReplacement);
        } else if (typeof lastChild === "string") {
          this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
        } else {
          this.children.push("".replace(aPattern, aReplacement));
        }
        return this;
      }
      /**
       * Set the source content for a source file. This will be added to the SourceMapGenerator
       * in the sourcesContent field.
       *
       * @param aSourceFile The filename of the source file
       * @param aSourceContent The content of the source file
       */
      setSourceContent(aSourceFile, aSourceContent) {
        this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
      }
      /**
       * Walk over the tree of SourceNodes. The walking function is called for each
       * source file content and is passed the filename and source content.
       *
       * @param aFn The traversal function.
       */
      walkSourceContents(aFn) {
        for (let i = 0, len = this.children.length; i < len; i++) {
          if (this.children[i][isSourceNode]) {
            this.children[i].walkSourceContents(aFn);
          }
        }
        const sources = Object.keys(this.sourceContents);
        for (let i = 0, len = sources.length; i < len; i++) {
          aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
        }
      }
      /**
       * Return the string representation of this source node. Walks over the tree
       * and concatenates all the various snippets together to one string.
       */
      toString() {
        let str = "";
        this.walk(function(chunk) {
          str += chunk;
        });
        return str;
      }
      /**
       * Returns the string representation of this source node along with a source
       * map.
       */
      toStringWithSourceMap(aArgs) {
        const generated = {
          code: "",
          line: 1,
          column: 0
        };
        const map = new SourceMapGenerator(aArgs);
        let sourceMappingActive = false;
        let lastOriginalSource = null;
        let lastOriginalLine = null;
        let lastOriginalColumn = null;
        let lastOriginalName = null;
        this.walk(function(chunk, original) {
          generated.code += chunk;
          if (original.source !== null && original.line !== null && original.column !== null) {
            if (lastOriginalSource !== original.source || lastOriginalLine !== original.line || lastOriginalColumn !== original.column || lastOriginalName !== original.name) {
              map.addMapping({
                source: original.source,
                original: {
                  line: original.line,
                  column: original.column
                },
                generated: {
                  line: generated.line,
                  column: generated.column
                },
                name: original.name
              });
            }
            lastOriginalSource = original.source;
            lastOriginalLine = original.line;
            lastOriginalColumn = original.column;
            lastOriginalName = original.name;
            sourceMappingActive = true;
          } else if (sourceMappingActive) {
            map.addMapping({
              generated: {
                line: generated.line,
                column: generated.column
              }
            });
            lastOriginalSource = null;
            sourceMappingActive = false;
          }
          for (let idx = 0, length = chunk.length; idx < length; idx++) {
            if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
              generated.line++;
              generated.column = 0;
              if (idx + 1 === length) {
                lastOriginalSource = null;
                sourceMappingActive = false;
              } else if (sourceMappingActive) {
                map.addMapping({
                  source: original.source,
                  original: {
                    line: original.line,
                    column: original.column
                  },
                  generated: {
                    line: generated.line,
                    column: generated.column
                  },
                  name: original.name
                });
              }
            } else {
              generated.column++;
            }
          }
        });
        this.walkSourceContents(function(sourceFile, sourceContent) {
          map.setSourceContent(sourceFile, sourceContent);
        });
        return { code: generated.code, map };
      }
    };
    exports.SourceNode = SourceNode;
  }
});

// node_modules/source-map/source-map.js
var require_source_map = __commonJS({
  "node_modules/source-map/source-map.js"(exports) {
    exports.SourceMapGenerator = require_source_map_generator().SourceMapGenerator;
    exports.SourceMapConsumer = require_source_map_consumer().SourceMapConsumer;
    exports.SourceNode = require_source_node().SourceNode;
  }
});

// node_modules/stylus/lib/visitor/sourcemapper.js
var require_sourcemapper = __commonJS({
  "node_modules/stylus/lib/visitor/sourcemapper.js"(exports, module2) {
    var Compiler = require_compiler();
    var Buffer2 = require("buffer").Buffer;
    var SourceMapGenerator = require_source_map().SourceMapGenerator;
    var basename = require("path").basename;
    var extname = require("path").extname;
    var dirname = require("path").dirname;
    var join = require("path").join;
    var relative = require("path").relative;
    var sep = require("path").sep;
    var fs = require("fs");
    var SourceMapper = module2.exports = function SourceMapper2(root, options) {
      options = options || {};
      this.column = 1;
      this.lineno = 1;
      this.contents = {};
      this.filename = options.filename;
      this.dest = options.dest;
      var sourcemap = options.sourcemap;
      this.basePath = sourcemap.basePath || ".";
      this.inline = sourcemap.inline;
      this.comment = sourcemap.comment;
      if (this.dest && extname(this.dest) === ".css") {
        this.basename = basename(this.dest);
        this.dest = dirname(this.dest);
      } else {
        this.basename = basename(this.filename, extname(this.filename)) + ".css";
      }
      this.utf8 = false;
      this.map = new SourceMapGenerator({
        file: this.basename,
        sourceRoot: sourcemap.sourceRoot || null
      });
      Compiler.call(this, root, options);
    };
    SourceMapper.prototype.__proto__ = Compiler.prototype;
    var compile = Compiler.prototype.compile;
    SourceMapper.prototype.compile = function() {
      var css2 = compile.call(this), out = this.basename + ".map", url = this.normalizePath(this.dest ? join(this.dest, out) : join(dirname(this.filename), out)), map;
      if (this.inline) {
        map = this.map.toString();
        url = "data:application/json;" + (this.utf8 ? "charset=utf-8;" : "") + "base64," + Buffer2.from(map).toString("base64");
      }
      if (this.inline || false !== this.comment)
        css2 += "/*# sourceMappingURL=" + url + " */";
      return css2;
    };
    SourceMapper.prototype.out = function(str, node) {
      if (node && node.lineno) {
        var filename = this.normalizePath(node.filename);
        this.map.addMapping({
          original: {
            line: node.lineno,
            column: node.column - 1
          },
          generated: {
            line: this.lineno,
            column: this.column - 1
          },
          source: filename
        });
        if (this.inline && !this.contents[filename]) {
          this.map.setSourceContent(filename, fs.readFileSync(node.filename, "utf-8"));
          this.contents[filename] = true;
        }
      }
      this.move(str);
      return str;
    };
    SourceMapper.prototype.move = function(str) {
      var lines = str.match(/\n/g), idx = str.lastIndexOf("\n");
      if (lines)
        this.lineno += lines.length;
      this.column = ~idx ? str.length - idx : this.column + str.length;
    };
    SourceMapper.prototype.normalizePath = function(path) {
      path = relative(this.dest || this.basePath, path);
      if ("\\" == sep) {
        path = path.replace(/^[a-z]:\\/i, "/").replace(/\\/g, "/");
      }
      return path;
    };
    var literal = Compiler.prototype.visitLiteral;
    SourceMapper.prototype.visitLiteral = function(lit) {
      var val = literal.call(this, lit), filename = this.normalizePath(lit.filename), indentsRe = /^\s+/, lines = val.split("\n");
      if (lines.length > 1) {
        lines.forEach(function(line, i) {
          var indents = line.match(indentsRe), column = indents && indents[0] ? indents[0].length : 0;
          if (lit.css)
            column += 2;
          this.map.addMapping({
            original: {
              line: lit.lineno + i,
              column
            },
            generated: {
              line: this.lineno + i,
              column: 0
            },
            source: filename
          });
        }, this);
      }
      return val;
    };
    var charset = Compiler.prototype.visitCharset;
    SourceMapper.prototype.visitCharset = function(node) {
      this.utf8 = "utf-8" == node.val.string.toLowerCase();
      return charset.call(this, node);
    };
  }
});

// node_modules/stylus/lib/visitor/deps-resolver.js
var require_deps_resolver = __commonJS({
  "node_modules/stylus/lib/visitor/deps-resolver.js"(exports, module2) {
    var Visitor = require_visitor();
    var Parser = require_parser();
    var nodes = require_nodes();
    var utils = require_utils();
    var dirname = require("path").dirname;
    var fs = require("fs");
    var DepsResolver = module2.exports = function DepsResolver2(root, options) {
      this.root = root;
      this.filename = options.filename;
      this.paths = options.paths || [];
      this.paths.push(dirname(options.filename || "."));
      this.options = options;
      this.functions = {};
      this.deps = [];
    };
    DepsResolver.prototype.__proto__ = Visitor.prototype;
    var visit = DepsResolver.prototype.visit;
    DepsResolver.prototype.visit = function(node) {
      switch (node.nodeName) {
        case "root":
        case "block":
        case "expression":
          this.visitRoot(node);
          break;
        case "group":
        case "media":
        case "atblock":
        case "atrule":
        case "keyframes":
        case "each":
        case "supports":
          this.visit(node.block);
          break;
        default:
          visit.call(this, node);
      }
    };
    DepsResolver.prototype.visitRoot = function(block) {
      for (var i = 0, len = block.nodes.length; i < len; ++i) {
        this.visit(block.nodes[i]);
      }
    };
    DepsResolver.prototype.visitIdent = function(ident) {
      this.visit(ident.val);
    };
    DepsResolver.prototype.visitIf = function(node) {
      this.visit(node.block);
      this.visit(node.cond);
      for (var i = 0, len = node.elses.length; i < len; ++i) {
        this.visit(node.elses[i]);
      }
    };
    DepsResolver.prototype.visitFunction = function(fn) {
      this.functions[fn.name] = fn.block;
    };
    DepsResolver.prototype.visitCall = function(call) {
      if (call.name in this.functions)
        this.visit(this.functions[call.name]);
      if (call.block)
        this.visit(call.block);
    };
    DepsResolver.prototype.visitImport = function(node) {
      if (node.path.first.name === "url")
        return;
      var path = !node.path.first.val.isNull && node.path.first.val || node.path.first.name, literal, found, oldPath;
      if (!path)
        return;
      literal = /\.css(?:"|$)/.test(path);
      if (!literal && !/\.styl$/i.test(path)) {
        oldPath = path;
        path += ".styl";
      }
      found = utils.find(path, this.paths, this.filename);
      if (!found && oldPath)
        found = utils.lookupIndex(oldPath, this.paths, this.filename);
      if (!found)
        return;
      this.deps = this.deps.concat(found);
      if (literal)
        return;
      for (var i = 0, len = found.length; i < len; ++i) {
        var file = found[i], dir = dirname(file), str = fs.readFileSync(file, "utf-8"), block = new nodes.Block(), parser = new Parser(str, utils.merge({ root: block }, this.options));
        if (!~this.paths.indexOf(dir))
          this.paths.push(dir);
        try {
          block = parser.parse();
        } catch (err) {
          err.filename = file;
          err.lineno = parser.lexer.lineno;
          err.column = parser.lexer.column;
          err.input = str;
          throw err;
        }
        this.visit(block);
      }
    };
    DepsResolver.prototype.resolve = function() {
      this.visit(this.root);
      return utils.uniq(this.deps);
    };
  }
});

// node_modules/stylus/lib/renderer.js
var require_renderer = __commonJS({
  "node_modules/stylus/lib/renderer.js"(exports, module2) {
    var Parser = require_parser();
    var EventEmitter = require("events").EventEmitter;
    var Evaluator = require_evaluator();
    var Normalizer = require_normalizer();
    var events = new EventEmitter();
    var utils = require_utils();
    var nodes = require_nodes();
    var join = require("path").join;
    module2.exports = Renderer;
    function Renderer(str, options) {
      options = options || {};
      options.globals = options.globals || {};
      options.functions = options.functions || {};
      options.use = options.use || [];
      options.use = Array.isArray(options.use) ? options.use : [options.use];
      options.imports = [join(__dirname, "functions/index.styl")].concat(options.imports || []);
      options.paths = options.paths || [];
      options.filename = options.filename || "stylus";
      options.Evaluator = options.Evaluator || Evaluator;
      this.options = options;
      this.str = str;
      this.events = events;
    }
    Renderer.prototype.__proto__ = EventEmitter.prototype;
    module2.exports.events = events;
    Renderer.prototype.render = function(fn) {
      var parser = this.parser = new Parser(this.str, this.options);
      for (var i = 0, len = this.options.use.length; i < len; i++) {
        this.use(this.options.use[i]);
      }
      try {
        nodes.filename = this.options.filename;
        var ast = parser.parse();
        this.evaluator = new this.options.Evaluator(ast, this.options);
        this.nodes = nodes;
        this.evaluator.renderer = this;
        ast = this.evaluator.evaluate();
        var normalizer = new Normalizer(ast, this.options);
        ast = normalizer.normalize();
        var compiler = this.options.sourcemap ? new (require_sourcemapper())(ast, this.options) : new (require_compiler())(ast, this.options), css2 = compiler.compile();
        if (this.options.sourcemap)
          this.sourcemap = compiler.map.toJSON();
      } catch (err) {
        var options = {};
        options.input = err.input || this.str;
        options.filename = err.filename || this.options.filename;
        options.lineno = err.lineno || parser.lexer.lineno;
        options.column = err.column || parser.lexer.column;
        if (!fn)
          throw utils.formatException(err, options);
        return fn(utils.formatException(err, options));
      }
      var listeners = this.listeners("end");
      if (fn)
        listeners.push(fn);
      for (var i = 0, len = listeners.length; i < len; i++) {
        var ret = listeners[i](null, css2);
        if (ret)
          css2 = ret;
      }
      if (!fn)
        return css2;
    };
    Renderer.prototype.deps = function(filename) {
      var opts = utils.merge({ cache: false }, this.options);
      if (filename)
        opts.filename = filename;
      var DepsResolver = require_deps_resolver(), parser = new Parser(this.str, opts);
      try {
        nodes.filename = opts.filename;
        var ast = parser.parse(), resolver = new DepsResolver(ast, opts);
        return resolver.resolve();
      } catch (err) {
        var options = {};
        options.input = err.input || this.str;
        options.filename = err.filename || opts.filename;
        options.lineno = err.lineno || parser.lexer.lineno;
        options.column = err.column || parser.lexer.column;
        throw utils.formatException(err, options);
      }
    };
    Renderer.prototype.set = function(key, val) {
      this.options[key] = val;
      return this;
    };
    Renderer.prototype.get = function(key) {
      return this.options[key];
    };
    Renderer.prototype.include = function(path) {
      this.options.paths.push(path);
      return this;
    };
    Renderer.prototype.use = function(fn) {
      fn.call(this, this);
      return this;
    };
    Renderer.prototype.define = function(name, fn, raw) {
      fn = utils.coerce(fn, raw);
      if (fn.nodeName) {
        this.options.globals[name] = fn;
        return this;
      }
      this.options.functions[name] = fn;
      if (void 0 != raw)
        fn.raw = raw;
      return this;
    };
    Renderer.prototype.import = function(file) {
      this.options.imports.push(file);
      return this;
    };
  }
});

// node_modules/stylus/package.json
var require_package = __commonJS({
  "node_modules/stylus/package.json"(exports, module2) {
    module2.exports = {
      name: "stylus",
      description: "Robust, expressive, and feature-rich CSS superset",
      version: "0.59.0",
      author: "TJ Holowaychuk <tj@vision-media.ca>",
      keywords: [
        "css",
        "parser",
        "style",
        "stylesheets",
        "jade",
        "language"
      ],
      repository: {
        type: "git",
        url: "git://github.com/stylus/stylus"
      },
      main: "./index.js",
      browserify: "./lib/browserify.js",
      engines: {
        node: "*"
      },
      bin: {
        stylus: "./bin/stylus"
      },
      scripts: {
        prepublish: "npm prune",
        test: "mocha test/ test/middleware/ --require chai --bail --check-leaks --reporter dot"
      },
      dependencies: {
        "@adobe/css-tools": "^4.0.1",
        debug: "^4.3.2",
        glob: "^7.1.6",
        sax: "~1.2.4",
        "source-map": "^0.7.3"
      },
      devDependencies: {
        chai: "^4.3.6",
        mocha: "^9.2.0"
      },
      bugs: {
        url: "https://github.com/stylus/stylus/issues"
      },
      homepage: "https://github.com/stylus/stylus",
      directories: {
        doc: "docs",
        example: "examples",
        test: "test"
      },
      license: "MIT",
      funding: "https://opencollective.com/stylus"
    };
  }
});

// node_modules/stylus/lib/middleware.js
var require_middleware = __commonJS({
  "node_modules/stylus/lib/middleware.js"(exports, module2) {
    var stylus2 = require_stylus();
    var fs = require("fs");
    var url = require("url");
    var dirname = require("path").dirname;
    var join = require("path").join;
    var sep = require("path").sep;
    var debug = require_src()("stylus:middleware");
    var mkdir = fs.mkdir;
    var imports = {};
    module2.exports = function(options) {
      options = options || {};
      if ("string" == typeof options) {
        options = { src: options };
      }
      var force = options.force;
      var src = options.src;
      if (!src)
        throw new Error('stylus.middleware() requires "src" directory');
      var dest = options.dest || src;
      options.compile = options.compile || function(str, path) {
        if (options.sourcemap) {
          if ("boolean" == typeof options.sourcemap)
            options.sourcemap = {};
          options.sourcemap.inline = true;
        }
        return stylus2(str).set("filename", path).set("compress", options.compress).set("firebug", options.firebug).set("linenos", options.linenos).set("sourcemap", options.sourcemap);
      };
      return function stylus3(req, res, next) {
        if ("GET" != req.method && "HEAD" != req.method)
          return next();
        var path = url.parse(req.url).pathname;
        if (/\.css$/.test(path)) {
          let error2 = function(err) {
            next("ENOENT" == err.code ? null : err);
          }, compile2 = function() {
            debug("read %s", cssPath);
            fs.readFile(stylusPath, "utf8", function(err, str) {
              if (err)
                return error2(err);
              var style = options.compile(str, stylusPath);
              var paths = style.options._imports = [];
              imports[stylusPath] = null;
              style.render(function(err2, css2) {
                if (err2)
                  return next(err2);
                debug("render %s", stylusPath);
                imports[stylusPath] = paths;
                mkdir(dirname(cssPath), { mode: parseInt("0700", 8), recursive: true }, function(err3) {
                  if (err3)
                    return error2(err3);
                  fs.writeFile(cssPath, css2, "utf8", next);
                });
              });
            });
          };
          var error = error2, compile = compile2;
          if (typeof dest == "string") {
            var overlap = compare(dest, path).length;
            if ("/" == path.charAt(0))
              overlap++;
            path = path.slice(overlap);
          }
          var cssPath, stylusPath;
          cssPath = typeof dest == "function" ? dest(path) : join(dest, path);
          stylusPath = typeof src == "function" ? src(path) : join(src, path.replace(".css", ".styl"));
          if (force)
            return compile2();
          if (!imports[stylusPath])
            return compile2();
          fs.stat(stylusPath, function(err, stylusStats) {
            if (err)
              return error2(err);
            fs.stat(cssPath, function(err2, cssStats) {
              if (err2) {
                if ("ENOENT" == err2.code) {
                  debug("not found %s", cssPath);
                  compile2();
                } else {
                  next(err2);
                }
              } else {
                if (stylusStats.mtime > cssStats.mtime) {
                  debug("modified %s", cssPath);
                  compile2();
                } else {
                  checkImports(stylusPath, function(changed) {
                    if (debug && changed.length) {
                      changed.forEach(function(path2) {
                        debug("modified import %s", path2);
                      });
                    }
                    changed.length ? compile2() : next();
                  });
                }
              }
            });
          });
        } else {
          next();
        }
      };
    };
    function checkImports(path, fn) {
      var nodes = imports[path];
      if (!nodes)
        return fn();
      if (!nodes.length)
        return fn();
      var pending = nodes.length, changed = [];
      nodes.forEach(function(imported) {
        fs.stat(imported.path, function(err, stat) {
          if (err || !imported.mtime || stat.mtime > imported.mtime) {
            changed.push(imported.path);
          }
          --pending || fn(changed);
        });
      });
    }
    function compare(pathA, pathB) {
      pathA = pathA.split(sep);
      pathB = pathB.split("/");
      if (!pathA[pathA.length - 1])
        pathA.pop();
      if (!pathB[0])
        pathB.shift();
      var overlap = [];
      while (pathA[pathA.length - 1] == pathB[0]) {
        overlap.push(pathA.pop());
        pathB.shift();
      }
      return overlap.join("/");
    }
  }
});

// node_modules/@adobe/css-tools/dist/cjs/cssTools.js
var require_cssTools = __commonJS({
  "node_modules/@adobe/css-tools/dist/cjs/cssTools.js"(exports, module2) {
    (() => {
      "use strict";
      var t = { 831: (t2, e2) => {
        Object.defineProperty(e2, "__esModule", { value: true });
        class s2 extends Error {
          constructor(t3, e3, s3, i, n) {
            super(t3 + ":" + s3 + ":" + i + ": " + e3), this.reason = e3, this.filename = t3, this.line = s3, this.column = i, this.source = n;
          }
        }
        e2.default = s2;
      }, 711: (t2, e2) => {
        Object.defineProperty(e2, "__esModule", { value: true }), e2.default = class {
          constructor(t3, e3, s2) {
            this.start = t3, this.end = e3, this.source = s2;
          }
        };
      }, 607: function(t2, e2, s2) {
        var i = this && this.__createBinding || (Object.create ? function(t3, e3, s3, i2) {
          void 0 === i2 && (i2 = s3);
          var n2 = Object.getOwnPropertyDescriptor(e3, s3);
          n2 && !("get" in n2 ? !e3.__esModule : n2.writable || n2.configurable) || (n2 = { enumerable: true, get: function() {
            return e3[s3];
          } }), Object.defineProperty(t3, i2, n2);
        } : function(t3, e3, s3, i2) {
          void 0 === i2 && (i2 = s3), t3[i2] = e3[s3];
        }), n = this && this.__exportStar || function(t3, e3) {
          for (var s3 in t3)
            "default" === s3 || Object.prototype.hasOwnProperty.call(e3, s3) || i(e3, t3, s3);
        };
        Object.defineProperty(e2, "__esModule", { value: true }), e2.stringify = e2.parse = void 0;
        var r = s2(654);
        Object.defineProperty(e2, "parse", { enumerable: true, get: function() {
          return r.default;
        } });
        var o = s2(373);
        Object.defineProperty(e2, "stringify", { enumerable: true, get: function() {
          return o.default;
        } }), n(s2(371), e2), n(s2(831), e2), n(s2(711), e2);
      }, 654: (t2, e2, s2) => {
        Object.defineProperty(e2, "__esModule", { value: true }), e2.parse = void 0;
        const i = s2(831), n = s2(711), r = s2(371), o = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;
        function c(t3) {
          return t3 ? t3.trim() : "";
        }
        function a(t3, e3) {
          const s3 = t3 && "string" == typeof t3.type, i2 = s3 ? t3 : e3;
          for (const e4 in t3) {
            const s4 = t3[e4];
            Array.isArray(s4) ? s4.forEach((t4) => {
              a(t4, i2);
            }) : s4 && "object" == typeof s4 && a(s4, i2);
          }
          return s3 && Object.defineProperty(t3, "parent", { configurable: true, writable: true, enumerable: false, value: e3 || null }), t3;
        }
        e2.parse = (t3, e3) => {
          e3 = e3 || {};
          let s3 = 1, u = 1;
          function m() {
            const t4 = { line: s3, column: u };
            return function(i2) {
              return i2.position = new n.default(t4, { line: s3, column: u }, (null == e3 ? void 0 : e3.source) || ""), g(), i2;
            };
          }
          const h = [];
          function p(n2) {
            const r2 = new i.default((null == e3 ? void 0 : e3.source) || "", n2, s3, u, t3);
            if (!(null == e3 ? void 0 : e3.silent))
              throw r2;
            h.push(r2);
          }
          function l() {
            return y(/^{\s*/);
          }
          function f() {
            return y(/^}/);
          }
          function d() {
            let e4;
            const s4 = [];
            for (g(), v(s4); t3.length && "}" !== t3.charAt(0) && (e4 = M() || P()); )
              e4 && (s4.push(e4), v(s4));
            return s4;
          }
          function y(e4) {
            const i2 = e4.exec(t3);
            if (!i2)
              return;
            const n2 = i2[0];
            return function(t4) {
              const e5 = t4.match(/\n/g);
              e5 && (s3 += e5.length);
              const i3 = t4.lastIndexOf("\n");
              u = ~i3 ? t4.length - i3 : u + t4.length;
            }(n2), t3 = t3.slice(n2.length), i2;
          }
          function g() {
            y(/^\s*/);
          }
          function v(t4) {
            let e4;
            for (t4 = t4 || []; e4 = C(); )
              e4 && t4.push(e4);
            return t4;
          }
          function C() {
            const e4 = m();
            if ("/" !== t3.charAt(0) || "*" !== t3.charAt(1))
              return;
            const s4 = y(/^\/\*[^]*?\*\//);
            return s4 ? e4({ type: r.CssTypes.comment, comment: s4[0].slice(2, -2) }) : p("End of comment missing");
          }
          function T() {
            const t4 = y(/^([^{]+)/);
            if (!t4)
              return;
            const e4 = c(t4[0]).replace(/\/\*[^]*?\*\//gm, "");
            return -1 === e4.indexOf(",") ? [e4] : e4.replace(/("|')(?:\\\1|.)*?\1|\(.*?\)/g, (t5) => t5.replace(/,/g, "\u200C")).split(",").map((t5) => c(t5.replace(/\u200C/g, ",")));
          }
          function V() {
            const t4 = m(), e4 = y(/^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/);
            if (!e4)
              return;
            const s4 = c(e4[0]);
            if (!y(/^:\s*/))
              return p("property missing ':'");
            const i2 = y(/^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/), n2 = t4({ type: r.CssTypes.declaration, property: s4.replace(o, ""), value: i2 ? c(i2[0]).replace(o, "") : "" });
            return y(/^[;\s]*/), n2;
          }
          function b() {
            const t4 = [];
            if (!l())
              return p("missing '{'");
            let e4;
            for (v(t4); e4 = V(); )
              e4 && (t4.push(e4), v(t4));
            return f() ? t4 : p("missing '}'");
          }
          function j() {
            let t4;
            const e4 = [], s4 = m();
            for (; t4 = y(/^((\d+\.\d+|\.\d+|\d+)%?|[a-z]+)\s*/); )
              e4.push(t4[1]), y(/^,\s*/);
            if (e4.length)
              return s4({ type: r.CssTypes.keyframe, values: e4, declarations: b() || [] });
          }
          const k = w("import"), _ = w("charset"), O = w("namespace");
          function w(t4) {
            const e4 = new RegExp("^@" + t4 + `\\s*((:?[^;'"]|"(?:\\\\"|[^"])*?"|'(?:\\\\'|[^'])*?')+);`);
            return function() {
              const s4 = m(), i2 = y(e4);
              if (!i2)
                return;
              const n2 = { type: t4 };
              return n2[t4] = i2[1].trim(), s4(n2);
            };
          }
          function M() {
            if ("@" === t3[0])
              return function() {
                const t4 = m(), e4 = y(/^@([-\w]+)?keyframes\s*/);
                if (!e4)
                  return;
                const s4 = e4[1], i2 = y(/^([-\w]+)\s*/);
                if (!i2)
                  return p("@keyframes missing name");
                const n2 = i2[1];
                if (!l())
                  return p("@keyframes missing '{'");
                let o2, c2 = v();
                for (; o2 = j(); )
                  c2.push(o2), c2 = c2.concat(v());
                return f() ? t4({ type: r.CssTypes.keyframes, name: n2, vendor: s4, keyframes: c2 }) : p("@keyframes missing '}'");
              }() || function() {
                const t4 = m(), e4 = y(/^@media *([^{]+)/);
                if (!e4)
                  return;
                const s4 = c(e4[1]);
                if (!l())
                  return p("@media missing '{'");
                const i2 = v().concat(d());
                return f() ? t4({ type: r.CssTypes.media, media: s4, rules: i2 }) : p("@media missing '}'");
              }() || function() {
                const t4 = m(), e4 = y(/^@custom-media\s+(--[^\s]+)\s*([^{;]+);/);
                if (e4)
                  return t4({ type: r.CssTypes.customMedia, name: c(e4[1]), media: c(e4[2]) });
              }() || function() {
                const t4 = m(), e4 = y(/^@supports *([^{]+)/);
                if (!e4)
                  return;
                const s4 = c(e4[1]);
                if (!l())
                  return p("@supports missing '{'");
                const i2 = v().concat(d());
                return f() ? t4({ type: r.CssTypes.supports, supports: s4, rules: i2 }) : p("@supports missing '}'");
              }() || k() || _() || O() || function() {
                const t4 = m(), e4 = y(/^@([-\w]+)?document *([^{]+)/);
                if (!e4)
                  return;
                const s4 = c(e4[1]), i2 = c(e4[2]);
                if (!l())
                  return p("@document missing '{'");
                const n2 = v().concat(d());
                return f() ? t4({ type: r.CssTypes.document, document: i2, vendor: s4, rules: n2 }) : p("@document missing '}'");
              }() || function() {
                const t4 = m();
                if (!y(/^@page */))
                  return;
                const e4 = T() || [];
                if (!l())
                  return p("@page missing '{'");
                let s4, i2 = v();
                for (; s4 = V(); )
                  i2.push(s4), i2 = i2.concat(v());
                return f() ? t4({ type: r.CssTypes.page, selectors: e4, declarations: i2 }) : p("@page missing '}'");
              }() || function() {
                const t4 = m();
                if (!y(/^@host\s*/))
                  return;
                if (!l())
                  return p("@host missing '{'");
                const e4 = v().concat(d());
                return f() ? t4({ type: r.CssTypes.host, rules: e4 }) : p("@host missing '}'");
              }() || function() {
                const t4 = m();
                if (!y(/^@font-face\s*/))
                  return;
                if (!l())
                  return p("@font-face missing '{'");
                let e4, s4 = v();
                for (; e4 = V(); )
                  s4.push(e4), s4 = s4.concat(v());
                return f() ? t4({ type: r.CssTypes.fontFace, declarations: s4 }) : p("@font-face missing '}'");
              }() || function() {
                const t4 = m(), e4 = y(/^@container *([^{]+)/);
                if (!e4)
                  return;
                const s4 = c(e4[1]);
                if (!l())
                  return p("@container missing '{'");
                const i2 = v().concat(d());
                return f() ? t4({ type: r.CssTypes.container, container: s4, rules: i2 }) : p("@container missing '}'");
              }() || function() {
                const t4 = m(), e4 = y(/^@layer *([^{;@]+)/);
                if (!e4)
                  return;
                const s4 = c(e4[1]);
                if (!l())
                  return y(/^[;\s]*/), t4({ type: r.CssTypes.layer, layer: s4 });
                const i2 = v().concat(d());
                return f() ? t4({ type: r.CssTypes.layer, layer: s4, rules: i2 }) : p("@layer missing '}'");
              }();
          }
          function P() {
            const t4 = m(), e4 = T();
            return e4 ? (v(), t4({ type: r.CssTypes.rule, selectors: e4, declarations: b() || [] })) : p("selector missing");
          }
          return a(function() {
            const t4 = d();
            return { type: r.CssTypes.stylesheet, stylesheet: { source: null == e3 ? void 0 : e3.source, rules: t4, parsingErrors: h } };
          }());
        }, e2.default = e2.parse;
      }, 854: (t2, e2, s2) => {
        Object.defineProperty(e2, "__esModule", { value: true });
        const i = s2(371);
        e2.default = class {
          constructor(t3) {
            this.level = 0, this.indentation = "  ", this.compress = false, "string" == typeof (null == t3 ? void 0 : t3.indent) && (this.indentation = null == t3 ? void 0 : t3.indent), (null == t3 ? void 0 : t3.compress) && (this.compress = true);
          }
          emit(t3, e3) {
            return t3;
          }
          indent(t3) {
            return this.level = this.level || 1, t3 ? (this.level += t3, "") : Array(this.level).join(this.indentation);
          }
          visit(t3) {
            switch (t3.type) {
              case i.CssTypes.stylesheet:
                return this.stylesheet(t3);
              case i.CssTypes.rule:
                return this.rule(t3);
              case i.CssTypes.declaration:
                return this.declaration(t3);
              case i.CssTypes.comment:
                return this.comment(t3);
              case i.CssTypes.container:
                return this.container(t3);
              case i.CssTypes.charset:
                return this.charset(t3);
              case i.CssTypes.document:
                return this.document(t3);
              case i.CssTypes.customMedia:
                return this.customMedia(t3);
              case i.CssTypes.fontFace:
                return this.fontFace(t3);
              case i.CssTypes.host:
                return this.host(t3);
              case i.CssTypes.import:
                return this.import(t3);
              case i.CssTypes.keyframes:
                return this.keyframes(t3);
              case i.CssTypes.keyframe:
                return this.keyframe(t3);
              case i.CssTypes.layer:
                return this.layer(t3);
              case i.CssTypes.media:
                return this.media(t3);
              case i.CssTypes.namespace:
                return this.namespace(t3);
              case i.CssTypes.page:
                return this.page(t3);
              case i.CssTypes.supports:
                return this.supports(t3);
            }
          }
          mapVisit(t3, e3) {
            let s3 = "";
            e3 = e3 || "";
            for (let i2 = 0, n = t3.length; i2 < n; i2++)
              s3 += this.visit(t3[i2]), e3 && i2 < n - 1 && (s3 += this.emit(e3));
            return s3;
          }
          compile(t3) {
            return this.compress ? t3.stylesheet.rules.map(this.visit, this).join("") : this.stylesheet(t3);
          }
          stylesheet(t3) {
            return this.mapVisit(t3.stylesheet.rules, "\n\n");
          }
          comment(t3) {
            return this.compress ? this.emit("", t3.position) : this.emit(this.indent() + "/*" + t3.comment + "*/", t3.position);
          }
          container(t3) {
            return this.compress ? this.emit("@container " + t3.container, t3.position) + this.emit("{") + this.mapVisit(t3.rules) + this.emit("}") : this.emit(this.indent() + "@container " + t3.container, t3.position) + this.emit(" {\n" + this.indent(1)) + this.mapVisit(t3.rules, "\n\n") + this.emit("\n" + this.indent(-1) + this.indent() + "}");
          }
          layer(t3) {
            return this.compress ? this.emit("@layer " + t3.layer, t3.position) + (t3.rules ? this.emit("{") + this.mapVisit(t3.rules) + this.emit("}") : ";") : this.emit(this.indent() + "@layer " + t3.layer, t3.position) + (t3.rules ? this.emit(" {\n" + this.indent(1)) + this.mapVisit(t3.rules, "\n\n") + this.emit("\n" + this.indent(-1) + this.indent() + "}") : ";");
          }
          import(t3) {
            return this.emit("@import " + t3.import + ";", t3.position);
          }
          media(t3) {
            return this.compress ? this.emit("@media " + t3.media, t3.position) + this.emit("{") + this.mapVisit(t3.rules) + this.emit("}") : this.emit(this.indent() + "@media " + t3.media, t3.position) + this.emit(" {\n" + this.indent(1)) + this.mapVisit(t3.rules, "\n\n") + this.emit("\n" + this.indent(-1) + this.indent() + "}");
          }
          document(t3) {
            const e3 = "@" + (t3.vendor || "") + "document " + t3.document;
            return this.compress ? this.emit(e3, t3.position) + this.emit("{") + this.mapVisit(t3.rules) + this.emit("}") : this.emit(e3, t3.position) + this.emit("  {\n" + this.indent(1)) + this.mapVisit(t3.rules, "\n\n") + this.emit(this.indent(-1) + "\n}");
          }
          charset(t3) {
            return this.emit("@charset " + t3.charset + ";", t3.position);
          }
          namespace(t3) {
            return this.emit("@namespace " + t3.namespace + ";", t3.position);
          }
          supports(t3) {
            return this.compress ? this.emit("@supports " + t3.supports, t3.position) + this.emit("{") + this.mapVisit(t3.rules) + this.emit("}") : this.emit(this.indent() + "@supports " + t3.supports, t3.position) + this.emit(" {\n" + this.indent(1)) + this.mapVisit(t3.rules, "\n\n") + this.emit("\n" + this.indent(-1) + this.indent() + "}");
          }
          keyframes(t3) {
            return this.compress ? this.emit("@" + (t3.vendor || "") + "keyframes " + t3.name, t3.position) + this.emit("{") + this.mapVisit(t3.keyframes) + this.emit("}") : this.emit("@" + (t3.vendor || "") + "keyframes " + t3.name, t3.position) + this.emit(" {\n" + this.indent(1)) + this.mapVisit(t3.keyframes, "\n") + this.emit(this.indent(-1) + "}");
          }
          keyframe(t3) {
            const e3 = t3.declarations;
            return this.compress ? this.emit(t3.values.join(","), t3.position) + this.emit("{") + this.mapVisit(e3) + this.emit("}") : this.emit(this.indent()) + this.emit(t3.values.join(", "), t3.position) + this.emit(" {\n" + this.indent(1)) + this.mapVisit(e3, "\n") + this.emit(this.indent(-1) + "\n" + this.indent() + "}\n");
          }
          page(t3) {
            if (this.compress) {
              const e4 = t3.selectors.length ? t3.selectors.join(", ") : "";
              return this.emit("@page " + e4, t3.position) + this.emit("{") + this.mapVisit(t3.declarations) + this.emit("}");
            }
            const e3 = t3.selectors.length ? t3.selectors.join(", ") + " " : "";
            return this.emit("@page " + e3, t3.position) + this.emit("{\n") + this.emit(this.indent(1)) + this.mapVisit(t3.declarations, "\n") + this.emit(this.indent(-1)) + this.emit("\n}");
          }
          fontFace(t3) {
            return this.compress ? this.emit("@font-face", t3.position) + this.emit("{") + this.mapVisit(t3.declarations) + this.emit("}") : this.emit("@font-face ", t3.position) + this.emit("{\n") + this.emit(this.indent(1)) + this.mapVisit(t3.declarations, "\n") + this.emit(this.indent(-1)) + this.emit("\n}");
          }
          host(t3) {
            return this.compress ? this.emit("@host", t3.position) + this.emit("{") + this.mapVisit(t3.rules) + this.emit("}") : this.emit("@host", t3.position) + this.emit(" {\n" + this.indent(1)) + this.mapVisit(t3.rules, "\n\n") + this.emit(this.indent(-1) + "\n}");
          }
          customMedia(t3) {
            return this.emit("@custom-media " + t3.name + " " + t3.media + ";", t3.position);
          }
          rule(t3) {
            const e3 = t3.declarations;
            if (!e3.length)
              return "";
            if (this.compress)
              return this.emit(t3.selectors.join(","), t3.position) + this.emit("{") + this.mapVisit(e3) + this.emit("}");
            const s3 = this.indent();
            return this.emit(t3.selectors.map((t4) => s3 + t4).join(",\n"), t3.position) + this.emit(" {\n") + this.emit(this.indent(1)) + this.mapVisit(e3, "\n") + this.emit(this.indent(-1)) + this.emit("\n" + this.indent() + "}");
          }
          declaration(t3) {
            return this.compress ? this.emit(t3.property + ":" + t3.value, t3.position) + this.emit(";") : this.emit(this.indent()) + this.emit(t3.property + ": " + t3.value, t3.position) + this.emit(";");
          }
        };
      }, 373: (t2, e2, s2) => {
        Object.defineProperty(e2, "__esModule", { value: true });
        const i = s2(854);
        e2.default = (t3, e3) => new i.default(e3 || {}).compile(t3);
      }, 371: (t2, e2) => {
        var s2;
        Object.defineProperty(e2, "__esModule", { value: true }), e2.CssTypes = void 0, (s2 = e2.CssTypes || (e2.CssTypes = {})).stylesheet = "stylesheet", s2.rule = "rule", s2.declaration = "declaration", s2.comment = "comment", s2.container = "container", s2.charset = "charset", s2.document = "document", s2.customMedia = "custom-media", s2.fontFace = "font-face", s2.host = "host", s2.import = "import", s2.keyframes = "keyframes", s2.keyframe = "keyframe", s2.layer = "layer", s2.media = "media", s2.namespace = "namespace", s2.page = "page", s2.supports = "supports";
      } }, e = {}, s = function s2(i) {
        var n = e[i];
        if (void 0 !== n)
          return n.exports;
        var r = e[i] = { exports: {} };
        return t[i].call(r.exports, r, r.exports, s2), r.exports;
      }(607);
      module2.exports = s;
    })();
  }
});

// node_modules/stylus/lib/convert/css.js
var require_css = __commonJS({
  "node_modules/stylus/lib/convert/css.js"(exports, module2) {
    module2.exports = function(css2) {
      return new Converter(css2).stylus();
    };
    function Converter(css2) {
      var { parse } = require_cssTools();
      this.css = css2;
      this.root = parse(css2, { position: false });
      this.indents = 0;
    }
    Converter.prototype.stylus = function() {
      return this.visitRules(this.root.stylesheet.rules);
    };
    Converter.prototype.__defineGetter__("indent", function() {
      return Array(this.indents + 1).join("  ");
    });
    Converter.prototype.visit = function(node) {
      switch (node.type) {
        case "rule":
        case "comment":
        case "charset":
        case "namespace":
        case "media":
        case "import":
        case "document":
        case "keyframes":
        case "page":
        case "host":
        case "supports":
          var name = node.type[0].toUpperCase() + node.type.slice(1);
          return this["visit" + name](node);
        case "font-face":
          return this.visitFontFace(node);
      }
    };
    Converter.prototype.visitRules = function(node) {
      var buf = "";
      for (var i = 0, len = node.length; i < len; ++i) {
        buf += this.visit(node[i]);
      }
      return buf;
    };
    Converter.prototype.visitFontFace = function(node) {
      var buf = this.indent + "@font-face";
      buf += "\n";
      ++this.indents;
      for (var i = 0, len = node.declarations.length; i < len; ++i) {
        buf += this.visitDeclaration(node.declarations[i]);
      }
      --this.indents;
      return buf;
    };
    Converter.prototype.visitMedia = function(node) {
      var buf = this.indent + "@media " + node.media;
      buf += "\n";
      ++this.indents;
      buf += this.visitRules(node.rules);
      --this.indents;
      return buf;
    };
    Converter.prototype.visitDeclaration = function(node) {
      if ("comment" == node.type) {
        return this.visitComment(node);
      } else {
        var buf = this.indent + node.property + ": " + node.value + "\n";
        return buf;
      }
    };
    Converter.prototype.visitRule = function(node) {
      var buf = this.indent + node.selectors.join(",\n" + this.indent) + "\n";
      ++this.indents;
      for (var i = 0, len = node.declarations.length; i < len; ++i) {
        buf += this.visitDeclaration(node.declarations[i]);
      }
      --this.indents;
      return buf + "\n";
    };
    Converter.prototype.visitComment = function(node) {
      var buf = this.indent + "/*" + node.comment + "*/";
      return buf + "\n";
    };
    Converter.prototype.visitCharset = function(node) {
      var buf = this.indent + "@charset " + node.charset;
      return buf + "\n";
    };
    Converter.prototype.visitNamespace = function(node) {
      var buf = this.indent + "@namespace " + node.namespace;
      return buf + "\n";
    };
    Converter.prototype.visitImport = function(node) {
      var buf = this.indent + "@import " + node.import;
      return buf + "\n";
    };
    Converter.prototype.visitDocument = function(node) {
      var buf = this.indent + "@" + node.vendor + "document " + node.document;
      buf += "\n";
      ++this.indents;
      buf += this.visitRules(node.rules);
      --this.indents;
      return buf;
    };
    Converter.prototype.visitKeyframes = function(node) {
      var buf = this.indent + "@keyframes " + node.name;
      buf += "\n";
      ++this.indents;
      for (var i = 0, len = node.keyframes.length; i < len; ++i) {
        buf += this.visitKeyframe(node.keyframes[i]);
      }
      --this.indents;
      return buf;
    };
    Converter.prototype.visitKeyframe = function(node) {
      var buf = this.indent + node.values.join(", ");
      buf += "\n";
      ++this.indents;
      for (var i = 0, len = node.declarations.length; i < len; ++i) {
        buf += this.visitDeclaration(node.declarations[i]);
      }
      --this.indents;
      return buf;
    };
    Converter.prototype.visitPage = function(node) {
      var buf = this.indent + "@page" + (node.selectors.length ? " " + node.selectors.join(", ") : "");
      buf += "\n";
      ++this.indents;
      for (var i = 0, len = node.declarations.length; i < len; ++i) {
        buf += this.visitDeclaration(node.declarations[i]);
      }
      --this.indents;
      return buf;
    };
    Converter.prototype.visitSupports = function(node) {
      var buf = this.indent + "@supports " + node.supports;
      buf += "\n";
      ++this.indents;
      buf += this.visitRules(node.rules);
      --this.indents;
      return buf;
    };
    Converter.prototype.visitHost = function(node) {
      var buf = this.indent + "@host";
      buf += "\n";
      ++this.indents;
      buf += this.visitRules(node.rules);
      --this.indents;
      return buf;
    };
  }
});

// node_modules/stylus/lib/functions/resolver.js
var require_resolver = __commonJS({
  "node_modules/stylus/lib/functions/resolver.js"(exports, module2) {
    var Compiler = require_compiler();
    var nodes = require_nodes();
    var parse = require("url").parse;
    var relative = require("path").relative;
    var join = require("path").join;
    var dirname = require("path").dirname;
    var extname = require("path").extname;
    var sep = require("path").sep;
    module2.exports = function(options) {
      options = options || {};
      function resolver(url) {
        var compiler = new Compiler(url), filename = url.filename;
        compiler.isURL = true;
        url = parse(url.nodes.map(function(node) {
          return compiler.visit(node);
        }).join(""));
        var literal = new nodes.Literal('url("' + url.href + '")'), path = url.pathname, dest = this.options.dest, tail = "", res;
        if (url.protocol || !path || "/" == path[0])
          return literal;
        if (!options.nocheck) {
          var _paths = options.paths || [];
          path = require_utils().lookup(path, _paths.concat(this.paths));
          if (!path)
            return literal;
        }
        if (this.includeCSS && extname(path) == ".css")
          return new nodes.Literal(url.href);
        if (url.search)
          tail += url.search;
        if (url.hash)
          tail += url.hash;
        if (dest && extname(dest) == ".css")
          dest = dirname(dest);
        res = relative(dest || dirname(this.filename), options.nocheck ? join(dirname(filename), path) : path) + tail;
        if ("\\" == sep)
          res = res.replace(/\\/g, "/");
        return new nodes.Literal('url("' + res + '")');
      }
      ;
      resolver.options = options;
      resolver.raw = true;
      return resolver;
    };
  }
});

// node_modules/stylus/lib/stylus.js
var require_stylus = __commonJS({
  "node_modules/stylus/lib/stylus.js"(exports, module2) {
    var Renderer = require_renderer();
    var nodes = require_nodes();
    var utils = require_utils();
    exports = module2.exports = render;
    exports.version = require_package().version;
    exports.nodes = nodes;
    exports.functions = require_functions();
    exports.utils = require_utils();
    exports.middleware = require_middleware();
    exports.Visitor = require_visitor();
    exports.Parser = require_parser();
    exports.Evaluator = require_evaluator();
    exports.Normalizer = require_normalizer();
    exports.Compiler = require_compiler();
    exports.convertCSS = require_css();
    exports.render = function(str, options, fn) {
      if ("function" == typeof options)
        fn = options, options = {};
      return new Renderer(str, options).render(fn);
    };
    function render(str, options) {
      return new Renderer(str, options);
    }
    exports.url = require_url();
    exports.resolver = require_resolver();
  }
});

// node_modules/stylus/index.js
var require_stylus2 = __commonJS({
  "node_modules/stylus/index.js"(exports, module2) {
    module2.exports = require_stylus();
  }
});

// main.js
var stylus = require_stylus2();
var css = stylus(`html
  color red`).render();
console.log(css);
/*! Bundled license information:

stylus/lib/token.js:
  (*!
   * Stylus - Token
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/visitor/index.js:
  (*!
   * Stylus - Visitor
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/units.js:
  (*!
   * Stylus - units
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/stack/index.js:
  (*!
   * Stylus - Stack
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/stack/scope.js:
  (*!
   * Stylus - stack - Scope
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/stack/frame.js:
  (*!
   * Stylus - stack - Frame
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/selector-parser.js:
  (*!
   * Stylus - Selector Parser
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/utils.js:
  (*!
   * Stylus - utils
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

sax/lib/sax.js:
  (*! http://mths.be/fromcodepoint v0.1.0 by @mathias *)

stylus/lib/functions/image.js:
  (*!
   * Stylus - plugin - url
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/visitor/compiler.js:
  (*!
   * Stylus - Compiler
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/visitor/normalizer.js:
  (*!
   * Stylus - Normalizer
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/functions/index.js:
  (*!
   * Stylus - Evaluator - built-in functions
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/colors.js:
  (*!
   * Stylus - colors
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/functions/url.js:
  (*!
   * Stylus - plugin - url
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/visitor/evaluator.js:
  (*!
   * Stylus - Evaluator
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/nodes/node.js:
  (*!
   * Stylus - Node
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/nodes/root.js:
  (*!
   * Stylus - Root
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/nodes/null.js:
  (*!
   * Stylus - Null
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/nodes/each.js:
  (*!
   * Stylus - Each
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/nodes/if.js:
  (*!
   * Stylus - If
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/nodes/call.js:
  (*!
   * Stylus - Call
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/nodes/unaryop.js:
  (*!
   * Stylus - UnaryOp
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/nodes/binop.js:
  (*!
   * Stylus - BinOp
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/nodes/ternary.js:
  (*!
   * Stylus - Ternary
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/nodes/block.js:
  (*!
   * Stylus - Block
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/nodes/unit.js:
  (*!
   * Stylus - Unit
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/nodes/string.js:
  (*!
   * Stylus - String
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/nodes/hsla.js:
  (*!
   * Stylus - HSLA
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/nodes/rgba.js:
  (*!
   * Stylus - RGBA
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/nodes/ident.js:
  (*!
   * Stylus - Ident
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/nodes/group.js:
  (*!
   * Stylus - Group
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/nodes/literal.js:
  (*!
   * Stylus - Literal
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/nodes/boolean.js:
  (*!
   * Stylus - Boolean
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/nodes/return.js:
  (*!
   * Stylus - Return
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/nodes/atrule.js:
  (*!
   * Stylus - at-rule
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/nodes/media.js:
  (*!
   * Stylus - Media
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/nodes/query-list.js:
  (*!
   * Stylus - QueryList
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/nodes/query.js:
  (*!
   * Stylus - Query
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/nodes/feature.js:
  (*!
   * Stylus - Feature
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/nodes/params.js:
  (*!
   * Stylus - Params
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/nodes/comment.js:
  (*!
   * Stylus - Comment
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/nodes/keyframes.js:
  (*!
   * Stylus - Keyframes
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/nodes/member.js:
  (*!
   * Stylus - Member
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/nodes/charset.js:
  (*!
   * Stylus - Charset
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/nodes/namespace.js:
  (*!
   * Stylus - Namespace
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/nodes/import.js:
  (*!
   * Stylus - Import
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/nodes/extend.js:
  (*!
   * Stylus - Extend
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/nodes/object.js:
  (*!
   * Stylus - Object
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/nodes/function.js:
  (*!
   * Stylus - Function
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/nodes/property.js:
  (*!
   * Stylus - Property
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/nodes/selector.js:
  (*!
   * Stylus - Selector
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/nodes/expression.js:
  (*!
   * Stylus - Expression
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/nodes/arguments.js:
  (*!
   * Stylus - Arguments
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/nodes/atblock.js:
  (*!
   * Stylus - @block
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/nodes/supports.js:
  (*!
   * Stylus - supports
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/nodes/index.js:
  (*!
   * Stylus - nodes
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/errors.js:
  (*!
   * Stylus - errors
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/lexer.js:
  (*!
   * Stylus - Lexer
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/parser.js:
  (*!
   * Stylus - Parser
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/visitor/sourcemapper.js:
  (*!
   * Stylus - SourceMapper
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/renderer.js:
  (*!
   * Stylus - Renderer
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/middleware.js:
  (*!
   * Stylus - middleware
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/convert/css.js:
  (*!
   * Stylus - CSS to Stylus conversion
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)

stylus/lib/stylus.js:
  (*!
   * Stylus
   * Copyright (c) Automattic <developer.wordpress.com>
   * MIT Licensed
   *)
*/
