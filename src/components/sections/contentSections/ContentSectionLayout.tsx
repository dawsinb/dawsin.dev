/**
 * Components for content sections with html text and an image
 * @module Components/Sections/ContentSections
 * @mergeTarget
 */

import { useRef, ReactNode, useEffect, useState } from 'react';
import { Mesh, Group, Vector3, Texture, Material, MirroredRepeatWrapping, LinearEncoding } from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { Font } from 'three/examples/jsm/loaders/FontLoader';
import { useFrame, useThree } from '@react-three/fiber';
import styled from 'styled-components';
import { loadFont } from 'loaders/loadFont';
import { loadTexture } from 'loaders/loadTexture';
import { useLanguage } from 'stores/language';
import { useLayout } from 'stores/layout';
import { useTheme } from 'stores/theme';
import { lerp } from 'utils/math';
import { useTransientScroll } from 'hooks/useTransientScroll';
import { Section, SectionItem } from 'components/sections/Section';
import { Html } from 'components/Html';
import { DynamicText } from 'components/DynamicText';
import { DistortionImage } from './distortionImage/DistortionImage';

/** Props for {@link ContentContainer} */
interface ContentContainerProps {
  $width: number;
  $height: number;
}
/** Container for html content of {@link ContentSection} */
const ContentContainer = styled('div')<ContentContainerProps>`
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => $height}px;
`;

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
  /** Index of the {@link Section section} */
  index: number;
  /** Parallax of the {@link Section section} */
  parallax?: number;
  /** Header text content */
  headerText: string;
  /** Japanese translation of header text content */
  headerTextJp: string;
  /** Background text content */
  backgroundText: string;
  /** Url of the image to display */
  imageUrl: string;
  /** Determines whether to use the primary or secondary color as the main color; Set to true to use secondary */
  alternateColor?: boolean;
  /** Determines whether to align left or right; Set to true to align right */
  alternatePosition?: boolean;
  /** Children in the html container  */
  children: ReactNode;
}
/** Reduced set of props for components using {@link ContentSectionLayout} */
type ContentSectionProps = Omit<
  ContentSectionLayoutProps,
  'imageUrl' | 'backgroundText' | 'headerText' | 'headerTextJp' | 'children'
>;
/**
 * Layout for html content with an image, header, and background text. Use the `alternateColor` and `alternatePosition` to vary each section
 *
 * The image uses {@link DistortionImage} to apply a distortion effeft that follows the mouse
 * @param props
 * @returns
 */
function ContentSectionLayout({
  index,
  parallax,
  imageUrl,
  backgroundText,
  headerText,
  headerTextJp,
  alternateColor,
  alternatePosition,
  children
}: ContentSectionLayoutProps) {
  const { size } = useThree();

  // use mobile layout if vertical orientation
  const isMobile = size.width < size.height;

  // calculate base width and height
  const marginX = useLayout((state) => state.marginX);
  const width = size.width * (1 - marginX);
  const marginY = useLayout((state) => state.marginY);
  const height = size.height * (1 - marginY);

  // get color palette
  const primary = useTheme((state) => state.primaryColor);
  const primaryBright = useTheme((state) => state.primaryBright);
  const secondary = useTheme((state) => state.secondaryColor);
  const secondaryBright = useTheme((state) => state.secondaryBright);
  // determine colors
  const color = alternateColor ? secondary : primary;
  const colorBright = alternateColor ? secondaryBright : primaryBright;
  const altColorBright = alternateColor ? primaryBright : secondaryBright;

  /* Calculate Positions / Sizes */

  // padding between image and html
  const padding = isMobile ? height * 0.02 : width * 0.03;

  // calculate image width/height
  const imageHeight = isMobile ? height * 0.3 : height * 0.7;
  const imageWidth = isMobile ? width : width / 1.8;
  // calculate image position
  const imageX = isMobile ? 0 : (-width / 2 + imageWidth / 2) * (alternatePosition ? -1 : 1);
  const imageY = isMobile ? height / 4 : -height * 0.05;
  const imagePosition = new Vector3(imageX, imageY, 1);

  // calculate html width/height
  const htmlHeight = isMobile ? (height - imageHeight) * 0.75 : imageHeight;
  const htmlWidth = isMobile ? width : width - imageWidth - padding;
  // calculate image position (uses top-left coords instead of centered)
  const htmlX = isMobile || alternatePosition ? -width / 2 : imageX + imageWidth / 2 + padding;
  const htmlY = isMobile ? imageY - imageHeight / 2 - padding : imageY + imageHeight / 2;
  const htmlPosition = new Vector3(htmlX, htmlY, 10);

  // calculate header position and size
  const headerX = (-width / 2) * (alternatePosition ? -1 : 1);
  const headerY = imageHeight / 2 + imageY + padding;
  const headerPosition = new Vector3(headerX, headerY, -1);
  const headerFontSize = isMobile ? width / 20 : width / 25;

  // calculate bg text position and size
  const bgTextX = (width / 2) * (alternatePosition ? -1 : 1);
  const bgTextY = isMobile ? height / 2.2 : height / 4;
  const bgTextPosition = new Vector3(bgTextX, bgTextY, -10);
  const bgTextFontSize = width / 10;

  // helpfer functions to align background and header text
  const headerTextParentRef = useRef<Group>();
  const backgroundTextParentRef = useRef<Group>();
  const alignHeaderText = () => {
    // right align header text when alternate
    if (alternatePosition && headerTextRef.current) {
      headerTextRef.current.geometry.computeBoundingBox();
      if (headerTextRef.current.geometry.boundingBox && headerTextParentRef.current) {
        headerTextParentRef.current.position.x =
          headerTextRef.current.geometry.boundingBox.min.x - headerTextRef.current.geometry.boundingBox.max.x;
      }
    }
  };
  const alignBackgroundText = () => {
    // right align background text when not alternate
    if (!alternatePosition && backgroundTextRef.current) {
      backgroundTextRef.current.geometry.computeBoundingBox();
      if (backgroundTextRef.current.geometry.boundingBox && backgroundTextParentRef.current) {
        backgroundTextParentRef.current.position.x =
          backgroundTextRef.current.geometry.boundingBox.min.x - backgroundTextRef.current.geometry.boundingBox.max.x;
      }
    }
  };

  /* Load Content */
  const { gl } = useThree();
  // load texture
  const [imageTexture, setImageTexture] = useState(new Texture());
  useEffect(() => {
    loadTexture(imageUrl, gl)
      .then((texture) => {
        texture.wrapS = texture.wrapT = MirroredRepeatWrapping;
        texture.encoding = LinearEncoding;
        setImageTexture(texture);
      })
      .catch((error) => console.error(error));
  }, []);

  // determine which language to use
  const isJapanese = useLanguage((state) => state.isJapanese);
  // load fonts and create text geometries and refresh on resize
  const headerTextRef = useRef<Mesh>();
  const backgroundTextRef = useRef<Mesh>();
  useEffect(() => {
    // load header fonts
    let headerFont: Font;
    let headerFontJp: Font;
    Promise.all([
      loadFont('/assets/fonts/MPlusRounded.json').then((font) => {
        headerFontJp = font;
      }),
      loadFont('/assets/fonts/MontHeavy.json').then((font) => {
        headerFont = font;
      })
    ])
      .then(() => {
        if (headerTextRef.current) {
          if (isJapanese) {
            const config = { font: headerFontJp, size: headerFontSize * 0.9, height: 1 };
            headerTextRef.current.geometry = new TextGeometry(headerTextJp, config);
          } else {
            const config = { font: headerFont, size: headerFontSize, height: 1 };
            headerTextRef.current.geometry = new TextGeometry(headerText, config);
          }
          // align text if needed
          alignHeaderText();
        }
      })
      .catch((error) => console.error(error));
    loadFont('/assets/fonts/ModeNine.json')
      .then((font) => {
        if (backgroundTextRef.current) {
          // create text geometry
          const config = { font: font, size: bgTextFontSize, height: 1 };
          backgroundTextRef.current.geometry = new TextGeometry(backgroundText, config);

          // align text if needed
          alignBackgroundText();
        }
      })
      .catch((error) => console.error(error));
  }, [size, isJapanese]);

  // set up transient subscription to the scroll position
  const scrollRef = useTransientScroll();
  // fade opacity of header text in as scroll position nears index
  const headerTextMaterialRef = useRef<Material>();
  useFrame(() => {
    if (headerTextMaterialRef.current) {
      // if current section fade in
      if (scrollRef.current === index) {
        headerTextMaterialRef.current.opacity = lerp(headerTextMaterialRef.current.opacity, 1, 0.01);
      }
      // else fade out
      else {
        headerTextMaterialRef.current.opacity = lerp(headerTextMaterialRef.current.opacity, -0.4, 0.1);
      }
    }
  });

  return (
    <Section index={index} parallax={parallax}>
      {/* html content*/}
      <SectionItem parallax={0}>
        <group position={htmlPosition}>
          <Html>
            <ContentContainer $width={htmlWidth} $height={htmlHeight}>
              <Content $emphasisColor={colorBright} $highlightColor={altColorBright}>
                <DynamicText>{children}</DynamicText>
              </Content>
            </ContentContainer>
          </Html>
        </group>
      </SectionItem>

      {/* image */}
      <SectionItem parallax={0}>
        <group position={imagePosition}>
          <DistortionImage texture={imageTexture} width={imageWidth} height={imageHeight} />
        </group>
      </SectionItem>

      {/* header */}
      <SectionItem parallax={1}>
        <group ref={headerTextParentRef}>
          <mesh ref={headerTextRef} position={headerPosition}>
            <meshBasicMaterial ref={headerTextMaterialRef} transparent color={color} />
          </mesh>
        </group>
      </SectionItem>

      {/* bg text */}
      <SectionItem parallax={-2}>
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
export type { ContentSectionLayoutProps, ContentSectionProps };
