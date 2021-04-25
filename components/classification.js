import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, Paper, Button, IconButton, FormControlLabel, Radio } from '@material-ui/core';
import { split, map, isEmpty, forEach, findIndex, slice, range, remove, intersection, includes, join, size, get } from 'lodash';

import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import { makeStyles } from '@material-ui/core/styles';

import { useSelector } from 'react-redux';
import { API_SERVER_ADDRESS } from 'constants/defaults';

const CLASSIFICATIONS = [
    {
        name: '💥 Action',
        value: 'action'
    },
    {
        name: '🌄 Adventure',
        value: 'adventure'
    },
    {
        name: '😄 Comedy',
        value: 'comedy'
    },
    {
        name: '🎭 Drama',
        value: 'drama'
    },
    {
        name:'👪 Family film',
        value: 'family film'
    },
    {
        name: '💀 Horror',
        value: 'horror'
    },
    {
        name: '🔎 Mystery',
        value: 'mystery'
    },
    {
        name: '💞 Romance',
        value: 'romance'
    },
    {
        name: '👽 Science-Fiction',
        value: 'science-fiction'
    },
    {
        name: '🙈 Thriller',
        value: 'thriller'
    },
    {
        name: '🌌 Other',
        value: 'other'
    }];

const useStyles = makeStyles({
    root: {
        width: 500,
        padding: 24,
        marginBottom: 100,
    }
});

const ClassificationSelection = ({index, label, value, check=false, onChange}) => {

    return (
        <div
            className='classification'
            onClick={(e) => {
                onChange(value);
                e.preventDefault();
            }}
        >
            <Radio
                checked={check}
                value={label}
            />
            <p>{label}</p>
            <div
                style={{
                    position: 'absolute',
                    border: 'solid 1px #ddd',
                    width: 24, height: 24,
                    right: -12,
                    top: 'calc(50% - 12px)',
                    backgroundColor: '#fff',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <p>{index===10 ? '-' : index}</p>
            </div>
            <style jsx>
                {
                    `
                        p {
                            margin: 0
                        }

                        .classification {
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            border: solid 1px #ddd;
                            border-radius: 4px;
                            position: relative;
                            margin-bottom: 12px;
                            cursor: pointer;
                        }

                        .classification:hover{
                            background-color: #f6f6f6
                        }
                    `
                }
            </style>
        </div>
    )
}

const Classification = () => {

    const [texts, setTexts] = useState([]);
    const [classes, setClasses] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [ selectedClass, setSelectedClass ] = useState('');

    const [currentText, setCurrentText] = useState(null);

    const selectedType = useSelector(state => state.files.selectedType);
    const selectedFileName = useSelector(state => state.files.selectedFileName);
    const currentUser = useSelector(state => state.user.username);

    useEffect(() => {
        if(isEmpty(selectedFileName) && isEmpty(selectedType)){
            return;
        }

        if(selectedType === 'annotation'){
            return;
        }

        selectedFileName && getFile(selectedFileName);
    }, [selectedType, selectedFileName]);

    useEffect(() => {
        console.log(currentText);
    }, [currentText]);

    useEffect(() => console.log(selectedClass), [selectedClass]);

    useEffect(() => {
        console.log('texts length', texts.length);

        if(texts.length > 0){
            setSelectedClass(selectedClass => classes[currentIndex]);
            setCurrentText(currentText => texts[currentIndex]);
        }
    }, [texts, currentIndex]);

    const getFile = (fileName) => {
        const data = {
            projectName: 'default',
            fileName,
            username: currentUser,
        };
    
        fetch(API_SERVER_ADDRESS + '/api/file/read', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.text())
        .then(processFileData);
    };

    const processFileData = (data) => {
        const _texts = [], _classes = [];

        map(data.split('\n'), row => {
            const [ text, annotation, className ] = row.split('\t');
            if(!isEmpty(text)){
                _texts.push(text);
                _classes.push(className);
            }
        });

        console.log('texts', _texts);
        console.log('classes', _classes);


        setClasses(classes => _classes);
        setTexts(texts => _texts);
    }

    const initData = () => {
        fetch('/classification_testset.tsv').then(res => res.text()).then(processFileData);
    };

    const fileUploadedHandle = e => {
        console.log(e.target.files);

        const fileReader = new FileReader();

        fileReader.onload = () => {
            processFileData(fileReader.result);
        }
        fileReader.readAsText(e.target.files[0]);

    }

    const saveCurrentText = () => {
        classes[currentIndex] = selectedClass;
        alert('saved');
        // setTexts([...texts])
    }

    const resetCurrentText = () => {
        setSelectedClass(classes[currentIndex]);
    }

    // const classes = useStyles();

    return (<>
        <div
            tabIndex="0"
            style={{display: 'flex', justifyContent: 'center', marginBottom: 200}}
            onKeyDown={e => {
                const { keyCode } = e;
                console.log(keyCode);
                if(keyCode >= 48 && keyCode <=57){
                    setSelectedClass(CLASSIFICATIONS[keyCode - 48].value);
                }

                if(keyCode === 189){
                    setSelectedClass(CLASSIFICATIONS[10].value);
                }
            }}
        >
            <Paper
                style={{
                    width: '80%',
                    padding: 24,
                    height: '100%',
                    overflowY: 'scroll'
                }}
            >
                <p style={{textAlign: 'justify'}}>
                    {currentText}
                </p>
                {
                    map(
                        CLASSIFICATIONS,
                        ({name, value}, index) => (
                            <ClassificationSelection
                                key={value}
                                index={index}
                                label={name}
                                value={value}
                                check={selectedClass===value}
                                onChange={setSelectedClass}
                            />
                        )
                    )
                }
            </Paper>
        </div>

        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                position: 'sticky',
                bottom: 0,
                left: 'calc(50vw + 120px)',
                backgroundColor: 'white'
            }}
        >
            <Button
                color='primary'
                variant='outlined'
                onClick={() => {
                    const data = `Action is an, originally Dutch, international discount store-chain, owned by the British private-equity fund 3i. It sells low budget, non-food and some food products with long shelf lives. Action operates stores in seven countries — Netherlands, Belgium, Germany, France, Austria, Luxembourg, Poland And Czech Republic.	action
                    An adventure is an exciting experience that is typically bold, sometimes risky, undertaking. Adventures may be activities with some potential for physical danger such as traveling, exploring, skydiving, mountain climbing, scuba diving, river rafting or participating in extreme sports.	adventure`
                    const url = URL.createObjectURL(new Blob([data], { type: 'text/tab-separated-values' }))
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'template.tsv');
                    link.click();
                }}
            >
                Template
            </Button>
            <IconButton onClick={saveCurrentText}>
                <CheckIcon style={{color:'green'}}/>
            </IconButton>
            <IconButton onClick={resetCurrentText}>
                <CloseIcon style={{color:'red'}}/>
            </IconButton>
            <IconButton
                disabled={currentIndex == 0}
                onClick={() => (currentIndex > 0) && setCurrentIndex(currentIndex - 1)}
            >
                <SkipPreviousIcon style={{color:'blue'}}/>
            </IconButton>
            <IconButton
                disabled={currentIndex >= size(texts)}
                onClick={() => (currentIndex < size(texts) - 1) && setCurrentIndex(currentIndex + 1)}
            >
                <SkipNextIcon style={{color:'blue'}}/>
            </IconButton>
        </div>
        <style jsx>
        {
            `
            ::-moz-selection { /* Code for Firefox */
                background: #ffe184;
            }
            
            ::selection {
                background: #ffe184;
            }
            
            div:focus {
                outline: none;
            }         
            `
        }
        </style>
    </>)
}

export default Classification;