/**
 * @module Components/Sections/ContentSections
 * @mergeTarget
 */

import { useMemo, useLayoutEffect, useRef, ReactNode, useEffect } from 'react';
import { TextureLoader, LinearFilter, Mesh, Group, Vector3 } from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { useThree, useLoader } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import styled from 'styled-components';
import { useFont } from 'Hooks/useFont';
import { useLayout } from 'Stores/layout';
import { useTheme } from 'Stores/theme';
import { Section, SectionItem } from 'Components/sections/Section';
import { DistortionImage } from 'Components/sections/contentSections/distortionImage/DistortionImage';

/** Props for {@link Content} */
interface ContentProps {
  /** The color to use for emphasized text (em, links, clickable buttons) */
  $emphasisColor: string;
  /** The color used for text highlighting */
  $highlightColor: string;
}
/** Css styles for html content of {@link ContentSection} */
const Content = styled('div')<ContentProps>`
  width: 100%;
  height: 100%;
  // set base text color
  color: rgba(255, 255, 255, 0.7);
  // set text highlight color
  * {
    ::selection {
      background-color: ${({ $highlightColor }) => $highlightColor};
    }
  }
  em {
    color: ${({ $emphasisColor }) => $emphasisColor};
  }
  a {
    // no underline on links
    text-decoration: none;
    color: ${({ $emphasisColor }) => $emphasisColor};
  }
  button {
    color: ${({ $emphasisColor }) => $emphasisColor};
    cursor: pointer;
    // hide button to make it look like regular text
    background-color: transparent;
    border: none;
    padding: 0;
    margin: 0;
    font-size: inherit;
  }
`;

/** Props for {@link ContentSectionLayout} */
interface ContentSectionLayoutProps {
  index: number;
  alternate: boolean;
  image: string;
  bgText: string;
  header: string;
  children: ReactNode;
}
/**
 * TODO: add documentation
 * @param props
 * @returns
 */
function ContentSectionLayout({ index, alternate, image, bgText, header, children }: ContentSectionLayoutProps) {
  const { size } = useThree();

  // use mobile layout if vertical orientation
  const isMobile = size.width < size.height;

  // calculate base width and height
  const marginX = useLayout((state) => state.marginX);
  const width = size.width * (1 - marginX);
  const marginY = useLayout((state) => state.marginY);
  const height = size.height * (1 - marginY);

  // alternate colors
  const primary = useTheme((state) => state.primaryColor);
  const primaryBright = useTheme((state) => state.primaryBright);
  const secondary = useTheme((state) => state.secondaryColor);
  const secondaryBright = useTheme((state) => state.secondaryBright);
  const color = alternate ? primary : secondary;
  const colorBright = alternate ? primaryBright : secondaryBright;
  const altColorBright = alternate ? secondaryBright : primaryBright;

  // load image
  const imageTexture = useLoader(TextureLoader, image);
  useMemo(() => (imageTexture.minFilter = LinearFilter), [imageTexture]);

  /* Calculate Positions / sizes */

  // padding between image and html
  const padding = isMobile ? height * 0.02 : width * 0.03;

  // calculate image width/height
  const imageHeight = isMobile ? height * 0.3 : height * 0.7;
  const imageWidth = isMobile ? width : width / 1.8;
  // calculate image position
  const imageX = isMobile ? 0 : (width / 2 - imageWidth / 2) * (alternate ? -1 : 1);
  const imageY = isMobile ? height / 4 : -height * 0.05;
  const imagePosition = new Vector3(imageX, imageY, 1);

  // calculate html width/height
  const htmlHeight = isMobile ? (height - imageHeight) * 0.75 : imageHeight;
  const htmlWidth = isMobile ? width : width - imageWidth - padding;
  // calculate image position (uses top-left coords instead of centered)
  const htmlX = isMobile || !alternate ? -width / 2 : imageX + imageWidth / 2 + padding;
  const htmlY = isMobile ? imageY - imageHeight / 2 - padding : imageY + imageHeight / 2;
  const htmlPosition = new Vector3(htmlX, htmlY, 10);

  // calculate header position and size
  const headerX = (width / 2) * (alternate ? -1 : 1);
  const headerY = imageHeight / 2 + imageY + padding;
  const headerPosition = new Vector3(headerX, headerY, -1);
  const headerFontSize = isMobile ? width / 20 : width / 25;

  // calculate bg text position and size
  const bgTextX = (width / 2) * (alternate ? 1 : -1);
  const bgTextY = isMobile ? height / 2.2 : height / 4;
  const bgTextPosition = new Vector3(bgTextX, bgTextY, -10);
  const bgTextFontSize = width / 10;

  // load fonts and create text geometries
  const headerTextRef = useRef<Mesh>();
  const backgroundTextRef = useRef<Mesh>();
  useEffect(() => {
    useFont('/assets/fonts/MontHeavy.json', (font) => {
      if (headerTextRef.current) {
        // create text geometry
        const config = { font: font, size: headerFontSize, height: 1 };
        headerTextRef.current.geometry = new TextGeometry(header, config);
      }
    });
    useFont('/assets/fonts/ModeNine.json', (font) => {
      if (backgroundTextRef.current) {
        // create text geometry
        const config = { font: font, size: bgTextFontSize, height: 1 };
        backgroundTextRef.current.geometry = new TextGeometry(bgText, config);
      }
    });
  }, []);

  // right align header or alternate text on size change
  const headerTextParentRef = useRef<Group>();
  const backgroundTextParentRef = useRef<Group>();
  useLayoutEffect(() => {
    // right align background text when alternate
    if (alternate && backgroundTextRef.current) {
      backgroundTextRef.current.geometry.computeBoundingBox();
      if (backgroundTextRef.current.geometry.boundingBox && backgroundTextParentRef.current) {
        backgroundTextParentRef.current.position.x =
          backgroundTextRef.current.geometry.boundingBox.min.x - backgroundTextRef.current.geometry.boundingBox.max.x;
      }
    }
    // right align header text when not alternate
    if (!alternate && headerTextRef.current) {
      headerTextRef.current.geometry.computeBoundingBox();
      if (headerTextRef.current.geometry.boundingBox && headerTextParentRef.current) {
        headerTextParentRef.current.position.x =
          headerTextRef.current.geometry.boundingBox.min.x - headerTextRef.current.geometry.boundingBox.max.x;
      }
    }
  }, [size]);

  return (
    <Section index={index} parallax={1 + (isMobile || !alternate ? 0 : 0.5)}>
      {/* html content*/}
      <SectionItem parallax={0}>
        <Html style={{ width: htmlWidth, height: htmlHeight }} position={htmlPosition} zIndexRange={[0, 0]}>
          <Content $emphasisColor={colorBright} $highlightColor={altColorBright}>
            {children}
          </Content>
        </Html>
      </SectionItem>

      {/* image */}
      <SectionItem parallax={0}>
        <group position={imagePosition}>
          <DistortionImage texture={imageTexture} width={imageWidth} height={imageHeight} />
        </group>
      </SectionItem>

      {/* header */}
      <SectionItem parallax={1.0}>
        <group ref={headerTextParentRef}>
          <mesh ref={headerTextRef} position={headerPosition}>
            <meshBasicMaterial color={color} />
          </mesh>
        </group>
      </SectionItem>

      {/* bg text */}
      <SectionItem parallax={-2.0}>
        <group ref={backgroundTextParentRef}>
          <mesh ref={backgroundTextRef} position={bgTextPosition}>
            <meshBasicMaterial transparent color={'#ffffff'} opacity={0.04} />
          </mesh>
        </group>
      </SectionItem>
    </Section>
  );
}

export { ContentSectionLayout };
export type { ContentSectionLayoutProps };
