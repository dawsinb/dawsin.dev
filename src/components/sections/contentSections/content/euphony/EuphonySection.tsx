/**
 * Content sections with html text and an image
 * @module Components/Sections/ContentSections
 * @mergeTarget
 */

import { ContentSectionLayout, ContentSectionProps } from 'Components/sections/contentSections/ContentSectionLayout';
import { EuphonyContent, EuphonyContentJp } from 'Components/sections/contentSections/content/euphony/EuphonyContent';
import { useLanguage } from 'stores/language';

/**
 * Euphony project section, uses {@link ContentSection} for it's layout
 * @param props
 * @returns
 */
function EuphonySection({ index, parallax, alternateColor, alternatePosition }: ContentSectionProps) {
  // determine which language to use
  const isJapanese = useLanguage((state) => state.isJapanese);

  return (
    <ContentSectionLayout
      index={index}
      parallax={parallax}
      headerText={'euphony'}
      headerTextJp={'ユーフォニー'}
      backgroundText={'<script>'}
      imageUrl={'/assets/textures/piano.ktx2'}
      alternateColor={alternateColor}
      alternatePosition={alternatePosition}
    >
      {isJapanese ? EuphonyContentJp : EuphonyContent}
    </ContentSectionLayout>
  );
}

export { EuphonySection };
