/**
 * Content sections with html text and an image
 * @module Components/Sections/ContentSections
 * @mergeTarget
 */

import { ContentSectionLayout, ContentSectionProps } from 'Components/sections/contentSections/ContentSectionLayout';
import { ResearchContent } from 'Components/sections/contentSections/content/research/ResearchContent';

/**
 * Research section, uses {@link ContentSection} for it's layout
 * @param props
 * @returns
 */
function ResearchSection({ index, parallax, alternateColor, alternatePosition }: ContentSectionProps) {
  return (
    <ContentSectionLayout
      index={index}
      parallax={parallax}
      headerText={'research'}
      backgroundText={'<data>'}
      imageUrl={'/assets/textures/building.ktx2'}
      alternateColor={alternateColor}
      alternatePosition={alternatePosition}
    >
      {ResearchContent}
    </ContentSectionLayout>
  );
}

export { ResearchSection };
