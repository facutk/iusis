import React from 'react';
import Dropzone from 'react-dropzone';
import jsPDF from 'jspdf';
import { Sortable } from 'react-sortable';
import { dispatch } from 'redux';
import { connect } from 'react-redux';
import TreeDisplay from './TreeDisplay';
import { v4 } from 'node-uuid';


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
            draggingIndex: null,
            draggingFiles: false
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
            //console.log('image loaded!', canvas)
            canvas.toBlob(onsuccess, "image/jpeg", 0.95);
        };

        img.src = b64;
    }

    convert = (files) => {
        //console.log(files);

        files.forEach( file => {
            //console.log( file.name, v4() )
            const newFileNodeId = v4()
            const newNodeData = {
                name: file.name
            }
            //console.log(this.props)
            this.props.onNodeAdd(0, newFileNodeId, newNodeData)

            this.objectURLAsBlob(file.preview).then( blob => {

                //console.log(blob);
                let formData = new FormData()
                formData.append('file', blob);
                formData.append('type', file.name.split('.').pop()); // is this needed?

                this.props.onFetchStart();
                fetch('/api/convert', {
                    method: 'POST',
                    body: formData
                })
                .then(result=>result.json())
                .then(b64Images =>{

                    //setTimeout(()=>{}, 2000)

                    b64Images.forEach( (b64Image, index) => {
                        var base64Data = 'data:image/jpg;base64,' + b64Image;
                        //console.log(base64Data);
                        this.b64toBlob(base64Data, blob => {

                                var url = window.URL.createObjectURL(blob);
                                //console.log(url);

                                this.setState({
                                    files: this.state.files.concat({
                                        name: file.name + ' (' + (index + 1) + '/' + b64Images.length + ')',
                                        preview: url,
                                        size: blob.size
                                    })
                                });

                                const newNodeData = {
                                    name: (index + 1).toString()
                                }
                                //console.log(this.props)
                                this.props.onNodeAdd(newFileNodeId, v4(), newNodeData)
                                // do something with url
                            }, error => {
                                // handle error
                            });
                    });
                    this.props.onFetchEnd();
                })
                .catch(error=>{
                    console.log(error);
                    this.props.onFetchEnd();
                });

            });
        });

    }

    onFileDrop = (files) => {
        this.setState({
            draggingFiles: false
        })
        let images = [];
        let toConvert = [];
        files.forEach( file => {
            switch (file.name.split('.').pop()) {
                case 'jpg':
                case 'jpeg':
                    images.push(file);
                    break;
                case 'odt':
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
                let doc = new jsPDF("p", "mm", "a4");
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

    handleDrop = (event) => {
        event.preventDefault();
    }

    handleDragLeave = (event) => {
        event.preventDefault();
    }

    handleDragover = (event) => {
        event.preventDefault();

        const containsFiles = (event) => {
            if (event.dataTransfer.types) {
                for (var i = 0; i < event.dataTransfer.types.length; i++) {
                    if (event.dataTransfer.types[i] == "Files") {
                        return true
                    }
                }
            }
            return false
        }

        if ( containsFiles(event) ) {
            this.setState({
                draggingFiles: true
            })
        }

    }

    componentWillMount = () => {
        document.addEventListener('drop', this.handleDrop);
        window.addEventListener('dragover', this.handleDragover);
        window.addEventListener('dragleave', this.handleDragLeave);
    }

    componentWillUnmount  = () => {
        document.removeEventListener('drop', this.handleDrop);
        window.removeEventListener('dragover', this.handleDragover);
        window.removeEventListener('dragleave', this.handleDragLeave);
    }
    render() {
        const {loading} = this.props;
        //<div className="ui dimmer active"></div>

        return (
            <div className="pdf-composer">
                { (process.env.NODE_ENV != 'production')? <TreeDisplay /> : null }

                <div className="ui centered card">
                    <div className="ui">
                        <Dropzone
                            onDragOver={(e) => {
                                console.log(e)
                            }}
                            className={'dropzone ' + (this.state.draggingFiles ? 'fullpage': '')}
                            onDrop={this.onFileDrop}>

                            <div className={"ui inline loader " + (loading?'active':'') } ></div>

                            {this.state.draggingFiles ? (
                                <div>
                                    <span>Solta aquí los archivos</span>
                                    <p>
                                        <small>
                                            <a href="#"
                                                onClick={(event)=>{
                                                    event.stopPropagation()
                                                    this.setState({
                                                        draggingFiles: false
                                                    })
                                                }}>Cancelar</a>
                                        </small>
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <span>Hacé click o arrastrá archivos</span>
                                    <ul>
                                        <li>.docx</li>
                                        <li>.pdf</li>
                                        <li>.jpg</li>
                                    </ul>
                                </div>
                            )}
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
        loading: state.fetchCount > 0
    }
}
import { incFetchCount, decFetchCount, onNodeAdd } from '../actions';
const mapDispatchToComposerProps = (dispatch) => {
    return {
        onMaxSizeChange: (maxSize) => {
            dispatch({
                type: 'PDF_MAX_SIZE',
                maxSize: maxSize
            })
        },
        onFetchStart: () => dispatch(incFetchCount()),
        onFetchEnd: () => dispatch(decFetchCount()),
        onNodeAdd: (parentNodeId, nodeId, nodeData) => dispatch(onNodeAdd(parentNodeId, nodeId, nodeData))
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
