import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { initScene } from '@/utils/scene';
import { initCamera } from '@/utils/camera';
import { initCSSRender, initRenderer } from '@/utils/renderer';
import { initComposer } from '@/utils/effectComposer';
import { initRenderPass } from '@/utils/renderPass';
import { PosV3 } from '@/types/data';
import { initAxesHelper, initBoxHelper } from '@/utils/helper';

class ThreeBase {
  scene;
  camera;
  renderer;
  CSSRenderer;
  renderPass;
  composer;
  control;
  axesHelper;
  boxHelper;

  constructor(el: HTMLElement, cameraPos: PosV3){
    this.scene = initScene();
    this.camera = initCamera(el, cameraPos);
    this.renderer = initRenderer(el);
    this.CSSRenderer = initCSSRender(el);
    this.control = new OrbitControls(this.camera, el);
    this.axesHelper = initAxesHelper();

    this.renderPass = initRenderPass(this.scene, this.camera)
    this.composer = initComposer(this.renderer)
    this.composer.addPass(this.renderPass);
    this.boxHelper = initBoxHelper();
  }
}
export default ThreeBase
