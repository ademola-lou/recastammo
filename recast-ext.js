/**
 * @author CEDRIC / https://github.com/qiao
 */
     
  THREE.RecastJSPlugin = /** @class */ (function () {
    /**
     * Initializes the recastJS plugin
     * @param recastInjection can be used to inject your own recast reference
     */
    function RecastJSPlugin(recastInjection) {
        if (recastInjection === void 0) { recastInjection = Recast; }
        /**
         * Reference to the Recast library
         */
        this.bjsRECAST = {};
        /**
         * plugin name
         */
        this.name = "RecastJSPlugin";
        if (typeof recastInjection === "function") {
            recastInjection(this.bjsRECAST);
        }
        else {
            this.bjsRECAST = recastInjection;
        }
        if (!this.isSupported()) {
            console.error("RecastJS is not available. Please make sure you included the js file.");
            return;
        }
    }
    /**
     * Creates a navigation mesh
     * @param meshes array of all the geometry used to compute the navigatio mesh
     * @param parameters bunch of parameters used to filter geometry
     */
    RecastJSPlugin.prototype.createNavMesh = function (meshes, parameters) {
        var rc = new this.bjsRECAST.rcConfig();
        rc.cs = parameters.cs;
        rc.ch = parameters.ch;
        rc.borderSize = 0;
        rc.tileSize = 0;
        rc.walkableSlopeAngle = parameters.walkableSlopeAngle;
        rc.walkableHeight = parameters.walkableHeight;
        rc.walkableClimb = parameters.walkableClimb;
        rc.walkableRadius = parameters.walkableRadius;
        rc.maxEdgeLen = parameters.maxEdgeLen;
        rc.maxSimplificationError = parameters.maxSimplificationError;
        rc.minRegionArea = parameters.minRegionArea;
        rc.mergeRegionArea = parameters.mergeRegionArea;
        rc.maxVertsPerPoly = parameters.maxVertsPerPoly;
        rc.detailSampleDist = parameters.detailSampleDist;
        rc.detailSampleMaxError = parameters.detailSampleMaxError;
        this.navMesh = new this.bjsRECAST.NavMesh();
        var index;
        var tri;
        var pt;
        var indices = [];
        var positions = [];
        var offset = 0;
        for (index = 0; index < meshes.length; index++) {
            if (meshes[index]) {
                var mesh = meshes[index];
              console.log(mesh.geometry)
                
              if(!mesh.geometry.attributes){
              cloned_geom = mesh.geometry.clone()
              mesh.geometry = THREE.BufferGeometryUtils.mergeVertices( new THREE.BufferGeometry().fromGeometry(cloned_geom), .0 )
              console.log("convert to indexed mesh")
              }
            }
        }
          
          this.navMesh.build(mesh.geometry.attributes.position.array, mesh.geometry.attributes.position.counts, mesh.geometry.index.array, mesh.geometry.index.count, rc);
    };
    /**
     * Create a navigation mesh debug mesh
     * @param scene is where the mesh will be added
     * @returns debug display mesh
     */
    RecastJSPlugin.prototype.createDebugNavMesh = function (scene) {
         var tri;
        var pt;
        var debugNavMesh = this.navMesh.getDebugNavMesh();
        var triangleCount = debugNavMesh.getTriangleCount();
        var indices = [];
        var positions = [];
        var geometry = new THREE.BufferGeometry();

        for (tri = 0; tri < triangleCount * 3; tri++) {
            indices.push(tri);
        }
        for (tri = 0; tri < triangleCount; tri++) {
            for (pt = 0; pt < 3; pt++) {
                var point = debugNavMesh.getTriangle(tri).getPoint(pt);
                positions.push(new THREE.Vector3(point.x, point.y, point.z));
                  ///geometry.vertices.push(new THREE.Vector3(point.x, point.y, point.z));
            }
        }
        geometry.setFromPoints(positions);
        geometry.setIndex(indices);
        var mesh = new THREE.Mesh(geometry)
        return mesh;
    };
    /**
     * Get a navigation mesh constrained position, closest to the parameter position
     * @param position world position
     * @returns the closest point to position constrained by the navigation mesh
     */
    RecastJSPlugin.prototype.getClosestPoint = function (position) {
        var p = new this.bjsRECAST.Vec3(position.x, position.y, position.z);
        var ret = this.navMesh.getClosestPoint(p);
        var pr = new THREE.Vector3(ret.x, ret.y, ret.z);
        return pr;
    };
    /**
     * Get a navigation mesh constrained position, within a particular radius
     * @param position world position
     * @param maxRadius the maximum distance to the constrained world position
     * @returns the closest point to position constrained by the navigation mesh
     */
    RecastJSPlugin.prototype.getRandomPointAround = function (position, maxRadius) {
        var p = new this.bjsRECAST.Vec3(position.x, position.y, position.z);
        var ret = this.navMesh.getRandomPointAround(p, maxRadius);
        var pr = new THREE.Vector3(ret.x, ret.y, ret.z);
        return pr;
    };
    /**
     * Compute the final position from a segment made of destination-position
     * @param position world position
     * @param destination world position
     * @returns the resulting point along the navmesh
     */
    RecastJSPlugin.prototype.moveAlong = function (position, destination) {
        var p = new this.bjsRECAST.Vec3(position.x, position.y, position.z);
        var d = new this.bjsRECAST.Vec3(destination.x, destination.y, destination.z);
        var ret = this.navMesh.moveAlong(p, d);
        var pr = new THREE.Vector3(ret.x, ret.y, ret.z);
        return pr;
    };
    /**
     * Compute a navigation path from start to end. Returns an empty array if no path can be computed
     * @param start world position
     * @param end world position
     * @returns array containing world position composing the path
     */
    RecastJSPlugin.prototype.computePath = function (start, end) {
        var pt;
        var startPos = new this.bjsRECAST.Vec3(start.x, start.y, start.z);
        var endPos = new this.bjsRECAST.Vec3(end.x, end.y, end.z);
        var navPath = this.navMesh.computePath(startPos, endPos);
        var pointCount = navPath.getPointCount();
        var positions = [];
        for (pt = 0; pt < pointCount; pt++) {
            var p = navPath.getPoint(pt);
            positions.push(new THREE.Vector3(p.x, p.y, p.z));
        }
        return positions;
    };
    /**
     * Create a new Crowd so you can add agents
     * @param maxAgents the maximum agent count in the crowd
     * @param maxAgentRadius the maximum radius an agent can have
     * @param scene to attach the crowd to
     * @returns the crowd you can add agents to
     */
    RecastJSPlugin.prototype.createCrowd = function (maxAgents, maxAgentRadius, scene) {
        var crowd = new RecastJSCrowd(this, maxAgents, maxAgentRadius, scene);
        return crowd;
    };
    /**
     * Set the Bounding box extent for doing spatial queries (getClosestPoint, getRandomPointAround, ...)
     * The queries will try to find a solution within those bounds
     * default is (1,1,1)
     * @param extent x,y,z value that define the extent around the queries point of reference
     */
    RecastJSPlugin.prototype.setDefaultQueryExtent = function (extent) {
        var ext = new this.bjsRECAST.Vec3(extent.x, extent.y, extent.z);
        this.navMesh.setDefaultQueryExtent(ext);
    };
    /**
     * Get the Bounding box extent specified by setDefaultQueryExtent
     * @returns the box extent values
     */
    RecastJSPlugin.prototype.getDefaultQueryExtent = function () {
        var p = this.navMesh.getDefaultQueryExtent();
        return new THREE.Vector3(p.x, p.y, p.z);
    };
    /**
     * Disposes
     */
    RecastJSPlugin.prototype.dispose = function () {
    };
    /**
     * If this plugin is supported
     * @returns true if plugin is supported
     */
    RecastJSPlugin.prototype.isSupported = function () {
        return this.bjsRECAST !== undefined;
    };
    return RecastJSPlugin;
}());