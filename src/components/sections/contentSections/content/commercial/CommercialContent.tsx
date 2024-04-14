/**
 * Content sections with html text and an image
 * @module Components/Sections/ContentSections
 * @mergeTarget
 */

/** HTML content for {@link CommercialSection} */
const CommercialContent = (
  <div>
    I am a professional software engineer with over six years of experience and an expert in Rust and React.
    {" I've "}worked in everything from frontend, backend, devops, machine learning, and more.
    <br />
    <br />
    {"I'm "}open to freelance work at the moment, if you are interested then contact me at{' '}
    <a href="mailto:dawsinb@gmail.com" target="_blank" rel="noopener noreferrer">
      dawsinb@gmail.com
    </a>{' '}
    if {"you'd"} like to connect.
    <br />
    <br />
    Unfortunately much of my previous work is private, but the{' '}
    <a href="https://github.com/dawsinb/dawsin.dev" target="_blank" rel="noopener noreferrer">
      code
    </a>{' '}
    for this site is open source and I have a few examples in the section below.
  </div>
);
/** Japanese translation of HTML content for {@link CommercialSection} */
const CommercialContentJp = (
  <div>
    私は 6 年以上の経験を持つプロのソフトウェア エンジニアであり、Rust と React の専門家です。フロントエンドやバックエンドやDevOpsや機械学習に携わっていました。
    <br />
    <br />
    今フリーランスの仕事をすることができます、接続したいなら、
    <a href="mailto:dawsinb@gmail.com" target="_blank" rel="noopener noreferrer">
      dawsinb@gmail.com
    </a>
    までご連絡ください。
    <br />
    <br />
    残念ながら、私の以前の仕事の多くはプライベートです。でもこのサイトの
    <a href="https://github.com/dawsinb/dawsin.dev" target="_blank" rel="noopener noreferrer">
      コード
    </a>
    はオープンサースであり、以下のセクションに例がいくつかあります。
  </div>
);

export { CommercialContent, CommercialContentJp };
