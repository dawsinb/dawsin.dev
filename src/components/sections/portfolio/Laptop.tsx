/**
 * Components used for the portfolio section of the app
 * @module Components/Sections/Portfolio
 * @mergeTarget
 */

import { useEffect, useRef, useState } from 'react';
import { extend, useFrame, useThree } from '@react-three/fiber';
import { NearestFilter, Mesh, Texture, Euler, Vector2 } from 'three';
import { TextureFader } from './TextureFader';
import { loadGeometry } from 'loaders/loadGeometry';
import { loadTexture } from 'loaders/loadTexture';
import { lerp } from 'Utils/math';

// register shader in r3f
extend({ TextureFader });

/** Props for {@link Laptop} */
interface LaptopProps {
  /** Current index of image to display */
  imageIndex: number;
  /** Index of previous image to fade from */
  prevImageIndex: number;
  /** Direction of the displacement */
  direction: Vector2;
  /** Urls of images to use as diffuse textures */
  imageTextureUrls: string[];
  /** Url of displacement map texture */
  displacementTextureUrl: string;
  /** Url of noise texture */
  noiseTextureUrl: string;
  /** scale of the phone */
  scale: number;
}
/**
 * 3D model of a laptop that can fade between display textures
 * @param props
 * @returns
 */
function Laptop({
  imageIndex,
  prevImageIndex,
  direction,
  imageTextureUrls,
  displacementTextureUrl,
  noiseTextureUrl,
  scale
}: LaptopProps) {
  // get underlying renderer for texture loading
  const { gl } = useThree();

  // create refs to device meshes
  const laptopFrameRef = useRef<Mesh>();
  const laptopScreenRef = useRef<Mesh>();
  const laptopKeyboardRef = useRef<Mesh>();

  // create states to set the textures
  const [imageTextures, setImageTextures] = useState<Texture[]>();
  const [displacementTexture, setDisplacementTexture] = useState<Texture>();
  const [noiseTexture, setNoiseTexture] = useState<Texture>();

  // load assets
  useEffect(() => {
    // load laptop geometry
    Promise.all([
      loadGeometry('/assets/models/laptop/laptop_frame.drc').then((geometry) => {
        if (laptopFrameRef.current) {
          geometry.computeVertexNormals();
          laptopFrameRef.current.geometry = geometry;
        }
      }),
      loadGeometry('/assets/models/laptop/laptop_screen.drc').then((geometry) => {
        if (laptopScreenRef.current) {
          laptopScreenRef.current.geometry = geometry;
        }
      }),
      loadGeometry('/assets/models/laptop/laptop_keyboard.drc').then((geometry) => {
        if (laptopKeyboardRef.current) {
          laptopKeyboardRef.current.geometry = geometry;
        }
      })
    ]).catch((error) => console.log(error));

    // load image textures
    const imageTexturesBuffer: Texture[] = [];
    Promise.all(
      imageTextureUrls.map((url, index) => {
        return loadTexture(url, gl).then((texture) => {
          imageTexturesBuffer[index] = texture;
        });
      })
    )
      .then(() => setImageTextures(imageTexturesBuffer))
      .catch((error) => console.log(error)),
      // load displacement texture
      loadTexture(displacementTextureUrl, gl)
        .then((texture) => {
          texture.minFilter = texture.magFilter = NearestFilter;
          setDisplacementTexture(texture);
        })
        .catch((error) => console.log(error));
    // load noise texture
    loadTexture(noiseTextureUrl, gl)
      .then((texture) => {
        texture.minFilter = texture.magFilter = NearestFilter;
        setNoiseTexture(texture);
      })
      .catch((error) => console.log(error));
  }, []);

  // create ref to material
  const materialRef = useRef<TextureFader>();
  // on index change update shader uniforms
  useEffect(() => {
    if (materialRef.current) {
      // update index
      materialRef.current.index = imageIndex;
      materialRef.current.prevIndex = prevImageIndex;
      // update direction
      materialRef.current.direction = direction;

      // update offsets
      materialRef.current.displacementOffset.fromArray([
        (materialRef.current.index * 17) / 7,
        (materialRef.current.index * 7) / 17
      ]);
      materialRef.current.noiseOffset.fromArray([
        (materialRef.current.index * 17) / 7,
        (materialRef.current.index * 7) / 17
      ]);

      // set effect factor to one to start transition
      materialRef.current.effectFactor = 1;
    }
  }, [imageIndex]);
  // continually lerp effect factor towards 0
  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.effectFactor = lerp(materialRef.current.effectFactor, 0, 0.04);
    }
  });

  return (
    <group rotation={new Euler(Math.PI / 10, 0, 0)} scale={scale}>
      <mesh ref={laptopFrameRef}>
        <meshStandardMaterial wireframe roughness={0.6} metalness={0.8} color={'#f0f0f0'} />
      </mesh>
      <mesh ref={laptopScreenRef}>
        <textureFader
          attach="material"
          ref={materialRef}
          args={[imageTextureUrls.length]}
          imageTextures={imageTextures}
          noiseTexture={noiseTexture}
          displacementTexture={displacementTexture}
          noiseIntensity={0.2}
          displacementIntensity={1.5}
          effectFactor={0}
        />
      </mesh>
      <mesh ref={laptopKeyboardRef}>
        <meshStandardMaterial metalness={0} roughness={0.9} color={'#0f0f0f'} />
      </mesh>
    </group>
  );
}

export { Laptop };
export type { LaptopProps };
