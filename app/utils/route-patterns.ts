// utils/route-patterns.ts
export const escape = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Options for pattern -> regex conversion */
export interface PatternOptions {
  exact?: boolean
  caseInsensitive?: boolean
}

/**
 * Convert a single pattern like:
 *  - "product-details/:id/details/:category"
 *  - "/news"
 *  - ":id(\\d+)" (custom regex in parens)
 *
 * options:
 *  - exact: true -> match exactly (no extra segments)
 *  - caseInsensitive: true -> i flag
 */
export function patternToRegex(pattern: string = '', opts: PatternOptions = {}): RegExp {
  const { exact = false, caseInsensitive = false } = opts

  // remove leading slash if any, then split into segments
  const parts = pattern.replace(/^\//, '').split('/')

  const regexParts = parts.map((seg) => {
    if (!seg) return '' // ignore empty segs (consecutive slashes)
    if (seg[0] !== ':') {
      return escape(seg)
    }
    // param segment: support custom regex inside parentheses, e.g. :id(\d+)
    const m = seg.match(/^:([^()]+)(?:\((.+)\))?$/)
    if (!m) return '([^/]+)'
    const custom = m[2]
    return custom ? `(${custom})` : '([^/]+)'
  })

  const end = exact ? '/?$' : '(?:/|$)'
  const flags = caseInsensitive ? 'i' : ''
  return new RegExp('^/' + regexParts.join('/') + end, flags)
}

/** result element for patternsToRegexes */
export type PatternRegexPair = { pattern: string; regex: RegExp }

/**
 * Convert array of patterns to regex list (keeps original pattern next to regex)
 */
export function patternsToRegexes(
  patterns: string[] = [],
  opts: PatternOptions = {}
): PatternRegexPair[] {
  return patterns.map((p) => ({ pattern: p, regex: patternToRegex(p, opts) }))
}

/** Match result shape */
export type MatchResult = {
  matched: boolean
  pattern: string | null
  regex: RegExp | null
  groups: string[]
}

/**
 * Test a path against patterns.
 * Returns { matched: boolean, pattern, regex, groups } — groups is array of capture groups if matched.
 */
export function matchPattern(
  path: string,
  patterns: string[] = [],
  opts: PatternOptions = {}
): MatchResult {
  const list = patternsToRegexes(patterns, opts)
  for (const { pattern, regex } of list) {
    const m = regex.exec(path)
    if (m) {
      // groups: all captured groups excluding full match
      const groups = m.slice(1)
      return { matched: true, pattern, regex, groups }
    }
  }
  return { matched: false, pattern: null, regex: null, groups: [] }
}
