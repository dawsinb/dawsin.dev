/**
 * Content sections with html text and an image
 * @module Components/Sections/ContentSections
 * @mergeTarget
 */

/** HTML content for {@link EuphonySection} */
const EuphonyContent = (
  <div>
    Euphony is an open source library I made that streamlines audio playback and analysis. If you are interested check
    out the project on{' '}
    <a href="https://github.com/dawsinb/euphony" target="_blank" rel="noopener noreferrer">
      Github
    </a>{' '}
    or{' '}
    <a href="https://www.npmjs.com/package/@ninefour/euphony" target="_blank" rel="noopener noreferrer">
      NPM
    </a>
    .
    <br />
    <br />
    Currently, I am working on a rewrite of the library in <em>Rust</em>, and extending functionality to encode
    abritrary events to execute in line with audio playback.
    <br />
    <br />
    To see an example of euphony in action scroll down and listen to some of my music with a visualizer powered by
    euphony.
  </div>
);
/** Japanese translation of HTML content for {@link EuphonyContent} */
const EuphonyContentJp = (
  <div>
    Euphonyは、オーディオの再生と分析を円滑にするために私が作成したオープンソースライブラリです。興味があれば、
    <a href="https://github.com/dawsinb/euphony" target="_blank" rel="noopener noreferrer">
      Github
    </a>
    と
    <a href="https://www.npmjs.com/package/@ninefour/euphony" target="_blank" rel="noopener noreferrer">
      NPM
    </a>
    でプロジェクトを見てください。
    <br />
    <br />
    現在、<em>Rust</em>でライブラリを書き直し、機能を拡張してイベントをエンコードする作業を行っています。
    <br />
    <br />
    Euphonyの使用例を見るために次のセクションにスクロールダウンして私の音楽を聴いて。
  </div>
);

export { EuphonyContent, EuphonyContentJp };
