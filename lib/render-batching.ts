import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

// Use only on completed/static subtrees. Animated visibility and transforms
// stay on their original parent (a ring, a grate panel or an equipment unit).
export function compactStatic<G extends T.Object3D>(root:G):G{
 root.updateWorldMatrix(true,true);const inverse=root.matrixWorld.clone().invert(),buckets=new Map<string,T.Mesh[]>();
 root.traverseVisible(o=>{if(!(o instanceof T.Mesh)||o instanceof T.InstancedMesh||o instanceof T.SkinnedMesh||Array.isArray(o.material)||Object.keys(o.geometry.morphAttributes).length)return;
  const m=o.material;if(!(m instanceof T.MeshStandardMaterial||m instanceof T.MeshBasicMaterial)||m.transparent||m.map||m.alphaMap||m.vertexColors||m.onBeforeCompile!==T.Material.prototype.onBeforeCompile)return;
  const standard=m instanceof T.MeshStandardMaterial?m:null;if(standard&&(standard.normalMap||standard.roughnessMap||standard.metalnessMap||standard.emissiveMap||standard.aoMap))return;
  const key=JSON.stringify([m.type,m.color.getHex(),standard?.metalness,standard?.roughness,standard?.emissive.getHex(),standard?.emissiveIntensity,m.side,m.opacity,m.depthTest,m.depthWrite,m.toneMapped,m.wireframe,standard?.flatShading,o.castShadow,o.receiveShadow,o.renderOrder,o.layers.mask]);const list=buckets.get(key)||[];list.push(o);buckets.set(key,list);
 });
 for(const meshes of buckets.values()){if(meshes.length<3)continue;const geometries=meshes.map(m=>{const geometry=m.geometry.index?m.geometry.toNonIndexed():m.geometry.clone();for(const attr of Object.keys(geometry.attributes))if(!['position','normal'].includes(attr))geometry.deleteAttribute(attr);if(!geometry.getAttribute('normal'))geometry.computeVertexNormals();geometry.applyMatrix4(new T.Matrix4().multiplyMatrices(inverse,m.matrixWorld));return geometry});
  const geometry=mergeGeometries(geometries,false);geometries.forEach(g=>g.dispose());if(!geometry)continue;geometry.computeBoundingBox();geometry.computeBoundingSphere();const first=meshes[0],batch=new T.Mesh(geometry,first.material);batch.name='Batched static surfaces';batch.castShadow=first.castShadow;batch.receiveShadow=first.receiveShadow;batch.renderOrder=first.renderOrder;batch.layers.mask=first.layers.mask;root.add(batch);for(const mesh of meshes){mesh.removeFromParent();mesh.geometry.dispose()}
 }
 return root;
}
