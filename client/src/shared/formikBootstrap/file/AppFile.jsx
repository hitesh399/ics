import React, { useRef, useEffect, useState } from 'react';
import { AppInput } from '../Fields';

export function isImage(dataURL) {
    try {
        const mimeType = dataURL.split(',')[0].split(':')[1].split(';')[0];
        return !!mimeType.match('image.*');
    } catch (e) {
        return false;
    }
}
export const AppFile = ({ acceptedFiles, isImage, btnText = 'Select A File', ...props }) => {
    return (
        <AppInput {...props}>
            {(inputProps) => {
                return (
                    <>
                        {isImage ? (
                            <AppImageSelector
                                name={inputProps.name}
                                btnText={btnText}
                                onChange={inputProps.onChange}
                                file={inputProps.value}
                            />
                        ) : (
                            <AppFileSelector
                                name={inputProps.name}
                                btnText={btnText}
                                onChange={inputProps.onChange}
                                value={inputProps.value}
                            />
                        )}
                    </>
                );
            }}
        </AppInput>
    );
};

export const AppFileSelector = ({ btnText, multiple, onChange, name, value }) => {
    const handleButtonClick = (e) => {
        e.currentTarget.closest('.selector-wrapper').querySelector('input[type="file"]').click();
    };
    return (
        <div className="selector-wrapper">
            <button
                type="button"
                className="btn btn-primary mb-1 dz-clickable"
                onClick={handleButtonClick}>
                <i className="icon-file2"></i> {btnText}
            </button>
            <FileNameHolder file={value} />
            <input
                type="file"
                style={{ display: 'none' }}
                name={name}
                multiple={multiple}
                onChange={onChange}
            />
        </div>
    );
};
const FileNameHolder = ({ file }) => {
    return <p>{file instanceof File ? file.name : file}</p>;
};
export const AppImageSelector = ({ multiple, onChange, name, file }) => {
    const handleButtonClick = (e) => {
        e.currentTarget.closest('.selector-wrapper').querySelector('input[type="file"]').click();
    };
    return (
        <div className="selector-wrapper">
            <div onClick={handleButtonClick} className="image-selector">
                {file ? <ImagePreviewer file={file} /> : <i className="fas fa-plus" />}
            </div>
            <input
                style={{ display: 'none' }}
                type="file"
                name={name}
                multiple={multiple}
                onChange={onChange}
            />
        </div>
    );
};

export const ImagePreviewer = ({ file }) => {
    const [isValidImage, setValidImage] = useState(null);
    const [imageURL, setImageURL] = useState(null);

    useEffect(() => {
        setValidImage(null);
        if (file instanceof File) {
            const fReader = new FileReader();
            fReader.onload = (e) => {
                if (isImage(e.target.result)) {
                    setImageURL(e.target.result);
                    setValidImage(true);
                } else {
                    setValidImage(false);
                    setImageURL(null);
                }
            };
            fReader.readAsDataURL(file);
        } else if (file && typeof file === 'string' && isImage(file)) {
            setImageURL(file);
            setValidImage(true);
        } else {
            setValidImage(false);
            setImageURL(null);
        }
    }, [file]);
    if (isValidImage === null) {
        return <i className="fas fa-spinner" />;
    } else if (isValidImage === true) {
        return <img src={imageURL} alt="Selected File" />;
    } else {
        return <p>Invalid File</p>;
    }
};
