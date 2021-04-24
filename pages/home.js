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

    const router = useRouter();

    const selectedType = useSelector(state => state.files.selectedType);

    useEffect(() => {
        const currentUser = (typeof window === undefined) ? '' : localStorage.getItem('currentUser');

        if(isEmpty(currentUser)){
            router.push('/');
            return;
        }

        dispatch(setUsername(currentUser));
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

    return (
        <React.Fragment>
            <Head>
                <title>Words</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
            </Head>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <PageWithDrawer />
                <div style={{flex: 1, marginTop: 32}}>
                    {currentComponent}
                </div>
            </div>
        </React.Fragment>
    )
}

export default Home;