/**
 * Content sections with html text and an image
 * @module Components/Sections/ContentSections
 * @mergeTarget
 */

import { ContentSectionLayout, ContentSectionProps } from 'Components/sections/contentSections/ContentSectionLayout';
import {
  ResearchContent,
  ResearchContentJp
} from 'Components/sections/contentSections/content/research/ResearchContent';
import { useLanguage } from 'Stores/language';

/**
 * Research section, uses {@link ContentSection} for it's layout
 * @param props
 * @returns
 */
function ResearchSection({ index, parallax, alternateColor, alternatePosition }: ContentSectionProps) {
  // determine which language to use
  const isJapanese = useLanguage((state) => state.isJapanese);

  return (
    <ContentSectionLayout
      index={index}
      parallax={parallax}
      headerText={'research'}
      headerTextJp={'リサーチ'}
      backgroundText={'<data>'}
      imageUrl={'/assets/textures/building.ktx2'}
      alternateColor={alternateColor}
      alternatePosition={alternatePosition}
    >
      {isJapanese ? ResearchContentJp : ResearchContent}
    </ContentSectionLayout>
  );
}

export { ResearchSection };
