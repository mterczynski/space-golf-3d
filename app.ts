import { Planet } from './ts/Planet';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { Ball } from './ts/Ball';
import { AxisHelper, Color, Vector3, WebGLRenderer, Scene, PerspectiveCamera, Object3D, Light, PointLight } from 'three';
import { ElementGetter } from './ts/ElementGetter';
import { Net } from './ts/Net';
import { InfoTab } from './ts/InfoTab';
import { Skybox } from './ts/Skybox';

class App{
    constructor(){
        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        
        let planet = new Planet(40);
        let planet2 = new Planet(20, new Color('rgb(0, 255, 0)'));
        let planet3 = new Planet(100, new Color('rgb(0, 0, 255)'));
        let planet4 = new Planet(10, new Color('rgb(255, 255, 255)'));

        this.scene.add(planet);
        // this.scene.add(planet2);
        // this.scene.add(planet3);
        // this.scene.add(planet4);

        planet4.position.set(100, 100, 100);

        planet2.position.set(90, 10, 10);
        planet3.position.z = 500;

        this.ball = new Ball();
        this.ball.position.set(0,-100, -70);
        this.scene.add(this.ball);

        this.scene.add(this.axis);

        // this.scene.add(new Net());

        this.camera.position.set(200, 200, 200);
        this.renderer.setSize(innerWidth, innerHeight);
        this.renderer.setClearColor(new Color('rgb(0,0,0)'));
        this.camera.lookAt(new Vector3());

        let vec1 = new Vector3(100, 50, 60);
        let vec2 = new Vector3(10, 90, 50);

        this.scene.add(new Skybox());
        let light = new PointLight();
        // light.add(new Planet(50, new Color('rgb(255,0,0)')));
        light.position.set(0,100,5000)
        this.scene.add(light)

        this.render();
    }

    private readonly axis = new AxisHelper(100);   
    private readonly renderer = new WebGLRenderer({antialias:true, canvas:<HTMLCanvasElement>document.getElementById('mainCanvas')});
    private readonly scene = new Scene();
    private readonly camera = new PerspectiveCamera(45, innerWidth/innerHeight, 0.1, Math.pow(10,6));
    private readonly eGetter = new ElementGetter(this.scene);
    private ball: Ball;
    // Example mesh

    private adjustCanvasSize(){
        this.renderer.setSize(innerWidth, innerHeight);
        this.camera.aspect = innerWidth/innerHeight;
        this.camera.updateProjectionMatrix();
    }

    private render(){
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
        this.adjustCanvasSize();

        this.eGetter.getPlanets().forEach((planet: Planet)=>{
            this.ball.addVelocity(planet.calcGravity(this.ball));
        });

        this.ball.tick();

        this.eGetter.getLines().forEach((line)=>{
            this.scene.remove(line);
        });

        console.log(this.scene.children.length)

        this.scene.add(this.ball.getLine());

        InfoTab.updateText(this.ball);
    }
}

const app = new App();
