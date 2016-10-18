import React from 'react'
import TreeDisplay from './TreeDisplay'

const Sidebar = () => {
    return (
        <div>
            <div className="ui divider"></div>
            <div className="fluid ui vertical buttons">
                <button className="ui teal button"><i className="download icon"></i> Generar PDF</button>
                <button className="ui red cancel button"><i className="trash icon"></i> Limpiar</button>
                <button className="ui button"><i className="setting icon"></i> Configuración</button>
            </div>
            <div className="ui divider"></div>
            { (process.env.NODE_ENV != 'production')? <TreeDisplay /> : null }
        </div>
    )
}

export default Sidebar;
