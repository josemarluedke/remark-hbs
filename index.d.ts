import type { Plugin, Settings } from 'unified';

/**
 * Extends unified's `Settings` so that the options object stays assignable
 * wherever a processor's settings are expected. `Settings` is a weak type in
 * unified 11 (`{[emptyObjectSymbol]?: never}`), so an unrelated interface would
 * be rejected with TS2559 at those call sites.
 */
export interface RemarkHbsOptions extends Settings {
  /**
   * If the plugin should escape curlies in code blocks
   * @default true
   */
  escapeCurliesCode?: boolean;

  /**
   * If the plugin should escape curlies in inline code blocks
   * @default true
   */
  escapeCurliesInlineCode?: boolean;
}

/**
 * Remark plugin that allows writing markdown with Ember handlebars templates.
 */
declare const remarkHbs: Plugin<[RemarkHbsOptions?]>;

export default remarkHbs;
