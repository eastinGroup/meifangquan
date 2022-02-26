var TouchCtrl = {
    inTouch: false,
    inZoom: false,
    firstPosition: new THREE.Vector2(0, 0),
    disVec2: 0.0,
    disVec2_first: 0.0,

    XcountOffset: 0.0,
    YcountOffset: 0.0,
    ZcountOffset: 0.0,

    ctrlCamera: "",

    Init: function(inMyCanvas) {
        inMyCanvas.removeEventListener('mousedown', TouchCtrl.OnForbidden, false);
        inMyCanvas.removeEventListener('mouseup', TouchCtrl.OnForbidden, false);
        inMyCanvas.removeEventListener('mousemove', TouchCtrl.OnForbidden, false);
        inMyCanvas.removeEventListener('mouseout', TouchCtrl.OnForbidden, false);
        inMyCanvas.removeEventListener('mousewheel', TouchCtrl.OnForbidden, false);

        inMyCanvas.removeEventListener('touchstart', TouchCtrl.OnForbidden, false);
        inMyCanvas.removeEventListener('touchmove', TouchCtrl.OnForbidden, false);
        inMyCanvas.removeEventListener('touchend', TouchCtrl.OnForbidden, false);

        inMyCanvas.addEventListener('mousedown', TouchCtrl.onCanvasMouseDown, false);
        inMyCanvas.addEventListener('mouseup', TouchCtrl.onCanvasMouseUp, false);
        inMyCanvas.addEventListener('mousemove', TouchCtrl.onCanvasMouseMove, false);
        inMyCanvas.addEventListener('mouseout', TouchCtrl.onCanvasMouseOut, false);
        inMyCanvas.addEventListener('mousewheel', TouchCtrl.OnMousewheel, false);

        inMyCanvas.addEventListener('touchstart', TouchCtrl.OnTouchStart, false);
        inMyCanvas.addEventListener('touchmove', TouchCtrl.OnTouchMove, false);
        inMyCanvas.addEventListener('touchend', TouchCtrl.OnTouchEnd, false);
    },

    SetCtrlCamera: function(willCtrlCamera) {
        TouchCtrl.ctrlCamera = willCtrlCamera;
    },

    OnMousewheel: function(event) {
        event.preventDefault();
        //		if(SpaceCamera.Zcount>=SpaceCamera.minimumZ&&SpaceCamera.Zcount<=SpaceCamera.maximumZ)
        TouchCtrl.ZcountOffset += -event.wheelDelta * 0.1;
        //		TouchCtrl.ZcountOffset=THREE.Math.clamp(TouchCtrl.ZcountOffset,0, SpaceCamera.maximumZ);	

        TouchCtrl.UpdateCamera();
    },

    OnForbidden: function(event) {
        event.preventDefault();
    },

    onCanvasMouseDown: function(event) {
        event.preventDefault();

        if (TouchCtrl.ctrlCamera) {
            TouchCtrl.ctrlCamera.countXBegin = TouchCtrl.ctrlCamera.cameraRotX.rotation.x * 57.3;
            TouchCtrl.ctrlCamera.countYBegin = TouchCtrl.ctrlCamera.cameraRotY.rotation.y * 57.3;
            //			TouchCtrl.ctrlCamera.countYBegin=TouchCtrl.ctrlCamera.camera.position.z;			
            TouchCtrl.XcountOffset = 0;
            TouchCtrl.YcountOffset = 0;
            TouchCtrl.firstPosition = new THREE.Vector2(event.clientX, event.clientY);
            TouchCtrl.inTouch = true;
            TouchCtrl.UpdateCamera();
        }

    },

    onCanvasMouseUp: function(event) {
        event.preventDefault();
        TouchCtrl.inTouch = false;
        TouchCtrl.UpdateCamera();
    },

    onCanvasMouseMove: function(event) {
        event.preventDefault();
        if (TouchCtrl.inTouch) {
            TouchCtrl.XcountOffset = TouchCtrl.firstPosition.x - event.clientX;
            TouchCtrl.YcountOffset = TouchCtrl.firstPosition.y - event.clientY;
        }

        TouchCtrl.UpdateCamera();

    },

    onCanvasMouseOut: function(event) {
        TouchCtrl.inTouch = false;
        TouchCtrl.UpdateCamera();
    },

    OnTouchStart: function(event) {
        event.preventDefault();

        if (TouchCtrl.ctrlCamera) {
            TouchCtrl.inTouch = true;

            TouchCtrl.ctrlCamera.countXBegin = TouchCtrl.ctrlCamera.cameraRotX.rotation.x * 57.3;
            TouchCtrl.ctrlCamera.countYBegin = TouchCtrl.ctrlCamera.cameraRotY.rotation.y * 57.3;

            if (event.targetTouches.length == 2) {
                TouchCtrl.ZcountOffset = 0;
                TouchCtrl.disVec2 = new THREE.Vector2(event.targetTouches[0].clientX - event.targetTouches[1].clientX, event.targetTouches[0].clientY - event.targetTouches[1].clientY);
                TouchCtrl.disVec2_first = TouchCtrl.disVec2.length();
                //下面是个bug
                TouchCtrl.ctrlCamera.countZBegin = TouchCtrl.ctrlCamera.Zcount;
            } else {
                TouchCtrl.inZoom = false;
            }

            TouchCtrl.XcountOffset = 0;
            TouchCtrl.YcountOffset = 0;
            TouchCtrl.firstPosition.x = event.targetTouches[0].clientX;
            TouchCtrl.firstPosition.y = event.targetTouches[0].clientY;
            TouchCtrl.UpdateCamera();
        }
    },

    OnTouchMove: function(event) {
        event.preventDefault();

        if (TouchCtrl.ctrlCamera) {
            TouchCtrl.inTouch = true;
            if (event.targetTouches.length == 1 && !TouchCtrl.inZoom) {
                TouchCtrl.XcountOffset = TouchCtrl.firstPosition.x - event.targetTouches[0].clientX;
                TouchCtrl.YcountOffset = TouchCtrl.firstPosition.y - event.targetTouches[0].clientY;
            } else if (event.targetTouches.length == 2) {
                TouchCtrl.inZoom = true;
                TouchCtrl.ctrlCamera.countXBegin = TouchCtrl.ctrlCamera.cameraRotX.rotation.x * 57.3;
                TouchCtrl.ctrlCamera.countYBegin = TouchCtrl.ctrlCamera.cameraRotY.rotation.y * 57.3;
                var disVec2 = new THREE.Vector2(event.targetTouches[0].clientX - event.targetTouches[1].clientX, event.targetTouches[0].clientY - event.targetTouches[1].clientY);
                TouchCtrl.ZcountOffset = (TouchCtrl.disVec2_first - disVec2.length()) * 5;
            }
            TouchCtrl.UpdateCamera();
        }

    },

    OnTouchEnd: function(event) {
        event.preventDefault();
        TouchCtrl.inTouch = false;
        TouchCtrl.UpdateCamera();

        //		console.log(TouchCtrl.ctrlCamera.Zcount);		
        //		console.log(CameraUniversal.Zcount)


        if (TouchCtrl.ctrlCamera.maximumZ < 0.01) {
            TouchCtrl.ctrlCamera.Xcount = 0;
        }

    },

    UpdateCamera: function() {
        if (TouchCtrl.ctrlCamera) {
            TouchCtrl.ctrlCamera.setUpdateState(TouchCtrl.XcountOffset, TouchCtrl.YcountOffset, TouchCtrl.ZcountOffset);
        }
    },

}


var CameraUniversal = {

    cameraName: "",
    compass: "",
    zhiBeiZhenCorrect: 0.0,

    sommthFactor: 0.08,

    countXBegin: 0.0,
    countYBegin: 0.0,
    countZBegin: 0.0,

    Xcount: 0.0,
    Ycount: 0.0,
    Zcount: 0.0,

    Xsmooth: 0.0,
    Ysmooth: 0.0,
    Zsmooth: 0.0,

    minimumX: 0.0,
    maximumX: 0.0,

    minimumZ: 0.0,
    maximumZ: 1000.0,

    camera: "",
    camBase: "",
    cameraRotX: "",
    cameraRotY: "",

    //	
    defaultXcount: 0.0,
    defaultYcount: 0.0,
    defaultZcount: 0.0,

    defaultPosX: 0.0,
    defaultPosY: 0.0,
    defaultPosZ: 0.0,

    posX: 0.0,
    posY: 0.0,
    posZ: 0.0,

    smoothPosX: 0.0,
    smoothPosY: 0.0,
    smoothPosZ: 0.0,

    Init: function() {


        CameraUniversal.camera = new THREE.PerspectiveCamera(70, 1000.0 / 800.0, 0.1, 1000);

        CameraUniversal.camBase = new THREE.Object3D();
        CameraUniversal.cameraRotX = new THREE.Object3D();
        CameraUniversal.cameraRotY = new THREE.Object3D();

        CameraUniversal.camBase.name = "camBase";
        CameraUniversal.cameraRotX.name = "cameraRotX";
        CameraUniversal.cameraRotY.name = "cameraRotY";

        CameraUniversal.cameraRotX.add(CameraUniversal.camera);
        CameraUniversal.cameraRotY.add(CameraUniversal.cameraRotX);
        CameraUniversal.camBase.add(CameraUniversal.cameraRotY);


        //创建指北针		
        var geometry = new THREE.BufferGeometry();
        var vertices = new Float32Array([-1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,
            1.0, 1.0, 1.0,

            1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0
        ]);

        var uv = new Float32Array([
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,

            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,
        ]);


        geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.addAttribute('uv', new THREE.BufferAttribute(uv, 2));
        var material = new THREE.MeshBasicMaterial({
            color: 0xffffff
        });
        material.depthWrite = false;
        material.depthFunc = THREE.AlwaysDepth;
        material.transparent = true;
        var compassG = new THREE.Mesh(geometry, material);

        CameraUniversal.compass = compassG;
        CameraUniversal.compass.scale.x = 0.15;
        CameraUniversal.compass.scale.y = 0.15;
        CameraUniversal.compass.scale.z = 0.15;
        CameraUniversal.compass.position.x = -1;
        CameraUniversal.compass.position.y = 0.9;
        CameraUniversal.compass.position.z = -2;
        CameraUniversal.compass.renderOrder = 10000;

        CameraUniversal.camera.add(CameraUniversal.compass);
        CameraUniversal.compass.visible = false;

    },

    SetInitStates: function(inCamAspect, fieldOfView, nearClip, farClip) {
        CameraUniversal.camera.aspect = inCamAspect;
        CameraUniversal.camera.fov = fieldOfView;
        CameraUniversal.camera.near = nearClip;
        CameraUniversal.camera.far = farClip;
        CameraUniversal.camera.updateProjectionMatrix();

    },


    SetupCameraCtrl: function(json, fastTo) {

        CameraUniversal.RecordDefaultState(json[0], json[1], json[2], -json[3], -json[4], json[5]);
        CameraUniversal.SetCameraPos(json[0], json[1], json[2]);

        console.log();

        CameraUniversal.minimumX = json[9];
        CameraUniversal.maximumX = json[10];

        CameraUniversal.minimumZ = json[11];
        CameraUniversal.maximumZ = json[12];

        CameraUniversal.zhiBeiZhenCorrect = json[13];

        CameraUniversal.camBase.updateMatrix();
        CameraUniversal.ResetCameraState(fastTo);
        //添加微量变化,以便会渲染动画
        CameraUniversal.Zcount += 0.01;
        RenderOneFrame();
    },

    RecordDefaultState: function(iposX, iposY, iposZ, defaultX, defaultY, defaultZ) {
        CameraUniversal.defaultPosX = iposX;
        CameraUniversal.defaultPosY = iposY;
        CameraUniversal.defaultPosZ = iposZ;

        CameraUniversal.defaultXcount = defaultX;
        CameraUniversal.defaultYcount = CameraUniversal.ModiferYCount(CameraUniversal.Ycount, defaultY);
        CameraUniversal.defaultZcount = defaultZ;
    },

    SetCameraPos: function(iPosX, iPosY, iPosZ) {

        if (iPosX !== "") {
            CameraUniversal.posX = Number(iPosX);
        }

        if (iPosY !== "") {
            CameraUniversal.posY = Number(iPosY);
            CameraUniversal.camBase.position.y = CameraUniversal.posY;
        }

        if (iPosZ !== "") {
            CameraUniversal.posZ = Number(iPosZ);
        }

        //		console.log(CameraUniversal.posX);
        //		console.log(CameraUniversal.posY);
        //		console.log(CameraUniversal.posZ);

    },


    ModiferYCount: function(currentYcount, toYcount) {
        var outYcount;
        var currentLess360 = currentYcount % 360.0;
        var yLess360 = toYcount % 360.0;

        if (yLess360 < 0.0) {
            yLess360 += 360.0;
        }

        if (currentLess360 < 0.0) {
            currentLess360 += 360.0;
        }

        if (currentLess360 > yLess360) {
            if (currentLess360 - yLess360 > 180.0) {
                yLess360 = yLess360 + 360.0;
            }
            outYcount = currentYcount + yLess360 - currentLess360;
        } else {
            if (currentLess360 - yLess360 < -180.0) {
                currentLess360 = currentLess360 + 360.0;
            }
            outYcount = currentYcount - (currentLess360 - yLess360);
        }

        return outYcount;

    },


    SetCameraXYZcount: function(iXcount, iYcount, iZcount) {
        if (iXcount != "") {
            CameraUniversal.Xcount = -Number(iXcount);
            CameraUniversal.countXBegin = CameraUniversal.Xcount;
        }

        if (iYcount != "") {
            //			CameraUniversal.Ycount=iYcount;
            CameraUniversal.Ycount = CameraUniversal.ModiferYCount(CameraUniversal.Ycount, -Number(iYcount));
            CameraUniversal.countYBegin = CameraUniversal.Ycount;
        }
        if (iZcount != "") {
            CameraUniversal.Zcount = Number(iZcount);
            CameraUniversal.countZBegin = CameraUniversal.Zcount;
        }

        TouchCtrl.XcountOffset = 0;
        TouchCtrl.YcountOffset = 0;
        TouchCtrl.ZcountOffset = 0;

        //		console.log(CameraUniversal);

    },

    SetCameraStates: function(inCameraStates) {
        //		console.log(inCameraStates);		
        CameraUniversal.SetCameraPos(inCameraStates[0], inCameraStates[1], inCameraStates[2]);
        CameraUniversal.SetCameraXYZcount(inCameraStates[3], inCameraStates[4], inCameraStates[5]);
    },

    ResetCameraState: function(isFast) {

        CameraUniversal.countXBegin = CameraUniversal.defaultXcount;
        CameraUniversal.countYBegin = CameraUniversal.defaultYcount;
        CameraUniversal.countZBegin = CameraUniversal.defaultZcount;

        CameraUniversal.Xcount = CameraUniversal.defaultXcount;
        CameraUniversal.Ycount = CameraUniversal.defaultYcount;
        CameraUniversal.Zcount = CameraUniversal.defaultZcount;

        CameraUniversal.posX = CameraUniversal.defaultPosX;
        CameraUniversal.posY = CameraUniversal.defaultPosY;
        CameraUniversal.posZ = CameraUniversal.defaultPosZ;

        TouchCtrl.XcountOffset = 0;
        TouchCtrl.YcountOffset = 0;
        TouchCtrl.ZcountOffset = 0;

        if (isFast) {
            CameraUniversal.Xsmooth = CameraUniversal.Xcount;
            CameraUniversal.Ysmooth = CameraUniversal.Ycount;
            CameraUniversal.Zsmooth = CameraUniversal.Zcount;

            CameraUniversal.smoothPosX = CameraUniversal.defaultPosX;
            CameraUniversal.smoothPosY = CameraUniversal.defaultPosY;
            CameraUniversal.smoothPosZ = CameraUniversal.defaultPosZ;
        }
    },

    setUpdateState: function(iXconutOffset, iYconutOffset, iZconutOffset) {
        CameraUniversal.Xcount = CameraUniversal.countXBegin + 0.5 * iYconutOffset;
        CameraUniversal.Ycount = CameraUniversal.countYBegin + 0.5 * iXconutOffset;
        CameraUniversal.Zcount = CameraUniversal.countZBegin + 0.1 * iZconutOffset;
        //			console.log(CameraUniversal.iZconutOffset);	
    },

    NeedUpdate: function() {

        CameraUniversal.Xcount = THREE.Math.clamp(CameraUniversal.Xcount, -CameraUniversal.maximumX, -CameraUniversal.minimumX);

        CameraUniversal.Zcount = THREE.Math.clamp(CameraUniversal.Zcount, CameraUniversal.minimumZ, CameraUniversal.maximumZ);


        CameraUniversal.Xsmooth = CameraUniversal.Xsmooth * (1 - CameraUniversal.sommthFactor) + CameraUniversal.Xcount * CameraUniversal.sommthFactor;
        CameraUniversal.Ysmooth = CameraUniversal.Ysmooth * (1 - CameraUniversal.sommthFactor) + CameraUniversal.Ycount * CameraUniversal.sommthFactor;
        CameraUniversal.Zsmooth = CameraUniversal.Zsmooth * (1 - CameraUniversal.sommthFactor) + CameraUniversal.Zcount * CameraUniversal.sommthFactor;

        CameraUniversal.smoothPosX = CameraUniversal.smoothPosX * (1 - CameraUniversal.sommthFactor) + CameraUniversal.posX * CameraUniversal.sommthFactor;
        CameraUniversal.smoothPosZ = CameraUniversal.smoothPosZ * (1 - CameraUniversal.sommthFactor) + CameraUniversal.posZ * CameraUniversal.sommthFactor;

        CameraUniversal.camBase.position.x = CameraUniversal.smoothPosX;
        CameraUniversal.camBase.position.z = CameraUniversal.smoothPosZ;

        CameraUniversal.cameraRotX.rotation.x = CameraUniversal.Xsmooth / 57.3;
        CameraUniversal.cameraRotY.rotation.y = CameraUniversal.Ysmooth / 57.3;

        CameraUniversal.camera.position.z = CameraUniversal.Zsmooth;
        CameraUniversal.compass.rotation.z = -CameraUniversal.cameraRotY.rotation.y + CameraUniversal.zhiBeiZhenCorrect;







        if (TouchCtrl.inTouch && CameraUniversal.Zcount < 1.0) {
            var forward = CameraUniversal.cameraRotY.getWorldDirection();

            forward.x = -forward.x;
            forward.y = -forward.y;
            forward.z = -forward.z;

            var canMove = true;

            var collisionRay = new THREE.Ray(CameraUniversal.camBase.position, forward);

            //			console.log(CameraUniversal.camBase.position);
            //			console.log(forward);			

            if (SenceInteractive.pzMeshPosBufArray) {
                //				console.log(collisionRay);

                for (var i = 0; i < SenceInteractive.pzMeshPosBufArray.length / 9; i++) {
                    var a = new THREE.Vector3(SenceInteractive.pzMeshPosBufArray[9 * i + 0], SenceInteractive.pzMeshPosBufArray[9 * i + 1], SenceInteractive.pzMeshPosBufArray[9 * i + 2]);
                    var b = new THREE.Vector3(SenceInteractive.pzMeshPosBufArray[9 * i + 3], SenceInteractive.pzMeshPosBufArray[9 * i + 4], SenceInteractive.pzMeshPosBufArray[9 * i + 5]);
                    var c = new THREE.Vector3(SenceInteractive.pzMeshPosBufArray[9 * i + 6], SenceInteractive.pzMeshPosBufArray[9 * i + 7], SenceInteractive.pzMeshPosBufArray[9 * i + 8]);

                    var collisionPoint = collisionRay.intersectTriangle(a, b, c);

                    if (collisionPoint) {
                        var distance = CameraUniversal.camBase.position.distanceTo(collisionPoint);
                        //						console.log(distance);	

                        if (distance < 0.6) {
                            canMove = false;
                            return false;
                        } else {
                            canMove = true;
                        }

                        if (false) {
                            var geometry = new THREE.BufferGeometry();
                            var vertices = new Float32Array(SenceInteractive.pzMeshPosBufArray);

                            geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
                            var material = new THREE.MeshBasicMaterial({
                                color: 0xff0000
                            });
                            var mesh = new THREE.Mesh(geometry, material);
                            Framework3d.scene.add(mesh);
                        }
                        //						
                    }
                }
            }

            if (canMove) {
                CameraUniversal.posX = CameraUniversal.posX + forward.x * 0.02;
                CameraUniversal.posZ = CameraUniversal.posZ + forward.z * 0.02;
            }
        }


        //		console.log(CameraUniversal.Xcount)




        //		console.log(CameraUniversal.sommthFactor);
        //		console.log(CameraUniversal.maximumX);		
        //		console.log(CameraUniversal.camera.position.z);
        //		console.log(CameraUniversal.camBase.position);

        if (TouchCtrl.inTouch || Math.abs(CameraUniversal.Xsmooth - CameraUniversal.Xcount) > 0.001 || Math.abs(CameraUniversal.Ysmooth - CameraUniversal.Ycount) > 0.001 || Math.abs(CameraUniversal.Zsmooth - CameraUniversal.Zcount) > 0.001) {
            return true;
        } else {
            return false;
        }

    }

}


function GenHXBtnGroup(inAllHX) {
    if (inAllHX !== undefined && HXBtnGroup_HTML !== undefined) {
        var htmlStr = "";
        for (var i = 0; i < inAllHX.length; i++) {
            htmlStr += "<button onclick=\'Framework3d.HXFB(\"" + inAllHX[i].gameObjectName + "\"),hxName.value=\"" + inAllHX[i].gameObjectName + "\"\'>" + inAllHX[i].gameObjectName + "</button>"
        }
        //		console.log(htmlStr);		
        HXBtnGroup_HTML.innerHTML = htmlStr;
    }
}

function GenFloorBtn(inAllFloor) {
    if (inAllFloor !== undefined && floorBtnGroup_HTML !== undefined) {
        var htmlStr = "";
        for (var i = 0; i < inAllFloor.length; i++) {
            console.log(inAllFloor[i]);
            htmlStr += "<button onclick=\'Framework3d.ChooseFloor(\"" + inAllFloor[i].gameObjectName + "\")\'>" + inAllFloor[i].gameObjectName + "</button>"
        }
        //		console.log(htmlStr);		
        floorBtnGroup_HTML.innerHTML = htmlStr;
    }
}


function StartScene() {

    console.log("StartScene");
    //预处理指北针
    CameraUniversal.compass.material.map = AllResource.allMap["compass"];


    //预处理lightmap等
    for (var j = 0; j < SenceHierarchy.gameObjectList.length; j++) {

        var object = SenceHierarchy.gameObjectList[j];

        if (object != null && object.lightmapoffsetuv && object.lightmapoffsetuv[0] > -1) {

            for (var i = 0; i < object.material.length; i++) {
                //如果有烘培贴图了就不用实时光影

                var mat = object.material[i].clone();
                mat.name = object.material[i].name + "_" + object.lightmapoffsetuv[0] + "_LmpIndex";

                mat.shaderType = object.material[i].shaderType;

                mat.uniforms._Color = object.material[i].uniforms._Color;
                mat.uniforms._MainTex = object.material[i].uniforms._MainTex;
                mat.uniforms._lightmap_color = object.material[i].uniforms._lightmap_color;
                mat.uniforms._LightMap = object.material[i].uniforms._LightMap;
                mat.uniforms._LIMAP.value = object.allInnerLightMap[object.lightmapoffsetuv[0]];
                mat.uniforms._LIMAPOFFSET.value = new THREE.Vector4(object.lightmapoffsetuv[1] * 0.0001, object.lightmapoffsetuv[2] * 0.0001, object.lightmapoffsetuv[3] * 0.0001, object.lightmapoffsetuv[4] * 0.0001);

                mat.uniforms._SUNDIR = object.material[i].uniforms._SUNDIR;
                mat.uniforms._SUNINTENSITY = object.material[i].uniforms._SUNINTENSITY;

                //				mat.uniforms._BlendLight.value=0.0;					

                //alpha
                if (mat.shaderType === 0) {
                    AllResource.globalUpdateUniform.push(mat.uniforms);
                }

                //cube,middleGlass
                if (mat.shaderType === 2 || mat.shaderType === 3 || mat.shaderType === 4) {
                    mat.uniforms._ENVMAP = object.material[i].uniforms._ENVMAP;
                    mat.uniforms._Smooth = object.material[i].uniforms._Smooth;
                    mat.uniforms._Reflect = object.material[i].uniforms._Reflect;
                    mat.uniforms._FresnelPower = object.material[i].uniforms._FresnelPower;
                    mat.uniforms._FresnelBias = object.material[i].uniforms._FresnelBias;
                }

                //treeleaf
                if (mat.shaderType === 6 || mat.shaderType === 7) {
                    mat.alphaTest = object.material[i].alphaTest;
                }

                if (mat.shaderType === 8) {
                    mat.uniforms._WaveSpeed = object.material[i].uniforms._WaveSpeed;
                    mat.uniforms._BumpMap = object.material[i].uniforms._BumpMap;
                    mat.uniforms._ENVMAP = object.material[i].uniforms._ENVMAP;
                    mat.uniforms._Smooth = object.material[i].uniforms._Smooth;
                    mat.uniforms._Reflect = object.material[i].uniforms._Reflect;
                    mat.uniforms._FresnelPower = object.material[i].uniforms._FresnelPower;
                    mat.uniforms._FresnelBias = object.material[i].uniforms._FresnelBias;
                    AllResource.globalUpdateUniform.push(mat.uniforms);
                }


                object.material[i] = mat;

            }
            //			console.log(object.name);
            //			console.log(object.allInnerLightMap[object.lightmapoffsetuv[0]]);
        }
    }



    //预处理交互信息

    if (SenceInteractive.homeInteAction) {
        if (SenceInteractive.homeInteAction.needDisplayRoot > -1)
            SenceHierarchy.gameObjectList[SenceInteractive.homeInteAction.needDisplayRoot].visible = false;
    }

    if (SenceInteractive.introInteAction) {
        if (SenceInteractive.introInteAction.needDisplayRoot > -1)
            SenceHierarchy.gameObjectList[SenceInteractive.introInteAction.needDisplayRoot].visible = false;
    }
    if (SenceInteractive.areaInteAction) {
        if (SenceInteractive.areaInteAction.needDisplayRoot > -1)
            SenceHierarchy.gameObjectList[SenceInteractive.areaInteAction.needDisplayRoot].visible = false;
    }
    if (SenceInteractive.trafficInteAction) {
        if (SenceInteractive.trafficInteAction.needDisplayRoot > -1)
            SenceHierarchy.gameObjectList[SenceInteractive.trafficInteAction.needDisplayRoot].visible = false;
    }
    if (SenceInteractive.supportsInteAction && SenceInteractive.supportsInteAction.needDisplayRoot > -1) {
        if (SenceInteractive.trafficInteAction.needDisplayRoot > -1)
            SenceHierarchy.gameObjectList[SenceInteractive.supportsInteAction.needDisplayRoot].visible = false;
    }


    if (SenceInteractive.hxfbInteActionGroup) {
        for (var i = 0; i < SenceInteractive.hxfbInteActionGroup.length; i++) {
            if (SenceInteractive.hxfbInteActionGroup[i].needDisplayRoot > -1)
                SenceHierarchy.gameObjectList[SenceInteractive.hxfbInteActionGroup[i].needDisplayRoot].visible = false;
        }
    }


    var pvrtcSupport = Framework3d.renderer.extensions.get('WEBGL_compressed_texture_pvrtc');
    var s3tcSupport = Framework3d.renderer.extensions.get('WEBGL_compressed_texture_s3tc');
    var etcSupport = Framework3d.renderer.extensions.get('WEBGL_compressed_texture_etc1');
    var textureLodSupport = Framework3d.renderer.extensions.get('EXT_shader_texture_lod');


    var stringTT = "";

    if (pvrtcSupport !== null) {
        stringTT += "pvr";
    } else if (s3tcSupport !== null) {
        stringTT += "s3tc";
    } else if (etcSupport !== null) {

    };

    if (textureLodSupport !== null) {
        stringTT += ",textureLodSupport";
    }

    console.log("Hardware_" + stringTT);

    Framework3d.ChangeCamera(SenceInteractive.cameraUniversalCenter.initialCameraName, true);

    Framework3d.renderer.render(Framework3d.scene, Framework3d.currentCamera.camera);

    Render();



    if (navigator.userAgent.indexOf("iPad") != -1 || navigator.userAgent.indexOf("iPhone") != -1 || (navigator.userAgent.indexOf("Android") != -1)) {

    } else {
        console.log(Framework3d.scene);
    }

    /*GenHXBtnGroup(SenceInteractive.hxfbInteActionGroup);
    //生成楼层按钮
    GenFloorBtn(SenceInteractive.floorInteActionGroup);		*/

    if (Framework3d.isUseFor360Image) {


    }

}

function RenderOneFrame() {
    requestAnimationFrame(Update);
}

function Update() {
    //	SpaceCamera.NeedUpdate()
    //	console.log("fff");
    if (TouchCtrl.ctrlCamera && TouchCtrl.ctrlCamera.NeedUpdate()) {
        Framework3d.renderer.render(Framework3d.scene, Framework3d.currentCamera.camera);

        var nowTime = new Date();
        var hSecond = nowTime.getTime() % 1000000;
        for (var i = 0; i < AllResource.globalUpdateUniform.length; i++) {
            AllResource.globalUpdateUniform[i]._GLOBALTIME.value = hSecond * 0.001;
        }
    }

    /*	
    	if(!hasStart)
    	{

    	}
    */

}

function Render() {
    Framework3d.requestAinitionID = requestAnimationFrame(Render);
    Update();
}



var Framework3d = {
    myCanvas: "",
    renderer: "",
    scene: "",
    currentCamera: "",
    cameraAspect: "",
    lastDisplayObject: "",
    requestAinitionID: "",
    isUseFor360Image: "",
    isIndoor: "",

    //完全初始化
    Init: function(canvas) {
        Framework3d.isUseFor360Image = false;
        Framework3d.myCanvas = canvas;
        Framework3d.myCanvas.getContext('webgl');
        Framework3d.renderer = new THREE.WebGLRenderer({
            canvas: Framework3d.myCanvas,
            antialias: false
        });
        Framework3d.cameraAspect = Framework3d.myCanvas.width / Framework3d.myCanvas.height;
        TouchCtrl.Init(Framework3d.myCanvas);
    },

    //	currentSelectFloor
    //热加载初始化
    Init2: function() {
        CameraUniversal.Init();
        Framework3d.scene = new THREE.Scene();
        Framework3d.scene.add(CameraUniversal.camBase);
        Framework3d.currentCamera = CameraUniversal;
        //		console.log(Framework3d.renderer);

    },

    ChangeCamera: function(cameraName, fastTo) {

        var cameraInfo = SenceInteractive.cameraUniversalCenter.cameras[cameraName];

        //		console.log(cameraInfo);
        if (cameraInfo == null)
            return;
        CameraUniversal.cameraName = cameraName;
        CameraUniversal.SetInitStates(Framework3d.cameraAspect, cameraInfo.fieldOfView, cameraInfo.nearClip, cameraInfo.farClip);
        CameraUniversal.SetupCameraCtrl(cameraInfo.cameraStates, fastTo);

        Framework3d.currentCamera = CameraUniversal;

        TouchCtrl.SetCtrlCamera(CameraUniversal);

        CameraUniversal.compass.visible = true;

    },

    StopRender: function() {
        cancelAnimationFrame(Framework3d.requestAinitionID);
    },


    LoadScene: function(inSourcePath) {
        SourceLoad.textureFolder = inSourcePath + "/texture/";
        SourceLoad.geometryFolder = inSourcePath + "/geometry/";
        SourceLoad.hierarchyFolder = inSourcePath + "/hierarchy/";

        /*if(wjmloading)
        wjmloading.innerHTML="Start1";*/

        if (Framework3d.requestAinitionID)
            Framework3d.StopRender();

        Framework3d.Init2(Framework3d.myCanvas);
        AllResource.Init(Framework3d.scene);
    },

    Home: function() {

        Framework3d.ExeInteractiveAction(SenceInteractive.homeInteAction);
    },

    Intro: function() {
        //		console.log(SenceInteractive.introInteAction);
        Framework3d.ExeInteractiveAction(SenceInteractive.introInteAction);

    },

    Area: function() {
        Framework3d.ExeInteractiveAction(SenceInteractive.areaInteAction);
    },

    Traffic: function() {
        Framework3d.ExeInteractiveAction(SenceInteractive.trafficInteAction);
    },

    Supports: function() {
        Framework3d.ExeInteractiveAction(SenceInteractive.supportsInteAction);
    },

    HXFB: function(hx_name) {

        if (SenceInteractive.hxfbInteActionGroup) {
            for (var i = 0; i < SenceInteractive.hxfbInteActionGroup.length; i++) {
                //			console.log(SenceInteractive.hxfbInteActionGroup[i]);

                if (SenceInteractive.hxfbInteActionGroup[i].gameObjectName === hx_name) {
                    Framework3d.ExeInteractiveAction(SenceInteractive.hxfbInteActionGroup[i]);
                    //			console.log(SenceInteractive.hxfbInteActionGroup[i]);	
                }
            }
        }

    },

    ChooseFloor: function(floor) {

        var intAct = SenceInteractive.floorInteActionGroup;


        TouchCtrl.ctrlCamera.Xsmooth += 0.01;

        if (intAct) {
            //			console.log(intAct);

            for (var i = intAct.length - 1; i >= 0; i--) {
                if (intAct[i] && intAct[i].needDisplayRoot > -1) {
                    SenceHierarchy.gameObjectList[intAct[i].needDisplayRoot].visible = true;
                }
            }
            for (var i = intAct.length - 1; i >= 0; i--) {
                if (intAct[i].gameObjectName === floor) {
                    //						console.log(floor);

                    if (intAct[i].needSetCameraName === Framework3d.currentCamera.cameraName) {
                        TouchCtrl.ctrlCamera.SetCameraStates(intAct[i].cameraStates);
                        //						console.log(intAct[i].cameraStates);						
                    }

                    if (intAct[i].pzMesh) {
                        SenceInteractive.pzMeshPosBufArray = intAct[i].pzMesh;
                        if (false) {
                            var geometry = new THREE.BufferGeometry();
                            var vertices = new Float32Array(SenceInteractive.pzMeshPosBufArray);
                            geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
                            var material = new THREE.MeshBasicMaterial({
                                color: 0x00ff00
                            });
                            var mesh = new THREE.Mesh(geometry, material);
                            Framework3d.scene.add(mesh);
                        }
                    }
                    return;
                }



                if (!Framework3d.isIndoor && intAct[i] && intAct[i].needDisplayRoot > -1) {
                    SenceHierarchy.gameObjectList[intAct[i].needDisplayRoot].visible = false;
                }
            }
        }

    },



    ExeInteractiveAction: function(intAct) {


        Framework3d.CloseLastDisplayObject();

        if (intAct && intAct.needDisplayRoot > -1) {
            SenceHierarchy.gameObjectList[intAct.needDisplayRoot].visible = true;
            Framework3d.lastDisplayObject = SenceHierarchy.gameObjectList[intAct.needDisplayRoot];
        }

        //		console.log(Framework3d.currentCamera);	

        if (intAct && TouchCtrl.ctrlCamera && intAct.needSetCameraName === Framework3d.currentCamera.cameraName) {
            TouchCtrl.ctrlCamera.SetCameraStates(intAct.cameraStates);
        }
        TouchCtrl.ctrlCamera.Ycount += 0.01;
        TouchCtrl.ctrlCamera.Zcount += 0.01;
    },



    CloseLastDisplayObject: function() {
        //		console.log(Framework3d.lastDisplayObject);
        if (Framework3d.lastDisplayObject) {
            Framework3d.lastDisplayObject.visible = false;
            Framework3d.lastDisplayObject = "";
        }
    },

    NK: function() {

        Framework3d.isIndoor = false;

        Framework3d.ChangeCamera("CameraNK", false);

        var intAct = SenceInteractive.floorInteActionGroup;
        if (intAct) {
            for (var i = intAct.length - 1; i >= 0; i--) {
                if (intAct[i] && intAct[i].needDisplayRoot > -1) {
                    SenceHierarchy.gameObjectList[intAct[i].needDisplayRoot].visible = true;
                }
            }
        }

    },


    MY: function() {
        Framework3d.isIndoor = true;

        Framework3d.ChangeCamera("CameraMY", false);

        var intAct = SenceInteractive.floorInteActionGroup;

        if (intAct) {
            for (var i = intAct.length - 1; i >= 0; i--) {
                if (intAct[i] && intAct[i].needDisplayRoot > -1) {
                    SenceHierarchy.gameObjectList[intAct[i].needDisplayRoot].visible = true;
                }
            }
        }


        TouchCtrl.ctrlCamera.Xsmooth += 0.01;

        //设置楼层碰撞,//有设置默认漫游层否则选择非负的第一层	
        //console.log(intAct.length);

        if (intAct) {
            for (var i = 0; i < intAct.length; i++) {
                //如果有设置默认漫游层
                if (SenceInteractive.defaultMYFloorName) {
                    if (intAct[i].gameObjectName === SenceInteractive.defaultMYFloorName) {
                        SenceInteractive.pzMeshPosBufArray = intAct[i].pzMesh;
                        return;
                    }
                } else {
                    //如果没有设置默认漫游层，就设置未为最低非负层
                    if (intAct[i].gameObjectName.replace('F', '') > 0) {
                        SenceInteractive.pzMeshPosBufArray = intAct[i].pzMesh;
                        return;
                    }
                }
            }
        }





    },


    Set360Image: function() {
        Framework3d.ChangeCamera("CameraMY", false);
        TouchCtrl.ctrlCamera.Xsmooth += 0.01;
    }



}

//切换相机 Framework3d.ChangeCamera(cameraID);
//0:All Floor
//毛坯楼层 Framework3d.ChooseFloor(floor);



//初始化   Framework3d.Init(canvas);
//加载	   Framework3d.LoadScene(scenePath);
//首页     Framework3d.Home();
//简介	   Framework3d.Intro();
//区位	   Framework3d.Area();
//交通	   Framework3d.Traffic();
//配套	   Framework3d.Supports();
//户型	   Framework3d.HXFB(hx_name);
//鸟瞰	   Framework3d.NK();
//人视	   Framework3d.MY();