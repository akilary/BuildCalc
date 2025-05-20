const colors = {
    frontWall: "#e0e0e0",
    frontFace: "#e0e0e0",
    sideWall: "#c0c0c0",
    sideFace: "#c0c0c0",
    roof: "#a0a0a0",
    topFace: "#a0a0a0",
    outline: "#505050",
    heightLine: "#FF9800",
    lengthLine: "#4CAF50",
    widthLine: "#2196F3"
};

/** Расчет точек для изометрического отображения 3D объекта */
export function calculateIsometricPoints(
    posX, posY, length, width, height, scale, isoAngle = Math.PI / 6, verticalOffset = 0
) {
    return {
        bottomFrontLeft: {
            x: posX - (length * scale / 2), y: posY + verticalOffset
        }, bottomFrontRight: {
            x: posX + (length * scale / 2), y: posY + verticalOffset
        }, bottomBackLeft: {
            x: posX - (length * scale / 2) - (width * scale) * Math.cos(isoAngle),
            y: posY + verticalOffset - (width * scale) * Math.sin(isoAngle)
        }, bottomBackRight: {
            x: posX + (length * scale / 2) - (width * scale) * Math.cos(isoAngle),
            y: posY + verticalOffset - (width * scale) * Math.sin(isoAngle)
        }, topFrontLeft: {
            x: posX - (length * scale / 2), y: posY - (height * scale) + verticalOffset
        }, topFrontRight: {
            x: posX + (length * scale / 2), y: posY - (height * scale) + verticalOffset
        }, topBackLeft: {
            x: posX - (length * scale / 2) - (width * scale) * Math.cos(isoAngle),
            y: posY - (height * scale) + verticalOffset - (width * scale) * Math.sin(isoAngle)
        }, topBackRight: {
            x: posX + (length * scale / 2) - (width * scale) * Math.cos(isoAngle),
            y: posY - (height * scale) + verticalOffset - (width * scale) * Math.sin(isoAngle)
        }
    };
}

/** Отрисовка 3D объекта в изометрической проекции */
export function drawIsometricObject(ctx, points, drawDashedLines = true) {
    _drawFace(ctx, [points.bottomFrontLeft, points.bottomFrontRight, points.topFrontRight, points.topFrontLeft],
        colors.frontFace || colors.frontWall);

    _drawFace(ctx, [points.bottomFrontRight, points.bottomBackRight, points.topBackRight, points.topFrontRight],
        colors.sideFace || colors.sideWall);

    _drawFace(ctx, [points.topFrontLeft, points.topFrontRight, points.topBackRight, points.topBackLeft],
        colors.topFace || colors.roof);

    ctx.strokeStyle = colors.outline;
    ctx.lineWidth = 2;

    _drawOutline(ctx, [points.bottomFrontLeft, points.bottomFrontRight, points.topFrontRight, points.topFrontLeft]);
    _drawOutline(ctx, [points.bottomFrontRight, points.bottomBackRight, points.topBackRight, points.topFrontRight]);
    _drawOutline(ctx, [points.topFrontLeft, points.topFrontRight, points.topBackRight, points.topBackLeft]);

    if (drawDashedLines) {
        ctx.setLineDash([5, 5]);

        ctx.beginPath();
        ctx.moveTo(points.bottomFrontLeft.x, points.bottomFrontLeft.y);
        ctx.lineTo(points.bottomBackLeft.x, points.bottomBackLeft.y);
        ctx.lineTo(points.topBackLeft.x, points.topBackLeft.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(points.bottomBackLeft.x, points.bottomBackLeft.y);
        ctx.lineTo(points.bottomBackRight.x, points.bottomBackRight.y);
        ctx.stroke();

        ctx.setLineDash([]);
    }
}

/** Отрисовка размерных линий для 3D объекта */
export function drawDimensionLines(ctx, points, isoAngle = Math.PI / 6) {
    ctx.lineWidth = 3;

    _drawDimensionLine(ctx, points.bottomFrontLeft.x, points.bottomFrontLeft.y, points.topFrontLeft.x,
        points.topFrontLeft.y, colors.heightLine);
    _drawDimensionLine(ctx, points.bottomFrontLeft.x, points.bottomFrontLeft.y, points.bottomFrontRight.x,
        points.bottomFrontRight.y, colors.lengthLine);
    _drawDimensionLine(ctx, points.bottomFrontLeft.x + Math.cos(isoAngle),
        points.bottomFrontLeft.y - Math.sin(isoAngle), points.bottomBackLeft.x + Math.cos(isoAngle),
        points.bottomBackLeft.y - Math.sin(isoAngle), colors.widthLine);
}

/** Обработчик изменения размера окна */
export function resizeCanvas(canvas, drawCallback) {
    const container = canvas.parentElement;
    if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        drawCallback();
    }
}

/** Отрисовка наконечника стрелки */
function _drawArrowhead(ctx, fromX, fromY, toX, toY, color) {
    const headLength = 10;
    const angle = Math.atan2(toY - fromY, toX - fromX);

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
}

/** Отрисовка грани объекта */
function _drawFace(ctx, points, fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    ctx.fill();
}

/** Отрисовка контура объекта */
function _drawOutline(ctx, points) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    ctx.stroke();
}

/** Отрисовка линии размера с двусторонними стрелками */
function _drawDimensionLine(ctx, fromX, fromY, toX, toY, color) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    _drawArrowhead(ctx, fromX, fromY, toX, toY, color);
    _drawArrowhead(ctx, toX, toY, fromX, fromY, color);
}
