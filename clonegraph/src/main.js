
import _ from 'lodash';

function getUid(name) {
    return name + Math.random();
}

function makePerson(name) {
    return {
        name, friends: [], uid: getUid(name)
    };
}

const origGraph = (function() {
    let graph = {};

    let bob = makePerson('bob');
    let frank = makePerson('frank');
    let cassandra = makePerson('cassandra');

    graph = bob;

    // Bob is friends with frank, frank is friends with bob. Cyclical references.
    bob.friends.push(frank);
    bob.friends.push(cassandra);
    frank.friends.push(bob);
    return graph;
})();

function cloneGraph(rootNode, linkProp) {
    let map = new WeakMap();

    function cloneNodeData(node) {
        let data = {};
        data[linkProp] = Array.prototype.slice.call(node[linkProp]);
        for (var key in node) {
            if (node.hasOwnProperty(key) && key !== linkProp && key !== 'uid') {
                data[key] = node[key];
            }
        }
        data.uid = getUid(data.name);
        return data;
    }

    let clonedRoot = cloneNodeData(rootNode);

    // Need to investigate a better way here.
    map.set(rootNode, clonedRoot);
    map.set(clonedRoot, clonedRoot);

    let buffer = [clonedRoot];

    while (buffer.length > 0) {
        let node = buffer.shift();

        for (let i = node[linkProp].length - 1; i >= 0; i--) {
            let linkedNode = node[linkProp][i];

            if (!map.get(linkedNode)) {
                let clonedLink = cloneNodeData(linkedNode);
                map.set(clonedLink, true);
                node[linkProp][i] = clonedLink;

                buffer.push(clonedLink);
            } else {
                node[linkProp][i] = map.get(linkedNode);
            }
        }
    }
    return clonedRoot;
}

function printNode(node, nodesTravelled = null) {
    if (!nodesTravelled) {
        nodesTravelled = new WeakMap();
    }
    if (!nodesTravelled.get(node)) {
        console.log(node.uid, 'kids:', node.friends.length);
        nodesTravelled.set(node, true);
        _.each(node.friends, (friend) => printNode(friend, nodesTravelled));
    }
}

function startApp() {
    console.log('clonegraph started!');
    let copy = cloneGraph(origGraph, 'friends');
    console.log('------ original');
    printNode(origGraph);

    console.log('------ copy', copy);
    printNode(copy);
}

window.onload = startApp;
