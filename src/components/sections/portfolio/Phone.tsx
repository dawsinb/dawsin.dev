import { useEffect, useRef, useState } from 'react';
import { extend, useFrame, useThree } from '@react-three/fiber';
import { NearestFilter, Mesh, Texture, Vector3, Euler, Vector2 } from 'three';
import { TextureFader } from './TextureFader';
import { loadGeometry } from 'loaders/loadGeometry';
import { loadTexture } from 'loaders/loadTexture';
import { lerp } from 'Utils/math';

// register shader in r3f
extend({ TextureFader });

interface PhoneProps {
  imageIndex: number;
  prevImageIndex: number;
  direction: Vector2;
  imageTextureUrls: string[];
  displacementTextureUrl: string;
  noiseTextureUrl: string;
  scale: number;
}

function Phone({
  imageIndex,
  prevImageIndex,
  direction,
  imageTextureUrls,
  displacementTextureUrl,
  noiseTextureUrl,
  scale
}: PhoneProps) {
  // get size of canvas and the underlying renderer
  const { size, gl } = useThree();

  // create refs to device meshes
  const frameRef = useRef<Mesh>();
  const bezelRef = useRef<Mesh>();
  const screenRef = useRef<Mesh>();

  // create states to set the textures
  const [imageTextures, setImageTextures] = useState<Texture[]>();
  const [displacementTexture, setDisplacementTexture] = useState<Texture>();
  const [noiseTexture, setNoiseTexture] = useState<Texture>();

  // load assets
  useEffect(() => {
    // load laptop geometry
    Promise.all([
      loadGeometry('/assets/models/phone/phone_frame.drc').then((geometry) => {
        if (frameRef.current) {
          geometry.computeVertexNormals();
          frameRef.current.geometry = geometry;
        }
      }),
      loadGeometry('/assets/models/phone/phone_bezel.drc').then((geometry) => {
        if (bezelRef.current) {
          bezelRef.current.geometry = geometry;
        }
      }),
      loadGeometry('/assets/models/phone/phone_screen.drc').then((geometry) => {
        if (screenRef.current) {
          screenRef.current.geometry = geometry;
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
    <group scale={scale}>
      <mesh ref={frameRef}>
        <meshStandardMaterial wireframe roughness={0.6} metalness={0.8} color={'#f0f0f0'} />
      </mesh>
      <mesh ref={bezelRef}>
        <meshBasicMaterial wireframe color={'#000000'} />
      </mesh>
      <mesh ref={screenRef}>
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
    </group>
  );
}

export { Phone };
