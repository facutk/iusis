import React from 'react';
import { DragSource } from 'react-dnd';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

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
      console.log( // eslint-disable-line no-alert
        `You dropped ${item.name} into ${dropResult.name}!`
      );
    }
  }
};

@DragSource('node', boxSource, (connect, monitor) => ({
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
  color: '#aaa',
  padding: '1rem',
  textAlign: 'center',
  fontSize: '1rem',
  lineHeight: 'normal',
  float: 'left'
};

const boxTarget = {
  drop() {
    return { id: 'Dustbin' };
  }
};

@DropTarget('node', boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
class Dustbin extends React.Component {
  render() {
    const { canDrop, isOver, connectDropTarget } = this.props;
    const isActive = canDrop && isOver;

    let backgroundColor = '#fafafa';
    if (isActive) {
      backgroundColor = 'darkred';
    } else if (canDrop) {
      backgroundColor = 'darkkhaki';
    }

    return connectDropTarget(
      <div style={{ ...style2, backgroundColor }}>
          <div>
              {isActive ?
                  'Solta para borrar' :
                  'Borrar archivos'
              }
              <i className="trash icon"></i>
          </div>
      </div>
    );
  }
}






class Container extends React.Component {
  render() {
    return (
      <div>
        <div style={{ overflow: 'hidden', clear: 'both' }}>
          <Dustbin />
        </div>
      </div>
    );
  }
}



import NewNode from './NewNode';


const NewTree = ({
    tree,
    onToggleCollapse,
    onToggleActiveNode,
    onNodeMove
}) => {
    //console.log(tree)
    /*
    const printNode = (tree, nodeId, depth) => {
        let spaces = ''
        for (let i = 0; i < depth; i++) spaces = spaces + '    '

        console.log( spaces + tree[nodeId].module)
        tree[nodeId].children.map(childId => {
            printNode(tree, childId, depth + 1)
        })
    }
    printNode(tree, 0, 0)
    */

    const treeToList = (tree, nodeId, depth) => {
        return [nodeId].concat(...tree[nodeId].children.map(childId => {
                    return treeToList(tree, childId, depth + 1)
                }))
    }
    const treeAsList = treeToList(tree, 0, 0)
    console.log(treeAsList)

    return (
        <NewNode
            className='tree'
            tree={tree}
            id={0}
            onMove={onNodeMove}
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
import {toggleCollapsedNode, toggleActiveNode, onNodeMove } from '../actions';
const mapDispatchToProps = (dispatch, ownProps) => ({
    onToggleCollapse: (nodeId) => {
        dispatch(toggleCollapsedNode(nodeId))
    },
    onToggleActiveNode: (nodeId) => {
        dispatch(toggleActiveNode(nodeId))
    },
    onNodeMove: (sourceId, destinationId) => {
        dispatch(onNodeMove(sourceId, destinationId))
    }
})

import { connect } from 'react-redux';
const SortableTree = connect(mapStateToProps, mapDispatchToProps)(NewTree);
@DragDropContext(HTML5Backend)
class TreeDisplay extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div className="tree">
                <SortableTree />
                <Container />
            </div>
        )
    }
}

export default TreeDisplay;
