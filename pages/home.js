import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Head from 'next/head';
import { isEmpty } from 'lodash';

import Annotation from 'components/annotation';
import Classification from 'components/classification';
import PageWithDrawer from 'components/PageWithDrawer';
import { useRouter } from 'next/router';
import { setUsername } from 'stores/userSlice';


const Home = () => {

    const dispatch = useDispatch();

    const [ currentComponent, setCurrentComponent ] = useState();

    const currentUser = (typeof window === undefined) ? '' : localStorage.getItem('currentUser');

    const router = useRouter();

    const selectedType = useSelector(state => state.files.selectedType);

    useEffect(() => {
        // dispatch(setUsername(currentUser));
    }, []);

    useEffect(() => {
        switch (selectedType) {
            case 'annotation':
                setCurrentComponent(<Annotation />);
                break;

            case 'classification':
                setCurrentComponent(<Classification />);
                break;
        }
    }, [selectedType]);

    if(isEmpty(selectedType)){
        router.push('/');
        return;
    }

    return (
        <React.Fragment>
            <Head>
                <title>Words</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
            </Head>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <PageWithDrawer user={currentUser}/>
                <div style={{flex: 1}}>
                    {currentComponent}
                </div>
            </div>
        </React.Fragment>
    )
}

export default Home;