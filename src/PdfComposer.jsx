import React from 'react';
import Dropzone from 'react-dropzone';
import jsPDF from 'jspdf';
import { Sortable } from 'react-sortable';


const PreviewCard = function(props) {
    return (
        <div className="ui centered card">
            <div className="image">
                <img src={props.preview} />
            </div>
            <div className="content">
                <span>{props.name}</span>
                <button className="ui basic compact button icon right floated" onClick={props.handleRemove}>
                    <i className="remove outline icon"></i>
                </button>
            </div>
        </div>
    );
}

const ImagePreview = function(props) {
    return (
        <div {...props}>{props.children}</div>
    );
}

const SortableImagePreview = Sortable(ImagePreview);

const ImagePreviewList = function(props) {
    let fileList = props.files.map( (file, index) => {
        return (
            <SortableImagePreview
                key={index}
                sortId={index}
                outline="list"
                updateState={props.updateState}
                draggingIndex={props.draggingIndex}
                items={props.files}
                name={file.name}
            >

                <PreviewCard
                    name={file.name}
                    preview={file.preview}
                    handleRemove={props.handleRemove(file)}
                />
            </SortableImagePreview>
        );
    });
    return (
        <div>{fileList}</div>
    );
}

class PdfComposer extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            files: [],
            draggingIndex: null
        };
    }

    onFileDrop = (files) => {
        this.setState({
            files: this.state.files.concat(files)
        });
    }

    updateState = (obj) => {
        this.setState(obj);
    }

    readImageUrl(url) {
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
            window.URL.revokeObjectURL(choice.preview);
            this.setState({
                files: this.state.files.filter( file => { return file.name != choice.name } )
            });
        }
    }

    render() {
        var dropzoneStyle = {
            width: '100%',
            height: 200
        };
        return (
            <div>
                <div className="ui centered card">
                    <Dropzone
                        style={dropzoneStyle}
                        onDrop={this.onFileDrop}
                        accept="image/*">
                        <div>Arrastra imagenes, o hace click para formar el PDF.</div>
                    </Dropzone>
                    <button className="ui primary button" onClick={this.genPDF} disabled={this.state.files.length == 0}>Generar PDF</button>
                </div>
                <ImagePreviewList
                    files={this.state.files}
                    draggingIndex={this.state.draggingIndex}
                    handleRemove={this.handleImageRemove}
                    updateState={this.updateState}
                />
            </div>
        );
    }
}

export default PdfComposer;
