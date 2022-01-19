import { ContentSectionLayout, ContentSectionProps } from 'Components/sections/contentSections/ContentSectionLayout';
import { AboutContent } from 'Components/sections/contentSections/content/about/AboutContent';

/**
 * Commercial work section, uses {@link ContentSection} for it's layout
 * @param props
 * @returns
 */
function CommercialSection({ index, parallax, alternateColor, alternatePosition }: ContentSectionProps) {
  return (
    <ContentSectionLayout
      index={index}
      parallax={parallax}
      headerText={'commercial work'}
      backgroundText={'<body>'}
      imageUrl={'/assets/textures/tree.ktx2'}
      alternateColor={alternateColor}
      alternatePosition={alternatePosition}
    >
      {AboutContent}
    </ContentSectionLayout>
  );
}

export { CommercialSection };
