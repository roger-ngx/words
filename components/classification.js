import React, { useState, useEffect } from 'react';
import { Paper, Button, IconButton, Radio, Typography } from '@material-ui/core';
import { map, isEmpty, size, forEach } from 'lodash';
import { useSelector } from 'react-redux';
import { API_SERVER_ADDRESS } from 'constants/defaults';

import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import { makeStyles } from '@material-ui/core/styles';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';

import AddNewClassDialog from '../dialogs/AddNewClassDialog';

const CLASSIFICATIONS = [
    {
        name: '💥 Action',
        value: 'action'
    },
    {
        name: '🌄 Adventure',
        value: 'adventure'
    },
    // {
    //     name: '😄 Comedy',
    //     value: 'comedy'
    // },
    // {
    //     name: '🎭 Drama',
    //     value: 'drama'
    // },
    // {
    //     name:'👪 Family film',
    //     value: 'family film'
    // },
    // {
    //     name: '💀 Horror',
    //     value: 'horror'
    // },
    // {
    //     name: '🔎 Mystery',
    //     value: 'mystery'
    // },
    // {
    //     name: '💞 Romance',
    //     value: 'romance'
    // },
    // {
    //     name: '👽 Science-Fiction',
    //     value: 'science-fiction'
    // },
    // {
    //     name: '🙈 Thriller',
    //     value: 'thriller'
    // },
    // {
    //     name: '🌌 Other',
    //     value: 'other'
    // }
];

const useStyles = makeStyles({
    root: {
        width: 500,
        padding: 24,
        marginBottom: 100,
    }
});

const ClassificationSelection = ({index, label, value, check=false, onChange, onDeleteClass}) => {

    return (
        <div className='containner'>
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
            </div>

            <div className='delete'>
                <IconButton onClick={() => onDeleteClass(index)}>
                    <RemoveCircleOutlineIcon />
                </IconButton>
            </div>
            <style jsx>
                {
                    `
                        p {
                            margin: 0
                        }

                        .delete{
                            display: none
                        }

                        .containner {
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            margin-bottom: 12px;
                        }
                        .containner:hover>.delete{
                            display: flex;
                        }

                        .classification {
                            display: flex;
                            flex: 1;
                            flex-direction: row;
                            align-items: center;
                            border: solid 1px #ddd;
                            border-radius: 4px;
                            position: relative;
                            cursor: pointer;
                            margin-right: 12px;
                            height: 48px;
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

    const [classifications, setClassifications] = useState(CLASSIFICATIONS);
    const [openClassInput, setOpenClassInput] = useState(false);
    const [texts, setTexts] = useState([]);
    const [classes, setClasses] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [ selectedClass, setSelectedClass ] = useState('');

    const [currentText, setCurrentText] = useState(null);

    const selectedType = useSelector(state => state.files.selectedType);
    const selectedFileName = useSelector(state => state.files.selectedFileName);
    const currentUser = useSelector(state => state.user.userInfo);
    const selectedProject = useSelector(state => state.files.selectedProject);

    useEffect(() =>{
        const classifications = JSON.parse(localStorage.getItem('userDefineClassificationss'));
        setClassifications(classifications || CLASSIFICATIONS);
    }, []);

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
            projectName: selectedProject,
            fileName,
            username: currentUser.username,
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
        // console.log('classification', data);
        const _texts = [], _classes = [];

        map(data.split('\n'), row => {
            const [ text, annotation, className ] = row.split('\t');
            console.log('className', className);
            if(!isEmpty(text)){
                _texts.push(text);
                _classes.push(className);
            }
        });

        // console.log('texts', _texts);
        // console.log('classes', _classes);


        setClasses(classes => _classes);
        setTexts(texts => _texts);
    }

    useEffect(() => {
        if(!isEmpty(classifications)){
            localStorage.setItem('userDefineClassificationss', JSON.stringify(classifications));
        }
    }, [classifications]);

    const onAddNewClass = newClass => {
        setClassifications([...classifications, {name: newClass, value: newClass}]);
        setOpenClassInput(false);
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
        saveEdittedFile();
    }

    const saveEdittedFile = () => {
        if(isEmpty(selectedFileName)){
            return;
        }

        var tsv = '';

        forEach(texts, (text, index) => {
            tsv += `\n${text}\t\t${classes[index]}`;
        })

        const data = new FormData();
        data.append('file', new Blob([tsv]));
        data.append('type', 'classification');
        data.append('projectName', selectedProject);
        data.append('fileName', selectedFileName);
        data.append('username', currentUser.username);

        fetch(API_SERVER_ADDRESS + '/api/file/upload', {
            method: 'POST',
            body: data,
            mode: 'cors'
        }).then(res => {
            alert('done');
        }).catch(console.log)
    }

    const resetCurrentText = () => {
        setSelectedClass(classes[currentIndex]);
    }

    const onDeleteClass = index => {
        classifications.splice(index, 1);
        setClassifications([...classifications]);
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
                    setSelectedClass(classifications[keyCode - 48].value);
                }

                if(keyCode === 189){
                    setSelectedClass(classifications[10].value);
                }
            }}
        >
            <Paper
                style={{
                    width: '80%',
                    padding: 24,
                    height: '100%',
                    overflowY: 'scroll',
                    border: '1px solid #eee'
                }}
                elevation={2}
            >
                <p style={{textAlign: 'justify'}}>
                    {currentText}
                </p>
                {
                    map(
                        classifications,
                        ({name, value}, index) => (
                            <ClassificationSelection
                                key={value}
                                index={index}
                                label={name}
                                value={value}
                                check={selectedClass===value}
                                onChange={setSelectedClass}
                                onDeleteClass={() => onDeleteClass(index)}
                            />
                        )
                    )
                }
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        cursor: 'pointer',
                        border: 'solid 1px #ddd',
                        borderRadius: 4,
                        alignItems: 'center',
                        padding: 10
                    }}
                    onClick={() => setOpenClassInput(true)}
                >
                    <AddCircleOutlineIcon style={{color: 'rgba(0, 0, 0, 0.54)', marginRight: 8}}/>
                    <Typography>Add a new class</Typography>
                </div>
            </Paper>
            {
                openClassInput &&
                <AddNewClassDialog
                    open={openClassInput}
                    setOpen={setOpenClassInput}
                    onAddNewClass={onAddNewClass}
                />
            }
        </div>

        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                position: 'fixed',
                bottom: 0,
                left: '50vw',
                backgroundColor: 'white',
                alignItems: 'center'
            }}
        >
            <Button
                color='primary'
                variant='outlined'
                onClick={() => {
                    const data = `Action is an, originally Dutch, international discount store-chain, owned by the British private-equity fund 3i. It sells low budget, non-food and some food products with long shelf lives. Action operates stores in seven countries — Netherlands, Belgium, Germany, France, Austria, Luxembourg, Poland And Czech Republic.\t\taction\nAn adventure is an exciting experience that is typically bold, sometimes risky, undertaking. Adventures may be activities with some potential for physical danger such as traveling, exploring, skydiving, mountain climbing, scuba diving, river rafting or participating in extreme sports.\t\tadventure`
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
            {`${currentIndex + 1}/${size(texts)}`}
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