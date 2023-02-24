/**
 * Content sections with html text and an image
 * @module Components/Sections/ContentSections
 * @mergeTarget
 */

/** HTML content for {@link ResearchContent} */
const ResearchContent = (
  <div>
    When I was in university, I worked on some <em>machine learning</em> research. While no longer my main focus I am
    still very interested in the usage of AI, particularly for artistic pursuits.
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
    大学時代、<em>機械学習</em>の研究に取り組みました。もはや私の主な焦点ではありませんが、私はまだ AI
    の使用、特に芸術的な追求に非常に興味があります
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
