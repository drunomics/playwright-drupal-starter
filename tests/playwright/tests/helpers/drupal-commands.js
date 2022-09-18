function drush(command) {
    return require('child_process').execSync(`
        ${process.env.DOCKER_EXEC_CLI} 'drush ${command}'`);
}
module.exports = {
  /**
   * Finds node ID via drush and visits node edit page.
   * @param  {Array<{page: Page, node_title: String}>} array Page object and
   *   node title
   * @return {Response} The response.
   */
  visitNodeEditPage: async ([page, node_title]) => {
    const result = drush(`test:node-get-id "${node_title}"`);
    return await page.goto('/node/' + result.toString() + '/edit?destination=admin/content');
  },

  /**
   * Visits node path found by title via drush.
   * @param  {Array<{page: Page, node_title: String}>} array Page object and
   *   node title
   * @return {Response} The response.
   */
  visitNodeByTitle: async ([page, node_title]) => {
    const result = drush(`test:node-get-path "${node_title}"`);
    return await page.goto(result.toString());
  },


  /**
   * Visits node api with path alias found by title via drush.
   * @param  {Object[]} array Page object and node title
   * @return {Response} The response.
   */
  visitNodeAPIByTitle: async ([page, node_title]) => {
    const result = drush(`test:node-get-path-alias "${node_title}"`);
    return await page.goto(process.env.SITE_ADMIN_BASE_URL + '/api' + result.toString());
  },

  /**
   * Clones node with given title to a new node with new title.
   * @param  {Array<{page: Page, node_title: String, new_node_title: String}>}
   *   array Page object and node title
   * @return {Response} The response.
   */
  cloneNodeByTitle: async ([page, node_type, node_title, new_node_title]) => {
    return drush(`test:node-clone "${node_type}" "${node_title}" "${new_node_title}"`);
  },

  /**
   * Removes content prefixed with given keyword.
   * @param  {String} keyword Keyword to find content by.
   */
  cleanUpContent: async (keyword) => {
    drush(`test:testsCleanUp "${keyword}"`);
  },
  drush
}