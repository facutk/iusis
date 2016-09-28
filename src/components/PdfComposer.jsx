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

    b64toBlob = (b64, onsuccess, onerror) => {
        var img = new Image();

        img.onerror = onerror;

        img.onload = function onload() {
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            console.log('image loaded!', canvas)
            canvas.toBlob(onsuccess);
        };

        img.src = b64;
    }

    convert = (files) => {
        console.log(files);

        files.forEach( file => {
            this.objectURLAsBlob(file.preview).then( blob => {

                console.log(blob);
                let formData = new FormData()
                formData.append('file', blob);
                formData.append('type', file.name.split('.').pop()); // is this needed?

                fetch('/api/convert', {
                    method: 'POST',
                    body: formData
                })
                .then(result=>result.json())
                .then(b64Images =>{
                    console.log(b64Images)
                    /*
                    [
                        {
                            "converted image": "image data"
                        }
                    ]
                    */
                    b64Images.map(b64Image => {
                        var base64Data = 'data:image/jpeg;base64,' + b64Image;
                        console.log(base64Data);
                        this.b64toBlob(base64Data, blob => {
                                var url = window.URL.createObjectURL(blob);
                                console.log(url);

                                this.setState({
                                    files: this.state.files.concat({
                                        name: 'generated',
                                        preview: url
                                    })
                                });
                                // do something with url
                            }, error => {
                                // handle error
                            });
                    });

                }).catch(error=>{
                    console.log(error);
                });

            });
        });

    }

    onFileDrop = (files) => {

        let images = [];
        let toConvert = [];
        files.forEach( file => {
            switch (file.name.split('.').pop()) {
                case 'jpg':
                case 'jpeg':
                    images.push(file);
                    break;
                case 'doc':
                case 'docx':
                case 'pdf':
                    toConvert.push(file);
                    break;
            }
        });

        this.convert(toConvert);

        this.setState({
            files: this.state.files.concat(images)
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

    blobAsDataURL(blob) {
        return new Promise( (resolve, reject) => {
            let reader = new FileReader();
            reader.onloadend = function() {
                resolve(reader.result);
            }
            reader.readAsDataURL(blob);
        })
    }

    objectURLAsBlob(url) {
        return new Promise( (resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';

            xhr.onload = function() {
                resolve(xhr.response);
                //console.log(xhr.response);
                /*
                let reader = new FileReader();
                reader.onloadend = function() {
                    resolve(reader.result);
                }
                reader.readAsDataURL(xhr.response);
                */
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
            Promise.all( fileGroup.map( file => {
                return this.objectURLAsBlob(file.preview).then(blob => { return this.blobAsDataURL(blob) } )
            } ) )
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
                            onDrop={this.onFileDrop}>
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
