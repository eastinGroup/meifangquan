//AllResource-> senceHierarchy.Init();
//senceHierarchyJson load ->
//load Base Texture
//InitTotalMatsAndMapsAndTransformObject ->loadbasemat ->loadMapInfo -> loadTranfomObject
//load Meshbin -> loadMesh->  SetMeshObject->
//load Texture -> SetMatTex

//debugUse
var wjmloading_HTML = document.getElementById('wjmloading');

var SourceLoad = {
    useCompress: false,
    textureFolder: "/texture/",
    geometryFolder: "/geometry/",
    hierarchyFolder: "/hierarchy/",

    senceHierarchyName: "senceHierarchy",
    senceInteractiveName: "senceInteractive",
    f123Name: "123",
    f456Name: "456",

}

var jsonLoadingManger = new THREE.LoadingManager();
var imageLoadingManger = new THREE.LoadingManager();
var meshLoadingManger = new THREE.LoadingManager();

var senceHierarchyJsonHasLoaded = false;
var senceInteractiveJsonHasLoaded = false;
var allMeshLoaded = false;
var allImageHasLoaded = false;


var allMeshLoader = new THREE.FileLoader(meshLoadingManger);
var allMeshLoaderBin = new THREE.FileLoader(meshLoadingManger);
allMeshLoaderBin.responseType = "arraybuffer";

var shadrBin = new THREE.FileLoader(meshLoadingManger);
shadrBin.responseType = "arraybuffer";

var meshLoader = new THREE.BufferGeometryLoader();





var AllResource = {
    allGameObjectJson: "",
    senceHierarchyJson: "",
    senceInteractiveJson: "",

    allMesh: "",
    allMap: "",
    allCubeMap: "",
    allInnerLightMap: "",
    allMats: "",
    allMapbeTo: "",
    allMeshbeTo: "",
    needEnvMapMats: "",
    allShader: "",
    scene: "",
    globalUpdateUniform: "",


    Init: function(inScene) {

        //		AllResource.allGameObjectJson="";
        //		AllResource.senceHierarchyJson="";
        //		AllResource.senceInteractiveJson="";

        //		AllResource.allMesh="";
        //		AllResource.allMap="";
        //		AllResource.allCubeMap="";
        //		AllResource.allInnerLightMap="";
        //		AllResource.allMats="";
        //		AllResource.allMapbeTo="";
        //		AllResource.allMeshbeTo="";
        //		AllResource.needEnvMapMats="";
        //		AllResource.allShader="";
        //		AllResource.scene="";
        //		AllResource.globalUpdateUniform="";



        SourceLoad.useCompress = true;
        if (wjmloading_HTML)
            wjmloading_HTML.innerHTML = "Start2";

        allImageHasLoaded = false;
        senceHierarchyJsonHasLoaded = false;
        senceInteractiveJsonHasLoaded = false;
        allMeshLoaded = false;
        //	 	 allCubeMapLoaded=false;

        AllResource.allMesh = new Array();
        AllResource.allMap = new Array();
        AllResource.allInnerLightMap = new Array();
        AllResource.allMats = new Array();
        AllResource.allMeshbeTo = new Array();
        AllResource.allMapbeTo = new Array();
        AllResource.allGameObjectJson = new Array();
        AllResource.allShade = new ArrayBuffer();
        AllResource.needEnvMapMats = new Array();
        AllResource.globalUpdateUniform = new Array();

        this.scene = inScene;
        SenceInteractive.Init();
        SenceHierarchy.Init();

    },

    LoadMeshBin: function(binText) {
        //binText得是arraybuffer
        var rs = AllResource.senceHierarchyJson
        var instanceCount = 0;
        //			console.log(binText);		
        for (var i = 0; i < rs.allMeshbeTo.length; i++) {
            if (rs.allMeshbeTo[i].data.index) {
                //				console.log(000);
                var index = new Uint16Array(binText, rs.allMeshbeTo[i].data.index.array[0], rs.allMeshbeTo[i].data.index.array[1]);
                rs.allMeshbeTo[i].data.index.array = index;
            }
            var vertex = new Int32Array(binText, rs.allMeshbeTo[i].data.attributes.position.array[0], rs.allMeshbeTo[i].data.attributes.position.array[1]);
            rs.allMeshbeTo[i].data.attributes.position.array = vertex;

            if (rs.allMeshbeTo[i].data.attributes.normal) {
                var normal = new Int8Array(binText, rs.allMeshbeTo[i].data.attributes.normal.array[0], rs.allMeshbeTo[i].data.attributes.normal.array[1])
                rs.allMeshbeTo[i].data.attributes.normal.array = normal;
            }

            if (rs.allMeshbeTo[i].data.attributes.uv) {
                var uv = new Int16Array(binText, rs.allMeshbeTo[i].data.attributes.uv.array[0], rs.allMeshbeTo[i].data.attributes.uv.array[1])
                rs.allMeshbeTo[i].data.attributes.uv.array = uv;
            }

            if (rs.allMeshbeTo[i].data.attributes.uv2) {
                var uv2 = new Uint16Array(binText, rs.allMeshbeTo[i].data.attributes.uv2.array[0], rs.allMeshbeTo[i].data.attributes.uv2.array[1])
                rs.allMeshbeTo[i].data.attributes.uv2.array = uv2;
            }
            //				console.log(rs.allMeshbeTo[i].data.attributes);
            if (rs.allMeshbeTo[i].data.attributes.worldPosAndScale) {
                //				console.log(222);
                var worldPosAndScale = new Int32Array(binText, rs.allMeshbeTo[i].data.attributes.worldPosAndScale.array[0], rs.allMeshbeTo[i].data.attributes.worldPosAndScale.array[1])
                rs.allMeshbeTo[i].data.attributes.worldPosAndScale.array = worldPosAndScale;
            }

            if (rs.allMeshbeTo[i].data.attributes.tangent) {
                //				console.log(222);
                var tangent = new Int8Array(binText, rs.allMeshbeTo[i].data.attributes.tangent.array[0], rs.allMeshbeTo[i].data.attributes.tangent.array[1])
                rs.allMeshbeTo[i].data.attributes.tangent.array = tangent;
            }

            var geometryBuffer = meshLoader.parse(rs.allMeshbeTo[i]);

            geometryBuffer.name = rs.allMeshbeTo[i].name;
            AllResource.allMesh[rs.allMeshbeTo[i].name] = geometryBuffer;
            //设置有模型的物体
            SetGameObjectMesh(rs.allMeshbeTo[i].name);
        };
        //模型和Tranform都加载了
        //				console.log("All Mesh Loaded!");
        //加载贴图到Mat
        AllResource.LoadTexture();
        allMeshLoaded = true;
        AllLoaded();
    },

    LoadLZMABin: function(loadName) {

        //			console.log("All Mesh Loaded!");

        allMeshLoaderBin.load(SourceLoad.geometryFolder + loadName + ".json",
            function(text) {
                var tempText = new Uint8Array(text);
                var result;

                if (SourceLoad.useCompress) {
                    result = LZF.decompress(tempText);
                } else {
                    result = tempText.buffer;
                }

                AllResource.LoadMeshBin(result);
            },
            function(xhr) {
                var loadPercent = xhr.loaded / xhr.total * 100;
                loadPercent = Math.round(loadPercent);
                $(".loadBox").html(parseInt(loadPercent / 2) + "%");
                if ($(".loadBox").html() == "100%") {
                    $(".load").hide();
                }
                loadPercent = "LoadingMesh.." + loadPercent + "%";
                console.log(loadPercent);
                if (wjmloading_HTML)
                    wjmloading_HTML.innerHTML = loadPercent;
            },
            function(xhr) {

            });
    },

    LoadTexture: function() {
        var texLoad = new THREE.TextureLoader(imageLoadingManger);


        //compassTexture
        texLoad.load(
            "./image3d/compass.png",
            function(texture) {
                texture.wrapS = THREE.ClampToEdgeWrapping;
                texture.wrapT = THREE.ClampToEdgeWrapping;
                AllResource.allMap["compass"] = texture;
                //				SetMatTex("compass");					
                //				console.log(AllResource.allMap["compass"]);

            },
            function(xhr) {
                //console.log((xhr.loaded/xhr.total*100)+'% loaded' );
            },
            function(xhr) {
                //console.log('An error happened');
            }
        );



        //allCustomTexture	
        for (var j = 0; j < AllResource.senceHierarchyJson.allCustomTexture.length; j++) {
            var fileName = AllResource.senceHierarchyJson.allCustomTexture[j].name;
            var typeName = '.' + AllResource.senceHierarchyJson.allCustomTexture[j].type;

            texLoad.load(
                SourceLoad.textureFolder + fileName + typeName,
                function(texture) {
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.RepeatWrapping;
                    var imageNameGroup = texture.image.src.split('/');
                    var imageName = imageNameGroup[imageNameGroup.length - 1].split('.')[0];
                    texture.name = imageName;
                    AllResource.allMap[imageName] = texture;
                    SetMatTex(imageName);
                    //					console.log("dddd");
                },
                function(xhr) {
                    //console.log((xhr.loaded/xhr.total*100)+'% loaded' );
                },
                function(xhr) {
                    //console.log('An error happened');
                }
            );
        }

        //allLightMap,lightmap需要设置lightmapGroup//unity3d自带烘培出来的光影贴图,如果用手动添加的烘培贴图,贴图会保存在customerTextureGroup
        for (var j = 0; j < AllResource.senceHierarchyJson.allLightmapTexture.length; j++) {
            var fileName = AllResource.senceHierarchyJson.allLightmapTexture[j].name;
            var typeName = '.' + AllResource.senceHierarchyJson.allLightmapTexture[j].type;

            texLoad.load(
                SourceLoad.textureFolder + fileName + typeName,
                function(texture) {
                    texture.wrapS = THREE.ClampToEdgeWrapping;
                    texture.wrapT = THREE.ClampToEdgeWrapping;

                    var imageNameGroup = texture.image.src.split('/');
                    //						console.log(imageNameGroup);
                    var imageName = imageNameGroup[imageNameGroup.length - 1].split('_')[0];
                    var imageID = imageName.split('-')[1];
                    //						console.log(imageID);
                    AllResource.allInnerLightMap[imageID] = texture;
                    AllResource.allInnerLightMap[imageID].name = imageID;
                    //						texture.name=imageName;				
                    //						AllResource.allMap[imageName]=texture;
                    //						SetMatTex(imageName);					
                },
                function(xhr) {
                    //console.log((xhr.loaded/xhr.total*100)+'% loaded' );
                },
                function(xhr) {
                    //console.log('An error happened');
                }
            );
        }

        //load Cubemap

        var texCubeLoad = new THREE.CubeTextureLoader(imageLoadingManger);


        for (var j = 0; j < AllResource.senceHierarchyJson.allCubeMapTexture.length; j++) {
            var cubeMapName = AllResource.senceHierarchyJson.allCubeMapTexture[j].name;
            var typeName = "." + AllResource.senceHierarchyJson.allCubeMapTexture[j].type;

            var urls2 = [
                SourceLoad.textureFolder + cubeMapName + '_0' + typeName, SourceLoad.textureFolder + cubeMapName + '_1' + typeName,
                SourceLoad.textureFolder + cubeMapName + '_2' + typeName, SourceLoad.textureFolder + cubeMapName + '_3' + typeName,
                SourceLoad.textureFolder + cubeMapName + '_4' + typeName, SourceLoad.textureFolder + cubeMapName + '_5' + typeName
            ];

            texCubeLoad.load(
                urls2,
                function(texture) {
                    //					console.log(texture);
                    var imageNameGroup = texture.image[0].src.split('/');
                    var imageName = imageNameGroup[imageNameGroup.length - 1].split('.')[0];
                    imageName = imageName.substring(0, imageName.length - 2);
                    //					console.log(imageName);
                    texture.name = imageName;
                    texture.wrapS = THREE.ClampToEdgeWrapping;
                    texture.wrapT = THREE.ClampToEdgeWrapping;
                    //					texture.generateMipmaps=true;
                    AllResource.allMap[imageName] = texture;
                    SetMatTex(imageName);
                },
                function(xhr) {
                    //console.log((xhr.loaded/xhr.total*100)+'% loaded' );
                },
                function(xhr) {
                    //console.log('An error happened');
                }
            );
        }
    }
}

var SenceHierarchy = {
    sunDir: "",
    sunIntensity: "",
    rootObject: "",
    gameObjectList: "",
    fogNearAndFar: "",
    fogColor: "",

    Init: function() {



        //添加默认白贴图,用以占位	
        var whiteBuffer = new Uint8Array(
            [255, 255, 255,
                255, 255, 255,
                255, 255, 255,
                255, 255, 255,
            ]
        )

        var grayBuffer = new Uint8Array(
            [127, 127, 127,
                127, 127, 127,
                127, 127, 127,
                127, 127, 127,
            ]
        )

        var blackBuffer = new Uint8Array(
            [0, 0, 0,
                0, 0, 0,
                0, 0, 0,
                0, 0, 0,
            ]
        )

        var bumpBuffer = new Uint8Array(
            [127, 127, 255,
                127, 127, 255,
                127, 127, 255,
                127, 127, 255,
            ]
        )


        var innerWhiteTex = new THREE.DataTexture(whiteBuffer, 2, 2, THREE.RGBFormat, THREE.UnsignedByteType)
        innerWhiteTex.needsUpdate = true;

        var innerGrayTex = new THREE.DataTexture(grayBuffer, 2, 2, THREE.RGBFormat, THREE.UnsignedByteType)
        innerGrayTex.needsUpdate = true;

        var innerBlackTex = new THREE.DataTexture(blackBuffer, 2, 2, THREE.RGBFormat, THREE.UnsignedByteType)
        innerBlackTex.needsUpdate = true;

        var innerBumpTex = new THREE.DataTexture(bumpBuffer, 2, 2, THREE.RGBFormat, THREE.UnsignedByteType)
        innerBumpTex.needsUpdate = true;

        AllResource.allMap["innerWhiteTex"] = innerWhiteTex;
        AllResource.allMap["innerGrayTex"] = innerGrayTex;
        AllResource.allMap["innerBlackTex"] = innerBlackTex;
        AllResource.allMap["innerBumpTex"] = innerBumpTex;


        images = [];
        images.push(innerWhiteTex);
        images.push(innerWhiteTex);
        images.push(innerWhiteTex);
        images.push(innerWhiteTex);
        images.push(innerWhiteTex);
        images.push(innerWhiteTex);

        AllResource.allMap["envCubeMap"] = new THREE.CubeTexture(images);

        var hierarchyLoader = new THREE.FileLoader(jsonLoadingManger);
        hierarchyLoader.responseType = "arraybuffer";
        hierarchyLoader.load(
            SourceLoad.hierarchyFolder + SourceLoad.senceHierarchyName + ".json",
            function(text) {
                var int8Array;
                if (SourceLoad.useCompress) {
                    int8Array = new Uint8Array(LZF.decompress(new Uint8Array(text)));
                } else {
                    int8Array = new Uint8Array(text);
                }

                var getText = "";

                for (var i = 0; i < int8Array.length; i++) {
                    getText += String.fromCharCode(int8Array[i]);
                }

                AllResource.senceHierarchyJson = JSON.parse(getText);
                //		    console.log(AllResource.senceHierarchyJson);

                if (AllResource.senceHierarchyJson.sun) {
                    SenceHierarchy.sunDir = new THREE.Vector3(AllResource.senceHierarchyJson.sun[0], AllResource.senceHierarchyJson.sun[1], AllResource.senceHierarchyJson.sun[2]);
                    SenceHierarchy.sunIntensity = new THREE.Vector3(AllResource.senceHierarchyJson.sunIntensity[0], AllResource.senceHierarchyJson.sunIntensity[1], AllResource.senceHierarchyJson.sunIntensity[2]);
                }
                SenceHierarchy.fogNearAndFar = new THREE.Vector2(AllResource.senceHierarchyJson.fogNearAndFar[0], AllResource.senceHierarchyJson.fogNearAndFar[1]);
                SenceHierarchy.fogColor = new THREE.Vector3(AllResource.senceHierarchyJson.fogColor[0], AllResource.senceHierarchyJson.fogColor[1], AllResource.senceHierarchyJson.fogColor[2]);

                AllResource.allInnerLightMap = new Array(AllResource.senceHierarchyJson.allLightmapTexture.length);

                for (var i = 0; i < AllResource.allInnerLightMap.length; i++) {
                    AllResource.allInnerLightMap[i] = AllResource.allMap["innerBlackTex"];
                }
                shadrBin.load(SourceLoad.geometryFolder + SourceLoad.f456Name + ".json",
                    function(text) {

                        var shaderBuffer;
                        if (SourceLoad.useCompress) {
                            shaderBuffer = LZF.decompress(new Uint8Array(text));
                        } else {
                            var shader = new Uint8Array(text);
                            shaderBuffer = shader.buffer;
                        }

                        senceHierarchyJsonHasLoaded = true;
                        AllResource.allShader = shaderBuffer;
                        SenceHierarchy.InitTotalMatsAndMapsAndTransformObject();
                        AllResource.LoadLZMABin(SourceLoad.f123Name);
                    },
                    function(xhr) {

                    },
                    function(xhr) {

                    });
            },
            function(xhr) {
                // console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
            },
            function(xhr) {
                // console.log( 'An error happened' );
            }
        );
    },

    InitTotalMatsAndMapsAndTransformObject: function() {
        //加载基本材质，不含贴图的材质，加载贴图
        for (var i = 0; i < AllResource.senceHierarchyJson.materials.length; i++) {
            AllResource.allMats[AllResource.senceHierarchyJson.materials[i].name] = LoadBaseMat(AllResource.senceHierarchyJson.materials[i]);
        }

        //加载Mesh基本信息，含有范围段，之后再LoadmeshBin在替换成实际数据
        for (var i = 0; i < AllResource.senceHierarchyJson.allMeshbeTo.length; i++) {
            AllResource.allMeshbeTo[AllResource.senceHierarchyJson.allMeshbeTo[i].name] = AllResource.senceHierarchyJson.allMeshbeTo[i];
            //			console.log(AllResource.senceHierarchyJson.allMeshbeTo[i]);
        }

        //加载默认贴图信息，图片还未加载，
        for (var i = 0; i < AllResource.senceHierarchyJson.allCustomTexture.length; i++) {
            AllResource.allMapbeTo[AllResource.senceHierarchyJson.allCustomTexture[i].name] = AllResource.senceHierarchyJson.allCustomTexture[i];
        }

        //加载unity3d自己烘培的贴图信息，图片还未加载
        for (var i = 0; i < AllResource.senceHierarchyJson.allLightmapTexture.length; i++) {
            AllResource.allMapbeTo[AllResource.senceHierarchyJson.allLightmapTexture[i].name] = AllResource.senceHierarchyJson.allLightmapTexture[i];
        }

        //加载CubeMap贴图信息，图片还未加载
        for (var i = 0; i < AllResource.senceHierarchyJson.allCubeMapTexture.length; i++) {
            AllResource.allMapbeTo[AllResource.senceHierarchyJson.allCubeMapTexture[i].name] = AllResource.senceHierarchyJson.allCubeMapTexture[i];
        }

        //加载场景层级结构信息
        for (var i = 0; i < AllResource.senceHierarchyJson.SenceHierarchy.length; i++) {
            //			console.log(AllResource.senceHierarchyJson.SenceHierarchy[i]);
            //			console.log(AllResource.senceHierarchyJson.SenceHierarchy[i].name);
            AllResource.allGameObjectJson[AllResource.senceHierarchyJson.SenceHierarchy[i].objectid] = AllResource.senceHierarchyJson.SenceHierarchy[i];
        }
        //		console.log(AllResource.allGameObjectJson);
        //		console.log(AllResource.allMesh);
        //		console.log(AllResource.allMapbeTo);
        //		console.log("InitTotalMatsAndMapsAndTransformObject");
        SenceHierarchy.InitRootGameObject();
    },

    InitRootGameObject: function() {
        this.gameObjectList = new Array();
        //初始化非Mesh物体
        for (var i = 0; i < AllResource.senceHierarchyJson.SenceHierarchy.length; i++) {
            if (!AllResource.senceHierarchyJson.SenceHierarchy[i].mesh) {
                Init3DObject(AllResource.senceHierarchyJson.SenceHierarchy[i], SenceHierarchy.gameObjectList);
            }
        }
        RenderOneFrame();
    }
}


var SenceInteractive = {
    cameraUniversalCenter: "",
    homeInteAction: "",
    introInteAction: "",
    areaInteAction: "",
    trafficInteAction: "",
    supportsInteAction: "",
    hxfbInteActionGroup: "",
    floorInteActionGroup: "",
    pzMeshPosBufArray: "",
    defaultMYFloorName: "",

    //首页     Framework3d.Home();
    //简介	   Framework3d.Intro();
    //区位	   Framework3d.Area();
    //交通	   Framework3d.Traffic();
    //配套	   Framework3d.Supports();
    //户型	   Framework3d.HXFB(hx_name);
    //鸟瞰	   Framework3d.NK();
    //人视	   Framework3d.MY();

    Init: function() {

        var interactiveLoader = new THREE.FileLoader(jsonLoadingManger);
        interactiveLoader.responseType = "arraybuffer";
        interactiveLoader.load(
            SourceLoad.hierarchyFolder + SourceLoad.senceInteractiveName + ".json",
            function(text) {
                var int8Array;
                if (SourceLoad.useCompress) {
                    int8Array = new Uint8Array(LZF.decompress(new Uint8Array(text)));
                } else {
                    int8Array = new Uint8Array(text);
                }

                var getText = "";

                for (var i = 0; i < int8Array.length; i++) {
                    getText += String.fromCharCode(int8Array[i]);
                }


                AllResource.senceInteractiveJson = JSON.parse(getText);



                if (AllResource.senceInteractiveJson.cameraUniversalCenter) {
                    console.log(AllResource.senceInteractiveJson.cameraUniversalCenter);
                    SenceInteractive.cameraUniversalCenter = AllResource.senceInteractiveJson.cameraUniversalCenter;
                }

                //				console.log(AllResource.senceInteractiveJson);


                SenceInteractive.homeInteAction = AllResource.senceInteractiveJson.homeInAct;
                SenceInteractive.introInteAction = AllResource.senceInteractiveJson.introInAct;
                SenceInteractive.areaInteAction = AllResource.senceInteractiveJson.areaInAct;
                SenceInteractive.trafficInteAction = AllResource.senceInteractiveJson.trafficInAct;
                SenceInteractive.supportsInteAction = AllResource.senceInteractiveJson.supportsInAct;
                SenceInteractive.hxfbInteActionGroup = AllResource.senceInteractiveJson.HXFBGroup;
                SenceInteractive.floorInteActionGroup = AllResource.senceInteractiveJson.floorGroup;
                SenceInteractive.defaultMYFloorName = AllResource.senceInteractiveJson.defaultMYFloorName;
                //				SenceInteractive.pzMeshPositionBufferArray


                console.log(SenceInteractive.defaultMYFloorName);

                senceInteractiveJsonHasLoaded = true;


            },
            function(xhr) {
                // console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
            },
            function(xhr) {
                // console.log( 'An error happened' );
            }
        );

    }






}

function LoadBaseMat(matIn) {
    var sC;
    var waveSpedd;

    if (matIn._SpecColor2) {
        sC = JSON.parse(matIn._SpecColor2);
    } else {
        sC = new THREE.Vector4(0, 0, 0, 0);
    }

    if (matIn._WaveSpeed) {
        waveSpedd = JSON.parse(matIn._WaveSpeed);
    } else {
        waveSpedd = new THREE.Vector4(-0.2, -0.2, 0.1, 0.1);
    }




    var mC = JSON.parse(matIn._Color);
    var lC = JSON.parse(matIn._lightmap_color);

    matIn.shaderType = matIn.shader[4];
    //	console.log(matIn);
    //	console.log(SenceHierarchy.fogNearAndFar);

    uniforms = {
        _GLOBALTIME: {
            type: "t",
            value: 0.0
        },
        _LIMAP: {
            type: "t",
            value: AllResource.allMap["innerWhiteTex"]
        },
        _LIMAPOFFSET: {
            type: "v4",
            value: new THREE.Vector4(1.0, 1.0, 0.0, 0.0)
        },
        _FOGCOLOR: {
            type: "v3",
            value: SenceHierarchy.fogColor
        },
        _FOGNEAR: {
            type: "f",
            value: SenceHierarchy.fogNearAndFar.x
        },
        _FOGFAR: {
            type: "f",
            value: SenceHierarchy.fogNearAndFar.y
        },

        _SUNDIR: {
            type: "v3",
            value: SenceHierarchy.sunDir
        },
        _SUNINTENSITY: {
            type: "v3",
            value: SenceHierarchy.sunIntensity
        },

        _MainTex: {
            type: "t",
            value: AllResource.allMap["innerWhiteTex"]
        },
        _LightMap: {
            type: "t",
            value: AllResource.allMap["innerGrayTex"]
        },
        _LIMAP: {
            type: "t",
            value: AllResource.allMap["innerGrayTex"]
        },

        //默认都有实时光影
        //				_BlendLight:{ type: "f",value:1.0},	
        _SpecColor2: {
            type: "v4",
            value: new THREE.Vector4(sC[0], sC[1], sC[2], sC[3])
        },
        _Shininess: {
            type: "f",
            value: parseFloat(matIn._Shininess)
        },
        _Color: {
            type: "v4",
            value: new THREE.Vector4(mC[0], mC[1], mC[2], mC[3])
        },
        _lightmap_color: {
            type: "v4",
            value: new THREE.Vector4(lC[0], lC[1], lC[2], lC[3])
        },
    };

    if (matIn.shaderType === 0) {
        uniforms._alphaSin = {
            type: "f",
            value: matIn._alphaSin
        };
        AllResource.globalUpdateUniform.push(uniforms);
    }

    //cubeMap					
    if (matIn.shaderType === 2 || matIn.shaderType === 3 || matIn.shaderType === 4) {
        uniforms._ENVMAP = {
            type: "t",
            value: AllResource.allMap["envCubeMap"]
        };
        uniforms._Smooth = {
            type: "f",
            value: matIn._Smooth
        };
        uniforms._Reflect = {
            type: "f",
            value: matIn._Reflect
        };
        uniforms._FresnelPower = {
            type: "f",
            value: matIn._FresnelPower
        };
        uniforms._FresnelBias = {
            type: "f",
            value: matIn._FresnelBias
        };
    }

    if (matIn.shaderType === 5) {
        uniforms._CubeMap = {
            type: "t",
            value: AllResource.allMap["envCubeMap"]
        };
    }

    if (matIn.shaderType === 6 || matIn.shaderType === 7 || matIn.shaderType === 10) {
        uniforms._Cutoff = {
            type: "f",
            value: matIn._Cutoff
        };
    }

    if (matIn.shaderType === 8) {
        uniforms._WaveSpeed = {
                type: "v4",
                value: new THREE.Vector4(waveSpedd[0], waveSpedd[1], waveSpedd[2], waveSpedd[3])
            },
            uniforms._ENVMAP = {
                type: "t",
                value: AllResource.allMap["envCubeMap"]
            };
        uniforms._Smooth = {
            type: "f",
            value: matIn._Smooth
        };
        uniforms._Reflect = {
            type: "f",
            value: matIn._Reflect
        };
        uniforms._FresnelPower = {
            type: "f",
            value: matIn._FresnelPower
        };
        uniforms._FresnelBias = {
            type: "f",
            value: matIn._FresnelBias
        };
        uniforms._BumpMap = {
            type: "t",
            value: AllResource.allMap["innerBumpTex"]
        };
        AllResource.globalUpdateUniform.push(uniforms);
    }

    if (matIn.shaderType === 9) {

        uniforms._Width = {
            type: "f",
            value: matIn._Width
        };
        uniforms._Height = {
            type: "f",
            value: matIn._Height
        };
        uniforms._Height = {
            type: "f",
            value: matIn._Height
        };
        uniforms._sizeBlend = {
            type: "f",
            value: matIn._sizeBlend
        };
        uniforms._scale = {
            type: "f",
            value: matIn._scale
        };
        uniforms._PviotOffsetX = {
            type: "f",
            value: matIn._PviotOffsetX
        };
        uniforms._PviotOffsetY = {
            type: "f",
            value: matIn._PviotOffsetY
        };

    }


    var material = new THREE.RawShaderMaterial({
        uniforms: uniforms,
        vertexShader: String.fromCharCode.apply(null, new Uint8Array(AllResource.allShader, matIn.shader[0], matIn.shader[1])),
        fragmentShader: String.fromCharCode.apply(null, new Uint8Array(AllResource.allShader, matIn.shader[2], matIn.shader[3]))
    });

    material.name = matIn.name;

    //alpha
    if (matIn.shaderType === 0) {
        material.transparent = true;
        //				material.side = THREE.DoubleSide;
        //				material.alphaTest=0.3;
    }

    if (matIn.shaderType === 2) {
        AllResource.needEnvMapMats.push(material);
    }

    if (matIn.shaderType === 3) {
        AllResource.needEnvMapMats.push(material);
        material.transparent = true;
    }

    if (matIn.shaderType === 4) {
        AllResource.needEnvMapMats.push(material);
    }

    if (matIn.shaderType === 5) {
        material.side = THREE.DoubleSide;
    }

    if (matIn.shaderType === 6) {
        //				material.transparent=true;
        material.alphaTest = matIn._Cutoff;
    }

    if (matIn.shaderType === 7) {
        material.side = THREE.DoubleSide;
        material.alphaTest = matIn._Cutoff;
    }

    if (matIn.shaderType === 8) {
        AllResource.needEnvMapMats.push(material);
        material.transparent = true;
    }

    if (matIn.shaderType === 9) {
        material.transparent = true;
    }

    if (matIn.shaderType === 10) {
        material.alphaTest = matIn._Cutoff;
    }

    material.shaderType = matIn.shaderType;

    //			var mattt = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );	
    //			return mattt;
    return material;

}

function SetGameObjectMesh(meshName) {
    var objs = AllResource.allMeshbeTo[meshName];
    var meshBuffer = AllResource.allMesh[meshName];

    meshBuffer.computeBoundingSphere();
    meshBuffer.boundingSphere.radius *= 0.001;
    meshBuffer.boundingSphere.center *= 0.001;
    if (meshBuffer.boundingSphere.center === "NaN")
        meshBuffer.boundingSphere.center = 0;

    //	console.log("TT");
    for (var i = 0; i < objs.beTo.length; i++) {
        //		console.log(objs.beTo[i]);
        var materialAll = [];
        var material;
        //		console.log(AllResource.allGameObjectJson[objs.beTo[i]]);

        for (var j = 0; j < AllResource.allGameObjectJson[objs.beTo[i]].materials.length; j++) {
            material = AllResource.allMats[AllResource.allGameObjectJson[objs.beTo[i]].materials[j]];
            materialAll.push(material);
        }

        var gameObject;

        if (AllResource.allGameObjectJson[objs.beTo[i]].instance === "true") {
            var insBuffer = InstanceMeshBuffer(meshBuffer, AllResource.allGameObjectJson[objs.beTo[i]].instancePos);

            insBuffer.computeBoundingSphere();
            insBuffer.boundingSphere.radius *= 0.001;
            insBuffer.boundingSphere.center *= 0.001;

            //			console.log(insBuffer.boundingSphere.center);

            if (insBuffer.boundingSphere.center === "NaN")
                insBuffer.boundingSphere.center = THREE.Vector4(0.0, 0.0, 0.0, 1.0);

            gameObject = new THREE.Mesh(insBuffer, materialAll);
            //			console.log(gameObject);
        } else {
            gameObject = new THREE.Mesh(meshBuffer, materialAll);
        }
        //		console.log("CC");

        gameObject.lightmapoffsetuv = AllResource.allGameObjectJson[objs.beTo[i]].lightmapoffsetuv;
        gameObject.allInnerLightMap = AllResource.allInnerLightMap;

        Init3DObject(AllResource.allGameObjectJson[objs.beTo[i]], SenceHierarchy.gameObjectList, gameObject);

        RenderOneFrame();
    }

}

function InstanceMeshBuffer(meshBuffer, posGroup) {

    //	var insCount=
    //	console.log(meshBuffer);

    var hasNormal = false;
    var hasUV = false;
    var hasUV2 = false;
    var matG = meshBuffer.groups;

    var vertex = meshBuffer.attributes.position.array;
    var finVertex = new Float32Array(vertex.length * posGroup.length / 3);

    var index = meshBuffer.index.array;
    var finIndex = new Uint16Array(index.length * posGroup.length / 3);

    var normal;
    var finNormal;
    if (meshBuffer.attributes.normal) {
        hasNormal = true;
        normal = meshBuffer.attributes.normal.array;
        finNormal = new Float32Array(normal.length * posGroup.length / 3);
    }

    var uv;
    var finuv;
    if (meshBuffer.attributes.uv) {
        hasUV = true;
        uv = meshBuffer.attributes.uv.array;
        finuv = new Float32Array(uv.length * posGroup.length / 3);
    }

    var uv2;
    var finuv2;
    if (meshBuffer.attributes.uv2) {
        hasUV2 = true;
        uv2 = meshBuffer.attributes.uv2.array;
        finuv2 = new Float32Array(uv2.length * posGroup.length / 3);
    }


    var a = new THREE.Euler(0, 6.28 * Math.random(), 0, 'XYZ');
    var b = new THREE.Vector3(0, 0, 0);
    var scale = 1.0;

    for (var i = 0; i < posGroup.length / 3; i++) {
        a = new THREE.Euler(0, 6.28 * Math.random(), 0, 'XYZ');
        scale = 1 + 0.5 * Math.random();

        for (var j = 0; j < vertex.length; j += 3) {
            b = new THREE.Vector3(vertex[j], vertex[j + 1], vertex[j + 2]);
            b.applyEuler(a);
            finVertex[vertex.length * i + j] = b.x * scale + posGroup[i * 3];
            finVertex[vertex.length * i + j + 1] = b.y * scale + posGroup[i * 3 + 1];
            finVertex[vertex.length * i + j + 2] = b.z * scale + posGroup[i * 3 + 2];
        }

        /*		
        		for(var j=0;j<index.length;j+=3)
        		{	
        			finIndex[index.length*i+j]=index[j]+vertex.length*(i/3);
        			finIndex[index.length*i+j+1]=index[j+1]+vertex.length*(i/3);
        			finIndex[index.length*i+j+2]=index[j+2]+vertex.length*(i/3);
        		}
        */
        //将同材质的index移到一块	

        for (var j = 0; j < uv.length; j += 2) {
            finuv[uv.length * i + j] = uv[j];
            finuv[uv.length * i + j + 1] = uv[j + 1];
        }
    }

    var instanceGeometryBuffer = new THREE.BufferGeometry();
    instanceGeometryBuffer.addAttribute("position", new THREE.BufferAttribute(finVertex, 3));

    if (meshBuffer.attributes.normal) {
        instanceGeometryBuffer.addAttribute("normal", new THREE.BufferAttribute(finNormal, 3));
    }
    if (meshBuffer.attributes.uv) {
        instanceGeometryBuffer.addAttribute("uv", new THREE.BufferAttribute(finuv, 2));
    }
    if (meshBuffer.attributes.uv2) {

    }

    var groupStart = 0;
    var groupCount = 0;
    var totolCount = 0;
    for (var a = 0; a < matG.length; a++) {
        var start = matG[a].start;
        var singerCount = matG[a].count;

        groupCount = 0;

        for (var i = 0; i < posGroup.length / 3; i++) {
            for (var j = start; j < start + singerCount; j += 3) {
                finIndex[totolCount - start + j] = index[j] + vertex.length * (i / 3);
                finIndex[totolCount - start + j + 1] = index[j + 1] + vertex.length * (i / 3);
                finIndex[totolCount - start + j + 2] = index[j + 2] + vertex.length * (i / 3);
            }
            groupCount += singerCount;
            totolCount += singerCount;
            //			console.log(totolCount);
        }
        instanceGeometryBuffer.addGroup(groupStart, groupCount, a);
        groupStart = totolCount;
    }
    instanceGeometryBuffer.setIndex(new THREE.BufferAttribute(finIndex, 1));

    return instanceGeometryBuffer;

}


function Init3DObject(gameObjectInfo, gameObjectList, inGameObject) {

    var gameObject;

    if (!inGameObject) {
        gameObject = new THREE.Object3D();
    } else {
        //			  console.log(inGameObject);			  
        gameObject = inGameObject;
    }

    var gameObjectParent = gameObjectInfo.parentid;

    gameObject.name = gameObjectInfo.name;

    var gameObjectID = gameObjectInfo.objectid;
    gameObjectList[gameObjectID] = gameObject;
    gameObjectList[gameObjectID].parentid = gameObjectParent;

    //			console.log(gameObjectList);
    gameObject.renderOrder = gameObjectInfo.renderOrder;
    gameObject.position.x = gameObjectInfo.position[0];
    gameObject.position.y = gameObjectInfo.position[1];
    gameObject.position.z = gameObjectInfo.position[2];

    //			console.log(gameObjectInfo.rotation2);


    //			gameObject.quaternion=new THREE.Quaternion(gameObjectInfo.rotation2[0],gameObjectInfo.rotation2[1],gameObjectInfo.rotation2[2],gameObjectInfo.rotation2[3]);

    gameObject.applyQuaternion(new THREE.Quaternion(gameObjectInfo.rotation2[0], gameObjectInfo.rotation2[1], gameObjectInfo.rotation2[2], gameObjectInfo.rotation2[3]));
    //			gameObject.updateMatrix ();
    //			gameObject.rotation.x=gameObjectInfo.rotation[0]/360.0*6.2831;
    //			gameObject.rotation.y=gameObjectInfo.rotation[1]/360.0*6.2831;
    //			gameObject.rotation.z=-gameObjectInfo.rotation[2]/360.0*6.2831;

    //			gameObject.rotateZ(gameObjectInfo.rotation[2]/57.3);
    //			gameObject.rotateX(-gameObjectInfo.rotation[1]/57.3);		
    //			gameObject.rotateY(-gameObjectInfo.rotation[1]/57.3);								



    gameObject.scale.x = gameObjectInfo.scale[0];
    gameObject.scale.y = gameObjectInfo.scale[1];
    gameObject.scale.z = gameObjectInfo.scale[2];

    //			if(gameObject.geometry)
    //			{
    //			  console.log(gameObject);
    //			  gameObject.geometry.boundingSphere.radius=0.001*gameObject.geometry.boundingSphere.radius;
    //			}

    if (gameObjectList[gameObjectParent]) {
        gameObjectList[gameObjectParent].add(gameObject);
    } else {
        AllResource.scene.add(gameObject);
    }

    //			if(gameObjectName==="cameraBG")
    //			{
    //camera.add(gameObject);
    //			}

}

function SetMatTex(texName) {
    var objs = AllResource.allMapbeTo[texName];

    if (objs) {
        //		console.log(objs);
        for (var i = 0; i < objs.beTo.length; i++) {
            //		console.log(objs.beTo[i].name);
            if (objs.beTo[i].name !== "") {
                var mat = AllResource.allMats[objs.beTo[i].name];
                //					console.log(mat);				
                if (objs.beTo[i].slot === "_MainTex") {
                    mat.uniforms._MainTex.value = AllResource.allMap[texName];
                    RenderOneFrame();
                }
                if (objs.beTo[i].slot === "_LightMap") {
                    mat.uniforms._LightMap.value = AllResource.allMap[texName];
                    RenderOneFrame();
                }

                if (objs.beTo[i].slot === "_CubeMap") {
                    mat.uniforms._CubeMap.value = AllResource.allMap[texName];
                    RenderOneFrame();
                }

                if (objs.beTo[i].slot === "_BumpMap") {
                    mat.uniforms._BumpMap.value = AllResource.allMap[texName];
                    RenderOneFrame();
                }
            }
            //		var gameObj=SenceHierarchy.gameObjectList[objs[i]];		
        }

        if (texName === AllResource.senceHierarchyJson.envCubeMap) {
            //			console.log(AllResource.needEnvMapMats);
            for (var i = 0; i < AllResource.needEnvMapMats.length; i++) {
                //				console.log(AllResource.needEnvMapMats[i]);
                AllResource.needEnvMapMats[i].uniforms._ENVMAP.value = AllResource.allMap[texName];
                RenderOneFrame();
            }
        }

    }
}



jsonLoadingManger.onLoad = function(item, loaded, total) {
    AllLoaded();
}

jsonLoadingManger.onProgress = function(item, loaded, total) {

};

meshLoadingManger.onProgress = function(item, loaded, total) {

};

meshLoadingManger.onLoad = function(item, loaded, total) {
    console.log("All Mesh Loaded!");
}

imageLoadingManger.onProgress = function(item, loaded, total) {
    var loadPercent = loaded / total * 100;
    if (loadPercent == 100) {
        $(".load").hide();
    }
    loadPercent = Math.round(loadPercent);
    $(".loadBox").html(50 + parseInt(loadPercent / 2) + "%");
    loadPercent = "LoadingImage.." + loadPercent + "%";
    console.log(loadPercent);
    if (wjmloading_HTML)
        wjmloading_HTML.innerHTML = loadPercent;
};

imageLoadingManger.onLoad = function(item, loaded, total) {
    console.log("All Textrue Loaded!");
    allImageHasLoaded = true;
    AllLoaded();
}


function AllLoaded() {



    if (senceHierarchyJsonHasLoaded && senceInteractiveJsonHasLoaded && allMeshLoaded && allImageHasLoaded) {
        if (wjmloading_HTML)
            wjmloading_HTML.innerHTML = "AllLoaded";
        StartScene();

        RenderOneFrame();
    }
}