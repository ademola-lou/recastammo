function AmmoMesh(mesh, shape, makeStatic ) {

  this.rigidBody = null;
  this.renderMesh = null;
  var geometry;
  var x = mesh.position.x
  var y = mesh.position.y
  var z = mesh.position.z
  
  if(mesh.geometry.type === "BufferGeometry")geometry =  new THREE.Geometry().fromBufferGeometry(mesh.geometry);
  else geometry = mesh.geometry
  
  makeStatic = ( makeStatic != undefined ) ? makeStatic: true;

  // ---------------------------------------------------------------------------
  this.update = function() {

    // WARNING - this may cause problems if called on a static object (mass == 0)
    var trans = this.rigidBody.getWorldTransform();
    var mat = this.renderMesh.matrixWorld;
    Ammo.Utils.b2three( trans, mat );

  }

  // ---------------------------------------------------------------------------
  var init = function() {

    if ( geometry instanceof THREE.SphereGeometry ) {

      this.rigidBody = Ammo.Utils.createDynamicSphere( geometry.parameters.radius, x, y, z );

    }
    else if ( geometry instanceof THREE.BoxGeometry ) {

      if ( makeStatic ) {

        this.rigidBody = Ammo.Utils.createStaticBox(
        geometry.parameters.width,
        geometry.parameters.height,
        geometry.parameters.depth,
        x, y, z );

      } else {
        alert( 'dynamic box in implemented' );
      }

    } else {

      var points = [];

      for ( var i = 0; i < geometry.vertices.length; ++i ) {

        points.push( geometry.vertices[ i ].x );
        points.push( geometry.vertices[ i ].y );
        points.push( geometry.vertices[ i ].z );

      }

     if(shape === "convex") this.rigidBody = Ammo.Utils.createStaticConvexHull( points, x, y, z );

    
      var i,
			width, height, depth,
			vertices, face, triangles = [];
      
      var offset = 0
     
    
      vertices = geometry.vertices;
		  for ( i = 0; i < geometry.faces.length; i++ ) {
			face = geometry.faces[i];
			if ( face instanceof THREE.Face3) {
				triangles.push([
					{ x: vertices[face.a].x - offset, y: vertices[face.a].y - offset, z: vertices[face.a].z - offset},
					{ x: vertices[face.b].x - offset, y: vertices[face.b].y - offset, z: vertices[face.b].z - offset },
					{ x: vertices[face.c].x - offset, y: vertices[face.c].y - offset, z: vertices[face.c].z - offset }
				]);

			} else if ( face instanceof THREE.Face4 ) {

				triangles.push([
					{ x: vertices[face.a].x, y: vertices[face.a].y, z: vertices[face.a].z },
					{ x: vertices[face.b].x, y: vertices[face.b].y, z: vertices[face.b].z },
					{ x: vertices[face.d].x, y: vertices[face.d].y, z: vertices[face.d].z }
				]);
				triangles.push([
					{ x: vertices[face.b].x, y: vertices[face.b].y, z: vertices[face.b].z },
					{ x: vertices[face.c].x, y: vertices[face.c].y, z: vertices[face.c].z },
					{ x: vertices[face.d].x, y: vertices[face.d].y, z: vertices[face.d].z }
				]);

			}
		}

    if(shape === "concave")this.rigidBody = Ammo.Utils.createStaticConcave( triangles, mesh, x, y, z );
    if(shape === "box")this.rigidBody = Ammo.Utils.createDynamicBox( 10, 10, 10, mesh);
    }

    this.renderMesh = new THREE.Mesh( mesh.geometry, mesh.material );
    this.renderMesh.position.set( x, y, z );
    this.renderMesh.matrixWorld.setPosition( this.renderMesh.position );
    
    this.renderMesh.castShadow = true;
    this.renderMesh.receiveShadow = true;
    this.renderMesh.matrixAutoUpdate = false;
    mesh.rigidBody = this.rigidBody

  }

  init.call( this );

}

THREE.Mesh.prototype.updatePhysics = function(){/* use only if mesh is non-static*/



      var transform = new Ammo.btTransform()
      
      this.rigidBody.getMotionState().getWorldTransform(transform);
      var origin = transform.getOrigin();
      var rotation = transform.getRotation();
      /*this.rotation.x = rotation.x();
      this.rotation.y = rotation.y();
      this.rotation.z = rotation.z();*/
      this.position.x = origin.x()
      this.position.y = origin.y()
      this.position.z = origin.z()
  
}