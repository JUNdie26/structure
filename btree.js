class BTreeNode {
    constructor(t) {
        this.t = t; // 최소 차수
        this.keys = []; // 노드의 키
        this.children = []; // 자식 노드
        this.leaf = true; // 리프 노드 여부
    }

    splitChild(i, y) {
        const t = this.t;
        const z = new BTreeNode(t);
        z.leaf = y.leaf;
        z.keys = y.keys.splice(t - 1);
        if (!y.leaf) {
            z.children = y.children.splice(t);
        }
        this.children.splice(i + 1, 0, z);
        this.keys.splice(i, 0, y.keys.pop());
    }

    insertNonFull(k) {
        let i = this.keys.length - 1;
        if (this.leaf) {
            while (i >= 0 && k.key < this.keys[i].key) {
                i--;
            }
            this.keys.splice(i + 1, 0, k);
        } else {
            while (i >= 0 && k.key < this.keys[i].key) {
                i--;
            }
            i++;
            if (this.children[i].keys.length === (2 * this.t) - 1) {
                this.splitChild(i, this.children[i]);
                if (k.key > this.keys[i].key) {
                    i++;
                }
            }
            this.children[i].insertNonFull(k);
        }
    }

    search(k) {
        let i = 0;
        while (i < this.keys.length && k > this.keys[i].key) {
            i++;
        }
        if (i < this.keys.length && k === this.keys[i].key) {
            return this.keys[i];
        } else if (this.leaf) {
            return null;
        } else {
            return this.children[i].search(k);
        }
    }
}

class BTree {
    constructor(t) {
        this.root = new BTreeNode(t);
        this.t = t;
    }

    insert(k) {
        const r = this.root;
        if (r.keys.length === (2 * this.t) - 1) {
            const s = new BTreeNode(this.t);
            this.root = s;
            s.leaf = false;
            s.children.push(r);
            s.splitChild(0, r);
            s.insertNonFull(k);
        } else {
            r.insertNonFull(k);
        }
    }

    search(k) {
        return this.root.search(k);
    }
}

module.exports = BTree;
