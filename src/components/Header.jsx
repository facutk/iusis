import React from 'react';
import {connect} from 'react-redux';
import { setHeader } from '../actions';

const Header = ({header, onDoubleClick}) => {
    //<button className="ui icon button"><i className="sidebar icon"></i></button>
    return (
        <div
            className="ui header nav"
            onDoubleClick={onDoubleClick}
        >
            <h1>{header}</h1>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        header: state.header
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onDoubleClick: () => {
            dispatch(setHeader('I U S I S | pdf à la carte'))
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Header);
