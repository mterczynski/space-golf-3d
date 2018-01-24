import { Planet } from './ts/Planet';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { Bullet } from './ts/Bullet';
import { AxisHelper, Color, Vector3, WebGLRenderer, Scene, PerspectiveCamera, Object3D } from 'three';
import { ElementGetter } from './ts/ElementGetter';

class App{
    constructor(){
        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        
        let planet = new Planet(40);
        let planet2 = new Planet(20, new Color('rgb(0, 255, 0)'));
        let planet3 = new Planet(50, new Color('rgb(0, 0, 255)'));
        this.scene.add(planet2);
        this.scene.add(planet3);
        this.scene.add(planet);

        planet2.position.set(90, 10, 10);
        planet3.position.z = 100;

        this.bullet = new Bullet();
        this.bullet.position.set(0,-100, -50);
        this.scene.add(this.bullet);

        this.scene.add(this.axis);

        this.camera.position.set(200, 200, 200);
        this.renderer.setSize(innerWidth, innerHeight);
        this.renderer.setClearColor(new Color('rgb(255,255,255)'));
        this.camera.lookAt(new Vector3());

        this.render();

        let vec1 = new Vector3(100, 50, 60);
        let vec2 = new Vector3(10, 90, 50);

        console.log(new Vector3().subVectors(vec1, vec2).normalize())
        console.log(new Vector3().subVectors(vec1, vec2))
        // console.log(sub)
    }

    private readonly axis = new AxisHelper(100);   
    private readonly renderer = new WebGLRenderer({antialias:true, canvas:<HTMLCanvasElement>document.getElementById('mainCanvas')});
    private readonly scene = new Scene();
    private readonly camera = new PerspectiveCamera(45, innerWidth/innerHeight, 0.1, 10000);
    private readonly eGetter = new ElementGetter(this.scene);
    private bullet: Bullet;
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
            // console.log(planet.calcGravity(this.bullet))
            console.log(planet.calcGravity(this.bullet))
            this.bullet.addVelocity(planet.calcGravity(this.bullet));
        });

        this.bullet.tick();
    }
}

const app = new App();
