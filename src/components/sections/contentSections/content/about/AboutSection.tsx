/**
 * Content sections with html text and an image
 * @module Components/Sections/ContentSections
 * @mergeTarget
 */

import { useLanguage } from 'stores/language';
import { ContentSectionLayout, ContentSectionProps } from 'components/sections/contentSections/ContentSectionLayout';
import { AboutContent, AboutContentJp } from './AboutContent';

/**
 * About section, uses {@link ContentSection} for it's layout
 * @param props
 * @returns
 */
function AboutSection({ index, parallax, alternateColor, alternatePosition }: ContentSectionProps) {
  // determine which language to use
  const isJapanese = useLanguage((state) => state.isJapanese);

  return (
    <ContentSectionLayout
      index={index}
      parallax={parallax}
      headerText={'about me'}
      backgroundText={'<main>'}
      headerTextJp={'私について'}
      imageUrl={'/assets/textures/self.ktx2'}
      alternateColor={alternateColor}
      alternatePosition={alternatePosition}
    >
      {isJapanese ? AboutContentJp : AboutContent}
    </ContentSectionLayout>
  );
}

export { AboutSection };
