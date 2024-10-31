module.exports =
(function () {
  'use strict'

  function peg$subclass (child, parent) {
    function C () { this.constructor = child }
    C.prototype = parent.prototype
    child.prototype = new C()
  }

  function peg$SyntaxError (message, expected, found, location) {
    const self = Error.call(this, message)
    // istanbul ignore next Check is a necessary evil to support older environments
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(self, peg$SyntaxError.prototype)
    }
    self.expected = expected
    self.found = found
    self.location = location
    self.name = 'SyntaxError'
    return self
  }

  peg$subclass(peg$SyntaxError, Error)

  function peg$padEnd (str, targetLength, padString) {
    padString = padString || ' '
    if (str.length > targetLength) { return str }
    targetLength -= str.length
    padString += padString.repeat(targetLength)
    return str + padString.slice(0, targetLength)
  }

  peg$SyntaxError.prototype.format = function (sources) {
    let str = 'Error: ' + this.message
    if (this.location) {
      let src = null
      let k
      for (k = 0; k < sources.length; k++) {
        if (sources[k].source === this.location.source) {
          src = sources[k].text.split(/\r\n|\n|\r/g)
          break
        }
      }
      const s = this.location.start
      const offset_s = (this.location.source && (typeof this.location.source.offset === 'function'))
        ? this.location.source.offset(s)
        : s
      const loc = this.location.source + ':' + offset_s.line + ':' + offset_s.column
      if (src) {
        const e = this.location.end
        const filler = peg$padEnd('', offset_s.line.toString().length, ' ')
        const line = src[s.line - 1]
        const last = s.line === e.line ? e.column : line.length + 1
        const hatLen = (last - s.column) || 1
        str += '\n --> ' + loc + '\n' +
          filler + ' |\n' +
          offset_s.line + ' | ' + line + '\n' +
          filler + ' | ' + peg$padEnd('', s.column - 1, ' ') +
          peg$padEnd('', hatLen, '^')
      } else {
        str += '\n at ' + loc
      }
    }
    return str
  }

  peg$SyntaxError.buildMessage = function (expected, found) {
    const DESCRIBE_EXPECTATION_FNS = {
      literal: function (expectation) {
        return '"' + literalEscape(expectation.text) + '"'
      },

      class: function (expectation) {
        const escapedParts = expectation.parts.map(function (part) {
          return Array.isArray(part)
            ? classEscape(part[0]) + '-' + classEscape(part[1])
            : classEscape(part)
        })

        return '[' + (expectation.inverted ? '^' : '') + escapedParts.join('') + ']'
      },

      any: function () {
        return 'any character'
      },

      end: function () {
        return 'end of input'
      },

      other: function (expectation) {
        return expectation.description
      },
    }

    function hex (ch) {
      return ch.charCodeAt(0).toString(16).toUpperCase()
    }

    function literalEscape (s) {
      return s
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\0/g, '\\0')
        .replace(/\t/g, '\\t')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/[\x00-\x0F]/g, function (ch) { return '\\x0' + hex(ch) })
        .replace(/[\x10-\x1F\x7F-\x9F]/g, function (ch) { return '\\x' + hex(ch) })
    }

    function classEscape (s) {
      return s
        .replace(/\\/g, '\\\\')
        .replace(/\]/g, '\\]')
        .replace(/\^/g, '\\^')
        .replace(/-/g, '\\-')
        .replace(/\0/g, '\\0')
        .replace(/\t/g, '\\t')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/[\x00-\x0F]/g, function (ch) { return '\\x0' + hex(ch) })
        .replace(/[\x10-\x1F\x7F-\x9F]/g, function (ch) { return '\\x' + hex(ch) })
    }

    function describeExpectation (expectation) {
      return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation)
    }

    function describeExpected (expected) {
      const descriptions = expected.map(describeExpectation)
      let i, j

      descriptions.sort()

      if (descriptions.length > 0) {
        for (i = 1, j = 1; i < descriptions.length; i++) {
          if (descriptions[i - 1] !== descriptions[i]) {
            descriptions[j] = descriptions[i]
            j++
          }
        }
        descriptions.length = j
      }

      switch (descriptions.length) {
        case 1:
          return descriptions[0]

        case 2:
          return descriptions[0] + ' or ' + descriptions[1]

        default:
          return descriptions.slice(0, -1).join(', ') +
          ', or ' +
          descriptions[descriptions.length - 1]
      }
    }

    function describeFound (found) {
      return found ? '"' + literalEscape(found) + '"' : 'end of input'
    }

    return 'Expected ' + describeExpected(expected) + ' but ' + describeFound(found) + ' found.'
  }

  function peg$parse (input, options) {
    options = options !== undefined ? options : {}

    const peg$FAILED = {}
    const peg$source = options.grammarSource

    const peg$startRuleFunctions = { Query: peg$parseQuery }
    let peg$startRuleFunction = peg$parseQuery

    const peg$c0 = 'or'
    const peg$c1 = 'and'
    const peg$c2 = '('
    const peg$c3 = ')'
    const peg$c4 = 'not'
    const peg$c5 = ':'
    const peg$c6 = ':(not'

    const peg$r0 = /^[A-Za-z0-9]/
    const peg$r1 = /^[p{Any}p{L}p{N}p{P}\0-\x7F]/
    const peg$r2 = /^[p{Z} \t\n\r]/

    const peg$e0 = peg$literalExpectation('OR', true)
    const peg$e1 = peg$literalExpectation('AND', true)
    const peg$e2 = peg$literalExpectation('(', false)
    const peg$e3 = peg$literalExpectation(')', false)
    const peg$e4 = peg$literalExpectation('NOT', true)
    const peg$e5 = peg$literalExpectation(':', false)
    const peg$e6 = peg$literalExpectation(':(NOT', true)
    const peg$e7 = peg$classExpectation([['A', 'Z'], ['a', 'z'], ['0', '9']], false, false)
    const peg$e8 = peg$classExpectation(['p', '{', 'A', 'n', 'y', '}', 'p', '{', 'L', '}', 'p', '{', 'N', '}', 'p', '{', 'P', '}', ['\0', '\x7F']], false, false)
    const peg$e9 = peg$otherExpectation('whitespace')
    const peg$e10 = peg$classExpectation(['p', '{', 'Z', '}', ' ', '\t', '\n', '\r'], false, false)

    const peg$f0 = function (expr) { return expr }
    const peg$f1 = function (expr) { return expr }
    const peg$f2 = function (head, tail) {
      return {
        op: 'or',
        exprs: [head, ...tail.map(t => t[3])],
      }
    }
    const peg$f3 = function (head, tail) {
      return {
        op: 'and',
        exprs: [head, ...tail.map(t => t[3])],
      }
    }
    const peg$f4 = function (expr) {
      return expr
    }
    const peg$f5 = function (not, value) {
      return {
        op: 'not',
        exprs: [{ value: [value] }],
      }
    }
    const peg$f6 = function (head, tail) {
      return [head, ...tail.map(t => t[3])]
    }
    const peg$f7 = function (key, value) {
      return {
        op: 'match',
        key,
        value: [value],
      }
    }
    const peg$f8 = function (key, value) {
      return {
        op: 'not',
        key,
        exprs: [{ value: [value] }],
      }
    }
    const peg$f9 = function (value) {
      return {
        value: [value],
      }
    }
    const peg$f10 = function () {
      return text()
    }
    const peg$f11 = function () {
      return text()
    }
    let peg$currPos = options.peg$currPos | 0
    let peg$savedPos = peg$currPos
    const peg$posDetailsCache = [{ line: 1, column: 1 }]
    let peg$maxFailPos = peg$currPos
    let peg$maxFailExpected = options.peg$maxFailExpected || []
    let peg$silentFails = options.peg$silentFails | 0

    let peg$result

    if (options.startRule) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + '".')
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule]
    }

    function text () {
      return input.substring(peg$savedPos, peg$currPos)
    }

    function offset () {
      return peg$savedPos
    }

    function range () {
      return {
        source: peg$source,
        start: peg$savedPos,
        end: peg$currPos,
      }
    }

    function location () {
      return peg$computeLocation(peg$savedPos, peg$currPos)
    }

    function expected (description, location) {
      location = location !== undefined
        ? location
        : peg$computeLocation(peg$savedPos, peg$currPos)

      throw peg$buildStructuredError(
        [peg$otherExpectation(description)],
        input.substring(peg$savedPos, peg$currPos),
        location,
      )
    }

    function error (message, location) {
      location = location !== undefined
        ? location
        : peg$computeLocation(peg$savedPos, peg$currPos)

      throw peg$buildSimpleError(message, location)
    }

    function peg$literalExpectation (text, ignoreCase) {
      return { type: 'literal', text, ignoreCase }
    }

    function peg$classExpectation (parts, inverted, ignoreCase) {
      return { type: 'class', parts, inverted, ignoreCase }
    }

    function peg$anyExpectation () {
      return { type: 'any' }
    }

    function peg$endExpectation () {
      return { type: 'end' }
    }

    function peg$otherExpectation (description) {
      return { type: 'other', description }
    }

    function peg$computePosDetails (pos) {
      let details = peg$posDetailsCache[pos]
      let p

      if (details) {
        return details
      } else {
        if (pos >= peg$posDetailsCache.length) {
          p = peg$posDetailsCache.length - 1
        } else {
          p = pos
          while (!peg$posDetailsCache[--p]) {}
        }

        details = peg$posDetailsCache[p]
        details = {
          line: details.line,
          column: details.column,
        }

        while (p < pos) {
          if (input.charCodeAt(p) === 10) {
            details.line++
            details.column = 1
          } else {
            details.column++
          }

          p++
        }

        peg$posDetailsCache[pos] = details

        return details
      }
    }

    function peg$computeLocation (startPos, endPos, offset) {
      const startPosDetails = peg$computePosDetails(startPos)
      const endPosDetails = peg$computePosDetails(endPos)

      const res = {
        source: peg$source,
        start: {
          offset: startPos,
          line: startPosDetails.line,
          column: startPosDetails.column,
        },
        end: {
          offset: endPos,
          line: endPosDetails.line,
          column: endPosDetails.column,
        },
      }
      if (offset && peg$source && (typeof peg$source.offset === 'function')) {
        res.start = peg$source.offset(res.start)
        res.end = peg$source.offset(res.end)
      }
      return res
    }

    function peg$fail (expected) {
      if (peg$currPos < peg$maxFailPos) { return }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos
        peg$maxFailExpected = []
      }

      peg$maxFailExpected.push(expected)
    }

    function peg$buildSimpleError (message, location) {
      return new peg$SyntaxError(message, null, null, location)
    }

    function peg$buildStructuredError (expected, found, location) {
      return new peg$SyntaxError(
        peg$SyntaxError.buildMessage(expected, found),
        expected,
        found,
        location,
      )
    }

    function peg$parseQuery () {
      let s0, s1, s2, s3

      s0 = peg$currPos
      s1 = peg$parseKeyExpr()
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0
        s1 = peg$f0(s1)
      }
      s0 = s1
      if (s0 === peg$FAILED) {
        s0 = peg$currPos
        s1 = peg$parse_()
        s2 = peg$parseOrExpr()
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_()
          peg$savedPos = s0
          s0 = peg$f1(s2)
        } else {
          peg$currPos = s0
          s0 = peg$FAILED
        }
      }

      return s0
    }

    function peg$parseOrExpr () {
      let s0, s1, s2, s3, s4, s5, s6, s7

      s0 = peg$currPos
      s1 = peg$parseAndExpr()
      if (s1 !== peg$FAILED) {
        s2 = []
        s3 = peg$currPos
        s4 = peg$parse_()
        s5 = input.substr(peg$currPos, 2)
        if (s5.toLowerCase() === peg$c0) {
          peg$currPos += 2
        } else {
          s5 = peg$FAILED
          if (peg$silentFails === 0) { peg$fail(peg$e0) }
        }
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_()
          s7 = peg$parseAndExpr()
          if (s7 !== peg$FAILED) {
            s4 = [s4, s5, s6, s7]
            s3 = s4
          } else {
            peg$currPos = s3
            s3 = peg$FAILED
          }
        } else {
          peg$currPos = s3
          s3 = peg$FAILED
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3)
          s3 = peg$currPos
          s4 = peg$parse_()
          s5 = input.substr(peg$currPos, 2)
          if (s5.toLowerCase() === peg$c0) {
            peg$currPos += 2
          } else {
            s5 = peg$FAILED
            if (peg$silentFails === 0) { peg$fail(peg$e0) }
          }
          if (s5 !== peg$FAILED) {
            s6 = peg$parse_()
            s7 = peg$parseAndExpr()
            if (s7 !== peg$FAILED) {
              s4 = [s4, s5, s6, s7]
              s3 = s4
            } else {
              peg$currPos = s3
              s3 = peg$FAILED
            }
          } else {
            peg$currPos = s3
            s3 = peg$FAILED
          }
        }
        peg$savedPos = s0
        s0 = peg$f2(s1, s2)
      } else {
        peg$currPos = s0
        s0 = peg$FAILED
      }

      return s0
    }

    function peg$parseAndExpr () {
      let s0, s1, s2, s3, s4, s5, s6, s7

      s0 = peg$currPos
      s1 = peg$parseBracketExpr()
      if (s1 !== peg$FAILED) {
        s2 = []
        s3 = peg$currPos
        s4 = peg$parse_()
        s5 = input.substr(peg$currPos, 3)
        if (s5.toLowerCase() === peg$c1) {
          peg$currPos += 3
        } else {
          s5 = peg$FAILED
          if (peg$silentFails === 0) { peg$fail(peg$e1) }
        }
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_()
          s7 = peg$parseBracketExpr()
          if (s7 !== peg$FAILED) {
            s4 = [s4, s5, s6, s7]
            s3 = s4
          } else {
            peg$currPos = s3
            s3 = peg$FAILED
          }
        } else {
          peg$currPos = s3
          s3 = peg$FAILED
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3)
          s3 = peg$currPos
          s4 = peg$parse_()
          s5 = input.substr(peg$currPos, 3)
          if (s5.toLowerCase() === peg$c1) {
            peg$currPos += 3
          } else {
            s5 = peg$FAILED
            if (peg$silentFails === 0) { peg$fail(peg$e1) }
          }
          if (s5 !== peg$FAILED) {
            s6 = peg$parse_()
            s7 = peg$parseBracketExpr()
            if (s7 !== peg$FAILED) {
              s4 = [s4, s5, s6, s7]
              s3 = s4
            } else {
              peg$currPos = s3
              s3 = peg$FAILED
            }
          } else {
            peg$currPos = s3
            s3 = peg$FAILED
          }
        }
        peg$savedPos = s0
        s0 = peg$f3(s1, s2)
      } else {
        peg$currPos = s0
        s0 = peg$FAILED
      }

      return s0
    }

    function peg$parseBracketExpr () {
      let s0, s1, s2, s3, s4, s5

      s0 = peg$currPos
      if (input.charCodeAt(peg$currPos) === 40) {
        s1 = peg$c2
        peg$currPos++
      } else {
        s1 = peg$FAILED
        if (peg$silentFails === 0) { peg$fail(peg$e2) }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_()
        s3 = peg$parseQuery()
        if (s3 !== peg$FAILED) {
          s4 = peg$parse_()
          if (input.charCodeAt(peg$currPos) === 41) {
            s5 = peg$c3
            peg$currPos++
          } else {
            s5 = peg$FAILED
            if (peg$silentFails === 0) { peg$fail(peg$e3) }
          }
          if (s5 !== peg$FAILED) {
            peg$savedPos = s0
            s0 = peg$f4(s3)
          } else {
            peg$currPos = s0
            s0 = peg$FAILED
          }
        } else {
          peg$currPos = s0
          s0 = peg$FAILED
        }
      } else {
        peg$currPos = s0
        s0 = peg$FAILED
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parseKeyExpr()
      }

      return s0
    }

    function peg$parseNotExpr () {
      let s0, s1, s2, s3

      s0 = peg$currPos
      s1 = input.substr(peg$currPos, 3)
      if (s1.toLowerCase() === peg$c4) {
        peg$currPos += 3
      } else {
        s1 = peg$FAILED
        if (peg$silentFails === 0) { peg$fail(peg$e4) }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_()
        s3 = peg$parseValue()
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0
          s0 = peg$f5(s1, s3)
        } else {
          peg$currPos = s0
          s0 = peg$FAILED
        }
      } else {
        peg$currPos = s0
        s0 = peg$FAILED
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parseKeyExpr()
      }

      return s0
    }

    function peg$parseOrValues () {
      let s0, s1, s2, s3, s4, s5, s6, s7

      s0 = peg$currPos
      s1 = peg$parseValue()
      if (s1 !== peg$FAILED) {
        s2 = []
        s3 = peg$currPos
        s4 = peg$parse_()
        s5 = input.substr(peg$currPos, 2)
        if (s5.toLowerCase() === peg$c0) {
          peg$currPos += 2
        } else {
          s5 = peg$FAILED
          if (peg$silentFails === 0) { peg$fail(peg$e0) }
        }
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_()
          s7 = peg$parseValue()
          if (s7 !== peg$FAILED) {
            s4 = [s4, s5, s6, s7]
            s3 = s4
          } else {
            peg$currPos = s3
            s3 = peg$FAILED
          }
        } else {
          peg$currPos = s3
          s3 = peg$FAILED
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3)
          s3 = peg$currPos
          s4 = peg$parse_()
          s5 = input.substr(peg$currPos, 2)
          if (s5.toLowerCase() === peg$c0) {
            peg$currPos += 2
          } else {
            s5 = peg$FAILED
            if (peg$silentFails === 0) { peg$fail(peg$e0) }
          }
          if (s5 !== peg$FAILED) {
            s6 = peg$parse_()
            s7 = peg$parseValue()
            if (s7 !== peg$FAILED) {
              s4 = [s4, s5, s6, s7]
              s3 = s4
            } else {
              peg$currPos = s3
              s3 = peg$FAILED
            }
          } else {
            peg$currPos = s3
            s3 = peg$FAILED
          }
        }
        peg$savedPos = s0
        s0 = peg$f6(s1, s2)
      } else {
        peg$currPos = s0
        s0 = peg$FAILED
      }

      return s0
    }

    function peg$parseKeyExpr () {
      let s0, s1, s2, s3, s4, s5, s6

      s0 = peg$currPos
      s1 = peg$parseKey()
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 58) {
          s2 = peg$c5
          peg$currPos++
        } else {
          s2 = peg$FAILED
          if (peg$silentFails === 0) { peg$fail(peg$e5) }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_()
          s4 = peg$parseValue()
          if (s4 !== peg$FAILED) {
            peg$savedPos = s0
            s0 = peg$f7(s1, s4)
          } else {
            peg$currPos = s0
            s0 = peg$FAILED
          }
        } else {
          peg$currPos = s0
          s0 = peg$FAILED
        }
      } else {
        peg$currPos = s0
        s0 = peg$FAILED
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos
        s1 = peg$parseKey()
        if (s1 !== peg$FAILED) {
          s2 = peg$parse_()
          s3 = input.substr(peg$currPos, 5)
          if (s3.toLowerCase() === peg$c6) {
            peg$currPos += 5
          } else {
            s3 = peg$FAILED
            if (peg$silentFails === 0) { peg$fail(peg$e6) }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_()
            s5 = peg$parseValue()
            if (s5 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 41) {
                s6 = peg$c3
                peg$currPos++
              } else {
                s6 = peg$FAILED
                if (peg$silentFails === 0) { peg$fail(peg$e3) }
              }
              if (s6 !== peg$FAILED) {
                peg$savedPos = s0
                s0 = peg$f8(s1, s5)
              } else {
                peg$currPos = s0
                s0 = peg$FAILED
              }
            } else {
              peg$currPos = s0
              s0 = peg$FAILED
            }
          } else {
            peg$currPos = s0
            s0 = peg$FAILED
          }
        } else {
          peg$currPos = s0
          s0 = peg$FAILED
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos
          s1 = peg$parseValue()
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0
            s1 = peg$f9(s1)
          }
          s0 = s1
        }
      }

      return s0
    }

    function peg$parseKey () {
      let s0, s1, s2

      s0 = peg$currPos
      s1 = []
      s2 = input.charAt(peg$currPos)
      if (peg$r0.test(s2)) {
        peg$currPos++
      } else {
        s2 = peg$FAILED
        if (peg$silentFails === 0) { peg$fail(peg$e7) }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2)
          s2 = input.charAt(peg$currPos)
          if (peg$r0.test(s2)) {
            peg$currPos++
          } else {
            s2 = peg$FAILED
            if (peg$silentFails === 0) { peg$fail(peg$e7) }
          }
        }
      } else {
        s1 = peg$FAILED
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0
        s1 = peg$f10()
      }
      s0 = s1

      return s0
    }

    function peg$parseValue () {
      let s0, s1, s2

      s0 = peg$currPos
      s1 = []
      s2 = input.charAt(peg$currPos)
      if (peg$r1.test(s2)) {
        peg$currPos++
      } else {
        s2 = peg$FAILED
        if (peg$silentFails === 0) { peg$fail(peg$e8) }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2)
          s2 = input.charAt(peg$currPos)
          if (peg$r1.test(s2)) {
            peg$currPos++
          } else {
            s2 = peg$FAILED
            if (peg$silentFails === 0) { peg$fail(peg$e8) }
          }
        }
      } else {
        s1 = peg$FAILED
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0
        s1 = peg$f11()
      }
      s0 = s1

      return s0
    }

    function peg$parse_ () {
      let s0, s1

      peg$silentFails++
      s0 = []
      s1 = input.charAt(peg$currPos)
      if (peg$r2.test(s1)) {
        peg$currPos++
      } else {
        s1 = peg$FAILED
        if (peg$silentFails === 0) { peg$fail(peg$e10) }
      }
      while (s1 !== peg$FAILED) {
        s0.push(s1)
        s1 = input.charAt(peg$currPos)
        if (peg$r2.test(s1)) {
          peg$currPos++
        } else {
          s1 = peg$FAILED
          if (peg$silentFails === 0) { peg$fail(peg$e10) }
        }
      }
      peg$silentFails--
      s1 = peg$FAILED
      if (peg$silentFails === 0) { peg$fail(peg$e9) }

      return s0
    }

    peg$result = peg$startRuleFunction()

    if (options.peg$library) {
      return /** @type {any} */ ({
        peg$result,
        peg$currPos,
        peg$FAILED,
        peg$maxFailExpected,
        peg$maxFailPos,
      })
    }
    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail(peg$endExpectation())
      }

      throw peg$buildStructuredError(
        peg$maxFailExpected,
        peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
        peg$maxFailPos < input.length
          ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
          : peg$computeLocation(peg$maxFailPos, peg$maxFailPos),
      )
    }
  }

  return {
    StartRules: ['Query'],
    SyntaxError: peg$SyntaxError,
    parse: peg$parse,
  }
})()
