/**
 * Content sections with html text and an image
 * @module Components/Sections/ContentSections
 * @mergeTarget
 */

/** HTML content for {@link AboutSection} */
const AboutContent = (
  <div>
    Hello, as you may have guessed from the name of the site, my name is <em>Dawsin</em>. I'm a programmer and
    self-proclaimed Rust evangalist.
    <br />
    <br />I also love <em>music</em>. I play piano and make some music of my own. In my free time I've been working on a
    project called Euphony to help streamline the creation of dynamic audio visualizers.
    <br />
    <br />
    Currently, I work as a Rust platform engineer and live on the east coast of the US.
  </div>
);
/** Japanese translation of HTML content for {@link AboutSection} */
const AboutContentJp = (
  <div>
    こんにちは、サイトの題名から察したかもしりませんが、私の名前は<em>ドシン</em>
    です。私はプログラムと自称のRustエバンガリストです
    <br />
    <br />
    <em>音楽</em>
    も大好きです。ピアノを引いていくつかの音楽を作ります。暇な時に、動的なオーディオビジュアライザの作成を円滑にするためにeuphonyと言うプロジェクトに取り組んでいました。
    <br />
    <br />
    現在、私は Rust プラットフォーム エンジニアとして働いており、米国東海岸に住んでいます。
  </div>
);

export { AboutContent, AboutContentJp };
