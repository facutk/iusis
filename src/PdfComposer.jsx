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

    readImageUrl(url) {
        console.log(url)
        return new Promise( (resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';

            xhr.onload = function() {
                let reader = new FileReader();
                reader.onloadend = function() {
                    resolve(reader.result);
                }
                reader.readAsDataURL(xhr.response);
            };

            xhr.onerror = () => reject(this);
            xhr.open('GET', url);
            xhr.send();
        });
    }


    genPDF = () => {
        var doc = new jsPDF();
        Promise.all( this.state.files.map( file => { return this.readImageUrl(file.preview) } ) )
        .then(dataUrls => {
            dataUrls.forEach( (dataUrl, index) => {
                if (index) doc.addPage();
                doc.addImage(dataUrl, 'JPEG', 0, 0, 210, 297);
            })
            doc.save('Test.pdf');
        });
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
                <Dropzone
                    onDrop={this.onFileDrop}
                    accept="image/*">
                    <div>Arrastra imagenes, o hace click para formar el PDF.</div>
                </Dropzone>
                <ul>{fileList}</ul>
                <button onClick={this.genPDF}>Generar PDF</button>
            </div>
        );
    }
}

export default PdfComposer;
