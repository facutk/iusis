import React from 'react';
import Dropzone from 'react-dropzone';
import jsPDF from 'jspdf';

const Header = function(props) {
    return (
        <h1>{props.display}</h1>
    );
}

class PdfComposer extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            display: '',
            files: []
        };
    }

    componentDidMount() {
        this.setState({
            display: 'IUSIS'
        });
    }

    onFileDrop = (files) => {
        console.log('Received files: ', files);
        this.setState({
            files: this.state.files.concat(files)
        });
    }

    genPDF = () => {
        var doc = new jsPDF();
        doc.text(20, 20, this.state.files.length + ' archivos');
        doc.save('Test.pdf');
    }

    render() {
        let fileList = this.state.files.map( file => {
            return (
                <li>{file.name}</li>
            );
        });

        return (
            <div>
                <Header
                    display={this.state.display}
                />
                <Dropzone onDrop={this.onFileDrop}>
                    <div>Arrastra imagenes, o hace click para formar el PDF.</div>
                </Dropzone>
                <ul>{fileList}</ul>
                <button onClick={this.genPDF}>Generar PDF</button>
            </div>
        );
    }
}

export default PdfComposer;
