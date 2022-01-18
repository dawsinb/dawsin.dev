import { ContentSectionLayout, ContentSectionProps } from 'Components/sections/contentSections/ContentSectionLayout';
import { AboutContent } from 'Components/sections/contentSections/content/about/AboutContent';

/**
 * Commercial work section, uses {@link ContentSection} for it's layout
 * @param props
 * @returns
 */
function Commercial({ index, parallax, alternateColor, alternatePosition }: ContentSectionProps) {
  return (
    <ContentSectionLayout
      index={index}
      parallax={parallax}
      headerText={'Commercial work'}
      backgroundText={'<body>'}
      imageUrl={'/assets/images/tree.jpg'}
      alternateColor={alternateColor}
      alternatePosition={alternatePosition}
    >
      {AboutContent}
    </ContentSectionLayout>
  );
}

export { Commercial };