const e = require('express');
const express = require('express');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data.sqlite');

const router = express.Router();

/**
 * @api {post} /storage/ Store a new product
 * @apiVersion 1.0.0
 * @apiGroup StorageIT
 * @apiParam {String} type The Type of the item you are adding
 * @apiParam {Number} quantity How many items are you going to store
 * @apiParam {String} warehouse The warehouse the item will be stored
 *
 * @apiParamExample {json} Input
 *    {
 *      "quantity": "533",
 *	    "type": "smart_watches",
 *	    "warehouse": "st_peters"
 *    }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 Created
 *     Record added successfully!
 */
router.post('/storage', (req, res, next) => {
    let type = req.body.type;
    let quantity = req.body.quantity;
    let warehouse = req.body.warehouse;

    db.run("INSERT INTO equipment (quantity,type,warehouse) VALUES (?,?,?)", quantity, type, warehouse, (err) => {
        if (err || !type || !quantity || !warehouse) {
            res.status(500).send({
                error: err,
                message: "It looks like something went wrong, check your input and try again"
            });
        } else {
            res.status(201).send({
                error: "",
                message: "Record created successfully!"
            });
        }
        res.end();
    });
});

/**
 * @api {get} /storage Display all storage items
 * @apiVersion 1.0.0
 * @apiGroup StorageIT
 * @apiSuccess {id} id Items unique identifier
 * @apiSuccess {String} type The type of the items
 * @apiSuccess {Number} quantity Total items are that are stored
 * @apiSuccess {String} warehouse The warehouse the item will be stored
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    [{
 *      "id": 1,
 *      "quantity": 355
 *      "type": "laptops",
 *      "warehouse": "st_peters"
 *    },
 *      {
 *      "id": 2,
 *      "quantity": 221
 *      "type": "graphic_cards",
 *      "warehouse": "roker"
 *      },
 *     {
 *      "id": 3,
 *      "quantity": 65,
 *      "type": "headphones",
 *      "warehouse": "wearmouth"
 *    }]
 * @apiErrorExample {json} List error
 *    HTTP/1.1 500 Internal Server Error
 */
router.get('/storage', (req, res) => {
    db.all("SELECT * FROM equipment", (err, rows) => {
        if (rows.length > 0) {
            res.json(rows);
        } else {
            res.status(404).send({
                error: err,
                message: "It looks like something went wrong, check your input and try again"
            });
        }
    });
});

/**
 * @api {get} /storage/:id Read a specific item by id
 * @apiVersion 1.0.0
 * @apiGroup StorageIT
 * @apiParam {Number} id items unique identifier
 *
 * @apiSuccess {id} id Items unique identifier
 * @apiSuccess {String} type The type of the items
 * @apiSuccess {Number} quantity Total items are that are stored
 * @apiSuccess {String} warehouse The warehouse the item will be stored
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "id": 1,
 *      "quantity": 355
 *      "type": "laptops",
 *      "warehouse": "st_peters"
 *     }
 * 
 *  @apiErrorExample {json} List error
 *  HTTP/1.1 404 Not Found
 *   {
 *   "error": null,
 *   "id": "43",
 *   "message": "It looks like this item was not found in our storage"
 *   }
 * 
 */
router.get('/storage/:id', (req, res) => {
    let id = req.params.id
    db.all("SELECT * FROM equipment WHERE id=?", [id], (err, rows) => {
        if (rows.length > 0) {
            res.json(rows);
        } else {
            res.status(404).send({
                error: err,
                id: id,
                message: "It looks like this item was not found in our storage"
            });
        }
    });
});

/**
 * @api {get} /storage/type/:type Read a specific item by type
 * @apiVersion 1.0.0
 * @apiGroup StorageIT
 * @apiParam {String} type type of the item
 *
 * @apiSuccess {id} id Items unique identifier
 * @apiSuccess {String} type The type of the items
 * @apiSuccess {Number} quantity Total items are that are stored
 * @apiSuccess {String} warehouse The warehouse the item will be stored
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "id": 1,
 *      "quantity": 355
 *      "type": "laptops",
 *      "warehouse": "st_peters"
 *     }
 */
router.get('/storage/type/:type', (req, res) => {
    let type = req.params.type
    db.all("SELECT * FROM equipment WHERE type=?", [type], (err, rows) => {
        if (rows.length > 0) {
            res.json(rows);
        } else {
            res.status(404).send({
                error: err,
                type: type,
                message: "It looks like this type was not found in our storage"
            });
        }
    });
});

/**
 * @api {get} /storage/warehouse/:warehouse Read a specific item by warehouse
 * @apiVersion 1.0.0
 * @apiGroup StorageIT
 * @apiParam {String} warehouse warehouse the item is stored
 *
 * @apiSuccess {id} id Items unique identifier
 * @apiSuccess {String} type The type of the items
 * @apiSuccess {Number} quantity Total items are that are stored
 * @apiSuccess {String} warehouse The warehouse the item will be stored
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "id": 1,
 *      "quantity": 355
 *      "type": "laptops",
 *      "warehouse": "st_peters"
 *     }
 */
router.get('/storage/warehouse/:warehouse', (req, res) => {
    let warehouse = req.params.warehouse
    db.all("SELECT * FROM equipment WHERE warehouse=?", [warehouse], (err, rows) => {
        if (rows.length > 0) {
            res.json(rows);
        } else {
            res.status(404).send({
                error: err,
                warehouse: warehouse,
                message: "It looks like this warehouse was not found in our storage"
            });
        }
    });
});

/**
 * @api {put} /storage/:id Update an existing item
 * @apiVersion 1.0.0
 * @apiGroup StorageIT
 *
 * @apiParam {id} id Items unique identifier
 * @apiParam {String} type The type of the items
 * @apiParam {Number} quantity Total items are that are stored
 * @apiParam {String} warehouse The warehouse the item will be stored
 *
 * @apiParamExample {json} Input
 *    {
 *      "id": 10,
 *      "quantity": 143
 *      "type": "iphones",
 *      "warehouse": "st_peters"
 *    }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 OK
 *     Record updated successfully!
 */
router.put('/storage/:id', (req, res, next) => {
    let id = req.params.id;
    let type = req.body.type;
    let quantity = req.body.quantity;
    let warehouse = req.body.warehouse;

    db.run("UPDATE equipment SET type=?, quantity=?, warehouse=? WHERE id=?", type, quantity, warehouse, id, (err) => {
        if (err || !type || !quantity || !warehouse) {
            res.status(404).send({
                error: err,
                id: id,
                message: "It looks like something went wrong, check your input and try again"
            });
        } else {
            res.status(200).send({
                error: "",
                message: "Record updated successfully!"
            });
        }
        res.end();
    });
});

/**
 * @api {delete} /storage/:id Delete an existing item
 * @apiVersion 1.0.0
 * @apiGroup StorageIT
 * 
 * @apiParam {id} id Items unique identifier
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 202 Accepted
 *     Record deleted successfully!
 */
router.delete('/storage/:id', function (req, res, next) {
    let id = req.params.id;
    db.run("DELETE from equipment WHERE id=?", [id], (err) => {
        if (err) {
            res.status(404).send({
                error: err,
                id: id,
                message: "It looks like something went wrong, check your input and try again"
            });
        } else {
            res.status(202).send({
                error: "",
                message: "Record deleted successfully!"
            }); // Send success deleted message
        }
        res.end();
    });
});

// export router
module.exports = router;