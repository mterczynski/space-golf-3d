import { Planet } from './ts/Planet';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { Ball } from './ts/Ball';
import { AxisHelper, Color, Vector3, WebGLRenderer, Scene, PerspectiveCamera, Object3D, Light, PointLight } from 'three';
import { ElementGetter } from './ts/ElementGetter';
import { Net } from './ts/Net';
import { InfoTab } from './ts/InfoTab';
import { Skybox } from './ts/Skybox';

// import { AnaglyphEffect } from 'three-anaglypheffect'

console.log(require('three-anaglypheffect'));
declare var AnaglyphEffect: any;

class App{
    constructor(){
        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        
        const planets = [
            new Planet(40),
            // new Planet(20, new Color('rgb(0, 255, 0)')),
            // new Planet(100, new Color('rgb(0, 0, 255)')),
            // new Planet(3, new Color('rgb(255, 255, 255)'))
        ];

        planets.forEach((planet)=>{
            this.scene.add(planet);
        });

        // planets[3].position.set(100, 100, 100);
        // planets[1].position.set(90, 10, 10);
        // planets[2].position.set(0, 0, 500);

        this.ball.position.set(0, -100, -70);
        this.scene.add(this.ball);

        // this.scene.add(new Net());

        this.camera.position.set(200, 200, 200);
        this.camera.lookAt(new Vector3());

        this.scene.add(new Skybox());
        let light = new PointLight();
        light.position.set(0,100,5000);
        this.scene.add(light);

        this.render();
    }
  
    private readonly renderer = new WebGLRenderer({antialias:true, canvas:<HTMLCanvasElement>document.getElementById('mainCanvas')});
    private readonly scene = new Scene();
    private readonly camera = new PerspectiveCamera(45, innerWidth/innerHeight, 0.1, Math.pow(10,6));
    private readonly eGetter = new ElementGetter(this.scene);
    private ball: Ball = new Ball();
    private effectAnaglyphic = new AnaglyphEffect(this.renderer);
    // Example mesh

    private adjustCanvasSize(){
        this.renderer.setSize(innerWidth, innerHeight);
        this.camera.aspect = innerWidth/innerHeight;
        this.camera.updateProjectionMatrix();
    }

    private render(){
        this.effectAnaglyphic.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
        this.adjustCanvasSize();

        let planets: Planet[] = this.eGetter.getPlanets();

        planets.forEach((planet: Planet)=>{
            this.ball.addVelocity(planet.calcGravity(this.ball));
        });

        this.ball.tick();

        this.eGetter.getLines().forEach((line)=>{
            this.scene.remove(line);
        });

        if(this.ball.isCollidingWithAny(planets)){
            console.log('collision');
        }

        this.scene.add(this.ball.getLine());

        InfoTab.updateText(this.ball);
    }
}

const app = new App();
