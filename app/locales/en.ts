export default {
  search: 'Search',
  pagination: {
    page: 'Page',
    of: 'of',
    Rows_per_page: 'Rows per page',
    next:'Next',
    previous:'Previous',
  },

  error: {
    404: { title: 'Page not found', desc: 'We couldn’t find the page you’re looking for.' },
    401: { title: 'You need to sign in', desc: 'This page requires authentication.' },
    403: { title: 'Access denied', desc: 'You don’t have permission to view this page.' },
    '4xx': { title: 'Something went wrong', desc: 'There was a problem with your request.' },
    '5xx': { title: 'Server error', desc: 'It’s not you—it’s us. Please try again in a moment.' },
    default: { title: 'Unexpected error', desc: 'An unexpected error occurred.' },
    actions: { home: 'Go home', clear: 'Clear errors' },
    debug: 'Debug details'
  }
}
