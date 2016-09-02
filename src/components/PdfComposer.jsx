import React from 'react';
import Dropzone from 'react-dropzone';
import jsPDF from 'jspdf';
import { Sortable } from 'react-sortable';
import { dispatch } from 'redux';
import { connect } from 'react-redux';
import './PdfComposer.scss';

const PreviewContent = function(props) {
    return (
        <div className="ui centered card">
            <div className="image">
                <img src={props.preview} />
            </div>
            <div className="content">
                <span >{props.name}</span>
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

                <PreviewContent
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


class Composer extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            files: [],
            maxSize: '',
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

    handleMaxSize = (event) => {
        this.setState({
            maxSize: event.target.value
        });
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

    getFileGroups() {
        // Split files into groups
        let fileGroups = [];
        if (this.state.maxSize > 0) {
            const maxSize = this.state.maxSize * 1024 * 1024;
            let currentGroup = [];
            const pdfOverHead = 10 * 1024;
            let currentSize = pdfOverHead;

            this.state.files.forEach( file => {
                if ( (currentSize + file.size ) > maxSize) {
                    fileGroups.push(currentGroup);
                    currentGroup = [];
                    currentSize = pdfOverHead;
                }
                currentSize += file.size;
                currentGroup.push(file)
            });
            fileGroups.push(currentGroup);
        } else {
            fileGroups.push(this.state.files);
        }
        return fileGroups;
    }

    genPDF = () => {
        // render grouped files
        const fileGroups = this.getFileGroups();
        const dateNow = new Date();
        fileGroups.forEach( (fileGroup, groupIndex) => {
            Promise.all( fileGroup.map( file => { return this.readImageUrl(file.preview) } ) )
            .then(dataUrls => {
                let doc = new jsPDF();
                dataUrls.forEach( (dataUrl, index) => {
                    if (index) doc.addPage();
                    doc.addImage(dataUrl, 'JPEG', 0, 0, 210, 297);
                })
                let filename = 'iusis' + '-' + dateNow.getTime() + '-' + groupIndex + '.pdf';
                doc.save(filename);
            });
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
        return (
            <div className="pdf-composer">
                <div className="ui centered card">
                    <div className="ui">
                        <Dropzone
                            className="dropzone"
                            onDrop={this.onFileDrop}
                            accept="image/jpeg">
                            <div>Arrastra imagenes, o hace click para formar el PDF.</div>
                        </Dropzone>
                    </div>
                    <div className="content ui mini transparent input">
                        <input
                            type="number"
                            name="quantity"
                            min="1"
                            placeholder="Tamaño máximo (Mb)"
                            value={this.state.maxSize}
                            onChange={this.handleMaxSize}
                        />
                    </div>
                    <button
                        className="ui primary button"
                        onClick={this.genPDF}
                        disabled={this.state.files.length == 0}>
                        Generar PDF
                    </button>
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

const mapStateToComposerProps = (state) => {
    return {

    }
}
const mapDispatchToComposerProps = (dispatch) => {
    return {
        onMaxSizeChange: (maxSize) => {
            dispatch({
                type: 'PDF_MAX_SIZE',
                maxSize: maxSize
            })
        }
    }
}
const VisibleComposer = connect(
    mapStateToComposerProps,
    mapDispatchToComposerProps
)(Composer)

const PdfComposer = function(props) {
    return (
        <VisibleComposer />
    );
}

export default PdfComposer;