import { ContentSectionLayout, ContentSectionProps } from 'Components/sections/contentSections/ContentSectionLayout';
import { AboutContent } from 'Components/sections/contentSections/content/about/AboutContent';

/**
 * About section, uses {@link ContentSection} for it's layout
 * @param props
 * @returns
 */
function About({ index, parallax, alternateColor, alternatePosition }: ContentSectionProps) {
  return (
    <ContentSectionLayout
      index={index}
      parallax={parallax}
      headerText={'about me'}
      backgroundText={'<main>'}
      imageUrl={'/assets/textures/self.ktx2'}
      alternateColor={alternateColor}
      alternatePosition={alternatePosition}
    >
      {AboutContent}
    </ContentSectionLayout>
  );
}

export { About };
