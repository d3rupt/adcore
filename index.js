const express = require('express')
const cors = require('cors');
const app = express();
app.use(cors());
const bodyParser = require('body-parser')
const json2csv = require('json2csv').parse;
const PORT = process.env.PORT || 3001;
const CSVToJSON = require('csvtojson');
const url = require('url');
const fs = require('fs');

let dupes = [];

function readChildrenOut(obj, y) {
    if ('children' in obj) {
        obj.children.forEach(x => {
            y.push(x);
            obj.children.splice(obj.children.indexOf(x), 1);
            x.forEach(xx => {
                readChildrenOut(xx);
            })
        })
    } else {
        return y;
    }
}

function readChildrenIn(obj) {
    if ('children' in obj) {
        obj.children.forEach(x => {
            dupes.push(x);
            readChildrenIn(x);
        })
    }
    console.log(dupes)
}

function updateChildren(obj, id, name) {
    if ('children' in obj) {
        obj.children.forEach((child, index) => {
             if (child.id == id) {
                 child.name = name;
                 return (id);
             } else {
                 updateChildren(obj.children, id, name)
             }
        })
    }
}

function createChild(obj, node, parent) {
    if ('children' in obj) {
        obj.children.forEach((child, index) => {
            if (child.id == parent) {
                child.children  = node;
                return (id);
            } else {
                createChild(obj.children, node, parent)
            }
        })
    }
}

function deleteChild(obj, id) {
    if ('children' in obj) {
        obj.children.forEach((child, index) => {
            if (child.id == id) {
                delete child;
                return (id);
            } else {
                updateChildren(obj.children, id, name)
            }
        })
    }
}

function tsvJSON(tsv) {
    var lines=tsv.split(/\r\n|\n|\r/);

    var result = [];

    var headers=lines[0].split("\t");

    for(var i=1;i<lines.length;i++){
        var obj = {};
        var currentline=lines[i].split("\t");
        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }
        obj.children = [];

        if (obj.parent !== undefined)
            result.push(obj);
        }

    result.forEach((res, index) => {
        let chillins = result.filter(y => parseInt(y.parent)-1 == index);
        res.children = [...chillins];
        readChildrenIn(res);
    })

    dupes.forEach(dupe => {
        if (result.includes(dupe)) {
            result.splice(result.indexOf(dupe))
        }
    })

    fs.writeFile('tree_data.json', JSON.stringify(result), 'utf8', (err) => {
        if (err) return console.log(error);
    })
    return (JSON.stringify(result))
}

//get_tree
app.get('/get_tree', (req, res) => {
    fs.readFile('tree_data1.csv', 'utf-8', (err, data) => {
        res.send(JSON.stringify(tsvJSON(data)));
        fs.writeFile('tree_data.json', tsvJSON(data), 'utf8', (err) => {
            if (err) return console.log(error);
        })
    });
});

app.post('/update_node', (req, res) => {
    let adr = url.parse(req.url, true);
    let query = adr.query;

    fs.readFile('tree_data.json', 'utf-8', (err, data) => {
        let id;
        let tree = JSON.parse(data);
        tree.forEach(branch => {
            id = updateChildren(branch, query.id, query.name);
        })
        fs.writeFile('tree_data.json', JSON.stringify(tree), 'utf8', (err) => {
            if (err) return console.log(error);
        })

        res.send(query.id);
    });
});

app.get('/delete_node', (req, res) => {
    let adr = url.parse(req.url, true);
    let query = adr.query;

    fs.readFile('tree_data1.csv', 'utf-8', (err, data) => {
        let tree = JSON.parse(data);
        deleteChild(tree, query.id)
        fs.writeFile('tree_data.json', JSON.stringify(tree), 'utf8', (err) => {
            if (err) return console.log(error);
        })
        res.send(query.id);
    });
});

app.post('/create_node', (req, res) => {
    fs.readFile('tree_data1.csv', 'utf-8', (err, data) => {
        let adr = url.parse(req.url, true);
        let query = adr.query;
        let tree = JSON.parse(data);
        tree.forEach(branch => {
            createChild(branch, {
                id: Math.floor(Math.random() * 100),
                name: query.name,
                parent: query.parent,
                description: 'user created'
            })
        })
        fs.writeFile('tree_data.json', JSON.stringify(tree), 'utf8', (err) => {
            if (err) return console.log(error);
        })
        res.send(tree);
    });
});

app.get('/export_csv', (req, res) => {
    fs.readFile('tree_data.json', 'utf-8', (err, data) => {
        //console.log(JSON.parse(data))
        const csvString = json2csv(JSON.parse(data), {delimiter: '\t', quote: ''});
        res.setHeader('Content-disposition', 'attachment; filename=tree-data-download.csv');
        res.set('Content-Type', 'text/csv');
        res.status(200).send(csvString);
    });
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`)
});
