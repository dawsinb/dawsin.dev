import { ContentSectionLayout, ContentSectionProps } from 'Components/sections/contentSections/ContentSectionLayout';
import { AboutContent } from 'Components/sections/contentSections/content/about/AboutContent';

function About({ index, parallax, alternateColor, alternatePosition }: ContentSectionProps) {
  return (
    <ContentSectionLayout
      index={index}
      parallax={parallax}
      headerText={'about me'}
      backgroundText={'<main>'}
      imageUrl={'/assets/images/self.jpg'}
      alternateColor={alternateColor}
      alternatePosition={alternatePosition}
    >
      {AboutContent}
    </ContentSectionLayout>
  );
}

export { About };
