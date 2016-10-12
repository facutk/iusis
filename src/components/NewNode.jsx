import React from 'react';
import { findDOMNode } from 'react-dom';
import { DropTarget, DragSource } from 'react-dnd';

const boxSource = {
    beginDrag(props) {
        return {
            id: props.id
        };
    },

    endDrag(props, monitor) {
        const node = monitor.getItem();
        const dropResult = monitor.getDropResult();

        if (dropResult) {
            console.log( // eslint-disable-line no-alert
                `You dropped ${node.id} into ${dropResult.id}!`
            );
        }
    }
}

const boxTarget = {
    hover(props, monitor, component) {
        const dragId = monitor.getItem().id;
        const hoverId = props.id;
        if ( !monitor.isOver({ shallow: true }) ) return
        if ( !dragId ) return
        // Don't replace items with themselves
        if (dragId == hoverId) {
            return;
        }

        props.onMove(dragId, hoverId)
    },

    drop(props, monitor, component) {
        const hasDroppedOnChild = monitor.didDrop();
        if (hasDroppedOnChild) {
            return;
        }
        return { id: props.id };
    }
};


const Node = ({
    tree,
    id,
    onMove,
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
                    >
                    </span>
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
                        onMove={onMove}
                        key={childId}
                        onToggleCollapse={onToggleCollapse}
                        onToggleActiveNode={onToggleActiveNode}
                    />
                )}

            </div>
        </div>
    )
}



@DropTarget('node', boxTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true })
}))
@DragSource('node', boxSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
}))
class NewNode extends React.Component {
    render() {
        const {
            tree,
            id,
            onMove,
            onToggleCollapse,
            onToggleActiveNode,
            isDragging,
            connectDragSource,
            connectDropTarget
        } = this.props

        return connectDragSource(connectDropTarget(
            <div>
                <Node
                    tree={tree}
                    id={id}
                    onMove={onMove}
                    onToggleCollapse={onToggleCollapse}
                    onToggleActiveNode={onToggleActiveNode}
                />
            </div>
        ))
    }
}

export default NewNode;
