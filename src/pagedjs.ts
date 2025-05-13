const pagedjsLocation = require.resolve('pagedjs')
const paths = pagedjsLocation.split('node_modules')
export const scriptPath = `${paths[0]}node_modules/pagedjs/dist/paged.polyfill.min.js`
