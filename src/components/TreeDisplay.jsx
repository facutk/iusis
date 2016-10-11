import React from 'react';

const initialTree = {
    module: 'PDF', collapsed: true,
    children: [{
        module: 'dist',
        collapsed: true,
        children: [{
            module: 'node.js',
            leaf: true
        }, {
            module: 'react-ui-tree.css',
            blob: 'blob://localhost',
            leaf: true
        }, {
            module: 'react-ui-tree.js',
            leaf: true
        }, {
            module: 'tree.js',
            leaf: true
        }]
    }, {
        module: 'example',
        children: [{
            module: 'app.js',
            leaf: true
        }, {
            module: 'app.less',
            leaf: true
        }, {
            module: 'index.html',
            leaf: true
        }]
    }, {
        module: 'lib',
        children: [{
            module: 'node.js',
            leaf: true
        }, {
            module: 'react-ui-tree.js',
            leaf: true
        }, {
            module: 'react-ui-tree.less',
            leaf: true
        }, {
            module: 'tree.js',
            leaf: true
        }]
    }, {
        module: '.gitiignore',
        leaf: true
    }, {
        module: 'index.js',
        leaf: true
    }, {
        module: 'LICENSE',
        leaf: true
    }, {
        module: 'Makefile',
        leaf: true
    }, {
        module: 'package.json',
        leaf: true
    }, {
        module: 'README.md',
        leaf: true
    }, {
        module: 'webpack.config.js',
        leaf: true
    }]
};




class Node extends React.Component {

    handleCollapse = (event) => {
        event.stopPropagation();
        const nodeId = this.props.index.id;
        if (this.props.onCollapse) this.props.onCollapse(nodeId);
    }

    handleMouseDown = (event) => {
        const nodeId = this.props.index.id;
        const dom = this.refs.inner;
        if (this.props.onDragStart) {
            this.props.onDragStart(nodeId, dom, event);
        }
    }

    renderCollapse = () => {
        const index = this.props.index;
        if (index.children && index.children.length) {
            const collapsed = index.node.collapsed;
            return (
                <span
                    className={'collapse ' + (collapsed ? 'caret-right' : 'caret-down')}
                    onMouseDown={(e)=>{
                        e.stopPropagation();
                    }}
                    onClick={this.handleCollapse}
                >
                </span>
            )
      }

        return null;
    }

    renderChildren = () => {
        var _this = this;

        const index = this.props.index;
        const tree = this.props.tree;
        const dragging = this.props.dragging;

        if (index.children && index.children.length) {
            let childrenStyles = {};

            if (index.node.collapsed) childrenStyles.display = 'none';
            childrenStyles['paddingLeft'] = this.props.paddingLeft + 'px';

            const children = index.children.map( child => {
                const childIndex = tree.getIndex(child);
                return (
                    <Node
                        tree={tree}
                        index={childIndex}
                        key={childIndex.id}
                        dragging={dragging}
                        paddingLeft={this.props.paddingLeft}
                        onCollapse={this.props.onCollapse}
                        onDragStart={this.props.onDragStart}
                    />
                )
            });
            return (
                <div
                    style={childrenStyles}
                >
                    {children}
                </div>
            )
        }

        return null;
    }

    render () {
        var tree = this.props.tree;
        var index = this.props.index;
        var dragging = this.props.dragging;
        var node = index.node;

        return (
            <div>
                <div className={'m-node ' + (index.id === dragging?'placeholder':'') }>
                    <div className="inner" ref="inner" onMouseDown={this.handleMouseDown}>
                        {this.renderCollapse()}
                        {this.props.tree.renderNode( node )}
                    </div>
                    {this.renderChildren()}
                </div>
            </div>
        )
    }


}

import jsTree from './js-tree';

class Tree extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = this.init(this.props);
    }

    init = (props) => {
        const tree = new jsTree(props.tree);
        tree.isNodeCollapsed = props.isNodeCollapsed;
        tree.renderNode = props.renderNode;
        tree.changeNodeCollapsed = props.changeNodeCollapsed;
        tree.updateNodesPosition();
        const treeV2 = props.treeV2;

        return {
            tree: tree,
            treeV2: treeV2,
            dragging: {
                id: null,
                x: null,
                y: null,
                w: null,
                h: null
            }
        }
    }

    componentWillReceiveProps (nextProps) {
        if (!this._updated) {
            this.setState(this.init(nextProps));
        } else {
            this._updated = false;
        }
    }

    getDraggingDom = () => {
        const tree = this.state.tree;
        const dragging = this.state.dragging;

        if (dragging && dragging.id) {
            const draggingIndex = tree.getIndex(dragging.id);
            const draggingStyles = {
                top: dragging.y,
                left: dragging.x,
                width: dragging.w
            };

            return (
                <div className='m-draggable' style={draggingStyles}>
                    <Node
                        tree={tree}
                        index={draggingIndex}
                        paddingLeft={this.props.paddingLeft}
                    />
                </div>
            )
        }
        return null;
    }

    render () {
        var tree = this.state.tree;
        var dragging = this.state.dragging;
        var draggingDom = this.getDraggingDom();

        return (
            <div className='m-tree'>
                {draggingDom}
                <Node
                    tree={tree}
                    index={tree.getIndex(1)}
                    key={1}
                    paddingLeft={this.props.paddingLeft}
                    onDragStart={this.dragStart}
                    onCollapse={this.toggleCollapse}
                    dragging={dragging && dragging.id}
                />
            </div>
        )
    }

    dragStart = (id, dom, e) => {
        this.dragging = {
            id: id,
            w: dom.offsetWidth,
            h: dom.offsetHeight,
            x: dom.offsetLeft,
            y: dom.offsetTop
        };

        this._startX = dom.offsetLeft;
        this._startY = dom.offsetTop;
        this._offsetX = e.clientX;
        this._offsetY = e.clientY;
        this._start = true;

        window.addEventListener('mousemove', this.drag);
        window.addEventListener('mouseup', this.dragEnd);
    }

    drag = (e) => {
        if (this._start) {
            this.setState({
                dragging: this.dragging
            });
            this._start = false;
        }

        var tree = this.state.tree;
        var dragging = this.state.dragging;
        var paddingLeft = this.props.paddingLeft;
        var newIndex = null;
        var index = tree.getIndex(dragging.id);
        var collapsed = index.node.collapsed;

        var _startX = this._startX;
        var _startY = this._startY;
        var _offsetX = this._offsetX;
        var _offsetY = this._offsetY;

        var pos = {
            x: _startX + e.clientX - _offsetX,
            y: _startY + e.clientY - _offsetY
        };
        dragging.x = pos.x;
        dragging.y = pos.y;

        var diffX = dragging.x - paddingLeft / 2 - (index.left - 2) * paddingLeft;
        var diffY = dragging.y - dragging.h / 2 - (index.top - 2) * dragging.h;

        if (diffX < 0) {
            // left
            if (index.parent && !index.next) {
                newIndex = tree.move(index.id, index.parent, 'after');
            }
        } else if (diffX > paddingLeft) {
            // right
            if (index.prev) {
                var prevNode = tree.getIndex(index.prev).node;
                if (!prevNode.collapsed && !prevNode.leaf) {
                    newIndex = tree.move(index.id, index.prev, 'append');
                }
            }
        }

        if (newIndex) {
            index = newIndex;
            newIndex.node.collapsed = collapsed;
            dragging.id = newIndex.id;
        }

        if (diffY < 0) {
            // up
            var above = tree.getNodeByTop(index.top - 1);
            newIndex = tree.move(index.id, above.id, 'before');
        } else if (diffY > dragging.h) {
            // down
            if (index.next) {
                var below = tree.getIndex(index.next);
                if (below.children && below.children.length && !below.node.collapsed) {
                    newIndex = tree.move(index.id, index.next, 'prepend');
                } else {
                    newIndex = tree.move(index.id, index.next, 'after');
                }
            } else {
                var below = tree.getNodeByTop(index.top + index.height);
                if (below && below.parent !== index.id) {
                    if (below.children && below.children.length) {
                        newIndex = tree.move(index.id, below.id, 'prepend');
                    } else {
                        newIndex = tree.move(index.id, below.id, 'after');
                    }
                }
            }
        }

        if (newIndex) {
            newIndex.node.collapsed = collapsed;
            dragging.id = newIndex.id;
        }

        this.setState({
            tree: tree,
            dragging: dragging
        });
    }

    dragEnd = () => {
        this.setState({
            dragging: {
                id: null,
                x: null,
                y: null,
                w: null,
                h: null
            }
        });

        this.change(this.state.tree);
        window.removeEventListener('mousemove', this.drag);
        window.removeEventListener('mouseup', this.dragEnd);
    }

    change = (tree) => {
        this._updated = true;
        if (this.props.onChange) this.props.onChange(tree.obj);
    }

    toggleCollapse = (nodeId) => {
        const tree = this.state.tree;
        const index = tree.getIndex(nodeId);
        const node = index.node;
        node.collapsed = !node.collapsed;

        this.setState({
            tree: tree
        });

        this.change(tree);
    }


}

const NewNode = ({
    tree,
    id,
    onToggleCollapse,
    onToggleActiveNode
}) => {
    const {children, module, collapsed, active} = tree[id]
    return (
        <div className='m-node'>
            <div className='inner'>
                {children.length===0 ? '':(
                    <span
                        className={'collapse ' + (collapsed ? 'caret-right' : 'caret-down')}
                        onMouseDown={(e)=>e.stopPropagation()}
                        onClick={onToggleCollapse.bind(null, id)}
                    ></span>
                )}

                <span
                    className={'node ' + (active ? 'is-active' : '')}
                    onClick={onToggleActiveNode.bind(null, id)}
                >
                    {module}
                </span>
                {collapsed ? '' : children.map(childId =>
                    <NewNode
                        tree={tree}
                        id={childId}
                        key={childId}
                        onToggleCollapse={onToggleCollapse}
                        onToggleActiveNode={onToggleActiveNode}
                    />
                )}

            </div>
        </div>
    )
}
const NewTree = ({
    tree,
    onToggleCollapse,
    onToggleActiveNode
}) => {
    return (
        <NewNode
            className='tree'
            tree={tree}
            id={0}
            onToggleCollapse={onToggleCollapse}
            onToggleActiveNode={onToggleActiveNode}
        />
    )
}

const mapStateToProps = (state) => {
    return {
        tree: state.tree
    }
}
import {toggleCollapsedNode, toggleActiveNode} from '../actions';
const mapDispatchToProps = (dispatch, ownProps) => ({
    onToggleCollapse: (nodeId) => {
        dispatch(toggleCollapsedNode(nodeId))
    },
    onToggleActiveNode: (nodeId) => {
        dispatch(toggleActiveNode(nodeId))
    }
})

import { connect } from 'react-redux';
const SortableTree = connect(mapStateToProps,mapDispatchToProps)(NewTree);





import { DragSource } from 'react-dnd';

const style1 = {
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  cursor: 'move',
  float: 'left'
};

const boxSource = {
  beginDrag(props) {
    return {
      name: props.name
    };
  },

  endDrag(props, monitor) {
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();

    if (dropResult) {
      window.alert( // eslint-disable-line no-alert
        `You dropped ${item.name} into ${dropResult.name}!`
      );
    }
  }
};

@DragSource('box', boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
class Box extends React.Component {


  render() {
    const { isDragging, connectDragSource } = this.props;
    const { name } = this.props;
    const opacity = isDragging ? 0.4 : 1;

    return (
      connectDragSource(
        <div style={{ ...style1, opacity }}>
          {name}
        </div>
      )
    );
  }
}

import { DropTarget } from 'react-dnd';

const style2 = {
  height: '12rem',
  width: '12rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  color: 'white',
  padding: '1rem',
  textAlign: 'center',
  fontSize: '1rem',
  lineHeight: 'normal',
  float: 'left'
};

const boxTarget = {
  drop() {
    return { name: 'Dustbin' };
  }
};

@DropTarget('box', boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
class Dustbin extends React.Component {


  render() {
    const { canDrop, isOver, connectDropTarget } = this.props;
    const isActive = canDrop && isOver;

    let backgroundColor = '#222';
    if (isActive) {
      backgroundColor = 'darkgreen';
    } else if (canDrop) {
      backgroundColor = 'darkkhaki';
    }

    return connectDropTarget(
      <div style={{ ...style2, backgroundColor }}>
        {isActive ?
          'Release to drop' :
          'Drag a box here'
        }
      </div>
    );
  }
}





import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
@DragDropContext(HTML5Backend)
class Container extends React.Component {
  render() {
    return (
      <div>
        <div style={{ overflow: 'hidden', clear: 'both' }}>
          <Dustbin />
        </div>
        <div style={{ overflow: 'hidden', clear: 'both' }}>
          <Box name='Glass' />
          <Box name='Banana' />
          <Box name='Paper' />
        </div>
      </div>
    );
  }
}

class TreeDisplay extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            active: null,
            tree: initialTree,
        }
    }

    renderNode = (node) => {
        return (
            <span
                className={'node ' + (node === this.state.active ? 'is-active':'')}
                onClick={this.onClickNode.bind(null, node)}
            >
                {node.module}
            </span>
        )
    }

    onClickNode = (node) => {
        this.setState({
            active: node
        })
    }

    handleChange = (tree) => {
        this.setState({
            tree: tree
        });
    }

    render() {
        return (
            <div className="tree">
                <h1>I U S I S</h1>
                <div className="ui divider"></div>
                <div className="fluid ui buttons">
                    <button className="ui teal button"><i className="download icon"></i> Generar PDF</button>
                    <button className="ui red cancel button"><i className="trash icon"></i>Limpiar</button>
                    <button className="ui button"><i className="setting icon"></i></button>
                </div>
                <div className="ui divider"></div>
                <Tree
                    paddingLeft={20}
                    tree={this.state.tree}
                    treeV2={this.state.treeV2}
                    onChange={this.handleChange}
                    isNodeCollapsed={this.isNodeCollapsed}
                    renderNode={this.renderNode}
                />
                <SortableTree />
                <Container />
            </div>
        )
    }
}

export default TreeDisplay;
