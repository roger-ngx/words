import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Head from 'next/head';
import { isEmpty } from 'lodash';

import Annotation from 'components/annotation';
import Classification from 'components/classification';
import PageWithDrawer from 'components/PageWithDrawer';
import { useRouter } from 'next/router';


const Home = () => {

    const [ currentComponent, setCurrentComponent ] = useState();

    const router = useRouter();

    const selectedType = useSelector(state => state.files.selectedType);

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
                <PageWithDrawer />
                <div style={{flex: 1}}>
                    {currentComponent}
                </div>
            </div>
        </React.Fragment>
    )
}

export default Home;