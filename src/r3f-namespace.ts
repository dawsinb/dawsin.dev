import { extend } from '@react-three/fiber';
import {
  Object3D,
  Group,
  Mesh,
  Line,
  MeshBasicMaterial,
  MeshStandardMaterial,
  MeshPhysicalMaterial,
  PlaneGeometry,
  AmbientLight,
  DirectionalLight,
  SpotLight
} from 'three';

extend({
  Object3D,
  Group,
  Mesh,
  Line,
  MeshBasicMaterial,
  MeshStandardMaterial,
  MeshPhysicalMaterial,
  PlaneGeometry,
  AmbientLight,
  DirectionalLight,
  SpotLight
});
