import * as THREE from 'three';

// declare module OrbitControls{};

// import * as OrbitControls from 'three-orbit-controls'

// declare var OrbitControls: any;

import { Planet } from './ts/Planet';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { Bullet } from './ts/Bullet';
import { AxisHelper } from 'three';
import { ElementGetter } from './ts/ElementGetter';

class App{
    constructor(){
        // console.log(OrbitControls);
        // this.brick = new Brick(100, new THREE.Color("rgb(0,0,255)"));
        // this.scene.add(this.brick);
        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        
        let planet = new Planet(40, new THREE.MeshBasicMaterial({
            color: 0xff0000,
        }));
        let planet2 = new Planet(20, new THREE.MeshBasicMaterial({
            color: 0xf0df33,
        }));
        let planet3 = new Planet(20, new THREE.MeshBasicMaterial({
            color: 0x0832ff,
        }));
        this.scene.add(planet2);
        this.scene.add(planet3);
        this.scene.add(planet);

        planet2.position.set(90, 10, 10);
        planet3.position.z = 100;

        let bullet = new Bullet();
        bullet.position.set(0,-100, -50);
        this.scene.add(bullet);

        console.log(bullet)

        let axis = new AxisHelper(100);
        this.scene.add(axis)

        this.camera.position.set(200,200,200);
        this.renderer.setSize(innerWidth, innerHeight);
        this.renderer.setClearColor(new THREE.Color("rgb(255,255,255)"));
        this.camera.lookAt(<THREE.Vector3>{x:0,y:0,z:0});

        this.render();
    }

    private readonly renderer = new THREE.WebGLRenderer({antialias:true, canvas:<HTMLCanvasElement>document.getElementById("mainCanvas")});
    private readonly scene = new THREE.Scene();
    private readonly camera = new THREE.PerspectiveCamera(45, innerWidth/innerHeight, 0.1, 10000);
    private readonly eGetter = new ElementGetter(this.scene);
    // Example mesh

    private adjustCanvasSize(){
        this.renderer.setSize(innerWidth, innerHeight);
        this.camera.aspect = innerWidth/innerHeight;
        this.camera.updateProjectionMatrix();
    }
    private render(){
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(()=>{this.render()});
        this.adjustCanvasSize();

        console.log(this.eGetter.getPlanets());
    }
}

const app = new App();
