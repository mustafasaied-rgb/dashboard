export default {
  search: 'Search',
  browse: 'browse',
  searchOrTypeCommand: 'Search or type command...',
  home: 'Home',
  pagination: {
    page: 'Page',
    of: 'of',
    Rows_per_page: 'Rows per page',
    next: 'Next',
    previous: 'Previous'
  },
  validation: {
    required: 'This field is required',
    email: 'Enter a valid email',
    minLength: 'Must be at least {n} characters',
    maxLength: 'Must be at most {n} characters',
    pattern: 'Invalid format',
    phoneDigits: 'Enter a valid phone number',
    asyncUnique: 'Already taken',
    maxFiles: 'You can upload up to {limit} file(s)',
    maxFileSize: 'Each file must be under {limitMB} MB'
  },
  formElements: {
    pageTitle: 'Form Elements',
    home: 'Home',
    passwordLabel: 'Password *',
    passwordPlaceholder: 'Enter your password',
    emailLable: 'Email',

    companySizeLabel: 'Company size *',
    companySizePlaceholder: '—',

    skillsLabel: 'Skills *',
    skillsPlaceholder: 'Select skills',

    attachmentsLabel: 'Attachments *',
    attachmentsPlaceholder: 'Attach supporting files',
    noFileChosen: 'No file chosen',
    chooseFile: 'Choose File',

    notificationsLabel: 'Notifications',

    copyTextLabel: 'CopyText',
    copy: 'Copy',

    startDateLabel: 'Start Date *',
    startDatePlaceholder: 'Select start date',

    endDateLabel: 'End Date',
    endDatePlaceholder: 'Select end date',

    meetingTimeLabel: 'Meeting Time',
    meetingTimePlaceholder: 'Select time',

    dateRangeLabel: 'Date Range',
    dateRangePlaceholder: 'Select date range',

    notesLabel: 'Notes',
    notesPlaceholder: 'Add any notes',

    eventPhotosLabel: 'Event Photos',
    dropzonePlaceholder: 'Drag & Drop files here',
    dropzoneHint: 'Drop PNG, JPG, WebP, SVG…',

    forgotPassword: 'Forgot password?',

    enabled: 'Enabled',
    disabled: 'Disabled',
    keepMeLoggedIn: 'Keep me logged in',

    eventPhotosLabel: 'Event Photos',
    dropzonePlaceholder: 'Drag & Drop files here',
    dropzoneHint: 'Drop PNG, JPG, WebP, SVG'
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
