/**
 * Content sections with html text and an image
 * @module Components/Sections/ContentSections
 * @mergeTarget
 */

/** HTML content for {@link ResearchContent} */
const ResearchContent = (
  <div>
    When I was in university I originally planned on going into the field of <em>machine learning</em>
    . My focus has since shifted towards design, but I am still very interested in the usage of AI, particularly for
    artistic pursuits.
    <br />
    <br />
    Here are the links to the two papers I worked on if you are interested:
    <br />
    <br />-{' '}
    <a href="https://arxiv.org/abs/2006.12463" target="_blank" rel="noopener noreferrer">
      Slimming Neural Networks using Adaptive Connectivity Scores
    </a>
    <br />
    <br />-{' '}
    <a href="https://arxiv.org/abs/2006.12617" target="_blank" rel="noopener noreferrer">
      Adaptive County Level COVID-19 Forecast Models: Analysis and Improvement
    </a>
  </div>
);
/** Japanese translation of HTML content for {@link ResearchContent} */
const ResearchContentJp = (
  <div>
    大学時代で<em>機械学習</em>の分野に入る予定でした。それ以来、私の焦点はデザインにシフトしましたけど、
    特に芸術的な目的でまだAIに興味があります。
    <br />
    <br />
    興味があれば、私が取り組んだ論文のリンクをここにあります。
    <br />
    <br />-{' '}
    <a href="https://arxiv.org/abs/2006.12463" target="_blank" rel="noopener noreferrer">
      Slimming Neural Networks using Adaptive Connectivity Scores
    </a>
    <br />
    <br />-{' '}
    <a href="https://arxiv.org/abs/2006.12617" target="_blank" rel="noopener noreferrer">
      Adaptive County Level COVID-19 Forecast Models: Analysis and Improvement
    </a>
  </div>
);

export { ResearchContent, ResearchContentJp };
