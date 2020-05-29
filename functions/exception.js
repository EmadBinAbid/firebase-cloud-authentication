exports.BadRequestException = function(res, msg = undefined) {
    res.status(400)

    if (msg) {
        res.json({
            statusCode: 400,
            message: 'Bad request' + ' ' + msg
        })
    }
    else {
        res.json({
            statusCode: 400,
            message: 'Bad request'
        })
    }
}

exports.UnauthorizedException = function(res, msg = undefined) {
    res.status(401)

    if (msg) {
        res.json({
            statusCode: 401,
            message: 'Incorrect credentials' + ' ' + msg
        })
    }
    else {
        res.json({
            statusCode: 401,
            message: 'Incorrect credentials'
        })
    }
}

exports.ForbiddenException = function(res, msg = undefined) {
    res.status(403)

    if (msg) {
        res.json({
            statusCode: 403,
            message: 'Unauthorized' + ' ' + msg
        })
    }
    else {
        res.json({
            statusCode: 403,
            message: 'Unauthorized'
        })
    }
}

exports.NotFoundException = function(res, msg = undefined) {
    res.status(404)

    if (msg) {
        res.json({
            statusCode: 404,
            message: 'Requested resource not found' + ' ' + msg
        })
    }
    else {
        res.json({
            statusCode: 404,
            message: 'Requested resource not found'
        })
    }
}

exports.InternalServerException = function(res, msg = undefined) {
    res.status(500)

    if (msg) {
        res.json({
            statusCode: 500,
            message: 'Internal server error' + ' ' + msg
        })
    }
    else {
        res.json({
            statusCode: 500,
            message: 'Internal server error'
        })
    }
}

