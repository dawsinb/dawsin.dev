import { extend } from '@react-three/fiber';
import {
  Object3D,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  MeshPhysicalMaterial,
  PlaneBufferGeometry,
  AmbientLight,
  DirectionalLight,
  SpotLight
} from 'three';

extend({
  Object3D,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  MeshPhysicalMaterial,
  PlaneBufferGeometry,
  AmbientLight,
  DirectionalLight,
  SpotLight
});
