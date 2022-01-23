/**
 * Content sections with html text and an image
 * @module Components/Sections/ContentSections
 * @mergeTarget
 */

import { ContentSectionLayout, ContentSectionProps } from 'Components/sections/contentSections/ContentSectionLayout';
import { EuphonyContent } from 'Components/sections/contentSections/content/euphony/EuphonyContent';

/**
 * Euphony project section, uses {@link ContentSection} for it's layout
 * @param props
 * @returns
 */
function EuphonySection({ index, parallax, alternateColor, alternatePosition }: ContentSectionProps) {
  return (
    <ContentSectionLayout
      index={index}
      parallax={parallax}
      headerText={'euphony'}
      backgroundText={'<script>'}
      imageUrl={'/assets/textures/piano.ktx2'}
      alternateColor={alternateColor}
      alternatePosition={alternatePosition}
    >
      {EuphonyContent}
    </ContentSectionLayout>
  );
}

export { EuphonySection };
