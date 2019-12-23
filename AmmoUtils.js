
Ammo.Utils = {

  // -----------------------------------------------------------------------------
  b2three: function( trans, mat ) {

    var basis = trans.getBasis();
    var origin = trans.getOrigin();
    var m = mat.elements;
    var v = basis.getRow(0);
    m[0] = v.x(); m[4+0] = v.y(); m[8+0] = v.z(); m[12+0] = origin.x();
    v = basis.getRow(1);
    m[1] = v.x(); m[4+1] = v.y(); m[8+1] = v.z(); m[12+1] = origin.y();
    v = basis.getRow(2);
    m[2] = v.x(); m[4+2] = v.y(); m[8+2] = v.z(); m[12+2] = origin.z();
    m[3] = 0.0; m[4+3] = 0.0; m[8+3] = 0.0; m[12+3] = 1.0;

  },

  // -----------------------------------------------------------------------------
  createAmmoVector3FromThree: function( threeVector ) {

    return new Ammo.btVector3( threeVector.x, threeVector.y, threeVector.z );

  },

  // -----------------------------------------------------------------------------
  createWorld: function( gravity) {

    gravity = ( gravity != undefined ) ? gravity: -10;

    var collision_config = new Ammo.btDefaultCollisionConfiguration();
    var dispatcher = new Ammo.btCollisionDispatcher( collision_config );
    var overlappingPairCache =  new Ammo.btDbvtBroadphase();
    var solver = new Ammo.btSequentialImpulseConstraintSolver();
    var dynamicsWorld = new Ammo.btDiscreteDynamicsWorld( dispatcher, overlappingPairCache, solver, collision_config );
    dynamicsWorld.setGravity(new Ammo.btVector3(0, gravity, 0));
    return dynamicsWorld;

  },

  // -----------------------------------------------------------------------------
  createStaticBox: function( xdim, ydim, zdim, x, y, z ) {

    var shape = new Ammo.btBoxShape( new Ammo.btVector3( xdim / 2, ydim / 2, zdim / 2 ) );
    var transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( x, y, z ) );
    var localInertia = new Ammo.btVector3( 0, 0, 0 );
    var motionState = new Ammo.btDefaultMotionState( transform );
    var cInfo = new Ammo.btRigidBodyConstructionInfo( 0, motionState, shape, localInertia);
    var body = new Ammo.btRigidBody(cInfo);

    return body;

  },
createDynamicBox: function( xdim, ydim, zdim, mesh) {

    var shape = new Ammo.btBoxShape( new Ammo.btVector3( xdim / 2, ydim / 2, zdim / 2 ) );
    var transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( mesh.position.x, mesh.position.y, mesh.position.z ) );
    var localInertia = new Ammo.btVector3( 0, 0, 0 );
    var motionState = new Ammo.btDefaultMotionState( transform );
    var cInfo = new Ammo.btRigidBodyConstructionInfo( 10, motionState, shape, localInertia);
    var body = new Ammo.btRigidBody(cInfo);
    body.setDamping( 0.25, 0.25 );
    return body;

  },

  // -----------------------------------------------------------------------------
  createStaticCylinder: function( xdim, ydim, zdim, x, y, z ) {

    var shape = new Ammo.btCylinderShape( new Ammo.btVector3( xdim / 2, ydim, zdim / 2 ) );
    var transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( x, y, z ) );
    var localInertia = new Ammo.btVector3( 0, 0, 0 );
    var motionState = new Ammo.btDefaultMotionState( transform );
    var cInfo = new Ammo.btRigidBodyConstructionInfo( 0, motionState, shape, localInertia);
    var body = new Ammo.btRigidBody(cInfo);

    return body;

  },
  createDynamicCylinder: function( xdim, ydim, zdim, x, y, z ) {

    var shape = new Ammo.btCylinderShape( new Ammo.btVector3( xdim / 2, ydim, zdim / 2 ) );
    var transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( x, y, z ) );
    var localInertia = new Ammo.btVector3( 0, 0, 0 );
    var motionState = new Ammo.btDefaultMotionState( transform );
    var cInfo = new Ammo.btRigidBodyConstructionInfo( 1, motionState, shape, localInertia);
    var body = new Ammo.btRigidBody(cInfo);

    return body;

  },
  // -----------------------------------------------------------------------------
  createStaticConvexHull: function( points, mesh) {

    var shape = new Ammo.btConvexHullShape();

    for ( var i = 0; i < points.length; i+= 3 ) {

      var point = new Ammo.btVector3( points[ i ], points[ i + 1 ], points[ i + 2 ] );
      shape.addPoint( point );
    }

    

    var transform = new Ammo.btTransform();
    transform.setRotation(new Ammo.btQuaternion(mesh.quaternion.x, mesh.quaternion.y, mesh.quaternion.z, mesh.quaternion.w));
    transform.setOrigin( new Ammo.btVector3( mesh.position.x, mesh.position.y, mesh.position.z ) );
    var localInertia = new Ammo.btVector3( 0, 0, 0 );
    var motionState = new Ammo.btDefaultMotionState( transform );
    var cInfo = new Ammo.btRigidBodyConstructionInfo( 1, motionState, shape, localInertia);
    var body = new Ammo.btRigidBody(cInfo);

    return body;

  },

    createStaticConcave: function(triangles, mesh){
    
      var i, triangle, triangle_mesh = new Ammo.btTriangleMesh;
			for ( i = 0; i < triangles.length; i++ ) {
				triangle = triangles[i];
				triangle_mesh.addTriangle(
					new Ammo.btVector3( triangle[0].x, triangle[0].y, triangle[0].z ),
					new Ammo.btVector3( triangle[1].x, triangle[1].y, triangle[1].z ),
					new Ammo.btVector3( triangle[2].x, triangle[2].y, triangle[2].z ),
					true
				);
			}

			var shape = new Ammo.btBvhTriangleMeshShape(
				triangle_mesh,
				true,
				true
			);
      
    var transform = new Ammo.btTransform();
    transform.setRotation(new Ammo.btQuaternion(mesh.quaternion.x, mesh.quaternion.y, mesh.quaternion.z, mesh.quaternion.w));
    transform.setOrigin( new Ammo.btVector3( mesh.position.x, mesh.position.y, mesh.position.z ) );
    var localInertia = new Ammo.btVector3( 0, 0, 0 );
    var motionState = new Ammo.btDefaultMotionState( transform );
    var cInfo = new Ammo.btRigidBodyConstructionInfo( 0, motionState, shape, localInertia);
    var body = new Ammo.btRigidBody(cInfo);

    return body;
    },
  // -----------------------------------------------------------------------------
  createDynamicSphere: function( radius, x, y, z ) {

    var shape = new Ammo.btSphereShape( radius );
    var transform = new Ammo.btTransform();
    var mass = 1;
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( x, y, z ) );
    var localInertia = new Ammo.btVector3( 0, 0, 0 );
    shape.calculateLocalInertia( mass, localInertia );
    var motionState = new Ammo.btDefaultMotionState( transform );
    var cInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, shape, localInertia);
    var body = new Ammo.btRigidBody( cInfo );
    body.setDamping( 0.925, 0.925 );
    return body;

  },
createDynamicCapsule: function( radius, height, x, y, z ) {

    var shape = new Ammo.btCapsuleShape( radius, height - 2 * radius);
    var transform = new Ammo.btTransform();
    var mass = 1;
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( x, y, z ) );
    var localInertia = new Ammo.btVector3( 0, 0, 0 );
    shape.calculateLocalInertia( mass, localInertia );
    var motionState = new Ammo.btDefaultMotionState( transform );
    var cInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, shape, localInertia);
    var body = new Ammo.btRigidBody( cInfo );
    body.setDamping( 0.25, 0.25 );
    return body;

  },
  // -----------------------------------------------------------------------------
  createHeightfield: function( geometry, widthSegments, heightSegments ) {

    geometry.computeBoundingBox();

    var ptr = Ammo.allocate(4 * widthSegments * heightSegments, "float", Ammo.ALLOC_NORMAL);
    var bounds = geometry.boundingBox;

    var points = [];

    var gridX = widthSegments + 1;
    var gridZ = heightSegments + 1;
    var vertCount = gridX * gridZ - 1;
    var absMaxHeight = Math.max( geometry.boundingBox.max.y, Math.abs( geometry.boundingBox.min.y ) );

    for ( var iz = 0; iz < gridZ; iz ++ ) {

        for ( var ix = 0; ix < gridX; ix ++ ) {

            var vertIndex = ( vertCount - iz * gridX ) - ix;
            Ammo.setValue( ptr + vertIndex, geometry.vertices[ vertIndex ].y, 'float' );

        }
    };

  

    for (var f = 0; f < points.length; f++) {
      Ammo.setValue(ptr + f,  points[f]  , 'float');
    }

    var shape = new Ammo.btHeightfieldTerrainShape(
      gridX,
      gridZ,
      ptr,
      1, // has no effect?
      -absMaxHeight,
      absMaxHeight,
      1,
      0,
      true
    );

    var xsize = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
    var zsize = geometry.boundingBox.max.z - geometry.boundingBox.min.z;

    var scaling = new Ammo.btVector3( 0, 0, 0 );

    shape.setLocalScaling( new Ammo.btVector3( xsize / widthSegments, 1, zsize / heightSegments ) );

    var transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( 0, 0, 0) );
    var localInertia = new Ammo.btVector3( 0, 0, 0 );
    var motionState = new Ammo.btDefaultMotionState( transform );
    var cInfo = new Ammo.btRigidBodyConstructionInfo(0, motionState, shape, localInertia);
    var body = new Ammo.btRigidBody(cInfo);

    return body;

  },

  // -----------------------------------------------------------------------------
  body2world: function(body,v3B) {

    var trans = body.getWorldTransform();
    var result = trans.op_mul(v3B);
    return result;

  }

}
