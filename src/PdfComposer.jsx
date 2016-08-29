import React from 'react';
import Dropzone from 'react-dropzone';
import jsPDF from 'jspdf';

const Header = function(props) {
    return (
        <h1>{props.display}</h1>
    );
}

const ImagePreview = function(props) {
    return (
        <li>{props.name} <button onClick={props.onClick}>X</button></li>
    );
}

const ImagePreviewList = function(props) {
    let fileList = props.files.map( (file, index) => {
        return (
            <ImagePreview
                key={index}
                name={file.name}
                onClick={props.handleRemove(file)}
            />
        );
    });
    return (
        <ul>{fileList}</ul>
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

    handleImageRemove = (choice) => {
        return (evt) => {
            this.setState({
                files: this.state.files.filter( file => { return file.name != choice.name } )
            });
        }
    }

    render() {
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
                <ImagePreviewList
                    files={this.state.files}
                    handleRemove={this.handleImageRemove}
                />
                <button onClick={this.genPDF} disabled={this.state.files.length == 0}>Generar PDF</button>
            </div>
        );
    }
}

export default PdfComposer;
