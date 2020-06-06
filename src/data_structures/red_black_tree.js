// Exported for the tests :(
export class RBTNode {
  static BLACK = 'black';
  static RED = 'red';
  static sentinel = Object.freeze({ color: RBTNode.BLACK });

  constructor({
    key, value,
    color = RBTNode.RED,
    parent = RBTNode.sentinel,
    left = RBTNode.sentinel,
    right = RBTNode.sentinel,
  }) {
    this.key = key;
    this.value = value;
    this.color = color;
    this.parent = parent;
    this.left = left;
    this.right = right;
  }
}

class RedBlackTree {
  constructor(Node = RBTNode) {
    this.Node = Node;
    this._count = 0;
  }

  _findNode(key) {
    // Retuns {node, parent}, either of which may be undefined
    // Node undefined means the key isn't in the tree
    // Parent undefined means node is the root
    let node = this._root;
    let parent = node?.parent;

    // Nodes without keys are considered sentinels
    while (node && node.key !== undefined) {
      if (key < node.key) {
        parent = node;
        node = node.left;
      } else if (key > node.key) {
        parent = node;
        node = node.right;
      } else { // equal
        break;
      }
    }
    return { node, parent }
  }

  lookup(key) {
    return this._findNode(key).node?.value;
  }

  /**
   * The two rotation functions are symetric, and could presumably
   * be collapsed into one that takes a direction 'left' or 'right',
   * calculates the opposite, and uses [] instead of . to access.
   * 
   * Felt too confusing to be worth it. Plus I bet* the JIT optimizes two
   * functions with static lookups better than one with dynamic lookups.
   * 
   * (*without any evidence whatsoever, 10 points to anyone who tries it out)
   */
  _rotateLeft(node) {
    const child = node.right;

    if (node === RBTNode.sentinel) {
      throw new Error('Cannot rotate a sentinel node');
    } else if (child === RBTNode.sentinel) {
      throw new Error('Cannot rotate away from a sentinal node');
    }

    // turn child's left subtree into node's right subtree
    node.right = child.left;
    if (child.left !== RBTNode.sentinel) {
      child.left.parent = node;
    }

    // link node's parent to child
    child.parent = node.parent;
    if (node === this._root) {
      this._root = child;
    } else if (node === node.parent.left) {
      node.parent.left = child;
    } else {
      node.parent.right = child;
    }

    // put node on child's left
    child.left = node;
    node.parent = child;

    // LOOK AT ME
    // I'M THE PARENT NOW
  }

  _rotateRight(node) {
    const child = node.left;

    if (node === RBTNode.sentinel) {
      throw new Error('Cannot rotate a sentinel node');
    } else if (child === RBTNode.sentinel) {
      throw new Error('Cannot rotate away from a sentinal node');
    }

    // turn child's right subtree into node's left subtree
    node.left = child.right;
    if (child.right !== RBTNode.sentinel) {
      child.right.parent = node;
    }

    // link node's parent to child
    child.parent = node.parent;
    if (node === this._root) {
      this._root = child;
    } else if (node === node.parent.right) {
      node.parent.right = child;
    } else {
      node.parent.left = child;
    }

    // put node on child's right
    child.right = node;
    node.parent = child;

  }

  _insertInternal(key, value = true) {
    const results = this._findNode(key);
    let { node } = results;
    const { parent } = results;

    if (node?.key) {
      // key already in the tree, replace the value
      node.value = value;

    } else {
      // new node
      node = new this.Node({ key, value, parent });
      this._count += 1;
      if (parent?.key) {
        if (key < parent.key) {
          parent.left = node;
        } else {
          parent.right = node;
        }

      } else {
        this._root = node;
      }
    }
    return node;
  }

  // _insertInternal(key, value) {

  // }

  _insertRebalance(node) {
    while(node.color === RBTNode.RED && node.parent.color === RBTNode.RED) {
      let parent = node.parent;
      let grandparent = parent.parent;
      // console.log(node)
      // console.log(parent)
      // console.log(grandparent)


      if(grandparent.left?.key === parent.key){
        // parent is the left child
        let uncle = grandparent.right

        if(uncle.color === RBTNode.RED){
          // swap colors between generations
          parent.color = RBTNode.BLACK;
          uncle.color =  RBTNode.BLACK;
          grandparent.color = RBTNode.RED;
          node = grandparent;
          if (node.parent === RBTNode.sentinel){
            console.log(node)
            node.color === RBTNode.BLACK;
            break;
          }
          // do we need to check if we hit root?
          
          // continue, possibly done, will be done at root
        } else {
          // uncle is black
          if(parent.right.key === node.key){
            parent = node;
            node = node.parent;
            this._rotateLeft(node);
          }
          if(parent.left.key === node.key){
            parent.color = RBTNode.BLACK
            grandparent.color = RBTNode.RED
            this._rotateRight(grandparent)
          }
        }

      } else {
        // // 
        //   // parent is the right child () if grandparent.right.key === parent.key
        //   let uncle = grandparent.left

        //   // uncle is red
        //   if(uncle?.color === RBTNode.RED){
        //     parent.color = RBTNode.BLACK;
        //     uncle.color =  RBTNode.BLACK;
        //     grandparent.color = RBTNode.RED;
        //     node = grandparent;
        //     // when node becomes the root and its red how do we change to black?
        //     // NOTE: do we have to do this
        //     // if statement if node.parent = sentinel then node.color = black
        //   } else { //else uncle is black
        //     if(parent.right.key === node.key){
        //       parent = node;
        //       node = node.parent;
        //       this._rotateRight(node);
        //     }
        //     if(parent.left.key === node.key){
        //       parent.color = RBTNode.BLACK;
        //       grandparent.color = RBTNode.RED;
        //       this._rotateLeft(grandparent);
        //     }
        //   }
      }
    }
}

   



  

  insert(key, value) {
    const node = this._insertInternal(key, value);
    this._insertRebalance(node);
  }

  delete(key) {

  }

  count() {
    return this._count;
  }

  forEach(callback) {
  }
}


export default RedBlackTree;