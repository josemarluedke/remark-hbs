import { Plugin, Settings } from 'unified';

interface Options extends Settings {
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

declare namespace remarkHbs {
  interface Parse extends Plugin<[RemarkHbsOptions?]> {}

  type RemarkHbsOptions = Options;
}

declare const remarkHbs: remarkHbs.Parse;

export = remarkHbs;
