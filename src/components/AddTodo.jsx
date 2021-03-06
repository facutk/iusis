import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { addTodo } from '../actions';

const AddTodo = ({ dispatch }) => {
    let input;

    return (
        <div>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    if (!input.value.trim()) {
                        return;
                    }
                    dispatch(addTodo(input.value));
                    input.value = '';
                }}
            >
                <div className="ui input">
                    <input type="text" ref={node => { input = node; }} />
                    <button type="submit" className="ui primary button">
                        Add Todo
                    </button>
                </div>
            </form>
        </div>
    );
};

AddTodo.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

export default connect()(AddTodo);
