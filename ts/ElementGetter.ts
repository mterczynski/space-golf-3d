import { Scene, Object3D } from "three";
import { Planet } from "./Planet";

export class ElementGetter{
    
    constructor(scene: Scene){
        this.scene = scene;
    }

    private scene: Scene;

    deepSearch(element: Object3D, filteredObjects: Object3D[]) {
        if(element.name == name){
            filteredObjects.push(element);
        }
        if(element.children){
            element.children.forEach((subElement)=>{
                this.deepSearch(subElement, filteredObjects);
            });  
        }
    }
    
    getPlanets(): Planet[]{
        return <Planet[]> this.scene.children.filter((el)=>{
            return el instanceof Planet;
        });
    }

    getObjectsByName(name: string, recursive=true){
        if(recursive){
            const filteredObjects: Object3D[] = [];
            
            this.deepSearch(this.scene, filteredObjects);
            return filteredObjects;
        }
        else{
            return this.scene.children.filter((el)=>{
                return el.name == name;
            });
        }
    }
}

// function ElementGetter(){
//     this.getObjectsByName = function(container, name="name", recursive=true){
//         if(arguments.length < 2){
//             throw new Error("Required arguments: container:THREE.Object3D, name:string");
//         }
//         if(recursive){
//             const filteredObjects = [];
//             function deepSearch(element) {
//                 if(element.name == name){
//                     filteredObjects.push(element);
//                 }
//                 if(element.children){
//                     element.children.forEach((subElement)=>{
//                         deepSearch(subElement);
//                     })  
//                 }
//             }
//             deepSearch(container);
//             return filteredObjects;
//         }
//         else{
//             return container.children.filter((el)=>{
//                 return el.name == name;
//             });
//         }
//     }
// }