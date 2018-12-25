const Models = {
    
    SCALE_FACTOR: 9,
    
    materials: {
        black: {
            color: 0x110C11,
            reflectivity: 0.1,
            shininess: 20,
            shading: THREE.SmoothShading,
            transparent: true,
            opacity: 1.0
        },
    
        white: {
            color: 0xFCF6E3,
            reflectivity: 10,
            shininess: 25,
            shading: THREE.SmoothShading,
            transparent: true,
            opacity: 1.0

        },
    
        red: {
            color: 0xFF0000,
            reflectivity: 10,
            shininess: 25,
            shading: THREE.SmoothShading,
            transparent: true,
            opacity: 0.4,
//            alphaTest: 0.5
        },
        
        green: {
            color: 0x90EE90,
            reflectivity: 10,
            shininess: 25,
            shading: THREE.SmoothShading,
            transparent: true,
            opacity: 0.4,
//            alphaTest: 0.5
        }
        
//        black: new THREE.MeshPhongMaterial({
//            color: 0x110C11,
//            reflectivity: 0.1,
//            shininess: 20,
//            shading: THREE.SmoothShading,
//            transparent: true,
//            opacity: 1.0
//        }),
//    
//        white: new THREE.MeshPhongMaterial({
//            color: 0xFCF6E3,
//            reflectivity: 10,
//            shininess: 25,
//            shading: THREE.SmoothShading,
//            transparent: true,
//            opacity: 1.0
//
//        }),
//    
//        red: new THREE.MeshPhongMaterial({
//            color: 0xFF0000,
//            reflectivity: 10,
//            shininess: 25,
//            shading: THREE.SmoothShading,
//            transparent: true,
//            opacity: 0.4,
////            alphaTest: 0.5
//        })
        
    },
    
    directory: 'models/',
    
    pieceData: [
        {
            name: 'pawn',
            fileName: 'Pawn.model.json',
            rotation: new THREE.Vector3(0, 0, 0)
        }, {
            name: 'rook',
            fileName: 'Rook.model.json',
            rotation: new THREE.Vector3(0, -90, 0)
        }, {
            name: 'bishop',
            fileName: 'Bishop.model.json',
            rotation: new THREE.Vector3(0, -90, 0)
        }, {
            name: 'knight',
            fileName: 'Knight.model.json',
            rotation: new THREE.Vector3(0, 90, 0)
        }, {
            name: 'queen',
            fileName: 'Queen.model.json',
            rotation: new THREE.Vector3(0, 0, 0)
        }, {
            name: 'king',
            fileName: 'King.model.json',
            rotation: new THREE.Vector3(0, 0, 0)
        }
    ],
    
    createMesh: function(piece, material, x=0, y=0, z=0){
        
//        const manager = new THREE.LoadingManager();
//        const loader = new THREE.JSONLoader(manager);
//        const path = Models.directory + Models[piece].fileName;
//        
//        loader.load(path, function(geometry, materials) {
//            var mesh = new THREE.Mesh(geometry, material);
//            mesh.position.set(3, 0, 21);
//            mesh.rotation.set(Models[piece].rotation.x, Models[piece].rotation.y, Models[piece].rotation.z);
//            mesh.castShadow = true;
//            mesh.receiveShadow = true;
//
//            mesh.scale.set(4, 4, 4)
//            scene.add(mesh)
//        });
        
        const pieceData = Models.pieceData[Models.pieceIndices[piece]]
        const geometry = Models.geometries[piece]
        let mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial(material))
        mesh.position.set(0, 0, 0);
        mesh.rotation.set(pieceData.rotation.x, pieceData.rotation.y, pieceData.rotation.z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        mesh.scale.set(Models.SCALE_FACTOR, Models.SCALE_FACTOR, Models.SCALE_FACTOR)
        mesh.position.set(x, y, z)
        mesh.canRayCast = true;
        
        return mesh
        
        
    },
    
    geometries: {},
    pieceIndices: {},
    loadModels: function(){
        
        // Loads all chess models then calls init when finished
        
        const manager = new THREE.LoadingManager();
        manager.onLoad = init // Initialize game when finished loading
        const loader = new THREE.JSONLoader(manager);
        
        let index = 0;
        Models.pieceData.forEach(piece => {
            
            const path = Models.directory + piece.fileName
            
            loader.load(path, function(geometry, materials) {
                Models.geometries[piece.name] = geometry
            });
            
            Models.pieceIndices[piece.name] = index++
            
        });
        
    }
    
}