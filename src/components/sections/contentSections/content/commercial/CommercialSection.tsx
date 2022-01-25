/**
 * Content sections with html text and an image
 * @module Components/Sections/ContentSections
 * @mergeTarget
 */

import { ContentSectionLayout, ContentSectionProps } from 'Components/sections/contentSections/ContentSectionLayout';
import {
  CommercialContent,
  CommercialContentJp
} from 'Components/sections/contentSections/content/commercial/CommercialContent';
import { useLanguage } from 'Stores/language';

/**
 * Commercial work section, uses {@link ContentSection} for it's layout
 * @param props
 * @returns
 */
function CommercialSection({ index, parallax, alternateColor, alternatePosition }: ContentSectionProps) {
  // determine which language to use
  const isJapanese = useLanguage((state) => state.isJapanese);

  return (
    <ContentSectionLayout
      index={index}
      parallax={parallax}
      headerText={'commercial work'}
      headerTextJp={'商業作品'}
      backgroundText={'<body>'}
      imageUrl={'/assets/textures/tree.ktx2'}
      alternateColor={alternateColor}
      alternatePosition={alternatePosition}
    >
      {isJapanese ? CommercialContentJp : CommercialContent}
    </ContentSectionLayout>
  );
}

export { CommercialSection };
