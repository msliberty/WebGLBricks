"use strict";

window.onload = function() {
	var canvas = document.getElementById('canvas');
	var gl = WebGLUtils.setupWebGL(canvas);


	//////////////////// Shapes 'n' stuff ////////////////////

	// TRIANGLES
	var boardPositions = [
		[0, 0, 0],
		[32, 0, 0],
		[0, 32, 0],
		[32, 0, 0],
		[0, 32, 0],
		[32, 32, 0]
	];

	var boardPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, boardPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(boardPositions), gl.STATIC_DRAW);

	var boardColor = [0.09, 0.64, 0.28, 1]; // green


	// TRIANGLES
	var exampleBrickPositions = [
		[0, 0, 0],
		[0, 0, 1.5],
		[1, 0, 0],
		[0, 0, 1.5],
		[1, 0, 0],
		[1, 0, 1.5],
		[1, 0, 0],
		[1, 0, 1.5],
		[1, 1, 0],
		[1, 0, 1.5],
		[1, 1, 0],
		[1, 1, 1.5],
		[1, 1, 0],
		[1, 1, 1.5],
		[0, 1, 0],
		[1, 1, 1.5],
		[0, 1, 0],
		[0, 1, 1.5],
		[0, 1, 0],
		[0, 1, 1.5],
		[0, 0, 0],
		[0, 1, 1.5],
		[0, 0, 0],
		[0, 0, 1.5],
		[0, 0, 1.5],
		[0, 1, 1.5],
		[1, 0, 1.5],
		[0, 1, 1.5],
		[1, 0, 1.5],
		[1, 1, 1.5],
	];

	var exampleBrickPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, exampleBrickPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(exampleBrickPositions), gl.STATIC_DRAW);

	var exampleBrickColor = [1, 0, 0, 1]; // red


	var pegPositions = [];
	for (var i = 0; i < 16; ++i) {
		var theta = i * 2 * Math.PI / 16;
		var x = 0.5 + 0.3 * Math.cos(theta);
		var y = 0.5 + 0.3 * Math.sin(theta);
		var xNext = 0.5 + 0.3 * Math.cos(theta + 2 * Math.PI / 16);
		var yNext = 0.5 + 0.3 * Math.sin(theta + 2 * Math.PI / 16);
		pegPositions.push([0.5, 0.5, 2]);
		pegPositions.push([x, y, 2]);
		pegPositions.push([xNext, yNext, 2]);
		pegPositions.push([x, y, 1.5]);
		pegPositions.push([x, y, 2]);
		pegPositions.push([xNext, yNext, 2]);
		pegPositions.push([x, y, 1.5]);
		pegPositions.push([xNext, yNext, 2]);
		pegPositions.push([xNext, yNext, 1.5]);
	}

	var pegPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, pegPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(pegPositions), gl.STATIC_DRAW);


	//////////////////// Perspective ////////////////////

	var cameraTarget = [16, 16, 0];
	var cameraDistance = 32;
	var cameraAzimuth = 0; // radians measured from the negative y-axis towards the positive x-axis
	var cameraInclination = Math.PI / 16; // radians measured from the xy-plane towards the positive z-axis

	var minCameraInclination = 0.01;
	var maxCameraInclination = Math.PI / 2 - 0.01;
	var minCameraDistance = 1;
	var maxCameraDistance = 80;

	function cameraPosition() {
		var x = cameraDistance * Math.cos(cameraInclination) * Math.sin(cameraAzimuth) + cameraTarget[0];
		var y = -cameraDistance * Math.cos(cameraInclination) * Math.cos(cameraAzimuth) + cameraTarget[1];
		var z = cameraDistance * Math.sin(cameraInclination) + cameraTarget[2];
		return [x, y, z];
	}

	function viewMatrix() {
		return lookAt(cameraPosition(), cameraTarget, [0, 0, 1]);
	}

	function projectionMatrix() {
		return perspective(60, canvas.width / canvas.height, 0.01, 100);
	}


	//////////////////// Model ////////////////////

	var placedBricks = [];
	var nextBrickId = 0;

	function placeBrick(brick) {
		var id = nextBrickId++;
		brick.id = id;
		placedBricks[id] = brick;
	}


	placeBrick({x: 0, y: 0, z:0, width: 3, depth: 2, color: [1, 0, 0, 1]});
	placeBrick({x:5, y:27, z:0, width: 2, depth: 4, color: [0, 1, 0, 1]});
	placeBrick({x:15, y:15, z:1, width: 2, depth: 2, color: [.4, .2, .6, 1]});


	//////////////////// Input ////////////////////

	canvas.oncontextmenu = function(e) { e.preventDefault(); } // capture right-click

	function dragModeFromMouseEvent(e) {
		if (e.buttons === 0) return null;

		if (e.ctrlKey || e.metaKey || e.altKey) {
			// simulate mouse buttons with keyboard
			// left button = ctrl or meta (windows logo on windows, command on os x)
			// right button = alt
			// middle button = left and right simultaneously

			if ((e.ctrlKey || e.metaKey) && e.altKey)
				return 'translate';
			if (e.ctrlKey || e.metaKey)
				return 'rotate';
			if (e.altKey)
				return 'zoom';
		}

		var leftButton = e.buttons & 1;
		var rightButton = e.buttons & 2;
		var middleButton = e.buttons & 4 || (leftButton && rightButton);//TODO

		if (middleButton)
			return 'translate';
		if (leftButton)
			return 'rotate';
		if (rightButton)
			return 'zoom';
		return null;
	}

	var rotateSensitivity = 1 / 500;
	var translateSensitivity = 1 / 50;
	var zoomSensitivity = 1 / 40;
	canvas.onmousemove = function(e) {
		var dragMode = dragModeFromMouseEvent(e);
		if (dragMode === null) return;

		if (dragMode === 'rotate') {
			cameraAzimuth -= e.movementX * rotateSensitivity;
			cameraAzimuth %= 2 *Math.PI;

			cameraInclination += e.movementY * rotateSensitivity;
			if (cameraInclination < minCameraInclination)
				cameraInclination = minCameraInclination;
			else if (cameraInclination > maxCameraInclination)
				cameraInclination = maxCameraInclination;
		} else if (dragMode === 'translate') {
			cameraTarget[0] -= e.movementX * translateSensitivity * Math.cos(cameraAzimuth);
			cameraTarget[1] -= e.movementX * translateSensitivity * Math.sin(cameraAzimuth);
			cameraTarget[0] -= e.movementY * translateSensitivity * Math.sin(cameraAzimuth);
			cameraTarget[1] += e.movementY * translateSensitivity * Math.cos(cameraAzimuth);
		} else if (dragMode === 'zoom') {
			cameraDistance -= e.movementY * zoomSensitivity;
			if (cameraDistance < minCameraDistance)
				cameraDistance = minCameraDistance;
			else if (cameraDistance > maxCameraDistance)
				cameraDistance = maxCameraDistance;
		}
	};

	canvas.onmousedown = function(e) {
		var objectId = readFromPickBuffer(e.offsetX, e.offsetY);
		if (objectId !== null)
			console.log('clicked object #' + objectId);
	};


	//////////////////// Shaders ////////////////////

	var mainProgram = initShaders(gl, 'vertex-shader', 'fragment-shader');
	var positionAttribute = gl.getAttribLocation(mainProgram, 'position');
	var modelUniform = gl.getUniformLocation(mainProgram, 'model');
	var viewUniform = gl.getUniformLocation(mainProgram, 'view');
	var projectionUniform = gl.getUniformLocation(mainProgram, 'projection');
	var colorUniform = gl.getUniformLocation(mainProgram, 'color');

	var pickBufferProgram = initShaders(gl, 'pick-buffer-vertex-shader', 'pick-buffer-fragment-shader');
	var pickBufferPositionAttribute = gl.getAttribLocation(pickBufferProgram, 'position');
	var pickBufferModelUniform = gl.getUniformLocation(pickBufferProgram, 'model');
	var pickBufferViewUniform = gl.getUniformLocation(pickBufferProgram, 'view');
	var pickBufferProjectionUniform = gl.getUniformLocation(pickBufferProgram, 'projection');
	var pickBufferObjectIdUniform = gl.getUniformLocation(pickBufferProgram, 'objectId');


	//////////////////// Pick Buffer ////////////////////

	var pickBufferTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, pickBufferTexture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

	var pickBufferRenderbuffer = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, pickBufferRenderbuffer);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, canvas.width, canvas.height);

	var pickBuffer = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, pickBuffer);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, pickBufferTexture, 0);
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, pickBufferRenderbuffer);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);

	function readFromPickBuffer(x, y) {
		gl.bindFramebuffer(gl.FRAMEBUFFER, pickBuffer);
		gl.useProgram(pickBufferProgram);
		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		for (var id in placedBricks) {
			var brick = placedBricks[id];

			var modelMatrix = translate(brick.x, brick.y, 0);
			gl.uniformMatrix4fv(pickBufferModelUniform, false, flatten(modelMatrix));
			gl.uniformMatrix4fv(pickBufferViewUniform, false, flatten(viewMatrix()));
			gl.uniformMatrix4fv(pickBufferProjectionUniform, false, flatten(projectionMatrix()));
			gl.uniform1i(pickBufferObjectIdUniform, id);

			gl.bindBuffer(gl.ARRAY_BUFFER, exampleBrickPositionBuffer);
			gl.enableVertexAttribArray(pickBufferPositionAttribute);
			gl.vertexAttribPointer(pickBufferPositionAttribute, 3, gl.FLOAT, false, 0, 0);
			gl.drawArrays(gl.TRIANGLES, 0, exampleBrickPositions.length);
		}

		var pixels = new Uint8Array(4);
		y = canvas.height - y; // invert y because textures have (0,0) at bottom left, but html has it at top left
		gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
		var objectId = null;
		if (pixels[3] !== 0)
			objectId = pixels[0] << 16 | pixels[1] << 8 | pixels[2];

		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.useProgram(mainProgram);
		return objectId;
	}


	//////////////////// Drawing ////////////////////

	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.enable(gl.DEPTH_TEST);
	gl.useProgram(mainProgram);


	function redraw() {
		gl.clearColor(0, 0, 0, 1);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		gl.uniformMatrix4fv(viewUniform, false, flatten(viewMatrix()));
		gl.uniformMatrix4fv(projectionUniform, false, flatten(projectionMatrix()));

		drawBoard();
		for (var id in placedBricks)
			drawBrick(placedBricks[id]);
		//drawPeg();
	}

	function drawBoard() {
		gl.bindBuffer(gl.ARRAY_BUFFER, boardPositionBuffer);
		gl.enableVertexAttribArray(positionAttribute);
		gl.vertexAttribPointer(positionAttribute, 3, gl.FLOAT, false, 0, 0);
		gl.uniformMatrix4fv(modelUniform, false, flatten(mat4()));
		gl.uniform4fv(colorUniform, flatten(boardColor));
		gl.drawArrays(gl.TRIANGLES, 0, boardPositions.length);
	}

	function drawBrick(brick) {
		var modelMatrix = mult(translate(brick.x, brick.y, brick.z), scalem(brick.width, brick.depth, 1));
		gl.uniformMatrix4fv(modelUniform, false, flatten(modelMatrix));
		gl.uniform4fv(colorUniform, flatten(brick.color));

		gl.bindBuffer(gl.ARRAY_BUFFER, exampleBrickPositionBuffer);
		gl.enableVertexAttribArray(positionAttribute);
		gl.vertexAttribPointer(positionAttribute, 3, gl.FLOAT, false, 0, 0);
		gl.drawArrays(gl.TRIANGLES, 0, exampleBrickPositions.length);
	}

	function drawPeg() {
		gl.bindBuffer(gl.ARRAY_BUFFER, pegPositionBuffer);
		gl.enableVertexAttribArray(positionAttribute);
		gl.vertexAttribPointer(positionAttribute, 3, gl.FLOAT, false, 0, 0);
		gl.uniform4fv(colorUniform, flatten(exampleBrickColor));
		gl.drawArrays(gl.TRIANGLES, 0, pegPositions.length);
	}

	function handleAnimationFrame() {
		requestAnimationFrame(handleAnimationFrame);
		redraw();
	}
	requestAnimationFrame(handleAnimationFrame);
};
